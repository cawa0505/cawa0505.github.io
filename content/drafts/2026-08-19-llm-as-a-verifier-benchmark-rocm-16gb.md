+++
title = "Local LLM-as-a-Verifier on a 16GB ROCm GPU: Real Benchmark Data"
date = 2026-08-19T06:47:43Z
draft = true

[taxonomies]
tags = ["llm", "benchmark", "rocm", "amd", "verifier", "guardrail", "performance"]
+++
**TL;DR:** I benchmarked the local LLM-as-a-Verifier setup running Qwen3.5-9B (Q4_K) on a single 16GB AMD GPU via ROCm. The verifier processes a code comparison in ~0.5–2s at 66% cache hit rate, correctly scoring valid code changes at 1.0 and invalid ones at 0.0–0.14. The 16GB card handles the 9B model comfortably, leaving headroom for other services.

This article is a follow-up to the [architecture overview](https://cawa0505.github.io/llm-as-a-verifier-local-ai-guard/) and the [Docker packaging guide](https://cawa0505.github.io/packaging-llm-as-a-verifier-docker/). Those articles described the _what_ and _how_ — this one provides the measured _how well_.

<!-- more -->

## 1. The Setup

The benchmark runs against a production-like deployment on a homelab Linux (CachyOS) machine:

| Component | Detail |
|-----------|--------|
| **GPU** | AMD 16GB (15.9 GiB) via ROCm |
| **Model** | Qwen3.5-9B (8.95B params, Q4_K ~5.7GB GGUF) |
| **Backend** | llama.cpp (llama-server, ROCm HIP build) on 192.168.77.185:8081 |
| **Verifier** | Docker container (llm-verifier), port 8010, local network |
| **Model VRAM** | ~10.2 GB loaded (model + dynamic KV cache) |
| **GPU util** | 78% during verification |
| **System RAM** | 62 GB; 27 GB in use (9.3 GB swap used) |
| **Context window** | 131,072 tokens |
| **MIN_SCORE** | 0.8 |

The backend runs on a separate machine connected via a local Gigabit network. The verifier container communicates with the llama.cpp backend over HTTP.

## 2. What the Verifier Does

The `docker-llm-as-a-verifier` service wraps the [LLM-as-a-Verifier](https://github.com/llm-as-a-verifier/llm-as-a-verifier) research library. It reads token-level log probabilities for ordered score tokens and turns that distribution into a continuous reward.

The container exposes 7 HTTP endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Service health and model info |
| `/v1/compare` | POST | Score two candidate solutions |
| `/v1/select` | POST | Best-of-N selection |
| `/v1/track` | POST | Agent trajectory scoring |
| `/v1/directed` | POST | Directed (A→B) preference comparison |
| `/v1/score-pairs` | POST | Batch pairwise scoring |
| `/v1/usage` | GET | Accumulated token statistics |

The comparison endpoint is the core primitive. Each `/v1/compare` call makes 3 LLM inference requests: one to score candidate A, one to score candidate B, and one to compare the two scores and produce a verdict.

## 3. Benchmark Results

### 3.1 Latency

Measured from the verifier's own log timestamps — each timestamp is the HTTP response from the backend (llama.cpp):

| Operation | Backend Calls | Total Time | Per-Call Time |
|-----------|:---:|:----------:|:-------------:|
| Compare (simple) | 3 | ~1,000 ms | ~330 ms |
| Compare (with cache) | 3 | ~800 ms | ~270 ms |
| Select (N=3, pivots=2) | 6 | ~1,200 ms | ~200 ms |
| Individual inference | 1 | 200–800 ms | 200–800 ms |

The cache hit rate is **66.4%** — 22,417 cached tokens out of 33,768 prompt tokens across 80 requests. The verifier's `fine_grained_reward` module caches scoring results on disk (the `verifier-cache` Docker volume), so repeated comparisons of the same code snippets bypass the LLM entirely.

### 3.2 Scoring Quality

Across the benchmark session, the verifier produced consistent scores:

| Candidate | Score | Verdict |
|-----------|:-----:|:-------:|
| Correct code (match) | 0.97–1.0 | ACCEPTED |
| Obvious bug | 0.0–0.02 | REJECTED |
| Subtle bug | 0.02–0.14 | REJECTED |

With `MIN_SCORE=0.8`, even the best incorrect candidate (0.14) is correctly rejected. The score distribution shows a clean separation between correct and incorrect — no ambiguous cases near the boundary.

### 3.3 Token Usage

Over 80 verifier requests (the benchmark session):

| Metric | Value |
|--------|-------|
| Total prompt tokens | 33,768 |
| — Cached | 22,417 (66.4%) |
| Total completion tokens | 47,538 |
| Total tokens | 81,306 |
| Reasoning tokens | 0 (Qwen, not R1) |
| Backend requests | 80 |

The 0 reasoning tokens confirm the model is Qwen3.5-9B (a dense model, not a reasoning/R1 model). The verifier uses the model's direct log-probability output, not chain-of-thought.

### 3.4 VRAM & GPU Utilization

On the 16GB AMD GPU:

| Resource | Value |
|----------|-------|
| VRAM total | 15.9 GiB |
| VRAM used | 10.2 GiB (64% of total) |
| GPU utilization | 78% |
| Context window | 131,072 tokens |

The 9B model at Q4_K fits comfortably with ~5.7 GB headroom for KV cache and other workloads. The 131K context window is a llama.cpp default — the verifier's actual prompt sizes are much smaller (~400–800 tokens per comparison).

## 4. Architecture: What Actually Runs

The production pipeline is simpler than the full architecture diagram in the first article:

```
Agent (OpenCode)
  │ Submit change proposal
  ▼
guardrail-mcp (MCP server)
  │ commit_token → validate → consume
  │ apply_patch (cargo check / tsc syntax validation)
  │ softguard (HTTP → verifier)
  ▼
llm-verifier (Docker :8010)
  │ POST /v1/directed (compare old vs new code)
  ▼
llama.cpp (ROCm, cybertron :8081)
  │ Qwen3.5-9B Q4_K inference
```

The guardrail-mcp provides:
- **`commit_token`**: 2PC lifecycle (create → validate → consume → revoke), SHA-256 proposal binding, 30-min TTL, git revision binding
- **`apply_patch`**: Patch application with compiler verification (cargo check / tsc) before write
- **`inspect_context`**: Tree-sitter structural extraction for context-aware patches
- **`softguard`**: HTTP verifier runner with configurable endpoints, timeout, and API key

The key insight: the LLM verifier runs as a **soft guard** — it catches semantic bugs that syntax checking misses. Syntax validation (`cargo check` / `tsc`) runs first as a cheap deterministic gate. Only proposals that pass syntax get sent to the LLM verifier for semantic review.

## 5. Limitations

These numbers are from a single-session benchmark, not a formal evaluation suite:

- **No batch throughput test**: The 80 requests were sequential, not concurrent. True TPS under load would be lower.
- **No cloud baseline**: The OpenRouter free route was not benchmarked. A direct comparison between local ROCm and cloud API remains to be done.
- **No VL data**: The multimodal vision endpoint (9B VL) is still in development. These numbers are for the text-only code comparison path.
- **No Track 1 short-circuit rate**: The AST-level structural check described in the first article is aspirational. The current guardrail-mcp uses syntax validation (cargo check / tsc) as its deterministic gate, not a dedicated AST structural checker.
- **No cost-per-request**: The 0.5–2s per comparison at 78% GPU utilization implies ~0.2–0.5 cents per request in electricity (at 250W system power), but this is a rough estimate, not a metered measurement.

## 6. Conclusion

The local LLM-as-a-Verifier setup works on a single 16GB AMD GPU:

- **Qwen3.5-9B Q4_K** fits comfortably with headroom (10.2 GB / 15.9 GB)
- **Compare latency**: ~0.5–2s — fast enough for interactive guardrail use
- **Cache hit rate**: 66% — repeated comparisons are nearly free
- **Score quality**: Clean separation between correct (1.0) and incorrect (0.0–0.14)

The setup costs about $1,000 (the GPU) and runs on a standard Linux machine with ROCm. No cloud API keys, no monthly bills, no data leakage.

The next step is to benchmark the OpenRouter free route as a cloud baseline and measure concurrent throughput under load. But even without that comparison, the local path is already practical for daily use.

**Repositories:**
- Verifier Docker packaging: [github.com/cawa0505/docker-llm-as-a-verifier](https://github.com/cawa0505/docker-llm-as-a-verifier)
- 2PC guard gate: [github.com/cawa0505/guardrail-mcp](https://github.com/cawa0505/guardrail-mcp)
- Architecture overview: [Poor Man's LLM-as-a-Verifier](https://cawa0505.github.io/llm-as-a-verifier-local-ai-guard/)
