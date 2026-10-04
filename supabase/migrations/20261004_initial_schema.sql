-- 1. Extensions
create extension if not exists "uuid-ossp";

-- 2. Master & Entitas Utama

-- Tabel Ormawa
create table if not exists public.ormawa (
  id text primary key,
  name text not null,
  full_name text not null,
  short_name text not null,
  type text not null,
  logo_url text,
  pdh_color_name text,
  ketua text,
  instagram text,
  pagu_anggaran bigint default 0,
  serapan_anggaran bigint default 0,
  color_config jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Tabel Periode Akademik / Kepengurusan
create table if not exists public.academic_periods (
  id text primary key,
  name text not null,
  is_active boolean default false,
  start_date date not null,
  end_date date not null,
  created_at timestamptz default now()
);

-- Tabel Profiles (Relasi ke auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  name text not null,
  nim text not null,
  ormawa_id text not null references public.ormawa(id) on update cascade,
  role text not null check (role in ('ketua', 'wakil', 'sekretaris', 'bendahara', 'anggota')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  approved_by uuid references public.profiles(id),
  approved_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tabel Sesi Perangkat (Maks 2 Device Login Bersamaan)
create table if not exists public.user_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  device_info text,
  session_token text not null,
  is_active boolean default true,
  last_active timestamptz default now(),
  created_at timestamptz default now()
);

create index if not exists idx_user_sessions_user_active on public.user_sessions(user_id, is_active);

-- 3. Operasional Proker, Audit & Keuangan

-- Tabel Program Kerja (Proker)
create table if not exists public.proker (
  id uuid primary key default gen_random_uuid(),
  ormawa_id text not null references public.ormawa(id) on update cascade,
  period_id text not null references public.academic_periods(id) on update cascade,
  created_by uuid references public.profiles(id),
  title text not null,
  divisi text not null,
  pic text not null,
  pic_contact text,
  start_date date not null,
  end_date date not null,
  location text,
  target_audience text,
  target_peserta integer default 0,
  realisasi_peserta integer,
  rab bigint default 0,
  realisasi_dana bigint default 0,
  description text,
  status text not null default 'draft' check (status in (
    'draft', 'proposal_pending', 'proposal_approved', 'proposal_revisi',
    'lpj_pending', 'lpj_overdue', 'completed', 'deletion_pending'
  )),
  proposal_data jsonb default '{}'::jsonb,
  inspection_data jsonb default '{}'::jsonb,
  lpj_data jsonb default '{}'::jsonb,
  other_docs jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_proker_ormawa on public.proker(ormawa_id);
create index if not exists idx_proker_period on public.proker(period_id);
create index if not exists idx_proker_status on public.proker(status);

-- Tabel Bank Template Dokumen Resmi
create table if not exists public.document_templates (
  id text primary key,
  title text not null,
  category text not null,
  category_slug text not null default 'lainnya',
  format text default 'DOCX',
  file_size text default '150 KB',
  download_count integer default 0,
  periode text default '2025/2026',
  is_official boolean default true,
  author text default 'DPM FASILKOM UMB',
  description text,
  tags jsonb default '[]'::jsonb,
  fields jsonb default '[]'::jsonb,
  content_preview text,
  file_url text,
  uploaded_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tabel Surat Peringatan (SP)
create table if not exists public.surat_peringatan (
  id uuid primary key default gen_random_uuid(),
  proker_id uuid references public.proker(id) on delete set null,
  ormawa_id text not null references public.ormawa(id) on update cascade,
  period_id text not null references public.academic_periods(id) on update cascade,
  nomor_sp text not null unique,
  tingkat text not null check (tingkat in ('SP1', 'SP2', 'SP3')),
  perihal text not null,
  keterangan text not null,
  tenggat_klarifikasi date not null,
  status text not null default 'aktif' check (status in ('aktif', 'klarifikasi_diajukan', 'selesai')),
  response_data jsonb default '{}'::jsonb,
  issued_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

-- Tabel Transaksi Anggaran Ormawa
create table if not exists public.budget_transactions (
  id uuid primary key default gen_random_uuid(),
  ormawa_id text not null references public.ormawa(id) on update cascade,
  period_id text not null references public.academic_periods(id) on update cascade,
  proker_id uuid references public.proker(id) on delete set null,
  type text not null check (type in ('pemasukan', 'pengeluaran')),
  nominal bigint not null check (nominal > 0),
  keterangan text not null,
  tanggal date not null,
  receipt_url text,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

-- Tabel Permohonan Hapus Proker
create table if not exists public.deletion_requests (
  id uuid primary key default gen_random_uuid(),
  proker_id uuid not null references public.proker(id) on delete cascade,
  ormawa_id text not null references public.ormawa(id) on update cascade,
  alasan text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

-- Tabel Log Aktivitas (Append-Only)
create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id),
  ormawa_id text references public.ormawa(id),
  action text not null,
  details jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Tabel Notifikasi Sistem
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_ormawa_id text not null,
  recipient_user_id uuid references public.profiles(id),
  title text not null,
  message text not null,
  type text not null check (type in ('proposal', 'audit', 'sp', 'account', 'system')),
  is_read boolean default false,
  link_tab text,
  created_at timestamptz default now()
);

create index if not exists idx_notif_recipient on public.notifications(recipient_ormawa_id, is_read);

-- 4. Fungsi & Trigger Otomatis

-- Helper: Cek status profil DPM aktif
create or replace function public.is_approved_dpm()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and ormawa_id = 'dpm'
      and status = 'approved'
  );
$$ language sql stable security definer;

-- Helper: Cek pimpinan DPM (Ketua & Sekretaris) untuk approval akun
create or replace function public.is_dpm_leader()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and ormawa_id = 'dpm'
      and status = 'approved'
      and role in ('ketua', 'sekretaris')
  );
$$ language sql stable security definer;

-- Trigger: Otomatis sinkron data registrasi Auth ke tabel profiles
create or replace function public.handle_new_user()
returns trigger as $$
declare
  raw_username text;
  raw_name text;
  raw_nim text;
  raw_ormawa text;
  raw_role text;
  init_status text;
begin
  raw_username := coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1));
  raw_name := coalesce(new.raw_user_meta_data->>'name', raw_username);
  raw_nim := coalesce(new.raw_user_meta_data->>'nim', '-');
  raw_ormawa := coalesce(new.raw_user_meta_data->>'ormawa_id', 'bem');
  raw_role := coalesce(new.raw_user_meta_data->>'role', 'anggota');
  
  -- Pendaftar DPM pertama otomatis approved sebagai Superadmin awal
  if raw_ormawa = 'dpm' and not exists (select 1 from public.profiles where ormawa_id = 'dpm') then
    init_status := 'approved';
  else
    init_status := 'pending';
  end if;

  insert into public.profiles (id, username, name, nim, ormawa_id, role, status)
  values (new.id, raw_username, raw_name, raw_nim, raw_ormawa, raw_role, init_status);

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Fungsi: Batasi login pengurus maksimal 2 perangkat aktif bersamaan
create or replace function public.register_user_session(
  p_device_info text,
  p_session_token text
)
returns void as $$
declare
  v_user_id uuid := auth.uid();
  v_active_count integer;
  v_oldest_session_id uuid;
begin
  if v_user_id is null then
    return;
  end if;

  select count(*) into v_active_count
  from public.user_sessions
  where user_id = v_user_id and is_active = true;

  -- Jika sudah 2 perangkat, nonaktifkan sesi yang paling lama
  if v_active_count >= 2 then
    select id into v_oldest_session_id
    from public.user_sessions
    where user_id = v_user_id and is_active = true
    order by last_active asc
    limit 1;

    update public.user_sessions
    set is_active = false
    where id = v_oldest_session_id;
  end if;

  insert into public.user_sessions (user_id, device_info, session_token, is_active, last_active)
  values (v_user_id, p_device_info, p_session_token, true, now());
end;
$$ language plpgsql security definer;

-- 5. Row Level Security (RLS) Policies

alter table public.ormawa enable row level security;
alter table public.academic_periods enable row level security;
alter table public.profiles enable row level security;
alter table public.user_sessions enable row level security;
alter table public.proker enable row level security;
alter table public.document_templates enable row level security;
alter table public.surat_peringatan enable row level security;
alter table public.budget_transactions enable row level security;
alter table public.deletion_requests enable row level security;
alter table public.activity_logs enable row level security;
alter table public.notifications enable row level security;

-- Policies: Ormawa & Periode
create policy "Ormawa viewable by everyone"
  on public.ormawa for select using (true);

create policy "DPM can update ormawa"
  on public.ormawa for update
  using (public.is_approved_dpm());

create policy "Academic periods viewable by everyone"
  on public.academic_periods for select using (true);

create policy "DPM can manage academic periods"
  on public.academic_periods for all
  using (public.is_approved_dpm());

-- Policies: Profiles & Sesi
create policy "Approved profiles viewable by everyone"
  on public.profiles for select
  using (status = 'approved' or id = auth.uid() or public.is_approved_dpm());

create policy "Users can update their own profile"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "DPM leaders can approve or reject accounts"
  on public.profiles for update
  using (public.is_dpm_leader());

create policy "Users can manage their own sessions"
  on public.user_sessions for all
  using (user_id = auth.uid());

-- Policies: Proker
create policy "Proker viewable by everyone"
  on public.proker for select using (true);

create policy "Ormawa can create proker"
  on public.proker for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
        and ormawa_id = proker.ormawa_id
        and status = 'approved'
        and role in ('ketua', 'sekretaris')
    )
  );

