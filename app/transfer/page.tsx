import { AuthGate } from '@/components/auth-gate';
import { AppShell } from '@/components/app-shell';
import { SendForm } from '@/components/live-wallet';

export default function Transfer(){
  return <AuthGate><AppShell title="Transfer"><div className="tool-layout"><SendForm/></div></AppShell></AuthGate>;
}
