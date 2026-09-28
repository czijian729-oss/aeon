⚠️ heartbeat · 调度器 67h 空窗

🔴 **heartbeat 自检告警 · 调度器出现 67h 派发空窗**

**P0 — 无损坏 skill，但 heartbeat 自检触发 🔴**
- 6 个 skill 全部 `last_status=success`；无 stuck、无连续失败、无 chronic failure（最低 success_rate = token-pick 0.91）
- **heartbeat 自身 `last_success` = 2026-09-25 15:34 UTC，距今 67h（> 36h 阈值）** → 命中自检条款，公开状态页判为 🔴 DEGRADED

**新增事实：09-26 / 09-27 全仓库零运行**
- 09-25T15:30 → 09-28T10:50 = **67h 空窗**，其间无任何 tick，也无任何 skill 日志
- 今天 10:50 UTC 的 tick 已恢复，但只补派了 **heartbeat**（08:00 档期落在 12h 回溯窗内）与 **price-alert**（30 分钟档期）

**⚡ 未来 13 小时是关键窗口**
- token-pick / token-movers / onchain-monitor 的档期是 **12:00 UTC**。按补位模型（`CATCHUP_HOURS=12`，判定锚定 tick 时刻回溯 12h），只有落在 **[12:00, 24:00) UTC** 的 tick 才能补上今天的日级轮转
- 若该窗口内没有 tick → 这 3 个 skill 将连续第 4 天断档

**P3 — picks-tracker 第 4 个周日连续丢失**
- 周日 09-27 同样无 tick，`0 9 * * 0` 档期再次整周落空（Sunday 09:00 超出回溯窗，tick 最早只能回溯到 Sun 22:00）
- 自 2026-08-30 起 **29 天**未运行，是唯一从未恢复到档期内的 skill（09-25 时为 26 天）

**盲区已具体化**
- 09-25 建议的「启用 skill-health + skill-repair」仍未处理。这两天空窗内没有任何日志条目 —— 若无 heartbeat，这段盲区不会被任何人发现

**建议（按优先级）**
1. 根治触发源：降低对稀疏外部 pinger 的依赖，或显著提高其频率（所有问题的上游）
2. 对 `0 8` / `0 12` 日级 skill 放大 `CATCHUP_HOURS`
3. 单独修正 picks-tracker 的周日档期补位
4. 启用 `skill-health` + `skill-repair`，建立第二发现机制