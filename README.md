# wallet

A multichain EVM wallet focused on simple payments, wallet memory, stablecoin-first infrastructure, and agent access.

## Stack

- Next.js + React + TypeScript
- Privy for Google authentication and embedded EVM wallets
- viem for EVM reads and transaction primitives
- LI.FI for mainnet swap / bridge routing
- Circle infrastructure woven into the core wallet UX
- MCP-compatible remote agent endpoint

## Agent + GPT access

The wallet exposes a remote Model Context Protocol endpoint at:

```text
/api/mcp
```

Discovery metadata is available at:

```text
/.well-known/mcp.json
```

The MCP server exposes read tools for wallet address context, supported networks, balances, username resolution, payment capabilities, and a transaction-preparation tool. Agent calls can prepare a transfer, but they cannot sign or broadcast it through MCP; the wallet remains the final authorization boundary.

For a deployed app, set an `AGENT_MCP_API_KEY` environment variable and require the agent to send it as a Bearer token. For production multi-user access, replace the shared API-key mode with an OAuth/OIDC identity binding that maps the agent session to a specific wallet user.

## Circle capabilities integrated into the wallet

Circle is not a separate destination. Its capabilities are used where they make the wallet better:

- **USDC + EURC:** first-class stablecoin assets and live balance reads where supported.
- **Gateway:** unified USDC balance visibility and a foundation for instant crosschain liquidity and nanopayments.
- **CCTP:** preferred native-USDC rail for supported crosschain movement; CCTP testnet fee/allowance data is exposed to the bridge experience.
- **Paymaster:** USDC gas option is surfaced for compatible smart-account flows without falsely claiming the current Privy wallet is using a Paymaster transaction.
- **Gas Station:** sponsored gas policies are represented in the transfer/payment experience.
- **Compliance Engine:** screening is represented as a pre-submission safety layer for configured deployments.
- **Contracts + Modules:** programmable onchain actions and audited contract modules are represented in the transaction/dapp model.
- **App Kits:** send, swap, bridge and contract actions remain modular so Circle SDK components can be attached without rewriting the UI.
- **Circle Wallets:** compatible wallet-account patterns are reflected in the account architecture.
- **Circle Payments Network:** payin/payout and stablecoin settlement are represented in funding and payments surfaces for eligible integrations.
- **Circle Mint:** institutional mint/redeem liquidity is represented as a funding and settlement rail.
- **StableFX:** USDC/EURC FX is represented in the multi-currency stablecoin model for configured settlement flows.
- **xReserve:** USDC-backed stablecoin interoperability is represented in the crosschain infrastructure model.
- **Arc:** Arc Testnet is surfaced in Networks with its Chain ID and RPC details.
- **x402 + Gateway Nanopayments:** the Browser/Agent model supports USDC-powered API/service payments and gasless batched payments.
- **Agent Wallets:** payment flows can be extended toward scoped agent spending and service payments.

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

Arc Testnet is also surfaced as a Circle network option; it currently uses Chain ID `5042002` and `https://rpc.testnet.arc.network` according to Circle's developer documentation.

Every enabled network has its own page under `/networks/<network-key>`, while the same EVM wallet address can be used across the EVM network set.

## Current app

- Google login
- Automatic embedded EVM wallet creation
- Multichain live native + USDC + EURC balance reads where Circle tokens are available
- Real ETH, USDC and EURC transfer signing through Privy
- Username-based recipient resolution
- Human-readable transfer review
- Circle-aware gas/payment choices
- Mainnet-only LI.FI swap and bridge quotes
- Gateway unified-USDC balance visibility on testnet
- CCTP Fast Transfer allowance and fee visibility
- Page switcher dropdown in the top bar
- Dedicated chain pages for every enabled mainnet/testnet network
- Stablecoin-oriented funding and payment surfaces
- Remote MCP endpoint for GPTs and other agents
- Clean, neutral visual system with no decorative gradients

## Notes

Testnet assets have no financial value. Some Circle products require developer API credentials, merchant or institutional onboarding, smart-account configuration, or other eligibility requirements. Those flows are surfaced contextually and remain explicitly configuration-dependent until the necessary integration is configured.
