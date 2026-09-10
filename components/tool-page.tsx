'use client';
import { useState } from 'react';
import { AppShell } from '@/components/app-shell';

export function ToolPage({ title, eyebrow, description, children }: {title:string;eyebrow:string;description:string;children:React.ReactNode}) {
  return <AppShell title={title} eyebrow={eyebrow}><div className="tool-layout"><div className="tool-intro"><span className="muted-label">{eyebrow}</span><h2>{description}</h2></div>{children}</div></AppShell>;
}
export function SelectBox({label, options, value, onChange}:{label:string;options:string[];value:string;onChange:(v:string)=>void}){return <label className="field"><span>{label}</span><select value={value} onChange={e=>onChange(e.target.value)}>{options.map(o=><option key={o}>{o}</option>)}</select></label>}
export function AmountBox({symbol='ETH'}:{symbol?:string}){const [amount,setAmount]=useState('');return <label className="field"><span>Amount</span><div className="input-combo"><input inputMode="decimal" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="0.00"/><b>{symbol}</b></div><small>Available: 0.00 {symbol}</small></label>}
export function AddressBox({label='Recipient'}:{label?:string}){return <label className="field"><span>{label}</span><input placeholder="0x… or saved person"/></label>}
export function ActionButton({children='Continue'}:{children?:React.ReactNode}){return <button className="primary large full" onClick={()=>alert('This action is ready for wallet integration.')}>{children}</button>}
