# service-mesh (Day 999) review

**Verdict**: needs-edit

**Summary**: 整體骨架紮實，事實大致正確、tradeoffs 平衡、L3 定位合理（明確假設 K8s + 微服務經驗）。3 題 quiz 干擾選項強度可，但有 2 個小修建議跟 1 個 fact-check warn。

## Issues

### · [nit] `body` 第二段
- 「complexity 上升一個量級」可換成更具體的描述（e.g. 「多了 control plane 跟 N 個 sidecar 要維護、debug 時要看 envoy log」）讓讀者更有畫面。
- → 改成：「complexity 上升一個量級——你多了一整層 control plane + N 個 sidecar 要監控、升級、備援、debug。」

### ⚠️ [warn] `body` mTLS 描述
- 文中說 sidecar 處理 mTLS，但沒提這個 mTLS 是 service-to-service（east-west），不是 client-to-mesh（north-south）。讀者可能誤會 mesh 也處理 ingress TLS termination。
- → 在 body 加一句：「mesh 主要管 east-west（服務間）通訊；ingress / 對外加密通常還是另一層（Ingress controller / API gateway）。」

### · [nit] `originStory` Cilium 描述
- 「跳過 sidecar 開銷」這個說法不完全準確——Cilium 用 eBPF 在 kernel layer 攔截，仍有 overhead 只是不需要單獨 proxy process。
- → 改成：「跳過 user-space sidecar 額外的 process 開銷（仍有 eBPF 攔截 overhead，但延遲明顯較低）」

### · [nit] `questions[2]` 第 5 點失敗模式
- 「mTLS cert rotation 出錯」這個例子很好，但其實大部分 mesh 都自動 rotate，是 control plane 出問題才會壞。可以更精準。
- → 改成：「control plane 故障期間 cert 無法 rotate，最終導致服務間 TLS 失效」

### · [nit] `tracks`
- 目前 `["backend", "devops"]`。考慮加 `"frontend"`？不建議——Service Mesh 跟前端沒關係。保持原樣。

## 整體建議

修上面 3 個 nit + 1 個 warn 之後可以合併。Recap question 品質不錯，可考慮直接收進 batch（如果 release day 落在某個 batch 範圍內）。

## 預計需要的編輯時間：~5 分鐘
