import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

export const templateService = {
  /**
   * Mengambil daftar template dokumen resmi
   */
  async getTemplates({ category, periode } = {}) {
    if (!isSupabaseConfigured) return [];

    let query = supabase
      .from('document_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (category && category !== 'all') {
      query = query.eq('category_slug', category);
    }
    if (periode && periode !== 'all') {
      query = query.eq('periode', periode);
    }

    const { data, error } = await query;
    if (error) {
      console.error('[templateService] Gagal memuat template:', error);
      throw error;
    }
    return data || [];
  },

  /**
   * DPM mengunggah template dokumen baru
   */
  async addTemplate(tplData, uploadedBy) {
    if (!isSupabaseConfigured) return { success: false, fallback: true };

    const payload = {
      id: tplData.id || `tpl-${Date.now()}`,
      title: tplData.title,
      category: tplData.category,
      category_slug: tplData.categorySlug || 'lainnya',
      format: tplData.format || 'DOCX',
      file_size: tplData.fileSize || '150 KB',
      periode: tplData.periode || '2025/2026',
      is_official: true,
      author: tplData.author || 'DPM FASILKOM UMB',
      description: tplData.description,
      tags: tplData.tags || [],
      fields: tplData.fields || [],
      content_preview: tplData.contentPreview || '',
      file_url: tplData.fileUrl || null,
      uploaded_by: uploadedBy,
    };

    const { data, error } = await supabase
      .from('document_templates')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error('[templateService] Gagal menambah template:', error);
      return { success: false, message: error.message };
    }
    return { success: true, template: data };
  },

  /**
   * DPM menghapus template dokumen
   */
  async deleteTemplate(id) {
    if (!isSupabaseConfigured) return { success: false, fallback: true };

    const { error } = await supabase
      .from('document_templates')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[templateService] Gagal menghapus template:', error);
      return { success: false, message: error.message };
    }
    return { success: true };
  },

  /**
   * Catat penambahan jumlah unduhan template
   */
  async incrementDownload(id) {
    if (!isSupabaseConfigured) return;

    try {
      const { data } = await supabase
        .from('document_templates')
        .select('download_count')
        .eq('id', id)
        .single();

      if (data) {
        await supabase
          .from('document_templates')
          .update({ download_count: (data.download_count || 0) + 1 })
          .eq('id', id);
      }
    } catch (err) {
      console.warn('[templateService] Gagal increment download count:', err);
    }
  },
};
