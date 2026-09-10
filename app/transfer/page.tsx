import { ArrowRightLeft, ShieldCheck } from 'lucide-react';
import { AuthGate } from '@/components/auth-gate';
import { ToolPage, SelectBox, AmountBox, AddressBox, ActionButton } from '@/components/tool-page';

export default function Transfer(){ return <AuthGate><ToolPage title="Transfer" eyebrow="Send & receive" description="Move tokens between your wallet and other addresses."><div className="form-card"><div className="segmented"><button className="selected">Send</button><button>Receive</button></div><SelectBox label="Network" options={['Base','Ethereum','Arbitrum','Optimism','Polygon']} value="Base" onChange={()=>{}}/><AddressBox label="To"/><AmountBox symbol="ETH"/><div className="notice"><ShieldCheck size={17}/><span>We’ll show a plain-English review before anything is signed.</span></div><ActionButton>Review transfer <ArrowRightLeft size={17}/></ActionButton></div></ToolPage></AuthGate> }
