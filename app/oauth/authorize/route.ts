import { NextResponse } from 'next/server';
import { appUrl, loadClientMetadata } from '@/lib/mcp-oauth';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const clientId = url.searchParams.get('client_id') ?? '';
  const redirectUri = url.searchParams.get('redirect_uri') ?? '';
  const responseType = url.searchParams.get('response_type') ?? '';
  const state = url.searchParams.get('state') ?? '';
  const codeChallenge = url.searchParams.get('code_challenge') ?? '';
  const codeChallengeMethod = url.searchParams.get('code_challenge_method') ?? '';
  const scope = (url.searchParams.get('scope') ?? 'wallet:read').split(' ').filter(Boolean);

  if (responseType !== 'code' || !state || !codeChallenge || codeChallengeMethod !== 'S256') return NextResponse.json({ error: 'invalid_request', error_description: 'Authorization Code + PKCE (S256) is required.' }, { status: 400 });
  if (!clientId || !redirectUri) return NextResponse.json({ error: 'invalid_request', error_description: 'client_id and redirect_uri are required.' }, { status: 400 });

  try {
    const client = await loadClientMetadata(clientId);
    if (!client.redirect_uris.includes(redirectUri)) return NextResponse.json({ error: 'invalid_request', error_description: 'redirect_uri is not registered for this client.' }, { status: 400 });
    const next = new URL('/oauth/authorize/consent', appUrl());
    for (const [key, value] of url.searchParams) next.searchParams.set(key, value);
    next.searchParams.set('client_name', client.client_name);
    return NextResponse.redirect(next);
  } catch (error) {
    return NextResponse.json({ error: 'invalid_client_metadata', error_description: error instanceof Error ? error.message : 'Could not validate client metadata.' }, { status: 400 });
  }
}
