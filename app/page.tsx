'use client';

import { useEffect, useState } from 'react';
import { WalletView } from '@/components/wallet-view';
import { Landing } from '@/components/landing';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="boot" />;

  return process.env.NEXT_PUBLIC_PRIVY_APP_ID ? <WalletView /> : <Landing />;
}
