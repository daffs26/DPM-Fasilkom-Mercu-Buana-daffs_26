import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

export const spService = {
  /**
   * Mengambil daftar Surat Peringatan (SP)
   */
  async getSuratPeringatan({ periodId, ormawaId } = {}) {
    if (!isSupabaseConfigured) return [];

    let query = supabase
      .from('surat_peringatan')
      .select('*, proker:proker_id(title), ormawa:ormawa_id(name, short_name)')
      .order('created_at', { ascending: false });

    if (periodId && periodId !== 'all') {
      query = query.eq('period_id', periodId);
    }
    if (ormawaId && ormawaId !== 'all') {
      query = query.eq('ormawa_id', ormawaId);
    }

    const { data, error } = await query;
    if (error) {
      console.error('[spService] Gagal memuat SP:', error);
      throw error;
    }
    return data || [];
  },

  /**
   * DPM menerbitkan Surat Peringatan baru
   */
  async issueSp(spData, issuedBy) {
    if (!isSupabaseConfigured) return { success: false, fallback: true };

    const payload = {
      nomor_sp: spData.nomorSp || `SP-${Date.now()}`,
      proker_id: spData.prokerId || null,
      ormawa_id: spData.ormawaId,
      period_id: spData.periodId || '2025/2026',
      tingkat: spData.tingkat, // 'SP1' | 'SP2' | 'SP3'
      perihal: spData.perihal,
      keterangan: spData.keterangan,
      tenggat_klarifikasi: spData.tenggatKlarifikasi,
      status: 'aktif',
      response_data: {},
      issued_by: issuedBy,
    };

    const { data, error } = await supabase
      .from('surat_peringatan')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error('[spService] Gagal menerbitkan SP:', error);
      return { success: false, message: error.message };
    }
    return { success: true, sp: data };
  },

  /**
   * Ormawa mengunggah tanggapan / surat klarifikasi atas SP
   */
  async submitClarification(spId, responsePayload) {
    if (!isSupabaseConfigured) return { success: false, fallback: true };

    const { data, error } = await supabase
      .from('surat_peringatan')
      .update({
        status: 'klarifikasi_diajukan',
        response_data: {
          ...responsePayload,
          submittedAt: new Date().toISOString(),
        },
      })
      .eq('id', spId)
      .select()
      .single();

    if (error) {
      console.error('[spService] Gagal submit klarifikasi SP:', error);
      return { success: false, message: error.message };
    }
    return { success: true, sp: data };
  },

  /**
   * DPM menyelesaikan / mencabut SP setelah klarifikasi diterima
   */
  async resolveSp(spId, notes) {
    if (!isSupabaseConfigured) return { success: false, fallback: true };

    const existing = await supabase
      .from('surat_peringatan')
      .select('response_data')
      .eq('id', spId)
      .single();

    const { data, error } = await supabase
      .from('surat_peringatan')
      .update({
        status: 'selesai',
        response_data: {
          ...(existing?.data?.response_data || {}),
          resolvedAt: new Date().toISOString(),
          resolutionNotes: notes || 'Klarifikasi diterima oleh DPM',
        },
      })
      .eq('id', spId)
      .select()
      .single();

    if (error) {
      console.error('[spService] Gagal menyelesaikan SP:', error);
      return { success: false, message: error.message };
    }
    return { success: true, sp: data };
  },
};
