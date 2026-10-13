import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { 
  Layers, 
  ArrowRight, 
  ArrowUpRight,
  Compass, 
  TrendingUp, 
  Users2,
  Search
} from 'lucide-react';
import { formatRupiah } from '@/utils/formatters';
import logoDpm from '@/assets/logos/logo-dpm.png';

export default function PublicLandingPage() {
  const { ormawas = [], prokers = [] } = useStore(useShallow(state => ({
    ormawas: state.ormawas,
    prokers: state.prokers
  })));

  // Live Metrics
  const totalProkers = prokers.length;
  const totalPagu = ormawas.reduce((acc, o) => acc + (o.paguAnggaran || 0), 0);
  const totalSerapan = ormawas.reduce((acc, o) => acc + (o.serapanAnggaran || 0), 0);

  const featureCards = [
    {
      num: '01',
      icon: Search,
      title: 'Transparansi Anggaran Kas',
      desc: 'Pantau serapan kas dan alokasi dana kemahasiswaan setiap ormawa secara terbuka tanpa batasan akses login.',
      badges: [
        { label: `${formatRupiah(totalSerapan)} Terpakai`, cls: 'bg-red-50/90 text-red-700 border-red-200/70' },
        { label: 'Pagu Terdata', cls: 'bg-slate-100/90 text-slate-700 border-slate-200/80' }
      ],
      link: '/publik/dashboard',
      cta: 'Buka Dashboard Anggaran'
    },
    {
      num: '02',
      icon: Layers,
      title: 'Pengawasan & Audit LPJ',
      desc: 'Penilaian kepatuhan berkas LPJ, matriks skor audit ormawa, dan catatan kepatuhan regulasi oleh Komisi Pengawasan.',
      badges: [
        { label: 'Audit Kepatuhan', cls: 'bg-slate-100 text-slate-800 border-slate-200/80' },
        { label: 'Skor Transparan', cls: 'bg-slate-100/90 text-slate-700 border-slate-200/80' }
      ],
      link: '/publik/pengawasan',
      cta: 'Pantau Hasil Audit'
    },
    {
      num: '03',
      icon: TrendingUp,
      title: 'Monitoring Program Kerja',
      desc: 'Agenda terintegrasi seluruh kegiatan BEM, HIMTI, HIMSISFO, dan DPM beserta jadwal dan status verifikasi proker.',
      badges: [
        { label: `${totalProkers} Kegiatan Terdata`, cls: 'bg-red-50/90 text-red-700 border-red-200/70' },
        { label: 'Linimasa Terpadu', cls: 'bg-slate-100/90 text-slate-700 border-slate-200/80' }
      ],
      link: '/publik/proker',
      cta: 'Lihat Kalender Proker'
    }
  ];

  const misiItems = [
    {
      num: '01',
      badgeCls: 'bg-red-50 text-red-600 border-red-200/60',
      hoverCls: 'hover:border-red-200',
      title: 'Optimalisasi Tupoksi Internal',
      desc: 'Menjalankan fungsi legislasi, anggaran, dan pengawasan internal secara tertib, independen, dan profesional.'
    },
    {
      num: '02',
      badgeCls: 'bg-slate-950 text-white border-slate-900',
      hoverCls: 'hover:border-slate-300',
      title: 'Pengawasan Ormawa',
      desc: 'Melaksanakan monitoring dan evaluasi berkala yang objektif terhadap kinerja BEM, HIMTI, dan HIMSISFO.'
    },
    {
      num: '03',
      badgeCls: 'bg-red-50 text-red-600 border-red-200/60',
      hoverCls: 'hover:border-red-200',
      title: 'Penguatan Koordinasi & Komunikasi Ormawa',
      desc: 'Membangun forum komunikasi rutin dan alur koordinasi yang terbuka guna menyelaraskan agenda kerja serta mencegah tumpang-tindih kegiatan.'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 py-4 sm:py-8">
      
      {/* ── HERO SECTION (KONSEPTUAL RYNERTIA MODERN - EXACT SIZING) ── */}
      <section className="relative pt-4 sm:pt-6 pb-6">
        {/* Subtle Ambient Radial Glows (Tanpa Efek Garis/Border/Grid) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-32 -right-16 w-[450px] h-[450px] rounded-full" />
          <div className="absolute top-1/4 -left-28 w-[400px] h-[400px] rounded-full" />
        </div>

        {/* Top 2-Column Hero Layout */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Kolom Kiri: Headline, Deskripsi, Buttons (Sizing Identik Rynertia) */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-[46px] xl:text-[52px] font-extrabold text-slate-900 leading-[1.14] sm:leading-[1.1] tracking-tight">
              <span className="block">Akselerasi Transparansi melalui</span>
              <span className="text-red-600 inline-block pb-1 sm:pb-1.5">
                Pengawasan &amp; Tata Kelola Ormawa
              </span>
            </h1>

            <p className="text-sm sm:text-base lg:text-[16.5px] xl:text-[17px] text-slate-700 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              DPM FASILKOM UMB mengintegrasikan pengawasan kinerja, keterbukaan realisasi anggaran kemahasiswaan, dan penjaminan mutu program kerja untuk menghadirkan tata kelola ormawa yang akuntabel, inklusif, dan berdaya guna bagi mahasiswa.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 sm:gap-4 pt-1.5 sm:pt-2.5">
              <Link
                to="/publik/dashboard"
                className="w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold sm:font-bold text-sm sm:text-[15px] shadow-lg shadow-red-600/20 hover:shadow-xl hover:shadow-red-600/30 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2.5 group cursor-pointer min-h-[48px] sm:min-h-[50px]"
              >
                <span>Jelajahi Dashboard</span>
                <Compass className="w-4.5 h-4.5 sm:w-5 sm:h-5 group-hover:rotate-45 transition-transform duration-300" />
              </Link>

              <Link
                to="/publik/struktur"
                className="w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl border-2 border-slate-300/90 bg-white/90 hover:bg-white hover:border-slate-900 hover:text-slate-900 text-slate-800 font-semibold sm:font-bold text-sm sm:text-[15px] shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2.5 hover:-translate-y-0.5 cursor-pointer min-h-[48px] sm:min-h-[50px] backdrop-blur-md group"
              >
                <span>Bagan Struktur DPM</span>
                <ArrowUpRight className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-slate-600 group-hover:translate-y-0.5" />
              </Link>
            </div>
          </div>

          {/* Kolom Kanan: Visual Emblem & Floating Badges (Sizing Identik Rynertia) */}
          <div className="lg:col-span-5 relative flex items-center justify-center pt-6 lg:pt-0">
            <div className="relative w-72 sm:w-80 h-72 sm:h-80">
              {/* Soft Ambient Halo (Melayang Naik Turun Seirama) */}
              <div 
                className="absolute -inset-6 sm:-inset-8 rounded-full bg-gradient-to-tr from-red-500/20 via-red-200/40 to-transparent blur-3xl pointer-events-none animate-halo-updown" 
                style={{ animation: 'halo-float-updown 3.6s ease-in-out infinite' }}
                aria-hidden="true"
              />

              {/* Central Soft Circle Emblem (Melayang Naik Turun) */}
              <div 
                className="absolute inset-0 rounded-full bg-gradient-to-tr from-slate-100/95 via-red-50/40 to-slate-50/80 flex items-center justify-center shadow-[0_10px_35px_rgba(220,38,38,0.08)] p-8 sm:p-10 animate-float-updown"
                style={{ animation: 'float-updown 3.6s ease-in-out infinite' }}
              >
                <img
                  src={logoDpm}
                  alt="DPM FASILKOM UMB Official Logo"
                  className="w-44 h-44 sm:w-52 sm:h-52 object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.08)] select-none"
                />
              </div>

              {/* Top-Right Floating Badge: 4 Ormawa */}
              <div 
                className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 px-4 py-3 rounded-2xl border border-slate-200/90 shadow-xl flex items-center gap-3 z-20 bg-white/95 backdrop-blur-md animate-float-badge-1"
                style={{ animation: 'float-badge-updown-1 3.4s ease-in-out infinite' }}
              >
                <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 border border-red-200/60 flex items-center justify-center shrink-0">
                  <Users2 className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="block text-sm sm:text-base font-bold text-slate-900 leading-tight">
                    4 Ormawa
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">
                    LEMBAGA DIAWASI
                  </span>
                </div>
              </div>

              {/* Bottom-Left Floating Badge: 4 Pilar */}
              <div 
                className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 px-4 py-3 rounded-2xl border border-slate-200/90 shadow-xl flex items-center gap-3 z-20 bg-white/95 backdrop-blur-md animate-float-badge-2"
                style={{ animation: 'float-badge-updown-2 4.0s ease-in-out infinite' }}
              >
                <div className="w-9 h-9 rounded-xl bg-slate-950 text-white border border-slate-900 flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="block text-sm sm:text-base font-bold text-slate-900 leading-tight">
                    4 Pilar
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">
                    LEGISLASI · AUDIT · ANGGARAN · ADVOKASI
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ── 3 NUMBERED CARDS (01, 02, 03) IDENTIK RYNERTIA ──── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mt-10 pt-4 sm:mt-16 sm:pt-6">
          {featureCards.map(({ num, icon: Icon, title, desc, badges, link, cta }) => (
            <div 
              key={num} 
              className="relative bg-white/95 backdrop-blur-xl border border-slate-200/80 border-t-2 border-t-red-600 p-6 sm:p-7 rounded-2xl shadow-lg shadow-slate-900/5 hover:shadow-2xl hover:border-red-300 hover:-translate-y-2 transition-all duration-300 h-full flex flex-col group"
            >
              <span className="absolute top-5 right-6 text-4xl font-extrabold text-red-600 select-none pointer-events-none tracking-tight" aria-hidden="true">
                {num}
              </span>
              <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 mb-4 group-hover:scale-105 group-hover:bg-red-600 group-hover:text-white transition-all duration-300 shadow-sm">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-red-600 transition-colors">
                {title}
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed mb-4">
                {desc}
              </p>
              <div className="flex flex-wrap gap-2 mb-5 mt-auto pt-3">
                {badges.map((b, i) => (
                  <span key={i} className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold border ${b.cls}`}>
                    {b.label}
                  </span>
                ))}
              </div>
              <Link
                to={link}
                className="inline-flex items-center justify-between w-full pt-3 border-t border-slate-100 text-xs font-bold text-red-600 hover:text-red-700 group/cta transition-all duration-200"
              >
                <span>{cta}</span>
                <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center text-red-600 group-hover/cta:bg-red-600 group-hover/cta:text-white transition-all duration-200">
                  <ArrowRight className="w-3.5 h-3.5 group-hover/cta:translate-x-0.5 transition-transform duration-200" />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROFIL ORMAWA FASILKOM UMB ─────────────────────────── */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Keluarga Besar Mahasiswa FASILKOM UMB
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Organisasi Mahasiswa yang Diawasi
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-sm">
            Empat lembaga kemahasiswaan aktif di lingkungan Fakultas Ilmu Komputer Universitas Mercu Buana.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {ormawas.map((o) => {
            const oProkers = prokers.filter(p => p.ormawaId === o.id);
            const oAudited = oProkers.filter(p => p.lpj?.auditScore);
            const oAvg = oAudited.length > 0
              ? Math.round(oAudited.reduce((acc, p) => acc + p.lpj.auditScore, 0) / oAudited.length)
              : null;
            const pct = o.paguAnggaran > 0 ? Math.round((o.serapanAnggaran / o.paguAnggaran) * 100) : 0;

            return (
              <div 
                key={o.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 p-1 flex items-center justify-center shadow-2xs">
                      <img src={o.logo} alt={o.name} className="w-full h-full object-contain" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200/70">
                      {o.id === 'dpm' || o.type?.toLowerCase().includes('legislatif') ? 'Lembaga Legislatif' : 'Lembaga Eksekutif'}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm leading-snug">
                      {o.name}
                    </h3>
                    <p className="text-xs text-red-600 font-bold mt-0.5">
                      {o.shortName}
                    </p>
                  </div>

                  {o.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {o.description}
                    </p>
                  )}
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Program Kerja:</span>
                    <strong className="text-slate-900 font-bold">{oProkers.length} Kegiatan</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Serapan Kas:</span>
                    <strong className="text-slate-900 font-bold">{pct}% ({formatRupiah(o.serapanAnggaran)})</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Indeks Audit:</span>
                    <span className="font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-md">
                      {oAvg !== null ? `${oAvg}/100` : 'Belum Dinilai'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── VISI & MISI DPM FASILKOM ───────────────────────────── */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200/80 shadow-soft">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Kolom Kiri: Visi Utama */}
          <div className="lg:col-span-5 space-y-10">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 border border-red-200/60 px-3 py-1 rounded-full">
              Landasan Filosofis
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              Visi &amp; Misi DPM FASILKOM UMB
            </h2>
          
            <div className="p-5 sm:p-6 rounded-2xl bg-red-50/60 border border-red-100 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium shadow-2xs">
              <span className="block text-[11px] font-extrabold uppercase tracking-wider text-red-600 mb-2">
                Visi
              </span>
              "Mewujudkan DPM FASILKOM UMB yang berintegritas dan profesional dalam menjalankan tupoksi, untuk menjadi pilar pengawasan serta penjamin kinerja ormawa FASILKOM secara objektif."
            </div>
          </div>

          {/* Kolom Kanan: 3 Misi Utama */}
          <div className="lg:col-span-7 space-y-3.5">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Pilar Misi Parlemen
              </span>
              <span className="text-xs font-semibold text-slate-400">
                3 Misi Utama
              </span>
            </div>
            
            {misiItems.map(({ num, badgeCls, hoverCls, title, desc }) => (
              <div 
                key={num} 
                className={`p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-start gap-4 ${hoverCls} hover:bg-slate-50 transition-all duration-200`}
              >
                <div className={`w-9 h-9 rounded-xl ${badgeCls} flex items-center justify-center font-extrabold text-xs shrink-0 mt-0.5`}>
                  {num}
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                    {title}
                  </h4>
                  <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

    </div>
  );
}
