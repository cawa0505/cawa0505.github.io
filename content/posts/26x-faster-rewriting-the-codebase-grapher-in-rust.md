+++
title = "26× Faster: Rewriting the Codebase Grapher in Rust"
date = 2026-08-05T00:02:00Z

[taxonomies]
tags = ["rust", "performance", "systems"]
+++

The Python prototype of [graphify](https://github.com/cawa0505/graphify-rust) was reliable — 429 auto-rotation and provider failover meant it kept working under real rate limits ([part 1](/posts/rate-limits-429-auto-rotation/)). But it was slow, and it shipped a whole environment.

The numbers that decided the rewrite:

- **420 ms** to extract a benchmark repo of 110 source files / 422 edges — in Python
- **16 ms** for the same extraction — in Rust
- **26.25×** faster, measured on the same machine in the repo's own benchmark

## Why Rust won

**Rayon parallelism, not threads by hand.** Source files are independent until the graph is linked, so extraction parallelizes across cores with Rayon and gets a near-linear speedup. The Python version was single-threaded — that alone was most of the gap.

**petgraph with arena pre-allocation.** Node and edge storage is a flat arena allocated up front for the expected size, so graph construction avoids per-node allocation churn. The graph structure is the product; making it cheap to build is the whole game.

**A binary, not an environment.** The Python version needed a multi-GB interpreter + dependency stack on every machine that ran it. The Rust release build is a single static binary you drop anywhere — which is what made a CLI and TUI practical.

## The TUI was a side effect of going native

Once the core was a fast library, the interactive front-end stopped being a web app question and became a terminal question:

![graphify TUI demo](/graphify-tui-demo.gif)

Because extraction takes milliseconds, the TUI can re-extract live and re-render the graph as you navigate — something an HTTP round-trip to a Python service could never feel like.

## Tokens are the real currency

For AI assistants, the output format matters as much as speed. The Rust version emits a compact binary `.toon` format instead of JSON — 74 KB vs 185 KB for the same graph (−60% tokens). Less tokens means cheaper, faster agent runs, not just faster local processing.

Two phases in, the tool is reliable and fast. [Part 3: it extracts its own codebase](/posts/dogfooding-graphify-extracts-its-own-codebase/) — and the numbers are real.

→ [graphify on GitHub](https://github.com/cawa0505/graphify-rust)
