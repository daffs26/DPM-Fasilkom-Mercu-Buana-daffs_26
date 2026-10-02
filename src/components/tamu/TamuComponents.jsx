import React from 'react';
import { Eye, Lock } from 'lucide-react';
import { useStore } from '@/store/useStore';

/**
 * TamuGuideCard
 * Kartu panduan mode Tamu Publik transparansi akuntabilitas ormawa.
 */
export function TamuGuideCard({ className = '' }) {
  return (
    <div className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white shadow-md border border-blue-700/40 relative overflow-hidden ${className}`}>
      <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="flex items-center justify-between gap-3 sm:gap-4 relative z-10">
        <div className="flex items-start gap-3 sm:gap-3.5">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0 text-blue-300 shadow-inner mt-0.5 sm:mt-0">
            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-xs sm:text-base tracking-tight text-white">
              Transparansi Publik
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 leading-normal">
              Akses publik monitoring program kerja, serapan anggaran, dan dokumen kegiatan ormawa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * TamuPrivacyNotice
 * Keterangan perlindungan data pribadi (NIM & nomor WA)
 */
export function TamuPrivacyNotice({ className = '' }) {
  return (
    <div className={`p-2.5 rounded-xl bg-slate-100/90 border border-slate-200/80 flex items-center gap-2 text-xs text-slate-600 ${className}`}>
      <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
      <span className="leading-snug">
        <strong className="text-slate-800">Privasi:</strong> Kontak dan data pribadi panitia disamarkan.
      </span>
    </div>
  );
}

/**
 * TamuGuard
 * Menyembunyikan elemen atau menampilkan fallback jika role === 'guest'.
 */
export function TamuGuard({ children, fallback = null }) {
  const currentUser = useStore(state => state.currentUser);
  const isGuest = currentUser?.role === 'guest';
  if (isGuest) return fallback;
  return <>{children}</>;
}

export function useIsGuest() {
  const currentUser = useStore(state => state.currentUser);
  return currentUser?.role === 'guest';
}

export default TamuGuideCard;
