import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { PrivyClient } from '@privy-io/node';

const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000').replace(/\/$/, '');
const MCP_SECRET = process.env.MCP_OAUTH_SECRET ?? '';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const MCP_SCOPES = ['wallet:read', 'wallet:prepare'] as const;

function b64url(input: Buffer | string) {
  return Buffer.from(input).toString('base64url');
}

function signJwt(payload: Record<string, unknown>, expiresInSeconds: number) {
  if (!MCP_SECRET) throw new Error('MCP_OAUTH_SECRET is not configured.');
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const now = Math.floor(Date.now() / 1000);
  const body = b64url(JSON.stringify({ ...payload, iat: now, exp: now + expiresInSeconds }));
  const input = `${header}.${body}`;
  const signature = createHmac('sha256', MCP_SECRET).update(input).digest();
  return `${input}.${b64url(signature)}`;
}

export function verifyAccessToken(token: string) {
  if (!MCP_SECRET) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, body, signature] = parts;
  try {
    const expected = createHmac('sha256', MCP_SECRET).update(`${header}.${body}`).digest();
    const actual = Buffer.from(signature, 'base64url');
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
    const headerObj = JSON.parse(Buffer.from(header, 'base64url').toString('utf8'));
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as Record<string, unknown>;
    if (headerObj.alg !== 'HS256' || typeof payload.exp !== 'number' || payload.exp <= Math.floor(Date.now() / 1000)) return null;
    if (payload.iss !== APP_URL || payload.aud !== 'wallet-mcp') return null;
    return payload;
  } catch {
    return null;
  }
}

function pkceChallenge(verifier: string) {
  return createHash('sha256').update(verifier).digest('base64url');
}

function supabaseHeaders() {
  if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error('Supabase is not configured.');
  return { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' };
}

export function appUrl() { return APP_URL; }
export function validatePkce(verifier: string, challenge: string) { return pkceChallenge(verifier) === challenge; }

export async function loadClientMetadata(clientId: string) {
  if (!clientId.startsWith('https://') && !clientId.startsWith('http://localhost')) throw new Error('client_id must be an HTTPS Client ID Metadata Document URL.');
  const response = await fetch(clientId, { cache: 'no-store' });
  if (!response.ok) throw new Error('Could not load client metadata.');
  const metadata = await response.json();
  if (metadata.client_id !== clientId || typeof metadata.client_name !== 'string') throw new Error('Invalid client metadata.');
  if (!Array.isArray(metadata.redirect_uris) || metadata.redirect_uris.some((value: unknown) => typeof value !== 'string')) throw new Error('Client metadata must include redirect_uris.');
  return metadata as { client_id: string; client_name: string; redirect_uris: string[]; token_endpoint_auth_method?: string };
}

export async function storeAuthorizationCode(input: {
  code: string;
  clientId: string;
  redirectUri: string;
  codeChallenge: string;
  scope: string;
  userId: string;
  walletAddress: string;
}) {
  if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error('Supabase is not configured.');
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
  const response = await fetch(`${SUPABASE_URL}/rest/v1/mcp_oauth_codes`, {
    method: 'POST', headers: { ...supabaseHeaders(), Prefer: 'return=minimal' },
    body: JSON.stringify({
      code_hash: createHash('sha256').update(input.code).digest('hex'),
      client_id: input.clientId,
      redirect_uri: input.redirectUri,
      code_challenge: input.codeChallenge,
      scope: input.scope,
      user_id: input.userId,
      wallet_address: input.walletAddress,
      expires_at: expiresAt,
    }),
  });
  if (!response.ok) throw new Error('Could not store authorization code.');
}

export async function redeemAuthorizationCode(input: { code: string; clientId: string; redirectUri: string; codeVerifier: string }) {
  if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error('Supabase is not configured.');
  const hash = createHash('sha256').update(input.code).digest('hex');
  const query = `code_hash=eq.${encodeURIComponent(hash)}&select=code_hash,client_id,redirect_uri,code_challenge,scope,user_id,wallet_address,expires_at,used_at`;
  const response = await fetch(`${SUPABASE_URL}/rest/v1/mcp_oauth_codes?${query}`, { headers: supabaseHeaders(), cache: 'no-store' });
  if (!response.ok) throw new Error('Could not read authorization code.');
  const rows = await response.json();
  const row = rows[0];
  if (!row || row.used_at || row.client_id !== input.clientId || row.redirect_uri !== input.redirectUri || new Date(row.expires_at).getTime() <= Date.now()) throw new Error('Invalid or expired authorization code.');
  if (!validatePkce(input.codeVerifier, row.code_challenge)) throw new Error('PKCE verification failed.');
  const update = await fetch(`${SUPABASE_URL}/rest/v1/mcp_oauth_codes?code_hash=eq.${encodeURIComponent(hash)}&used_at=is.null`, {
    method: 'PATCH', headers: { ...supabaseHeaders(), Prefer: 'return=minimal' }, body: JSON.stringify({ used_at: new Date().toISOString() }),
  });
  if (!update.ok) throw new Error('Authorization code could not be redeemed.');
  return row as { scope: string; user_id: string; wallet_address: string; client_id: string; redirect_uri: string };
}

export function issueAccessToken(input: { userId: string; walletAddress: string; clientId: string; scope: string }) {
  return signJwt({ iss: APP_URL, aud: 'wallet-mcp', sub: input.userId, wallet_address: input.walletAddress, client_id: input.clientId, scope: input.scope }, 60 * 60);
}

export function issueRefreshToken(input: { userId: string; walletAddress: string; clientId: string; scope: string }) {
  return signJwt({ iss: APP_URL, aud: 'wallet-mcp-refresh', sub: input.userId, wallet_address: input.walletAddress, client_id: input.clientId, scope: input.scope, typ: 'refresh' }, 30 * 24 * 60 * 60);
}

export function randomCode() { return b64url(randomBytes(32)); }

export async function userFromPrivyIdentityToken(idToken: string) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const appSecret = process.env.PRIVY_APP_SECRET;
  if (!appId || !appSecret) throw new Error('Privy server credentials are not configured.');
  const privy = new PrivyClient({ appId, appSecret });
  const user = await privy.users().get({ id_token: idToken });
  const linked = (user.linked_accounts ?? []) as Array<{ type?: string; chain_type?: string; address?: string; wallet_client_type?: string }>;
  const wallet = linked.find((account) => account.type === 'wallet' && account.chain_type === 'ethereum' && typeof account.address === 'string');
  if (!wallet?.address) throw new Error('No Ethereum wallet is bound to this Privy user.');
  return { userId: user.id, walletAddress: wallet.address };
}

export function oauthMetadata() {
  return {
    issuer: APP_URL,
    authorization_endpoint: `${APP_URL}/oauth/authorize`,
    token_endpoint: `${APP_URL}/oauth/token`,
    response_types_supported: ['code'],
    grant_types_supported: ['authorization_code', 'refresh_token'],
    code_challenge_methods_supported: ['S256'],
    scopes_supported: [...MCP_SCOPES],
    token_endpoint_auth_methods_supported: ['none'],
    client_id_metadata_document_supported: true,
  };
}
