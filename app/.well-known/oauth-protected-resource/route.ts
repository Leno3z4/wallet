import { NextResponse } from 'next/server';
import { appUrl } from '@/lib/mcp-oauth';

export function GET() {
  return NextResponse.json({ resource: `${appUrl()}/api/mcp`, authorization_servers: [appUrl()], scopes_supported: ['wallet:read', 'wallet:prepare'], bearer_methods_supported: ['header'] });
}
