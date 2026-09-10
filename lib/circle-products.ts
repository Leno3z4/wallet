export type CircleProduct = {
  key: string;
  name: string;
  description: string;
  category: 'money' | 'infrastructure' | 'developers' | 'network';
  mode: 'live' | 'ready' | 'partner';
  href: string;
};

export const CIRCLE_PRODUCTS: CircleProduct[] = [
  { key: 'usdc', name: 'USDC', description: 'Native dollar digital currency used throughout the wallet.', category: 'money', mode: 'live', href: '/assets' },
  { key: 'eurc', name: 'EURC', description: 'Euro-backed stablecoin for future multi-currency balances.', category: 'money', mode: 'ready', href: '/assets' },
  { key: 'gateway', name: 'Gateway', description: 'Unified USDC balance that abstracts fragmented chain liquidity.', category: 'infrastructure', mode: 'live', href: '/circle' },
  { key: 'cctp', name: 'CCTP', description: 'Native USDC burn-and-mint transfers between supported chains.', category: 'infrastructure', mode: 'live', href: '/bridge' },
  { key: 'paymaster', name: 'Paymaster', description: 'Pay gas in USDC on compatible smart-account flows.', category: 'infrastructure', mode: 'ready', href: '/circle' },
  { key: 'gas-station', name: 'Gas Station', description: 'Sponsor transaction fees with configurable developer policies.', category: 'infrastructure', mode: 'ready', href: '/circle' },
  { key: 'wallets', name: 'Circle Wallets', description: 'Embedded and developer-controlled wallet infrastructure.', category: 'developers', mode: 'ready', href: '/circle' },
  { key: 'contracts', name: 'Circle Contracts', description: 'Deploy, interact with, and monitor smart contracts.', category: 'developers', mode: 'ready', href: '/circle' },
  { key: 'modules', name: 'Modules', description: 'Pre-built audited smart-contract modules for programmable payments.', category: 'developers', mode: 'ready', href: '/circle' },
  { key: 'app-kits', name: 'App Kits', description: 'SDK building blocks for send, swap, bridge, and onchain actions.', category: 'developers', mode: 'ready', href: '/circle' },
  { key: 'compliance', name: 'Compliance Engine', description: 'Automated transaction screening and risk controls.', category: 'developers', mode: 'ready', href: '/circle' },
  { key: 'arc', name: 'Arc', description: 'EVM-compatible stablecoin-focused settlement network.', category: 'network', mode: 'ready', href: '/networks' },
  { key: 'xreserve', name: 'xReserve', description: 'USDC-backed stablecoin issuance and interoperability.', category: 'network', mode: 'partner', href: '/circle' },
  { key: 'cpn', name: 'Payments Network', description: 'Partner network for global stablecoin settlement and local payouts.', category: 'network', mode: 'partner', href: '/circle' },
  { key: 'mint', name: 'Circle Mint', description: 'Institutional USDC/EURC minting and redemption infrastructure.', category: 'money', mode: 'partner', href: '/circle' },
  { key: 'x402', name: 'x402', description: 'USDC-powered internet payments for APIs, software, and agents.', category: 'network', mode: 'ready', href: '/circle' },
  { key: 'console', name: 'Circle Console', description: 'Developer control surface for Circle services and environments.', category: 'developers', mode: 'ready', href: '/circle' },
];

export const CIRCLE_STATUS_LABEL: Record<CircleProduct['mode'], string> = {
  live: 'Connected',
  ready: 'Ready to connect',
  partner: 'Partner access',
};
