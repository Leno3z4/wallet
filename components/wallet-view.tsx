'use client';

import { useMemo, useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { ArrowDownLeft, ArrowUpRight, ChevronDown, Copy, LogOut, MoreHorizontal, Plus, Search, Send, Settings, ShieldCheck, Users } from 'lucide-react';
import { formatEther, getAddress } from 'viem';
import { arbitrum, base, mainnet, optimism, polygon } from 'viem/chains';

const chains = [
  { chain: mainnet, name: 'Ethereum', symbol: 'ETH' },
  { chain: base, name: 'Base', symbol: 'ETH' },
  { chain: arbitrum, name: 'Arbitrum', symbol: 'ETH' },
  { chain: optimism, name: 'Optimism', symbol: 'ETH' },
  { chain: polygon, name: 'Polygon', symbol: 'POL' },
];

const demoActivity = [
  { type: 'in', title: 'Received', subtitle: 'From 0x7a...92c', amount: '+ 0.42 ETH', time: 'Today, 10:32 AM' },
  { type: 'out', title: 'Sent', subtitle: 'James · Contractor', amount: '- 245 USDC', time: 'Yesterday, 6:14 PM' },
  { type: 'swap', title: 'Swapped', subtitle: 'ETH → USDC', amount: '0.18 ETH', time: 'Sep 7, 2:48 PM' },
];

function shortAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function WalletView() {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const { wallets } = useWallets();
  const [sendOpen, setSendOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === 'privy');
  const address = embeddedWallet?.address ?? user?.wallet?.address;
  const displayAddress = address ? shortAddress(address) : 'Creating wallet…';

  const totalLabel = useMemo(() => address ? '0.00' : '—', [address]);

  if (!ready) return <div className="boot"><div className="loader" /></div>;

  if (!authenticated) {
    return (
      <main className="auth-page">
        <div className="auth-box">
          <div className="brand brand-center"><span className="brand-mark">W</span> wallet</div>
          <div className="eyebrow centered"><span className="dot" /> Multichain EVM</div>
          <h1>One wallet.<br />Every EVM chain.</h1>
          <p>Sign in with Google. Your EVM wallet is created automatically.</p>
          <button className="primary large" onClick={() => login()}>
            Continue with Google <ArrowUpRight size={18} />
          </button>
          <span className="fine-print">Your wallet is created by Privy and can be used across supported EVM networks.</span>
        </div>
      </main>
    );
  }

  const copyAddress = async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">W</span> wallet</div>
        <div className="side-nav">
          <button className="side-item active"><WalletCardsIcon /> Wallet</button>
          <button className="side-item"><Users size={18} /> People</button>
        </div>
        <div className="sidebar-bottom">
          <button className="side-item"><Settings size={18} /> Settings</button>
          <button className="side-item" onClick={() => logout()}><LogOut size={18} /> Sign out</button>
          <div className="security-note"><ShieldCheck size={17} /><span>Wallet secured<br />by Privy</span></div>
        </div>
      </aside>

      <section className="content">
        <header className="app-header">
          <div>
            <div className="welcome">Good to see you{user?.google?.name ? `, ${user.google.name.split(' ')[0]}` : ''}.</div>
            <div className="address-pill" onClick={copyAddress} role="button" tabIndex={0}>
              <span className="address-dot" /> {displayAddress} <Copy size={14} />
              {copied && <span className="copied">Copied</span>}
            </div>
          </div>
          <button className="profile-pill" onClick={() => logout()}>
            <span>{user?.google?.name?.slice(0, 1) ?? 'U'}</span>
            <ChevronDown size={15} />
          </button>
        </header>

        <div className="main-grid">
          <section className="hero-balance">
            <div className="muted-label">Total balance</div>
            <div className="balance">${totalLabel}</div>
            <div className="balance-change">Across 5 networks <span>·</span> USD estimate</div>
            <div className="action-row">
              <button className="primary" onClick={() => setSendOpen(true)}><Send size={17} /> Send</button>
              <button className="secondary"><ArrowDownLeft size={17} /> Receive</button>
              <button className="secondary"><Plus size={17} /> Buy</button>
            </div>
          </section>

          <section className="chains-card">
            <div className="section-head"><span>Networks</span><button><MoreHorizontal size={18} /></button></div>
            {chains.map(({ chain, name, symbol }) => (
              <div className="chain-row" key={chain.id}>
                <div className="chain-icon">{name[0]}</div>
                <div className="chain-copy"><strong>{name}</strong><span>{symbol}</span></div>
                <div className="chain-balance"><strong>0.00</strong><span>$0.00</span></div>
              </div>
            ))}
          </section>

          <section className="assets-card">
            <div className="section-head"><span>Assets</span><button><Search size={17} /></button></div>
            <div className="asset-row featured"><div className="token-logo">E</div><div className="chain-copy"><strong>Ethereum</strong><span>ETH</span></div><div className="asset-right"><strong>0.00 ETH</strong><span>$0.00</span></div></div>
            <div className="asset-row"><div className="token-logo usdc">$</div><div className="chain-copy"><strong>USD Coin</strong><span>USDC</span></div><div className="asset-right"><strong>0.00 USDC</strong><span>$0.00</span></div></div>
          </section>

          <section className="activity-card">
            <div className="section-head"><span>Activity</span><button>View all</button></div>
            {demoActivity.map((item, index) => (
              <div className="activity-row" key={index}>
                <div className={`activity-icon ${item.type}`}>{item.type === 'in' ? <ArrowDownLeft size={16} /> : item.type === 'out' ? <ArrowUpRight size={16} /> : '↔'}</div>
                <div className="activity-copy"><strong>{item.title}</strong><span>{item.subtitle}</span></div>
                <div className="activity-amount"><strong>{item.amount}</strong><span>{item.time}</span></div>
              </div>
            ))}
          </section>
        </div>
      </section>

      {sendOpen && address && <SendSheet from={getAddress(address)} onClose={() => setSendOpen(false)} />}
    </main>
  );
}

