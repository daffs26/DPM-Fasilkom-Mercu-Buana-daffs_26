import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { 
  Network, 
  Users, 
  Search, 
  ArrowUpRight, 
  ShieldCheck, 
  CheckCircle2, 
  User,
  Scale,
  Award,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import DetailAnggotaModal from './DetailAnggotaModal';
import { 
  structuralMembers, 
  structuralCategories, 
  structuralRoleMatrix 
} from '@/data/structuralData';

/**
 * Infographic Node Card sesuai konsep template infografis
 * - Lingkaran avatar mengambang di tepi atas (floating circle)
 * - Card putih bersih dengan aksen garis bawah berwarna (accent bottom border)
 * - Typography rapi (Nama bold, Jabatan subtitle, NIM)
 */
function InfographicNode({ 
  member, 
  onClick, 
  variant = 'lead', // 'primary' | 'lead' | 'member'
  className = '',
  widthClass = ''
}) {
  if (!member) return null;

  const isPrimary = variant === 'primary';
  const defaultWidth = isPrimary ? 'w-56 sm:w-60' : 'w-full';
  const effectiveWidth = widthClass || defaultWidth;

  const colorStyles = {
    primary: {
      circle: 'bg-blue-600 ring-4 ring-white shadow-md',
      bottomBorder: 'border-b-4 border-b-blue-600',
      hoverText: 'group-hover:text-blue-600',
      hoverBorder: 'hover:border-blue-400',
      roleText: 'text-blue-600 font-bold'
    },
    lead: {
      circle: 'bg-blue-600 ring-4 ring-white shadow-md',
      bottomBorder: 'border-b-4 border-b-blue-600',
      hoverText: 'group-hover:text-blue-600',
      hoverBorder: 'hover:border-blue-400',
      roleText: 'text-blue-600 font-semibold'
    },
    member: {
      circle: 'bg-sky-500 ring-4 ring-white shadow-md',
      bottomBorder: 'border-b-4 border-b-sky-400',
      hoverText: 'group-hover:text-blue-600',
      hoverBorder: 'hover:border-blue-300',
      roleText: 'text-slate-500 font-medium'
    }
  };

  const style = colorStyles[variant] || colorStyles.lead;

  // Geometry: avatar circle is half outside the top border, half inside
  // Circle size: primary = 44px (top: -22px), regular = 38px (top: -19px)
  // Card top padding: primary = pt-9 (36px), regular = pt-8 (32px)
  // Clean whitespace between avatar and name: ~13-14px guaranteed!
  const circleSizeClass = isPrimary ? 'w-11 h-11' : 'w-[38px] h-[38px]';
  const circleTop = isPrimary ? -22 : -19;
  const cardPadding = isPrimary ? 'pt-9 pb-4 px-4' : 'pt-8 pb-3.5 px-3';

  return (
    <div 
      onClick={() => onClick(member)}
      className={`group relative ${effectiveWidth} bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer ${cardPadding} text-center ${style.bottomBorder} ${style.hoverBorder} ${className}`}
    >
      {/* Floating Circle Icon/Photo on Top Edge */}
      <div 
        style={{ top: `${circleTop}px` }}
        className={`absolute left-1/2 -translate-x-1/2 ${circleSizeClass} rounded-full ${style.circle} text-white flex items-center justify-center overflow-hidden z-10`}
      >
        {member.image ? (
          <img 
            src={member.image} 
            alt={member.name} 
            className="w-full h-full object-cover object-top" 
          />
        ) : (
          <User className={isPrimary ? "w-5 h-5 text-white" : "w-4 h-4 text-white"} />
        )}
      </div>

      {/* Profile Card Info with Generous Breathing Space */}
      <div className="flex flex-col items-center">
        {/* Name */}
        <h4 
          className={`${isPrimary ? 'text-sm' : 'text-xs'} font-bold text-slate-900 ${style.hoverText} transition-colors truncate max-w-full leading-tight`} 
          title={member.name}
        >
          {member.name}
        </h4>

        {/* Job Position / Role */}
        <p 
          className={`${isPrimary ? 'text-xs' : 'text-[11px]'} ${style.roleText} truncate max-w-full leading-tight mt-1`} 
          title={member.role}
        >
          {member.role}
        </p>
      </div>
    </div>
  );
}

export default function StrukturView() {
  const [viewMode, setViewMode] = useState('chart'); // 'chart' | 'grid'
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);

  // Auto-fit responsive state & canvas refs
  const canvasContainerRef = useRef(null);
  const chartContentRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFitToScreen, setIsFitToScreen] = useState(true);

  // Grouped members for Level 1, Level 2, and Level 3
  const ketum = useMemo(() => structuralMembers.find(m => m.id === 'ketum'), []);
  const waketum = useMemo(() => structuralMembers.find(m => m.id === 'waketum'), []);
  const sekretaris = useMemo(() => structuralMembers.find(m => m.id === 'sekretaris'), []);
  const bendahara = useMemo(() => structuralMembers.find(m => m.id === 'bendahara'), []);

  const komisiKeuangan = useMemo(() => ({
    lead: structuralMembers.find(m => m.id === 'keu-lead'),
    members: structuralMembers.filter(m => m.category === 'keuangan' && !m.isLead)
  }), []);

  const komisiPengawasan = useMemo(() => ({
    lead: structuralMembers.find(m => m.id === 'was-lead'),
    members: structuralMembers.filter(m => m.category === 'pengawasan' && !m.isLead)
  }), []);

  const komisiKominfo = useMemo(() => ({
    lead: structuralMembers.find(m => m.id === 'kom-lead'),
    members: structuralMembers.filter(m => m.category === 'kominfo' && !m.isLead)
  }), []);

  const komisiAdvokasi = useMemo(() => ({
    lead: structuralMembers.find(m => m.id === 'adv-lead'),
    members: structuralMembers.filter(m => m.category === 'advokasi' && !m.isLead)
  }), []);

  // Filtered members for Grid view
  const filteredGridMembers = useMemo(() => {
    return structuralMembers.filter(member => {
      const matchCategory = activeCategory === 'all' || member.category === activeCategory;
      const matchSearch = searchQuery.trim() === '' || 
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.nim.includes(searchQuery.trim()) ||
        member.unit.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  // Fit scale calculation for 0 scrollbar viewing (fits 1080px chart into viewport width)
  const calculateFitScale = useCallback(() => {
    if (!canvasContainerRef.current) return 1;
    const containerWidth = canvasContainerRef.current.clientWidth - 48; // padding buffer
    const baseWidth = 1080;
    if (containerWidth <= 0) return 1;
    return Math.min(1.0, Math.max(0.4, containerWidth / baseWidth));
  }, []);

  const updateFitScale = useCallback(() => {
    if (!isFitToScreen) return;
    const fitScale = calculateFitScale();
    setZoomLevel(Number(fitScale.toFixed(2)));
  }, [isFitToScreen, calculateFitScale]);

  useEffect(() => {
    if (viewMode === 'chart') {
      updateFitScale();
    }
  }, [viewMode, updateFitScale]);

  useEffect(() => {
    if (!canvasContainerRef.current) return;
    const observer = new ResizeObserver(() => {
      if (isFitToScreen && viewMode === 'chart') {
        const fitScale = calculateFitScale();
        setZoomLevel(Number(fitScale.toFixed(2)));
      }
    });
    observer.observe(canvasContainerRef.current);
    return () => observer.disconnect();
  }, [isFitToScreen, viewMode, calculateFitScale]);

  const handleZoomIn = () => {
    setIsFitToScreen(false);
    setZoomLevel(prev => Math.min(Number((prev + 0.1).toFixed(2)), 1.4));
  };
  const handleZoomOut = () => {
    setIsFitToScreen(false);
    setZoomLevel(prev => Math.max(Number((prev - 0.1).toFixed(2)), 0.4));
  };
  const handleZoomReset = () => {
    setIsFitToScreen(false);
    setZoomLevel(1);
  };
  const handleFitToScreen = () => {
    setIsFitToScreen(true);
    const fitScale = calculateFitScale();
    setZoomLevel(Number(fitScale.toFixed(2)));
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* ── HEADER BANNER ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-bold tracking-tight">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>DPM FASILKOM UNIVERSITAS MERCU BUANA</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Struktur Organisasi & Tata Kelola
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
              Bagan alur hierarki komando dan tata kerja Dewan Perwakilan Mahasiswa FASILKOM UMB Periode 2025/2026.
            </p>
          </div>

          {/* View Switcher Toggle */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/70 shrink-0 self-start md:self-auto shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('chart')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                viewMode === 'chart'
                  ? 'bg-white text-blue-700 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Bagan Infografis</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-blue-700 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Direktori Profil ({structuralMembers.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── VIEW 1: ORGANIZATIONAL CHART (INFOGRAPHIC TEMPLATE STYLE) ── */}
      {viewMode === 'chart' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Main Chart Canvas with Light Infographic Background */}
          <div 
            ref={canvasContainerRef}
            className="bg-[#f8fafc] rounded-3xl border border-slate-200/90 shadow-soft relative overflow-hidden"
          >
            
            {/* Infographic Header bar & Zoom controls */}
            <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 bg-white/70 backdrop-blur-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900">
                    Bagan Struktur Organisasi
                  </h3>
                  {isFitToScreen && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200/60">
                      Penuh Layar
                    </span>
                  )}
                </div>
                <p className="text-xs font-medium text-slate-500">
                  Dewan Perwakilan Mahasiswa FASILKOM UMB • Periode 2025/2026
                </p>
                <div className="w-16 h-0.5 bg-blue-600 rounded-full mt-1.5" />
              </div>

              {/* Canvas Zoom & Fit Controls */}
              <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 rounded-xl p-1 shadow-2xs self-start sm:self-auto">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition cursor-pointer"
                  title="Perkecil Bagan"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-bold tabular-nums px-1.5 text-slate-600 min-w-[42px] text-center">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition cursor-pointer"
                  title="Perbesar Bagan"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                
                {/* Fit to Screen Button (Paskan Keseluruhan ke Layar) */}
                <button
                  type="button"
                  onClick={handleFitToScreen}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer border-l border-slate-200 ml-0.5 flex items-center gap-1.5 ${
                    isFitToScreen 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200/80' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                  title="Paskan Keseluruhan Bagan ke Layar (Tanpa Perlu Geser)"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span className="hidden sm:inline">Paskan Layar</span>
                </button>

                <button
                  type="button"
                  onClick={handleZoomReset}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition cursor-pointer"
                  title="Reset Ukuran 100%"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Diagram Canvas Area (No Scrollbar when fit to screen!) */}
            <div className={`p-4 sm:p-8 min-h-[460px] flex justify-center items-start ${isFitToScreen ? 'overflow-hidden' : 'overflow-x-auto'}`}>
              <div 
                ref={chartContentRef}
                style={{ 
                  zoom: zoomLevel,
                }}
                className="w-[1080px] shrink-0 flex flex-col items-center select-none pt-2 pb-6 transition-all duration-200"
              >
                  
                {/* ── LEVEL 1: KETUA UMUM (PRIMARY BLUE) ──── */}
                <div className="flex flex-col items-center relative pt-4">
                  <InfographicNode 
                    member={ketum} 
                    onClick={setSelectedMember} 
                    variant="primary"
                  />

                  {/* Vertical Connector Line 1 -> 2 */}
                  <div className="w-0.5 h-7 bg-blue-300 relative" />
                </div>

                {/* ── LEVEL 2: WAKIL KETUA UMUM (PRIMARY BLUE) ─── */}
                <div className="flex flex-col items-center relative w-full pt-4">
                  <InfographicNode 
                    member={waketum} 
                    onClick={setSelectedMember} 
                    variant="primary"
                  />

                  {/* Vertical Connector Line 2 -> Horizontal Distribution Spine */}
                  <div className="w-0.5 h-6 bg-blue-300 relative" />

                  {/* ── HORIZONTAL DISTRIBUTION SPINE (LEVEL 3 PARALLEL) ── */}
                  <div className="relative w-full h-6 flex items-center justify-center mb-1">
                    {/* Horizontal connecting bar between Col 1 center (8.333%) and Col 6 center (91.667%) */}
                    <div className="absolute top-0 left-[8.333%] right-[8.333%] h-0.5 bg-blue-300" />
                    
                    {/* Center stem from Waketum arriving at the spine */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-blue-300" />

                    {/* 6 Downward Vertical Stems to the 6 parallel columns */}
                    <div className="absolute top-0 left-[8.333%] w-0.5 h-3 bg-blue-300 -translate-x-1/2" />
                    <div className="absolute top-0 left-[25%] w-0.5 h-3 bg-blue-300 -translate-x-1/2" />
                    <div className="absolute top-0 left-[41.667%] w-0.5 h-3 bg-blue-300 -translate-x-1/2" />
                    <div className="absolute top-0 left-[58.333%] w-0.5 h-3 bg-blue-300 -translate-x-1/2" />
                    <div className="absolute top-0 left-[75%] w-0.5 h-3 bg-blue-300 -translate-x-1/2" />
                    <div className="absolute top-0 left-[91.667%] w-0.5 h-3 bg-blue-300 -translate-x-1/2" />
                  </div>
                </div>

                {/* ── LEVEL 3: 6 PARALLEL EQUAL COLUMNS ───────────────── */}
                <div className="grid grid-cols-6 gap-3.5 w-full items-start">
                  
                  {/* COLUMN 1: SEKRETARIS (PALING KIRI) */}
                  <div className="flex flex-col items-center pt-3">
                    <InfographicNode 
                      member={sekretaris} 
                      onClick={setSelectedMember} 
                      variant="lead"
                    />
                  </div>

                  {/* COLUMN 2: KOMISI KEUANGAN */}
                  <div className="flex flex-col items-center pt-3">
                    {/* Kepala Komisi */}
                    <InfographicNode 
                      member={komisiKeuangan.lead} 
                      onClick={setSelectedMember} 
                      variant="lead"
                    />

                    {/* Vertical Connector Line to Members */}
                    <div className="w-0.5 h-6 bg-blue-300 relative" />

                    {/* Anggota Komisi 1 */}
                    <div className="pt-3 flex flex-col items-center w-full">
                      <InfographicNode 
                        member={komisiKeuangan.members[0]} 
                        onClick={setSelectedMember} 
                        variant="member"
                      />

                      {/* Vertical Connector Line to Anggota 2 */}
                      {komisiKeuangan.members[1] && (
                        <>
                          <div className="w-0.5 h-6 bg-blue-300 relative" />
                          <div className="pt-3 flex flex-col items-center w-full">
                            <InfographicNode 
                              member={komisiKeuangan.members[1]} 
                              onClick={setSelectedMember} 
                              variant="member"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* COLUMN 3: KOMISI PENGAWASAN */}
                  <div className="flex flex-col items-center pt-3">
                    {/* Kepala Komisi */}
                    <InfographicNode 
                      member={komisiPengawasan.lead} 
                      onClick={setSelectedMember} 
                      variant="lead"
                    />

                    {/* Vertical Connector Line to Members */}
                    <div className="w-0.5 h-6 bg-blue-300 relative" />

                    {/* Anggota Komisi 1 */}
                    <div className="pt-3 flex flex-col items-center w-full">
                      <InfographicNode 
                        member={komisiPengawasan.members[0]} 
                        onClick={setSelectedMember} 
                        variant="member"
                      />

                      {/* Vertical Connector Line to Anggota 2 */}
                      {komisiPengawasan.members[1] && (
                        <>
                          <div className="w-0.5 h-6 bg-blue-300 relative" />
                          <div className="pt-3 flex flex-col items-center w-full">
                            <InfographicNode 
                              member={komisiPengawasan.members[1]} 
                              onClick={setSelectedMember} 
                              variant="member"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* COLUMN 4: KOMISI KOMINFO */}
                  <div className="flex flex-col items-center pt-3">
                    {/* Kepala Komisi */}
                    <InfographicNode 
                      member={komisiKominfo.lead} 
                      onClick={setSelectedMember} 
                      variant="lead"
                    />

                    {/* Vertical Connector Line to Members */}
                    <div className="w-0.5 h-6 bg-blue-300 relative" />

                    {/* Anggota Komisi 1 */}
                    <div className="pt-3 flex flex-col items-center w-full">
                      <InfographicNode 
                        member={komisiKominfo.members[0]} 
                        onClick={setSelectedMember} 
                        variant="member"
                      />

                      {/* Vertical Connector Line to Anggota 2 */}
                      {komisiKominfo.members[1] && (
                        <>
                          <div className="w-0.5 h-6 bg-blue-300 relative" />
                          <div className="pt-3 flex flex-col items-center w-full">
                            <InfographicNode 
                              member={komisiKominfo.members[1]} 
                              onClick={setSelectedMember} 
                              variant="member"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* COLUMN 5: KOMISI ADVOKASI */}
                  <div className="flex flex-col items-center pt-3">
                    {/* Kepala Komisi */}
                    <InfographicNode 
                      member={komisiAdvokasi.lead} 
                      onClick={setSelectedMember} 
                      variant="lead"
                    />

                    {/* Vertical Connector Line to Members */}
                    <div className="w-0.5 h-6 bg-blue-300 relative" />

                    {/* Anggota Komisi 1 */}
                    <div className="pt-3 flex flex-col items-center w-full">
                      <InfographicNode 
                        member={komisiAdvokasi.members[0]} 
                        onClick={setSelectedMember} 
                        variant="member"
                      />

                      {/* Vertical Connector Line to Anggota 2 */}
                      {komisiAdvokasi.members[1] && (
                        <>
                          <div className="w-0.5 h-6 bg-blue-300 relative" />
                          <div className="pt-3 flex flex-col items-center w-full">
                            <InfographicNode 
                              member={komisiAdvokasi.members[1]} 
                              onClick={setSelectedMember} 
                              variant="member"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* COLUMN 6: BENDAHARA (PALING KANAN) */}
                  <div className="flex flex-col items-center pt-3">
                    <InfographicNode 
                      member={bendahara} 
                      onClick={setSelectedMember} 
                      variant="lead"
                    />
                  </div>

                </div>

              </div>
            </div>

            {/* Infographic Canvas Footer (Branding Bar sesuai template) */}
            <div className="p-6 border-t border-slate-200/60 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                  DPM
                </div>
                <div>
                  <h5 className="font-extrabold text-slate-900 uppercase tracking-tight text-xs">
                    DPM FASILKOM UMB
                  </h5>
                  <p className="text-[10px] text-slate-400">
                    Parlemen & Badan Pengawas Mahasiswa
                  </p>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center gap-4">
                <span>🌐 dpm-fasilkom.vercel.app</span>
                <span>📍 Gedung B, Universitas Mercu Buana</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── VIEW 2: PROFILE CARDS DIRECTORY (RYNERTIA STYLE) ─────────── */}
      {viewMode === 'grid' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Filters & Search Toolbar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-soft flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              {structuralCategories.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeCategory === cat.key
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, NIM, atau jabatan..."
                className="pl-9 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 border-slate-200/80 focus:bg-white"
              />
            </div>
          </div>

          {/* Members Portrait Grid (Arched Style ala Rynertia Tech) */}
          {filteredGridMembers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredGridMembers.map((member) => (
                <div
                  key={member.id}
                  onClick={() => setSelectedMember(member)}
                  className="group block relative overflow-hidden rounded-tl-[40px] rounded-tr-2xl rounded-b-2xl shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer bg-slate-900 h-[380px]"
                >
                  {/* Arched Background Gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-b ${member.cardGradient} opacity-90 transition-opacity duration-300 group-hover:opacity-100`}
                  />

                  {/* Vertical Typography Watermark (Rynertia Signature) */}
                  <span className="absolute top-6 left-3 text-white/10 font-extrabold tracking-widest text-2xl uppercase select-none pointer-events-none [writing-mode:vertical-rl] rotate-180">
                    {member.watermark}
                  </span>

                  {/* Top Right Unit Badge */}
                  <div className="absolute top-4 right-4 z-20">
                    <span
                      className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider backdrop-blur-md border ${member.badgeColor}`}
                    >
                      {member.unit}
                    </span>
                  </div>

                  {/* Member Portrait Image */}
                  <div className="relative h-full w-full flex items-end justify-center overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover object-top filter brightness-[0.97] group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />

                    {/* Bottom Gradient Scrim Overlay */}
                    <div className="absolute inset-x-0 bottom-0 pt-28 pb-6 px-5.5 bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent flex flex-col justify-end text-left z-10">
                      <div className="flex items-end justify-between gap-3">
                        <div className="min-w-0 flex-1 space-y-2">
                          <h3 className="text-sm sm:text-base font-extrabold text-white group-hover:text-blue-200 transition-colors leading-snug drop-shadow-md truncate">
                            {member.name}
                          </h3>
                          <div className="space-y-1.5">
                            <p className="text-xs text-blue-200/90 font-medium tracking-normal line-clamp-1">
                              {member.role}
                            </p>
                            <p className="text-[11px] text-slate-300/80 font-medium">
                              {member.prodi}
                            </p>
                          </div>
                        </div>

                        <div className="w-8.5 h-8.5 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5 shadow-sm">
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-soft">
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-900">Tidak ada anggota yang cocok</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Silakan coba ubah filter kategori komisi atau kata kunci pencarian Anda.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── ROLE RESPONSIBILITY MATRIX (TUPOKSI RESMI) ─────────────────── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold tracking-wider uppercase text-blue-600 block mb-1">
              STANDAR AKUNTABILITAS DPM FASILKOM
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Matriks Wewenang & Tanggung Jawab Komisi
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <Scale className="w-4 h-4 text-blue-600" />
            <span>Landasan Konstitusi Ormawa</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {structuralRoleMatrix.map((matrix, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:border-blue-300 hover:shadow-md transition space-y-3.5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${matrix.badgeColor}`}>
                    {matrix.unit}
                  </span>
                  <Award className="w-4 h-4 text-slate-400" />
                </div>
                
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 tracking-tight">
                    {matrix.role}
                  </h4>
                  {matrix.deskripsi && (
                    <p className="text-xs text-slate-600 leading-relaxed font-normal mt-1">
                      {matrix.deskripsi}
                    </p>
                  )}
                </div>

                {/* Tugas dan Tanggung Jawab */}
                <div className="space-y-1 pt-1 border-t border-slate-200/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Tugas & Tanggung Jawab:
                  </span>
                  <ul className="space-y-1.5">
                    {matrix.responsibilities.map((r, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed font-normal">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Inti Fokus Komisi */}
                {matrix.fokusInti && (
                  <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-100 text-[11px] text-blue-950 font-medium leading-relaxed">
                    <span className="font-extrabold text-blue-700 uppercase tracking-wider block text-[9px] mb-0.5">
                      Intinya:
                    </span>
                    {matrix.fokusInti}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] font-bold text-blue-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Akuntabilitas Resmi DPM UMB</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── DETAIL MEMBER MODAL ────────────────────────────────────────── */}
      <DetailAnggotaModal
        member={selectedMember}
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </div>
  );
}
