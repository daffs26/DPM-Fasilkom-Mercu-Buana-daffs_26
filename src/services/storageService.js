import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

export const storageService = {
  /**
   * Upload berkas fisik ke Supabase Storage Bucket
   * @param {File} file - Berkas file dari input file
   * @param {'proposals' | 'lpj-documents' | 'receipts' | 'templates'} bucket
   * @param {string} folderPath - Subfolder tujuan (misal: 'bem/2025-2026')
   */
  async uploadFile(file, bucket = 'proposals', folderPath = 'general') {
    if (!isSupabaseConfigured) {
      // Mock upload for local development without credentials
      const fakeUrl = URL.createObjectURL(file);
      return {
        success: true,
        publicUrl: fakeUrl,
        fileName: file.name,
        fileSize: `${(file.size / 1024).toFixed(1)} KB`,
        filePath: `${folderPath}/${Date.now()}_${file.name}`,
      };
    }

    try {
      const fileExt = file.name.split('.').pop();
      const sanitizedName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[^a-zA-Z0-9_-]/g, '_');
      const uniqueFileName = `${Date.now()}_${sanitizedName}.${fileExt}`;
      const filePath = `${folderPath}/${uniqueFileName}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('[storageService] Upload error:', error);
        return { success: false, message: error.message };
      }

      // Ambil Public URL
      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      return {
        success: true,
        publicUrl: publicUrlData.publicUrl,
        filePath: data.path,
        fileName: file.name,
        fileSize: `${(file.size / 1024).toFixed(1)} KB`,
      };
    } catch (err) {
      console.error('[storageService] Unexpected error:', err);
      return { success: false, message: err.message };
    }
  },

  /**
   * Hapus file dari Supabase Storage
   */
  async deleteFile(bucket, filePath) {
    if (!isSupabaseConfigured || !filePath) return { success: true };

    const { error } = await supabase.storage.from(bucket).remove([filePath]);
    if (error) {
      return { success: false, message: error.message };
    }
    return { success: true };
  },
};
