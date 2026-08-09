+++
title = "Code Relay MCP: Early Concept for Cross-Session State Handoff"
date = 2026-07-31T00:00:00Z
description = "Early concept for a standalone native-Rust MCP server handling cross-session and cross-repository agent state handoff. The repository later shifted to a Graphify embedded plugin architecture — see the companion article for the actual implementation."

[taxonomies]
tags = ["rust", "ai-infrastructure", "design-concept"]
+++

> **Migration note**: The repository originally linked here as `code-relay-mcp` has been renamed to [graphify-plugin-handoff](https://github.com/cawa0505/graphify-plugin-handoff) and re-architected as a Graphify embedded plugin rather than a standalone MCP server. This article is preserved as the early concept write-up. For the actual implementation, see [Relay: Cross-session State Handoff as a Graphify Plugin](/graphify-plugin-handoff-cross-session-state/).

The original concept proposed a native-Rust MCP server that manages cross-session, cross-repository handoffs for coding agents. It was envisioned as the engine behind the code-relay workflow, replacing the old Node.js `@jimmyyen/opencode-code-relay-plugin` while keeping 100% backward compatibility — existing workflows and prompts would keep working, just faster underneath.

<!-- more -->

## What it set out to do

When an agent session ends, its state (active phase, decisions, next-step pointers) needs to survive into the next session. Code relay persists that as a structured handoff document and makes it resumable. The concept aimed to add three things the Node.js version lacked:

- **Stateful memory caching** — the workspace root would be discovered exactly once at initialization and cached in memory; subsequent operations would complete under 1 ms instead of walking the disk tree every call.
- **Hybrid double-track memory** — short-term state handoff in `.relay/relay.toon` (Token-Oriented Object Notation), long-term semantic retrieval through Qdrant for RAG-assisted recall of past session decisions.
- **Atomic writes** — transactional temp-swap file writes under `fs2` locks, so concurrent tasks can't corrupt the relay state.

The target profile: a single binary under 10 MB with near-zero memory footprint.

## Backward compatibility (as conceived)

A zero-dependency slim JS wrapper would re-export the old `npx opencode-code-relay-plugin <command>` entry point; the wrapper would transparently delegate execution to the Rust binary. CI pipelines and AI prompts that reference the old plugin would never notice the swap — they would just get a ~100x faster cold start (project-reported; the Node.js version pays a runtime boot per invocation, the Rust binary does not).

## Architecture (as conceived)

`openspec/` holds the requirements and architecture decisions: MCP stdio JSON-RPC transport (works with OpenCode, Cursor, Claude Desktop, Roo Code), the TOON handoff format, and the Qdrant long-term memory layer. The concept builds on the original [code-relay](https://github.com/yan5xu/code-relay) by yan5xu, evolved into a stateful, high-performance MCP architecture.

## Why the concept evolved

The standalone MCP server approach would have required deploying and maintaining a separate binary alongside Graphify. As the Graphify plugin architecture matured, it became clear that embedding the relay logic directly into Graphify Core as a plugin trait implementation would eliminate the inter-process overhead while preserving all the original design goals — stateful caching, hybrid memory, and atomic writes. The repository was renamed to [graphify-plugin-handoff](https://github.com/cawa0505/graphify-plugin-handoff) to reflect this shift.
