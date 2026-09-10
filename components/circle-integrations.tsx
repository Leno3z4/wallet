'use client';

import Link from 'next/link';
import { ArrowRight, CircleDollarSign, Fuel, Globe2, ShieldCheck, WalletCards } from 'lucide-react';
import { CIRCLE_FEATURES } from '@/lib/circle';

export function StablecoinRail({ compact = false }: { compact?: boolean }) {
  const features = CIRCLE_FEATURES.filter((item) => ['USDC','EURC','CCTP','Gateway'].includes(item.label));
  return <div className={compact ? 'circle-rail compact' : 'circle-rail'}>{features.map((item) => <div className="circle-rail-item" key={item.key}><CircleDollarSign size={16}/><div><strong>{item.label}</strong>{!compact && <span>{item.detail}</span>}</div></div>)}</div>;
}

export function GasOptions() {
  return <div className="circle-feature-grid"><div className="circle-feature"><Fuel size={18}/><div><strong>Pay gas with USDC</strong><p>Circle Paymaster supports ERC-4337 smart accounts so compatible wallets can pay network fees in USDC.</p></div><span className="status-chip">SCA</span></div><div className="circle-feature"><WalletCards size={18}/><div><strong>Sponsored gas</strong><p>Gas Station can sponsor fees for compatible Circle Wallet smart accounts under developer policies.</p></div><span className="status-chip">Wallets</span></div></div>;
}

export function CirclePaymentsCard() {
  return <div className="panel circle-payment-card"><div className="panel-head"><div><h2>Stablecoin payments</h2><span className="muted-label">Circle infrastructure</span></div></div><div className="circle-payment-links"><Link href="/transfer" className="circle-payment-link"><span><CircleDollarSign size={17}/><b>USDC payments</b></span><ArrowRight size={15}/></Link><Link href="/bridge" className="circle-payment-link"><span><Globe2 size={17}/><b>Crosschain USDC</b></span><ArrowRight size={15}/></Link><Link href="/settings" className="circle-payment-link"><span><ShieldCheck size={17}/><b>Compliance & gas policies</b></span><ArrowRight size={15}/></Link></div></div>;
}

export function InstitutionalRail({ label = 'Available for connected Circle accounts' }: { label?: string }) {
  return <div className="notice"><ShieldCheck size={16}/><span>{label}. Circle Mint, Circle Payments Network, StableFX and eligible Compliance Engine workflows require the appropriate Circle account, permissions and API credentials.</span></div>;
}
