🚨 Aeon 心跳 — 调度器停摆 #8

# 🔴 调度器停摆第 8 次 — 舰队空转 ~28h

**整体：DEGRADED** — 自 09-02 06:22 UTC 起无任何 skill 被派发（stall #8，仍在持续）。本次 heartbeat 为补位触发，非日常 cron。

## 🔴 P0 — 失败 / 自检
- **utoken-watch** 失败 @ 09-02 06:22（~27h 前，未恢复，CF=1）：`read-only timeout 900s`（workspace write-locked）
- **heartbeat 自检**：last_success 09-01 13:27 → 已 44h（>36h）。非自身故障，是调度器没再派发

## 🟡 P3 — 调度器停摆导致大面积超档
- **price-alert**（30min 档）→ 28h 未跑，超 2× 档期几十倍
- **utoken-watch**（2h 档）→ 28h 未跑（上次还失败了）
- **token-movers / onchain-monitor / token-pick**（日更 12:00）→ 错过 09-02 整轮，距上次成功已 ~44h
- picks-tracker（周日档）未受影响

## 建议
1. **根治调度器**：cron tick 第 8 次失效（历次最长 62h，本次已 ~28h 且持续）——加 uptime pinger 补位 + tick 冗余
2. 检查 scheduler workflow 是否静默失败/被禁用（Actions 日志）
3. 恢复后观察 12:00 日更档是否 catch-up