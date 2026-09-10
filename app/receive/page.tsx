'use client';
import { useState } from 'react';
import { Copy, QrCode, Check } from 'lucide-react';
import { AuthGate } from '@/components/auth-gate';
import { AppShell } from '@/components/app-shell';
import { useWallets } from '@privy-io/react-auth';

export default function Receive(){
  const { wallets } = useWallets();
  const address = wallets.find((w)=>w.walletClientType==='privy')?.address ?? wallets[0]?.address ?? '';
  const [copied,setCopied]=useState(false);
  const copy=async()=>{if(!address)return;await navigator.clipboard.writeText(address);setCopied(true);setTimeout(()=>setCopied(false),1400)};
  return <AuthGate><AppShell title="Receive"><div className="receive-layout"><div className="qr-card"><div className="fake-qr">{address ? '▦' : '…'}</div><strong>Scan to send to this wallet</strong></div><div className="form-card"><h2>Your wallet address</h2><p className="page-copy">The same EVM address works across Ethereum, Base, Arbitrum, Optimism and Polygon.</p><div className="address-box"><code>{address || 'Creating wallet…'}</code><button className="secondary icon-only" onClick={copy} disabled={!address}>{copied?<Check size={16}/>:<Copy size={16}/>}</button></div><button className="primary large full" onClick={copy} disabled={!address}>{copied?'Copied':'Copy address'} <Copy size={17}/></button><div className="network-list"><span>Ethereum</span><span>Base</span><span>Arbitrum</span><span>Optimism</span><span>Polygon</span></div></div></div></AppShell></AuthGate>
}
