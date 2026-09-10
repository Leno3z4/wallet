import { AuthGate } from '@/components/auth-gate';
import { AppShell } from '@/components/app-shell';
import { LifiAction } from '@/components/live-wallet';
export default function Swap(){return <AuthGate><AppShell title="Swap"><div className="tool-layout"><LifiAction mode="swap"/></div></AppShell></AuthGate>}
