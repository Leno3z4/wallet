import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sourceDomain = url.searchParams.get('sourceDomain');
  const transactionHash = url.searchParams.get('transactionHash');
  if (sourceDomain === null || !transactionHash) return NextResponse.json({ error: 'sourceDomain and transactionHash are required.' }, { status: 400 });
  if (!/^0x[a-fA-F0-9]{64}$/.test(transactionHash)) return NextResponse.json({ error: 'Invalid transaction hash.' }, { status: 400 });
  const host = process.env.CIRCLE_CCTP_API_BASE ?? 'https://iris-api.circle.com';
  try {
    const response = await fetch(`${host}/v2/messages/${encodeURIComponent(sourceDomain)}?transactionHash=${encodeURIComponent(transactionHash)}`, { cache: 'no-store' });
    const body = await response.json().catch(() => ({}));
    if (!response.ok && response.status !== 404) return NextResponse.json({ error: body.message ?? 'CCTP message unavailable.' }, { status: response.status });
    return NextResponse.json(body, { status: response.status });
  } catch {
    return NextResponse.json({ error: 'CCTP API unavailable.' }, { status: 502 });
  }
}
