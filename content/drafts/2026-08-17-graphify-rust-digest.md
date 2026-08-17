+++
title = "graphify-rust: what shipped"
date = 2026-08-17T00:00:00Z
draft = true

[taxonomies]
tags = ["rust", "changelog"]
+++

Weekly digest for [graphify-rust](https://api.github.com/repos/cawa0505/graphify-rust) — 13 commit(s) in the last 7 days.
- [`28a7243`](https://github.com/cawa0505/graphify-rust/commit/28a7243dbcdb565e1c9b500ba6bdeac6c6d44960) docs(openspec): relocate circuit breaker to MCP subprocess host (2026-08-10)
- [`ce037f7`](https://github.com/cawa0505/graphify-rust/commit/ce037f70e05eb55dc12ebcadcd53973acf3a83eb) feat(registry): four-state plugin status + v2 schema migration (2026-08-10)
- [`8ea0c9a`](https://github.com/cawa0505/graphify-rust/commit/8ea0c9a231171a38aeff5bcc8f669cae9ec922fa) docs: v2.0-beta roadmap 調研 + plugin-health-admission change + release-v2-alpha 收尾 (2026-08-10)
- [`b2e2802`](https://github.com/cawa0505/graphify-rust/commit/b2e28024da694ca3051cd0dc658468266632553f) refactor: derive CLI/MCP version from CARGO_PKG_VERSION instead of hardcoding (2026-08-10)
- [`4708038`](https://github.com/cawa0505/graphify-rust/commit/47080387e5eb19e84c9e8e8f6338c76e323bcf4a) fix: disable Qdrant version compatibility check to avoid server version mismatch errors (2026-08-10)
- [`79ca294`](https://github.com/cawa0505/graphify-rust/commit/79ca294e726018bbc34e7b6e5f497f3bbcf825d8) reviewSearchCrg MCP output lists bound node ids (matches CLI) (2026-08-10)
- [`154f410`](https://github.com/cawa0505/graphify-rust/commit/154f410838b59742af1d770d464447d404b90dd5) review search-crg: consume bound node ids from plugin (2026-08-10)
- [`615e2e1`](https://github.com/cawa0505/graphify-rust/commit/615e2e1a027cd765620009edc24017f6819af3dd) fix: reviewSearchCrg graph feed — 所有 review 工具都需 graph 做 line→symbol (2026-08-10)
- [`5254e94`](https://github.com/cawa0505/graphify-rust/commit/5254e94827fae620920718f74f88edb34219ff4e) feat: reviewSearchCrg + search-crg CLI 加 base 參數 (2026-08-10)
- [`bc27da6`](https://github.com/cawa0505/graphify-rust/commit/bc27da6645a79fc899f2dbea0a4eeb5188e5943e) feat: wire reviewSearchCrg MCP tool + search-crg CLI subcommand (2026-08-10)
- [`1eec882`](https://github.com/cawa0505/graphify-rust/commit/1eec8823785df7bb6cf978d48018e33d9106a44e) feat(mcp): Slice 2 — forward ImpactAlert as notifications/review/impact_alert (2026-08-10)
- [`59a52de`](https://github.com/cawa0505/graphify-rust/commit/59a52dec2da201c474c2f89576bcafe4369b6a3f) feat(v1.1): NotifyCallback + set_notify_callback trait extension, mcp injects callback (2026-08-10)
- [`2e492e8`](https://github.com/cawa0505/graphify-rust/commit/2e492e8e23e2064159763990a3d0c317f926c578) feat(mcp,cli): Slice 1 drift hooks for review plugin + telemetry lint fixes (2026-08-10)

> Auto-drafted by hub ingest. Edit, then remove `draft = true` to publish.
