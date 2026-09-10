import type { Metadata } from 'next';
import './globals.css';
import './wallet-ui.css';
import './clean-ui.css';
import { Providers } from '@/components/providers';
export const metadata: Metadata = { title: 'Wallet', description: 'A simple multichain EVM wallet that remembers your contacts.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body><Providers>{children}</Providers></body></html>; }
