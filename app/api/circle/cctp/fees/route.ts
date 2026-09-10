import { NextResponse } from 'next/server';

const cctpBase = process.env.CIRCLE_CCTP_API_BASE ?? 'https://iris-api.circle.com';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sourceDomain = url.searchParams.get('sourceDomain');
  const destinationDomain = url.searchParams.get('destinationDomain');
  if (sourceDomain === null || destinationDomain === null) return NextResponse.json({ error: 'sourceDomain and destinationDomain are required.' }, { status: 400 });
  try {
    const response = await fetch(`${cctpBase}/v2/burn/USDC/fees/${encodeURIComponent(sourceDomain)}/${encodeURIComponent(destinationDomain)}`, { cache: 'no-store' });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) return NextResponse.json({ error: body.message ?? 'CCTP fee data unavailable.' }, { status: response.status });
    return NextResponse.json(body);
  } catch {
    return NextResponse.json({ error: 'CCTP API unavailable.' }, { status: 502 });
  }
}
