'use client';

import { ArrowRight, ShieldCheck, Sparkles, WalletCards } from 'lucide-react';

export function Landing() {
  return (
    <main className="landing">
      <div className="noise" />
      <nav className="topbar">
        <div className="brand"><span className="brand-mark">W</span> wallet</div>
        <div className="topbar-note">Multichain EVM</div>
      </nav>

      <section className="hero">
        <div className="eyebrow"><span className="dot" /> One wallet. Every EVM chain.</div>
        <h1>Your crypto,<br /><em>without the clutter.</em></h1>
        <p className="hero-copy">A calmer multichain wallet built around people, payments, and clarity — not ticker noise.</p>
        <div className="features">
          <div><WalletCards size={18} /><span>One address across EVM</span></div>
          <div><ShieldCheck size={18} /><span>Clear transaction reviews</span></div>
          <div><Sparkles size={18} /><span>Wallets that remember</span></div>
        </div>
        <div className="login-card">
          <div>
            <strong>Google sign-in is ready</strong>
            <span>Add <code>NEXT_PUBLIC_PRIVY_APP_ID</code> to enable real account creation.</span>
          </div>
          <ArrowRight size={19} />
        </div>
      </section>
    </main>
  );
}
