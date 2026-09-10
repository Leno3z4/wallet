import { NextResponse } from 'next/server';

const TESTNET_URL = 'https://gateway-api-testnet.circle.com';
const MAINNET_URL = 'https://gateway-api.circle.com';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address')?.trim();
  const environment = searchParams.get('environment') === 'mainnet' ? 'mainnet' : 'testnet';
  if (!address) return NextResponse.json({ error: 'Wallet address is required.' }, { status: 400 });
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) return NextResponse.json({ error: 'Invalid EVM address.' }, { status: 400 });

  const base = environment === 'mainnet' ? MAINNET_URL : TESTNET_URL;
  try {
    const infoResponse = await fetch(`${base}/v1/info`, { cache: 'no-store' });
    const info = infoResponse.ok ? await infoResponse.json() : null;
    const domains = Array.isArray(info?.domains) ? info.domains.map((d: { domain: number }) => d.domain) : [];
    const body = { token: 'USDC', sources: domains.map((domain: number) => ({ domain, depositor: address })) };
    const balanceResponse = await fetch(`${base}/v1/balances`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), cache: 'no-store' });
    const balances = balanceResponse.ok ? await balanceResponse.json() : null;
    return NextResponse.json({ environment, info, balances });
  } catch {
    return NextResponse.json({ error: 'Circle Gateway is unavailable.' }, { status: 502 });
  }
}
