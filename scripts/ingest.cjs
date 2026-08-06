#!/usr/bin/env node
// Editorial intake: per-repo weekly digest of recent commits + open milestones.
// Writes draft posts (draft=true) into content/drafts/, one per active repo.
// Human edits and removes the draft flag to publish. Dedup by filename.
// ponytail: digest granularity, not per-commit — the editorial gate must stay cheap.

const fs = require('fs');
const path = require('path');

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
    });    const body = [
      `Weekly digest for [${repo.name}](${api}) — ${fresh.length} commit(s) in the last ${DAYS} days.`,
      ...lines,
    ];
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
