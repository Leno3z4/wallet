import { NextResponse } from 'next/server';
import { issueAccessToken, issueRefreshToken, redeemAuthorizationCode, verifyToken } from '@/lib/mcp-oauth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const grantType = String(form.get('grant_type') ?? '');
    const clientId = String(form.get('client_id') ?? '');
    if (!clientId) return NextResponse.json({ error: 'invalid_client', error_description: 'client_id is required.' }, { status: 401 });
    if (grantType === 'authorization_code') {
      const code = String(form.get('code') ?? ''); const redirectUri = String(form.get('redirect_uri') ?? ''); const codeVerifier = String(form.get('code_verifier') ?? '');
      if (!code || !redirectUri || !codeVerifier) return NextResponse.json({ error: 'invalid_request', error_description: 'code, redirect_uri and code_verifier are required.' }, { status: 400 });
      const record = await redeemAuthorizationCode({ code, clientId, redirectUri, codeVerifier });
      const accessToken = issueAccessToken({ userId: record.user_id, walletAddress: record.wallet_address, clientId, scope: record.scope });
      const refreshToken = issueRefreshToken({ userId: record.user_id, walletAddress: record.wallet_address, clientId, scope: record.scope });
      return NextResponse.json({ access_token: accessToken, token_type: 'Bearer', expires_in: 3600, refresh_token: refreshToken, scope: record.scope });
    }
    if (grantType === 'refresh_token') {
      const refreshToken = String(form.get('refresh_token') ?? ''); const payload = verifyToken(refreshToken, 'wallet-mcp-refresh');
      if (!payload || payload.client_id !== clientId) return NextResponse.json({ error: 'invalid_grant', error_description: 'Invalid or expired refresh token.' }, { status: 400 });
      const accessToken = issueAccessToken({ userId: String(payload.sub), walletAddress: String(payload.wallet_address), clientId, scope: String(payload.scope ?? 'wallet:read') });
      return NextResponse.json({ access_token: accessToken, token_type: 'Bearer', expires_in: 3600, scope: String(payload.scope ?? 'wallet:read') });
    }
    return NextResponse.json({ error: 'unsupported_grant_type' }, { status: 400 });
  } catch (error) { return NextResponse.json({ error: 'invalid_grant', error_description: error instanceof Error ? error.message : 'Token exchange failed.' }, { status: 400 }); }
}

export async function OPTIONS() { return new NextResponse(null, { status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'content-type', 'access-control-allow-methods': 'POST,OPTIONS' } }); }
