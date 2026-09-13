import React from 'react';
import { ShieldCheck, Eye, Lock } from 'lucide-react';

/**
 * TamuGuideCard
 * Komponen kartu panduan khusus Tamu Publik yang menjelaskan
 * hak akses membaca transparansi akuntabilitas ormawa tanpa izin mutasi data.
 */
export default function TamuGuideCard({ className = '' }) {
  return (
    <div className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white shadow-md border border-blue-700/40 relative overflow-hidden ${className}`}>
      <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0 text-blue-300 shadow-inner">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                Mode Transparansi Publik Mahasiswa
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/30 text-blue-200 border border-blue-400/30">
                Akses Terbuka
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Selamat datang di portal transparansi Fasilkom UMB. Anda memiliki akses penuh membaca dan memverifikasi data proker, anggaran, berkas laporan, serta kalender kegiatan. Pengelolaan berkas dan administrasi khusus diperuntukkan bagi pengurus resmi Ormawa (DPM, BEM, HiMTI, HIMSISFO).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-semibold text-blue-200/90 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Diawasi DPM Fasilkom</span>
        </div>
      </div>
    </div>
  );
}
