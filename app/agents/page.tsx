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
    <section className="panel agent-hero"><div><div className="agent-icon"><Bot size={22}/></div><h2>Connect agents to this wallet</h2><p>GPTs and other MCP clients authenticate as the person using the wallet, then receive a token scoped to that exact Privy user and Ethereum wallet.</p></div><div className="agent-security"><ShieldCheck size={17}/><span>OAuth 2.1 + PKCE</span></div></section>
    <section className="panel"><div className="panel-head"><div><h2>Remote MCP endpoint</h2></div><span className="status-chip">OAuth protected</span></div><div className="agent-endpoint"><code>{endpoint}</code><button className="secondary" onClick={copy}><Copy size={15}/>{copied?'Copied':'Copy'}</button></div><p className="panel-copy">MCP clients discover authorization through <code>/.well-known/oauth-protected-resource</code> and <code>/.well-known/oauth-authorization-server</code>, then sign in through the wallet's Privy-backed consent screen.</p></section>
    <section className="agent-grid"><div className="panel"><h2>Agent permissions</h2><div className="agent-list"><div><b>wallet:read</b><span>Read the bound wallet address, balances, networks, usernames and payment capabilities.</span></div><div><b>wallet:prepare</b><span>Prepare a transfer proposal for the bound wallet. The agent cannot sign or broadcast it.</span></div><div><b>Per-user identity</b><span>Each access token contains the Privy user and wallet address established during consent.</span></div></div></div><div className="panel"><h2>Security boundary</h2><div className="agent-list"><div><KeyRound size={17}/><span><b>Private keys stay private</b><small>MCP never receives wallet keys or signing credentials.</small></span></div><div><ShieldCheck size={17}/><span><b>PKCE protected</b><small>Authorization codes are short-lived, one-time-use and bound to the redirect URI and verifier.</small></span></div><div><ExternalLink size={17}/><span><b>Client metadata</b><small>OAuth clients must publish their metadata and registered redirect URIs.</small></span></div></div></div></section>
    <section className="feature-strip"><div><h2>Ready for GPT-style connections.</h2><p>Connect the MCP URL in a compatible agent. The first connection opens a wallet-hosted consent flow; later calls use a scoped bearer token tied to the approved wallet.</p></div></section>
  </div></AppShell></AuthGate>
}
