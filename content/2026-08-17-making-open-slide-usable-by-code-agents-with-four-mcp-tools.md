+++
title = "Making OpenSlide Usable by Code Agents with Four MCP Tools"
date = 2026-08-16T20:23:05Z
description = "A source-level walkthrough of OpenSlide's four MCP tools, backed by a real stdio recording and an embedded five-page deck built through the same agent workflow."

[extra]
intro_image = "/open-slide-mcp-demo.gif"

[taxonomies]
tags = ["MCP", "OpenSlide", "OpenCode"]
+++
OpenSlide already had the hard part: a slide engine, a React authoring model, a CLI, and static builds. What it lacked was a clean boundary for code agents.

A human can answer an overwrite prompt, watch terminal output, and decide what command to run next. An agent works better with named arguments, validation, and one structured response per operation. The new OpenSlide MCP server adds that boundary without creating a second slide engine.

![OpenSlide MCP stdio demo](/open-slide-mcp-demo.gif)

The recording above shows the real end-to-end flow: the five-page brief, the agent-authored slide source, and `open_slide_build` resolving the output directory — all through a real MCP client over stdio.

## The boundary was the missing piece

The implementation is intentionally thin:

```text
code agent
    │ MCP over stdio
    ▼
@open-slide/mcp
    │ validated function calls
    ▼
@open-slide/cli + @open-slide/core/cli
```

The MCP package uses the official TypeScript MCP SDK and Zod. Each handler validates its input, delegates to existing OpenSlide code, and returns JSON as MCP text content. Build logic, workspace scaffolding, skill synchronization, and HTML generation remain owned by the existing CLI packages.

That matters because duplicating those operations inside an MCP-specific implementation would create two behaviors to maintain. A thin adapter keeps the protocol boundary new while leaving the slide engine alone.

## Four finite tools

The server exposes four operations:

### `open_slide_init`

Creates a workspace. Its arguments cover the decisions that would otherwise require interactive terminal input:

```text
dir, force, name, install, git, packageManager
```

The result reports the resolved workspace directory.

### `open_slide_build`

Builds an existing workspace into a static SPA. It accepts the workspace directory and an optional output directory, then reports the resolved output path.

### `open_slide_export_html`

Builds the workspace and attempts to produce one HTML file. It accepts the workspace directory and an optional output filename.

### `open_slide_sync_skills`

Synchronizes OpenSlide's bundled agent skills into the workspace. With `dryRun: true`, it reports drift without writing files. The implementation also preserves the existing symlink-first behavior and copy fallback.

These are deliberately finite operations. Long-running `dev` and `preview` sessions are not MCP tools. They do not fit the same request-response lifecycle and remain normal CLI commands.

## Dogfooding the workflow

The deck below was made through the same path described here:

1. `open_slide_init` created an isolated workspace.
2. The agent replaced the generated sample with a five-page React deck about the MCP server.
3. `open_slide_build` compiled the workspace.
4. The resulting static SPA was copied into this Zola site's `static/` tree.
5. This article embeds that real output rather than a screenshot of it.

<div style="position:relative;width:100%;aspect-ratio:16/9;margin:2rem 0;overflow:hidden;border:1px solid #444;border-radius:8px;background:#0b0d10">
  <iframe src="/open-slide-mcp-demo/" title="OpenSlide MCP for code agents" loading="lazy" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;border:0"></iframe>
</div>

[Open the interactive deck in a separate tab](/open-slide-mcp-demo/)

Use the left and right arrow keys inside the deck to move between its five pages.

## What the demo found

Dogfooding exposed a real limitation in `open_slide_export_html`.

The exporter sets Vite's asset inline limit high enough to inline normal emitted assets, then replaces the entry JavaScript and CSS references in `index.html`. Slide decks, however, are loaded as dynamic JavaScript chunks. The exported HTML did not contain the chunk for this deck, so calling the file self-contained would be inaccurate.

The embedded artifact therefore uses `open_slide_build`, with a dedicated base path, instead of pretending the single-file export worked. The build output contains the entry bundle, CSS, fonts, and the deck's dynamic chunk under one static directory.

This is exactly why a real end-to-end artifact is more useful than a tool-registration test. The MCP calls worked, the build worked, and the final embed still revealed a packaging bug at the delivery boundary.

## What MCP improves—and what it does not

MCP removes terminal ambiguity for agents:

- no TTY prompt parsing for workspace creation;
- explicit, validated arguments;
- stable structured responses;
- direct access to existing build and synchronization operations;
- no duplicated slide engine.

It does not remove OpenSlide's runtime requirements. The server still needs Node.js 18 or newer and the OpenSlide packages. A static build still needs to be hosted somewhere. Large assets still increase output size. Interactive development remains a CLI workflow.

The result is small on purpose: four tools, one stdio transport, and delegation to code that already existed. That is enough for an agent to create a workspace, author a deck, build it, and hand a deployable artifact to the next step.

## Sources

- [OpenSlide repository](https://github.com/cawa0505/open-slide)
- [MCP tools implementation](https://github.com/cawa0505/open-slide/commit/7c1be9b4db4b51f17c7fbfb4db272461a0676d68)
- [Symlink entry-point fix](https://github.com/cawa0505/open-slide/commit/de7a5aa8752bc59d8b1b57049e619a638613182c)
