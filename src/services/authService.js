import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

const DOMAIN_SUFFIX = '@gmail.com';

const getVirtualEmail = (username) => {
  const clean = (username || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_.]/g, '')
    .replace(/^\.+|\.+$/g, '')
    .replace(/\.{2,}/g, '.');
  return `${clean || 'user'}.auditmawa${DOMAIN_SUFFIX}`;
};

export const authService = {
  /**
   * Cek ketersediaan username (Instagram-style check)
   */
  async checkUsernameAvailability(username) {
    if (!isSupabaseConfigured || !username || username.trim().length < 3) {
      return { available: true };
    }
    const clean = username.toLowerCase().trim();
    try {
      // 1. Coba RPC check_registration_status (bypass RLS agar cek akun pending akurat)
      const { data: rpcData, error: rpcErr } = await supabase.rpc('check_registration_status', { p_identifier: clean });
      if (!rpcErr && rpcData) {
        return { available: !rpcData.found };
      }

      // 2. Fallback query langsung profiles
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', clean)
        .maybeSingle();

      if (error) return { available: true };
      return { available: !data };
    } catch {
      return { available: true };
    }
  },

  /**
   * Cek ketersediaan NIM (1 Mahasiswa/NIM hanya 1 akun)
   */
  async checkNimAvailability(nim) {
    if (!isSupabaseConfigured || !nim || nim.trim().length < 5) {
      return { available: true };
    }
    const clean = nim.trim();
    try {
      // 1. Coba RPC check_registration_status (bypass RLS agar cek akun pending akurat)
      const { data: rpcData, error: rpcErr } = await supabase.rpc('check_registration_status', { p_identifier: clean });
      if (!rpcErr && rpcData) {
        return { available: !rpcData.found };
      }

      // 2. Fallback query langsung profiles
      const { data, error } = await supabase
        .from('profiles')
        .select('nim')
        .eq('nim', clean)
        .maybeSingle();

      if (error) return { available: true };
      return { available: !data };
    } catch {
      return { available: true };
    }
  },

  /**
   * Login menggunakan Username / NIM dan Password
   */
  async login(identifier, password) {
    if (!isSupabaseConfigured) {
      return { success: false, fallback: true, message: 'Supabase belum terkonfigurasi' };
    }

    const cleanInput = (identifier || '').trim();
    let email = getVirtualEmail(cleanInput);

    // 1. Resolusi Identifier (Username ATAU NIM)
    try {
      // Prioritas A: Coba melalui RPC resolve_login_identifier
      const { data: rpcRes, error: rpcErr } = await supabase.rpc('resolve_login_identifier', {
        p_identifier: cleanInput,
      });

      if (!rpcErr && rpcRes?.found && rpcRes?.email) {
        email = rpcRes.email;
      } else {
        // Prioritas B: Fallback query jika RPC belum diaplikasikan di Postgres
        const cleanNoAt = cleanInput.replace(/^@/, '').toLowerCase();
        const { data: profileMatch } = await supabase
          .from('profiles')
          .select('username')
          .or(`username.ilike.${cleanNoAt},nim.ilike.${cleanNoAt}`)
          .maybeSingle();

        if (profileMatch?.username) {
          email = getVirtualEmail(profileMatch.username);
        }
      }
    } catch (e) {
      console.warn('[authService] Resolusi identifier error, fallback ke direct email:', e);
    }

    let { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Fallback jika akun terdaftar dengan domain legacy @auditmawa.com
    if (authError && email.includes('.auditmawa@gmail.com')) {
      const legacyEmail = `${cleanInput.replace(/^@/, '').toLowerCase()}@auditmawa.com`;
      const legacyRes = await supabase.auth.signInWithPassword({
        email: legacyEmail,
        password,
      });
      if (!legacyRes.error && legacyRes.data?.user) {
        authData = legacyRes.data;
        authError = null;
      }
    }

    if (authError) {
      if (authError.message.includes('Invalid login credentials')) {
        return { success: false, message: 'Username / NIM atau kata sandi tidak sesuai.' };
      }
      if (authError.message.includes('Email not confirmed')) {
        return { success: false, message: 'Konfirmasi email belum dimatikan di Supabase Dashboard (Authentication -> Providers -> Email -> matikan Confirm Email).' };
      }
      return { success: false, message: 'Gagal login. Periksa username/NIM dan kata sandi Anda.' };
    }

    const user = authData.user;

    // Ambil profile lengkap dari public.profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      await supabase.auth.signOut();
      return { success: false, message: 'Gagal memuat profil akun. Hubungi administrator DPM.' };
    }

    // Validasi status approval akun
    if (profile.status === 'pending') {
      await supabase.auth.signOut();
      return {
        success: false,
        message: 'Akun Anda masih menunggu verifikasi & persetujuan (ACC) dari pimpinan DPM.',
      };
    }

    if (profile.status === 'rejected') {
      await supabase.auth.signOut();
      return {
        success: false,
        message: 'Permohonan akun Anda telah ditolak oleh pimpinan DPM.',
      };
    }

    // Registrasi sesi perangkat (Penegakan Maks 2 Device untuk Pengurus)
    const deviceInfo = typeof window !== 'undefined' ? window.navigator.userAgent : 'Unknown Device';
    const sessionToken = authData.session?.access_token ? authData.session.access_token.slice(-16) : 'token';

    try {
      await supabase.rpc('register_user_session', {
        p_device_info: deviceInfo,
        p_session_token: sessionToken,
      });
    } catch (sessionErr) {
      console.warn('[authService] Sesi multi-device tracking error:', sessionErr);
    }

    return {
      success: true,
      user,
      profile,
    };
  },

  /**
   * Pendaftaran akun baru pengurus ormawa (Status default: pending, DPM with valid token: approved)
   */
  async register({ name, nim, ormawaId, role, username, password, securityToken, ticketNumber }) {
    if (!isSupabaseConfigured) {
      return { success: false, fallback: true, message: 'Supabase belum terkonfigurasi' };
    }

    // Validasi otorisasi DPM sebelum proses pendaftaran
    const validDpmToken = (import.meta.env.VITE_DPM_SECURITY_TOKEN || 'DPM-FASILKOM-2026').trim();
    if (ormawaId === 'dpm' && (!securityToken || securityToken.trim() !== validDpmToken)) {
      return {
        success: false,
        message: 'Kode Otorisasi Keamanan DPM tidak valid. Hanya pimpinan resmi DPM yang memiliki akses pendaftaran ini.'
      };
    }

    const cleanUsername = username.toLowerCase().trim();
    const activeTicket = ticketNumber ? ticketNumber.trim() : `REG-${ormawaId.toUpperCase()}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const normalizedRole = (role === 'sekre' || role === 'sekretaris') ? 'sekretaris' : (role ? role.toLowerCase().trim() : 'anggota');

    // 1. Registrasi via RPC register_member (Bypass Email Rate Limit, Proteksi Token DPM, & Tiket Registrasi)
    try {
      let rpcRes = null;
      let rpcErr = null;

      // Coba versi 8 parameter terlebih dahulu
      const res8 = await supabase.rpc('register_member', {
        p_name: name.trim(),
        p_nim: nim.trim(),
        p_ormawa_id: ormawaId,
        p_role: normalizedRole,
        p_username: cleanUsername,
        p_password: password,
        p_security_token: securityToken ? securityToken.trim() : null,
        p_ticket_number: activeTicket,
      });

      rpcRes = res8.data;
      rpcErr = res8.error;

      // Jika versi 8 parameter belum terpasang di database (PGRST202 / schema cache), panggil versi 6 parameter yang ada
      if (rpcErr && (rpcErr.code === 'PGRST202' || rpcErr.message?.includes('schema cache'))) {
        console.warn('[authService] RPC 8-params not found in schema cache, fallback to 6-params register_member...');
        const res6 = await supabase.rpc('register_member', {
          p_name: name.trim(),
          p_nim: nim.trim(),
          p_ormawa_id: ormawaId,
          p_role: normalizedRole,
          p_username: cleanUsername,
          p_password: password,
        });
        rpcRes = res6.data;
        rpcErr = res6.error;
      }

      if (!rpcErr && rpcRes) {
        if (!rpcRes.success) {
          return { success: false, message: rpcRes.message };
        }

        const finalStatus = ormawaId === 'dpm' ? 'approved' : (rpcRes.status || 'pending');

        // Update profiles jika kolom ticket_number ada di database
        try {
          await supabase
            .from('profiles')
            .update({ 
              status: finalStatus,
              ticket_number: activeTicket 
            })
            .eq('username', cleanUsername);
        } catch (updErr) {
          console.warn('[authService] Optional profiles update ticket_number warning:', updErr);
        }

        return {
          success: true,
          ticketNumber: activeTicket,
          status: finalStatus,
          username: cleanUsername,
          name: name.trim(),
          nim: nim.trim(),
          ormawaId,
          role,
          createdAt: new Date().toISOString(),
          message: rpcRes.message || (finalStatus === 'approved' ? 'Pendaftaran berhasil dan akun Anda langsung aktif sebagai pengurus DPM.' : 'Pendaftaran berhasil. Akun Anda menunggu verifikasi (ACC) oleh pimpinan DPM.'),
        };
      }
      if (rpcErr) {
        console.warn('[authService] RPC error:', rpcErr);
      }
    } catch (e) {
      console.warn('[authService] RPC register_member error, fallback ke signUp:', e);
    }

    // 2. Fallback standar signUp
    // Cek duplikasi NIM jika RPC gagal atau belum terinstall
    try {
      const { data: existingNim } = await supabase
        .from('profiles')
        .select('id')
        .eq('nim', nim.trim())
        .maybeSingle();

      if (existingNim) {
        return { 
          success: false, 
          message: 'NIM ini sudah terdaftar pada akun lain. 1 NIM hanya dapat digunakan untuk 1 akun pengurus.' 
        };
      }
    } catch (e) {
      console.warn('[authService] Pre-check NIM uniqueness warning:', e);
    }

    const email = getVirtualEmail(cleanUsername);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: cleanUsername,
          name: name.trim(),
          nim: nim.trim(),
          ormawa_id: ormawaId,
          role: role === 'sekre' ? 'sekretaris' : role,
          ticket_number: activeTicket,
        },
      },
    });

    if (error) {
      console.error('[authService] signUp error:', error);
      if (
        error.message.includes('User already registered') ||
        error.message.includes('already exists') ||
        error.message.includes('identity already exists')
      ) {
        return { success: false, message: 'Username ini sudah digunakan oleh pengurus lain.' };
      }
      if (
        error.message.toLowerCase().includes('rate limit') ||
        error.code === 'over_email_send_rate_limit'
      ) {
        return {
          success: false,
          message: 'Batas email pendaftaran Supabase tercapai. Jalankan script SQL registrasi RPC di SQL Editor Supabase untuk bypass permanen.',
        };
      }
      if (error.message.toLowerCase().includes('invalid') && error.message.toLowerCase().includes('email')) {
        return { success: false, message: 'Format identitas pendaftaran ditolak oleh sistem autentikasi.' };
      }
      return { success: false, message: error.message };
    }

    return {
      success: true,
      ticketNumber: activeTicket,
      status: ormawaId === 'dpm' ? 'approved' : 'pending',
      username: cleanUsername,
      name: name.trim(),
      nim: nim.trim(),
      ormawaId,
      role,
      createdAt: new Date().toISOString(),
      user: data.user,
      message: 'Pendaftaran berhasil. Akun Anda berstatus menunggu verifikasi (ACC) oleh pimpinan DPM.',
    };
  },

  /**
   * Cek status pendaftaran mandiri (Self-Service Registration Tracking)
   */
  async checkAccountStatus(identifier) {
    if (!isSupabaseConfigured || !identifier || identifier.trim().length < 3) {
      return { found: false, message: 'Masukkan minimal 3 karakter username atau NIM.' };
    }

    const clean = identifier.toLowerCase().trim();

    // 1. Coba melalui RPC check_registration_status
    try {
      const { data: rpcData, error: rpcErr } = await supabase.rpc('check_registration_status', {
        p_identifier: clean,
      });

      if (!rpcErr && rpcData) {
        return rpcData;
      }
    } catch (e) {
      console.warn('[authService] RPC check_registration_status error, fallback ke query:', e);
    }

    // 2. Fallback query langsung ke profiles
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, name, nim, ormawa_id, role, status, rejection_reason, ticket_number, created_at')
        .or(`username.ilike.${clean},nim.ilike.${clean}`)
        .maybeSingle();

      if (error || !data) {
        return { found: false, message: 'Pengajuan akun dengan username atau NIM tersebut tidak ditemukan.' };
      }

      return {
        found: true,
        username: data.username,
        name: data.name,
        nim: data.nim,
        ormawa_id: data.ormawa_id,
        role: data.role,
        status: data.status,
        rejection_reason: data.rejection_reason,
        ticket_number: data.ticket_number,
        created_at: data.created_at,
      };
    } catch {
      return { found: false, message: 'Gagal memeriksa status. Silakan periksa koneksi Anda.' };
    }
  },

  /**
   * Logout user & deactive current session
   */
  async logout() {
    if (!isSupabaseConfigured) return;
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('[authService] Logout error:', err);
    }
  },

  /**
   * Ambil sesi dan profil user saat ini
   */
  async getCurrentUser() {
    if (!isSupabaseConfigured) return null;

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    return profile ? { user: session.user, profile } : null;
  },

  /**
   * Ambil daftar akun pengurus yang masih pending (Khusus Pimpinan DPM)
   */
  async getPendingAccounts() {
    if (!isSupabaseConfigured) return [];

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[authService] Gagal mengambil pending accounts:', error);
      return [];
    }
    return data || [];
  },

  /**
   * ACC (Setujui) Akun Pengurus Baru oleh Pimpinan DPM
   */
  async approveAccount(targetUserId, approverId) {
    if (!isSupabaseConfigured) return { success: false };

    // Coba RPC approve_pending_account
    try {
      const { data: rpcRes, error: rpcErr } = await supabase.rpc('approve_pending_account', {
        p_user_id: targetUserId,
      });
      if (!rpcErr && rpcRes && rpcRes.success) {
        return { success: true };
      }
    } catch (e) {
      console.warn('[authService] RPC approve error, fallback:', e);
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        status: 'approved',
        rejection_reason: null,
        approved_by: approverId,
        approved_at: new Date().toISOString(),
      })
      .eq('id', targetUserId);

    if (error) return { success: false, message: error.message };
    return { success: true };
  },

  /**
   * Tolak Akun Pengurus oleh Pimpinan DPM
   */
  async rejectAccount(targetUserId, approverId, reason = null) {
    if (!isSupabaseConfigured) return { success: false };

    // Coba RPC reject_pending_account
    try {
      const { data: rpcRes, error: rpcErr } = await supabase.rpc('reject_pending_account', {
        p_user_id: targetUserId,
        p_reason: reason,
      });
      if (!rpcErr && rpcRes && rpcRes.success) {
        return { success: true };
      }
    } catch (e) {
      console.warn('[authService] RPC reject error, fallback:', e);
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        status: 'rejected',
        rejection_reason: reason || 'Data kepengurusan tidak memenuhi kualifikasi resmi.',
        approved_by: approverId,
        approved_at: new Date().toISOString(),
      })
      .eq('id', targetUserId);

    if (error) return { success: false, message: error.message };
    return { success: true };
  },

  /**
   * Reset password manual untuk pengurus oleh Admin DPM
   */
  async resetPasswordByAdmin(targetUserId, newPassword) {
    if (!isSupabaseConfigured) return { success: false };

    // Memanggil RPC atau edge function khusus jika tersedia
    const { error } = await supabase.rpc('admin_reset_user_password', {
      p_user_id: targetUserId,
      p_new_password: newPassword,
    });

    if (error) return { success: false, message: error.message };
    return { success: true };
  },

  /**
   * Reset Kata Sandi Mandiri Menggunakan NIM dan Nomor Tiket Registrasi
   */
  async resetPasswordWithTicket({ nim, ticketNumber, newPassword }) {
    if (!isSupabaseConfigured) {
      return { success: false, fallback: true, message: 'Supabase belum terkonfigurasi' };
    }

    try {
      const { data, error } = await supabase.rpc('reset_password_with_ticket', {
        p_nim: nim.trim(),
        p_ticket_number: ticketNumber.trim(),
        p_new_password: newPassword,
      });

      if (error) {
        return { success: false, message: error.message };
      }

      return data || { success: false, message: 'Gagal memproses permohonan reset sandi.' };
    } catch (err) {
      console.error('[authService] Error reset password with ticket:', err);
      return { success: false, message: 'Terjadi kendala koneksi saat mereset kata sandi.' };
    }
  },

  /**
   * Helper pembersihan akun uji coba Wakil DPM
   */
  async cleanupWakilDpm() {
    if (!isSupabaseConfigured) return;
    try {
      await supabase.rpc('cleanup_wakil_dpm');
    } catch {
      // fallback delete directly if RPC is not deployed yet
      try {
        await supabase.from('profiles').delete().match({ ormawa_id: 'dpm', role: 'wakil' });
      } catch {
        // ignore
      }
    }
  },
};


