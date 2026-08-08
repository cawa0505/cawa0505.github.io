# Editorial Handoff

## Graphify article series

Updated: 2026-08-09

### Published

- `content/26x-faster-rewriting-the-codebase-grapher-in-rust.md`
  - Rust rewrite, extraction benchmark, and `.toon` format comparison.
- `content/dogfooding-graphify-extracts-its-own-codebase.md`
  - Dogfooding extraction and graph queries against `graphify-rust`.
- `content/graphify-plugin-architecture-roadmap.md`
  - Embedded plugin contract and planned external MCP-native layer.
  - URL: https://cawa0505.github.io/graphify-plugin-architecture-roadmap/

### Next articles

1. **Review plugin implementation diary**
   - Cover the first executable `graphify-plugin-review` milestone.
   - Show the real boundary between Git diff extraction, Graphify topology, `.toon` context, and semantic review.
   - Use actual commits, fixtures, commands, and output. Do not invent affected symbols.
2. **First reproducible blast-radius case**
   - Publish only after a real cross-module case can show changed symbols and affected callers/callees.
   - Explain what Graphify computes and what the model interprets.
3. **`.toon` context measurement**
   - Compare bytes and tokenizer tokens separately.
   - Record repository or fixture, input revision, serializer version, tokenizer, hardware, cold/warm state, and repetitions.
4. **7B local-model review experiment**
   - Compare diff-only, diff plus source, and diff plus `.toon` subgraph.
   - Measure unsupported symbol references, missed impacts, findings, latency, and input/output tokens.
5. **Rust core, plugins, and polyglot SDK ecosystem**
   - Write after the external protocol or an SDK has an executable milestone.
   - Separate implemented, in-development, and planned components.

### Current editorial rules

- Treat the plugin roadmap as architecture planning, not benchmark evidence.
- Use geek-style English; do not publish Traditional Chinese mixed copy until the style vocabulary is approved.
- Every performance or model-quality number needs a reproducible comparison and measurement conditions.
- Keep `[待實測]`, `[待公開 benchmark]`, and `[開發中]` where implementation or evidence is missing.
- Do not claim dynamic loading, a completed review loop, external SDK availability, zero hallucinations, 100% precision, or universal latency.
- Preserve attribution to upstream authors and projects.
- Keep the dogfood section grounded in an actual fundraising workflow and real Graphify output.

### Next step

Wait for the first executable `graphify-plugin-review` milestone, then draft article 1 from its real fixture and test output. Until then, do not create a fabricated review case or benchmark.