create policy "Ormawa can update their own proker"
  on public.proker for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
        and ormawa_id = proker.ormawa_id
        and status = 'approved'
    )
    or public.is_approved_dpm()
  );

create policy "DPM can delete proker"
  on public.proker for delete
  using (public.is_approved_dpm());

-- Policies: Bank Template Dokumen
create policy "Templates viewable by everyone"
  on public.document_templates for select using (true);

create policy "DPM can manage document templates"
  on public.document_templates for all
  using (public.is_approved_dpm());

-- Policies: Surat Peringatan (SP)
create policy "Surat Peringatan viewable by everyone"
  on public.surat_peringatan for select using (true);

create policy "DPM can manage SP"
  on public.surat_peringatan for all
  using (public.is_approved_dpm());

create policy "Ormawa can respond SP"
  on public.surat_peringatan for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
        and ormawa_id = surat_peringatan.ormawa_id
        and status = 'approved'
        and role in ('ketua', 'sekretaris')
    )
  );

-- Policies: Transaksi Anggaran
create policy "Budget transactions viewable by everyone"
  on public.budget_transactions for select using (true);

create policy "Ormawa bendahara/ketua can insert transactions"
  on public.budget_transactions for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
        and ormawa_id = budget_transactions.ormawa_id
        and status = 'approved'
        and role in ('ketua', 'bendahara')
    )
    or public.is_approved_dpm()
  );

