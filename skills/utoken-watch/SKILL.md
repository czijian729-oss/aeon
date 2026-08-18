---
name: utoken-watch
description: "Watch µToken (uToken) on Robinhood chain for launch signals: contract deployment, token recognition, first transactions, funding, official tweets, and site availability. Report any change immediately. read-only."
metadata:
  title: uToken Watch
  mode: read-only
  category: crypto
  var: ""
  tags:
    - crypto
    - watch
  requires:
  capabilities:
    - external_api
    - sends_notifications
---

> **${var}** — optional: `deep` for a deeper analysis pass (websearch for project news). Empty = standard watch check.

## Mission

The operator is waiting for **µToken (uToken)** — a Uniswap v4 protocol launching on **Robinhood chain** — to go live. The dev wallet has already deployed the full V4 launchpad contract suite (factory, hooks, liquidity helper, swapper, marketplace, offers), but the **token itself is NOT yet launched**. Your job each run: scan for launch signals and report **changes** vs the last run. Signal, not noise.

## Key facts

- **Dev wallet (deployer):** `0x02ed43292c6be3f49f2b287c499c77560e426e83` — deployed the entire V4 launchpad suite on 2026-08-18 ~15:56 UTC. Watch its new transactions & new contract deployments.
- **Factory (token launcher):** `0x83C33B39b086B03661a510Ec70a91D4d1800a3Fe` — verified. A **new `created_contract` from this factory = the token is LAUNCHED** 🔥. Other wallets (0x87B53fdcD3, 0x8523d26248) are already calling it — watch closely.
- **Contract address (candidate, may be stale):** `0x44b28991b167582f18ba0259e0173176ca125505` (Robinhood chain)
- **Explorer (Blockscout):** `https://robinhoodchain.blockscout.com`
- **Official X:** `@uTokenPro` (https://x.com/uTokenPro)
- **Website:** `https://utoken.gg/`
- **State file:** `memory/state/utoken-watch.json` (read at start, write at end — this is how we know what changed)

## Steps

### 1. Load previous state

Read `memory/state/utoken-watch.json`. If missing, treat everything as "first run" (report current status, mark no changes).

### 2. Scan dev wallet (Blockscout API, no auth)

Use `./secretcurl` or plain `curl` (no auth needed):

- `https://robinhoodchain.blockscout.com/api/v2/addresses/0x02ed43292c6be3f49f2b287c499c77560e426e83/transactions`
  - The latest item's `hash`, `timestamp`, and `nonce` = dev activity. A **new latest tx hash vs state** = the dev just did something (report it).
  - Any item with `created_contract` not null = the dev deployed a **new contract** (could be the token or launch infra). Report with the contract address + explorer link.

### 3. Scan factory for token launch (the big one)

- `https://robinhoodchain.blockscout.com/api/v2/addresses/0x83C33B39b086B03661a510Ec70a91D4d1800a3Fe/transactions`
  - Look for any tx where `created_contract` is not null. That is the **token contract being deployed** — LAUNCH 🔥. Report immediately with the token address + explorer link.
  - Also note new inbound calls (new `from` addresses or new latest tx) — team/others interacting with the launcher.

### 4. Scan candidate contract (secondary)

- `https://robinhoodchain.blockscout.com/api/v2/addresses/0x44b28991b167582f18ba0259e0173176ca125505`
  - `is_contract` false → true: contract deployed.
  - `token.symbol` appears: token recognised on-chain.
  - `creation_transaction_hash` appears: deploy tx on chain.

### 5. Scan official X

Fetch the latest 3-5 tweets from @uTokenPro. Prefer WebFetch against the tweet URL(s), or the operator's local `node C:/Users/ASUS/.hermes/x_tweets.js uTokenPro 5` if available. A new tweet id/time vs state = a change to report.

### 6. Scan website

`curl -s -o /dev/null -w "%{http_code}" https://utoken.gg/` (or WebFetch). 403 = pre-launch wall, 200/2xx = open. A change is reportable.

### 7. Report

- If **any change** detected vs previous state: send a notification with `./notify` (title `µToken watch`, severity warn for launch signals / info otherwise), listing each changed signal with the explorer link. Also output the full report as your final message.
- If **no change**: output a one-line "no change" status (include the current snapshot: dev latest tx? factory launched? candidate deployed? site code? latest tweet date). Do NOT notify.

Include in every report:
- Dev wallet: latest tx time/hash + any new deployments
- Factory: launched? (created_contract) + latest activity
- Candidate contract: deployed? token? tx count? balance?
- Latest tweet (date + URL)
- Site status

### 8. Persist state

Write the current snapshot to `memory/state/utoken-watch.json`:
```json
{
  "last_run": "<ISO>",
  "dev_last_tx_hash": "<hash>",
  "dev_last_tx_time": "<ISO>",
  "dev_tx_count": <int>,
  "factory_last_tx_hash": "<hash>",
  "factory_last_tx_time": "<ISO>",
  "factory_launched": <bool>,
  "launched_token": "<address or ''>",
  "is_contract": <bool>,
  "tx_count": <int>,
  "balance": "<wei string>",
  "token_symbol": "<symbol or ''>",
  "creation_tx": "<hash or ''>",
  "last_tweet_id": "<id or ''>",
  "last_tweet_time": "<ISO or ''>",
  "site_code": "<http code>"
}
```

## Constraints

- **Read-only.** Never write outside `memory/state/` (the workflow handles the log).
- Report changes, not the full history. Don't spam.
- Launch signals are rare — most runs will be "no change". That is correct behaviour.
- Use the exact addresses above; do not invent others.
