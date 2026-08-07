+++
title = "OpenDocuments: A Self-Hosted RAG Platform That Fits in a Single Binary"
date = 2026-08-06T00:00:00Z
description = "OpenDocuments packages document parsing, hybrid retrieval, cited answers, an API, and a WebUI into one self-hosted Rust binary."

[taxonomies]
tags = ["rust", "ai-infrastructure", "rag"]
+++

OpenDocuments is a self-hosted RAG platform: point it at a folder of PDFs, DOCX, XLSX, Markdown files or web pages, and it builds an AI-searchable knowledge base with cited answers. It ships as one Rust binary that embeds both the Axum API server and the React WebUI via `rust-embed` — no Node runtime, no external assets, nothing to install besides the executable.

<!-- more -->

## Why a ground-up Rust rewrite

The first version was a TypeScript/Node.js monorepo (Hono + Turborepo). It worked as a proof of concept but carried heavy runtime overhead. The Rust rewrite exists to serve resource-constrained environments — think legacy government or school PCs — where a 180 MB idle footprint is not acceptable.

Measured with `hyperfine` (project README, 10,000-row messy Excel sheet, AMD Ryzen 5 5600GT):

| Metric | Node.js version | Rust version |
| :--- | :--- | :--- |
| Cold start / idle memory | ~180 MB | ~18 MB (90% saved) |
| Parse & chunk a messy XLSX | ~14.25 s | 0.83 s (17x) |
| Distribution | thick `node_modules` | single binary, WebUI embedded |

## Architecture

- **Hybrid retrieval**: LanceDB dense vectors + SQLite FTS5 keyword index, fused with Reciprocal Rank Fusion (RRF) reranking before prompt construction. The project reports up to 70%+ token reduction on prompt context.
- **Storage**: metadata in SQLite (FTS5), vectors in LanceDB — both embedded in-process, no IPC bridges.
- **BYOK**: API keys encrypted in a local SQLite table with `600` permissions, zero telemetry.
- **MCP server**: any MCP client (Claude Code, Cursor, Windsurf) can search the knowledge base over stdio.
- **TUI**: a ratatui-based terminal UI for keyboard-first workflows (`opendoc-tui`).
- Workspace isolation, Ollama support for fully local operation, and per-format sandboxed parsers (`opendoc-parser-*`).

## Dogfood: this hub's research notes

The editorial pipeline here indexes its non-code research notes through OpenDocuments (`opendoc-mcp`), keeping decision history searchable across sessions instead of losing it in scattered files. The same "index once, ask with citations" loop the README describes is the one this hub runs daily.

Install and start:

```bash
curl -fsSL https://raw.githubusercontent.com/cawa0505/OpenDocuments/main/install.sh | sh
opendoc start --port 3000
opendoc document index /path/to/docs
opendoc ask "How does our auth system work?"
```

Repo: <https://github.com/cawa0505/OpenDocuments> — MIT, 100% open source.
