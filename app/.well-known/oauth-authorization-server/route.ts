import { NextResponse } from 'next/server';
import { oauthMetadata } from '@/lib/mcp-oauth';

export function GET() { return NextResponse.json(oauthMetadata()); }
