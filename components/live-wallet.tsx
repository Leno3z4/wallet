'use client';

import { useEffect, useState } from 'react';
import { useSendTransaction, useWallets } from '@privy-io/react-auth';
import { createPublicClient, encodeFunctionData, formatEther, formatUnits, http, isAddress, parseEther, parseUnits } from 'viem';
import { ArrowUpRight, Check, Copy, Loader2, RefreshCw, ShieldCheck, X } from 'lucide-react';
import { ERC20_ABI, MAINNET_CHAINS, SUPPORTED_CHAINS, USDC, ZERO_ADDRESS } from '@/lib/chains';

function useWalletAddress() {
  const { wallets } = useWallets();
  return wallets.find((w) => w.walletClientType === 'privy')?.address ?? wallets[0]?.address ?? '';
}

type BalanceState = { native: string; usdc: string; error?: boolean };

export function LiveBalances({ compact = false }: { compact?: boolean }) {
  const address = useWalletAddress();
  const [balances, setBalances] = useState<Record<number, BalanceState>>({});
  const [loading, setLoading] = useState(false);
  const load = async () => {
    if (!address) return;
    setLoading(true);
    const next: Record<number, BalanceState> = {};
    await Promise.all(SUPPORTED_CHAINS.map(async ({ chain }) => {
      try {
        const client = createPublicClient({ chain, transport: http() });
        const native = await client.getBalance({ address: address as `0x${string}` });
        let usdc = '0';
        const token = USDC[chain.id];
        if (token) usdc = formatUnits(await client.readContract({ address: token, abi: ERC20_ABI, functionName: 'balanceOf', args: [address as `0x${string}`] }) as bigint, 6);
        next[chain.id] = { native: formatEther(native), usdc };
      } catch { next[chain.id] = { native: '—', usdc: '—', error: true }; }
    }));
    setBalances(next); setLoading(false);
  };
  useEffect(() => { void load(); }, [address]);
  const totalNative = MAINNET_CHAINS.reduce((sum, { chain }) => sum + Number(balances[chain.id]?.native ?? 0), 0);
  const totalUsdc = MAINNET_CHAINS.reduce((sum, { chain }) => sum + Number(balances[chain.id]?.usdc ?? 0), 0);
  if (compact) return <div className="live-inline">{loading ? 'Loading…' : `${totalNative.toFixed(4)} ETH · ${totalUsdc.toFixed(2)} USDC`} <button className="plain-icon" onClick={load} aria-label="Refresh"><RefreshCw size={14}/></button></div>;
  return <div className="balance-list"><div className="live-summary"><div><strong>{totalNative.toFixed(4)} ETH</strong><span>Mainnet native</span></div><div><strong>{totalUsdc.toFixed(2)} USDC</strong><span>Mainnet stablecoins</span></div><button className="secondary" onClick={load} disabled={loading}>{loading?<Loader2 className="spin" size={16}/>:<RefreshCw size={16}/>} Refresh</button></div>{SUPPORTED_CHAINS.map(({ chain, name, symbol, environment })=>{const b=balances[chain.id];return <div className={`live-chain ${environment==='testnet'?'testnet-row':''}`} key={chain.id}><div className="chain-icon">{name[0]}</div><div><strong>{name}</strong><span>{b?.error?'RPC unavailable':b?`${b.native} ${symbol}`:'Loading…'}</span></div><div className="live-values"><strong>{b?.error?'—':b?.native??'—'}</strong><span>{b?.error?'—':`${b?.usdc??'—'} USDC`}</span></div></div>})}</div>;
}

