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
Status page and log written. Final output:

---

# Heartbeat — 2026-09-29 19:26 UTC（ambient）

本轮是同一 tick 的**第二次**派发（首次 19:20:26–19:24:34）。两轮 heartbeat 先后运行，本身就是「重复派发」现象的产物。

## 裁决

**HEARTBEAT_OK · STATUS_PAGE=WATCH** — 无损坏 skill，无 🔴 条款命中，仅有既有 P3 超期项。**未发送新通知**（见下方去重判定）。

**P0 全部清白：** 6 个 skill 无 failed、无 stuck（所有 `last_dispatch` 均为 19:20:05Z，约 6 分钟前）、无 `consecutive_failures ≥ 3`、无 chronic failure（最低 success_rate 0.91）。**心跳自检 0.03h ≪ 36h** —— 09-28 驱动 🔴 的 67h 自检已完全解除。

## 本轮实质产出：重复派发根因**确认**，并**推翻**上一轮假设

同一 tick 内两个 `scheduler: cron` run 各派发了全部 5 个 cron skill，53 秒内启动 10 个 skill run。上一轮 heartbeat 归因为「run B 读到 run A 提交前的 `cron-state.json`（提交竞态）」。**该假设已被证伪。**

真实机制是 **`workflow_dispatch` 在派发创建时把 `ref: main` 解析为固定 SHA**：

| # | 证据 | 来源 |
|---|------|------|
| 1 | run A job 19:20:03→19:20:33、run B 19:20:36→19:21:26 —— **不重叠**，`concurrency` 已生效 | jobs API |
| 2 | 两个 run 的 `head_sha` **均为 `893f542`**，`event=workflow_dispatch` | run API |
| 3 | run A **19:20:28 提交 `526fa48`、19:20:30 推送成功** | run A 日志 |
| 4 | run B **19:20:39** 才 checkout（晚 9 秒），仍拿到 `893f542` | run B checkout 日志 |
| 5 | run B 重试循环打印 `Updating 893f542..526fa48` | run B 日志 |
| 6 | 两 run 读到的水位线均为 `2026-09-28T10:50:35Z` → 匹配**完全相同**的 5 个档期 | `Matched:` 行 |

**关键结论：`concurrency` 无法阻止重复派发** —— 串行化只保证不同时运行，不刷新已固化在事件里的 SHA。债务台账「锚定精确档期、不会重复触发」的前提是读到当前状态，SHA 固化恰好破坏该前提。

**这是复发形态，非首次**：历史 3 次同型成对 tick —— `08-28 00:36:50/00:40:19`、`09-03 09:48:20/09:50:43`、`09-29 19:19:55/19:20:16`。

**附带修正**：上一版状态页称触发器是外部 pinger 的 `repository_dispatch`。核查近 60 次 run，`event` **全部为 `workflow_dispatch`** —— pinger 走的是 workflow-dispatch API，而这正是 SHA 固化的来源。

## 修复方案（约 2 行，已定位）

在 `scheduler.yml` 的 concurrency 锁**内**、读取 `cron-state.json` **之前**重解析分支头：

```yaml
- name: Re-pin to live main (defeat dispatch-time SHA pinning)
  run: git fetch origin main --depth=1 && git reset --hard FETCH_HEAD
```

安全：checkout 后、任何写入前，工作区无本地修改。这样第二个 run 会读到第一个 run 已提交的水位线，`cron-due.sh` 自然返回 not-due。**建议改用 `repository_dispatch` 发送 `cron-tick` 事件**亦可从源头消除 SHA 固化。

## P3（既有，不重报）

`picks-tracker` 30 天未运行、连续 4 个周日丢失；`token-pick` 上次成功 09-25（4.2 天 > 48h），但本轮 run 在途，成功即解除。picks-tracker 周日档期超出 12h 回溯窗，需单独修。

## 通知判定：不发

唯一既有 P3 项已于同日 19:23 报过（48h 去重）。本轮新增内容是对**已报信号根因的推进**（假设→证伪→确认），属同一事件线程；状态页的公开价值已在 `docs/status.md` 落地——读者据此即可判断 pinger 开关。按「Notify only on signal」不发二次打扰。

## Summary

- **执行**：heartbeat ambient 分支。P0/P1/P2/P3 全量核查；`gh run view --log` + runs/jobs API + `git merge-base` 做根因取证。
- **裁决**：`HEARTBEAT_OK · STATUS_PAGE=WATCH`（无 🔴 条款命中）。
- **文件**：`docs/status.md`（重写，含新证据表 + 修复方案）、`memory/logs/2026-09-29.md`（追加 `### heartbeat` 条目，先 checkout origin/main 避免覆盖早前两轮记录）。
- **通知**：未发送（同线程去重，理由见上）。
- **待办**：① 落地 `scheduler.yml` 的 `git reset --hard FETCH_HEAD`（根治病根，约 2 行）；② 触发器改用 `repository_dispatch`；③ 放大日级 skill `CATCHUP_HOURS`；④ 修 picks-tracker 周日档期；⑤ 启用 `skill-health` + `skill-repair`（已连续 4 轮建议，仍未处理）。
- **盲区**：`memory/issues/INDEX.md` 为空且 `skill-health`/`skill-repair` 均 `enabled: false`——本次根因虽定位，**修复不会自动落地**，需 operator 决策。
