import { NextResponse } from 'next/server';
import { appUrl } from '@/lib/mcp-oauth';

export async function GET() {
  const origin = appUrl();
  return NextResponse.json({
    name: 'wallet',
    description: 'Agent access to wallet balances, networks, usernames, payment capabilities, and reviewable transaction proposals.',
    url: `${origin}/api/mcp`,
    transport: 'streamable-http',
    authentication: { type: 'oauth2', issuer: origin, protectedResourceMetadata: `${origin}/.well-known/oauth-protected-resource`, authorizationServerMetadata: `${origin}/.well-known/oauth-authorization-server`, scopes: ['wallet:read', 'wallet:prepare'] },
    capabilities: { tools: true },
  });
}
