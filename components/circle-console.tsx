'use client';

import Link from 'next/link';
import { Banknote, CircleDollarSign, Code2, Fuel, Globe2, Landmark, ShieldCheck, WalletCards, Zap } from 'lucide-react';

const rows = [
  ['USDC', 'Payments, transfers and settlement', CircleDollarSign, '/assets'],
  ['EURC', 'Euro stablecoin on supported networks', Banknote, '/assets'],
  ['CCTP', 'Native USDC crosschain transfers', Globe2, '/bridge'],
  ['Gateway', 'Unified USDC liquidity', Zap, '/assets'],
  ['Paymaster', 'Pay gas with USDC via ERC-4337', Fuel, '/transfer'],
  ['Gas Station', 'Sponsored gas for compatible smart accounts', Fuel, '/settings'],
  ['Circle Wallets', 'User-controlled or developer-controlled wallet rails', WalletCards, '/settings'],
  ['Contracts', 'Contract deployment and event tooling', Code2, '/dapps'],
  ['Compliance Engine', 'Screening and policy controls', ShieldCheck, '/settings'],
  ['Circle Mint', 'Institutional mint, redeem and treasury rails', Landmark, '/buy'],
  ['Circle Payments Network', 'Global stablecoin payment routing', Globe2, '/transfer'],
  ['StableFX', 'USDC/EURC institutional FX', Banknote, '/swap'],
  ['xReserve', 'USDC-backed stablecoin infrastructure', Landmark, '/networks'],
  ['Arc', 'Stablecoin-focused EVM chain', Globe2, '/networks/arc-testnet'],
] as const;

export function CircleConsoleStrip(){
  return <section className="circle-console"><div className="circle-console-head"><div><span className="muted-label">Built into the wallet</span><h2>Circle infrastructure</h2></div><span className="status-chip">No separate hub</span></div><div className="circle-console-grid">{rows.map(([name,detail,Icon,href])=><Link href={href} className="circle-console-row" key={name}><Icon size={17}/><div><strong>{name}</strong><span>{detail}</span></div></Link>)}</div></section>;
}
