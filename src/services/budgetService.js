import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

export const budgetService = {
  /**
   * Mengambil daftar ormawa beserta pagu dan serapan anggaran
   */
  async getOrmawaBudget() {
    if (!isSupabaseConfigured) return [];

    const { data, error } = await supabase
      .from('ormawa')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('[budgetService] Gagal memuat anggaran ormawa:', error);
      throw error;
    }
    return data || [];
  },

  /**
   * DPM memperbarui pagu alokasi anggaran ormawa
   */
  async updatePagu(ormawaId, newPagu) {
    if (!isSupabaseConfigured) return { success: false, fallback: true };

    const { data, error } = await supabase
      .from('ormawa')
      .update({ pagu_anggaran: Number(newPagu) })
      .eq('id', ormawaId)
      .select()
      .single();

    if (error) {
      console.error('[budgetService] Gagal update pagu:', error);
      return { success: false, message: error.message };
    }
    return { success: true, ormawa: data };
  },

  /**
   * Mengambil transaksi keuangan ormawa
   */
  async getTransactions({ periodId, ormawaId } = {}) {
    if (!isSupabaseConfigured) return [];

    let query = supabase
      .from('budget_transactions')
      .select('*, proker:proker_id(title)')
      .order('tanggal', { ascending: false });

    if (periodId && periodId !== 'all') {
      query = query.eq('period_id', periodId);
    }
    if (ormawaId && ormawaId !== 'all') {
      query = query.eq('ormawa_id', ormawaId);
    }

    const { data, error } = await query;
    if (error) {
      console.error('[budgetService] Gagal memuat transaksi:', error);
      throw error;
    }
    return data || [];
  },

  /**
   * Menambahkan transaksi kas baru dan mengupdate akumulasi serapan
   */
  async addTransaction(txData, createdBy) {
    if (!isSupabaseConfigured) return { success: false, fallback: true };

    const payload = {
      ormawa_id: txData.ormawaId || txData.ormawa_id,
      period_id: txData.periodId || txData.period_id || '2025/2026',
      proker_id: txData.prokerId || null,
      type: txData.type, // 'pemasukan' | 'pengeluaran'
      nominal: Number(txData.nominal),
      keterangan: txData.keterangan,
      tanggal: txData.tanggal || new Date().toISOString().split('T')[0],
      receipt_url: txData.receiptUrl || null,
      created_by: createdBy,
    };

    const { data: newTx, error: txError } = await supabase
      .from('budget_transactions')
      .insert(payload)
      .select()
      .single();

    if (txError) {
      console.error('[budgetService] Gagal insert transaksi:', txError);
      return { success: false, message: txError.message };
    }

    // Jika pengeluaran, hitung ulang dan update serapan ormawa
    if (txData.type === 'pengeluaran') {
      try {
        const { data: allExpenses } = await supabase
          .from('budget_transactions')
          .select('nominal')
          .eq('ormawa_id', payload.ormawa_id)
          .eq('period_id', payload.period_id)
          .eq('type', 'pengeluaran');

        const totalSerapan = (allExpenses || []).reduce((acc, curr) => acc + Number(curr.nominal), 0);

        await supabase
          .from('ormawa')
          .update({ serapan_anggaran: totalSerapan })
          .eq('id', payload.ormawa_id);
      } catch (calcErr) {
        console.warn('[budgetService] Error sinkronisasi serapan anggaran:', calcErr);
      }
    }

    return { success: true, transaction: newTx };
  },
};
