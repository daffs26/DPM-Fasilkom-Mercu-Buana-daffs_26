-- ==============================================================================
-- SKRIP PEMBERSIHAN DATA AKUN DUMMY / PENGUJIAN AUDITMAWA
-- ==============================================================================
-- Jalankan skrip ini di SQL Editor Supabase untuk menghapus seluruh akun pengurus
-- dummy/uji coba yang terdaftar sehingga database bersih untuk digunakan secara nyata.

-- 1. Lepaskan relasi sementara pada tabel terkait agar tidak terhalang Foreign Key
update public.activity_logs set user_id = null;
update public.proker set created_by = null;
update public.budget_transactions set created_by = null;
update public.notifications set recipient_user_id = null;
update public.surat_peringatan set issued_by = null;
update public.document_templates set uploaded_by = null;

-- 2. Hapus sesi login aktif
delete from public.user_sessions;

-- 3. Hapus profil pengurus terdaftar
delete from public.profiles;

-- 4. Hapus seluruh data autentikasi pengguna dari Supabase Auth
delete from auth.identities;
delete from auth.users;

-- ==============================================================================
-- VERIFIKASI HASIL PEMBERSIHAN
-- ==============================================================================
-- Query ini akan mengembalikan angka 0 jika pembersihan berhasil:
select 
  (select count(*) from public.profiles) as sisa_profil,
  (select count(*) from auth.users) as sisa_auth_users;
