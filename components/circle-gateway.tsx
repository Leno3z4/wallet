'use client';

import { useEffect, useState } from 'react';
import { Loader2, RefreshCw, Zap } from 'lucide-react';
import { useWallets } from '@privy-io/react-auth';

export function GatewayBalance() {
  const { wallets } = useWallets();
  const address = wallets.find((w) => w.walletClientType === 'privy')?.address ?? wallets[0]?.address ?? '';
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const load = async () => {
    if (!address) return;
    setLoading(true); setError('');
    try {
      const res = await fetch(`/api/circle/gateway/balance?address=${encodeURIComponent(address)}`, { cache: 'no-store' });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? 'Gateway balance unavailable.');
      const values = Array.isArray(body.balances) ? body.balances : [];
      const total = values.reduce((sum: number, item: { balance?: string }) => sum + Number(item.balance ?? 0), 0);
      setBalance((total / 1e6).toFixed(2));
    } catch (e) { setError(e instanceof Error ? e.message : 'Gateway unavailable.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, [address]);
  return <div className="gateway-card"><div className="gateway-head"><div><span className="muted-label">Circle Gateway</span><h3>Unified USDC</h3></div><Zap size={18}/></div><strong className="gateway-balance">{loading ? <Loader2 className="spin" size={22}/> : balance === null ? '—' : `$${balance}`}</strong><p>One USDC balance available across supported Gateway chains. Testnet mode is used until a production Gateway configuration is added.</p><button className="secondary" onClick={load} disabled={loading}>{loading ? <Loader2 className="spin" size={15}/> : <RefreshCw size={15}/>} Refresh</button>{error && <div className="notice error">{error}</div>}</div>;
}
