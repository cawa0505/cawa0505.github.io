+++
title = "Rate Limits Are Runtime Reality: Building 429 Auto-Rotation into a Codebase Grapher"
date = 2026-08-04T00:01:00Z
description = "Graphify handles API rate limits as a runtime condition using multi-key rotation, immediate retries, and local-provider failover. This ensures continuous operation during 429 errors by dynamically switching keys and degrading gracefully to local models when needed."

[taxonomies]
tags = ["ai-infrastructure", "python", "reliability"]
+++

AI agents can't navigate a codebase they can't see. Give an agent a plain file tree and it will guess; give it a semantic graph of symbols, imports and call relationships, and it can plan before it reads. That's the problem [graphify](https://github.com/cawa0505/graphify-rust) exists to solve: turn a repository into a structural graph an LLM can reason over.

This post is the first of three about how it was built — reliability first, performance second, dogfooding third.

## Phase 1: the Python prototype

The first version was a Python toolchain: parse source into AST nodes, run a semantic pass over the graph with an LLM, emit a graph file the assistant consumes. It worked. Then it hit production reality: cloud LLM rate limits.

Calling a public API at any concurrency, 429s stop being an exception and become a steady-state signal. The naive fix — retry with sleep — makes the pipeline *predictable* in the worst way: every key exhausted means a serial pause, and every pause adds seconds to an interactive flow.

## 429 auto-rotation: the design

The Python version's answer was a rotation layer, later carried into the Rust rewrite as `AutoRotatePipeline`:

- **Multi-key rotation** — keys are pooled and picked with an atomic modulo counter. Rotation is O(1), thread-safe, and never blocks on a mutex around the choice itself.
- **Zero-sleep retry** — on a 429 the pipeline rotates to the next key immediately instead of sleeping. The cost of a busy rotate is far lower than a serial sleep, and with enough keys in the pool the pipeline keeps moving.
- **Provider failover** — the chain degrades deliberately: cloud keys first, then a local fallback ([Ollama](https://ollama.com) with a small local model). The pipeline never hard-stops on a cloud outage; it degrades to slower local inference instead of failing.

The lesson that shaped the whole project: **rate limits are not an edge case, they are a runtime condition.** Any tool that hits LLM APIs and doesn't model rotation, failover and degradation as first-class concerns will fall over exactly when a user needs it.

Phase 1 made graphify *reliable*. Phase 2, the Rust rewrite, made it *fast* — [read it here](/26x-faster-rewriting-the-codebase-grapher-in-rust/).

→ [graphify on GitHub](https://github.com/cawa0505/graphify-rust)
