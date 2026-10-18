-- DutaLED: jalankan seluruh SQL ini di Supabase Dashboard > SQL Editor.
-- Tabel katalog hanya berisi data publik. Jangan menyimpan biaya/modal di products.
create table if not exists public.products (
  id text primary key,
  name text not null,
  code text not null unique,
  category text not null default 'Lainnya',
  price numeric(14,2) not null default 0 check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  badge text not null default '',
  emoji text not null default '💡',
  image text not null default '',
  description text not null default '',
  retail_discount numeric(5,2) not null default 0 check (retail_discount between 0 and 100),
  quantity_tiers jsonb not null default '[]'::jsonb,
  promo jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.products enable row level security;
alter table public.admins enable row level security;
drop policy if exists "Public can read active catalog products" on public.products;
create policy "Public can read active catalog products" on public.products for select to anon, authenticated using (active = true);
drop policy if exists "Admins can read all products" on public.products;
create policy "Admins can read all products" on public.products for select to authenticated using (exists (select 1 from public.admins a where a.user_id = (select auth.uid())));
drop policy if exists "Admins can insert products" on public.products;
create policy "Admins can insert products" on public.products for insert to authenticated with check (exists (select 1 from public.admins a where a.user_id = (select auth.uid())));
drop policy if exists "Admins can update products" on public.products;
create policy "Admins can update products" on public.products for update to authenticated using (exists (select 1 from public.admins a where a.user_id = (select auth.uid()))) with check (exists (select 1 from public.admins a where a.user_id = (select auth.uid())));
drop policy if exists "Admins can delete products" on public.products;
create policy "Admins can delete products" on public.products for delete to authenticated using (exists (select 1 from public.admins a where a.user_id = (select auth.uid())));
drop policy if exists "Admins can view their own admin record" on public.admins;
create policy "Admins can view their own admin record" on public.admins for select to authenticated using (user_id = (select auth.uid()));
grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
grant select on public.admins to authenticated;

-- OPSIONAL: setelah akun admin dibuat di Authentication > Users, masukkan UUID-nya:
-- insert into public.admins (user_id) values ('UUID-AKUN-ADMIN');
