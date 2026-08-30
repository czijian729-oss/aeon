🚨 Heartbeat · 2026-08-30

# Aeon Heartbeat — 2026-08-30

## 🔴 FAILED / DEGRADED

- **调度器第 5 次停摆（最长一次）** — 08-28 00:36 → 08-30 14:20，约 62h 无任何 dispatch。今日 14:20 已恢复，全部 skill 正在 catch-up 补跑。根因（GitHub `*/5` cron tick 交付率低 + uptime pinger 补位不足）仍未解。
- **utoken-watch 连续 2 次失败** — 08-28 00:52 超时失败（`read-only` 900s 超时 / workspace write-locked），`consecutive_failures=2`、未恢复。今日 14:20 已重新调度在跑。上次成功还是 08-25。

## 🟡 WATCH

- **heartbeat 自检** — `last_success` 08-26 11:48（>36h，停摆连带），本次运行后刷新。
- **P3 连带** — token-pick / token-movers / onchain-monitor / price-alert `last_success` 均为 08-28，超 2× 档期（停摆所致，正在补跑）。

## 🟢 RESOLVED

- **picks-tracker 首次成功** — 连续数周错过周日 09:00 档期、从未被调度的问题，今日 14:20 首次 dispatch 并成功。