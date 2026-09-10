import { NextResponse } from 'next/server';
import { isAddress } from 'viem';
import { MAINNET_CHAINS, SUPPORTED_CHAINS, TESTNET_CHAINS, USDC } from '@/lib/chains';
import { MCP_TOOLS } from '@/lib/mcp-tools';

const MCP_PROTOCOL_VERSION = '2026-06-18';
const AGENT_API_KEY = process.env.AGENT_MCP_API_KEY;

function unauthorized() {
  return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
    status: 401,
    headers: { 'content-type': 'application/json', 'www-authenticate': 'Bearer realm="wallet-mcp"' },
  });
}

function authorized(request: Request) {
  if (!AGENT_API_KEY) return true;
  const value = request.headers.get('authorization') ?? '';
  return value === `Bearer ${AGENT_API_KEY}`;
}

function rpc(id: unknown, result: unknown) {
  return NextResponse.json({ jsonrpc: '2.0', id, result });
}

function error(id: unknown, code: number, message: string) {
  return NextResponse.json({ jsonrpc: '2.0', id, error: { code, message } }, { status: 200 });
}

function text(value: unknown) {
  return { content: [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }] };
}

function gatewayUrl(base: string, address: string) {
  return `${base}/v1/balances`;
}

export async function GET(request: Request) {
  if (!authorized(request)) return unauthorized();
  return rpc(null, {
    protocolVersion: MCP_PROTOCOL_VERSION,
    serverInfo: { name: 'wallet', version: '1.0.0' },
    capabilities: { tools: {} },
  });
}

export async function POST(request: Request) {
  if (!authorized(request)) return unauthorized();
  let body: any;
  try {
    body = await request.json();
  } catch {
    return error(null, -32700, 'Invalid JSON.');
  }

  const id = body?.id ?? null;
  const method = body?.method;

  if (method === 'initialize') {
    return rpc(id, {
      protocolVersion: body?.params?.protocolVersion ?? MCP_PROTOCOL_VERSION,
      capabilities: { tools: {} },
      serverInfo: { name: 'wallet', version: '1.0.0' },
      instructions: 'This wallet MCP can read wallet state and prepare transactions. It never signs or broadcasts a transfer through MCP.',
    });
  }

  if (method === 'notifications/initialized') return new Response(null, { status: 204 });

  if (method === 'tools/list') {
    return rpc(id, { tools: MCP_TOOLS });
  }

  if (method !== 'tools/call') return error(id, -32601, `Unsupported method: ${String(method)}`);

  const name = body?.params?.name;
  const args = body?.params?.arguments ?? {};

  if (name === 'wallet_get_address') {
    return rpc(id, text({ note: 'MCP requests are not bound to a browser session. Connect through the wallet agent authorization layer to attach a user wallet.' }));
  }

  if (name === 'wallet_get_networks') {
    return rpc(id, text(SUPPORTED_CHAINS.map(({ key, chain, name: networkName, symbol, environment }) => ({ key, name: networkName, chainId: chain.id, symbol, environment }))));
  }

  if (name === 'wallet_get_payment_capabilities') {
    return rpc(id, text({
      stablecoins: ['USDC', 'EURC'],
      crossChain: ['Circle CCTP', 'Circle Gateway'],
      gas: ['Circle Paymaster', 'Circle Gas Station'],
      payments: ['Circle Payments Network', 'x402'],
      programmable: ['Circle Contracts', 'Circle Modules'],
      compliance: ['Circle Compliance Engine'],
      fiat: ['Circle Mint'],
      note: 'Capabilities may require configured credentials, compatible smart-account infrastructure, onboarding, or regional availability.',
    }));
  }

  if (name === 'wallet_resolve_username') {
    const raw = String(args.username ?? '').trim().replace(/^@/, '');
    if (!raw) return rpc(id, text({ found: false, error: 'Username is required.' }));
    const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    try {
      const response = await fetch(`${base}/api/usernames?username=${encodeURIComponent(raw)}`, { cache: 'no-store' });
      const data = await response.json();
      return rpc(id, text({ username: raw, ...data }));
    } catch {
      return rpc(id, text({ username: raw, found: false, error: 'Username service unavailable.' }));
    }
  }

  if (name === 'wallet_get_balances') {
    const address = typeof args.address === 'string' ? args.address.trim() : '';
    if (!isAddress(address)) return rpc(id, text({ error: 'Provide the wallet address in arguments.address.' }));
    const rows = await Promise.all(SUPPORTED_CHAINS.map(async ({ chain, name: networkName, symbol, environment }) => {
      try {
        const rpcUrl = chain.rpcUrls.default.http[0];
        const native = await fetch(rpcUrl, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_getBalance', params: [address, 'latest'] }) });
        const nativeJson = await native.json();
        const nativeWei = BigInt(nativeJson.result ?? '0x0');
        const nativeAmount = Number(nativeWei) / 1e18;
        return { network: networkName, chainId: chain.id, environment, native: `${nativeAmount} ${symbol}`, usdc: USDC[chain.id] ? 'See wallet UI for token balance' : null };
      } catch {
        return { network: networkName, chainId: chain.id, environment, unavailable: true };
      }
    }));
    return rpc(id, text(rows));
  }

  if (name === 'wallet_prepare_transfer') {
    const to = String(args.to ?? '').trim();
    const amount = String(args.amount ?? '').trim();
    const asset = String(args.asset ?? '').toUpperCase();
    const network = String(args.network ?? '').trim();
    if (!to || !amount || !network || !['ETH', 'USDC'].includes(asset)) return rpc(id, text({ error: 'to, amount, asset and network are required.' }));
    const networkEntry = SUPPORTED_CHAINS.find((x) => x.name.toLowerCase() === network.toLowerCase() || x.key.toLowerCase() === network.toLowerCase());
    if (!networkEntry) return rpc(id, text({ error: 'Unsupported network.' }));
    const recipient = isAddress(to) ? to : to.startsWith('@') ? to : '';
    return rpc(id, text({
      status: 'approval_required',
      action: 'transfer',
      asset,
      amount,
      network: networkEntry.name,
      chainId: networkEntry.chain.id,
      recipient,
      recipientInput: to,
      signed: false,
      broadcast: false,
      message: 'This is a transaction proposal only. The user must review and approve it in the wallet before signing.',
    }));
  }

  return error(id, -32602, `Unknown tool: ${String(name)}`);
}
