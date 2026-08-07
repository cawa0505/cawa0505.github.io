+++
title = "code-relay-mcp: Cross-Session State Handoff in a Rust Binary"
date = 2026-07-31T00:00:00Z
description = "A native-Rust MCP server for durable cross-session and cross-repository handoffs, with cached workspace discovery and atomic state writes."

[taxonomies]
tags = ["rust", "ai-infrastructure"]
+++

[code-relay-mcp](https://github.com/cawa0505/code-relay-mcp) is a native-Rust MCP server that manages cross-session, cross-repository handoffs for coding agents. It is the engine behind the code-relay workflow, replacing the old Node.js `@jimmyyen/opencode-code-relay-plugin` while keeping 100% backward compatibility — existing workflows and prompts keep working, they just get faster underneath.

<!-- more -->

## What it does

When an agent session ends, its state (active phase, decisions, next-step pointers) needs to survive into the next session. Code relay persists that as a structured handoff document and makes it resumable. The Rust server adds three things the Node.js version lacked:

- **Stateful memory caching** — the workspace root is discovered exactly once at initialization and cached in memory; subsequent operations complete under 1 ms instead of walking the disk tree every call.
- **Hybrid double-track memory** — short-term state handoff in `.relay/relay.toon` (Token-Oriented Object Notation), long-term semantic retrieval through Qdrant for RAG-assisted recall of past session decisions.
- **Atomic writes** — transactional temp-swap file writes under `fs2` locks, so concurrent tasks can't corrupt the relay state.

The target profile: a single binary under 10 MB with near-zero memory footprint.

## Backward compatibility

A zero-dependency slim JS wrapper re-exports the old `npx opencode-code-relay-plugin <command>` entry point; the wrapper transparently delegates execution to the Rust binary. CI pipelines and AI prompts that reference the old plugin never notice the swap — they just get a ~100x faster cold start (project-reported; the Node.js version pays a runtime boot per invocation, the Rust binary does not).

## Architecture

`openspec/` holds the requirements and architecture decisions: MCP stdio JSON-RPC transport (works with OpenCode, Cursor, Claude Desktop, Roo Code), the TOON handoff format, and the Qdrant long-term memory layer. The concept builds on the original [code-relay](https://github.com/yan5xu/code-relay) by yan5xu, evolved into a stateful, high-performance MCP architecture.

Repo: <https://github.com/cawa0505/code-relay-mcp> — MIT.
