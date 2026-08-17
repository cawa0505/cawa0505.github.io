+++
title = "OpenCode 的痛：我們為了讓 AI 不亂寫 Code，做了兩個工具"
date = 2026-08-18
[taxonomies]
tags = ["Rust", "AI", "MCP", "開源", "工具"]
+++

用 AI 寫程式最大的問題是什麼？對我們來說，不是模型不夠聰明，而是**不放心**。

- LLM 傳回來的 token 越來越貴，但大部分都是在重複看已經知道的程式碼結構。
- Agent 改完程式，編譯不過，噴了一大串錯誤，要來回好幾輪才修好。
- 工作到一半 context 滿了，重開一個 session 什麼都不記得了，從頭來過。
- 有時候改壞了還不知道，因為改動直接寫進硬碟了。

這些問題大概不是只有我們遇到。我們的做法是寫兩個小工具來補，一個管**輸入成本**，一個管**操作安全**。兩者透過 MCP 協定接進 OpenCode，各自只做一件事。

<!-- more -->

## 工具一：GraphifyRust — 讓 LLM 不用重看整包程式碼

[GraphifyRust](https://github.com/cawa0505/graphify-rust) 是一個用 Rust 寫的靜態分析引擎。它做的事情很單純：用 Tree-sitter 解析原始碼，把 function、struct、trait 這些節點抽出來，建成一個有向圖。

### 為什麼要這樣做？

AI agent 要改程式的時候，傳統做法是把整支檔案丟給 LLM。一個幾百行的檔案可能只有幾段 function 是相關的，但 LLM 還是得看完所有 import、註解、不相干的邏輯。

Graphify 的 `skeleton_extract` 只回傳 AST 骨架 — function 名稱、行號、簽名。實際壓縮效果：

| 檔案 | 原始 token | 骨架 token | 省了多少 |
|------|-----------|-----------|---------|
| `server.go` | 1,289 | 117 | **90.9%** |
| `toon.rs` | 2,132 | 147 | **93.1%** |

骨架不夠用的時候，再用 `range` mode 精準讀取特定 function 的原始碼。不需要整包丟進去。

### 技術選型

選擇 Rust 的理由很務實：Tree-sitter 的 Rust binding 是最成熟的，效能也比 Go/Python 版快很多。在一個 110 個檔案、422 條邊的測試專案上，建構知識圖譜只要 **16ms**，比之前 Python 版快了 26 倍。

節點和邊用 petgraph 的 arena 預先分配，減少 heap 碎片。輸出格式是自訂的 .toon（Token-Oriented Object Notation），用表頭宣告欄位取代 JSON 的重複 key，體積減少 60%。

語意搜尋用 Qdrant，全部在本機跑，沒有雲端 API 費用。目前支援 9 種語言：Rust、Python、Go、JavaScript、TypeScript、C、C++、Java、PHP、Swift。

## 工具二：StateMachineMcp — 讓 Agent 永遠不會寫進壞掉的程式碼

[StateMachineMcp](https://github.com/cawa0505/statemachine-mcp) 是用 Go 寫的 MCP server，概念上就是一個「安全閘門」：Agent 想改程式碼，必須先通過狀態機檢查。

### Phase Gate

每次任務有四個階段：

```
初始化 → 規劃 → 執行 → 驗證 → 完成
```

執行階段才能改程式碼。規劃階段呼叫 `apply_patch` 會被擋掉。連續三次改失敗會自動暫停，等人來看。

### Double Buffer + Compiler Verify

這個機制很簡單但很有效：

1. Agent 送出 patch（精準搜尋區塊 + 取代區塊）。
2. Patch 先寫到 `/tmp/` 的 staging 副本，原始檔案不動。
3. 自動跑 `cargo check`、`tsc --noEmit` 或 `go vet`。
4. 通過才寫進硬碟，建立 checkpoint。
5. 失敗就丟掉 staging，原始檔案完好如初，compiler 錯誤訊息完整回傳給 Agent。

壞掉的程式碼永遠不會進到檔案系統。這聽起來很基本，但沒有這個機制的時候，我們被 Agent 改壞過好幾次。

### Checkpoint Resume

`.opencode/state.json` 記錄每次 checkpoint：在哪個階段、改了哪些檔案、compiler 結果。如果 context 滿了必須重開 session，新 session 載入這個檔案就可以從上次中斷的地方繼續，不用重跑整個任務。

## 對應 DeepSeek Harness 的概念

後來看到 DeepSeek Harness 的論文，發現他們提出的架構概念跟我們遇到的問題幾乎一樣。DeepSeek Harness 底層用 [Cordis](https://github.com/cordiverse/cordis) 當 plugin 框架 — 模型配接器、工具註冊表、session log、agent loop 全部都是可替換的 plugin。

| Harness 概念 | 我們的解法 |
|-------------|-----------|
| Session Log（事件溯源） | `.opencode/state.json` checkpoint log |
| Code Mode（批次工具呼叫） | `apply_patch` + compiler verify |
| Plugin 系統 | MCP 協定 + GraphifyPlugin trait |
| 可觀測性 | `skeleton_extract` 90%+ token 壓縮 |

我們不是先有架構再寫工具，是先有痛才做工具，然後發現這些工具剛好可以拼成一個架構。

## Session Log 與長期記憶的區別

Harness 論文把記憶分成兩層，這個區分我們也是實作後才體會到：

- **Session Log**：單次任務的執行軌跡。短暫、用完就丟。StateMachineMcp 的 `state.json` 負責這層。
- **Vault Memory**：跨 session 的持久知識。專案規則、架構決策、設定值。OpenCode 的 `ctx_memory` 負責這層。

兩者不能互相取代。Session log 讓任務內可恢復，vault memory 讓任務之間有連續性。

## 實際成本

這組工具跑在每月約 $10 的 BytePlus 方案上，加上一台有 GPU 的本機機器做 Qdrant embedding。成本控制的關鍵：

1. **輸入壓縮**：Graphify 把 AST token 減少 90%+，LLM 只看骨架。
2. **本機驗證**：StateMachineMcp 攔截編譯錯誤，不用 LLM 來修語法問題。
3. **Checkpoint resume**：context 耗盡時直接從 checkpoint 繼續，不重跑。

$10 是實際月費，不是理論上限。

## 原始碼

兩套工具都放在 GitHub 上，MIT 授權：

- [github.com/cawa0505/graphify-rust](https://github.com/cawa0505/graphify-rust)
- [github.com/cawa0505/statemachine-mcp](https://github.com/cawa0505/statemachine-mcp)

如果這些問題你也有遇到，歡迎拿去用，或給我們 feedback。
