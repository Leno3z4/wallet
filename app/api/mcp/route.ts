import { NextResponse } from 'next/server';
import { isAddress } from 'viem';
import { SUPPORTED_CHAINS } from '@/lib/chains';
import { MCP_TOOLS } from '@/lib/mcp-tools';

const MCP_PROTOCOL_VERSION = '2026-07-28';
const AGENT_API_KEY = process.env.AGENT_MCP_API_KEY;

function unauthorized() { return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'content-type': 'application/json', 'www-authenticate': 'Bearer realm="wallet-mcp"' } }); }
function authorized(request: Request) { if (!AGENT_API_KEY) return true; return request.headers.get('authorization') === `Bearer ${AGENT_API_KEY}`; }
function rpc(id: unknown, result: unknown) { return NextResponse.json({ jsonrpc: '2.0', id, result }); }
function error(id: unknown, code: number, message: string) { return NextResponse.json({ jsonrpc: '2.0', id, error: { code, message } }); }
function text(value: unknown) { return { content: [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }] }; }

export async function OPTIONS() { return new NextResponse(null, { status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'authorization,content-type,mcp-method,mcp-name', 'access-control-allow-methods': 'GET,POST,OPTIONS' } }); }

export async function GET(request: Request) {
  if (!authorized(request)) return unauthorized();
  return rpc(null, { protocolVersion: MCP_PROTOCOL_VERSION, serverInfo: { name: 'wallet', version: '1.0.0' }, capabilities: { tools: {} } });
}

export async function POST(request: Request) {
  if (!authorized(request)) return unauthorized();
  let body: any;
  try { body = await request.json(); } catch { return error(null, -32700, 'Invalid JSON.'); }
  const id = body?.id ?? null; const method = body?.method;
  if (method === 'initialize') return rpc(id, { protocolVersion: MCP_PROTOCOL_VERSION, capabilities: { tools: {} }, serverInfo: { name: 'wallet', version: '1.0.0' }, instructions: 'Read wallet data and prepare reviewable actions. MCP cannot sign or broadcast transactions.' });
  if (method === 'notifications/initialized') return new Response(null, { status: 204 });
  if (method === 'tools/list') return rpc(id, { tools: MCP_TOOLS });
  if (method !== 'tools/call') return error(id, -32601, `Unsupported method: ${String(method)}`);

  const name = body?.params?.name; const args = body?.params?.arguments ?? {};
  if (name === 'wallet_get_address') {
    const address = typeof args.address === 'string' ? args.address.trim() : '';
    return rpc(id, text({ address: isAddress(address) ? address : null, note: 'Pass the wallet address as arguments.address when the agent session is not user-bound.' }));
  }
  if (name === 'wallet_get_networks') return rpc(id, text(SUPPORTED_CHAINS.map(({ key, chain, name: networkName, symbol, environment }) => ({ key, name: networkName, chainId: chain.id, symbol, environment }))));
  if (name === 'wallet_get_payment_capabilities') return rpc(id, text({ stablecoins: ['USDC', 'EURC'], crossChain: ['Circle CCTP', 'Circle Gateway'], gas: ['Circle Paymaster', 'Circle Gas Station'], payments: ['Circle Payments Network', 'x402'], programmable: ['Circle Contracts', 'Circle Modules'], compliance: ['Circle Compliance Engine'], fiat: ['Circle Mint'], note: 'Some capabilities require credentials, onboarding, compatible smart accounts, or regional availability.' }));
  if (name === 'wallet_resolve_username') {
    const raw = String(args.username ?? '').trim().replace(/^@/, ''); if (!raw) return rpc(id, text({ found: false, error: 'Username is required.' }));
    const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    try { const response = await fetch(`${base}/api/usernames?username=${encodeURIComponent(raw)}`, { cache: 'no-store' }); return rpc(id, text({ username: raw, ...(await response.json()) })); }
    catch { return rpc(id, text({ username: raw, found: false, error: 'Username service unavailable.' })); }
  }
  if (name === 'wallet_get_balances') {
    const address = typeof args.address === 'string' ? args.address.trim() : ''; if (!isAddress(address)) return rpc(id, text({ error: 'Provide a wallet address as arguments.address.' }));
    const rows = await Promise.all(SUPPORTED_CHAINS.map(async ({ chain, name: networkName, symbol, environment }) => { try { const rpcUrl = chain.rpcUrls.default.http[0]; const response = await fetch(rpcUrl, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_getBalance', params: [address, 'latest'] }) }); const json = await response.json(); const wei = BigInt(json.result ?? '0x0'); return { network: networkName, chainId: chain.id, environment, native: `${Number(wei) / 1e18} ${symbol}` }; } catch { return { network: networkName, chainId: chain.id, environment, unavailable: true }; } }));
    return rpc(id, text(rows));
  }
  if (name === 'wallet_prepare_transfer') {
    const to = String(args.to ?? '').trim(); const amount = String(args.amount ?? '').trim(); const asset = String(args.asset ?? '').toUpperCase(); const network = String(args.network ?? '').trim();
    if (!to || !amount || !network || !['ETH', 'USDC'].includes(asset)) return rpc(id, text({ error: 'to, amount, asset and network are required.' }));
    const networkEntry = SUPPORTED_CHAINS.find((x) => x.name.toLowerCase() === network.toLowerCase() || x.key.toLowerCase() === network.toLowerCase()); if (!networkEntry) return rpc(id, text({ error: 'Unsupported network.' }));
    return rpc(id, text({ status: 'approval_required', asset, amount, network: networkEntry.name, chainId: networkEntry.chain.id, recipient: isAddress(to) ? to : to.startsWith('@') ? to : null, recipientInput: to, signed: false, broadcast: false, message: 'Transaction proposal only. User review and wallet signing are required.' }));
  }
  return error(id, -32602, `Unknown tool: ${String(name)}`);
}
