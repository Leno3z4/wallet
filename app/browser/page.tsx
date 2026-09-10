'use client';
import { useState } from 'react';
import { ArrowUpRight, Bookmark, Globe, Plus, RefreshCw } from 'lucide-react';
import { AuthGate } from '@/components/auth-gate';
import { AppShell } from '@/components/app-shell';
export default function Browser(){const [url,setUrl]=useState('https://app.uniswap.org'); const [current,setCurrent]=useState(url); return <AuthGate><AppShell title="Browser" eyebrow="Web3 browser"><div className="browser-bar"><Globe size={17}/><input value={url} onChange={e=>setUrl(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')setCurrent(url)}}/><button onClick={()=>setCurrent(url)}><ArrowUpRight size={16}/></button><button><RefreshCw size={16}/></button></div><div className="browser-bookmarks"><button><Bookmark size={15}/>Uniswap</button><button><Plus size={15}/>Add site</button></div><div className="browser-frame"><div className="browser-splash"><div className="browser-logo"><Globe size={26}/></div><h2>{current.replace(/^https?:\/\//,'')}</h2><p>Dapp browsing is ready. Connect and approve transactions through the wallet’s review flow.</p><div className="browser-note">Embedded browsing sandbox</div></div></div></AppShell></AuthGate>}
