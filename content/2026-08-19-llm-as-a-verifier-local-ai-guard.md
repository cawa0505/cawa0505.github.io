+++
title = "窮人的 LLM-as-a-Verifier：16GB 顯卡 + ROCm 打造地端 0 成本 Agent 審查閘門"
date = 2026-08-19T05:52:06Z

[taxonomies]
tags = ["llm", "ai", "roc m", "amd", "verifier", "guardrail"]
+++
# 窮人的 LLM-as-a-Verifier：16GB 顯卡 + ROCm 打造地端 0 成本 Agent 審查閘門

**TL;DR:** 本文專為不想被雲端 API 掏空錢包、又害怕 AI Agent 盲目重構改爆 Codebase 的開發者而寫。我們將利用 AMD 16GB 顯卡、Linux ROCm (HIP) 硬體加速，搭配 Rust 編寫的確定性 2PC 防禦門衛，手刻一套符合 PRM（Process Reward Model）大廠規格的地端零成本 AI 外骨骼系統。

## 1. 痛點：Agent 狂歡背後的「帳單破產」與「代碼毀滅」

Autonomous Coding Agent（如 OpenCode, Claude Code 等）徹底改變了開發流程，但隨之而來的兩大噩夢：

- **Token 黑洞與 API 帳單爆表**：為了確保代碼品質，Agent 需要頻繁進行自我思考、多方案 Comparison（Best-of-N）與長鏈修復，幾輪對話下來，雲端 API 帳單迅速失控。
- **確定性缺失（Non-determinism）**：沒有 Guardrail 攔截的 Agent 就像沒有導航的賽車——隨時可能在背景修改全域 Interface、弄爛 DB Schema，甚至產生語法幻覺。

**解答**：我們需要 Verifier（過程監督者）。但大廠論文動輒使用 A100 叢集與 vLLM 預分配幾十 GB 顯存，一般開發者根本無法負擔。我們需要一套在地端 16GB 顯存上順暢運行的「窮人版 Process Supervision 體系」。

## 2. 硬體與驅動層：為什麼選擇 16GB AMD + ROCm (HIP)？

在 Homelab / Linux (CachyOS) 環境下，利用 16GB AMD 顯卡搭配 ROCm Backend 是極致 CP 值的甜點組合：

- **HIP 矩陣加速與 VRAM 吞吐**：透過 ROCm 原生 HIP 加速，讓 16GB VRAM 輕鬆咬住 Qwen2.5-Coder-7B（代碼語意）與 Qwen3.5 9B VL（多模態視覺）。
- **擺脫 vLLM 顯存黑洞**：vLLM 預分配 90% 顯存的機制在單機多任務環境是災難。改用 ROCm 版本的 llama-server（GGUF 量化），模型權重僅吃 5~9 GB 顯存，剩餘空間還能動態分配 KV Cache，並讓主機順暢跑其他服務。
- **0 API 成本**：2PC（兩階段提交）觸發一萬次 `/v1/directed` 評分，消耗的僅有幾角電費，徹底消除 Token 焦慮。

## 3. 架構哲學：三層確定性防禦外骨骼 (Tri-Layer Harness)

這套系統的核心思想是：「把 LLM 從掌控系統寫入權的執行者，降級為必須提交合法提案的實習生。」

```
┌────────────────────────────────────────────────────────────────────────┐
│ omo-slim / OpenCode Orchestrator                                       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ 1. 2PC Proposal (Diff / AST Delta)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ guardrail-mcp (確定性 2PC 閘門 Gateway)                                 │
│                                                                        │
│  Track 1: Hard Guard (Rust / graphify-core AST 結構檢查)               │
│  └── 毫秒級短路攔截 (Short-Circuit)，語法錯誤/違規直接退回 (0 顯存)    │
│                                                                        │
│  Track 2: Soft Guard (地端多模態語意審查)                               │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ 2. POST /v1/directed
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ docker-llm-as-a-verifier (地端 ROCm Backend / llama-server)            │
│ └── Unsloth Qwen3.5 9B VL / Qwen2.5-Coder 7B (GGUF)                    │
└────────────────────────────────────────────────────────────────────────┘
```

- **graphify (AST & Context Manager)**：Rust 撰寫，負責代碼拓撲分析與動態 Token 剪枝，只餵給 Agent 資訊密度最高的 Minimal Sub-graph。
- **guardrail-mcp (State Machine & 2PC Gateway)**：獨立 MCP 門衛。強制執行兩階段提交（Phase 1: Proposal → Phase 2: Guard Check → Issue commit_token）。
- **docker-llm-as-a-verifier (PRM Evaluation Server)**：Docker 包裝的本地審查容器，透過 ROCm 加速提供細粒度評分。

## 4. 實作拆解：REST API 規格對齊大廠 PRM 過程監督

`docker-llm-as-a-verifier` 提供 7 隻完備的 REST API，實現高階 Process Supervision 原語：

| Endpoint | Method | 2PC 實戰調用場景 |
|----------|--------|-----------------|
| `/v1/directed` | POST | **[核心]** 給定原 Task，比對舊代碼 A 與新修復 B，回傳 Preference Score 與 accepted 標記 |
| `/v1/select` | POST | **[Best-of-N]** 從 Agent 產生的 N 個修復提案中挑出分數最高且最安全的 AST 變更 |
| `/v1/track` | POST | **[軌跡監控]** 每步 Action 後評估進度。若發現 Agent「越改越爛」，立即短路中斷 |
| `/v1/compare` | POST | 快速 A/B Testing 雙案評分 |
| `/v1/score-pairs` | POST | 批次跑迴歸測試與評測 |
| `/health` | GET | 系統健康度檢查 |
| `/v1/usage` | GET | 地端 Token 累積統計 |

## 5. 實測閉環：從 Proposal 攔截到 Micro-Patching (局部微修復)

當 Agent 提出帶有隱患的程式碼修改時，系統的實測防禦閉環如下：

1. Coder Agent 發起變更提案 (Proposal)。
2. guardrail-mcp 觸發 Track 1：graphify-core 掃描發現 Interface 斷層。
3. 若通過 Track 1，觸發 Track 2：打 HTTP POST 到 Docker `/v1/directed` (ROCm 9B VL)。
4. Verifier 判定 REJECTED，回傳 Payload：
   ```json
   {
     "status": "REJECTED",
     "reason": "Signature mismatch on UserRepositoryInterface",
     "ast_node_id": "Node#402"
   }
   ```
5. Orchestrator 擷取 `ast_node_id`，指示 Agent 只針對 `Node#402` 進行局部 Micro-patching，禁止重讀全量長檔！

**雙重驗證優勢**：前端 UI 變更可進一步讓 Qwen3.5 9B VL 直接審查 Playwright 渲染截圖（Visual Guard），確保無跑版或 CSS 斷層。

## 6. 結語：將主控權與算力奪回地端

我們不需要幾十萬的 A100 顯卡叢集，也不需要每月給雲端 API 巨頭交保護費。透過 Rust 確定性圖譜 + 2PC 狀態機閘門 + AMD ROCm 本地多模態 Verifier，我們在萬餘元的消費級顯卡上，打造出了一套完全私有化、零隱私洩漏、且具備大廠級別 PRM 審查能力的 AI 防禦外骨骼。

**相關開源儲存庫：**
- 2PC 防禦門衛：[github.com/cawa0505/guardrail-mcp](https://github.com/cawa0505/guardrail-mcp)
- 地端驗證容器：[github.com/cawa0505/docker-llm-as-a-verifier](https://github.com/cawa0505/docker-llm-as-a-verifier)
