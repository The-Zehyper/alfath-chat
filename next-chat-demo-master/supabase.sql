-- =========================================================
-- Daily Chat v2: custom username + password authentication
-- NO Supabase Auth, NO email, NO OAuth.
-- Run this entire file in Supabase SQL Editor.
-- =========================================================

create extension if not exists pgcrypto;

-- If upgrading from the previous Daily Chat schema, remove the old
-- auth.users foreign key because v2 users are completely independent.
alter table if exists public.users drop constraint if exists users_id_fkey;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  username text,
  display_name text not null default 'User',
  avatar_url text not null default '/avatar.svg',
  password_hash text,
  created_at timestamptz not null default now()
);

-- Make the v2 columns available when the old table already exists.
alter table public.users add column if not exists username text;
alter table public.users add column if not exists password_hash text;
alter table public.users alter column avatar_url set default '/avatar.svg';

-- Case-insensitive uniqueness. Andi / andi / ANDI are the same account.
create unique index if not exists users_username_lower_unique
  on public.users (lower(username))
  where username is not null;

create table if not exists public.messages (
  id uuid primary key,
  text text not null,
  send_by uuid not null references public.users(id) on delete cascade,
  is_edit boolean not null default false,
  created_at timestamptz not null default now()
);

-- Browser may read only non-sensitive profile fields and messages.
-- Password hashes are never selected by the app's browser queries.
alter table public.users enable row level security;
alter table public.messages enable row level security;

drop policy if exists "Public can view profiles" on public.users;
drop policy if exists "Public can view messages" on public.messages;
create policy "Public can view profiles" on public.users
  for select to anon, authenticated
  using (true);

-- Never expose password hashes through the public API.
revoke select (password_hash) on public.users from anon, authenticated;
grant select (id, username, display_name, avatar_url, created_at) on public.users to anon, authenticated;
create policy "Public can view messages" on public.messages
  for select to anon, authenticated
  using (true);

-- Inserts/updates/deletes are performed only by protected Next.js API routes.
-- The service-role key is server-only and is never exposed to the browser.

do $$
begin
  alter publication supabase_realtime add table public.messages;
exception when duplicate_object then null;
end $$;

alter table public.messages replica identity full;

-- =========================================================
-- END
-- =========================================================