function SendSheet({ from, onClose }: { from: `0x${string}`; onClose: () => void }) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [network, setNetwork] = useState('Base');
  const [step, setStep] = useState<'form' | 'review'>('form');

  return (
    <div className="sheet-backdrop" onMouseDown={onClose}>
      <section className="sheet" onMouseDown={(e) => e.stopPropagation()}>
        <div className="sheet-head"><div><span className="muted-label">New payment</span><h2>Send crypto</h2></div><button onClick={onClose}>×</button></div>
        {step === 'form' ? (
          <>
            <label>Network<select value={network} onChange={(e) => setNetwork(e.target.value)}><option>Base</option><option>Ethereum</option><option>Arbitrum</option><option>Optimism</option><option>Polygon</option></select></label>
            <label>Recipient<input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="0x… or saved person" /></label>
            <label>Amount<div className="amount-input"><input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" /><span>ETH</span></div></label>
            <button className="primary large" disabled={!recipient || !amount} onClick={() => setStep('review')}>Review transaction <ArrowUpRight size={17} /></button>
          </>
        ) : (
          <>
            <div className="review-card"><span>You are sending</span><strong>{amount || '0'} ETH</strong><span>on {network}</span></div>
            <div className="review-line"><span>From</span><code>{shortAddress(from)}</code></div>
            <div className="review-line"><span>To</span><code>{shortAddress(recipient)}</code></div>
            <div className="review-line"><span>Gas</span><strong>Estimated at signing</strong></div>
            <button className="primary large" onClick={onClose}>Confirm in wallet <ShieldCheck size={17} /></button>
          </>
        )}
        <span className="fine-print">Transactions are irreversible. Always verify the recipient before signing.</span>
      </section>
    </div>
  );
}

function WalletCardsIcon() {
  return <div className="wallet-mini-icon"><WalletIconShape /></div>;
}
function WalletIconShape() {
  return <span className="wallet-shape" />;
}
