import { AuthGate } from '@/components/auth-gate';
import { AppShell } from '@/components/app-shell';
import { LifiAction } from '@/components/live-wallet';
import { CircleWalletTools } from '@/components/circle-wallet-tools';
export default function Swap(){return <AuthGate><AppShell title="Swap"><div className="tool-layout"><LifiAction mode="swap"/><CircleWalletTools surface="assets"/></div></AppShell></AuthGate>}
