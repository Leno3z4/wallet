export const CIRCLE_PRODUCTS = {
  assets: ['USDC','EURC','USYC'],
  infrastructure: ['CCTP','Gateway','Paymaster','Gas Station','Wallets','Contracts','Compliance Engine','xReserve'],
  payments: ['Circle Payments Network','StableFX','Circle Mint'],
  chains: ['Arc'],
} as const;

export const CIRCLE_FEATURES = [
  { key:'usdc', label:'USDC', area:'Assets', detail:'First-class stablecoin for payments, swaps, bridging and gas-aware flows.' },
  { key:'eurc', label:'EURC', area:'Assets', detail:'Euro-backed stablecoin for supported EVM networks.' },
  { key:'usyc', label:'USYC', area:'Assets', detail:'Tokenized yield product surfaced as an optional institutional asset.' },
  { key:'cctp', label:'CCTP', area:'Bridge', detail:'Native USDC burn-and-mint interoperability across supported chains.' },
  { key:'gateway', label:'Gateway', area:'Assets / Transfer', detail:'Unified USDC balance for instant crosschain liquidity on supported routes.' },
  { key:'paymaster', label:'Paymaster', area:'Transfer / Gas', detail:'ERC-4337 path for paying network gas in USDC.' },
  { key:'gas-station', label:'Gas Station', area:'Settings', detail:'Developer-sponsored gas policies for compatible smart accounts.' },
  { key:'wallets', label:'Circle Wallets', area:'Wallet', detail:'Optional Circle user-controlled or developer-controlled wallet backend.' },
  { key:'contracts', label:'Circle Contracts', area:'Web3', detail:'Managed smart-contract deployment, interaction and event monitoring.' },
  { key:'compliance', label:'Compliance Engine', area:'Transfer / Settings', detail:'Transaction screening, allowlists, blocklists and alerts for eligible integrations.' },
  { key:'mint', label:'Circle Mint', area:'Buy / sell', detail:'Institutional USDC/EURC mint, redeem and treasury rails.' },
  { key:'cpn', label:'Circle Payments Network', area:'Payments', detail:'Stablecoin-powered global payment routing and settlement.' },
  { key:'stablefx', label:'StableFX', area:'Swap', detail:'Institutional USDC/EURC FX quotes and settlement on Arc.' },
  { key:'xreserve', label:'xReserve', area:'Bridge / Networks', detail:'USDC-backed stablecoin infrastructure for eligible ecosystems.' },
  { key:'arc', label:'Arc', area:'Networks', detail:'Circle-built EVM-compatible L1 optimized for stablecoin finance.' },
] as const;

export const EURC: Record<number, `0x${string}`> = {
  1: '0x1aBaEA1f7C830bD89Acc67eC4af516284b1bC33c',
  8453: '0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42',
  11155111: '0x08210F9170F89Ab7658F0B5E3fF39b0E03C594D4',
  84532: '0x808456652fdb597867f38412077A9182bf77359F',
  9001: '0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a',
};

export const CIRCLE_GATEWAY = {
  apiBase: 'https://gateway-api-testnet.circle.com/v1',
  mainnetApiBase: 'https://gateway-api.circle.com/v1',
} as const;

export const CIRCLE_CCTP_API = {
  mainnet: 'https://iris-api.circle.com',
  testnet: 'https://iris-api-sandbox.circle.com',
} as const;
