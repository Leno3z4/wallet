import { AuthGate } from '@/components/auth-gate';
import { AppShell } from '@/components/app-shell';
import { LifiAction } from '@/components/live-wallet';
export default function Bridge(){return <AuthGate><AppShell title="Bridge"><div className="tool-layout"><LifiAction mode="bridge"/></div></AppShell></AuthGate>}
