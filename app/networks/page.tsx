import Link from 'next/link';
import { ArrowRight, Check, ExternalLink, FlaskConical, Network } from 'lucide-react';
import { AuthGate } from '@/components/auth-gate';
import { AppShell } from '@/components/app-shell';
import { MAINNET_CHAINS, TESTNET_CHAINS } from '@/lib/chains';

function NetworkRow({ entry }: { entry: (typeof MAINNET_CHAINS)[number] | (typeof TESTNET_CHAINS)[number] }) {
  return <Link href={`/networks/${entry.key}`} className="setting-row network-link"><div className="chain-icon">{entry.name[0]}</div><span><b>{entry.name}</b><small>Chain {entry.chain.id} · {entry.symbol}</small></span><span className="status-chip"><Check size={12}/> Enabled</span><ArrowRight size={16}/></Link>;
}

export default function Networks(){return <AuthGate><AppShell title="Networks" eyebrow="Multichain"><div className="network-directory"><div className="panel"><div className="panel-head"><div><span className="muted-label">Mainnets</span><h2>Production networks</h2></div></div>{MAINNET_CHAINS.map((entry)=><NetworkRow key={entry.key} entry={entry}/>)}</div><div className="panel"><div className="panel-head"><div><span className="muted-label">Testnets</span><h2>Development networks</h2></div><span className="status-chip"><FlaskConical size={13}/> No financial value</span></div>{TESTNET_CHAINS.map((entry)=><NetworkRow key={entry.key} entry={entry}/>)}</div><div className="panel network-add"><Network size={19}/><div><b>Arc Testnet</b><p>Circle's EVM-compatible stablecoin-focused network. Chain ID 5042002 · RPC rpc.testnet.arc.network · USDC is the native gas asset.</p></div><a className="secondary" href="https://developers.circle.com" target="_blank" rel="noreferrer">Circle docs <ExternalLink size={15}/></a></div><div className="panel network-add"><Network size={19}/><div><b>Custom EVM networks</b><p>Add a chain later without changing your wallet address model.</p></div><button className="secondary" type="button">Add network</button></div></div></AppShell></AuthGate>}
