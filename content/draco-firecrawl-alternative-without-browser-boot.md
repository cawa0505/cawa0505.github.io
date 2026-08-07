+++
title = "draco: A Firecrawl Alternative Without the Browser Boot"
date = 2026-08-02T00:00:00Z
description = "Draco offers a browserless Rust MCP scraper that delivers clean Markdown and structured data without launching a browser per request. It achieves this through native Rust implementation, handling DOM interactions and anti-blocking measures, providing a lightweight solution for content scraping."

[taxonomies]
tags = ["rust", "systems", "ai-infrastructure"]
+++

[draco](https://github.com/cawa0505/draco) is a native-Rust web scraper designed as an MCP server. Point it at a URL and get clean Markdown + metadata back — no Node, no headless-Chrome fleet, no per-request browser boot. It is positioned as the lightweight half of a scrape stack: use draco for content, structured data and DOM interaction; escalate to a real browser only when the task needs layout, screenshots or downloads.

It is a fork of [0xchasercat/draco](https://github.com/0xchasercat/draco) — the MCP ergonomics layer and anti-blocking engine described below are fork work, layered on the upstream core. We built what we needed for our own agent workflows and share it back; the upstream author gets full credit for the base.

<!-- more -->

## Why it exists

Firecrawl-class scraping means spinning up heavy browser infrastructure for every fetch. draco was born out of that frustration: an "ultra-dehydrated" Rust MCP server with zero browser-boot overhead and compact agent-facing output. The fork concentrates on MCP ergonomics for AI agents — a11y-snapshot refs instead of CSS-selector guesswork.

## Measured performance

Project README, v0.23.0 release binary, Linux x86_64 (AMD Ryzen 5 5600GT), fixed localhost HTML fixture, 30 sequential samples with content validation:

| Flow | Latency p50 / p95 | Rate |
| :--- | :--- | ---: |
| MCP stdio scrape | 1.33 / 1.69 ms | 724 calls/s |
| MCP HTTP scrape | 3.79 / 5.02 ms | 267 calls/s |
| HTTP interact lifecycle (open→snapshot→clickRef→scrape→close) | 106.87 / 112.81 ms | 9.32 flows/s |

Peak RSS: 20.1 MiB (stdio) / 63.3 MiB (daemon).

## The MCP ergonomics layer

- **Observation-first, action-by-ref**: `draco_interact_snapshot` serializes a semantic a11y tree with stable refs (`e1`, `e2`, …); agents act via `clickRef` instead of writing fragile CSS selectors.
- **Ref self-healing**: refs are identity triples `(role, name, nth)`, so Vue/React remounts don't break pointers.
- **Interactive-only promotion**: refs only on interactive roles, with dynamic promotion for nodes carrying `onclick`/`cursor: pointer`/`tabindex`.
- **Anti-blocking**: desktop-chrome/mobile-safari UA emulation with matching `Sec-Ch-Ua`, humanized jitter, and transparent SOCKS5/HTTP proxy rotation with exponential backoff on 429/403.
- **CJK charset sniffing**: BOM → Content-Type → meta prescan → UTF-8 fallback, so zh-TW/ja/ko pages don't degrade to U+FFFD.

## Dogfood: this hub's editorial intake

The automated editorial pipeline on this site calls draco's REST API (`/v1/scrape`, Firecrawl-compatible) to pull research material from source URLs — changelogs, docs pages, benchmark posts — into draft posts for review. When the daemon is unreachable, CI degrades gracefully and the pipeline runs on GitHub metadata alone. See `scripts/ingest.cjs` in the hub repo and the [editorial workflow note](/docs/editorial-workflow/).

Install:

```bash
curl -fsSL https://raw.githubusercontent.com/cawa0505/draco/main/install.sh | sh
draco scrape https://example.com
```

Repo: <https://github.com/cawa0505/draco> — MIT OR Apache-2.0.
