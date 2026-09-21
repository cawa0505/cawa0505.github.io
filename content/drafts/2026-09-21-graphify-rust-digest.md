+++
title = "graphify-rust: what shipped"
date = 2026-09-21T00:00:00Z
draft = true

[taxonomies]
tags = ["rust", "changelog"]
+++

Weekly digest for [graphify-rust](https://api.github.com/repos/cawa0505/graphify-rust) — 16 commit(s) in the last 7 days.
- [`c4810c3`](https://github.com/cawa0505/graphify-rust/commit/c4810c3f2f5bafcfb950179c2441662e60fc1ada) style: format test module in graphify-memory and update resume (2026-09-20)
- [`a36c4e6`](https://github.com/cawa0505/graphify-rust/commit/a36c4e6dc1e71af941b076ed47c26cc7ee6d9d1b) fix: h/l and left/right keys for compose diagram horizontal scroll in guard (2026-09-20)
- [`4a95173`](https://github.com/cawa0505/graphify-rust/commit/4a95173cd9e25ca6714fae7240cc7c187475a2c0) ci: checkout to GraphifyRust directory to match path dependency layout without symlink collision (2026-09-20)
- [`991c4e7`](https://github.com/cawa0505/graphify-rust/commit/991c4e7a3d9ee849492c0a0b4c72fb568382985a) ci: mirror local GraphifyRust/GraphifyPlugins layout for path dependencies (2026-09-20)
- [`b616ec4`](https://github.com/cawa0505/graphify-rust/commit/b616ec41238b8d85c5e16c4cd9063e7fc5258dfd) ci: clone GraphifyPlugins to repo-parent dir (checkout path forbids ..) (2026-09-20)
- [`7bad5c7`](https://github.com/cawa0505/graphify-rust/commit/7bad5c7098614b1f4b4c6e41f83078af1ad28c44) ci: checkout GraphifyPlugins path dependency before build (2026-09-20)
- [`0b13f86`](https://github.com/cawa0505/graphify-rust/commit/0b13f869746c4e0883ccb740426828b5f02acdaf) fix: compose tab key-guard passthrough (1/2/Tab/q), grid rewrap by terminal width, h-scroll fallback, mouse scroll direction, tab-style alignment (2026-09-20)
- [`c84d6a3`](https://github.com/cawa0505/graphify-rust/commit/c84d6a3380411fc84a63ddb95438607824e79fc7) fix: extractor node-id collisions (rust fn@line, php namespace file-prefix); compose render via temp-file stdin (EAGAIN) (2026-09-20)
- [`7585f37`](https://github.com/cawa0505/graphify-rust/commit/7585f37b1fce97e87cd579ee77d4e00497840522) fix: extractor node-id collisions (rust fn@line, php namespace file-prefix); compose render via temp-file stdin (EAGAIN); add ecosystem manifest (2026-09-20)
- [`176be4b`](https://github.com/cawa0505/graphify-rust/commit/176be4b9cac413608383bf233a2d445f3878f005) fix: TUI workspace switch persists active workspace; startup chdir validates graphify-out exists (2026-09-20)
- [`45817c8`](https://github.com/cawa0505/graphify-rust/commit/45817c82eebe6e6d4af0bbc8de31d5383779294f) fix: Architecture tab no longer double-renders ComposePanel as floating modal (empty-manifest corruption) (2026-09-20)
- [`8ed5106`](https://github.com/cawa0505/graphify-rust/commit/8ed5106a1e6d69bec9c78dcfb65e5610593cf75e) feat: TUI Architecture tab (3) replaces compose modal — menu + ASCII embedded in tab layout (2026-09-20)
- [`164add2`](https://github.com/cawa0505/graphify-rust/commit/164add254738dfdc6c709215226aa87ea506bbd7) fix: TUI workspace switch chdirs to workspace root so relative source_file paths resolve for $EDITOR (2026-09-20)
- [`d147005`](https://github.com/cawa0505/graphify-rust/commit/d1470054eb7d80a178575a24fc87da4e02442965) ci: auto-release workflow on v* tags (linux x86_64 binary) (2026-09-20)
- [`f28b969`](https://github.com/cawa0505/graphify-rust/commit/f28b969dc09b36bb42640671c0c478257ecd4c5d) feat: TUI compose panel — manifest menu + cross-workspace ASCII diagram (y key) (2026-09-20)
- [`e2e29bd`](https://github.com/cawa0505/graphify-rust/commit/e2e29bdab4b76f099e3123a61185fb8d3593a77c) feat: workspace-compose — Assembly Manifest, unified graph, box-of-rain render, compose MCP tools (2026-09-20)

> Auto-drafted by hub ingest. Edit, then remove `draft = true` to publish.
