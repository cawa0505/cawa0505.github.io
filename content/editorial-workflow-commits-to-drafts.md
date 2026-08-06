+++
title = "From Commits to Drafts: An Automated Editorial Workflow"
date = 2026-08-06T00:04:00Z

[taxonomies]
tags = ["automation", "workflow", "ci"]
+++

{% raw %}
Writing a dev blog dies the same way every time: the code ships, the intent to write it up survives about a week, then the context is gone. So this site does not start from a blank page. It starts from what already happened in the repos — commits and milestones — and turns that into a draft an editor can shape.

The rule that makes it bearable: **the machine writes drafts, a human publishes.** No draft ever goes live on its own.

## The pipeline

```
GitHub API (commits + milestones)
        │
        ▼
scripts/ingest.cjs ── enrichment (local only) ──┐
        │                                        ├─ graphify extract: measured on the repo
        ▼                                        │   (node/edge counts + timing, into the post)
content/drafts/YYYY-MM-DD-<repo>-digest.md       └─ draco /v1/scrape: fetch source URLs,
   (draft = true, not published)                     summarize into the post
        │
        ▼
human editing: edit → move out of drafts → drop the draft flag → push
        │
        ▼
GitHub Pages
```

`scripts/ingest.cjs` pulls recent activity from the GitHub API and writes one Markdown draft per repo. Everything downstream is either editing or deploying.

## When it runs

- **Schedule:** every Monday 02:00 UTC.
- **Manual:** `gh workflow run ingest.yml --repo cawa0505/cawa0505.github.io`.
- **Zero noise:** a repo with no new commits or milestones produces no draft. Quiet weeks stay quiet.

## What a draft contains

At most one digest per repo per run, dropped into `content/drafts/`:

  - A summary of the last `INGEST_DAYS` (default 7) of commits, with merge/chore/bump noise filtered out.
- Open milestones, rendered as a roadmap block.
- When run locally, two enrichment passes the CI runner can't do:
  - **graphify** — runs `graphify extract` against the local checkout and folds the real node/edge counts and timing into the draft. Local paths live in `scripts/local.json`, which is gitignored so nothing about the machine leaks.
  - **draco** — when `DRACO_URL` is set, scrapes the URLs listed under a repo's `sources` and summarizes them inline.

If those tools aren't reachable — which is always the case on a CI runner — the enrichment is skipped, not failed. The draft still gets written.

## Publishing: the editorial gate

This is the only manual step, and it's the point:

1. Edit the draft — fix the title, pick the commits worth keeping, add the context the machine can't know.
2. `git mv content/drafts/X.md content/X.md` — articles live at the root of `content/`, the Terminimal convention.
3. Remove `draft = true` from the front matter and set a real date.
4. `git push` — the site builds and deploys.

Everything before step 1 is disposable. The draft is a starting point, never the product.

## Configuration

| File / env | Purpose |
|---|---|
| `scripts/repos.json` | Watched repos, each with a `lang` tag and optional `sources` (draco URL list). |
| `scripts/local.json` | Local checkout paths (`local_path`). Gitignored. |
| `GH_TOKEN` | GitHub API auth. CI uses `secrets.GITHUB_TOKEN`. |
| `INGEST_DAYS` | Lookback window in days. Default 7. |
| `DRACO_URL` | draco daemon URL. Enables scrape enrichment when set. |
| `GRAPHIFY_BIN` | Path to the graphify binary. Falls back to `PATH`. |

The whole thing is deliberately dumb: pull activity, write a draft, let a person decide. The automation removes the blank page, not the judgment.
{% endraw %}
