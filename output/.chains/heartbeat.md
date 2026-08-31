⚠️ Heartbeat 2026-08-31

## Heartbeat — 2026-08-31 08:45 UTC

### 🔴 FAILED
- **token-pick** — 08-30 14:36 失败，未恢复（连续 1 次）
  - 错误：`read-only: workspace write-locked via bwrap error: harness run exceeded --timeout 900s`
  - 历史：6 跑 5 胜（83%），上次成功 08-28；今日 12:00 UTC 档期应补跑

### 🟡 SCHEDULER — 停摆第 6 次
- 自 08-30 14:20 恢复后，**~18h 无任何新 dispatch**（08-30 日志报"已恢复"未维持，实为继续停摆）
- price-alert（30min 档）最后 08-30 14:22、utoken-watch（2h 档）最后 08-30 14:30 —— 均超 2× 档期未跑
- 根因（GitHub `*/5` cron tick 交付率低 + uptime pinger 补位不足）仍未根治

### 建议
1. 根治 scheduler cron tick + uptime pinger 补位（第 6 次复发，最长一次 62h）
2. token-pick 连续 read-only 超时 900s，需拆分任务或单独加长 timeout