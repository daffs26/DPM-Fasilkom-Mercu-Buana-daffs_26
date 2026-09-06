import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, AlertOctagon, Menu, ChevronDown, X } from 'lucide-react';

export default function Header({ onOpenAddProker, onOpenIssueSP, onToggleSidebar }) {
  const { 
    ormawas, 
    selectedOrmawaFilter, 
    setSelectedOrmawaFilter,
    searchQuery,
    setSearchQuery,
    prokers,
    activeTab
  } = useStore();

  const [isOrmawaDropdownOpen, setIsOrmawaDropdownOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  const overdueCount = prokers.filter(p => p.status === 'lpj_overdue').length;
  const activeOrmawa = ormawas.find(o => o.id === selectedOrmawaFilter);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOrmawaDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const mobileInputRef = useRef(null);

  const handleCloseSearch = () => {
    setSearchQuery('');
    setIsSearchFocused(false);
    if (mobileInputRef.current) {
      mobileInputRef.current.blur();
    }
  };

  // Saran pencarian prediktif: hanya muncul saat ada kata yang diketik pengguna di keyboard
  const predictiveSuggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    // Jika user belum mengetik apapun, jangan tampilkan saran
    if (!q) {
      return [];
    }

    // Korpus kosa kata & frasa dari proker, ormawa, dan dokumen resmi
    const corpus = [
      'Proposal Kegiatan',
      'Laporan Pertanggungjawaban (LPJ)',
      'Sidang Umum Mahasiswa',
      'Surat Peringatan (SP)',
      'Surat Izin Dispensasi',
      'Proposal Sponsor & Kerjasama',
      'Surat Izin Peminjaman Ruangan',
      'Audit LPJ Ormawa',
      'Review Proposal DPM',
      'Rancangan Anggaran Biaya (RAB)',
      'Alokasi Anggaran Ormawa',
      'Serapan Dana Kemahasiswaan',
      'Rundown Acara',
      'Seminar Nasional',
      'Workshop Teknologi',
      'Malam Keakraban (Makrab)',
      'Latihan Kepemimpinan (LKMM-TD)',
      'Tech Fair & Expo',
      'Musyawarah Besar',
      'Bakti Sosial',
      'Webinar Fasilkom'
    ];

    // Tambahkan nama & singkatan Ormawa
    ormawas.forEach(o => {
      if (o.shortName && !corpus.includes(o.shortName)) corpus.push(o.shortName);
      if (o.name && !corpus.includes(o.name)) corpus.push(o.name);
    });

    // Tambahkan judul proker, divisi, dan PIC
    prokers.forEach(p => {
      if (p.title && !corpus.includes(p.title)) corpus.push(p.title);
      if (p.divisi && !corpus.includes(p.divisi)) corpus.push(p.divisi);
      if (p.pic && !corpus.includes(p.pic)) corpus.push(p.pic);
    });

    // Prediksi bertingkat:
    // 1. Frasa yang diawali tepat dengan huruf yang diketik (Prefix match)
    // 2. Frasa yang memiliki kata yang diawali dengan huruf yang diketik (Word-level prefix)
    // 3. Frasa yang mengandung substring
    const exactPrefix = [];
    const wordPrefix = [];
    const contains = [];

    corpus.forEach(item => {
      const itemLower = item.toLowerCase();
      if (itemLower.startsWith(q)) {
        exactPrefix.push(item);
      } else {
        const words = itemLower.split(/[\s\-_\/()]+/);
        if (words.some(w => w.startsWith(q))) {
          wordPrefix.push(item);
        } else if (itemLower.includes(q)) {
          contains.push(item);
        }
      }
    });

    const combined = [...exactPrefix, ...wordPrefix, ...contains];
    return combined.slice(0, 5);
  }, [searchQuery, prokers, ormawas]);

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-20 px-3 sm:px-6 lg:px-8 py-3 sm:py-3.5">
      {/* ========================================================================= */}
      {/* 1. MOBILE HEADER (< lg) — Bertingkat Sesuai Permintaan User             */}
      {/* ========================================================================= */}
      <div className="lg:hidden space-y-2.5">
        {/* Baris 1: Hamburger Menu + DPM FASILKOM + Dropdown Pemilih Ormawa */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition shrink-0 -ml-1"
              aria-label="Toggle navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-extrabold text-slate-900 tracking-normal">
              DPM FASILKOM
            </h2>
          </div>

          {/* Fitur Pemilih Ormawa Dropdown Khusus Mobile */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsOrmawaDropdownOpen(prev => !prev)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/90 text-xs font-bold text-slate-800 shadow-2xs transition"
            >
              {activeOrmawa ? (
                <div className="flex items-center gap-1.5">
                  <img src={activeOrmawa.logo} alt={activeOrmawa.shortName} className="w-3.5 h-3.5 object-contain" />
                  <span>{activeOrmawa.shortName}</span>
                </div>
              ) : (
                <span>Semua Ormawa</span>
              )}
              <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-1.5 py-0.2 rounded-full">
                {selectedOrmawaFilter === 'all' ? prokers.length : prokers.filter(p => p.ormawaId === selectedOrmawaFilter).length}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${isOrmawaDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu Ormawa */}
            {isOrmawaDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                <p className="px-2.5 py-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Filter Ormawa
                </p>
                <button
                  type="button"
                  onClick={() => { setSelectedOrmawaFilter('all'); setIsOrmawaDropdownOpen(false); }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition ${
                    selectedOrmawaFilter === 'all'
                      ? 'bg-blue-50 text-blue-700 shadow-2xs'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>Semua Ormawa</span>
                  <span className="text-[10px] bg-slate-100 px-1.5 py-0.2 rounded-full font-bold text-slate-600">
                    {prokers.length}
                  </span>
                </button>

                {ormawas.map(o => {
                  const getOrmawaMobileStyle = (id) => {
                    switch (id) {
                      case 'dpm': return 'bg-slate-900 text-white';
                      case 'bem': return 'bg-sky-500 text-white';
                      case 'himti': return 'bg-blue-900 text-white';
                      case 'himsisfo': return 'bg-[#9A7B56] text-white';
                      default: return 'bg-blue-600 text-white';
                    }
                  };
                  const isSelected = selectedOrmawaFilter === o.id;
                  return (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => { setSelectedOrmawaFilter(o.id); setIsOrmawaDropdownOpen(false); }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition ${
                        isSelected
                          ? `${getOrmawaMobileStyle(o.id)} shadow-2xs`
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md bg-white p-0.5 flex items-center justify-center shrink-0 shadow-2xs">
                          <img src={o.logo} alt={o.shortName} className="w-full h-full object-contain" />
                        </div>
                        <span>{o.shortName}</span>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isSelected ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {prokers.filter(p => p.ormawaId === o.id).length}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Baris 2: Search Bar Membawahi DPM FASILKOM (Desain Gambar Referensi 1) */}
        <div className="relative" ref={searchRef}>
          <div className="relative flex items-center rounded-full bg-slate-50 hover:bg-slate-100/80 focus-within:bg-white border border-slate-200/90 shadow-2xs focus-within:shadow-md focus-within:border-slate-300 transition-all duration-200">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={mobileInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  handleCloseSearch();
                }
              }}
              placeholder="Cari nama proker, divisi, atau berkas..."
              className="w-full pl-9 pr-9 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent rounded-full"
            />
            {/* Fitur X di pojok kanan placeholder untuk menutup dan membersihkan search bar */}
            <button
              type="button"
              onClick={handleCloseSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 active:bg-slate-300 rounded-full transition-colors flex items-center justify-center"
              aria-label="Tutup dan bersihkan pencarian"
              title="Tutup pencarian"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Dropdown Prediksi Kata & Saran Pencarian — Hanya muncul saat user mengetik kata di keyboard */}
          {isSearchFocused && searchQuery.trim().length > 0 && predictiveSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200/90 rounded-2xl shadow-xl z-50 overflow-hidden py-1.5 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3.5 py-1 flex items-center justify-between border-b border-slate-100/80 mb-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Prediksi Kata &amp; Saran
                </span>
                <span className="text-[10px] text-blue-600 font-medium">
                  {predictiveSuggestions.length} saran
                </span>
              </div>
              {predictiveSuggestions.map((item, idx) => {
                const q = searchQuery.trim().toLowerCase();
                const matchIndex = item.toLowerCase().indexOf(q);

                return (
                  <button
                    key={idx}
                    type="button"
                    onMouseDown={() => {
                      setSearchQuery(item);
                      setIsSearchFocused(false);
                    }}
                    className="w-full px-3.5 py-2 flex items-center gap-2.5 text-left text-xs text-slate-700 hover:bg-slate-50 transition group"
                  >
                    <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0 transition-colors" />
                    <span className="truncate">
                      {matchIndex !== -1 ? (
                        <>
                          {item.substring(0, matchIndex)}
                          <strong className="font-extrabold text-blue-600">
                            {item.substring(matchIndex, matchIndex + q.length)}
                          </strong>
                          {item.substring(matchIndex + q.length)}
                        </>
                      ) : (
                        item
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Baris 3: Cetak SP & Tombol + Buat Proker (Hanya tampil di Dashboard Komando pada layar mobile) */}
        {activeTab === 'dashboard' && (
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenIssueSP}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 transition shadow-2xs"
              title="Terbitkan Surat Peringatan DPM"
            >
              <AlertOctagon className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>Cetak SP</span>
              {overdueCount > 0 && (
                <span className="bg-rose-600 text-white text-[9px] px-1.5 py-0.2 rounded-full font-extrabold">
                  {overdueCount}
                </span>
              )}
            </button>

            <Button
              onClick={onOpenAddProker}
              size="sm"
              className="flex-1 rounded-xl flex items-center justify-center gap-1.5 py-2 text-xs font-bold shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span>Buat Proker</span>
            </Button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. DESKTOP HEADER (hidden on mobile, visible on lg+) — 100% UNTOUCHED     */}
      {/* ========================================================================= */}
      <div className="hidden lg:block">
        <div className="flex items-center justify-between gap-3">
          {/* Title & Welcome — original desktop layout */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-extrabold text-slate-900 tracking-normal truncate">
                Sistem Pengawasan DPM FASILKOM
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Portal audit &amp; akuntabilitas kepanitiaan ormawa Fakultas Ilmu Komputer UMB
            </p>
          </div>

          {/* Global Search & Action Buttons — original desktop layout */}
          <div className="flex items-center gap-2.5">
            {/* Search Box */}
            <div className="relative w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder=""
                className="rounded-full pl-9 pr-4 py-2 text-xs bg-slate-50 hover:bg-slate-100/70 focus-visible:bg-white"
              />
            </div>

            {/* Issue SP Button */}
            <button
              onClick={onOpenIssueSP}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 transition shadow-2xs shrink-0"
              title="Terbitkan Surat Peringatan DPM"
            >
              <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
              <span>Cetak SP</span>
              {overdueCount > 0 && (
                <span className="bg-rose-600 text-white text-[9px] px-1.5 py-0.2 rounded-full font-extrabold">
                  {overdueCount}
                </span>
              )}
            </button>

            {/* Primary Action: Tambah Proker Button */}
            <Button
              onClick={onOpenAddProker}
              size="sm"
              className="rounded-xl flex items-center gap-1.5 shrink-0 px-4"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Proker</span>
            </Button>
          </div>
        </div>

        {/* Ormawa Quick Filter Tabs - Clean, Spaced, and Distinct */}
        <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-100 overflow-x-auto pb-0.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
            Ormawa:
          </span>

          {/* Semua Tab */}
          <button
            onClick={() => setSelectedOrmawaFilter('all')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition shrink-0 border ${
              selectedOrmawaFilter === 'all'
                ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span>Semua Ormawa</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              selectedOrmawaFilter === 'all' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {prokers.length}
            </span>
          </button>

          {/* DPM */}
          <button
            onClick={() => setSelectedOrmawaFilter('dpm')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition shrink-0 border ${
              selectedOrmawaFilter === 'dpm'
                ? 'bg-slate-900 border-slate-900 text-white shadow-xs ring-2 ring-slate-900/15'
                : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-slate-900 shrink-0" />
            <img src="/logos/logo-dpm.png" alt="DPM" className="w-4 h-4 object-contain shrink-0" />
            <span>DPM</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              selectedOrmawaFilter === 'dpm' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {prokers.filter(p => p.ormawaId === 'dpm').length}
            </span>
          </button>

          {/* BEM */}
          <button
            onClick={() => setSelectedOrmawaFilter('bem')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition shrink-0 border ${
              selectedOrmawaFilter === 'bem'
                ? 'bg-sky-500 border-sky-500 text-white shadow-xs ring-2 ring-sky-400/20'
                : 'bg-white border-sky-200 text-sky-900 hover:bg-sky-50/60'
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />
            <img src="/logos/logo-bem.png" alt="BEM" className="w-4 h-4 object-contain shrink-0" />
            <span>BEM</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              selectedOrmawaFilter === 'bem' ? 'bg-sky-600 text-white' : 'bg-sky-100 text-sky-800'
            }`}>
              {prokers.filter(p => p.ormawaId === 'bem').length}
            </span>
          </button>

          {/* HIMTI */}
          <button
            onClick={() => setSelectedOrmawaFilter('himti')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition shrink-0 border ${
              selectedOrmawaFilter === 'himti'
                ? 'bg-blue-900 border-blue-900 text-white shadow-xs ring-2 ring-blue-900/20'
                : 'bg-white border-blue-200 text-blue-950 hover:bg-blue-50/60'
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-blue-900 shrink-0" />
            <img src="/logos/logo-himti.png" alt="HIMTI" className="w-4 h-4 object-contain shrink-0" />
            <span>HIMTI</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              selectedOrmawaFilter === 'himti' ? 'bg-blue-950 text-white' : 'bg-blue-100 text-blue-950'
            }`}>
              {prokers.filter(p => p.ormawaId === 'himti').length}
            </span>
          </button>

          {/* HIMSISFO */}
          <button
            onClick={() => setSelectedOrmawaFilter('himsisfo')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition shrink-0 border ${
              selectedOrmawaFilter === 'himsisfo'
                ? 'bg-[#9A7B56] border-[#9A7B56] text-white shadow-xs ring-2 ring-[#9A7B56]/20'
                : 'bg-white border-[#E8DEC8] text-[#785E43] hover:bg-[#FBF9F5]'
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-[#9A7B56] shrink-0" />
            <img src="/logos/logo-himsisfo.png" alt="HIMSISFO" className="w-4 h-4 object-contain shrink-0" />
            <span>HIMSISFO</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              selectedOrmawaFilter === 'himsisfo' ? 'bg-[#785E43] text-white' : 'bg-[#F2ECE1] text-[#785E43]'
            }`}>
              {prokers.filter(p => p.ormawaId === 'himsisfo').length}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
