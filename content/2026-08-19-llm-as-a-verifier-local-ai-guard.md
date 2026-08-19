+++
title = "Poor Man's LLM-as-a-Verifier: 16GB GPU + ROCm for Zero-Cost Local Agent Guardrails"
date = 2026-08-19T05:55:10Z

[taxonomies]
tags = ["llm", "ai", "rocm", "amd", "verifier", "guardrail", "rust"]
+++
# Poor Man's LLM-as-a-Verifier: 16GB GPU + ROCm for Zero-Cost Local Agent Guardrails

**TL;DR:** This article is for developers who don't want to burn money on cloud API bills and are afraid of autonomous coding agents blindly refactoring their codebase into oblivion. We'll build a local, zero-cost AI exoskeleton with a 16GB AMD GPU, Linux ROCm (HIP) acceleration, and a deterministic 2PC guard rail written in Rust — matching the spec of production-grade PRM (Process Reward Model) systems.

## 1. The Pain: Agent Fever Meets Bill Shock and Code Destruction

Autonomous coding agents (OpenCode, Claude Code, etc.) have fundamentally changed how we write software. But they come with two nightmares:

- **Token black hole & API bill shock**: To maintain code quality, agents need extensive self-reflection, Best-of-N comparisons, and long-chain repair. A few rounds of dialogue later, your cloud API bill is through the roof.
- **Non-determinism**: An agent without guardrails is a race car without a steering wheel — it might silently mutate global interfaces, corrupt your DB schema, or hallucinate syntax errors.

**The fix**: We need a Verifier (process supervisor). But production papers routinely use A100 clusters with vLLM pre-allocating tens of GB of VRAM — costs most developers can't justify. We need a poor man's Process Supervision system that runs smoothly on a single 16GB consumer GPU.

## 2. Hardware & Driver Layer: Why 16GB AMD + ROCm (HIP)?

On a Homelab / Linux (CachyOS) setup, pairing a Radeon RX 9060 XT 16GB with the ROCm backend is the sweet spot for cost-performance:

- **HIP matrix acceleration & VRAM throughput**: ROCm's native HIP acceleration lets 16GB VRAM comfortably handle Qwen3.5-9B with mmproj (code semantics + multimodal vision).
- **Escaping the vLLM VRAM trap**: vLLM's 90% pre-allocation policy is a disaster on a single multi-tasking machine. Switch to the ROCm build of llama-server (GGUF quantization). Model weights consume only 5–9 GB of VRAM, leaving room for dynamic KV cache allocation while the host runs other services.
- **Zero API cost**: Triggering 10,000 `/v1/directed` scoring calls through the 2PC (two-phase commit) gate costs nothing more than pocket change in electricity. Token anxiety gone.

## 3. Architectural Philosophy: The Tri-Layer Deterministic Harness

The core idea: **demote the LLM from a system-write-privileged executor to an intern who must submit legitimate proposals.**

```
┌────────────────────────────────────────────────────────────────────────┐
│ omo-slim / OpenCode Orchestrator                                       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ 1. 2PC Proposal (Diff / AST Delta)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ guardrail-mcp (Deterministic 2PC Gateway)                              │
│                                                                        │
│  Track 1: Hard Guard (Rust / graphify-core AST structural check)       │
│  └── Millisecond short-circuit — syntax errors / violations rejected   │
│      instantly (0 VRAM usage)                                          │
│                                                                        │
│  Track 2: Soft Guard (Local multimodal semantic review)                │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ 2. POST /v1/directed
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ docker-llm-as-a-verifier (Local ROCm Backend / llama-server)           │
│ └── Unsloth Qwen3.5 9B VL / Qwen2.5-Coder 7B (GGUF)                   │
└────────────────────────────────────────────────────────────────────────┘
```

- **graphify (AST & Context Manager)**: Written in Rust. Handles code topology analysis and dynamic token pruning — feeds only the minimal sub-graph with the highest information density to the agent.
- **guardrail-mcp (State Machine & 2PC Gateway)**: An independent MCP guard. Enforces two-phase commit (Phase 1: Proposal → Phase 2: Guard Check → Issue commit_token).
- **docker-llm-as-a-verifier (PRM Evaluation Server)**: A Docker-packaged local review container. Accelerated by ROCm, providing fine-grained scoring.

## 4. Implementation Breakdown: REST API Spec Aligned with Production PRM

`docker-llm-as-a-verifier` exposes 7 complete REST API endpoints implementing high-level Process Supervision primitives:

| Endpoint | Method | 2PC Use Case |
|----------|--------|-------------|
| `/v1/directed` | POST | **[Core]** Given the original task, compare old code A vs fixed code B, return Preference Score and accepted flag |
| `/v1/select` | POST | **[Best-of-N]** Pick the highest-scoring, safest AST change from N agent-generated proposals |
| `/v1/track` | POST | **[Trajectory Monitor]** Evaluate progress after each action. Short-circuit if the agent is making things worse |
| `/v1/compare` | POST | Quick A/B Testing: pairwise scoring |
| `/v1/score-pairs` | POST | Batch regression testing and evaluation |
| `/health` | GET | System health check |
| `/v1/usage` | GET | Local token accumulation statistics |

## 5. Real-World Closure: From Proposal Interception to Micro-Patching

When the agent proposes a code change with hidden risks, the defensive closure works like this:

1. Coder Agent submits a change proposal.
2. `guardrail-mcp` triggers Track 1: `graphify-core` scans and detects an interface discontinuity.
3. If Track 1 passes, Track 2 fires: HTTP POST to the Docker `/v1/directed` endpoint (ROCm 9B VL).
4. Verifier returns REJECTED with this payload:
   ```json
   {
     "status": "REJECTED",
     "reason": "Signature mismatch on UserRepositoryInterface",
     "ast_node_id": "Node#402"
   }
   ```
5. The orchestrator captures `ast_node_id` and instructs the agent to perform a local micro-patch targeting only `Node#402` — no full-file re-reads!

**Dual verification bonus**: UI changes can be further validated by Qwen3.5 9B VL reviewing Playwright rendering screenshots (Visual Guard), ensuring no layout breakage or CSS regressions.

## 6. Conclusion: Take Control and Compute Back to the Edge

You don't need a hundred-thousand-dollar A100 cluster. You don't need to pay monthly tribute to cloud API giants. With a Rust-based deterministic graph, a 2PC state-machine guard, and an AMD ROCm-powered local multimodal verifier, we've built a fully private, zero-leakage AI exoskeleton with production-grade PRM capability — all on a sub-$500 consumer GPU.

**Open-source repositories:**
- 2PC guard gate: [github.com/cawa0505/guardrail-mcp](https://github.com/cawa0505/guardrail-mcp)
- Local verifier container: [github.com/cawa0505/docker-llm-as-a-verifier](https://github.com/cawa0505/docker-llm-as-a-verifier)
