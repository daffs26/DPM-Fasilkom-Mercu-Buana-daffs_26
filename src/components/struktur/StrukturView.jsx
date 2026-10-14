import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { 
  Network, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  User,
  Scale,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  FileText,
  Wallet,
  Coins,
  Megaphone
} from 'lucide-react';
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
      circle: 'bg-red-50 border-2 border-dashed border-red-500 text-red-600 ring-4 ring-white shadow-xs',
      bottomBorder: 'border-b-4 border-b-red-600',
      hoverText: 'group-hover:text-red-600',
      hoverBorder: 'hover:border-red-400',
      roleText: 'text-red-600 font-bold'
    },
    lead: {
      circle: 'bg-red-50 border-2 border-dashed border-red-500 text-red-600 ring-4 ring-white shadow-xs',
      bottomBorder: 'border-b-4 border-b-red-600',
      hoverText: 'group-hover:text-red-600',
      hoverBorder: 'hover:border-red-400',
      roleText: 'text-red-600 font-semibold'
    },
    member: {
      circle: 'bg-slate-50 border-2 border-dashed border-slate-300 text-slate-500 ring-4 ring-white shadow-xs',
      bottomBorder: 'border-b-4 border-b-slate-400',
      hoverText: 'group-hover:text-red-600',
      hoverBorder: 'hover:border-red-300',
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
      {/* Floating Circle Border Placement Placeholder on Top Edge */}
      <div 
        style={{ top: `${circleTop}px` }}
        className={`absolute left-1/2 -translate-x-1/2 ${circleSizeClass} rounded-full ${style.circle} flex items-center justify-center overflow-hidden z-10`}
      >
        <User className={isPrimary ? "w-5 h-5" : "w-4 h-4"} />
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

const ROLE_ICONS = {
  pimpinan: ShieldCheck,
  sekretaris: FileText,
  bendahara: Wallet,
  pengawasan: CheckCircle2,
  keuangan: Coins,
  advokasi: Scale,
  kominfo: Megaphone
};

function KomisiColumn({ komisi, onSelect }) {
  if (!komisi?.lead) return null;
  return (
    <div className="flex flex-col items-center pt-3">
      <InfographicNode 
        member={komisi.lead} 
        onClick={onSelect} 
        variant="lead"
      />
      <div className="w-0.5 h-6 bg-red-300 relative" />
      <div className="pt-3 flex flex-col items-center w-full">
        <InfographicNode 
          member={komisi.members[0]} 
          onClick={onSelect} 
          variant="member"
        />
        {komisi.members[1] && (
          <>
            <div className="w-0.5 h-6 bg-red-300 relative" />
            <div className="pt-3 flex flex-col items-center w-full">
              <InfographicNode 
                member={komisi.members[1]} 
                onClick={onSelect} 
                variant="member"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * RoleCard - Kartu Tupoksi Ringkas, Proporsional & Bebas Slop
 */
function RoleCard({ item }) {
  const Icon = ROLE_ICONS[item.id] || ShieldCheck;

  return (
    <div className="bg-slate-50/70 hover:bg-white rounded-2xl border border-slate-200/80 hover:border-red-300 p-5 transition-all duration-200 hover:shadow-xs flex flex-col justify-between space-y-3.5">
      <div className="space-y-2.5">
        {/* Header: Icon + Title & Clean Tag */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
            <Icon className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-slate-900 leading-snug">
              {item.role}
            </h4>
            <span className="text-[11px] font-medium text-red-600 block mt-0.5">
              {item.tag}
            </span>
          </div>
        </div>

        {/* Short Scope Summary */}
        <p className="text-xs text-slate-500 leading-relaxed min-h-[36px]">
          {item.deskripsi}
        </p>

        {/* 3 Actionable Bullet Points */}
        <ul className="space-y-1.5 pt-2 border-t border-slate-200/60">
          {item.responsibilities.map((resp, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0" />
              <span>{resp}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function StrukturView() {
  const [viewMode, setViewMode] = useState('chart'); // 'chart' | 'grid'
  const [activeCategory, setActiveCategory] = useState('all');
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
  const sekretaris2 = useMemo(() => structuralMembers.find(m => m.id === 'sekretaris-2'), []);
  const bendahara = useMemo(() => structuralMembers.find(m => m.id === 'bendahara'), []);

  const komisiList = useMemo(() => [
    {
      lead: structuralMembers.find(m => m.id === 'keu-lead'),
      members: structuralMembers.filter(m => m.category === 'keuangan' && !m.isLead)
    },
    {
      lead: structuralMembers.find(m => m.id === 'was-lead'),
      members: structuralMembers.filter(m => m.category === 'pengawasan' && !m.isLead)
    },
    {
      lead: structuralMembers.find(m => m.id === 'kom-lead'),
      members: structuralMembers.filter(m => m.category === 'kominfo' && !m.isLead)
    },
    {
      lead: structuralMembers.find(m => m.id === 'adv-lead'),
      members: structuralMembers.filter(m => m.category === 'advokasi' && !m.isLead)
    }
  ], []);

  // Filtered members for Grid view
  const filteredGridMembers = useMemo(() => {
    return structuralMembers.filter(member => {
      return activeCategory === 'all' || member.category === activeCategory;
    });
  }, [activeCategory]);

  // Fit scale calculation for 0 scrollbar viewing (fits 1080px chart into viewport width)
  const calculateFitScale = useCallback(() => {
    if (!canvasContainerRef.current) return 1;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    if (isMobile) {
      // On mobile handphones, keep scale legible at 0.75 and enable smooth horizontal pan
      return 0.75;
    }
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
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      {/* ── HEADER BANNER ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-soft relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-1.5 sm:space-y-2 max-w-2xl">
            <h1 className="text-xl xs:text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Struktur Organisasi &amp; Tata Kelola
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
              Tim Struktural Organisasi Mahasiswa DPM FASILKOM UMB Periode 2026/2027.
            </p>
          </div>

          {/* View Switcher Toggle (Full width on mobile, auto on desktop) */}
          <div className="w-full md:w-auto grid grid-cols-2 md:flex items-center gap-1.5 sm:gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/70 shrink-0 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('chart')}
              className={`min-h-[40px] px-3 sm:px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                viewMode === 'chart'
                  ? 'bg-white text-red-700 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Network className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Bagan Infografis</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`min-h-[40px] px-3 sm:px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-red-700 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Direktori Profil ({structuralMembers.length})</span>
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
            <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200/60 bg-white/70 backdrop-blur-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900">
                    Bagan Struktur Organisasi
                  </h3>
                </div>
                <p className="text-xs font-medium text-slate-500">
                  Dewan Perwakilan Mahasiswa FASILKOM UMB • Periode 2026/2027
                </p>
                <div className="w-16 h-0.5 bg-red-600 rounded-full mt-1.5" />
              </div>

              {/* Canvas Zoom & Fit Controls (Thumb-friendly touch targets) */}
              <div className="flex items-center gap-1 bg-white border border-slate-200/80 rounded-xl p-1 shadow-2xs self-start sm:self-auto flex-wrap">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="min-w-[36px] min-h-[36px] flex items-center justify-center hover:bg-slate-100 rounded-lg text-slate-600 transition cursor-pointer active:scale-95"
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
                  className="min-w-[36px] min-h-[36px] flex items-center justify-center hover:bg-slate-100 rounded-lg text-slate-600 transition cursor-pointer active:scale-95"
                  title="Perbesar Bagan"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                
                {/* Fit to Screen Button (Paskan Keseluruhan ke Layar) */}
                <button
                  type="button"
                  onClick={handleFitToScreen}
                  className={`min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer border-l border-slate-200 ml-0.5 flex items-center gap-1.5 active:scale-95 ${
                    isFitToScreen 
                      ? 'bg-red-50 text-red-700 border border-red-200/80' 
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
                  className="min-w-[36px] min-h-[36px] flex items-center justify-center hover:bg-slate-100 rounded-lg text-slate-500 transition cursor-pointer active:scale-95"
                  title="Reset Ukuran 100%"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Mobile Horizontal Swipe Guidance Hint */}
            <div className="sm:hidden px-4 py-2.5 bg-slate-100/90 border-b border-slate-200/80 text-[11px] text-slate-600 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="text-red-600 font-bold">👉</span>
                <span>Geser horizontal untuk menelusuri 6 divisi</span>
              </span>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className="text-red-700 font-bold hover:underline shrink-0 text-[11px] ml-2"
              >
                Lihat Daftar
              </button>
            </div>

            {/* Diagram Canvas Area (Smooth touch-pan on mobile) */}
            <div className={`p-3 sm:p-8 min-h-[440px] flex items-start ${isFitToScreen ? 'overflow-x-auto sm:overflow-hidden touch-pan-x justify-start sm:justify-center' : 'overflow-x-auto touch-pan-x justify-start sm:justify-center'}`}>
              <div 
                ref={chartContentRef}
                style={{ 
                  zoom: zoomLevel,
                }}
                className="w-[1080px] shrink-0 flex flex-col items-center select-none pt-2 pb-6 transition-all duration-200"
              >
                  
                {/* ── LEVEL 1: KETUA UMUM (PRIMARY RED) ──── */}
                <div className="flex flex-col items-center relative pt-4">
                  <InfographicNode 
                    member={ketum} 
                    onClick={setSelectedMember} 
                    variant="primary"
                  />

                  {/* Vertical Connector Line 1 -> 2 */}
                  <div className="w-0.5 h-7 bg-red-300 relative" />
                </div>

                {/* ── LEVEL 2: WAKIL KETUA UMUM (PRIMARY RED) ─── */}
                <div className="flex flex-col items-center relative w-full pt-4">
                  <InfographicNode 
                    member={waketum} 
                    onClick={setSelectedMember} 
                    variant="primary"
                  />

                  {/* Vertical Connector Line 2 -> Horizontal Distribution Spine */}
                  <div className="w-0.5 h-6 bg-red-300 relative" />

                  {/* ── HORIZONTAL DISTRIBUTION SPINE (LEVEL 3 PARALLEL) ── */}
                  <div className="relative w-full h-6 flex items-center justify-center mb-1">
                    {/* Horizontal connecting bar between Col 1 center (8.333%) and Col 6 center (91.667%) */}
                    <div className="absolute top-0 left-[8.333%] right-[8.333%] h-0.5 bg-red-300" />
                    
                    {/* Center stem from Waketum arriving at the spine */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-red-300" />

                    {/* 6 Downward Vertical Stems to the 6 parallel columns */}
                    <div className="absolute top-0 left-[8.333%] w-0.5 h-3 bg-red-300 -translate-x-1/2" />
                    <div className="absolute top-0 left-[25%] w-0.5 h-3 bg-red-300 -translate-x-1/2" />
                    <div className="absolute top-0 left-[41.667%] w-0.5 h-3 bg-red-300 -translate-x-1/2" />
                    <div className="absolute top-0 left-[58.333%] w-0.5 h-3 bg-red-300 -translate-x-1/2" />
                    <div className="absolute top-0 left-[75%] w-0.5 h-3 bg-red-300 -translate-x-1/2" />
                    <div className="absolute top-0 left-[91.667%] w-0.5 h-3 bg-red-300 -translate-x-1/2" />
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
                    {sekretaris2 && (
                      <>
                        <div className="w-0.5 h-6 bg-red-300 relative" />
                        <div className="pt-3 flex flex-col items-center w-full">
                          <InfographicNode 
                            member={sekretaris2} 
                            onClick={setSelectedMember} 
                            variant="member"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* COLUMNS 2 - 5: KOMISI-KOMISI */}
                  {komisiList.map((komisi, idx) => (
                    <KomisiColumn 
                      key={idx} 
                      komisi={komisi} 
                      onSelect={setSelectedMember} 
                    />
                  ))}

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
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200/90 p-1 flex items-center justify-center shadow-2xs shrink-0">
                  <img src="/logos/logo-dpm.png" alt="Logo DPM Fasilkom UMB" className="w-full h-full object-contain" />
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

            
            </div>

          </div>
        </div>
      )}

      {/* ── VIEW 2: PROFILE CARDS DIRECTORY (RYNERTIA STYLE) ─────────── */}
      {viewMode === 'grid' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Category Filter Pills - Responsive & Accessible (No Horizontal Scroll) */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {structuralCategories.map((cat) => {
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                    isActive
                      ? 'bg-red-600 text-white font-semibold shadow-xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/80 shadow-2xs font-medium'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Members Portrait Grid */}
          {filteredGridMembers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredGridMembers.map((member) => (
                <div
                  key={member.id}
                  onClick={() => setSelectedMember(member)}
                  className="group bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center"
                >
                  {/* Centered Circular Border Placement Avatar */}
                  <div className="flex justify-center mb-4">
                    <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full border-2 border-dashed border-slate-300 group-hover:border-red-500 bg-slate-50/80 group-hover:bg-red-50/40 flex items-center justify-center text-slate-400 group-hover:text-red-600 transition-all shadow-xs shrink-0">
                      <User className="w-8 h-8" />
                    </div>
                  </div>

                  {/* Identity: Name & Subtitle */}
                  <div className="space-y-1.5 w-full">
                    <h4 
                      className="text-base font-bold text-slate-900 group-hover:text-red-700 transition-colors leading-snug truncate"
                      title={member.name}
                    >
                      {member.name}
                    </h4>
                    <p 
                      className="text-xs text-slate-500 font-normal leading-relaxed max-w-[220px] mx-auto line-clamp-2"
                      title={`${member.role} • ${member.prodi}`}
                    >
                      {member.role} • {member.prodi}
                    </p>
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Wewenang & Tugas Pokok
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Pembagian peran, tanggung jawab, dan standar fungsi kerja DPM FASILKOM UMB.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <Scale className="w-4 h-4 text-red-600" />
            <span>Tata Kelola Parlemen</span>
          </div>
        </div>

        {/* 1. Pimpinan & Badan Pengurus Harian (3 Kolom Seimbang) */}
        <div className="space-y-3">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Pimpinan & Badan Pengurus Harian
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {structuralRoleMatrix.filter(m => m.group === 'bph').map((item) => (
              <RoleCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* 2. Komisi Parlemen (4 Kolom Seimbang) */}
        <div className="space-y-3 pt-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Komisi Parlemen
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {structuralRoleMatrix.filter(m => m.group === 'komisi').map((item) => (
              <RoleCard key={item.id} item={item} />
            ))}
          </div>
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
