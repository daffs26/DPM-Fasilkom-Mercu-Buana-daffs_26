import React from 'react';
import { Eye } from 'lucide-react';

/**
 * TamuGuideCard
 * Komponen kartu panduan khusus Tamu Publik yang menjelaskan
 * hak akses membaca transparansi akuntabilitas ormawa tanpa izin mutasi data.
 */
export default function TamuGuideCard({ className = '' }) {
  return (
    <div className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white shadow-md border border-blue-700/40 relative overflow-hidden ${className}`}>
      <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
      
      <div className="flex items-center justify-between gap-4 relative z-10">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0 text-blue-300 shadow-inner">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base tracking-tight text-white">
              Mode Transparansi Publik Mahasiswa
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Pantau transparansi program kerja, anggaran, dan dokumen kegiatan Fasilkom UMB secara terbuka. Pengelolaan berkas dikhususkan bagi pengurus resmi Ormawa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
