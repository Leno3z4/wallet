# wallet

A multichain EVM wallet focused on simple payments, wallet memory, stablecoin-first infrastructure, and agent access.

## Stack

- Next.js + React + TypeScript
- Privy for Google authentication and embedded EVM wallets
- viem for EVM reads and transaction primitives
- LI.FI for mainnet swap / bridge routing
- Circle infrastructure woven into the core wallet UX
- OAuth-protected remote MCP endpoint

## Agent + GPT access

The wallet exposes a remote Model Context Protocol endpoint at:

```text
/api/mcp
```

The endpoint is now protected by an OAuth authorization server backed by the wallet's existing Privy identity layer. An MCP client discovers the flow through:

```text
/.well-known/oauth-protected-resource
/.well-known/oauth-authorization-server
```

and the convenience discovery document remains available at:

```text
/.well-known/mcp.json
```

The authorization flow uses OAuth Authorization Code + PKCE (S256). The user signs in through the wallet's Privy-backed consent screen. The server then binds the issued MCP token to the authenticated Privy user and their Ethereum embedded-wallet address. MCP requests never accept a caller-supplied address as the wallet identity.

Supported scopes:

- `wallet:read` — wallet address, native balances, networks, username resolution, and payment capabilities.
- `wallet:prepare` — prepare a transfer proposal for human review; it does not authorize signing or broadcasting.

Authorization codes are short-lived, stored hashed in Supabase, bound to the client, redirect URI and PKCE challenge, and marked one-time-use on redemption. Access tokens are short-lived and signed with `MCP_OAUTH_SECRET`; refresh tokens have a separate audience and lifetime.

Set these server-side environment variables:

```bash
NEXT_PUBLIC_APP_URL=https://your-wallet-domain.example
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_app_secret
MCP_OAUTH_SECRET=replace_with_a_long_random_secret
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

In the Privy dashboard, enable user identity tokens under User management > Authentication > Advanced. The wallet uses the identity token on the OAuth consent page to securely establish the logged-in Privy user before issuing an MCP authorization code.

Run `supabase/mcp_oauth.sql` in the same Supabase project that stores usernames.

The MCP authorization model follows the current MCP direction toward OAuth-based protected resources, PKCE, issuer-aware credentials, and Client ID Metadata Documents rather than a shared API key. citeturn701183search0turn701183search4

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

## Global usernames

Users can reserve a username such as `Centry`. Matching is case-insensitive, so `Centry`, `centry`, and `CENTRY` all resolve to the same canonical username. The selected display casing is preserved.

Global uniqueness is stored in Supabase. Run `supabase/usernames.sql`, then configure the Supabase environment variables shown above.

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
- OAuth-protected remote MCP endpoint for GPTs and other agents
- Clean, neutral visual system with no decorative gradients

## Notes

Testnet assets have no financial value. Some Circle products require developer API credentials, merchant or institutional onboarding, smart-account configuration, or other eligibility requirements. Those flows are surfaced contextually and remain explicitly configuration-dependent until the necessary integration is configured.

The repository does not claim signing or transaction broadcast from the MCP server: an agent can prepare actions, but the wallet UI remains the signing boundary.
