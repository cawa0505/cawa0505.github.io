---
title: "OpenDocuments: what shipped"
date: 2026-08-06T00:00:00Z
draft: true
tags:
  - "rust"
  - "changelog"
---

Weekly digest for [OpenDocuments](https://api.github.com/repos/cawa0505/OpenDocuments) — 98 commit(s) in the last 30 days.
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
- [`933b67a`](https://github.com/cawa0505/OpenDocuments/commit/933b67ac4d2a4789595935c0288cb7b8afb04e63) chore(cleanup): remove legacy templates folder from Node.js migration (2026-08-05)
- [`b9859d4`](https://github.com/cawa0505/OpenDocuments/commit/b9859d48ea91e5be52ec39f4dac52ffa27721dc8) docs(quality): add pre-commit privacy audit rules and engineering quality standards, ignore AGENTS.md (2026-08-05)
- [`2dfac44`](https://github.com/cawa0505/OpenDocuments/commit/2dfac4480793bb23285f31dd1e3c095442f9e57c) docs(openspec): complete comprehensive OpenSpec specs for all core OpenDocuments subsystems (2026-08-05)
- [`cdfc9a7`](https://github.com/cawa0505/OpenDocuments/commit/cdfc9a7d7c86adb8b2b629f55e21cfd732c18026) docs: fix cargo install package name to opendoc and update guide site (2026-08-05)
- [`a424f35`](https://github.com/cawa0505/OpenDocuments/commit/a424f35e958bee579eeb4ceb0b89316494230832) fix(cargo): add .cargo/config.toml with opt-level = 1 to fix cargo install --git recursion overflow (2026-08-05)
- [`db25d12`](https://github.com/cawa0505/OpenDocuments/commit/db25d126ce458862dd9cf8601149d7cb60b1751a) feat(spec): add OpenSpec TUI enhancement spec and sync dual-language ROADMAPs (2026-08-05)
- [`d833586`](https://github.com/cawa0505/OpenDocuments/commit/d8335863a51980952db162c7c70bcf7786c93a62) docs: add documentation site link to README headers (2026-08-05)
- [`d465fac`](https://github.com/cawa0505/OpenDocuments/commit/d465facb8020b77bfa7d4ee9e42c3f5ed75fa0ac) docs: add cargo install from git method and fix release workflow recursion limit (2026-08-05)
- [`0357dad`](https://github.com/cawa0505/OpenDocuments/commit/0357dadde043cb24bb7b5fdcdd5326a2377f616e) docs: remove self-referine hyperlink on current language tag in READMEs (2026-08-05)
- [`6ed1270`](https://github.com/cawa0505/OpenDocuments/commit/6ed1270b0dd346a0f966b92cea37f1691169ff19) docs: expand dual-language READMEs with AI provider value proposition and token efficiency (2026-08-05)
- [`1b5774b`](https://github.com/cawa0505/OpenDocuments/commit/1b5774b28f76c9ec4724410805816cbf986dba92) fix(ci): set opt-level = 0 for all lance sub-packages in release profile to fix rustc recursion limit overflow (2026-08-05)

> Auto-drafted by hub ingest. Edit, then remove `draft = true` to publish.
