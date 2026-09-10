create table if not exists public.usernames (
  user_id text primary key,
  username text not null,
  username_normalized text not null unique,
  created_at timestamptz not null default now()
);

create unique index if not exists usernames_username_normalized_idx
  on public.usernames (username_normalized);

comment on column public.usernames.username_normalized is 'NFKC + lowercase canonical value. Enforces case-insensitive uniqueness.';
