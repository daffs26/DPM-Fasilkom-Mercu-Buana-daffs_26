-- RPC Function: Registrasi Member Bebas Email Rate Limit
-- Menggunakan pgcrypto untuk bcrypt hash & auto-confirm email di auth.users

create extension if not exists "pgcrypto" schema extensions;

create or replace function public.register_member(
  p_name text,
  p_nim text,
  p_ormawa_id text,
  p_role text,
  p_username text,
  p_password text
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
begin
  v_clean_username := lower(trim(p_username));
  v_email := v_clean_username || '@auditmawa.com';
  v_normalized_role := case when p_role = 'sekre' then 'sekretaris' else p_role end;

  -- 1. Validasi username unik
  if exists (select 1 from public.profiles where lower(username) = v_clean_username) then
    return jsonb_build_object('success', false, 'message', 'Username ini sudah digunakan oleh akun lain.');
  end if;

  if exists (select 1 from auth.users where email = v_email) then
    return jsonb_build_object('success', false, 'message', 'Username ini sudah terdaftar.');
  end if;

  v_user_id := gen_random_uuid();

  -- 2. Insert langsung ke auth.users dengan status email terkonfirmasi (email_confirmed_at = now())
  -- Ini sepenuhnya mem-bypass batas pengiriman email (over_email_send_rate_limit) dari Supabase
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
      'role', v_normalized_role
    ),
    now(),
    now(),
    '',
    ''
  );

  return jsonb_build_object(
    'success', true,
    'message', 'Pendaftaran berhasil'
  );
exception
  when others then
    return jsonb_build_object('success', false, 'message', SQLERRM);
end;
$$;

-- Berikan izin akses eksekusi ke anon & authenticated
grant execute on function public.register_member to anon, authenticated;
