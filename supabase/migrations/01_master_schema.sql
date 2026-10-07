-- ==============================================================================
-- AUDITMAWA DPM FASILKOM UNIVERSITAS MERCU BUANA
-- MASTER DATABASE SCHEMA & SEED DATA (VERSI TERBARU & BERSIH)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. TABEL ORMAWA (Entitas Lembaga Mahasiswa di Lingkungan FASILKOM)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.ormawa (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  type TEXT NOT NULL,
  logo TEXT,
  pdh_color_name TEXT,
  pagu_anggaran NUMERIC DEFAULT 0,
  serapan_anggaran NUMERIC DEFAULT 0,
  ketua TEXT DEFAULT 'Nama Ketua',
  instagram TEXT,
  color JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 3. TABEL PROFILES (Akun Pengurus DPM & Civitas Akademik)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  nim TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  ormawa_id TEXT NOT NULL DEFAULT 'dpm' REFERENCES public.ormawa(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'civitas',
  avatar TEXT,
  status TEXT DEFAULT 'approved' CHECK (status IN ('approved', 'pending', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 4. TABEL SESI MULTI-DEVICE (Maksimal 2 Perangkat per Pengurus)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  device_info TEXT,
  session_token TEXT,
  last_active TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 5. TABEL PROGRAM KERJA (PROKER)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.proker (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ormawa_id TEXT NOT NULL REFERENCES public.ormawa(id) ON DELETE CASCADE,
  period_id TEXT DEFAULT '2025/2026',
  created_by TEXT,
  title TEXT NOT NULL,
  divisi TEXT,
  pic TEXT,
  pic_contact TEXT,
  start_date DATE,
  end_date DATE,
  location TEXT,
  target_audience TEXT,
  target_peserta INTEGER DEFAULT 0,
  rab NUMERIC DEFAULT 0,
  description TEXT,
  status TEXT DEFAULT 'draft',
  proposal_data JSONB DEFAULT '{}'::jsonb,
  inspection_data JSONB DEFAULT '{}'::jsonb,
  lpj_data JSONB DEFAULT '{}'::jsonb,
  other_docs JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 6. TABEL TRANSAKSI ANGGARAN (KAS & REALISASI ORMAWA)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.budget_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ormawa_id TEXT NOT NULL REFERENCES public.ormawa(id) ON DELETE CASCADE,
  period_id TEXT DEFAULT '2025/2026',
  proker_id UUID REFERENCES public.proker(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('pemasukan', 'pengeluaran')),
  nominal NUMERIC NOT NULL CHECK (nominal >= 0),
  keterangan TEXT,
  tanggal DATE DEFAULT CURRENT_DATE,
  receipt_url TEXT,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 7. TABEL SURAT PERINGATAN (SP)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.surat_peringatan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nomor_sp TEXT NOT NULL,
  proker_id UUID REFERENCES public.proker(id) ON DELETE SET NULL,
  ormawa_id TEXT NOT NULL REFERENCES public.ormawa(id) ON DELETE CASCADE,
  period_id TEXT DEFAULT '2025/2026',
  tingkat TEXT NOT NULL CHECK (tingkat IN ('SP1', 'SP2', 'SP3')),
  perihal TEXT NOT NULL,
  keterangan TEXT,
  tenggat_klarifikasi DATE,
  status TEXT DEFAULT 'aktif' CHECK (status IN ('aktif', 'selesai', 'dibatalkan')),
  response_data JSONB DEFAULT '{}'::jsonb,
  issued_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 8. TABEL NOTIFIKASI
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_ormawa_id TEXT DEFAULT 'all',
  recipient_user_id UUID,
  type TEXT DEFAULT 'info',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 9. TABEL TEMPLATE DOKUMEN RESMI DPM
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.document_templates (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT,
  category_slug TEXT DEFAULT 'lainnya',
  format TEXT DEFAULT 'DOCX',
  file_size TEXT DEFAULT '150 KB',
  periode TEXT DEFAULT '2025/2026',
  is_official BOOLEAN DEFAULT true,
  author TEXT DEFAULT 'DPM FASILKOM UMB',
  description TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  fields JSONB DEFAULT '[]'::jsonb,
  content_preview TEXT,
  file_url TEXT,
  uploaded_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 10. TABEL ACTIVITY LOGS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name TEXT,
  user_role TEXT,
  ormawa_id TEXT,
  action TEXT,
  target TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 11. STORAGE BUCKETS (JIKA EKSTENSI STORAGE AKTIF DI SUPABASE)
-- ==============================================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'storage') THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES 
      ('proposals', 'proposals', true),
      ('lpj-documents', 'lpj-documents', true),
      ('receipts', 'receipts', true),
      ('templates', 'templates', true)
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

-- ==============================================================================
-- 12. RPC FUNCTIONS: LOGIN & REGISTRASI
-- ==============================================================================

-- Resolusi login username atau NIM ke virtual email
CREATE OR REPLACE FUNCTION public.resolve_login_identifier(p_identifier TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_clean TEXT := lower(trim(p_identifier));
  v_profile RECORD;
  v_email TEXT;
BEGIN
  SELECT p.* INTO v_profile
  FROM public.profiles p
  WHERE lower(p.username) = v_clean OR p.nim = trim(p_identifier)
  LIMIT 1;

  IF FOUND THEN
    v_email := lower(v_profile.username) || '.auditmawa@gmail.com';
    RETURN jsonb_build_object(
      'found', true,
      'email', v_email,
      'username', v_profile.username,
      'nim', v_profile.nim,
      'role', v_profile.role,
      'status', v_profile.status
    );
  END IF;

  RETURN jsonb_build_object('found', false);
END;
$$;

-- Cek ketersediaan username / NIM untuk validasi form real-time
CREATE OR REPLACE FUNCTION public.check_registration_status(p_identifier TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_clean TEXT := lower(trim(p_identifier));
  v_found BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE lower(username) = v_clean OR nim = trim(p_identifier)
  ) INTO v_found;

  RETURN jsonb_build_object('found', v_found);
END;
$$;

-- Registrasi sesi perangkat (Maks 2 perangkat aktif)
CREATE OR REPLACE FUNCTION public.register_user_session(
  p_device_info TEXT,
  p_session_token TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_user_id UUID := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Unauthorized');
  END IF;

  INSERT INTO public.user_sessions (user_id, device_info, session_token, last_active)
  VALUES (v_user_id, p_device_info, p_session_token, now());

  -- Pertahankan 2 sesi terbaru
  DELETE FROM public.user_sessions
  WHERE id IN (
    SELECT id FROM public.user_sessions
    WHERE user_id = v_user_id
    ORDER BY last_active DESC
    OFFSET 2
  );

  RETURN jsonb_build_object('success', true);
END;
$$;

-- Registrasi resmi pengurus DPM (Bypass Rate Limit & Email Confirmation)
CREATE OR REPLACE FUNCTION public.register_member(
  p_name TEXT,
  p_nim TEXT,
  p_ormawa_id TEXT,
  p_role TEXT,
  p_username TEXT,
  p_password TEXT,
  p_security_token TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
  v_valid_token TEXT := 'DPM-FASILKOM-2026';
  v_clean_user TEXT := lower(trim(p_username));
  v_clean_nim TEXT := trim(p_nim);
  v_clean_name TEXT := trim(p_name);
  v_clean_role TEXT := lower(trim(p_role));
  v_email TEXT;
  v_user_id UUID;
  v_encrypted_pw TEXT;
BEGIN
  IF v_clean_role = 'sekre' THEN
    v_clean_role := 'sekretaris';
  END IF;

  -- 1. Validasi Token Keamanan DPM
  IF trim(p_security_token) != v_valid_token THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Kode Otorisasi Keamanan DPM tidak valid. Hubungi Pimpinan DPM.'
    );
  END IF;

  -- 2. Validasi Keunikan Username
  IF EXISTS (SELECT 1 FROM public.profiles WHERE lower(username) = v_clean_user) THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Username "' || v_clean_user || '" sudah terdaftar. Silakan pilih username lain.'
    );
  END IF;

  -- 3. Validasi Keunikan NIM
  IF EXISTS (SELECT 1 FROM public.profiles WHERE nim = v_clean_nim) THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'NIM ' || v_clean_nim || ' sudah digunakan pada akun lain.'
    );
  END IF;

  v_email := v_clean_user || '.auditmawa@gmail.com';
  v_user_id := gen_random_uuid();
  v_encrypted_pw := extensions.crypt(p_password, extensions.gen_salt('bf'));

  -- 4. Buat Akun di auth.users
  INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change_token_current,
    email_change,
    phone_change,
    phone_change_token
  ) VALUES (
    v_user_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    v_email,
    v_encrypted_pw,
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object(
      'name', v_clean_name,
      'nim', v_clean_nim,
      'username', v_clean_user,
      'role', v_clean_role,
      'ormawa_id', 'dpm'
    ),
    now(),
    now(),
    '',
    '',
    '',
    '',
    '',
    '',
    ''
  );

  -- 5. Buat Identitas di auth.identities
  INSERT INTO auth.identities (
    id,
    user_id,
    provider_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    v_user_id,
    v_user_id::text,
    jsonb_build_object('sub', v_user_id::text, 'email', v_email),
    'email',
    now(),
    now(),
    now()
  );

  -- 6. Buat Profil di public.profiles
  INSERT INTO public.profiles (
    id,
    username,
    nim,
    name,
    ormawa_id,
    role,
    status,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    v_clean_user,
    v_clean_nim,
    v_clean_name,
    'dpm',
    v_clean_role,
    'approved',
    now(),
    now()
  );

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Pendaftaran berhasil dan akun Anda langsung aktif sebagai pengurus DPM FASILKOM.',
    'user_id', v_user_id
  );
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'message', 'Error pendaftaran: ' || SQLERRM
  );
END;
$$;

-- ==============================================================================
-- 13. DATA AWAL (SEED): ORMAWA RESMI FASILKOM
-- ==============================================================================
INSERT INTO public.ormawa (id, name, full_name, short_name, type, logo, pdh_color_name, pagu_anggaran, serapan_anggaran, ketua, instagram, color)
VALUES
  (
    'dpm',
    'DPM UMB',
    'Dewan Perwakilan Mahasiswa Fakultas Ilmu Komputer',
    'DPM',
    'Lembaga Legislatif Fasilkom',
    '/logos/logo-dpm.png',
    'Hitam (DPM)',
    0,
    0,
    'Muhammad Daffa Aulia Syahrul',
    'dpmfasilkom.umb',
    '{"primary": "#090D16", "accent": "#D97706", "badgeBg": "bg-slate-900 text-white border-slate-700", "tagBg": "bg-slate-900 text-white", "borderActive": "border-slate-900", "ring": "ring-slate-900", "border": "border-slate-800", "bgLight": "bg-slate-100 text-slate-900"}'::jsonb
  ),
  (
    'bem',
    'BEM FASILKOM UMB',
    'Badan Eksekutif Mahasiswa Fakultas Ilmu Komputer',
    'BEM',
    'Lembaga Eksekutif Fasilkom',
    '/logos/logo-bem.png',
    'Biru Muda (BEM)',
    0,
    0,
    'Nama Ketua BEM',
    'bemfasilkom.umb',
    '{"primary": "#0284C7", "accent": "#38BDF8", "badgeBg": "bg-sky-100 text-sky-800 border-sky-200", "tagBg": "bg-sky-500 text-white", "borderActive": "border-sky-500", "ring": "ring-sky-400", "border": "border-sky-300", "bgLight": "bg-sky-50 text-sky-800"}'::jsonb
  ),
  (
    'himti',
    'HIMTI UMB',
    'Himpunan Mahasiswa Teknik Informatika',
    'HIMTI',
    'Lembaga Eksekutif Teknik Informatika',
    '/logos/logo-himti.png',
    'Biru Dongker (HiMTI)',
    0,
    0,
    'Nama Ketua HIMTI',
    'himti.umb',
    '{"primary": "#172554", "accent": "#1E3A8A", "badgeBg": "bg-[#172554] text-blue-100 border-blue-900", "tagBg": "bg-[#172554] text-white", "borderActive": "border-blue-950", "ring": "ring-blue-900", "border": "border-blue-900", "bgLight": "bg-blue-50 text-blue-950"}'::jsonb
  ),
  (
    'himsisfo',
    'HIMSISFO UMB',
    'Himpunan Mahasiswa Sistem Informasi',
    'HIMSISFO',
    'Lembaga Eksekutif Sistem Informasi',
    '/logos/logo-himsisfo.png',
    'Krem (HIMSISFO)',
    0,
    0,
    'Nama Ketua HIMSISFO',
    'himsisfo_umb',
    '{"primary": "#9A7B56", "accent": "#C7B198", "badgeBg": "bg-[#FBF9F5] text-[#785E43] border-[#E8DEC8]", "tagBg": "bg-[#9A7B56] text-white", "borderActive": "border-[#9A7B56]", "ring": "ring-[#9A7B56]", "border": "border-[#E8DEC8]", "bgLight": "bg-[#FBF9F5] text-[#785E43]"}'::jsonb
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  full_name = EXCLUDED.full_name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  logo = EXCLUDED.logo,
  color = EXCLUDED.color;

-- ==============================================================================
-- 14. SEED AKUN PENGURUS DPM DEFAULT (Password: 123)
-- ==============================================================================
DO $$
DECLARE
  v_users RECORD;
  v_new_id UUID;
  v_pw_hash TEXT;
  v_token TEXT := 'DPM-FASILKOM-2026';
BEGIN
  -- Buat akun default menggunakan fungsi register_member
  PERFORM public.register_member('Muhammad Daffa Aulia Syahrul', '41822010001', 'dpm', 'ketua', 'ketua', '123', v_token);
  PERFORM public.register_member('Muhammad Daffa Aulia Syahrul (Admin)', '41822010000', 'dpm', 'ketua', 'admin', '123', v_token);
  PERFORM public.register_member('Ahmad Raihan', '41822010002', 'dpm', 'wakil', 'wakil', '123', v_token);
  PERFORM public.register_member('Nabila Azzahra', '41822010003', 'dpm', 'sekretaris', 'sekretaris', '123', v_token);
  PERFORM public.register_member('Siti Nurhaliza', '41822010004', 'dpm', 'bendahara', 'bendahara', '123', v_token);
  PERFORM public.register_member('Bintang Perkasa', '41822010005', 'dpm', 'komisi_pengawasan', 'pengawasan', '123', v_token);
  PERFORM public.register_member('Fikri Haikal', '41822010006', 'dpm', 'komisi_keuangan', 'keuangan', '123', v_token);
  PERFORM public.register_member('Salma Putri', '41822010007', 'dpm', 'komisi_kominfo', 'kominfo', '123', v_token);
  PERFORM public.register_member('Dimas Wicaksono', '41822010008', 'dpm', 'komisi_advokasi', 'advokasi', '123', v_token);
END $$;

-- Normalisasi token auth agar GoTrue (Supabase Auth) tidak mengalami error NULL scan
UPDATE auth.users
SET 
  confirmation_token = COALESCE(confirmation_token, ''),
  recovery_token = COALESCE(recovery_token, ''),
  email_change_token_new = COALESCE(email_change_token_new, ''),
  email_change_token_current = COALESCE(email_change_token_current, ''),
  email_change = COALESCE(email_change, ''),
  phone_change = COALESCE(phone_change, ''),
  phone_change_token = COALESCE(phone_change_token, '');

-- ==============================================================================
-- 15. ROW LEVEL SECURITY (RLS) & POLICIES
-- ==============================================================================

ALTER TABLE public.ormawa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proker ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surat_peringatan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Hak Akses Publik / Pelihat (Civitas & Umum Boleh Membaca Data Transparansi)
CREATE POLICY "Public Read Ormawa" ON public.ormawa FOR SELECT USING (true);
CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public Read Proker" ON public.proker FOR SELECT USING (true);
CREATE POLICY "Public Read Transactions" ON public.budget_transactions FOR SELECT USING (true);
CREATE POLICY "Public Read SP" ON public.surat_peringatan FOR SELECT USING (true);
CREATE POLICY "Public Read Templates" ON public.document_templates FOR SELECT USING (true);
CREATE POLICY "Public Read Notifications" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Public Read Logs" ON public.activity_logs FOR SELECT USING (true);
CREATE POLICY "User Read Own Sessions" ON public.user_sessions FOR SELECT USING (auth.uid() = user_id);

-- Hak Modifikasi untuk Pengurus yang Login (Authenticated Users)
CREATE POLICY "Auth Manage Ormawa" ON public.ormawa FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth Manage Profiles" ON public.profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth Manage Proker" ON public.proker FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth Manage Transactions" ON public.budget_transactions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth Manage SP" ON public.surat_peringatan FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth Manage Templates" ON public.document_templates FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth Manage Notifications" ON public.notifications FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth Manage Logs" ON public.activity_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth Manage Sessions" ON public.user_sessions FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Hak Akses Grant Global
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;
