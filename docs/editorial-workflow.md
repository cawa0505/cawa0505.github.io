# Editorial Workflow — Hub 自動編採流程

從 repo commit / milestones 到 draft post 的自動化管道。人工編輯（編採）在發布前介入。

## 架構

```
GitHub API (commits + milestones)
        │
        ▼
scripts/ingest.cjs ──  enrichment（本機才有）──┐
        │                                        │
        ▼                                        ├─ graphify extract：對 repo 實測
content/drafts/YYYY-MM-DD-<repo>-digest.md       │   (node/edge 數 + 耗時，入文)
   (draft = true，不發布)                         └─ draco /v1/scrape：抓 sources URLs
        │                                            內容摘要入文
        ▼
人工編採：編輯 → 移出 drafts → 移除 draft 旗標 → push
        ▼
GitHub Actions pages-deploy.yml → GitHub Pages
```

## 觸發

- `schedule`: 每週一 02:00 UTC
- `workflow_dispatch`: 手動 `gh workflow run ingest.yml --repo cawa0505/cawa0505.github.io`
- 無 commit / milestones 活動的 repo 不產 draft（零噪音）

## 輸出

每 repo 每輪最多一篇 digest draft（`content/drafts/`）：

- 近 N 天（`INGEST_DAYS`，預設 30）的 commit 摘要，排除 merge / chore / bump
- 開放的 milestones 列表（roadmap 區塊）
- 本機執行時追加 enrichment：
  - **graphify**：`graphify extract <local_path>` 實測 node/edge 數 + 耗時（見 `scripts/local.json`，gitignored，不外洩路徑）
  - **draco**：`DRACO_URL` 有設定時抓 `sources` 列的 URL 內容摘要

CI 跑不到本機工具時自動略過 enrichment，不失敗。

## 發布流程（編採 gate）

1. 編輯 draft（改標題、挑 commit、補上下文）
2. `git mv content/drafts/X.md content/X.md`（文章放 content/ 根，terminimal 慣例）
3. front matter 移除 `draft = true`、定日期
4. push master → 自動上線

## 設定

| 檔 | 用途 |
|----|------|
| `scripts/repos.json` | 監看 repo 清單 + `lang` tag + 可選 `sources`（draco URL 清單） |
| `scripts/local.json` | 本機路徑（`local_path`），gitignored |
| env `GH_TOKEN` | GitHub API（CI 用 `secrets.GITHUB_TOKEN`） |
| env `INGEST_DAYS` | 回溯天數，預設 30 |
| env `DRACO_URL` | draco daemon，設定後啟用 scrape enrichment |
| env `GRAPHIFY_BIN` | graphify binary 路徑，缺省用 PATH 查詢 |
