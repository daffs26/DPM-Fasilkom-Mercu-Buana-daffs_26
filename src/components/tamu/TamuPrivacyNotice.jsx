import React from 'react';
import { Lock, Shield } from 'lucide-react';

/**
 * TamuPrivacyNotice
 * Komponen banner keterangan perlindungan data pribadi (NIM & nomor WA panitia)
 * yang ditampilkan dalam mode Tamu publik untuk transparansi beretika.
 */
export default function TamuPrivacyNotice({ className = '' }) {
  return (
    <div className={`p-3 rounded-xl bg-slate-100/90 border border-slate-200/80 flex items-center gap-2.5 text-xs text-slate-600 ${className}`}>
      <Lock className="w-4 h-4 text-slate-500 shrink-0" />
      <span className="leading-snug">
        <strong className="text-slate-800">Perlindungan Privasi Mahasiswa:</strong> Nomor WhatsApp dan NIM panitia disamarkan demi keamanan data pribadi.
      </span>
    </div>
  );
}
