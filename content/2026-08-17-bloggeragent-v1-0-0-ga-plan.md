+++
title = "BloggerAgent V1.0.0 GA Development Plan"
date = 2026-08-17T03:12:00Z
description = "Architectural roadmap for BloggerAgent v1.0.0 GA: core/UI separation, MCP primitives, atomic Zola workflow lessons, XDG compliance, and post-GA extensions."
+++

## The boundary first

BloggerAgent is designed with strict separation between its core Go packages and any UI layer. This enables future Wails-based cross-platform desktop GUI with minimal friction.

The repository is currently private. This article describes the architecture and development plan; it is not a clone-and-run guide.

- `pkg/renderer` – Markdown → HTML with Chroma Dracula inline CSS.
- `pkg/blogger` – Google Blogger API v3 OAuth2, refresh flow, draft/create/post.
- `pkg/editor` – Local filesystem operations via `$EDITOR`/`zago`, subprocess control.

## The current MCP surface

The MCP server (`pkg/mcpserver`) currently registers four publishing tools:

1. `create_zola_draft`
2. `publish_zola_draft`
3. `create_blogger_draft`
4. `publish_blogger_post`
### Architecture Principle

BloggerAgent remains architecturally independent of OpenCode by default; integrations are exposed solely through MCP tool contracts, not by coupling core package structures. This keeps the open-source core lean and avoids bloat from opinionated editor features.

## What Zola dogfooding changed

The Zola publishing experience revealed several edge cases that shaped the current `publish_zola_draft` implementation:

| Edge case | Root cause | Fix |
|---|---|---|
| 404 on live site despite successful `zola build` + `git push` | Articles left in `content/drafts/`; site only indexes `content/` | **Move file** `content/drafts/` → `content/` via `git mv` before `zola build` |
| Push failure left inconsistent git state | `git commit --only` omitted staged draft deletion | **Use regular `git commit`**; regression test asserts clean index after publish |
| Rebase blocked by staged changes | Uncommitted index changes prevented `git pull --rebase` | **Auto `git pull --rebase origin master`**; on conflict fail explicitly, retain local commit |
| Idempotent retry forced upstream guess | Repeated publish risked committing half-finished state | **Fail-closed retry**: full publish may safely re-invoke; returns same public URL on success |
| Verification checked local files instead of remote | Code only inspected `public/` HTML | **Read remote response body**; fail-fast on non-200 |

## What works now

Implemented and verifiable today:

- **Core MCP primitives**: `create_blogger_draft`, `publish_blogger_post`, `create_zola_draft`, `publish_zola_draft`
- **Atomic Zola publish**: Move draft → `content/`, remove `draft=true`, `zola build`, scoped commit/push with rollback-on-failure, public URL read-back verification
- **XDG Base Directory compliance**: Config under `$XDG_CONFIG_HOME/blogger-agent/`; credentials under `$XDG_DATA_HOME/blogger-agent/`
- **Blogger OAuth and publishing**: Markdown rendering, Blogger draft creation, and publication by Post ID

## V1.0.0 GA candidate scope

The v1.0 product plan is still a discussion document. Its central proposal is a domain-limited editorial run rather than a general code agent. A run would preserve source provenance, the Markdown artifact, a SHA-256 content hash, approval state, publication identifiers, and public verification evidence.

Approval must be bound to the artifact hash. Any content or front-matter change invalidates the previous approval. Retries must inspect remote state before creating another draft or publication.

The TUI candidate contract includes integrated URL and QR authentication, explicit loading/empty/error states, keyboard and mouse paths for primary actions, and manual resolution when local Markdown and remote Blogger content both changed. These are GA targets, not claims about the current implementation.

Several details remain `[待討論]`: the run-state storage format and path, the exact editorial-run MCP schema, whether TUI is the primary approval interface, and whether Blogger and Zola must reach identical verification depth for GA.

### Post-GA ideas (high-level, no commitment)

- Wails-based cross-platform desktop GUI using the same Go core
- Optional `style-corpus` MCP layer for personal tone retrieval (decoupled from core)
- QR-code-based mobile auth flows (HalfBlocks, minimal density)
- Refactored dependency injection for testability (e.g., injectable HTTP client in `google.golang.org/api/option`)

## Key Lessons

1. **Machine prepares, human gates** – the editorial pipeline always has a human-confirmation step before Blogger publish or Zola public deployment.
2. **Never trust local build output as public proof** – always read-back the remote URL; GitHub Pages may take seconds to minutes to reflect changes.
3. **Fail-closed by default** – git boundaries (no unrelated changes, rebase before push, rollback on push failure) prevent silent repository corruption.
4. **Small, focused MCP tools** – four tools cover the current publishing workflow; adding more before a proven need would create contract drift.
5. **XDG compliance is not optional** – separating config from code, credentials from data, ensures the binary can be freely redistributed.
