+++
title = "Relay: Cross-session State Handoff as a Graphify Plugin"
date = 2026-08-09T18:44:03+08:00
description = "The code-relay-mcp concept evolved into graphify-plugin-handoff — a Graphify embedded plugin that implements the GraphifyPlugin trait for cross-session agent state handoff, eliminating the standalone MCP server in favour of in-process integration with Graphify Core."

[taxonomies]
tags = ["rust", "graphify", "plugin", "ai-infrastructure"]
+++

The repository originally published as [code-relay-mcp](/code-relay-mcp-cross-session-state-handoff/) has been renamed to [graphify-plugin-handoff](https://github.com/cawa0505/graphify-plugin-handoff) and re-architected from a standalone Rust MCP server into a Graphify **embedded plugin**. This article documents the actual implementation.

<!-- more -->

## What changed and why

The early concept proposed a standalone native-Rust MCP server communicating via stdio JSON-RPC. As the [Graphify plugin architecture](/graphify-plugin-architecture-roadmap/) matured, it became clear that embedding the relay logic directly into Graphify Core would eliminate inter-process overhead while preserving every original design goal — stateful caching, hybrid memory, and atomic writes.

The key shift: instead of a separate binary that Graphify spawns and talks to over JSON-RPC, the relay functionality now ships as a single Rust crate (`lib.rs`) that Graphify Core embeds and loads at startup. The `relay*` tools are auto-registered by GraphifyMCP when Graphify starts — no extra process, no extra binary to deploy.

## Implemented architecture

### Embedded plugin contract

The crate implements the `GraphifyPlugin` trait defined in Graphify Core (`graphify-core/src/plugin.rs`). The v1 embedded plugin contract is dependency-free, using only `std`:

- `get_id(&self) -> &str` — returns `"graphify-plugin-handoff"`
- `bind(&mut self, ctx: WorkspaceContext)` — workspace context binding
- `get_workspace_key(&self) -> &str` — returns bound workspace key or empty string
- `sync_toon(&mut self, opt_toon: Option<Vec<u8>>) -> Vec<u8>` — passive sync (consumes .toon) or proactive sync (produces output)
- `on_graph_updated(&mut self, _event: &GraphUpdateEvent)` — default no-op hook

### Workspace identity

`WorkspaceContext` provides routing identity:

- `workspace_key` — deterministic hash of workspace root path
- `workspace_name` — human-readable workspace identifier
- `root_path` — absolute filesystem root
- `timestamp` — Unix epoch seconds at creation

This is a significant improvement over the original concept. The standalone MCP server would have had to discover the workspace root by walking the disk tree on every invocation. As an embedded plugin, the workspace root is resolved exactly once during `GraphifyPlugin::bind` (via the injected `WorkspaceContext`) and cached in memory. Subsequent operations complete under 1 ms.

### Plugin host integration

`graphify-cli/src/plugin_host.rs` manages bound plugins:

- Registration via `register()` method
- Broadcast of `GraphUpdateEvent` to all plugins
- Panic isolation via `catch_unwind` — failing plugins don't interrupt others
- No dynamic loading in v1

### Hybrid double-track memory

The original concept's memory design carried over intact:

- **Short-term memory**: Fast, deterministic state handoff using the token-efficient TOON (Token-Oriented Object Notation) format in `.relay/relay.toon`.
- **Long-term memory**: Semantic vector search utilizing Qdrant for RAG-assisted retrieval of historical session decisions.

### Atomic operations

Transactional file-writing using temp-swapping via `fs2` locks prevents state corruption across concurrent sessions — same as the original concept, now executing in-process.

## Workspace-aligned plugin ecosystem

Plugins (handoff, review, opendoc, …) are aligned by `workspace_key` injected by Graphify (graphify-core v1 contract). No per-plugin walk-up, no divergent root discovery. This is a structural advantage the standalone MCP server concept could not offer — every plugin in the ecosystem shares the same workspace identity without redundant discovery.

## Backward compatibility

This crate is the Rust-native evolution of the legacy Node.js plugin. Backward compatibility with the `npx opencode-code-relay-plugin <command>` flow is **\[待討論 / under discussion\]** — see `openspec/changes/rust-mcp-migration/tasks.md` in the repository.

## Relationship with the original concept

| Aspect | Original concept (code-relay-mcp) | Implementation (graphify-plugin-handoff) |
|--------|----------------------------------|------------------------------------------|
| Architecture | Standalone MCP server | Graphify embedded plugin |
| Transport | stdio JSON-RPC | Direct method calls (in-process) |
| Workspace discovery | Walk disk tree per invocation | Injected via `WorkspaceContext` at `bind` |
| Binary | Separate binary to deploy | Single crate loaded by Graphify Core |
| Tool registration | MCP `tools/list` over JSON-RPC | Auto-registered by GraphifyMCP at startup |
| Plugin isolation | Process-level | `catch_unwind` panic isolation |
| Memory design | TOON + Qdrant (unchanged) | TOON + Qdrant (unchanged) |
| Atomic writes | `fs2` locks (unchanged) | `fs2` locks (unchanged) |

The core ideas — stateful caching, hybrid double-track memory, and atomic writes — survived the architecture shift unchanged. What changed is the delivery mechanism: from a standalone process to an embedded crate.

## Attribution

The concept of Code Relay is inspired by and based on the original [code-relay](https://github.com/yan5xu/code-relay) project by yan5xu. The graphify-plugin-handoff repository evolves that concept into a stateful, high-performance embedded plugin architecture for the Graphify ecosystem.

## Links

- Repository: <https://github.com/cawa0505/graphify-plugin-handoff>
- Early concept article: [Code Relay MCP: Early Concept for Cross-Session State Handoff](/code-relay-mcp-cross-session-state-handoff/)
- Graphify plugin architecture roadmap: [Graphify Plugin Architecture Roadmap](/graphify-plugin-architecture-roadmap/)
- License: MIT