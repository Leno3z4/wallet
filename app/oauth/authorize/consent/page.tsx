'use client';

import { useMemo, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useSearchParams } from 'next/navigation';

export default function OAuthConsentPage() {
  const params = useSearchParams();
  const { authenticated, login, getIdentityToken } = usePrivy();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const clientName = params.get('client_name') ?? 'Connected agent';
  const requestedScope = useMemo(() => (params.get('scope') ?? 'wallet:read').split(' ').filter(Boolean), [params]);

  async function authorize() {
    setBusy(true); setError('');
    try {
      if (!authenticated) { await login(); return; }
      const idToken = await getIdentityToken();
      if (!idToken) throw new Error('Privy identity token is not available. Enable identity tokens in Privy User management > Authentication > Advanced.');
      const payload = Object.fromEntries(params.entries());
      delete payload.client_name;
      const response = await fetch('/api/oauth/authorize/complete', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...payload, identityToken: idToken }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error_description ?? data.error ?? 'Authorization failed.');
      window.location.assign(data.redirect_to);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Authorization failed.');
      setBusy(false);
    }
  }

  return <main className="auth-page"><section className="auth-card"><div className="brand"><span className="brand-mark">W</span><span>wallet</span></div><h1>Connect {clientName}</h1><p>{clientName} is requesting access to your Wallet account.</p><div className="oauth-permissions"><strong>This connection can</strong>{requestedScope.map((scope) => <div key={scope}><span className="permission-dot">✓</span>{scope === 'wallet:read' ? 'Read your wallet address, balances, networks and payment capabilities' : scope === 'wallet:prepare' ? 'Prepare transfers for your review' : scope}</div>)}</div><p className="oauth-note">The agent never receives your private keys. Transfers remain reviewable and wallet signing stays in your wallet.</p>{error && <div className="oauth-error">{error}</div>}<button className="primary-btn" onClick={authorize} disabled={busy}>{busy ? 'Connecting…' : authenticated ? 'Approve connection' : 'Sign in to continue'}</button></section></main>;
}
