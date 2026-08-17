+++
title = "OpenDocuments: what shipped"
date = 2026-08-17T00:00:00Z
draft = true

[taxonomies]
tags = ["rust", "changelog"]
+++

Weekly digest for [OpenDocuments](https://api.github.com/repos/cawa0505/OpenDocuments) — 29 commit(s) in the last 7 days.
- [`e42e96f`](https://github.com/cawa0505/OpenDocuments/commit/e42e96f64fe8596b72a357880846046de4927ec2) docs: unify task tracking to zh-TW only, drop docs/en/tasks.md (2026-08-15)
- [`79a14c5`](https://github.com/cawa0505/OpenDocuments/commit/79a14c5e36b2d81af5530b5ebaf3bfdb1f6524d9) fix(webui): render unannotated fenced code as block via CSS structure (1.4.11) (2026-08-15)
- [`1b81702`](https://github.com/cawa0505/OpenDocuments/commit/1b81702cab2db8d040c92c4e85f53be5824c645e) fix(webui): remove white border from code blocks in source-preview modal (1.4.11) (2026-08-15)
- [`cdef0df`](https://github.com/cawa0505/OpenDocuments/commit/cdef0df5b85e02ddcd355adef6fb2c4d173b5af9) feat(webui): workspace name resolution, LLM workspace scope, font weight, code copy (1.4.2/1.4.3/1.4.8/1.1.3) (2026-08-15)
- [`2409f09`](https://github.com/cawa0505/OpenDocuments/commit/2409f09b7acdd35c50e6daed22e5c1c4bb32b922) fix(webui): modal escape/mask close, detail overflow wrap, BYOK edit icon (1.4.7/1.4.9/1.4.10) (2026-08-15)
- [`249eb33`](https://github.com/cawa0505/OpenDocuments/commit/249eb33962c25287be4f8485fcc091ac7e341059) fix(webui): restore chat layout with bottom input and scroll area (1.4.4) (2026-08-15)
- [`bc9a88b`](https://github.com/cawa0505/OpenDocuments/commit/bc9a88b4bb5d4fd4f2caae47b30398aaa9063f90) docs: add GA pre-flight tasks (1.4) and codebase conflict audit (2026-08-13)
- [`d7891f2`](https://github.com/cawa0505/OpenDocuments/commit/d7891f29b545c3fd55f06c8915db34e7b0d52afd) refactor: propagate query profile top_k/threshold through search path (2026-08-13)
- [`983d048`](https://github.com/cawa0505/OpenDocuments/commit/983d048bc3eeca069ef4745a00ec1c5995e659b7) feat(webui): batch document select/delete, ConfirmDialog, markdown rendering (2026-08-13)
- [`3a9b36f`](https://github.com/cawa0505/OpenDocuments/commit/3a9b36fc9665d4ee7f81457b1b2d9f99f152206f) chore(webui): upgrade Tailwind CSS v3 to v4 (2026-08-13)
- [`2f831d1`](https://github.com/cawa0505/OpenDocuments/commit/2f831d12efdaddce9f365ffd76293eb7f39d88a0) docs: mark activity-log contract complete in roadmap/tasks (2026-08-12)
- [`dcd615c`](https://github.com/cawa0505/OpenDocuments/commit/dcd615cc84da6565acd90a7b069cec471e001c89) docs: add WebUI architecture spec and bilingual usage docs (2026-08-12)
- [`f4118ac`](https://github.com/cawa0505/OpenDocuments/commit/f4118acb97341effdff20878b0139692c9853a3b) refactor: propagate workspace isolation through remaining handlers (2026-08-12)
- [`893023d`](https://github.com/cawa0505/OpenDocuments/commit/893023d1156d9380220f72cd693e193df651a94d) fix: settings page layout/BYOK/version-notice + force Light Mode (2026-08-12)
- [`dfd4343`](https://github.com/cawa0505/OpenDocuments/commit/dfd4343ea5ede6a5453a12983647f4a62f17e3c8) fix: activity log count/pagination/isolation/delete + query_logs schema migration (2026-08-12)
- [`7ccdf6b`](https://github.com/cawa0505/OpenDocuments/commit/7ccdf6bcb22ed924f2e38cbfb8b91cc366869f6b) feat: isolate verified workspace isolation & GA audit changes (2026-08-11)
- [`29bb2b8`](https://github.com/cawa0505/OpenDocuments/commit/29bb2b845f69143f284817d2ea0414e4082dd723) Add SSE status events (searching/generating) to LLM stream (2026-08-10)
- [`33dcd05`](https://github.com/cawa0505/OpenDocuments/commit/33dcd057685f36501283ff79d2255325dabcec40) docs: remove all TUI references and drop Graphify L2 backlog item (2026-08-10)
- [`6ca3f9e`](https://github.com/cawa0505/OpenDocuments/commit/6ca3f9e6e4c96ba90f0f652fb474f61d299a0fb8) cli: remove TUI — drop opendoc-tui crate, tui feature, subcommand, and run_tui_loop (2026-08-10)
- [`02ab5e0`](https://github.com/cawa0505/OpenDocuments/commit/02ab5e0d3ff6f4bf7415d41fd8df8e59c9013afa) roadmap: cancel TUI (architecturally unsuitable); withdraw tui-enhancements spec (2026-08-10)
- [`3b97dc9`](https://github.com/cawa0505/OpenDocuments/commit/3b97dc9ee1bba40b6ec595c52b2591dc259d42ed) roadmap: define v1.0.0 scope (WebUI/API-first, single-machine full-path) + S3/NAS extension backlog (2026-08-10)
- [`f322884`](https://github.com/cawa0505/OpenDocuments/commit/f32288413f0f6dc77c80995ced0ea676a71c61d3) changelog: document Rust rewrite era under Unreleased (2026-08-10)
- [`b67a278`](https://github.com/cawa0505/OpenDocuments/commit/b67a278cfd397735cd7e6017518f31036f9817e0) specs: mark sidecar + search-index-pipeline Approved; effective supersession (2026-08-10)
- [`af9b7f3`](https://github.com/cawa0505/OpenDocuments/commit/af9b7f3bb4d6dfd60b756367370861d4442cb207) docs: track post-v1.0.0 feature backlog in roadmaps (2026-08-10)
- [`d071b5d`](https://github.com/cawa0505/OpenDocuments/commit/d071b5d3e75bc5896f6526d994f7281418527348) feat: extract LanceDB into opendoc-engine-lancedb sidecar process (2026-08-10)

> Auto-drafted by hub ingest. Edit, then remove `draft = true` to publish.
