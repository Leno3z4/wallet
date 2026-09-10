'use client';
import { AppShell } from '@/components/app-shell';
export function ToolPage({ title, description, children, eyebrow:_eyebrow }: { title:string; description:string; children:React.ReactNode; eyebrow?:string }) { return <AppShell title={title}><div className="tool-layout"><div className="tool-intro"><h2>{description}</h2></div>{children}</div></AppShell>; }
export function SelectBox({label,options,value,onChange}:{label:string;options:string[];value:string;onChange:(v:string)=>void}){return <label className="field"><span>{label}</span><select value={value} onChange={e=>onChange(e.target.value)}>{options.map(o=><option key={o}>{o}</option>)}</select></label>}
export function AmountBox({symbol='ETH'}:{symbol?:string}){return <label className="field"><span>Amount</span><div className="input-combo"><input inputMode="decimal" placeholder="0.00"/><b>{symbol}</b></div></label>}
export function AddressBox({label='Recipient'}:{label?:string}){return <label className="field"><span>{label}</span><input placeholder="0x… or saved person"/></label>}
export function ActionButton({children='Continue'}:{children?:React.ReactNode}){return <button className="primary large full" onClick={()=>alert('Use the live flow on this page to continue.')}>{children}</button>}
