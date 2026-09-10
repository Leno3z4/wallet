import { AuthGate } from '@/components/auth-gate';
import { AppShell } from '@/components/app-shell';
import { LifiAction } from '@/components/live-wallet';
import { CircleWalletTools } from '@/components/circle-wallet-tools';
export default function Bridge(){return <AuthGate><AppShell title="Bridge"><div className="tool-layout"><LifiAction mode="bridge"/><CircleWalletTools surface="bridge"/></div></AppShell></AuthGate>}
