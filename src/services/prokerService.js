import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

export const prokerService = {
  /**
   * Mengambil daftar proker berdasarkan periode dan filter ormawa
   */
  async getProkers({ periodId, ormawaId } = {}) {
    if (!isSupabaseConfigured) return [];

    let query = supabase
      .from('proker')
      .select('*, ormawa:ormawa_id(*)')
      .order('start_date', { ascending: true });

    if (periodId && periodId !== 'all') {
      query = query.eq('period_id', periodId);
    }

    if (ormawaId && ormawaId !== 'all') {
      query = query.eq('ormawa_id', ormawaId);
    }

    const { data, error } = await query;
    if (error) {
      console.error('[prokerService] Gagal memuat proker:', error);
      throw error;
    }
    return data || [];
  },

  /**
   * Mengambil detail satu proker
   */
  async getProkerById(id) {
    if (!isSupabaseConfigured) return null;

    const { data, error } = await supabase
      .from('proker')
      .select('*, ormawa:ormawa_id(*)')
      .eq('id', id)
      .single();

    if (error) {
      console.error('[prokerService] Gagal memuat detail proker:', error);
      return null;
    }
    return data;
  },

  /**
   * Menambahkan proker baru (status awal: draft)
   */
  async createProker(prokerData, createdBy) {
    if (!isSupabaseConfigured) return { success: false, fallback: true };

    const payload = {
      ormawa_id: prokerData.ormawaId || prokerData.ormawa_id,
      period_id: prokerData.periodId || prokerData.period_id || '2025/2026',
      created_by: createdBy,
      title: prokerData.title,
      divisi: prokerData.divisi,
      pic: prokerData.pic,
      pic_contact: prokerData.picContact || prokerData.pic_contact,
      start_date: prokerData.startDate || prokerData.start_date,
      end_date: prokerData.endDate || prokerData.end_date,
      location: prokerData.location,
      target_audience: prokerData.targetAudience || prokerData.target_audience,
      target_peserta: Number(prokerData.targetPeserta || prokerData.target_peserta || 0),
      rab: Number(prokerData.rab || 0),
      description: prokerData.description,
      status: 'draft',
      proposal_data: prokerData.proposalData || {},
      inspection_data: prokerData.inspectionData || {},
      lpj_data: prokerData.lpjData || {},
      other_docs: prokerData.otherDocs || [],
    };

    const { data, error } = await supabase
      .from('proker')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error('[prokerService] Gagal membuat proker:', error);
      return { success: false, message: error.message };
    }

    return { success: true, proker: data };
  },

  /**
   * Memperbarui informasi proker umum
   */
  async updateProker(id, updates) {
    if (!isSupabaseConfigured) return { success: false, fallback: true };

    const { data, error } = await supabase
      .from('proker')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[prokerService] Gagal mengupdate proker:', error);
      return { success: false, message: error.message };
    }

    return { success: true, proker: data };
  },

  /**
   * Ormawa mengajukan Proposal (status -> proposal_pending)
   */
  async submitProposal(id, proposalPayload) {
    return this.updateProker(id, {
      status: 'proposal_pending',
      proposal_data: proposalPayload,
    });
  },

  /**
   * DPM mereview proposal (ACC atau Minta Revisi)
   */
  async reviewProposal(id, { status, revisionNotes, reviewerProfile }) {
    const existing = await this.getProkerById(id);
    const updatedProposalData = {
      ...(existing?.proposal_data || {}),
      reviewedAt: new Date().toISOString(),
      reviewedBy: reviewerProfile?.name || 'Auditor DPM',
      revisionNotes: revisionNotes || '',
    };

    return this.updateProker(id, {
      status, // 'proposal_approved' atau 'proposal_revisi'
      proposal_data: updatedProposalData,
    });
  },

  /**
   * DPM mengisi berita acara pengawasan Hari-H
   */
  async submitInspection(id, inspectionPayload) {
    return this.updateProker(id, {
      inspection_data: {
        ...inspectionPayload,
        inspectedAt: new Date().toISOString(),
      },
    });
  },

  /**
   * Ormawa mengunggah LPJ (status -> lpj_pending)
   */
  async submitLpj(id, lpjPayload) {
    return this.updateProker(id, {
      status: 'lpj_pending',
      lpj_data: {
        ...lpjPayload,
        submittedAt: new Date().toISOString(),
      },
    });
  },

  /**
   * DPM mengaudit LPJ dan memberikan skor serta predikat (status -> completed)
   */
  async auditLpj(id, auditPayload) {
    const existing = await this.getProkerById(id);
    const updatedLpjData = {
      ...(existing?.lpj_data || {}),
      ...auditPayload,
      auditedAt: new Date().toISOString(),
    };

    return this.updateProker(id, {
      status: 'completed',
      realisasi_dana: auditPayload.realisasiDana || existing?.realisasi_dana || 0,
      realisasi_peserta: auditPayload.realisasiPeserta || existing?.realisasi_peserta || 0,
      lpj_data: updatedLpjData,
    });
  },

  /**
   * Ormawa mengajukan pembatalan / penghapusan proker
   */
  async requestDeletion(prokerId, ormawaId, alasan) {
    if (!isSupabaseConfigured) return { success: false, fallback: true };

    const { error: reqError } = await supabase
      .from('deletion_requests')
      .insert({
        proker_id: prokerId,
        ormawa_id: ormawaId,
        alasan,
      });

    if (reqError) {
      return { success: false, message: reqError.message };
    }

    return this.updateProker(prokerId, { status: 'deletion_pending' });
  },

  /**
   * DPM mengeksekusi penghapusan proker yang diajukan
   */
  async deleteProker(id) {
    if (!isSupabaseConfigured) return { success: false, fallback: true };

    const { error } = await supabase.from('proker').delete().eq('id', id);
    if (error) {
      return { success: false, message: error.message };
    }
    return { success: true };
  },
};
