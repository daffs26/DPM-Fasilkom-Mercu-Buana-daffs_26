-- Migration: Keamanan Pendaftaran DPM, Lembar Tanda Terima, & Pelacakan Mandiri
-- Tanggal: 2026-10-04

-- 1. Penambahan kolom pada tabel profiles
alter table public.profiles add column if not exists rejection_reason text;
alter table public.profiles add column if not exists ticket_number text;
create unique index if not exists idx_profiles_nim_unique on public.profiles(lower(trim(nim)));

-- 2. Pastikan role check constraint mencakup 'wakil'
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check 
  check (role in ('ketua', 'wakil', 'sekretaris', 'bendahara', 'anggota'));

-- 3. Perbarui helper pimpinan DPM agar mencakup role 'wakil'
create or replace function public.is_dpm_leader()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and ormawa_id = 'dpm'
      and status = 'approved'
      and role in ('ketua', 'wakil', 'sekretaris')
  );
$$ language sql stable security definer;

-- 4. Perbarui trigger handle_new_user agar sinkron dengan status dan ticket_number dari raw_user_meta_data
create or replace function public.handle_new_user()
returns trigger as $$
declare
  raw_username text;
  raw_name text;
  raw_nim text;
  raw_ormawa text;
  raw_role text;
  init_status text;
  raw_ticket text;
begin
  raw_username := coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1));
  raw_name := coalesce(new.raw_user_meta_data->>'name', raw_username);
  raw_nim := coalesce(new.raw_user_meta_data->>'nim', '-');
  raw_ormawa := coalesce(new.raw_user_meta_data->>'ormawa_id', 'bem');
  raw_role := coalesce(new.raw_user_meta_data->>'role', 'anggota');
  raw_ticket := new.raw_user_meta_data->>'ticket_number';
  init_status := coalesce(new.raw_user_meta_data->>'status', 'pending');

  insert into public.profiles (id, username, name, nim, ormawa_id, role, status, ticket_number)
  values (new.id, raw_username, raw_name, raw_nim, raw_ormawa, raw_role, init_status, raw_ticket)
  on conflict (id) do update set
    username = excluded.username,
    name = excluded.name,
    nim = excluded.nim,
    ormawa_id = excluded.ormawa_id,
    role = excluded.role,
    status = excluded.status,
    ticket_number = coalesce(excluded.ticket_number, public.profiles.ticket_number);

  return new;
end;
$$ language plpgsql security definer;

-- 5. RPC Function register_member dengan proteksi Passphrase DPM & pembuatan Nomor Tiket
create extension if not exists "pgcrypto" schema extensions;

