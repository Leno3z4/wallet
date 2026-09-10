import Link from 'next/link';
import { ArrowDownLeft, ArrowLeftRight, ArrowRightLeft, Boxes, CreditCard, History } from 'lucide-react';
import { AppShell, TokenRow } from '@/components/app-shell';
import { AuthGate } from '@/components/auth-gate';

export default function Home() {
  return <AuthGate><AppShell title="Overview" eyebrow="Home">
    <section className="balance-hero"><div><span className="muted-label">Total portfolio</span><div className="hero-number">$0.00</div><span className="hero-note">Across Ethereum, Base, Arbitrum, Optimism and Polygon</span></div><div className="quick-actions"><Link href="/transfer" className="primary"><ArrowRightLeft size={16}/> Transfer</Link><Link href="/swap" className="secondary"><ArrowLeftRight size={16}/> Swap</Link><Link href="/bridge" className="secondary"><Boxes size={16}/> Bridge</Link><Link href="/buy" className="secondary"><CreditCard size={16}/> Buy</Link></div></section>
    <section className="stats-grid"><div className="stat-card"><span>Cash</span><strong>$0.00</strong><small>ETH + stablecoins</small></div><div className="stat-card"><span>Networks</span><strong>5</strong><small>All EVM-compatible</small></div><div className="stat-card"><span>Transactions</span><strong>0</strong><small>Across every chain</small></div></section>
    <section className="two-col"><div className="panel"><div className="panel-head"><div><span className="muted-label">Assets</span><h2>Your balances</h2></div><Link href="/assets">View all</Link></div><TokenRow symbol="ETH" name="Ethereum" network="Ethereum" /><TokenRow symbol="E" name="Ether" network="Base" /><TokenRow symbol="$" name="USD Coin" network="Base" amount="0.00 USDC" /></div><div className="panel"><div className="panel-head"><div><span className="muted-label">Recent</span><h2>Transactions</h2></div><Link href="/activity"><History size={16}/></Link></div><div className="empty-state"><div className="empty-icon">↔</div><strong>No transactions yet</strong><span>Your activity will appear here.</span></div></div></section>
    <section className="feature-strip"><div><span className="muted-label">Built around people</span><h2>Remember who you pay.</h2><p>Save wallet addresses as people, businesses, or your own accounts.</p></div><Link href="/people" className="secondary">Open People</Link></section>
  </AppShell></AuthGate>;
}
