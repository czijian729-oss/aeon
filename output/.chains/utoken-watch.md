⚠️ µToken watch

## µToken watch — dev 重建整套 launchpad 合约，新工厂地址已上线

**时间**: 2026-08-18 18:19:22–18:20:08 UTC（约 20 笔部署）

 🔥 新 TokenLaunchFactory
- **新工厂**: [0xB8300d93F6d127357eef5f6A9AC98F52B64B9366](https://robinhoodchain.blockscout.com/address/0xB8300d93F6d127357eef5f6A9AC98F52B64B9366)（verified）
- 新工厂仅收到 dev 5 笔 setup 调用，**尚无 created_contract → 仍未开放 token 部署**
- 旧工厂 [0x83C33B39](https://robinhoodchain.blockscout.com/address/0x83C33B39b086B03661a510Ec70a91D4d1800a3Fe) 自 17:01Z 后无新交易

 Dev 钱包
- tx 34 → 68，最新 [0x99019e76](https://robinhoodchain.blockscout.com/tx/0x99019e7683addd0653999e1486acfc1e6c037f962bcc09f8f23462fa5866ae47) @ 18:20:08Z
- 新部署: TokenLaunchFactory / HookFactory / QuoteEthSwapper / V4LiquidityHelper / SystemConfig / PlainTokenProvider / TaxCollector / SvgArtAssetsDeployer 等 ~20 个（**全栈重部署，新版本合约**）

 ⚠️ 监控建议
新工厂可能取代旧工厂作为 token 发射入口，**需考虑把 skill 监控地址更新为 0xB8300d93...**，否则可能漏掉 launch 信号。

 其他
- X @uTokenPro: 仍无法抓取（x.com 402），无新信号
- 网站 utoken.gg: HTTP 200（不变）

**结论: 尚未开放 launch，但 dev 正在快速迭代部署，距离开放很近。**