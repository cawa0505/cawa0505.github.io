---
title: "graphify-rust: what shipped"
date: 2026-08-06T00:00:00Z
draft: true
tags:
  - "rust"
  - "changelog"
---

Weekly digest for [graphify-rust](https://api.github.com/repos/cawa0505/graphify-rust) — 35 commit(s) in the last 30 days.
- [`02ad311`](https://github.com/cawa0505/graphify-rust/commit/02ad3114b701b0a822a19c525f11551a78e378a3) fix: graphify-mcp survives corrupt graph file at startup (2026-08-06)
- [`17871fc`](https://github.com/cawa0505/graphify-rust/commit/17871fc348cc185ad2108977c96a71bbe1a3a116) fix: write incremental snapshot only after successful Qdrant upload (2026-08-05)
- [`f5990b2`](https://github.com/cawa0505/graphify-rust/commit/f5990b2dcc4de5269dd79517520ae693283c6bfe) feat: implement qdrant gRPC transport, lazy HNSW indexing, payload pre-filtering and SHA256 incremental sync (2026-08-05)
- [`06f0700`](https://github.com/cawa0505/graphify-rust/commit/06f0700b7c5038aeb3fe52ae7b6e4ed029c10d59) fix: resolve stack overflow in AST extraction by converting recursive tree traversals to iterative heap stack traversal (2026-08-05)
- [`8f84cce`](https://github.com/cawa0505/graphify-rust/commit/8f84cce69d95c49ca970957692fbfc7a1a33f7ce) perf: implement concurrent async requests with semaphore throttling for Ollama embedding provider (2026-08-05)
- [`eeeaf1f`](https://github.com/cawa0505/graphify-rust/commit/eeeaf1f10d326b67df863aa053eb666d73090049) feat: add selective node filtering based on granularity config to optimize memory density & RAG retrieval quality (2026-08-05)
- [`941f7a4`](https://github.com/cawa0505/graphify-rust/commit/941f7a402d2347be4a2e3ae5ebe1e4dc901d8e41) fix: auto-create XDG config directory and default TOML config when not found (2026-08-05)
- [`76a12e0`](https://github.com/cawa0505/graphify-rust/commit/76a12e0750f9a070e79829c4aa1fc65c256c43da) doc: fix remote cargo installation command in READMEs to specify package (2026-08-05)
- [`fb94062`](https://github.com/cawa0505/graphify-rust/commit/fb94062c398850180906b79c2247ee6f8a110381) doc: update ONNX performance document with realized directory and logging optimizations (2026-08-05)
- [`37c0a6f`](https://github.com/cawa0505/graphify-rust/commit/37c0a6f5157f71df0458de23f0d6665a5c12c46f) ux: add loading indicator logs for local ONNX initialization (2026-08-05)
- [`5d41a3b`](https://github.com/cawa0505/graphify-rust/commit/5d41a3bf3506ec08da36b5c3a9398d04f1b6f812) feat: integrate fastembed-rs, auto-create cache, implement Java & Swift extractors (2026-08-05)
- [`b21a300`](https://github.com/cawa0505/graphify-rust/commit/b21a300afa25a7e215a55a38f7cc03a78bd0323f) docs: regenerate high-res TUI demo gif with default-off event log (2026-08-05)
- [`e01894e`](https://github.com/cawa0505/graphify-rust/commit/e01894e600693f8cbada350bd84afa22d45d90a1) feat: disable TUI event log panel by default (2026-08-05)
- [`2c97292`](https://github.com/cawa0505/graphify-rust/commit/2c9729268a10d4ed47e8a7f02ef0a47468da6dd1) feat: support key 'e' to toggle event log, fix tab click hit-testing, and update demo gif with high resolution (2026-08-05)
- [`e543589`](https://github.com/cawa0505/graphify-rust/commit/e5435896ce570485172db94d2a97fcd9c322fdaa) docs: localize README into English and Traditional Chinese versions with mutual links (2026-08-05)
- [`1b92637`](https://github.com/cawa0505/graphify-rust/commit/1b92637f2cbaf7775c0ac165cd5669bdf1e894f1) feat: implement premium TUI dashboard with dynamic layout, mouse logging, and theme (2026-08-05)
- [`01dee36`](https://github.com/cawa0505/graphify-rust/commit/01dee3605cde9f4ee5395c2af64c3e78cd41507c) docs: reposition TUI demo GIF and polish Traditional Chinese phrasing in README (2026-08-05)
- [`63a42b4`](https://github.com/cawa0505/graphify-rust/commit/63a42b431e671c85ddc253cd2323234bfd74cb84) style: finalize high-contrast selection badge on visual canvas (2026-08-05)
- [`d724c18`](https://github.com/cawa0505/graphify-rust/commit/d724c1826a85124262cf013c0b402cc169e91d72) feat: complete dynamic mouse gesture canvas, split documentation manuals, and implement index command (2026-08-05)
- [`2ec373f`](https://github.com/cawa0505/graphify-rust/commit/2ec373f0824b45458a3874ac4ab555c20c0c0924) feat: implement interactive Terminal TUI graph inspector, rename binary to graphify, and localize README to authentic Taiwanese phrasing (2026-08-05)
- [`02413ad`](https://github.com/cawa0505/graphify-rust/commit/02413ade30ecb97bb585d71a0360ef8e100e7bc2) feat: add OpenAI provider support, automatic config API keys population, and physical Qdrant memory store with Ollama bge-m3 (2026-08-05)
- [`db93b0a`](https://github.com/cawa0505/graphify-rust/commit/db93b0a9b0f47467192ab3909b6eab3ea79f5a5c) feat: implement Virtual Hyperedges Aggregation for compact high-performance serialization (2026-08-05)
- [`e8b745f`](https://github.com/cawa0505/graphify-rust/commit/e8b745fb89ab22974646bc5bdc754b3fa515db63) spec: define Virtual Hyperedge Aggregation for high-performance and token-saving serialization (2026-08-05)
- [`320106b`](https://github.com/cawa0505/graphify-rust/commit/320106b19d38a18c33a9aa0d18dce7b5ba4675af) spec: integrate Local Embeddings & Qdrant Vector Store Architecture into architecture/spec.md (2026-08-05)
- [`2fbf7d4`](https://github.com/cawa0505/graphify-rust/commit/2fbf7d4b989a27a0f71b36f3adc4958c2866f963) docs: correct .toon format description to eliminate over-exaggerated wording (2026-08-05)

**Structure (dogfooded):**
- graphify extract (dogfooded on graphify-rust): 225 nodes / 750 edges in 105ms

> Auto-drafted by hub ingest. Edit, then remove `draft = true` to publish.