create or replace function public.register_member(
  p_name text,
  p_nim text,
  p_ormawa_id text,
  p_role text,
  p_username text,
  p_password text,
  p_security_token text default null,
  p_ticket_number text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  v_user_id uuid;
  v_clean_username text;
  v_email text;
  v_normalized_role text;
  v_status text;
  v_ticket_number text;
  v_dpm_secret text := 'DPM-FASILKOM-2026';
begin
  v_clean_username := lower(trim(p_username));
  v_email := v_clean_username || '@auditmawa.com';
  v_normalized_role := case when p_role = 'sekre' then 'sekretaris' else lower(trim(p_role)) end;

  -- Validasi Keamanan Otorisasi DPM
  if p_ormawa_id = 'dpm' then
    if p_security_token is null or trim(p_security_token) != v_dpm_secret then
      return jsonb_build_object(
        'success', false, 
        'message', 'Kode Otorisasi Keamanan DPM tidak valid. Hanya pimpinan resmi DPM yang memiliki akses pendaftaran ini.'
      );
    end if;
    v_status := 'approved';
  else
    v_status := 'pending';
  end if;

  -- Validasi NIM unik (1 NIM hanya untuk 1 akun)
  if exists (select 1 from public.profiles where lower(trim(nim)) = lower(trim(p_nim))) then
    return jsonb_build_object('success', false, 'message', 'NIM ini sudah terdaftar pada akun lain. Mohon gunakan NIM Anda sendiri atau hubungi DPM.');
  end if;

  -- Validasi username unik
  if exists (select 1 from public.profiles where lower(username) = v_clean_username) then
    return jsonb_build_object('success', false, 'message', 'Username ini sudah digunakan oleh akun lain.');
  end if;

  if exists (select 1 from auth.users where email = v_email) then
    return jsonb_build_object('success', false, 'message', 'Username ini sudah terdaftar.');
  end if;

  v_user_id := gen_random_uuid();
  if p_ticket_number is not null and trim(p_ticket_number) != '' then
    v_ticket_number := upper(trim(p_ticket_number));
  else
    v_ticket_number := 'REG-' || upper(p_ormawa_id) || '-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substr(md5(random()::text), 1, 4));
  end if;

  -- Insert langsung ke auth.users (email_confirmed_at = now() mem-bypass rate limit email)
  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token
  ) values (
    '00000000-0000-0000-0000-000000000000',
    v_user_id,
    'authenticated',
    'authenticated',
    v_email,
    extensions.crypt(p_password, extensions.gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object(
      'username', v_clean_username,
      'name', trim(p_name),
      'nim', trim(p_nim),
      'ormawa_id', p_ormawa_id,
      'role', v_normalized_role,
      'status', v_status,
      'ticket_number', v_ticket_number
    ),
    now(),
    now(),
    '',
    ''
  );

  return jsonb_build_object(
    'success', true,
    'ticket_number', v_ticket_number,
    'status', v_status,
    'username', v_clean_username,
    'name', trim(p_name),
    'nim', trim(p_nim),
    'ormawa_id', p_ormawa_id,
    'role', v_normalized_role,
    'created_at', now(),
    'message', case 
      when v_status = 'approved' then 'Pendaftaran berhasil dan akun telah disetujui langsung sebagai pengurus DPM.' 
      else 'Pendaftaran berhasil. Akun Anda sedang menunggu persetujuan (ACC) pimpinan DPM.' 
    end
  );
exception
  when others then
    return jsonb_build_object('success', false, 'message', SQLERRM);
end;
$$;

grant execute on function public.register_member to anon, authenticated;

-- 6. RPC Function Cek Status Pengajuan Mandiri (Akses Publik / Anon Aman)
create or replace function public.check_registration_status(p_identifier text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_clean text := lower(trim(p_identifier));
  v_profile record;
begin
  if length(v_clean) < 3 then
    return jsonb_build_object('found', false, 'message', 'Masukkan minimal 3 karakter username atau NIM.');
  end if;

  select username, name, nim, ormawa_id, role, status, rejection_reason, ticket_number, created_at
  into v_profile
  from public.profiles
  where lower(username) = v_clean or lower(nim) = v_clean
  order by created_at desc
  limit 1;

  if not found then
    return jsonb_build_object('found', false, 'message', 'Pengajuan akun dengan username atau NIM tersebut tidak ditemukan.');
  end if;

  return jsonb_build_object(
    'found', true,
    'username', v_profile.username,
    'name', v_profile.name,
    'nim', v_profile.nim,
    'ormawa_id', v_profile.ormawa_id,
    'role', v_profile.role,
    'status', v_profile.status,
    'rejection_reason', v_profile.rejection_reason,
    'ticket_number', v_profile.ticket_number,
    'created_at', v_profile.created_at
  );
end;
$$;

grant execute on function public.check_registration_status to anon, authenticated;

-- 7. RPC Function Persetujuan Akun oleh Pimpinan DPM
create or replace function public.approve_pending_account(p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_dpm_leader() then
    return jsonb_build_object('success', false, 'message', 'Hanya pimpinan DPM (Ketua, Wakil, Sekretaris) yang dapat menyetujui akun.');
  end if;

  update public.profiles
  set status = 'approved',
      rejection_reason = null,
      approved_by = auth.uid(),
      approved_at = now(),
      updated_at = now()
  where id = p_user_id;

  return jsonb_build_object('success', true, 'message', 'Akun berhasil disetujui.');
end;
$$;

grant execute on function public.approve_pending_account to authenticated;

-- 8. RPC Function Penolakan Akun oleh Pimpinan DPM
create or replace function public.reject_pending_account(p_user_id uuid, p_reason text default null)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_dpm_leader() then
    return jsonb_build_object('success', false, 'message', 'Hanya pimpinan DPM (Ketua, Wakil, Sekretaris) yang dapat menolak akun.');
  end if;

  update public.profiles
  set status = 'rejected',
      rejection_reason = coalesce(nullif(trim(p_reason), ''), 'Data kepengurusan tidak memenuhi kualifikasi resmi.'),
      updated_at = now()
  where id = p_user_id;

  return jsonb_build_object('success', true, 'message', 'Pengajuan akun telah ditolak.');
end;
$$;

grant execute on function public.reject_pending_account to authenticated;

-- 9. Inisialisasi Akun Root Ketua DPM Resmi (admin / 123)
do $$
begin
  if not exists (select 1 from public.profiles where username = 'admin') then
    perform public.register_member(
      'Muhammad Daffa Aulia Syahrul',
      '41822010000',
      'dpm',
      'ketua',
      'admin',
      '123',
      'DPM-FASILKOM-2026'
    );
  end if;
end $$;

-- 10. RPC Function Resolusi Login: Mendukung Login via Username ATAU NIM
create or replace function public.resolve_login_identifier(p_identifier text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_clean text := lower(trim(p_identifier));
  v_username text;
begin
  if v_clean is null or length(v_clean) = 0 then
    return jsonb_build_object('found', false, 'email', '');
  end if;

  -- Hapus prefix @ jika pengguna mengetik @username
  if left(v_clean, 1) = '@' then
    v_clean := substring(v_clean from 2);
  end if;

  -- Cari username berdasarkan username ATAU NIM di tabel profiles
  select username into v_username
  from public.profiles
  where lower(username) = v_clean or lower(nim) = v_clean
  limit 1;

  if v_username is not null then
    return jsonb_build_object(
      'found', true,
      'username', v_username,
      'email', v_username || '@auditmawa.com'
    );
  end if;

  -- Fallback jika profil belum tercatat
  return jsonb_build_object(
    'found', false,
    'username', v_clean,
    'email', v_clean || '@auditmawa.com'
  );
end;
$$;

grant execute on function public.resolve_login_identifier to anon, authenticated;

-- 11. RPC Function Reset Kata Sandi Mandiri Menggunakan NIM dan Nomor Tiket
create or replace function public.reset_password_with_ticket(
  p_nim text,
  p_ticket_number text,
  p_new_password text
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  v_clean_nim text := lower(trim(p_nim));
  v_clean_ticket text := upper(trim(p_ticket_number));
  v_user_id uuid;
begin
  if length(p_new_password) < 6 then
    return jsonb_build_object('success', false, 'message', 'Kata sandi baru minimal 6 karakter demi keamanan akun.');
  end if;

  -- Verifikasi kecocokan NIM dan Nomor Tiket di public.profiles
  select id into v_user_id
  from public.profiles
  where lower(trim(nim)) = v_clean_nim
    and upper(trim(coalesce(ticket_number, ''))) = v_clean_ticket;

  if v_user_id is null then
    return jsonb_build_object('success', false, 'message', 'Kombinasi NIM dan Nomor Tiket tidak ditemukan atau tidak sesuai.');
  end if;

  -- Update encrypted_password di auth.users secara aman
  update auth.users
  set encrypted_password = extensions.crypt(p_new_password, extensions.gen_salt('bf')),
      updated_at = now()
  where id = v_user_id;

  return jsonb_build_object('success', true, 'message', 'Kata sandi berhasil diperbarui! Silakan masuk dengan kata sandi baru Anda.');
exception
  when others then
    return jsonb_build_object('success', false, 'message', SQLERRM);
end;
$$;

grant execute on function public.reset_password_with_ticket to anon, authenticated;

-- 12. Hapus Akun Uji Coba Wakil DPM (Agar Bersih untuk Pengujian Pembuatan Akun Baru)
delete from auth.users 
where id in (
  select id from public.profiles where ormawa_id = 'dpm' and role = 'wakil'
);

delete from public.profiles 
where ormawa_id = 'dpm' and role = 'wakil';

create or replace function public.cleanup_wakil_dpm()
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_count int;
begin
  select count(*) into v_count from public.profiles where ormawa_id = 'dpm' and role = 'wakil';
  
  delete from auth.users 
  where id in (
    select id from public.profiles where ormawa_id = 'dpm' and role = 'wakil'
  );

  delete from public.profiles 
  where ormawa_id = 'dpm' and role = 'wakil';

  return jsonb_build_object('success', true, 'deleted_count', v_count);
end;
$$;

grant execute on function public.cleanup_wakil_dpm to anon, authenticated;
