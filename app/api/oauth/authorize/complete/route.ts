import { NextResponse } from 'next/server';
import { loadClientMetadata, randomCode, storeAuthorizationCode } from '@/lib/mcp-oauth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const clientId = String(body.client_id ?? '');
    const redirectUri = String(body.redirect_uri ?? '');
    const state = String(body.state ?? '');
    const codeChallenge = String(body.code_challenge ?? '');
    const scope = String(body.scope ?? 'wallet:read');
    const identityToken = String(body.identityToken ?? '');
    if (!clientId || !redirectUri || !state || !codeChallenge || !identityToken) return NextResponse.json({ error: 'invalid_request', error_description: 'Missing OAuth parameters.' }, { status: 400 });
    const client = await loadClientMetadata(clientId);
    if (!client.redirect_uris.includes(redirectUri)) return NextResponse.json({ error: 'invalid_request', error_description: 'redirect_uri is not registered for this client.' }, { status: 400 });
    const allowedScopes = scope.split(' ').filter((value) => ['wallet:read', 'wallet:prepare'].includes(value));
    if (!allowedScopes.length) return NextResponse.json({ error: 'invalid_scope', error_description: 'No supported wallet scope was requested.' }, { status: 400 });
    const { userFromPrivyIdentityToken } = await import('@/lib/mcp-oauth');
    const identity = await userFromPrivyIdentityToken(identityToken);
    const code = randomCode();
    await storeAuthorizationCode({ code, clientId, redirectUri, codeChallenge, scope: allowedScopes.join(' '), userId: identity.userId, walletAddress: identity.walletAddress });
    const redirect = new URL(redirectUri);
    redirect.searchParams.set('code', code);
    redirect.searchParams.set('state', state);
    return NextResponse.json({ redirect_to: redirect.toString() });
  } catch (error) {
    return NextResponse.json({ error: 'access_denied', error_description: error instanceof Error ? error.message : 'Could not authorize this client.' }, { status: 400 });
  }
}
