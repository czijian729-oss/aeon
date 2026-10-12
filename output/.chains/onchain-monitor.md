ℹ️ On-Chain Monitor · 待配置

[onchain-monitor::add-address] **onchain-monitor** 还没有任何监控地址 —— 这已是自首次调度以来的**第 9 次空跑**（上一次邀约 2026-09-29，至今未收到回复）。在此之前它是不会产生任何信号的。

**贴一个地址就能开始。** 直接回复本条消息，格式：

`0x… [链名]`

- 链名可省略，默认 `ethereum`；也支持 `base` / `arbitrum` / `optimism` / `polygon`
- 例：`0xbf8e8f0e8866a7052f948c16508644347c57aba3 base`

我会自动把它加入监控列表，开始盯该地址的大额转账（默认阈值 ≥ $1000），有异动即在触发时告警。之后想调整链、类型（wallet/contract）或金额阈值，直接编辑 `memory/on-chain-watches.yml` 即可。

（你也可以监控自己持有的代币合约 —— 上面那条例子里用的就是 base 上 AEON 的合约地址。）