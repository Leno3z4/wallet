'use client';
import { Bot, Copy, ExternalLink, KeyRound, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { AuthGate } from '@/components/auth-gate';
import { AppShell } from '@/components/app-shell';

export default function Agents(){
  const [copied,setCopied]=useState(false);
  const endpoint=typeof window!=='undefined'?`${window.location.origin}/api/mcp`:'/api/mcp';
  const copy=async()=>{await navigator.clipboard.writeText(endpoint);setCopied(true);setTimeout(()=>setCopied(false),1400)};
  return <AuthGate><AppShell title="Agents"><div className="agent-page">
    <section className="panel agent-hero"><div><div className="agent-icon"><Bot size={22}/></div><h2>Connect agents to this wallet</h2><p>Expose wallet context to GPTs and other MCP-compatible agents without giving an agent your private key.</p></div><div className="agent-security"><ShieldCheck size={17}/><span>Signing stays with the wallet.</span></div></section>
    <section className="panel"><div className="panel-head"><div><span className="muted-label">MCP server</span><h2>Remote endpoint</h2></div><span className="status-chip">Streamable HTTP</span></div><div className="agent-endpoint"><code>{endpoint}</code><button className="secondary" onClick={copy}><Copy size={15}/>{copied?'Copied':'Copy'}</button></div><p className="panel-copy">Add this endpoint to an MCP-compatible agent. Discovery metadata is available at <code>/.well-known/mcp.json</code>.</p></section>
    <section className="agent-grid"><div className="panel"><h2>What agents can do</h2><div className="agent-list"><div><b>Read wallet address</b><span>Identify the connected wallet.</span></div><div><b>Read balances</b><span>Inspect native assets across supported EVM chains.</span></div><div><b>Resolve usernames</b><span>Turn @username recipients into wallet addresses.</span></div><div><b>Read payment capabilities</b><span>Understand USDC, CCTP, Gateway, x402 and gas options.</span></div><div><b>Prepare transfers</b><span>Create a reviewable transaction proposal without signing it.</span></div></div></div><div className="panel"><h2>Safety model</h2><div className="agent-list"><div><KeyRound size={17}/><span><b>Private keys stay private</b><small>Agents never receive wallet keys.</small></span></div><div><ShieldCheck size={17}/><span><b>Human approval</b><small>MCP transfer tools only prepare an action.</small></span></div><div><ExternalLink size={17}/><span><b>Auditable endpoint</b><small>All agent operations go through one MCP surface.</small></span></div></div></div></section>
    <section className="feature-strip"><div><h2>Built for GPTs and agents.</h2><p>Use the MCP endpoint as the agent layer while the wallet remains the authorization and signing boundary.</p></div></section>
  </div></AppShell></AuthGate>
}
