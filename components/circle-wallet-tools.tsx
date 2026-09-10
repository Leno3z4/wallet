'use client';
import { useEffect, useState } from 'react';
import { ArrowRight, CircleDollarSign, Gauge, ShieldCheck, Sparkles } from 'lucide-react';
import { useWallets } from '@privy-io/react-auth';

function useAddress(){const {wallets}=useWallets();return wallets.find(w=>w.walletClientType==='privy')?.address??wallets[0]?.address??'';}

type Props={surface:'assets'|'transfer'|'bridge'|'buy'|'activity'|'settings'|'browser'};

export function CircleWalletTools({surface}:Props){
 const address=useAddress(); const [gateway,setGateway]=useState<any>(null); const [loading,setLoading]=useState(false);
 const load=async()=>{if(!address)return;setLoading(true);try{const r=await fetch(`/api/circle/gateway?address=${encodeURIComponent(address)}&environment=testnet`,{cache:'no-store'});setGateway(r.ok?await r.json():null);}catch{setGateway(null)}finally{setLoading(false)}};
 useEffect(()=>{void load()},[address]);
 const total=gateway?.balances?.balances?.reduce((s:number,x:{balance?:string})=>s+Number(x.balance??0),0)??0;
 const cards:Record<Props,{title:string;items:{name:string;text:string;status:string;href:string}[]}>={
  assets:{title:'Stablecoin infrastructure',items:[
   {name:'Unified USDC',text:loading?'Loading…':`${total.toFixed(2)} USDC available through Gateway testnet domains.`,status:'Gateway',href:'#gateway'},
   {name:'USDC + EURC',text:'Keep dollar and euro stablecoins side by side in your wallet.',status:'Stablecoins',href:'/assets'},
   {name:'Circle Wallets',text:'Wallet infrastructure stays compatible with Circle-managed account patterns.',status:'Wallets',href:'/settings'}]},
  transfer:{title:'Payment rails',items:[
   {name:'USDC gas',text:'Use Circle Paymaster when this account is compatible with its USDC gas flow.',status:'Paymaster',href:'/settings'},
   {name:'Sponsored fees',text:'Developer-configured Gas Station policies can cover transaction fees.',status:'Gas Station',href:'/settings'},
   {name:'Transaction screening',text:'Compliance Engine can sit before payment submission for configured deployments.',status:'Compliance',href:'/settings'}]},
  bridge:{title:'Cross-chain USDC',items:[
   {name:'Native USDC',text:'Prefer CCTP for native USDC burn-and-mint transfers between supported chains.',status:'CCTP',href:'/bridge'},
   {name:'Unified liquidity',text:'Gateway abstracts fragmented USDC balances for compatible cross-chain flows.',status:'Gateway',href:'/assets'},
   {name:'Programmable transfer',text:'Circle Contracts and Modules can automate payment and settlement logic.',status:'Contracts',href:'/dapps'}]},
  buy:{title:'Funding & settlement',items:[
   {name:'USDC / EURC',text:'Use stablecoins as the primary destination for fiat funding.',status:'Mint',href:'/buy'},
   {name:'Stablecoin payouts',text:'Circle Payments Network can power partner payins, payouts and settlement.',status:'CPN',href:'/buy'},
   {name:'Institutional liquidity',text:'Circle Mint is designed for institutional mint, redeem and reserve flows.',status:'Circle Mint',href:'/buy'}]},
  activity:{title:'Settlement controls',items:[
   {name:'Compliance checks',text:'Keep transaction screening close to the activity timeline.',status:'Compliance Engine',href:'/settings'},
   {name:'Payment settlement',text:'Track stablecoin payment and payout states as they are integrated.',status:'CPN',href:'/activity'},
   {name:'Contract events',text:'Circle Contracts event monitoring can enrich contract activity.',status:'Contracts',href:'/dapps'}]},
  settings:{title:'Onchain infrastructure',items:[
   {name:'Paymaster',text:'USDC gas abstraction for supported EIP-7702 and smart-account flows.',status:'Ready',href:'#paymaster'},
   {name:'Gas Station',text:'Sponsored gas policies for developer-controlled flows.',status:'Ready',href:'#gas-station'},
   {name:'Contracts + Modules',text:'Programmable contracts, audited modules and event monitoring.',status:'Ready',href:'/dapps'},
   {name:'Agent + x402 payments',text:'USDC-powered services and agent payments can use Gateway nanopayments.',status:'Ready',href:'/browser'}]},
  browser:{title:'Internet-native payments',items:[
   {name:'x402',text:'Recognize HTTP 402 payment requirements for USDC-powered services.',status:'x402',href:'/browser'},
   {name:'Gateway nanopayments',text:'Use Gateway-backed, gasless batched payments where a service supports them.',status:'Nanopayments',href:'/browser'},
   {name:'Agent Wallets',text:'Agent spending can be constrained to user-defined budgets and payment policies.',status:'Agents',href:'/browser'}]}
 };
 const config=cards[surface];
 return <section className="circle-embedded panel"><div className="panel-head"><div><span className="muted-label">{config.title}</span><h2>Built into this wallet</h2></div><CircleDollarSign size={18}/></div><div className="circle-embedded-grid">{config.items.map(item=><a key={item.name} href={item.href} className="circle-embedded-card"><div className="circle-embedded-icon">{item.status==='Compliance Engine'?<ShieldCheck size={16}/>:item.status==='Paymaster'?<Gauge size={16}/>:<Sparkles size={16}/>}</div><div><strong>{item.name}</strong><p>{item.text}</p><span>{item.status}<ArrowRight size={13}/></span></div></a>)}</div></section>;
}
