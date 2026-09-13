import React from 'react';
import { useStore } from '@/store/useStore';

/**
 * TamuGuard
 * Wrapper utilitas hak akses Tamu:
 * Menyembunyikan anak komponen atau menampilkan fallback jika pengguna berstatus 'guest'.
 * 
 * Penggunaan:
 * <TamuGuard fallback={<TamuNotice />}>
 *   <TombolAksiOrmawa />
 * </TamuGuard>
 */
export default function TamuGuard({ children, fallback = null }) {
  const currentUser = useStore(state => state.currentUser);
  const isGuest = currentUser?.role === 'guest';

  if (isGuest) {
    return fallback;
  }

  return <>{children}</>;
}

/**
 * Helper hook untuk mengecek status Tamu di komponen
 */
export function useIsGuest() {
  const currentUser = useStore(state => state.currentUser);
  return currentUser?.role === 'guest';
}
