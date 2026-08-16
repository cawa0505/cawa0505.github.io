+++
title = "OpenDocuments: what shipped"
date = 2026-08-10T00:00:00Z
draft = true

[taxonomies]
tags = ["rust", "changelog"]
+++

Weekly digest for [OpenDocuments](https://api.github.com/repos/cawa0505/OpenDocuments) — 42 commit(s) in the last 7 days.
- [`78c5f36`](https://github.com/cawa0505/OpenDocuments/commit/78c5f3674ae211392a11f48ce7d88b9f628a8c15) docs: add Task Execution Layer & Native AI Engines spec (Phase 2 planning) (2026-08-09)
- [`0831322`](https://github.com/cawa0505/OpenDocuments/commit/083132205c2310af01d8672676fcd7ca2f77c0d8) feat: make install.sh robust with automatic rust/protoc environment setups and fallback cargo builds (2026-08-06)
- [`b45bd28`](https://github.com/cawa0505/OpenDocuments/commit/b45bd2841e365388b5382bc068415a3972e8a022) feat: enhance install.sh to output cargo install instructions fallback on failure (2026-08-06)
- [`eccdb09`](https://github.com/cawa0505/OpenDocuments/commit/eccdb09700d52363d198992716c35021fb918a2e) ci: remove intel mac build target from release matrix (2026-08-06)
- [`a23105d`](https://github.com/cawa0505/OpenDocuments/commit/a23105d3238afd244fdfdbf2b6c47f9643de14ae) fix(mcp): resolve test compilation errors and correct cargo release profile package name (2026-08-06)
- [`07a9adc`](https://github.com/cawa0505/OpenDocuments/commit/07a9adc9244e7ec0f6796f2753a7ce0f8fb67cf1) docs: expand Phase 1 tasks with explicit verification criteria (2026-08-06)
- [`3f2196c`](https://github.com/cawa0505/OpenDocuments/commit/3f2196ccdbc11e571dc608f65b7f75b98883b5c0) docs: add rustix_use_libc to cargo install instructions (2026-08-06)
- [`4735114`](https://github.com/cawa0505/OpenDocuments/commit/473511499c735d4e0a7998c036fe103aa26e43e9) docs: update install guide with recursion limit flags & refine workspace profile (2026-08-06)
- [`e1a1608`](https://github.com/cawa0505/OpenDocuments/commit/e1a1608a239d4a7984ec738a09c374946d41c260) ci: fix rustix compilation under RUSTC_BOOTSTRAP by forcing libc backend (2026-08-06)
- [`9863773`](https://github.com/cawa0505/OpenDocuments/commit/9863773cc363d1f0b40f51e1ed7f3bab95f29c81) ci: inject RUSTC_BOOTSTRAP and min-recursion-limit to fix compiler query depth overflow (2026-08-06)
- [`ee85c33`](https://github.com/cawa0505/OpenDocuments/commit/ee85c3349226987776e3ba1f3fe9de16d9f49402) Support: replace solscan.io link with Solana Pay (solana: URI) wallet link (2026-08-06)
- [`6f9fe2c`](https://github.com/cawa0505/OpenDocuments/commit/6f9fe2c8284e23246fb3a958b5d86741180a0bf7) docs: limit roadmap and tasks to current project scope (2026-08-05)
- [`2b757cd`](https://github.com/cawa0505/OpenDocuments/commit/2b757cd91e0fc4f2ad7e090647a43ed816b6cad1) docs: remove Language prefix in README header (2026-08-05)
- [`78c13c8`](https://github.com/cawa0505/OpenDocuments/commit/78c13c87dc9925edf6bcbef6c53119db05fa154b) docs: streamline language selector headers across all documentation (2026-08-05)
- [`97f1766`](https://github.com/cawa0505/OpenDocuments/commit/97f1766db3fa2009effef1589b77b588e0d948c1) docs: standardize language selector format across all documentation (2026-08-05)
- [`ee8943e`](https://github.com/cawa0505/OpenDocuments/commit/ee8943efde732178c3079fffe2c4342340b2b4f0) docs: add open-source RAG engine Data Plane specification and documentation (2026-08-05)
- [`3a27c2f`](https://github.com/cawa0505/OpenDocuments/commit/3a27c2ff38319053a51377eecdd040b945f58f3d) fix(cargo): set global profile.release opt-level=0 to prevent lance async layout recursion depth overflow (2026-08-05)
- [`d3a0fe1`](https://github.com/cawa0505/OpenDocuments/commit/d3a0fe15fad2ee46ca69ef4c24517ce450e360d2) fix(cargo): set default release opt-level=0 for external dependencies and opt-level=2 for workspace packages to resolve cargo install recursion overflow (2026-08-05)
- [`8fe4d90`](https://github.com/cawa0505/OpenDocuments/commit/8fe4d9057f37f9fd97fc1650a957e43daa85f32f) fix(cargo): add explicit opt-level=0 overrides for all lance and datafusion sub-crates to fix cargo install recursion depth overflow (2026-08-05)
- [`3a2d235`](https://github.com/cawa0505/OpenDocuments/commit/3a2d23513a96768c311cf536b309614bd0ec37fb) docs(site): fix non-English heading in docs-site to ensure strictly English content (2026-08-05)
- [`21d9f0c`](https://github.com/cawa0505/OpenDocuments/commit/21d9f0cced393fee2130e2af4fe067776cd3d385) docs: structure documentation into docs/en and docs/zh-TW with standardized lowercase kebab-case filenames (2026-08-05)
- [`a85d792`](https://github.com/cawa0505/OpenDocuments/commit/a85d79203e8ab2496f89b0f08aaf7b9ff147c769) ci(release): remove non-existent arm runner and add rust-cache to fix workflow queue stall (2026-08-05)
- [`8780f46`](https://github.com/cawa0505/OpenDocuments/commit/8780f4641c264f06c030518b3bca69345046aedd) fix(cargo): add recursion_limit = 512 to crate roots and standardize global release profile to opt-level = 1 (2026-08-05)
- [`c9f20e7`](https://github.com/cawa0505/OpenDocuments/commit/c9f20e7e75c15a2322c0a226f6b41569b054be71) fix(webui): lock default theme to clean light mode (2026-08-05)
- [`57f5fb3`](https://github.com/cawa0505/OpenDocuments/commit/57f5fb3609ce3c50bfd22ac469b5042b479aec37) fix(cargo): set release profile opt-level = 0 as base to fix lance recursion limit on cargo install (2026-08-05)

> Auto-drafted by hub ingest. Edit, then remove `draft = true` to publish.
