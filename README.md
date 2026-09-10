# wallet

A multichain EVM wallet focused on simple payments, human-readable transaction review, and wallet memory.

## Stack

- Next.js + React + TypeScript
- Privy for Google authentication and embedded EVM wallets
- viem for EVM primitives

## Google + automatic wallet creation

Create a Privy app and configure Google as a login method. The app is configured to create an embedded Ethereum wallet automatically for users who do not already have one.

Set:

```bash
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
```

Then:

```bash
npm install
npm run dev
```

The supported EVM networks in the first UI pass are Ethereum, Base, Arbitrum, Optimism, and Polygon. The wallet address is chain-agnostic; network selection is handled at the transaction layer.

## Current MVP

- Google login
- Automatic embedded EVM wallet creation
- Multichain network overview
- Wallet address + copy
- Send flow with transaction review step
- Basic assets/activity layout
- Responsive desktop/mobile UI

Balances and onchain activity are the next integration layer; the current interface deliberately keeps those views lightweight until RPC/indexer choices are finalized.
