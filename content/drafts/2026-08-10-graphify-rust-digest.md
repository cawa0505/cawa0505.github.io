+++
title = "graphify-rust: what shipped"
date = 2026-08-10T00:00:00Z
draft = true

[taxonomies]
tags = ["rust", "changelog"]
+++

Weekly digest for [graphify-rust](https://api.github.com/repos/cawa0505/graphify-rust) — 57 commit(s) in the last 7 days.
- [`424cd72`](https://github.com/cawa0505/graphify-rust/commit/424cd724ee7658d84cec3d51819fe5003f41ce07) feat(cli,mcp): wire graphify-plugin-review — reviewIngest/GetContext/Resolve (2026-08-09)
- [`17d0921`](https://github.com/cawa0505/graphify-rust/commit/17d09213ad4fc5254cb80b6eb6b8baef125b4e78) feat(opendoc): wire RestBackend into graphify-cli + graphify-mcp (OD_BASE_URL env) (2026-08-09)
- [`6a9a5fd`](https://github.com/cawa0505/graphify-rust/commit/6a9a5fd876f8a897db09b64024530bb01d999b58) feat: graphify opendoc skill install/uninstall CLI 子指令（embed skill_install，managed-marker safety） (2026-08-09)
- [`a621ffc`](https://github.com/cawa0505/graphify-rust/commit/a621ffc85b418c044311545ba87ededb9e5f824a) feat: embed opendoc plugin into graphify-cli + graphify-mcp（path dep + opendoc subcommand + 3 opendoc* MCP tools） (2026-08-09)
- [`991362c`](https://github.com/cawa0505/graphify-rust/commit/991362c28dd3d781164a0c48bfe83b19ff2f231f) feat: graphify handoff skill install/uninstall（雙軌 SKILL.md 分發） (2026-08-09)
- [`351d366`](https://github.com/cawa0505/graphify-rust/commit/351d366e6efda5a290509ab50a5afb0a20ed7700) fix: return relay tool results as MCP content blocks (opencode drops bare-string results) (2026-08-09)
- [`e8c5625`](https://github.com/cawa0505/graphify-rust/commit/e8c56250d84e031a20206442dad32d3be3a116cc) fix: don't respond to MCP notifications (spec compliance, stream alignment) (2026-08-09)
- [`2d3a519`](https://github.com/cawa0505/graphify-rust/commit/2d3a519deff182c70f32ef8ccf5416113194c98d) feat: embed handoff relay plugin into MCP server (7 relay* tools, global registry) (2026-08-09)
- [`829a459`](https://github.com/cawa0505/graphify-rust/commit/829a459c239a5e7cc56509f5c85dd3f4142701fc) feat: embed handoff relay plugin into CLI (handoff subcommand wired to global registry) (2026-08-09)
- [`e09cf0f`](https://github.com/cawa0505/graphify-rust/commit/e09cf0fbcf3f836b66978e9897965efa19be8561) feat: P4 Task 5 startup boundary wiring + Local fallback E2E + -c config fix (2026-08-09)
- [`65bef19`](https://github.com/cawa0505/graphify-rust/commit/65bef19d9f74e6c040eaa4bab876de715a8ca467) feat: P4 qdrant local fallback (local process + init_with_fallback + rehydration job) (2026-08-09)
- [`7285b5e`](https://github.com/cawa0505/graphify-rust/commit/7285b5e1ae11086845cf462facec10090f702af1) feat: complete P2 sqlite global registry (workspace CLI + XDG + docs) (2026-08-09)
- [`9526b63`](https://github.com/cawa0505/graphify-rust/commit/9526b6399c47034d404e484fc1cfe1f686bf5813) docs: propose sqlite-global-registry change (registry DDL + passive resync + handoff pruning) (2026-08-09)
- [`8555f61`](https://github.com/cawa0505/graphify-rust/commit/8555f619953d4f882119244be7dab9f746e78b4f) feat: add MemoryQueryCriteria and HandoffSnapshot two-tier handoff types (2026-08-09)
- [`2f73a1b`](https://github.com/cawa0505/graphify-rust/commit/2f73a1bd4cdd27c2159ace188e1db4fb15bba477) docs: add RFC-0004 §1.3.1 Local-to-Server rehydration delta amendment (2026-08-09)
- [`167ac6e`](https://github.com/cawa0505/graphify-rust/commit/167ac6e3f92cdd4092b96c818e9c4102c3657e4f) docs: defer qdrant-grpc-incremental after Qdrant local fallback (2026-08-09)
- [`3b8aef7`](https://github.com/cawa0505/graphify-rust/commit/3b8aef7d73cf14bd58a771a22f2d5e23bf98ad8f) docs: archive legacy changes (python-compat, rust-refactor phase1/2, cli-install-skill) and promote compatibility/query specs to main (2026-08-09)
- [`d6dc0cd`](https://github.com/cawa0505/graphify-rust/commit/d6dc0cd12df13e72cfb7bc43e482a40e6972c862) docs: archive graphify-memory-crate-migration and promote memory/llm-gateway specs to main (2026-08-09)
- [`c1ab003`](https://github.com/cawa0505/graphify-rust/commit/c1ab0033f11ac6d4d4cde44f6e8d306cc08e3731) docs: archive plugin changes (trait/events/scan/sync-toon) and promote specs to main (2026-08-09)
- [`7c756e0`](https://github.com/cawa0505/graphify-rust/commit/7c756e0906e673542ecd919ff152b0226f6d9806) feat: extract graphify-memory crate with CoreLlmProvider gateway (2026-08-09)
- [`aeca66b`](https://github.com/cawa0505/graphify-rust/commit/aeca66bf862eefc26855fe6d9038b140a8253f40) feat: memory-plugin integration Phases 0-5 + plugin-events/scan (workspace milestone) (2026-08-09)
- [`36fa259`](https://github.com/cawa0505/graphify-rust/commit/36fa25989b415ca7977478dcc8bd42f5e93ed893) feat: add GraphifyPlugin trait v1 with workspace_uuid routing (2026-08-08)
- [`02ad311`](https://github.com/cawa0505/graphify-rust/commit/02ad3114b701b0a822a19c525f11551a78e378a3) fix: graphify-mcp survives corrupt graph file at startup (2026-08-06)
- [`17871fc`](https://github.com/cawa0505/graphify-rust/commit/17871fc348cc185ad2108977c96a71bbe1a3a116) fix: write incremental snapshot only after successful Qdrant upload (2026-08-05)
- [`f5990b2`](https://github.com/cawa0505/graphify-rust/commit/f5990b2dcc4de5269dd79517520ae693283c6bfe) feat: implement qdrant gRPC transport, lazy HNSW indexing, payload pre-filtering and SHA256 incremental sync (2026-08-05)

> Auto-drafted by hub ingest. Edit, then remove `draft = true` to publish.
