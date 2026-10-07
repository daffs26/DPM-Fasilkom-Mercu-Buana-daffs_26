import React from 'react';
import { Calendar, Clock, ShieldCheck } from 'lucide-react';

export default function LastLoginWidget({ currentUser, variant = 'header', className = '' }) {
  const now = new Date();
  
  // Format Hari, Tanggal Bulan Tahun dalam Bahasa Indonesia (Contoh: Rabu, 07 Oktober 2026)
  const todayFormatted = now.toLocaleDateString('id-ID', { 
    weekday: 'long', 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  });

  // Waktu Login Terakhir pengguna
  const lastLoginText = currentUser?.lastLogin || '27 September 2026';

  // Variant Dropdown (Tampil di dalam menu profil saat avatar diklik & sidebar)
  if (variant === 'dropdown') {
    return (
      <div className={`p-2.5 rounded-xl bg-teal-50/40 border border-teal-100/90 shadow-2xs space-y-1.5 ${className}`}>
        {/* Baris 1: Hari, Tanggal Bulan Tahun */}
        <div className="flex items-center justify-between text-[11px] leading-tight">
          <span className="flex items-center gap-1.5 text-teal-900 font-extrabold tracking-tight">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 shadow-2xs" />
            {todayFormatted}
          </span>
        </div>

        {/* Garis Pemisah Terkalibrasi (Sesuai refrensi garis hijau/teal halus) */}
        <div className="h-[1.5px] w-full bg-gradient-to-r from-teal-500/40 via-emerald-600/50 to-teal-400/30 rounded-full" />

        {/* Baris 2: LAST LOGIN */}
        <div className="flex items-center justify-between gap-1 text-[10.5px] leading-tight">
          <span className="font-mono font-black text-teal-700 tracking-wider uppercase text-[9.5px] shrink-0">
            LAST LOGIN:
          </span>
          <span className="font-bold text-teal-900 truncate text-right">
            {lastLoginText}
          </span>
        </div>
      </div>
    );
  }

  // Variant Sidebar (Khusus ditempatkan di bawah teks DPM FASILKOM paling atas sidebar)
  if (variant === 'sidebar' || variant === 'header') {
    return (
      <div className={`w-full px-2.5 py-1.5 rounded-xl bg-teal-50/45 border border-teal-100/90 shadow-2xs space-y-1 text-left transition hover:bg-teal-50/70 hover:border-teal-200/90 ${className}`}>
        {/* Baris 1: Hari, Tanggal Bulan Tahun */}
        <div className="flex items-center gap-1.5 text-[11px] font-black text-teal-900 tracking-tight leading-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse ring-2 ring-emerald-200/90" />
          <span className="truncate">{todayFormatted}</span>
        </div>

        {/* Garis Pemisah Halus Terkalibrasi (Sesuai referensi garis hijau/teal) */}
        <div className="h-[1px] w-full bg-gradient-to-r from-teal-500/40 via-emerald-600/50 to-teal-400/30 rounded-full" />

        {/* Baris 2: LAST LOGIN */}
        <div className="flex items-center justify-between gap-1 text-[9.5px] leading-none">
          <span className="font-mono font-black text-teal-700 tracking-wider uppercase text-[8.5px] shrink-0">
            LAST LOGIN:
          </span>
          <span className="font-bold text-teal-900 font-sans tracking-tight truncate text-right">
            {lastLoginText}
          </span>
        </div>
      </div>
    );
  }

  // Variant Banner (Untuk Dashboard / Greeting Card)
  return (
    <div className={`inline-flex flex-col justify-center px-3.5 py-2 rounded-2xl bg-white/95 backdrop-blur-xs border border-teal-100 shadow-2xs min-w-[210px] ${className}`}>
      {/* Baris 1: Hari, Tanggal Bulan Tahun */}
      <div className="flex items-center gap-2 text-xs font-black text-teal-900 tracking-tight leading-none">
        <Calendar className="w-3.5 h-3.5 text-teal-600 shrink-0" />
        <span>{todayFormatted}</span>
      </div>

      {/* Garis Pemisah */}
      <div className="h-[1px] w-full bg-gradient-to-r from-teal-500/50 via-emerald-600/60 to-teal-400/30 rounded-full my-1.5" />

      {/* Baris 2: LAST LOGIN */}
      <div className="flex items-center gap-1.5 text-[10.5px] leading-none">
        <span className="font-mono font-black text-teal-700 tracking-wider uppercase text-[9px] shrink-0">
          LAST LOGIN:
        </span>
        <span className="font-extrabold text-teal-900 font-sans tracking-tight">
          {lastLoginText}
        </span>
      </div>
    </div>
  );
}
