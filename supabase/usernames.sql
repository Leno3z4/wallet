create table if not exists public.usernames (
  user_id text primary key,
  username text not null,
  username_normalized text not null unique,
  wallet_address text not null,
  created_at timestamptz not null default now()
);

alter table public.usernames add column if not exists wallet_address text;

create unique index if not exists usernames_username_normalized_idx
  on public.usernames (username_normalized);

comment on column public.usernames.username_normalized is 'NFKC + lowercase canonical value. Enforces case-insensitive uniqueness.';
comment on column public.usernames.wallet_address is 'Current EVM wallet address used to resolve @username sends.';
