+++
title = "opencode-speak-human-tw: A Plugin That Strips the AI Smell Out of Writing"
date = 2026-08-03T00:00:00Z
description = "An OpenCode plugin that rewrites Traditional Chinese copy to remove AI-flavored phrasing, mainland-China vocabulary, and inconsistent punctuation."

[taxonomies]
tags = ["javascript", "ai-infrastructure"]
+++

[opencode-speak-human-tw](https://github.com/cawa0505/opencode-speak-human-tw) is an OpenCode plugin port of Raymond Hou's [speak-human-tw](https://github.com/Raymondhou0917/speak-human-tw) — a rewriting skill that removes AI-flavored phrasing, mainland-China vocabulary and half-width punctuation from Traditional Chinese copy, so the result reads like a person wrote it.

<!-- more -->

## What it does

For anyone publishing Chinese content out of an AI-assisted workflow, the tell is in the rhythm: canned transitions, over-polite hedges, borrowed mainland idioms. This plugin targets exactly that. `speak-human-tw` reviews and rewrites text to strip the AI smell — de-genericizing phrasing, correcting Simplified-Chinese borrowings, normalizing punctuation — while leaving code, logs and config files alone. Trigger it with `/speak-human-tw`, pass a file with `@filename.md`, or just say "這段去 AI 味" and the skill auto-loads.

## Mechanics

- Registers a `/speak-human-tw` command and skills on OpenCode startup.
- Hourly auto-update check against npm, downloadable and restart-prompted (disable with `SPEAK_HUMAN_TW_AUTOUPDATE=0`).
- MIT-licensed, same as the original.

## Dogfood: where it's already in use

This is not a shelf tool. The ax-mcp project runs all its Taiwanese-Chinese documentation through opencode-speak-human-tw for proofing and tone tuning — the README's "去 AI 味聲明" is exactly that workflow. On this hub, it is the designated tool for the planned Traditional-Chinese content track: the editorial standard is geek-style English for now, and when the hub starts publishing zh-TW articles, the de-AI pass on drafts is this plugin's job.

```bash
opencode plugin @jimmyyen/opencode-speak-human-tw --global
```

Repo: <https://github.com/cawa0505/opencode-speak-human-tw> — MIT.
