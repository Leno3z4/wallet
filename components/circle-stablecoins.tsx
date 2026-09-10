'use client';

import { useEffect, useState } from 'react';
import { useWallets } from '@privy-io/react-auth';
import { CircleDollarSign, Euro, Landmark, RefreshCw } from 'lucide-react';
import { createPublicClient, formatUnits, http } from 'viem';
import { SUPPORTED_CHAINS } from '@/lib/chains';
import { EURC } from '@/lib/circle';
import { ERC20_ABI } from '@/lib/chains';

export function EURCBalances() {
  const { wallets } = useWallets();
  const address = wallets.find((w) => w.walletClientType === 'privy')?.address ?? wallets[0]?.address ?? '';
  const [items, setItems] = useState<Array<{ name:string; amount:string }>>([]);
  const [loading, setLoading] = useState(false);
  const load = async () => {
    if (!address) return;
    setLoading(true);
    const next:Array<{name:string;amount:string}> = [];
    await Promise.all(SUPPORTED_CHAINS.map(async ({ chain, name }) => {
      const token = EURC[chain.id];
      if (!token) return;
      try {
        const client=createPublicClient({ chain, transport:http() });
        const amount=await client.readContract({ address:token, abi:ERC20_ABI, functionName:'balanceOf', args:[address as `0x${string}`] }) as bigint;
        if (amount>0n) next.push({name,amount:formatUnits(amount,6)});
      } catch {}
    }));
    setItems(next.sort((a,b)=>a.name.localeCompare(b.name))); setLoading(false);
  };
  useEffect(()=>{void load();},[address]);
  return <div className="stablecoin-card"><div className="stablecoin-head"><div><span className="muted-label">Circle</span><h3>EURC</h3></div><Euro size={18}/></div>{items.length===0&&!loading?<p>No EURC balance detected on the supported networks.</p>:<div>{items.map((item)=><div className="stablecoin-row" key={item.name}><span>{item.name}</span><strong>{item.amount} EURC</strong></div>)}</div>}<button className="secondary" onClick={load} disabled={loading}><RefreshCw size={15}/> Refresh</button></div>;
}

export function CirclePaymentsStrip() {
  return <div className="circle-payments-strip"><div><CircleDollarSign size={18}/><div><strong>USDC payments</strong><span>Send stablecoins across supported networks.</span></div></div><div><Landmark size={18}/><div><strong>Institutional rails</strong><span>Circle Mint, CPN and StableFX can plug in when configured.</span></div></div></div>;
}
