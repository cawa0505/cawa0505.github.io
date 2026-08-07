+++
title = "ax-mcp: A Remote Scraping MCP Server over Streamable HTTP"
date = 2026-08-01T00:00:00Z
description = "Ax-mcp exposes the ax scraper as a remote Streamable HTTP MCP endpoint designed to survive reverse proxies and unreliable network hops."

[taxonomies]
tags = ["typescript", "ai-infrastructure"]
+++

[ax-mcp](https://github.com/cawa0505/ax-mcp) is a small Node.js MCP server that wraps [`ax`](https://github.com/yusukebe/ax) — "curl for the AI era" — and exposes it as a **remote** MCP endpoint. The point is transport: instead of SSE long-connections that die across reverse proxies, the server is bridged through `supergateway` to Streamable HTTP (`POST /mcp`), the native shape of OpenCode's `type: "remote"`.

<!-- more -->

## Why Streamable HTTP instead of SSE

Standard SSE MCP is stateful: one long-lived connection that a Caddy/Nginx proxy or a flaky cross-network hop can drop at any time. Streamable HTTP turns every tool call into an independent short HTTP POST — it tunnels through CDNs, reverse proxies, WAFs and VPNs without holding a TCP connection. That is the difference between an MCP server that works only on localhost and one that works across hosts in a homelab cluster.

## The scrape_web tool

`scrape_web` maps cleanly onto ax's real CLI (not a made-up Playwright interface — ax is a non-browser crawler built on Bun + linkedom and does not execute JavaScript):

| Param | ax mapping |
| :--- | :--- |
| `url` | positional |
| `selector` | positional + `--text` |
| `format: "text"` | `--md` |
| `format: "json"` | `--json` (status/ok/ms/headers/body) |

Output is regex-filtered for ANSI color codes so the LLM always receives clean text; failures return `{ isError: true }` with stderr.

## Deployment

`ghcr.io/cawa0505/ax-mcp:latest` runs two services via docker-compose: `ax-mcp` on `:3014/mcp` (Streamable HTTP) and `playwright-mcp` on `:3015/mcp` — Microsoft's official Chromium MCP bridged with `--stateful`, the fallback for JS-heavy SPAs that ax cannot render.

For AI agents this is the pragmatic split: ax for fast, non-browser scrapes; Playwright only when the page actually needs a browser.

Repo: <https://github.com/cawa0505/ax-mcp>
