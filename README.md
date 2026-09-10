# wallet

A multichain EVM wallet focused on simple payments, human-readable transaction review, and wallet memory.

## Stack

- Next.js + React + TypeScript
- Privy for Google authentication and embedded EVM wallets
- viem for EVM reads and transaction primitives
- LI.FI for swap / bridge routing

## Google + automatic wallet creation

Configure Google as a login method in Privy and enable embedded Ethereum wallets with `createOnLogin: 'users-without-wallets'`.

Set:

```bash
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
```

Then:

```bash
npm install
npm run dev
```

## Supported EVM networks

Ethereum, Base, Arbitrum, Optimism, and Polygon use the same EVM wallet address. Network selection happens at the transaction layer.

## Current app

- Google login
- Automatic embedded EVM wallet creation
- Multichain live native + USDC balance reads
- Real ETH and USDC transfer signing through Privy
- Human-readable transfer review
- LI.FI swap quotes and executable transaction requests
- LI.FI cross-chain bridge quotes and executable transaction requests
- Receive page with the live wallet address
- Separate Assets, Transfer, Swap, Bridge, Buy / sell, Transactions, People, Browser, Networks, Connected dapps, and Settings pages
- Clean, neutral visual system with no decorative gradients

## Notes

The buy / sell surface is provider-ready but fiat onramp/offramp requires a configured provider and the appropriate compliance flow. Full cross-site Web3 browser provider injection requires a browser extension or mobile deep-link environment; the web app keeps the browser surface intentionally isolated.
