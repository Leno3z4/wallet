import Link from 'next/link';
import { ArrowLeft, ExternalLink, FlaskConical, ShieldCheck } from 'lucide-react';
import { AuthGate } from '@/components/auth-gate';
import { AppShell } from '@/components/app-shell';
import { SUPPORTED_CHAINS } from '@/lib/chains';

export default async function ChainPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = SUPPORTED_CHAINS.find((item) => item.key === slug);
  if (!entry) return <AuthGate><AppShell title="Network"><div className="panel"><h2>Network not found</h2><Link className="secondary" href="/networks">Back to networks</Link></div></AppShell></AuthGate>;
  const { chain, name, symbol, explorer, environment } = entry;
  const testnet = environment === 'testnet';
  return <AuthGate><AppShell title={name}><div className="chain-page"><Link href="/networks" className="back-link"><ArrowLeft size={16}/> All networks</Link><section className="chain-hero panel"><div className="chain-hero-icon">{name[0]}</div><div><div className="chain-title-row"><h2>{name}</h2>{testnet&&<span className="status-chip"><FlaskConical size={13}/> Testnet</span>}</div><p>Chain ID {chain.id} · Native token {symbol} · {chain.name}</p></div></section><div className="chain-grid"><div className="panel"><div className="panel-head"><div><span className="muted-label">Wallet</span><h2>Network details</h2></div></div><div className="detail-row"><span>Environment</span><strong>{testnet?'Testnet':'Mainnet'}</strong></div><div className="detail-row"><span>Chain ID</span><strong>{chain.id}</strong></div><div className="detail-row"><span>Native asset</span><strong>{symbol}</strong></div><div className="detail-row"><span>USDC</span><strong>Circle-issued</strong></div><a className="secondary full-link" href={explorer} target="_blank" rel="noreferrer">Open block explorer <ExternalLink size={15}/></a></div><div className="panel"><div className="panel-head"><div><span className="muted-label">Payments</span><h2>USDC support</h2></div></div><div className="feature-callout"><ShieldCheck size={19}/><div><b>USDC across your wallet</b><p>{testnet?'Testnet USDC has no financial value and is for development only.':'USDC is available as a first-class asset on this network.'}</p></div></div><div className="feature-callout"><ShieldCheck size={19}/><div><b>Circle infrastructure</b><p>Designed to work with Circle CCTP/Gateway patterns as those integrations are enabled for this wallet.</p></div></div></div></div></div></AppShell></AuthGate>;
}
