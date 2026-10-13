import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Mail, 
  ShieldCheck 
} from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="border-t border-slate-200/90 bg-white text-slate-600 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Column 1: Organization Branding */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200/80 p-1 flex items-center justify-center shadow-2xs shrink-0">
                <img 
                  src="/logos/logo-dpm.png" 
                  alt="DPM FASILKOM UMB" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-sm sm:text-base leading-tight">
                  DPM FASILKOM UMB
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Dewan Perwakilan Mahasiswa Fakultas Ilmu Komputer
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed max-w-md">
              Lembaga legislatif dan yudikatif kemahasiswaan tingkat Fakultas Ilmu Komputer Universitas Mercu Buana. Berkomitmen menegakkan transparansi kinerja, evaluasi anggaran, dan advokasi mahasiswa yang akuntabel.
            </p>

            <div className="space-y-1.5 text-xs text-slate-500 pt-1">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>Gedung Fasilitas Mahasiswa, Kampus Meruya, Jakarta Barat 11650</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>dpm.fasilkom@mercubuana.ac.id</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links Transparansi */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Akses Transparansi
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/publik/dashboard" className="text-slate-500 hover:text-red-600 transition">
                  Dashboard Kinerja
                </Link>
              </li>
              <li>
                <Link to="/publik/pengawasan" className="text-slate-500 hover:text-red-600 transition">
                  Pengawasan &amp; Audit LPJ
                </Link>
              </li>
              <li>
                <Link to="/publik/proker" className="text-slate-500 hover:text-red-600 transition">
                  Direktori Program Kerja
                </Link>
              </li>
              <li>
                <Link to="/publik/struktur" className="text-slate-500 hover:text-red-600 transition">
                  Struktur Organisasi DPM
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© 2026 DPM FASILKOM Universitas Mercu Buana. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-slate-500 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sistem Transparansi Publik Aktif</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
