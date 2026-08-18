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

The operator is waiting for **µToken (uToken)** — a Uniswap v4 protocol launching on **Robinhood chain** — to go live. It is currently in pre-launch (contract not deployed, official X posting teasers). Your job each run: scan for launch signals and report **changes** vs the last run. Signal, not noise.

## Key facts

- **Contract address (candidate):** `0x44b28991b167582f18ba0259e0173176ca125505` (Robinhood chain)
- **Explorer (Blockscout):** `https://robinhoodchain.blockscout.com`
- **Official X:** `@uTokenPro` (https://x.com/uTokenPro)
- **Website:** `https://utoken.gg/`
- **State file:** `memory/state/utoken-watch.json` (read at start, write at end — this is how we know what changed)

## Steps

### 1. Load previous state

Read `memory/state/utoken-watch.json`. If missing, treat everything as "first run" (report current status, mark no changes).

### 2. Scan on-chain (Blockscout API, no auth)

Use `./secretcurl` or plain `curl` (no auth needed) against:

- `https://robinhoodchain.blockscout.com/api/v2/addresses/0x44b28991b167582f18ba0259e0173176ca125505`
  - `is_contract` (bool), `coin_balance` (wei), `token.name`/`token.symbol` (only present once the contract is recognised as a token), `creation_transaction_hash`, `transactions_count`
- `https://robinhoodchain.blockscout.com/api/v2/addresses/0x44b28991b167582f18ba0259e0173176ca125505/transactions?page=1&page_size=1`
  - `total` = transaction count

**Launch signals to detect (compare vs previous state):**
1. `is_contract` false → true: **contract deployed!** 🔥
2. `token.symbol` appears (was empty): **token recognised on-chain — very likely deployed/verified** 🪙
3. `creation_transaction_hash` appears: **deploy tx on chain** 📜
4. `total` tx count increased: **new transactions — possibly trading/live** 🔔
5. `coin_balance` > 0 (was 0): **contract received funds — market-making/launch likely** 💰

### 3. Scan official X

Fetch the latest 3-5 tweets from @uTokenPro. In this sandbox, prefer WebFetch against the tweet URL(s) or use the operator's local `node C:/Users/ASUS/.hermes/x_tweets.js uTokenPro 5` if available. If tweets are image-only (no text), note the URL + timestamp. Compare the latest tweet id/time vs state — a new tweet is a change to report (launch announcements often arrive as image teasers first).

### 4. Scan website

`curl -s -o /dev/null -w "%{http_code}" https://utoken.gg/` (or WebFetch). A change from 403 (Cloudflare pre-launch wall) to 200/2xx means the site is open.

### 5. Report

- If **any change** detected vs previous state: send a notification with `./notify` (title `µToken watch`, severity warn for launch signals / info otherwise), listing each changed signal with the explorer link. Also output the full report as your final message.
- If **no change**: output a one-line "no change" status (the feed needs the substance in output too — include the current snapshot: contract deployed? tx count? balance? latest tweet date). Do NOT notify (notify only on signal).

Include in every report:
- Contract: deployed? / token? / tx count / balance / explorer link
- Latest tweet (date + URL)
- Site status

### 6. Persist state

Write the current snapshot to `memory/state/utoken-watch.json`:
```json
{
  "last_run": "<ISO>",
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
- Use the exact contract address above; do not invent others.
