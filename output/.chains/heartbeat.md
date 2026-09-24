🚨 舰队心跳 — 调度器第 10 次失效

## 🔴 舰队心跳 — 调度器第 10 次失效

**全舰队 cron 停摆 ~239h**（2026-09-14 14:43 UTC → 现在），是历次最长窗口之一。

### 本轮形态与前几次不同

调度器**并非完全静默** —— 这 10 天里它零星派发了 4 次 `price-alert`（09-15 / 09-16 / 09-21 / 09-23），但 `*/30` 的预期约 **477** 次，实际 ≈ **0.8%**。其余 6 个 cron skill **一次未派发**。

> cron tick 部分存活、按 skill 的匹配/派发逻辑异常 —— 比"整体被禁用"更可能是根因，建议优先查这一层。

### 🟡 停摆导致的产出缺口

| Skill | 调度 | 上次成功 | 缺口 |
|---|---|---|---|
| token-pick | 12:00 每日 | 09-14 | 10 天 |
| token-movers | 12:00 每日 | 09-14 | 10 天 |
| onchain-monitor | 12:00 每日 | 09-14 | 10 天 |
| heartbeat | 08:00 每日 | 09-14 | 10 天 |
| price-alert | */30 | 09-23 | 30h |
| picks-tracker | 周日 09:00 | 08-30 | 3 个周期 |

**无 failed 态 skill** —— cron-state 内全部 `last_status=success`，`consecutive_failures` 全为 0，成功率 89%–100%。**没有一个是 skill 自身坏了，全部是"没被派发"。**

### 🟡 自愈闭环仍未启用

`skill-health` 与 `skill-repair` 在 `aeon.yml` 中依旧 `enabled: false`，`memory/issues/INDEX.md` 空。停摆期间 heartbeat 自身也不运行 → 期间任何 skill 失败都是**完全盲区**（09-02 的 utoken-watch 失败就是这样漏掉的）。

### 建议

1. **查调度器派发逻辑** —— 重点看为什么 price-alert 能过、其余 6 个不能过；检查 scheduler workflow 的 cron 匹配与 catch-up 分支。
2. **启用 `skill-health` + `skill-repair`** —— 停摆时没有第二个发现机制。
3. `token-pick` 的 900s read-only 超时仍未处理（1 失败 / 9 运行）。

---

*P1：无 open PR；GitHub issues 已禁用 · P2：MEMORY.md 无待跟进项 · 状态页已更新（🔴 DEGRADED）*