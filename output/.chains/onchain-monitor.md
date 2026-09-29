[onchain-monitor::add-address] 还没有在监控任何地址。直接回复粘贴一个要监控的钱包 —— 0x… 地址，可附带链名（ethereum / base / arbitrum / optimism / polygon，默认 ethereum）。默认阈值 ≥1000 美元，之后可改 memory/on-chain-watches.yml 调整。
ℹ️ On-Chain Monitor

[onchain-monitor::add-address] **On-Chain Monitor — 还没有监听地址**

监控列表仍是空的，这是第 **8** 次空跑（08-21 起每次都是 `ON_CHAIN_NO_CONFIG`）。之前 3 次 Telegram 提示（09-01 / 09-14 / 09-24）都没收到回复，所以这条路径可能压根到不了你手上。

**想加监控，两种办法都行：**

1. **直接回复这条消息**：`0x…地址 base`（链可选，默认 ethereum）
2. **直接改配置**：在 `memory/on-chain-watches.yml` 里写入

```yaml
watches:
  - label: "AEON"
    address: "0xbf8e8f0e8866a7052f948c16508644347c57aba3"
    chain: base
    type: contract
    threshold_usd: 200
    event_topics:
      - "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
```

上面这段是你的 AEON 持仓（`memory/MEMORY.md` 里记录的那个 base 合约）。挂上去就能盯大额持仓变动。

⚠️ 一个真实约束：AEON 当前报价 $1.785e-05、池子只有 ~$41.8 万，所以 `threshold_usd` 要放低（比如 200）才会触发 —— 微盘的 ERC20 转账金额普遍很小。
