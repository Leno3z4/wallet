import { NextResponse } from 'next/server';

const gatewayBase = process.env.CIRCLE_GATEWAY_API_BASE ?? 'https://gateway-api-testnet.circle.com/v1';

export async function GET(request: Request) {
  const address = new URL(request.url).searchParams.get('address');
  if (!address) return NextResponse.json({ error: 'Address is required.' }, { status: 400 });
  try {
    const response = await fetch(`${gatewayBase}/balances`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: 'USDC', sources: [{ depositor: address }] }),
      cache: 'no-store',
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) return NextResponse.json({ error: body.message ?? 'Gateway balance unavailable.' }, { status: response.status });
    return NextResponse.json(body);
  } catch {
    return NextResponse.json({ error: 'Gateway is unavailable.' }, { status: 502 });
  }
}