export function SendForm() {
  const address = useWalletAddress();
  const { sendTransaction } = useSendTransaction();
  const [network,setNetwork]=useState('Base'); const [asset,setAsset]=useState<'ETH'|'USDC'>('ETH'); const [to,setTo]=useState(''); const [resolvedTo,setResolvedTo]=useState(''); const [amount,setAmount]=useState(''); const [review,setReview]=useState(false); const [status,setStatus]=useState(''); const [resolving,setResolving]=useState(false);
  const selected=SUPPORTED_CHAINS.find((x)=>x.name===network)!;
  const recipientIsUsername=to.trim().startsWith('@');
  const canReview=(isAddress(to)||recipientIsUsername)&&!!amount;
  const prepareReview=async()=>{if(!canReview)return;setStatus('');if(!recipientIsUsername){setResolvedTo(to);setReview(true);return;}setResolving(true);try{const name=to.trim().slice(1);const response=await fetch(`/api/usernames?username=${encodeURIComponent(name)}`,{cache:'no-store'});const data=await response.json();if(!response.ok)throw new Error(data.error??'Could not resolve username.');if(data.available||!data.walletAddress)throw new Error('Username not found.');setResolvedTo(data.walletAddress);setReview(true);}catch(e){setStatus(e instanceof Error?e.message:'Could not resolve username.')}finally{setResolving(false)}};
  const submit=async()=>{if(!address||!isAddress(resolvedTo)||!amount||Number(amount)<=0)return;setStatus('');try{if(asset==='ETH'){const result=await sendTransaction({to:resolvedTo as `0x${string}`,value:parseEther(amount),chainId:selected.chain.id},{address});setStatus(result.hash);}else{const token=USDC[selected.chain.id];if(!token)throw new Error('USDC is not available on this network.');const data=encodeFunctionData({abi:ERC20_ABI,functionName:'transfer',args:[resolvedTo as `0x${string}`,parseUnits(amount,6)]});const result=await sendTransaction({to:token,data,chainId:selected.chain.id},{address});setStatus(result.hash);}}catch(e){setStatus(e instanceof Error?e.message:'Transaction failed')}};
  return <div className="form-card">{review?<><div className="tx-review"><div className="tx-check"><ShieldCheck size={22}/></div><h2>Review transfer</h2><strong>{amount} {asset}</strong><p>on {network}</p></div><div className="review-line"><span>From</span><code>{address?`${address.slice(0,8)}…${address.slice(-6)}`:'—'}</code></div><div className="review-line"><span>To</span><code>{recipientIsUsername?`${to} · ${resolvedTo.slice(0,8)}…${resolvedTo.slice(-6)}`:`${resolvedTo.slice(0,8)}…${resolvedTo.slice(-6)}`}</code></div><div className="review-line"><span>Network</span><strong>{network}</strong></div><div className="button-row"><button className="secondary" onClick={()=>setReview(false)}><X size={16}/> Back</button><button className="primary" onClick={submit}>Confirm and sign <ShieldCheck size={16}/></button></div>{status&&<div className={`notice ${status.startsWith('0x')?'success':'error'}`}>{status.startsWith('0x')?<><Check size={15}/> Submitted · {status.slice(0,12)}…</>:status}</div>}</>:<><div className="form-heading"><h2>Send crypto</h2><span>Use an address or @username.</span></div><label className="field"><span>Network</span><select value={network} onChange={(e)=>setNetwork(e.target.value)}>{SUPPORTED_CHAINS.map((x)=><option key={x.name}>{x.name}</option>)}</select></label><label className="field"><span>Asset</span><select value={asset} onChange={(e)=>setAsset(e.target.value as 'ETH'|'USDC')}><option>ETH</option><option>USDC</option></select></label><label className="field"><span>Recipient</span><div className="input-with-action"><input value={to} onChange={(e)=>setTo(e.target.value)} placeholder="0x… or @username"/><button className="plain-icon" onClick={async()=>setTo(await navigator.clipboard.readText())} aria-label="Paste"><Copy size={15}/></button></div></label><label className="field"><span>Amount</span><div className="input-combo"><input inputMode="decimal" value={amount} onChange={(e)=>setAmount(e.target.value)} placeholder="0.00"/><b>{asset}</b></div></label><div className="notice"><ShieldCheck size={16}/><span>Recipient, network and amount are shown again before signing.</span></div>{status&&<div className="notice error">{status}</div>}<button className="primary large full" disabled={!canReview||resolving} onClick={prepareReview}>{resolving?<Loader2 className="spin" size={17}/>:<ArrowUpRight size={17}/>} {resolving?'Resolving…':'Review transfer'}</button></>}</div>;
}

export function LifiAction({ mode }: { mode:'swap'|'bridge' }) {
  const address=useWalletAddress(); const {sendTransaction}=useSendTransaction(); const [fromChain,setFromChain]=useState(8453); const [toChain,setToChain]=useState(42161); const [amount,setAmount]=useState('0.01'); const [quote,setQuote]=useState<any>(null); const [loading,setLoading]=useState(false); const [error,setError]=useState('');
  const getQuote=async()=>{if(!address||Number(amount)<=0)return;setLoading(true);setError('');setQuote(null);const targetChain=mode==='swap'?fromChain:toChain;const params=new URLSearchParams({fromChain:String(fromChain),toChain:String(targetChain),fromToken:ZERO_ADDRESS,toToken:USDC[targetChain]??ZERO_ADDRESS,fromAmount:parseEther(amount).toString(),fromAddress:address,toAddress:address,slippage:'0.005'});try{const r=await fetch(`https://li.quest/v1/quote?${params}`);if(!r.ok)throw new Error(`Quote unavailable (${r.status})`);setQuote(await r.json())}catch(e){setError(e instanceof Error?e.message:'Could not fetch quote')}setLoading(false)};
  const execute=async()=>{if(!quote?.transactionRequest||!address)return;try{const tx=quote.transactionRequest;const result=await sendTransaction({to:tx.to,data:tx.data,value:tx.value?BigInt(tx.value):undefined,chainId:Number(tx.chainId??fromChain)},{address});setQuote({...quote,executed:result.hash})}catch(e){setError(e instanceof Error?e.message:'Execution failed')}};
  return <div className="form-card"><div className="form-heading"><h2>{mode==='swap'?'Swap':'Bridge'}</h2><span>Route, review, sign.</span></div><div className="bridge-route"><label className="field"><span>From</span><select value={fromChain} onChange={(e)=>setFromChain(Number(e.target.value))}>{MAINNET_CHAINS.map(x=><option key={x.chain.id} value={x.chain.id}>{x.name}</option>)}</select></label>{mode==='bridge'&&<label className="field"><span>To</span><select value={toChain} onChange={(e)=>setToChain(Number(e.target.value))}>{MAINNET_CHAINS.map(x=><option key={x.chain.id} value={x.chain.id}>{x.name}</option>)}</select></label>}</div><label className="field"><span>Amount</span><div className="input-combo"><input inputMode="decimal" value={amount} onChange={(e)=>setAmount(e.target.value)}/><b>ETH</b></div></label>{quote&&<div className="quote-card"><div><span>You receive</span><strong>{quote.estimate?.toAmount??'—'} {quote.action?.toToken?.symbol??'USDC'}</strong></div><div><span>Route</span><strong>{quote.toolDetails?.name??quote.type??'LI.FI'}</strong></div></div>}{error&&<div className="notice error">{error}</div>}{quote?.executed?<div className="notice success"><Check size={15}/> Submitted · {quote.executed.slice(0,12)}…</div>:<div className="button-row"><button className="secondary" onClick={getQuote} disabled={loading}>{loading?<Loader2 className="spin" size={16}/>:<RefreshCw size={16}/>} Get quote</button>{quote&&<button className="primary" onClick={execute}>Confirm route <ShieldCheck size={16}/></button>}</div>}</div>;
}
