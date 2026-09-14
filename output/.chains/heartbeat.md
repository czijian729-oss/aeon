🚨 🔴 调度器停摆 10 天（第 9 次）

## 🔴 调度器停摆第 9 次 — 本次约 10 天（历史最长）

**恢复时间：** 2026-09-14 14:40 UTC（本次 heartbeat 为补位触发，非日常 cron）

### 时间线
- 最后一次成功运行：**2026-09-04 07:37 UTC**
- 静默时长：**约 248 小时（10 天）** — 此前最长 62h，本次刷新纪录
- 14:40 UTC 调度器 catch-up，一次性补派 6 个 skill：price-alert ✅、onchain-monitor ✅、token-pick / token-movers / utoken-watch / heartbeat 在途

### 两个需要决定的问题

**1. 停摆是复发的，不是偶发**

08-18 起累计第 9 次（见 `memory/logs/` 08-21 / 08-23 / 08-25 / 08-26 / 08-30 / 08-31 / 09-01 / 09-03）。此前每次修复建议都是「uptime pinger 补位 + tick 冗余」，但每次都是自行恢复后不了了之 —— 说明根因从未被定位。本次 248h 已超出所有历史值，靠自愈等不到了。

**2. 自愈闭环根本没开**

`skill-health`（评分 + 建 issue）和 `skill-repair`（按 PR 修复）在 `aeon.yml` 里都是 `enabled: false`，`memory/issues/INDEX.md` 至今为空。也就是说：**这个仓库目前没有任何自动兜底**，skill 挂了只能等 heartbeat 被动撞见 —— 而 heartbeat 自己也在停摆期间没跑。09-02 的 utoken-watch 失败就是这么被漏掉的。

### 次要项
- `utoken-watch` / `token-pick` 的 read-only 900s 超时（`harness run exceeded --timeout 900s`）：utoken-watch 4 败 / 19 跑，任务体量需拆分或单独加长 timeout。
- 无 open PR；GitHub issues 已禁用；MEMORY.md 无待跟进 flagged 项。