## On-Chain Monitor — 2026-10-13

**状态：`ON_CHAIN_NO_CONFIG`**（空配置不是错误；未发告警、未写 state、未发邀约）

### 本轮结论

监控清单为空，无地址可监控，本轮正常结束于空跑路径。

| 项 | 结果 |
|---|---|
| `var` | `""`（aeon.yml 第 22 行 `onchain-monitor: { enabled: true, schedule: "0 12 * * *" }`，无 `var:`）→ 全量监控模式 |
| `memory/on-chain-watches.yml` | **不存在** |
| `memory/on-chain-state.json` | **不存在** |
| `memory/known-addresses.yml` | **不存在** |
| API 源 | alchemy=skipped, coingecko=skipped, etherscan=skipped（0 watch，无源被调用） |
| 告警 | 未发送（无事件、且空配置非错误） |
| force-reply 邀约 | **已抑制** |

### 为什么没有再次邀请添加地址

Skill 的 Config 段规定：仅在「最近 2 天日志内没有发过 `add-address` 邀约」时才发送，以免对未配置的实例每轮骚扰。上一轮 **2026-10-12（1 天前）刚发过**，且该轮日志明确记录「dedup 窗口重置 —— 下次最早可发 **2026-10-14**」。故本轮按去重规则**抑制邀约**，不重复打扰。

### 值得注意的信号

- 该 watchlist **从未被填充**——自首次调度以来每一次 onchain-monitor 运行（08-21、08-28、08-30、09-01、09-14、09-24、09-25、09-29、10-12 及今日）都以 `ON_CHAIN_NO_CONFIG` 结束。**第 10 次连续空跑。**
- 累计 **5 次** force-reply 邀约（09-01 / 09-14 / 09-24 / 09-29 / 10-12）**均无回复**，重复邀请未收敛。
- 调度正常：档期 `0 12 * * *`，本日 12:00 槽触发；上一轮为 10-12（1 天前）。

### 建议（留给操作者）

若近期**暂无地址**要盯：把 `aeon.yml` 中 `onchain-monitor: { enabled: true, ... }` 改为 `enabled: false`，省下每天一次的运行成本；等有地址了再改回 `true` 并回复一次邀约即可。若**有**地址，直接回复本轮/上一轮的 Telegram 邀约，格式 `0x… base`（或 `0x… ethereum|arbitrum|optimism|polygon`），skill 会自动追加为 watch。

---

## Summary

- **执行**：`skills/onchain-monitor/SKILL.md`，结束于 `ON_CHAIN_NO_CONFIG` 空跑路径（未发告警、未写 state）。
- **核验**：确认三个配置/状态文件均不存在；确认 `aeon.yml:22` 无 `var:`；确认最近 2 天日志内已有 `add-address` 邀约（10-12）→ 本轮按去重规则抑制邀约。
- **文件改动**：`memory/logs/2026-10-13.md` 追加 `### onchain-monitor` 日志段（含 `ON_CHAIN_NO_CONFIG` 状态、来源页脚、第 10 次连续空跑记录与建议）。
- **未发送**：`./notify`（空配置无信号，按 skill 规则保持静默）。
- **后续动作**：无（等待操作者回复地址或关闭该 skill）。无需 PR——仅追加日志。
