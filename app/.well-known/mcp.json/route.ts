import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  return NextResponse.json({
    name: 'wallet',
    description: 'Agent access to wallet balances, networks, usernames, payment capabilities, and transaction proposals.',
    url: `${origin}/api/mcp`,
    transport: 'streamable-http',
    authentication: process.env.AGENT_MCP_API_KEY ? { type: 'bearer' } : { type: 'none' },
    capabilities: { tools: true },
  });
}