create policy "DPM can manage budget transactions"
  on public.budget_transactions for all
  using (public.is_approved_dpm());

-- Policies: Activity Logs (Append-Only)
create policy "Activity logs viewable by everyone"
  on public.activity_logs for select using (true);

create policy "Authenticated users can insert activity logs"
  on public.activity_logs for insert
  with check (auth.role() = 'authenticated');

-- Policies: Notifikasi
create policy "Users can view notifications"
  on public.notifications for select
  using (
    recipient_ormawa_id = 'all'
    or exists (
      select 1 from public.profiles
      where id = auth.uid()
        and (ormawa_id = notifications.recipient_ormawa_id or notifications.recipient_user_id = auth.uid())
    )
    or public.is_approved_dpm()
  );

create policy "Users can mark notifications as read"
  on public.notifications for update
  using (
    recipient_user_id = auth.uid()
    or exists (
      select 1 from public.profiles
      where id = auth.uid()
        and ormawa_id = notifications.recipient_ormawa_id
    )
  );

create policy "Authenticated users can insert notifications"
  on public.notifications for insert
  with check (auth.role() = 'authenticated');

-- 6. Realtime Publication (Hybrid: Khusus Notifikasi)
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'notifications'
  ) then
    alter publication supabase_realtime add table public.notifications;
  end if;
end;
$$;

-- 7. Supabase Storage Buckets
insert into storage.buckets (id, name, public)
values 
  ('proposals', 'proposals', true),
  ('lpj-documents', 'lpj-documents', true),
  ('receipts', 'receipts', true),
  ('templates', 'templates', true)
on conflict (id) do nothing;

create policy "Public can read proposals"
  on storage.objects for select using (bucket_id = 'proposals');

create policy "Authenticated can upload proposals"
  on storage.objects for insert
  with check (bucket_id = 'proposals' and auth.role() = 'authenticated');

create policy "Public can read lpj-documents"
  on storage.objects for select using (bucket_id = 'lpj-documents');

create policy "Authenticated can upload lpj-documents"
  on storage.objects for insert
  with check (bucket_id = 'lpj-documents' and auth.role() = 'authenticated');

create policy "Public can read receipts"
  on storage.objects for select using (bucket_id = 'receipts');

create policy "Authenticated can upload receipts"
  on storage.objects for insert
  with check (bucket_id = 'receipts' and auth.role() = 'authenticated');

create policy "Public can read templates"
  on storage.objects for select using (bucket_id = 'templates');

create policy "DPM can upload templates"
  on storage.objects for insert
  with check (bucket_id = 'templates' and public.is_approved_dpm());
