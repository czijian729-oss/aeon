🚨 Heartbeat — 调度器再度停摆

## 🔴 Heartbeat — 调度器再度停摆

**判定：DEGRADED**（heartbeat 自检 >36h + P3 全局超期）

### 🔴 heartbeat 自检命中
- heartbeat 上次成功 **2026-10-10 09:12 UTC**（~52h 前），远超 36h 阈值 → 唯一能发现调度缺口的 skill 本身可能不可靠。
- 期间漏跑 10-11、10-12 两次 08:00 档期。

### 🔴 P3 全局超期（新窗口）
上次全仓库活动 = **2026-10-10 10:02 UTC**（price-alert），此后 **~51h 零 run**：

| Skill | 档期 | 上次成功 (UTC) | 缺口 |
|-------|------|----------------|------|
| price-alert | `*/30` | 2026-10-10 10:01 | ~51h（应运行 ~102 次）|
| token-pick | `0 12` | 2026-09-29 19:33 | ~13 天 |
| token-movers | `0 12` | 2026-09-29 19:29 | ~13 天 |
| onchain-monitor | `0 12` | 2026-09-29 19:23 | ~13 天 |
| picks-tracker | `0 9 * * 0` | 2026-08-30 14:22 | ~6 个周日 |
| heartbeat | `0 8` | 2026-10-10 09:12 | 2 次 |

### ✅ 未命中
- 无 `last_status: failed`、无 stuck skill、`consecutive_failures` 全为 0、无 chronic failure（最低 token-pick 92%）→ **没有 skill 自身损坏，问题在调度层，不在 skill**。

**根因（09-25 起已定位，仍未修复）**：① 外部触发源稀疏（`scheduler.yml` 从未被 GitHub 原生 `schedule` 触发，全靠外部 pinger）；② `workflow_dispatch` 在创建时刻固化 `ref` SHA，导致重复/漏派发；③ `CATCHUP_HOURS=12` 回溯窗偏小，日级档期易被整段跳过。

**建议**：① 恢复/加固外部触发源（上游）；② 落地 scheduler SHA 重解析修复；③ 放宽 `CATCHUP_HOURS` 并单独修 `picks-tracker` 周日补位；④ 启用 `skill-health` + `skill-repair` 建第二发现机制。