⚠️ heartbeat — 2026-09-29

## heartbeat — 2026-09-29 19:23 UTC

**总体：🟡 WATCH（无故障 skill；页面由上一轮 🔴 降为 🟡）**

本轮无 🔴 项。6 个 skill 全部 `last_status=success`，`consecutive_failures` 全为 0，无 stuck、无 chronic failure（最低 success_rate = token-pick 0.91）。上一轮触发 🔴 的 **heartbeat 自检已降至 32.5h**（< 36h 阈值），该条款清零。

### ⚠️ 新发现：同一 tick 内重复派发

- 两个 `scheduler: cron` run 相隔 21 秒先后完成：
  - `#36618469365` — job 19:20:03 → 19:20:33
  - `#36618512759` — job 19:20:36 → 19:21:26
  - 均为 `workflow_dispatch`、attempt=1、success（**非重试**）
- **二者各自派发了全部 5 个 cron skill** → 19:20:08–19:21:01 的 53 秒内共启动 10 个 skill run，每个 skill 本轮实际执行 **2 次**。
- 两个 job 在时间上**并未重叠**（间隔 3 秒），并发组已生效 → 成因更可能是**第二个 run 读到了第一个 run 提交前的 `cron-state.json`**（`last_dispatch` 水位线提交/读取竞态），而非并发失效。
- 这是补位「债务台账」模型上线以来**首次观测**到的重复派发形态。**需下一次 tick 复现以确认**——若持续，日级 skill 将以双倍频率运行，白耗 API 额度。

### 🟡 超期项（持续中，09-28 已报过，此处仅列状态）

| Skill | 档期 | 上次成功 | 超期 |
|-------|------|----------|------|
| picks-tracker | `0 9 * * 0` | 2026-08-30 | 30 天，连续 4 个周日丢失 |
| token-pick | `0 12 * * *` | 2026-09-25 | 约 4 天（> 2× 日档期） |
| token-movers | `0 12 * * *` | 2026-09-25 | 约 4 天 |
| onchain-monitor | `0 12 * * *` | 2026-09-25 | 约 4 天 |

后三者**本轮均已派发并正在运行**，若成功则超期自动解除。picks-tracker 未派发 —— 其周日 09:00 档期落在 12h 回溯窗之外。

🔵 **记忆**：`MEMORY.md` 无 flagged 待跟进项。

### 建议（按优先级）

1. **排查本次重复派发** —— `cron-state.json` 水位线的提交/读取竞态（本轮唯一新信号）。
2. 根治触发源 —— 降低对稀疏外部 pinger 的依赖（所有超期问题的上游）。
3. 对 `0 8` / `0 12` 日级 skill 放大 `CATCHUP_HOURS`。
4. 单独修正 picks-tracker 的周日档期补位逻辑。
5. 启用 `skill-health` + `skill-repair`，补上调度缺口期内的自愈盲区。