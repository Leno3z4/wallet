# wallet

A multichain EVM wallet focused on simple payments, human-readable transaction review, wallet memory, and Circle-powered stablecoin infrastructure.

## Stack

- Next.js + React + TypeScript
- Privy for Google authentication and embedded EVM wallets
- viem for EVM reads and transaction primitives
- LI.FI for mainnet swap / bridge routing
- Circle infrastructure for USDC, CCTP, Gateway, and Circle product integrations

## Circle product surface

The `/circle` page now brings together Circle's current developer stack in the wallet UX:

- USDC and EURC asset model
- Circle Wallets
- Circle Contracts
- CCTP
- Gateway unified USDC
- Paymaster USDC gas abstraction
- Gas Station sponsored fees
- Compliance Engine transaction screening
- Modules for programmable onchain actions
- App Kits for send / swap / bridge application flows
- Arc settlement network
- xReserve USDC-backed stablecoins
- Circle Payments Network for global partner settlement
- Circle Mint for institutional mint / redeem flows
- x402 for USDC-powered internet / agent payments
- Circle Console developer management

Gateway testnet balances are queried through Circle's Gateway API, and CCTP testnet Fast Transfer allowance + route fee data are queried from Circle's public APIs. Products requiring developer credentials, smart-account infrastructure, merchant onboarding, or institutional access are shown as ready / partner integrations rather than being falsely marked live.

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

## Current app

- Google login
- Automatic embedded EVM wallet creation
- Multichain live native + USDC balance reads
- Real ETH and USDC transfer signing through Privy
- Human-readable transfer review
- Mainnet-only LI.FI swap and bridge quotes with executable transaction requests
- Circle Gateway unified-USDC balance visibility on testnet
- Circle CCTP testnet Fast Transfer allowance and fee visibility
- Username-based recipient resolution
- Page switcher dropdown in the top bar
- Dedicated chain pages for every enabled mainnet and testnet
- Clean, neutral visual system with no decorative gradients

## Notes

Testnet assets have no financial value. The buy / sell surface is provider-ready but fiat onramp/offramp requires a configured provider and the appropriate compliance flow. Full cross-site Web3 browser provider injection requires a browser extension or mobile deep-link environment; the web app keeps the browser surface intentionally isolated.
