'use client';
import { usePrivy } from '@privy-io/react-auth';
import { ArrowUpRight } from 'lucide-react';
export function AuthGate({ children }: { children: React.ReactNode }) {
  const { ready, authenticated, login } = usePrivy();
  if (!ready) return <div className="boot"><div className="loader" /></div>;
  if (!authenticated) return <main className="auth-page"><div className="auth-box"><div className="brand brand-center"><span className="brand-mark">W</span> wallet</div><div className="eyebrow centered">Multichain EVM</div><h1>Your wallet, ready when you are.</h1><p>Sign in with Google and an EVM wallet is created automatically.</p><button className="primary large" onClick={() => login()}>Continue with Google <ArrowUpRight size={18}/></button></div></main>;
  return <>{children}</>;
}
