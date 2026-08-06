#!/usr/bin/env node
// Editorial intake: per-repo weekly digest of recent commits + open milestones.
// Writes draft posts (draft=true) into content/drafts/, one per active repo.
// Human edits and removes the draft flag to publish. Dedup by filename.
// ponytail: digest granularity, not per-commit — the editorial gate must stay cheap.

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const DRAFTS = path.join(ROOT, 'content', 'drafts');
const DAYS = Number(process.env.INGEST_DAYS || 7);
const SINCE = new Date(Date.now() - DAYS * 86400e3).toISOString();
const NOISE = /^(chore|build|deps|bump|release|merge|\[skip)[:\s]|^\d+\.\d+\.\d+$/i;
const MAX_COMMITS = 25;

const TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
const headers = { 'User-Agent': 'hub-ingest' };
if (TOKEN) headers.Authorization = `token ${TOKEN}`;

async function fetchApi(url) {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`API ${res.status}: ${url}`);
  return res.json();
}

function frontMatter(title, date, tags) {
  return `+++
title = "${title.replace(/"/g, '\\"')}"
date = ${date}
draft = true

[taxonomies]
tags = [${tags.map((t) => `"${t}"`).join(', ')}]
+++

`;
}

// Enrichment: local-only, graceful skip in CI. DRACO_URL / GRAPHIFY_BIN gate them.
// Local repo paths live in scripts/local.json (gitignored) — never in repos.json.

function graphifyStats(repo) {
  if (!repo.local_path) return null;
  try {
    const t0 = Date.now();
    execSync(`graphify extract ${repo.local_path}`, { cwd: repo.local_path, stdio: 'pipe', timeout: 60000 });
    const ms = Date.now() - t0;
    const toon = fs.readFileSync(
      path.join(repo.local_path, 'graphify-out', 'graph.toon'),
      'utf8'
    );
    const nodes = (toon.match(/total_nodes:\s*(\d+)/) || [])[1];
    const edges = (toon.match(/total_edges:\s*(\d+)/) || [])[1];
    if (!nodes) return null;
    return `- graphify extract (dogfooded on ${repo.name}): ${nodes} nodes / ${edges ?? '?'} edges in ${ms}ms`;
  } catch (e) {
    return null;
  }
}

async function dracoScrape(repo) {
  if (!repo.sources?.length || !process.env.DRACO_URL) return [];
  const out = [];
  for (const url of repo.sources) {
    try {
      const res = await fetch(
        `${process.env.DRACO_URL}/v1/scrape?url=${encodeURIComponent(url)}&formats=markdown`,
        { signal: AbortSignal.timeout(15000) }
      );
      const j = await res.json();
      const content = (j?.data?.content || j?.content || '').trim().replace(/\s+/g, ' ');
      if (content) out.push(`- [${url}](${url}): ${content.slice(0, 220)}…`);
    } catch (e) {
      /* daemon unreachable — skip */
    }
  }
  return out;
}

async function main() {
  fs.mkdirSync(DRAFTS, { recursive: true });
  const repos = JSON.parse(fs.readFileSync(path.join(__dirname, 'repos.json'), 'utf8'));
  const today = new Date().toISOString().slice(0, 10);
  let created = 0;

  for (const repo of repos) {
    const key = `${repo.owner}/${repo.name}`;
    const api = `https://api.github.com/repos/${key}`;
    const commits = await fetchApi(`${api}/commits?since=${SINCE}&per_page=100`);
    const fresh = commits.filter((c) => {
      const first = (c.commit.message || '').trim().split('\n')[0];
      return !(NOISE.test(first) || c.parents.length > 1);
    });

    const milestones = await fetchApi(`${api}/milestones?state=open&per_page=100`);
    if (!fresh.length && !milestones.length) continue; // nothing to ingest

    const file = path.join(DRAFTS, `${today}-${repo.name}-digest.md`);
    if (fs.existsSync(file)) continue;

    const lines = fresh.slice(0, MAX_COMMITS).map((c) => {
      const first = c.commit.message.trim().split('\n')[0];
      const sha7 = c.sha.slice(0, 7);
      const date = c.commit.author.date.slice(0, 10);
      return `- [\`${sha7}\`](${c.html_url}) ${first} (${date})`;
    });

    // merge local-only config (graphify local_path, draco sources)
    const local = JSON.parse(
      fs.existsSync(path.join(__dirname, 'local.json'))
        ? fs.readFileSync(path.join(__dirname, 'local.json'), 'utf8')
        : '{}'
    );
    const localCfg = local[repo.name] ? { ...local[repo.name], name: repo.name } : {};

    const body = [
      `Weekly digest for [${repo.name}](${api}) — ${fresh.length} commit(s) in the last ${DAYS} days.`,
      ...lines,
    ];
    const graph = graphifyStats(localCfg);
    if (graph) body.push('', '**Structure (dogfooded):**', graph);
    const scraped = await dracoScrape(localCfg);
    if (scraped.length) body.push('', '**Sources (draco scrape):**', ...scraped);
    if (milestones.length) {
      body.push('', '**Roadmap:**');
      milestones.forEach((m) =>
        body.push(`- [ ] **${m.title}**${m.due_on ? ` (due ${m.due_on.slice(0, 10)})` : ''}`)
      );
    }
    body.push('', '> Auto-drafted by hub ingest. Edit, then remove `draft = true` to publish.');

    fs.writeFileSync(
      file,
      frontMatter(`${repo.name}: what shipped`, `${today}T00:00:00Z`, [repo.lang, 'changelog']) +
        body.join('\n') +
        '\n'
    );
    created++;
  }
  console.log(`ingest: ${created} digest draft(s) in ${DRAFTS}`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
