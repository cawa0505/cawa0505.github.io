+++
title = "Dogfooding: Graphify Extracts Its Own Codebase"
date = 2026-08-06T00:03:00Z

[taxonomies]
tags = ["rust", "ai-infrastructure", "open-source"]
+++

The best test of a codebase-graph tool is its own codebase. [graphify](https://github.com/cawa0505/graphify-rust) doesn't just ship graphs for other repos — we run it on itself in CI and in this article. Measured just now, on the project's own source:

```
$ graphify extract .
Successfully extracted graph to graphify-out/graph.toon (nodes: 225, edges: 750)
Elapsed (wall clock): 0.25 s   (second run: 0.12 s)
Maximum resident set size: ~17 MB
```

225 nodes, 750 edges, one quarter of a second, less RAM than a browser tab. That's the whole promise of the Rust rewrite ([part 2](/posts/26x-faster-rewriting-the-codebase-grapher-in-rust/)) in one command line.

## What the graph looks like

The workspace is split into focused crates, and the graph shows it:

- **graphify-core** — AST parsing and the graph data model
- **graphify-llm** — the semantic pass and rate-limit handling (`AutoRotatePipeline` lives at `graphify-llm/src/pipeline.rs:9`)
- **graphify-cli** — `extract`, `query`, `path`, `index`, `tui`, `install-skill`
- **graphify-mcp** — the [Model Context Protocol](https://modelcontextprotocol.io) server so assistants query the graph directly
- **graphify-out** — the `.toon` format crate

## Querying it

`query` and `path` work on the extracted graph, so an assistant (or a human) can ask structural questions without reading the whole repo:

```
$ graphify query "./graphify-llm/src/pipeline.rs:struct:AutoRotatePipeline" --depth 1
```

...returns the node with its neighbors — who calls what, where the struct starts (`pipeline.rs:9`), what module it belongs to. `graphify path A B` answers "how do these two subsystems connect?"

## Why dogfooding matters

Three things running graphify on itself catches, that manual docs would miss:

1. **Extraction must be fast enough to feel instant** — the TUI re-extracts live as you navigate.
2. **The MCP server must actually answer** — we use it while developing, so a broken query path is a broken day.
3. **The graph must match reality** — the crate split above is verified by the graph, not by prose.

Graphify is open source. If you build AI agents that work across codebases, this is what they see when they look at a repo.

→ [graphify on GitHub](https://github.com/cawa0505/graphify-rust)
