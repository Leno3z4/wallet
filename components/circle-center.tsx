'use client';

import { useEffect, useState } from 'react';
import { useWallets } from '@privy-io/react-auth';
import { ArrowRight, Check, CircleDollarSign, ExternalLink, FlaskConical, Gauge, Loader2, ShieldCheck, Sparkles } from 'lucide-react';
import { CIRCLE_PRODUCTS, CIRCLE_STATUS_LABEL } from '@/lib/circle-products';

const DOMAINS: Record<string, number> = { ethereum: 0, optimism: 2, arbitrum: 3, base: 6, polygon: 7 };

function useAddress() {
  const { wallets } = useWallets();
  return wallets.find((w) => w.walletClientType === 'privy')?.address ?? wallets[0]?.address ?? '';
}

export function CircleCenter() {
  const address = useAddress();
  const [gateway, setGateway] = useState<any>(null);
  const [gatewayLoading, setGatewayLoading] = useState(false);
  const [cctp, setCctp] = useState<{ allowance?: number; fees?: any[] } | null>(null);
  const [cctpLoading, setCctpLoading] = useState(false);

  const loadGateway = async () => {
    if (!address) return;
    setGatewayLoading(true);
    try {
      const response = await fetch(`/api/circle/gateway?address=${encodeURIComponent(address)}&environment=testnet`, { cache: 'no-store' });
      const data = await response.json();
      setGateway(response.ok ? data : { error: data.error ?? 'Gateway unavailable.' });
    } catch { setGateway({ error: 'Gateway unavailable.' }); }
    setGatewayLoading(false);
  };

  const loadCctp = async () => {
    setCctpLoading(true);
    try {
      const [allowanceResponse, feesResponse] = await Promise.all([
        fetch('https://iris-api-sandbox.circle.com/v2/fastBurn/USDC/allowance', { cache: 'no-store' }),
        fetch(`https://iris-api-sandbox.circle.com/v2/burn/USDC/fees/${DOMAINS.ethereum}/${DOMAINS.base}`, { cache: 'no-store' }),
      ]);
      const allowance = allowanceResponse.ok ? await allowanceResponse.json() : null;
      const fees = feesResponse.ok ? await feesResponse.json() : [];
      setCctp({ allowance: typeof allowance?.allowance === 'number' ? allowance.allowance : undefined, fees: Array.isArray(fees) ? fees : [] });
    } catch { setCctp(null); }
    setCctpLoading(false);
  };

  useEffect(() => { void loadGateway(); void loadCctp(); }, [address]);

  const gatewayTotal = gateway?.balances?.balances?.reduce((sum: number, item: { balance?: string }) => sum + Number(item.balance ?? 0), 0) ?? 0;
  return <div className="circle-center">
    <section className="circle-hero panel">
      <div><div className="circle-mark">C</div><h2>Circle infrastructure</h2><p>USDC, crosschain liquidity, gas abstraction, programmable contracts, and payment rails in one place.</p></div>
      <a href="https://www.circle.com/developer" target="_blank" rel="noreferrer" className="secondary">Circle developer hub <ExternalLink size={14}/></a>
    </section>

    <div className="circle-live-grid">
      <section className="panel">
        <div className="panel-head"><div><h2>Gateway</h2><span className="muted-label">Unified USDC</span></div><span className="status-chip"><CircleDollarSign size={13}/> Live</span></div>
        <div className="circle-metric">{gatewayLoading ? <Loader2 className="spin" size={22}/> : `${gatewayTotal.toFixed(6)} USDC`}</div>
        <p className="circle-copy">Testnet Gateway balance available across supported domains. Circle describes Gateway as a unified USDC balance for instant crosschain liquidity.</p>
        {gateway?.error ? <div className="notice error">{gateway.error}</div> : null}
        <button className="secondary" onClick={loadGateway} disabled={gatewayLoading}>{gatewayLoading ? 'Refreshing…' : 'Refresh balance'}</button>
      </section>
      <section className="panel">
        <div className="panel-head"><div><h2>CCTP</h2><span className="muted-label">Fast Transfer</span></div><span className="status-chip"><Gauge size={13}/> Live</span></div>
        <div className="circle-metric">{cctpLoading ? <Loader2 className="spin" size={22}/> : cctp?.allowance !== undefined ? `${cctp.allowance.toLocaleString()} USDC` : 'Unavailable'}</div>
        <p className="circle-copy">Current Fast Transfer allowance from Circle’s testnet attestation service.</p>
        {cctp?.fees?.[0] ? <div className="detail-row"><span>Ethereum → Base fee</span><strong>{cctp.fees[0].minimumFee} bps min</strong></div> : null}
        <button className="secondary" onClick={loadCctp} disabled={cctpLoading}>{cctpLoading ? 'Refreshing…' : 'Refresh CCTP data'}</button>
      </section>
    </div>

    <section className="panel">
      <div className="panel-head"><div><h2>Circle stack</h2><span className="muted-label">Capabilities</span></div></div>
      <div className="circle-product-grid">{CIRCLE_PRODUCTS.map((product) => <div key={product.key} className="circle-product">
        <div className="circle-product-top"><div className="circle-product-icon">{product.name[0]}</div><span className={`status-chip ${product.mode==='live'?'live':''}`}>{product.mode==='live'?<Check size={12}/>:product.mode==='partner'?<ShieldCheck size={12}/>:<Sparkles size={12}/>} {CIRCLE_STATUS_LABEL[product.mode]}</span></div>
        <h3>{product.name}</h3><p>{product.description}</p><a href={product.href} className="circle-product-link">Open in wallet <ArrowRight size={14}/></a>
      </div>)}</div>
    </section>

    <section className="circle-architecture panel"><div><h2>How it fits together</h2><p>Privy remains the current user wallet and signer. Circle becomes the stablecoin and payments layer around it: USDC for value, CCTP for native crosschain movement, Gateway for unified liquidity, Paymaster for USDC gas, Contracts and Modules for programmable onchain actions, and Circle’s network products for payments and settlement.</p></div><div className="architecture-flow"><span>Wallet</span><b>→</b><span>USDC</span><b>→</b><span>CCTP / Gateway</span><b>→</b><span>Paymaster / Contracts</span></div></section>
    <section className="panel"><div className="feature-callout"><FlaskConical size={19}/><div><b>Safe rollout</b><p>Products that require Circle developer credentials, merchant onboarding, smart-account infrastructure, or institutional access are shown as connectable rather than pretending they are already live.</p></div></div></section>
  </div>;
}
