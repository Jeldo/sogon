-- ============================================================
-- 소곤 (Sogon) Supabase Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- ── Tables ────────────────────────────────────────────────────

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  friend_tone text not null check (friend_tone in ('warm', 'cool', 'energetic')),
  created_at timestamptz not null default now()
);

create table public.entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  image_path text,
  created_at timestamptz not null default now()
);

create index idx_entries_user_created on public.entries (user_id, created_at desc);

create table public.reactions (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.entries(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  tone text not null check (tone in ('warm', 'cool', 'energetic')),
  created_at timestamptz not null default now(),
  unique (entry_id)
);

create index idx_reactions_entry on public.reactions (entry_id);

-- ── Row Level Security ────────────────────────────────────────

alter table public.profiles enable row level security;
alter table public.entries enable row level security;
alter table public.reactions enable row level security;

-- profiles
create policy "own profile select" on public.profiles
  for select using (auth.uid() = id);
create policy "own profile insert" on public.profiles
  for insert with check (auth.uid() = id);
create policy "own profile update" on public.profiles
  for update using (auth.uid() = id);

-- entries
create policy "own entries select" on public.entries
  for select using (auth.uid() = user_id);
create policy "own entries insert" on public.entries
  for insert with check (auth.uid() = user_id);
create policy "own entries update" on public.entries
  for update using (auth.uid() = user_id);
create policy "own entries delete" on public.entries
  for delete using (auth.uid() = user_id);

-- reactions
create policy "own reactions select" on public.reactions
  for select using (auth.uid() = user_id);
create policy "own reactions insert" on public.reactions
  for insert with check (auth.uid() = user_id);

-- ── Storage Bucket ────────────────────────────────────────────

insert into storage.buckets (id, name, public)
  values ('diary-images', 'diary-images', false);

-- Image path convention: {user_id}/{entry_id}.jpg

create policy "upload own images" on storage.objects
  for insert with check (
    bucket_id = 'diary-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "view own images" on storage.objects
  for select using (
    bucket_id = 'diary-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "delete own images" on storage.objects
  for delete using (
    bucket_id = 'diary-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
