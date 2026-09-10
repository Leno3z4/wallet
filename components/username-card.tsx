'use client';

import { useEffect, useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { Check, Loader2, ShieldCheck, UserRound } from 'lucide-react';

const KEY = 'wallet.username';

export function UsernameCard() {
  const { user } = usePrivy();
  const { wallets } = useWallets();
  const address = wallets.find((w) => w.walletClientType === 'privy')?.address ?? wallets[0]?.address ?? '';
  const [username, setUsername] = useState('');
  const [saved, setSaved] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSaved(window.localStorage.getItem(KEY) ?? '');
  }, []);

  const save = async () => {
    if (!user?.id || !address || !username.trim()) return;
    setLoading(true);
    setStatus('');
    try {
      const response = await fetch('/api/usernames', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, userId: user.id, walletAddress: address }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Could not reserve username.');
      setSaved(data.username);
      setUsername(data.username);
      window.localStorage.setItem(KEY, data.username);
      setStatus('Username reserved');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not reserve username.');
    } finally {
      setLoading(false);
    }
  };

  return <div className="panel username-card"><div className="panel-head"><div><span className="muted-label">Your identity</span><h2>Choose your username</h2></div><div className="username-badge"><UserRound size={16}/></div></div><p className="panel-copy">People can send to you by username instead of copying a wallet address. Usernames are case-insensitive, so <b>Alex</b> and <b>alex</b> are the same identity.</p><div className="username-input"><span>@</span><input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder={saved || 'yourname'}/><button className="primary" onClick={save} disabled={loading || !username.trim() || !address}>{loading?<Loader2 className="spin" size={16}/>:<Check size={16}/>} Save</button></div>{status&&<div className={`notice ${status==='Username reserved'?'success':'error'}`}>{status==='Username reserved'?<ShieldCheck size={15}/>:null}{status}</div>}<div className="username-rules"><span>3–24 characters</span><span>Letters, numbers, underscores</span><span>One username across the service</span></div></div>;
}
