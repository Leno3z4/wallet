'use client';

import Link from 'next/link';
import { ArrowRight, Banknote, CircleDollarSign, Fuel, Globe2, Landmark, ShieldCheck, WalletCards, Zap } from 'lucide-react';

const items = [
  ['USDC', 'Stablecoin payments', CircleDollarSign, '/transfer'],
  ['EURC', 'Euro-denominated payments', Banknote, '/assets'],
  ['CCTP', 'Native USDC crosschain', Globe2, '/bridge'],
  ['Gateway', 'Unified USDC liquidity', Zap, '/assets'],
  ['Paymaster', 'Pay gas with USDC', Fuel, '/transfer'],
  ['Gas Station', 'Sponsored gas policies', Fuel, '/settings'],
  ['Circle Wallets', 'User-controlled / modular wallet rail', WalletCards, '/settings'],
  ['Contracts', 'Smart contracts + event monitoring', Code2, '/dapps'],
  ['Compliance Engine', 'AML / CTF screening', ShieldCheck, '/settings'],
  ['Circle Mint', 'Institutional mint / redeem', Landmark, '/buy'],
  ['Payments Network', 'Global stablecoin settlement', Globe2, '/transfer'],
  ['StableFX', 'USDC / EURC FX', Banknote, '/swap'],
  ['xReserve', 'USDC-backed stablecoins', Landmark, '/networks'],
  ['Arc', 'Stablecoin-focused EVM chain', Globe2, '/networks/arc-testnet'],
] as const;

export function CircleIntegrationPanel(){return <section className="panel circle-integration"><div className="panel-head"><div><h2>Stablecoin infrastructure</h2><span className="muted-label">Built into the wallet</span></div></div><div className="circle-integration-grid">{items.map(([name,detail,Icon,href])=><Link href={href} className="circle-integration-row" key={name}><Icon size={17}/><div><strong>{name}</strong><span>{detail}</span></div><ArrowRight size={15}/></Link>)}</div></section>}
