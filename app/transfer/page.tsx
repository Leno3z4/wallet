import { AuthGate } from '@/components/auth-gate';
import { AppShell } from '@/components/app-shell';
import { SendForm } from '@/components/live-wallet';
import { CircleWalletTools } from '@/components/circle-wallet-tools';

export default function Transfer(){
  return <AuthGate><AppShell title="Transfer"><div className="tool-layout"><SendForm/><CircleWalletTools surface="transfer"/></div></AppShell></AuthGate>;
}
