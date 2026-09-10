import { AuthGate } from '@/components/auth-gate';
import { AppShell } from '@/components/app-shell';
import { LiveBalances } from '@/components/live-wallet';
import { CircleWalletTools } from '@/components/circle-wallet-tools';
export default function Assets(){return <AuthGate><AppShell title="Assets"><div className="panel"><div className="panel-head"><h2>Balances</h2></div><LiveBalances/></div><CircleWalletTools surface="assets"/></AppShell></AuthGate>}
