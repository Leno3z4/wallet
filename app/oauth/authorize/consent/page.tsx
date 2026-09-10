import { Suspense } from 'react';
import { OAuthConsent } from '@/components/oauth-consent';

export default function OAuthConsentPage() {
  return <Suspense fallback={<main className="auth-page"><section className="auth-card"><h1>Connecting wallet…</h1></section></main>}><OAuthConsent /></Suspense>;
}
