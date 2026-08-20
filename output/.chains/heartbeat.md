🚨 Heartbeat 08-20

## 🔴 舰队调度停滞 · Heartbeat 08-20

**Overall: 🔴 DEGRADED** — 自 2026-08-18 19:32 UTC 后无任何 skill dispatch，状态页已 48h 未更新。

### 🔴 心跳自检
- heartbeat 上次成功 **2026-08-18 08:48 UTC**（48h 前），错过 08-19 定时调度 —— agent 可能不可靠

### 🟡 调度停滞 / 超时未跑
- price-alert（每 30 分钟）已 **36h** 未跑
- utoken-watch（每 2 小时）已 **36h** 未跑
- token-pick / token-movers / onchain-monitor（每日 12:00）已 **44h** 未跑，错过 08-19 当日运行
- picks-tracker（每周日）从未被调度

**建议**：GitHub Actions 定时器疑似停摆 —— 检查 Actions 调度是否被禁用或暂停。本次 heartbeat 于 08-20 08:58 UTC 触发。