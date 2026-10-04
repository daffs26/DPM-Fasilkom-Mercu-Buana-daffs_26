import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

export const notificationService = {
  /**
   * Mengambil daftar notifikasi untuk pengguna atau ormawa tertentu
   */
  async getNotifications({ ormawaId, userId } = {}) {
    if (!isSupabaseConfigured) return [];

    let query = supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30);

    if (ormawaId && ormawaId !== 'dpm') {
      query = query.or(`recipient_ormawa_id.eq.${ormawaId},recipient_ormawa_id.eq.all,recipient_user_id.eq.${userId}`);
    }

    const { data, error } = await query;
    if (error) {
      console.error('[notificationService] Gagal memuat notifikasi:', error);
      return [];
    }
    return data || [];
  },

  /**
   * Tandai satu notifikasi sudah dibaca
   */
  async markAsRead(notificationId) {
    if (!isSupabaseConfigured) return;

    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
  },

  /**
   * Tandai semua notifikasi sudah dibaca
   */
  async markAllAsRead({ ormawaId, userId } = {}) {
    if (!isSupabaseConfigured) return;

    let query = supabase.from('notifications').update({ is_read: true }).eq('is_read', false);

    if (ormawaId && ormawaId !== 'dpm') {
      query = query.or(`recipient_ormawa_id.eq.${ormawaId},recipient_user_id.eq.${userId}`);
    }

    await query;
  },

  /**
   * Mengirim notifikasi baru ke target ormawa / user
   */
  async sendNotification({
    recipientOrmawaId = 'all',
    recipientUserId = null,
    title,
    message,
    type = 'system',
    linkTab = null,
  }) {
    if (!isSupabaseConfigured) return { success: false, fallback: true };

    const { data, error } = await supabase
      .from('notifications')
      .insert({
        recipient_ormawa_id: recipientOrmawaId,
        recipient_user_id: recipientUserId,
        title,
        message,
        type,
        link_tab: linkTab,
        is_read: false,
      })
      .select()
      .single();

    if (error) {
      console.error('[notificationService] Gagal mengirim notifikasi:', error);
      return { success: false, message: error.message };
    }
    return { success: true, notification: data };
  },

  /**
   * Berlangganan (Subscribe) Realtime WebSocket untuk Notifikasi Baru
   * @param {string} ormawaId
   * @param {string} userId
   * @param {function} onNotificationReceived
   * @returns {function} unsubscribe function
   */
  subscribeNotifications(ormawaId, userId, onNotificationReceived) {
    if (!isSupabaseConfigured) {
      return () => {}; // No-op jika Supabase belum aktif
    }

    const channelName = `realtime-notifications-${ormawaId || 'guest'}-${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => {
          const newNotif = payload.new;
          // Filter apakah notifikasi ditujukan ke pengguna ini
          if (
            newNotif.recipient_ormawa_id === 'all' ||
            newNotif.recipient_ormawa_id === ormawaId ||
            newNotif.recipient_user_id === userId ||
            ormawaId === 'dpm'
          ) {
            onNotificationReceived(newNotif);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
};
