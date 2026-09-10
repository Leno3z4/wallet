import { NextResponse } from 'next/server';
import { validateUsername } from '@/lib/usernames';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function missingConfig() {
  return NextResponse.json({ error: 'Username storage is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.' }, { status: 503 });
}

export async function GET(request: Request) {
  if (!supabaseUrl || !serviceRoleKey) return missingConfig();
  const username = new URL(request.url).searchParams.get('username') ?? '';
  const validation = validateUsername(username);
  if (!validation.ok) return NextResponse.json({ available: false, error: validation.error }, { status: 400 });
  const url = `${supabaseUrl}/rest/v1/usernames?username_normalized=eq.${encodeURIComponent(validation.normalized)}&select=username,username_normalized,user_id,wallet_address`;
  const response = await fetch(url, { headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` }, cache: 'no-store' });
  if (!response.ok) return NextResponse.json({ error: 'Could not check username.' }, { status: 502 });
  const rows = await response.json();
  if (!rows[0]) return NextResponse.json({ available: true, username: null });
  return NextResponse.json({ available: false, username: rows[0].username, walletAddress: rows[0].wallet_address });
}

export async function POST(request: Request) {
  if (!supabaseUrl || !serviceRoleKey) return missingConfig();
  try {
    const body = await request.json();
    const userId = typeof body.userId === 'string' ? body.userId.trim() : '';
    const username = typeof body.username === 'string' ? body.username : '';
    const walletAddress = typeof body.walletAddress === 'string' ? body.walletAddress.trim() : '';
    if (!userId || !walletAddress) return NextResponse.json({ error: 'User id and wallet address are required.' }, { status: 400 });
    const validation = validateUsername(username);
    if (!validation.ok) return NextResponse.json({ error: validation.error }, { status: 400 });

    const existingResponse = await fetch(`${supabaseUrl}/rest/v1/usernames?username_normalized=eq.${encodeURIComponent(validation.normalized)}&select=username,username_normalized,user_id,wallet_address`, { headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` }, cache: 'no-store' });
    if (!existingResponse.ok) return NextResponse.json({ error: 'Could not check username.' }, { status: 502 });
    const existing = await existingResponse.json();
    if (existing[0] && existing[0].user_id !== userId) return NextResponse.json({ error: 'That username is already taken.' }, { status: 409 });
    if (existing[0] && existing[0].user_id === userId) {
      const updateResponse = await fetch(`${supabaseUrl}/rest/v1/usernames?user_id=eq.${encodeURIComponent(userId)}`, { method: 'PATCH', headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' }, body: JSON.stringify({ wallet_address: walletAddress }) });
      if (!updateResponse.ok) return NextResponse.json({ error: 'Could not update wallet address.' }, { status: 502 });
      return NextResponse.json({ username: existing[0].username, normalized: validation.normalized, unchanged: true });
    }

    const insertResponse = await fetch(`${supabaseUrl}/rest/v1/usernames`, {
      method: 'POST',
      headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}`, 'Content-Type': 'application/json', Prefer: 'return=representation,resolution=abort' },
      body: JSON.stringify({ user_id: userId, username, username_normalized: validation.normalized, wallet_address: walletAddress }),
    });
    if (insertResponse.status === 409) return NextResponse.json({ error: 'That username is already taken.' }, { status: 409 });
    if (!insertResponse.ok) return NextResponse.json({ error: 'Could not reserve username.' }, { status: 502 });
    return NextResponse.json({ username, normalized: validation.normalized }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
}
