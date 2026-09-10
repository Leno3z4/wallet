'use client';

import { usePrivy, useWallets } from '@privy-io/react-auth';

export default function Home() {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const { wallets } = useWallets();
  const wallet = wallets[0];

  if (!ready) return <main className="shell"><div className="loading">Loading wallet…</div></main>;

  if (!authenticated) {
    return (
      <main className="shell auth-shell">
        <div className="brand">W</div>
        <h1>Your wallet,<br /><span>without the friction.</span></h1>
        <p className="muted">One multichain EVM wallet. Sign in with Google and your wallet is created automatically.</p>
        <button className="primary" onClick={login}>Continue with Google</button>
        <p className="fine">Your wallet keys are managed by an embedded wallet provider. Never share recovery credentials.</p>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="wordmark">wallet</div>
        <div className="account">
          <span>{user?.google?.email || user?.email?.address || 'Account'}</span>
          <button onClick={logout}>Log out</button>
        </div>
      </header>

      <section className="hero-card">
        <div className="eyebrow">Total balance</div>
        <div className="balance">$0.00</div>
        <div className="address">{wallet ? `${wallet.address.slice(0, 6)}…${wallet.address.slice(-4)}` : 'Creating wallet…'}</div>
        <div className="actions">
          <button className="primary">Send</button>
          <button className="secondary">Receive</button>
          <button className="secondary">Swap</button>
        </div>
      </section>

      <section className="panel">
        <div className="panel-title">Assets</div>
        <div className="asset-row"><div><strong>Ethereum</strong><small>ETH · Ethereum</small></div><strong>$0.00</strong></div>
        <div className="asset-row"><div><strong>USDC</strong><small>USDC · Multichain</small></div><strong>$0.00</strong></div>
      </section>

      <section className="panel">
        <div className="panel-title">Activity</div>
        <div className="empty">Your transactions will appear here.</div>
      </section>
    </main>
  );
}
