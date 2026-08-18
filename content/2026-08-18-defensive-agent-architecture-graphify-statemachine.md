+++
title = "Our Pain with AI Coding Agents: Two Tools We Built to Stop Them from Breaking Things"
date = 2026-08-18
[taxonomies]
tags = ["Rust", "AI", "MCP", "open-source", "tools"]
+++

<iframe src="/defensive-agent-architecture-deck/" width="100%" height="500" style="border:1px solid rgba(255,255,255,0.1); border-radius:12px; margin-bottom:32px;" title="Defensive Agent Architecture slides"></iframe>

What's the biggest problem with using AI to write code? For us, it's not that the models aren't smart enough — it's that **we can't trust them**.

- LLM tokens keep getting more expensive, but most of them go toward re-reading code structure the agent already saw.
- The agent edits a file, the compiler screams, and it takes 3-4 rounds to get a clean compile.
- Halfway through a task, context runs out. New session starts from scratch — everything is forgotten.
- Sometimes broken code hits the filesystem before anyone notices.

These are probably not unique to us. Our approach was to build two small tools — one for **input cost**, one for **operation safety** — connected to OpenCode via MCP. Each does exactly one thing.

<!-- more -->

## Tool 1: GraphifyRust — Stop Paying to Re-read the Same Code

[GraphifyRust](https://github.com/cawa0505/graphify-rust) is a static analysis engine written in Rust. It parses source code with Tree-sitter, extracts declarations (functions, structs, traits), and builds a directed graph.

### Why?

When an AI agent needs to modify code, the naive approach is to dump the entire file into the LLM. A few hundred lines might have only 2-3 relevant functions, but the LLM still pays to read all the imports, comments, and unrelated logic.

Graphify's `skeleton_extract` returns only the AST skeleton — function names, line numbers, signatures. Real compression numbers:

| File | Raw tokens | Skeleton tokens | Savings |
|------|-----------|----------------|---------|
| `server.go` | 1,289 | 117 | **90.9%** |
| `toon.rs` | 2,132 | 147 | **93.1%** |

When the skeleton isn't enough, use `range` mode to read specific function bodies. No need to dump the whole file.

### Technical Choices

Rust because Tree-sitter's Rust bindings are the most mature. On a 110-file, 422-edge test project, building the knowledge graph takes **16ms** — 26x faster than the Python predecessor.

Nodes and edges use petgraph arena pre-allocation to avoid heap fragmentation. Output uses .toon (Token-Oriented Object Notation), replacing JSON's repeated keys with header-declared columns, cutting file size by 60%.

Semantic search runs on local Qdrant — zero cloud API cost. Currently supports 9 languages: Rust, Python, Go, JavaScript, TypeScript, C, C++, Java, PHP, Swift.

## Tool 2: StateMachineMcp — Never Let Broken Code Hit Disk

[StateMachineMcp](https://github.com/cawa0505/statemachine-mcp) is a Go MCP server that acts as a safety gate: every code modification must pass a state machine check before touching the filesystem.

### Phase Gate

Each task has four phases:

```
INIT → PLANNING → EXECUTING → VERIFYING → COMPLETED
```

You can only call `apply_patch` during `EXECUTING`. Call it during `PLANNING` and it's rejected. Three consecutive failures auto-pause the task for human review.

### Double Buffer + Compiler Verify

Simple but effective:

1. Agent submits a patch (exact search block + replacement).
2. Patch goes to a staging copy in `/tmp/`. Original file is untouched.
3. Auto-runs `cargo check`, `tsc --noEmit`, or `go vet`.
4. Pass → write to disk, create checkpoint.
5. Fail → discard staging, original file is pristine, compiler output returned to agent.

Broken code never reaches the filesystem. This sounds basic, but before we had this, the agent broke things more than once.

### Checkpoint Resume

`.opencode/state.json` records every checkpoint: current phase, modified files, compiler result. When context runs out and we have to restart, the new session loads this file and picks up exactly where it left off — no need to redo the whole task.

## Mapping to DeepSeek Harness

Later we read the DeepSeek Harness paper and realized the concepts they described matched the problems we'd already hit:

| Harness Concept | Our Solution |
|----------------|-------------|
| Session Log (Event Sourcing) | `.opencode/state.json` checkpoint log |
| Code Mode (batch tool calls) | `apply_patch` + compiler verify |
| Plugin System | MCP protocol + GraphifyPlugin trait |
| Observability | `skeleton_extract` with 90%+ token compression |

DeepSeek Harness is built on [Cordis](https://github.com/cordiverse/cordis), a plugin framework where everything — model adapter, tool registry, session log, agent loop — is a replaceable plugin.

We didn't start with the architecture. We started with the pain, built tools, and only later realized they fit together.

## Session Log vs Long-Term Memory

The Harness paper distinguishes two memory layers, which we only understood after building:

- **Session Log**: Execution trace of a single task. Ephemeral. StateMachineMcp's `state.json` handles this.
- **Vault Memory**: Cross-session persistent knowledge. Project rules, architectural decisions, config values. [Magic Context](https://github.com/cortexkit/magic-context) — an OpenCode plugin — handles this. It stores durable facts (`ctx_memory`), working notes (`ctx_note`), and full searchable session history (`ctx_search`), all surviving compaction and restarts.

They're not interchangeable. The session log enables recovery **within** a task; vault memory enables continuity **across** tasks. Magic Context is what makes this session you're reading now possible — it's been running for months, carrying context across dozens of tasks.

## Actual Cost

This stack runs on a [~$10/month BytePlus plan](https://www.byteplus.com/activity/codingplan?ac=MMAUCIS9NT1S&rc=B8RAW4KR) with a local GPU machine for Qdrant embeddings. Cost controls:

1. **Input compression**: Graphify cuts AST tokens by 90%+ before they reach the LLM.
2. **Local validation**: StateMachineMcp catches compilation errors locally — no LLM round-trip for syntax fixes.
3. **Checkpoint resume**: Restart from the last checkpoint instead of re-running the whole task.

The $10 is actual monthly cost, not a theoretical ceiling.

## Source Code

Both tools are on GitHub, MIT-licensed:

- [github.com/cawa0505/graphify-rust](https://github.com/cawa0505/graphify-rust)
- [github.com/cawa0505/statemachine-mcp](https://github.com/cawa0505/statemachine-mcp)

If these problems sound familiar, give them a try — or send us feedback.
