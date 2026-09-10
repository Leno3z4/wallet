import { AuthGate } from '@/components/auth-gate';
import { AppShell } from '@/components/app-shell';
import { CircleCenter } from '@/components/circle-center';

export default function CirclePage() {
  return <AuthGate><AppShell title="Circle"><CircleCenter /></AppShell></AuthGate>;
}
