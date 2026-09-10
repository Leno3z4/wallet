export const MCP_TOOLS = [
  {
    name: 'wallet_get_address',
    description: 'Get the authenticated wallet address.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'wallet_get_balances',
    description: 'Read native and USDC balances across supported EVM networks. Testnet balances are included and clearly labeled.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'wallet_resolve_username',
    description: 'Resolve an @username into its wallet address.',
    inputSchema: {
      type: 'object',
      properties: { username: { type: 'string', description: 'Username with or without @.' } },
      required: ['username'],
      additionalProperties: false,
    },
  },
  {
    name: 'wallet_prepare_transfer',
    description: 'Prepare a human-readable ETH or USDC transfer for user approval. This tool never signs or broadcasts funds.',
    inputSchema: {
      type: 'object',
      properties: {
        to: { type: 'string', description: '0x address or @username.' },
        amount: { type: 'string', description: 'Amount to send.' },
        asset: { type: 'string', enum: ['ETH', 'USDC'] },
        network: { type: 'string', description: 'Supported network name, for example Base or Ethereum.' },
      },
      required: ['to', 'amount', 'asset', 'network'],
      additionalProperties: false,
    },
  },
  {
    name: 'wallet_get_networks',
    description: 'List supported mainnet and testnet EVM networks.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'wallet_get_payment_capabilities',
    description: 'Describe payment capabilities available to the wallet, including USDC, EURC, CCTP, Gateway, Paymaster, Gas Station, x402 and payment rails.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
] as const;
