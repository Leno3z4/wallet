'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { ArrowLeftRight, ArrowRightLeft, Boxes, CreditCard, Globe, History, Home, LogOut, Menu, Network, QrCode, Settings, Shield, Users, WalletCards } from 'lucide-react';

const items = [
  ['/','Home',Home], ['/assets','Assets',WalletCards], ['/transfer','Transfer',ArrowRightLeft], ['/swap','Swap',ArrowLeftRight], ['/bridge','Bridge',Boxes], ['/buy','Buy / sell',CreditCard], ['/activity','Transactions',History], ['/people','People',Users], ['/browser','Browser',Globe], ['/networks','Networks',Network], ['/dapps','Connected dapps',Shield], ['/settings','Settings',Settings],
] as const;

export function AppShell({ children, title, eyebrow }: { children: React.ReactNode; title: string; eyebrow?: string }) {
  const pathname = usePathname(); const { logout, user } = usePrivy(); const { wallets } = useWallets();
  const address = wallets.find(w => w.walletClientType === 'privy')?.address ?? user?.wallet?.address ?? '';
  const short = address ? `${address.slice(0,6)}…${address.slice(-4)}` : 'Wallet not connected';
  return <main className="product-shell"><aside className="sidebar"><div className="brand"><span className="brand-mark">W</span><span>wallet</span></div><div className="network-pill"><span className="network-dot"/>Multichain EVM<span className="chev">⌄</span></div><nav className="side-nav">{items.map(([href,label,Icon])=><Link key={href} href={href} className={`side-item ${pathname===href?'active':''}`}><Icon size={16}/><span>{label}</span></Link>)}</nav><div className="sidebar-bottom"><Link href="/receive" className="side-item"><QrCode size={16}/>Receive</Link><button className="side-item" onClick={()=>logout()}><LogOut size={16}/>Sign out</button><div className="security-note"><span className="security-dot">✓</span><span>Self-custody<br/><b>{short}</b></span></div></div></aside><section className="content"><header className="topbar"><div className="mobile-logo"><span className="brand-mark">W</span></div><div><span className="eyebrow">{eyebrow??'Wallet'}</span><h1>{title}</h1></div><div className="topbar-actions"><button className="icon-button"><Menu size={18}/></button><div className="account-chip"><span className="avatar">{user?.google?.name?.[0]??'U'}</span><span>{user?.google?.name?.split(' ')[0]??'Account'}</span></div></div></header><div className="page-body">{children}</div></section></main>;
}
export function StatCard({label,value,note}:{label:string;value:string;note?:string}){return <div className="stat-card"><span>{label}</span><strong>{value}</strong>{note&&<small>{note}</small>}</div>}
export function TokenRow({symbol,name,network='Base',amount='0.00',value='$0.00'}:{symbol:string;name:string;network?:string;amount?:string;value?:string}){return <div className="token-row"><div className="token-icon">{symbol.slice(0,1)}</div><div className="token-meta"><strong>{name}</strong><span>{symbol} · {network}</span></div><div className="token-values"><strong>{amount}</strong><span>{value}</span></div></div>}
