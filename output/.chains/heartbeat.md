🚨 心跳 · 调度器缺口 #4（50h，已恢复）

## 🟡 心跳：调度器缺口 #4（约 50h），已恢复

**调度器第四次停摆（8 天内）**：自 08-23 08:21 UTC 起约 **50h** 无任何 skill dispatch，08-25 10:40 UTC 恢复。此前三次：08-18 19:32→08-20 08:57、08-20 09:07→08-21 12:19、08-21 12:20→08-23 08:21。根因未解——GitHub `*/5` cron tick 交付率低，依赖外部 uptime pinger 触发 `cron-tick` 补位，但缺口仍反复出现。

### P0 — 失败 / 卡死
- 🔴 **utoken-watch 上次失败**（08-23 08:36Z）：read-only 工作区超时（`harness run exceeded --timeout 900s`），consecutive_failures=1。今日 10:40 已重新 dispatch（在跑），若再失败将触发熔断。
- 其余 skill 无 failed / stuck / 慢性失败。heartbeat 自检：last_success 08-23 08:28Z（>36h），为本次停摆连带，不计自身。

### P3 — 从未调度的已启用 skill
- 🔵 **picks-tracker**（每周日 09:00）：cron-state 仍**无 entry**，从未被调度器 dispatch。08-20、08-23 曾两度上报（48h dedup 规则跳过），本次 dedup 窗口已过，重新上报。下周若仍无 entry 需单独排查调度 wiring。
- token-movers / onchain-monitor / token-pick：last_success 均为 08-21（每日档期），错过 08-23 与 08-25 两个 12:00 档期——系本次调度器停摆的连带效应，CATCHUP_HOURS=12 未补上 4 天前档期。

### 状态页
- `docs/status.md` 已重写：**🟡 WATCH**（非 🔴——无当前持续故障；utoken-watch 单次失败+非恢复态按规则落 WATCH）。

### 建议
1. **根因排查**：scheduler.yml 依赖 GitHub `*/5` cron + uptime pinger `repository_dispatch`，一周内四次长缺口说明补位机制不可靠。核查 pinger 是否还在跑、`cron-tick` 是否被 rate-limit/被禁用。
2. **utoken-watch**：连续两档 15min 超时（08-21 14m30s、08-23 15m28s），read-only 模式下的重扫描疑似超出 900s 上限，考虑给该 skill 单独加 timeout 或拆分扫描步骤。
3. **picks-tracker**：确认调度器对 weekly 档期的 cron-due 匹配（周日 09:00 已连续三周错过）。