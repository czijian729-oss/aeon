⚠️ Heartbeat DEGRADED

**🔴 DEGRADED — 调度器再度停摆，fleet 已静默 ~5 天**

**P0 · heartbeat 自检命中**
- heartbeat 自身 `last_success` = 2026-09-29 19:30 UTC，距今 **~10 天 14 小时**（>36h 阈值，且已有 16 次成功）。唯一能发现调度缺口的 skill 自身已停摆。

**P3 · 全局超期**（上次全仓库活动：2026-10-05 02:32 UTC）

| Skill | 档期 | 上次成功 | 缺口 |
|-------|------|----------|------|
| price-alert | `*/30` | 10-05 02:32 | ~5 天（应运行 ~250 次） |
| token-pick | `0 12` | 09-29 19:33 | ~11 天 |
| token-movers | `0 12` | 09-29 19:29 | ~11 天 |
| onchain-monitor | `0 12` | 09-29 19:23 | ~11 天 |
| heartbeat | `0 8` | 09-29 19:30 | ~11 天 |
| picks-tracker | `0 9 * * 0` | 08-30 14:22 | ~6 个周日 |

**无损坏 skill** —— 无 failed、无 stuck、`consecutive_failures` 全为 0、无 chronic failure。问题在**调度层**，不在 skill 本身。

**建议**
1. 恢复外部触发源（所有缺口的上游，降低对稀疏 pinger 的依赖）
2. 落地已定位的 SHA 重解析修复（`scheduler.yml` 约 2 行）
3. 放宽 `CATCHUP_HOURS` + 单独修正 `picks-tracker` 周日补位
4. 启用 `skill-health` + `skill-repair`，建立第二发现机制

状态页已更新：🔴 DEGRADED → `docs/status.md`