+++
title = "Graphify Plugin Architecture Roadmap"
date = 2026-08-09T04:55:00+08:00
description = "Graphify's plugin system partitions into embedded v1 traits, in-development review pipeline, and planned MCP-native external layer. Core implements synchronous workspace routing with GraphifyPlugin trait, WorkspaceContext, and GraphUpdateEvent kinds. The external layer remains a roadmap for third-party plugins."

[taxonomies]
tags = ["rust", "architecture", "plugin-system", "graphify"]
+++

## Overview

Graphify's plugin architecture follows a strict two-layer separation: **Layer 1** (embedded v1 traits) is implemented, while **Layer 2** (external SDK) remains a roadmap for third-party ecosystem development. This design keeps the core contract separate from the external plugin protocol while maintaining a clear evolution path.

## Implemented: Embedded v1 Plugin Layer

### Core Contract
The v1 embedded plugin contract (`graphify-core/src/plugin.rs`) defines a dependency-free trait using only `std`. All embedded plugins implement:

- `get_id(&self) -> &str` — Unique plugin identifier (e.g., `"graphify-plugin-handoff"`)
- `bind(&mut self, ctx: WorkspaceContext)` — Workspace context binding
- `get_workspace_key(&self) -> &str` — Returns bound workspace key or empty string
- `sync_toon(&mut self, opt_toon: Option<Vec<u8>>) -> Vec<u8>` — Passive sync (consumes .toon) or proactive sync (produces output)
- `on_graph_updated(&mut self, _event: &GraphUpdateEvent)` — Default no-op hook

### Workspace Identity
`WorkspaceContext` provides routing identity with:
- `workspace_key` — Deterministic hash of workspace root path
- `workspace_name` — Human-readable workspace identifier
- `root_path` — Absolute filesystem root
- `timestamp` — Unix epoch seconds at creation

### Event System
`GraphUpdateEvent` carries graph changes with:
- `workspace_key` — Routing key
- `modified_nodes` — Affected node identifiers
- `event` — Trigger kind: `Indexed`, `Extracted`, or `Manual`

### Plugin Host
`graphify-cli/src/plugin_host.rs` manages bound plugins:
- Registration via `register()` method
- Broadcast of `GraphUpdateEvent` to all plugins
- Panic isolation via `catch_unwind` — failing plugins don't interrupt others
- No dynamic loading in v1

### Technical Constraints
- Zero external dependencies in core plugin contract
- Synchronous execution only
- Workspace key routing ensures deterministic plugin isolation
- Default hook implementation maintains backward compatibility

## In Development: Review Pipeline

### graphify-plugin-review
The review plugin implements topology-aware code review:

1. **Git diff extraction** — Identifies modified files and symbols
2. **BFS blast radius trace** — Calculates upward/downward impact chains
3. **TOON subgraph generation** — Creates blast radius sub-graphs
4. **AI semantic review** — Feeds subgraphs to AI reviewers

### Workflow
```
Git Diff → Modified Symbols → Graphify BFS Trace → Blast Radius Sub-graph (.toon) → AI Code Reviewer Prompt
```

### Current State
The plugin exists but the full semantic review flow (Git diff → symbols → topology → TOON → semantic review) remains in development. The plugin is bound to workspaces via the v1 trait and receives graph-update events through the PluginHost.

## Planned: External MCP-Native Layer

### Two Distinct Layers
**External Layer** (roadmap) vs **Embedded Layer** (implemented):

| Aspect | Embedded (v1) | External (roadmap) |
|--------|---------------|-------------------|
| Location | In-process Rust crate | Subprocess spawned by Graphify Core |
| Language | Rust only | Any language |
| Transport | Direct method calls | Stdio + JSON-RPC (MCP-native) |
| Use case | Core-internal extension | Community third-party plugins |

### Planned Components

#### 1. MCP-Native Plugin Gateway
- **graphify-mcp unified gateway** — Single MCP server for external plugins
- **Stdio + JSON-RPC transport** — Language-agnostic plugin interface
- **Tool registration** — External plugins expose tools through MCP's `tools/list`
- **Mode 1 (Unified Gateway)** — graphify-mcp acts as MCP client, spawns plugins, aggregates tools

#### 2. Polyglot SDKs
- **TypeScript/Node.js** — Primary target for OpenCode plugins and editor integrations
- **Python** — For `graphify-plugin-opendoc` (vector retrieval, LangChain/LlamaIndex)
- **Rust** — Native speed, internal plugins, adapter reference implementation
- **PHP** — Composer-managed PHP plugin SDK (deferred)

#### 3. Plugin Lifecycle Management
- **Lazy spawn** vs **eager startup** configuration
- **Crash/restart handling** — Plugin lifecycle monitoring
- **Protocol versioning** — Semver for JSON-RPC schema
- **Tool prefix strategy** — `graphify_<plugin>_<tool>` naming

### Technical Roadmap

#### Phase 1: Core Interface
- Finalize external protocol specification
- Implement MCPPluginAdapter bridge (if unification desired)
- Define JSON-RPC method contracts independent of v1 trait

#### Phase 2: Review & Handoff
- Complete graphify-plugin-review pipeline
- Implement graphify-plugin-handoff with .toon sub-graph export
- Add graphify-plugin-opendoc vector integration

#### Phase 3: External SDK (Deferred)
- Ship TypeScript/Node.js SDK first
- Implement Python SDK for document processing
- Add Rust adapter for external plugin compatibility

## Dogfood: cawa0505.github.io Editorial Workflow

This cawa0505.github.io site can leverage Graphify topology to supply bounded code context for articles. The editorial workflow would:

1. **Extract workspace topology** — Use Graphify to analyze repository structure
2. **Generate bounded context** — Create TOON subgraphs representing relevant code sections
3. **Supply to AI reviewers** — Feed topology to semantic review pipeline for technical accuracy
4. **Maintain manual verification** — Facts remain manually verified, with performance/model benchmarks separate from executable milestones

### Example Integration
When publishing architecture articles, the workflow could:
- Extract the target repository's graph using `graphify extract`
- Query specific modules or components using `graphify query`
- Generate blast radius sub-graphs for impacted areas
- Supply bounded context to AI for technical review

## Thesis: Structural Facts vs Semantic Interpretation

Graphify computes explicit **structural relationships** that should not be left to guesswork:
- Symbol and file relationships
- Call graph and impact-radius traversals
- Deterministic workspace-key derivation from the workspace root

LLMs later interpret **bounded semantic context** derived from these facts. Performance/model benchmarks remain separate from executable milestones, ensuring factual accuracy precedes semantic interpretation.

## External Links

- [GraphifyRust GitHub](https://github.com/cawa0505/graphify-rust)
- [Plugin System Documentation](https://github.com/cawa0505/graphify-rust/blob/main/docs/plugin_system.md)
- [Plugin SDK Roadmap](https://github.com/cawa0505/graphify-rust/blob/main/docs/plugin-sdk-roadmap.md)

## Conclusion

Graphify's plugin architecture maintains a clean separation between implemented embedded v1 traits and planned external MCP-native layer. The current implementation provides a solid foundation for internal extensions while leaving the external plugin ecosystem as a deliberate roadmap item. This approach ensures core stability while enabling future polyglot plugin development.

The system demonstrates that **Rust computes structural facts that should not be guessed**; LLMs later interpret bounded semantic context. This philosophy ensures factual accuracy while enabling powerful AI-assisted workflows.
