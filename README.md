# wallet

A multichain EVM wallet focused on simple payments, human-readable transaction review, and wallet memory.

## Stack

- Next.js + React + TypeScript
- Privy for Google authentication and embedded EVM wallets
- viem for EVM reads and transaction primitives
- LI.FI for mainnet swap / bridge routing
- Circle USDC infrastructure patterns for stablecoin payments, CCTP, Gateway, and Paymaster-ready UX

## Google + automatic wallet creation

Configure Google as a login method in Privy and enable embedded Ethereum wallets with `createOnLogin: 'users-without-wallets'`.

Set:

```bash
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
```

## Global usernames

Users can reserve a username such as `Centry`. Matching is case-insensitive, so `Centry`, `centry`, and `CENTRY` all resolve to the same canonical username. The selected display casing is preserved.

Global uniqueness is stored in Supabase. Run `supabase/usernames.sql`, then configure:

```bash
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

The transfer flow accepts either a `0x…` address or `@username` and resolves the username before signing.

## Supported EVM networks

Mainnets: Ethereum, Base, Arbitrum, Optimism, Polygon.

Testnets: Ethereum Sepolia, Base Sepolia, Arbitrum Sepolia, Optimism Sepolia, Polygon Amoy.

Every network has its own page under `/networks/<network-key>`, while the same EVM wallet address can be used across the network set.

## Circle features used in the product model

- Circle-issued USDC addresses are tracked for the supported mainnets and testnets.
- Circle CCTP V2 contract/domain metadata is included for USDC burn-and-mint bridging.
- Circle Gateway is represented as the unified-USDC liquidity path for compatible integrations.
- Circle Paymaster is represented as a gas-with-USDC option for ERC-4337 smart-account deployments; the current Privy wallet is still an EOA, so Paymaster execution is not falsely presented as enabled.

## Current app

- Google login
- Automatic embedded EVM wallet creation
- Multichain live native + USDC balance reads
- Real ETH and USDC transfer signing through Privy
- Human-readable transfer review
- Mainnet-only LI.FI swap and bridge quotes with executable transaction requests
- Username-based recipient resolution
- Separate Assets, Transfer, Swap, Bridge, Buy / sell, Transactions, People, Browser, Networks, Connected dapps, and Settings pages
- Page switcher dropdown in the top bar
- Dedicated chain pages for every enabled mainnet and testnet
- Clean, neutral visual system with no decorative gradients

## Notes

Testnet assets have no financial value. The buy / sell surface is provider-ready but fiat onramp/offramp requires a configured provider and the appropriate compliance flow. Full cross-site Web3 browser provider injection requires a browser extension or mobile deep-link environment; the web app keeps the browser surface intentionally isolated.
