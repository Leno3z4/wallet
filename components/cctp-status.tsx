'use client';

import { useEffect, useState } from 'react';
import { Loader2, RefreshCw, Zap } from 'lucide-react';
import { MAINNET_CHAINS } from '@/lib/chains';
import { CIRCLE_CCTP } from '@/lib/chains';

export function CctpStatus() {
  const [source, setSource] = useState('base');
  const [dest, setDest] = useState('arbitrum');
  const [fees, setFees] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const sourceEntry = MAINNET_CHAINS.find((x) => x.key === source)!;
  const destEntry = MAINNET_CHAINS.find((x) => x.key === dest)!;
  const load = async () => {
    if (source === dest) return;
    setLoading(true);
    try {
      const a = CIRCLE_CCTP.mainnet.domains[source as keyof typeof CIRCLE_CCTP.mainnet.domains];
      const b = CIRCLE_CCTP.mainnet.domains[dest as keyof typeof CIRCLE_CCTP.mainnet.domains];
      const res = await fetch(`/api/circle/cctp/fees?sourceDomain=${a}&destinationDomain=${b}`, { cache:'no-store' });
      const body=await res.json();
      setFees(res.ok?body:null);
    } catch { setFees(null); }
    finally { setLoading(false); }
  };
  useEffect(()=>{void load();},[source,dest]);
  return <div className="circle-cctp-card"><div className="gateway-head"><div><span className="muted-label">Circle CCTP</span><h3>Native USDC transfer</h3></div><Zap size={18}/></div><div className="cctp-route"><select value={source} onChange={e=>setSource(e.target.value)}>{MAINNET_CHAINS.map(x=><option key={x.key} value={x.key}>{x.name}</option>)}</select><span>→</span><select value={dest} onChange={e=>setDest(e.target.value)}>{MAINNET_CHAINS.map(x=><option key={x.key} value={x.key}>{x.name}</option>)}</select></div><div className="cctp-data">{loading?<Loader2 className="spin" size={17}/>:fees?<><span>Fast fee</span><strong>{JSON.stringify(fees).slice(0,120)}{JSON.stringify(fees).length>120?'…':''}</strong></>:<span>Circle fee data will appear here when this route is supported.</span>}</div><button className="secondary" onClick={load} disabled={loading||source===dest}><RefreshCw size={15}/> Refresh</button><p className="field-help">The bridge UI can use CCTP for native USDC instead of liquidity-provider routing. Final execution still requires the burn transaction, Circle attestation and destination receive step.</p></div>;
}
