create table if not exists public.mcp_oauth_codes (
  code_hash text primary key,
  client_id text not null,
  redirect_uri text not null,
  code_challenge text not null,
  scope text not null,
  user_id text not null,
  wallet_address text not null,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists mcp_oauth_codes_expiry_idx
  on public.mcp_oauth_codes (expires_at);

create index if not exists mcp_oauth_codes_user_idx
  on public.mcp_oauth_codes (user_id);

comment on table public.mcp_oauth_codes is 'Short-lived, one-time MCP OAuth authorization codes bound to client, redirect URI, PKCE challenge and Privy wallet identity.';

-- Run periodically from a scheduled job or maintenance function.
delete from public.mcp_oauth_codes where expires_at < now() - interval '1 day';
