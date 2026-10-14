import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Building2,
  Clock,
  ExternalLink,
  ShieldCheck,
  Globe
} from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="border-t border-slate-200/90 bg-white text-slate-600 transition-colors">
      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 items-start">
          
          {/* Kolom 1: Brand & Identitas Organisasi (4 Kolom Grid) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 p-1.5 flex items-center justify-center shadow-2xs shrink-0">
                <img 
                  src="/logos/logo-dpm.png" 
                  alt="DPM FASILKOM UMB" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-lg leading-tight tracking-tight">
                  DPM FASILKOM UMB
                </h3>
                <p className="text-xs font-bold text-red-600 tracking-wide uppercase mt-0.5">
                  Parlemen Aspiratif &amp; Transparan
                </p>
              </div>
            </div>

            <div className="w-16 h-0.5 bg-red-600/30"></div>

            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Organisasi mahasiswa legislatif Fakultas Ilmu Komputer Universitas Mercu Buana. Berkomitmen menegakkan tata kelola transparan, evaluasi program kerja akuntabel organisasi mahasiswa yang responsif.
            </p>

            {/* Social Media Badges */}
            <div className="flex items-center gap-2.5 pt-1">
              <a 
                href="https://www.instagram.com/dpmfasilkom.umb?exln=ZDNlZDc0MzIxNw==" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="Instagram DPM FASILKOM UMB"
                className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xs hover:bg-red-700 hover:scale-105 transition-all duration-200"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>


              <a 
                href="https://www.linkedin.com/company/dewan-perwakilan-mahasiswa-dpm-fakultas-ilmu-komputer-universitas-mercu-buana/" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="LinkedIn Resmi DPM FASILKOM UMB"
                className="w-9 h-9 rounded-full border border-slate-200 bg-slate-50 text-slate-600 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 hover:scale-105 transition-all duration-200"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>

              <a 
                href="https://mercubuana.ac.id" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="Situs Resmi Universitas Mercu Buana"
                className="w-9 h-9 rounded-full border border-slate-200 bg-slate-50 text-slate-600 flex items-center justify-center hover:bg-red-50 hover:text-red-600 hover:border-red-200 hover:scale-105 transition-all duration-200"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Kolom 2: Akses Portal Publik (2 Kolom Grid) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Akses Portal
            </h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>
                <Link to="/publik" className="hover:text-red-600 transition flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  <span>Beranda Publik</span>
                </Link>
              </li>
              <li>
                <Link to="/publik/dashboard" className="hover:text-red-600 transition flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  <span>Dashboard Kinerja</span>
                </Link>
              </li>
              <li>
                <Link to="/publik/pengawasan" className="hover:text-red-600 transition flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  <span>Pengawasan &amp; LPJ</span>
                </Link>
              </li>
              <li>
                <Link to="/publik/proker" className="hover:text-red-600 transition flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  <span>Direktori Proker</span>
                </Link>
              </li>
              <li>
                <Link to="/publik/struktur" className="hover:text-red-600 transition flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  <span>Struktur DPM</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Komisi Parlemen (2 Kolom Grid) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Komisi Parlemen
            </h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                <span>Komisi 1 (Advokasi)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                <span>Komisi 2 (Pengawasan)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                <span>Komisi 3 (Anggaran)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                <span>Komisi 4 (Kominfo)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                <span>Badan Yudikatif DPM</span>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Kontak & Widget Peta Lokasi Kampus (4 Kolom Grid) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Sekretariat &amp; Lokasi
            </h4>
            
            {/* Map Card */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-2xs group bg-slate-100">
              <iframe
                title="Lokasi Kampus Meruya Universitas Mercu Buana"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.3385732168923!2d106.73616557499037!3d-6.209406593778486!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f71f5a41c197%3A0x628259f9e8d6d7b4!2sUniversitas%20Mercu%20Buana!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                className="w-full h-36 border-0 opacity-90 group-hover:opacity-100 transition duration-300 pointer-events-none"
                loading="lazy"
              ></iframe>
              <a
                href="https://maps.app.goo.gl/4eQGniqT4qR9kShe8"
                target="_blank"
                rel="noreferrer"
                className="absolute inset-0 flex items-end justify-between p-3 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-transparent text-white text-xs font-medium"
              >
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-500 fill-red-500 shrink-0" />
                  <span className="font-semibold text-slate-100">Kampus Meruya, Jakarta Barat</span>
                </span>
                <span className="flex items-center gap-1 text-[11px] text-red-200 hover:text-white transition font-medium">
                  <span>Buka Peta</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </a>
            </div>

            {/* Quick Location & Secretariat Info */}
            <div className="space-y-1.5 text-xs text-slate-500 pt-1">
              <div className="flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>Ruang Ormawa DPM, Gedung Fasilitas Mahasiswa</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>Layanan Sekretariat: Senin - Jumat (09.00 - 17.00 WIB)</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Bar Kontras Gelap (Deep Slate) */}
      <div className="bg-slate-950 text-slate-400 py-4 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 text-[11px] text-slate-400">
            <Link to="/publik" className="hover:text-white transition">Kebijakan Privasi</Link>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <Link to="/publik/pengawasan" className="hover:text-white transition">Standar Pengawasan</Link>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <Link to="/publik/proker" className="hover:text-white transition">Direktori Ormawa</Link>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Sistem Transparansi Aktif</span>
            </span>
          </div>

          <p className="text-[11px] text-slate-500 text-center sm:text-right">
            © 2026 DPM FASILKOM Universitas Mercu Buana. Seluruh hak cipta dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
