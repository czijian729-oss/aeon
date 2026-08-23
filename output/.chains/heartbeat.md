🚨 Heartbeat · 2026-08-23

## Heartbeat · 2026-08-23

🔴 **DEGRADED — 调度器第三次停摆**

- 调度缺口 #3：**08-21 12:20 → 08-23 08:21 UTC（约 44h）** 无任何 skill dispatch，今晨 08:21 才恢复。一周内第三次（08-18 19:32→08-20 08:57、08-20 09:07→08-21 12:19、08-21 12:20→08-23 08:21）。
- 已恢复：price-alert 已重新跑成功（08:23 ✅）；heartbeat、utoken-watch 本次 dispatch 在跑。
- 连带：token-pick / token-movers / onchain-monitor 今日 12:00 档期未触发（缺口期）；heartbeat 自检 last_success 44h（>36h stale）。
- **根因未解**：scheduler workflow 已连续三次间歇性不触发，需核查 cron 触发/uptime pinger 配置，否则可能再次停摆。

🔵 **picks-tracker 从未调度**

- 每周日 09:00 档期，cron-state 无任何 entry（从未 dispatch）。**今天 09:00 UTC 又要到了**——若仍未触发即漏掉第二周。建议单独核查。

_状态页：docs/status.md（🔴 DEGRADED）_