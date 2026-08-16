+++
title = "Why open-design-mcp Exists: Fixing Auth Between MCP and the Open Design Daemon"
date = 2026-08-16T19:43:44Z
description = "A source-level look at the small authentication patch, token-file wrapper, and fail-closed build path that let an existing Open Design MCP client talk securely to its daemon."

[taxonomies]
tags = ["MCP", "Open Design", "OpenCode"]
+++
The Open Design daemon already had a Web UI, a REST API, and an stdio MCP client. On paper, that should have been enough for an agent to control it.

It was not.

When the daemon enforced `OD_API_TOKEN`, the stdio client called the REST API without an `Authorization` header. The MCP connection itself started normally, but every tool call that crossed into the daemon failed with HTTP 401.

[open-design-mcp](https://github.com/iscixin/open-design-mcp) exists to fix that narrow integration gap. It is not another design editor, a replacement daemon, or a new MCP implementation. It is a small distribution layer around the upstream Open Design client: one authentication patch, one token-loading wrapper, and scripts that build and install the patched binary from source.

## The missing protocol boundary

The actual path has three parts:

```text
MCP client
    │ stdio / JSON-RPC
    ▼
od-mcp wrapper
    │ HTTP / REST + Bearer token
    ▼
Open Design daemon
```

The stdio side was already present upstream. Authentication was missing on the HTTP side.

The patch adds a helper that reads `OD_API_TOKEN` and returns the header expected by the daemon:

```typescript
function daemonHeaders(): Record<string, string> {
  const token = process.env.OD_API_TOKEN;
  return token ? { Authorization: `Bearer ${token}` } : {};
}
```

Every fetch from the stdio client to the daemon uses that header. The change is intentionally small because the daemon, tools, and transport were not the problem. Replacing any of them would have created a larger fork to maintain.

## Why the token is not stored in MCP config

Putting the raw token directly in `opencode.json` would make the first request work, but it creates a second problem: secrets become duplicated across client configuration files. Rotation then requires editing every client that launches the MCP server.

The `od-mcp` wrapper reads the token from a separate file when the process starts. The default is:

```text
~/.config/opencode/.od_token
```

The file is created with owner-only permissions:

```bash
openssl rand -hex 32 > ~/.config/opencode/.od_token
chmod 600 ~/.config/opencode/.od_token
```

The MCP configuration only needs the daemon URL and the wrapper command. The token remains outside the project repository and outside the client config. To rotate it, replace the file and restart the MCP process.

`OD_API_TOKEN` can still override the file when an environment-based secret source is appropriate. `OD_TOKEN_FILE` can point the wrapper at a different file.

## Why this repository builds from source

The upstream daemon package is not published as an installable npm package. A normal `npm install` path therefore cannot provide the patched `od` command.

The repository keeps the workaround explicit:

1. Clone or update the upstream Open Design source.
2. Check whether the authentication patch is already present.
3. Fail if the patch no longer applies cleanly.
4. Install dependencies with the frozen lockfile.
5. Build the daemon package.
6. Link the resulting command locally.
7. Install the `od-mcp` wrapper into the user's path.

That fail-closed patch check matters. If upstream changes `mcp.ts`, silently skipping a stale patch would produce a binary that builds successfully but still sends unauthenticated requests. Commit [`8d64e98`](https://github.com/iscixin/open-design-mcp/commit/8d64e9816a46ef74a0b9a8f69ebedb10a5585aca) changed the build script to distinguish "already applied" from "does not apply" and stop on the latter.

The same commit also documents an easy Linux naming collision: `/usr/bin/od` is normally GNU coreutils' octal dump command. If that binary wins `PATH`, `od mcp` fails with `Unknown command: mcp`. The installed Open Design command must resolve from the Node binary directory instead.

## What this solves

The repository solves three concrete operational problems:

- The stdio MCP client now authenticates every request sent to the daemon.
- The token no longer needs to live in an MCP client configuration file.
- The patched client can be built and linked even though the upstream package is not published to npm.

The result keeps the existing Open Design architecture intact. Agents still speak MCP over stdio. The Open Design client still talks to the daemon over REST. The daemon still owns project state and design operations.

## What it does not solve

This is deliberately not a general reliability layer.

The daemon remains a network dependency. If it is unavailable, the wrapper cannot make design operations succeed. Cross-host latency and firewall rules still apply. Containers still need access to the token file or an injected environment variable. A future upstream change can still require the patch to be rebased.

The wrapper also does not add or redefine tools. Claims about the daemon's complete tool or resource surface belong to the upstream Open Design project, not this patch repository.

That narrow boundary is the point. The smallest maintainable fix was not to fork Open Design. It was to add the missing bearer header, isolate the secret, and make the source-build path fail loudly when upstream changes.

## Source

- [open-design-mcp](https://github.com/iscixin/open-design-mcp)
- [Open Design upstream](https://github.com/nexu-io/open-design)
- [Authentication patch](https://github.com/iscixin/open-design-mcp/blob/main/patch/mcp-auth.patch)
- [Fail-closed build fix](https://github.com/iscixin/open-design-mcp/commit/8d64e9816a46ef74a0b9a8f69ebedb10a5585aca)
