import React, { useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { 
  Award, 
  Clock, 
  Users, 
  Coins, 
  FileCheck, 
  Target, 
  ChevronDown, 
  ChevronUp, 
  Printer,
  Search,
  CheckCircle2,
  AlertCircle,
  FileEdit,
  ShieldCheck,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import DropdownSelect from '@/components/ui/dropdown-select';
import { formatDateIndo, formatRupiah } from '@/utils/formatters';

const AUDIT_PARAMETERS = [
  { no: '01', title: 'Kedisiplinan Rundown', bobot: '20 Poin', pct: '20%', desc: 'Ketepatan waktu dan alur rundown sesi di lapangan.', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
  { no: '02', title: 'Capaian Peserta', bobot: '20 Poin', pct: '20%', desc: 'Tingkat kehadiran peserta sesuai target proposal.', icon: Users, color: 'text-sky-600', bg: 'bg-sky-50 border-sky-200' },
  { no: '03', title: 'Efisiensi Anggaran', bobot: '20 Poin', pct: '20%', desc: 'Realisasi sesuai RAB dan kelengkapan bukti nota sah.', icon: Coins, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
  { no: '04', title: 'Kepatuhan SLA Berkas', bobot: '20 Poin', pct: '20%', desc: 'Ketepatan waktu Proposal (H-14) & LPJ (H+14).', icon: FileCheck, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200' },
  { no: '05', title: 'Mutu Output Acara', bobot: '20 Poin', pct: '20%', desc: 'Ketercapaian output nyata dan manfaat kegiatan ormawa.', icon: Target, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200' }
];

function AuditSlaStatus({ p }) {
  if (p.status === 'lpj_overdue') {
    return <span className="text-rose-600 font-extrabold text-[11px] inline-flex items-center gap-1">🔴 Melampaui Batas (&gt; H+14)</span>;
  }
  if (p.lpj?.fileName) {
    return <span className="text-emerald-600 font-bold text-[11px] inline-flex items-center gap-1">✓ Tepat Waktu</span>;
  }
  return <span className="text-slate-500 text-[11px]">Tenggat: {p.lpj?.deadlineDate || 'H+14'}</span>;
}

function AuditScoreBadge({ audit }) {
  if (!audit) {
    return (
      <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200/70 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        <span>Menunggu Audit</span>
      </span>
    );
  }

  let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (audit.predikat === 'B') badgeColor = 'bg-blue-50 text-blue-700 border-blue-200';
  if (audit.predikat === 'C') badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
  if (audit.predikat === 'D') badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-black text-slate-900 tabular-nums">{audit.totalScore}</span>
      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${badgeColor}`}>
        Predikat {audit.predikat}
      </span>
    </div>
  );
}

const AuditParameterStandards = React.memo(function AuditParameterStandards() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-soft w-full max-w-full overflow-hidden transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs border border-blue-200/60">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                5 Pilar Penilaian Mutu Kegiatan
              </h3>
              <span className="hidden sm:inline-flex text-[10px] font-extrabold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                Skor 0 - 100
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Standar baku evaluasi akuntabilitas &amp; mutu LPJ regulasi DPM Fasilkom
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200/80 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer min-h-[36px]"
            title={isExpanded ? 'Ringkas Tampilan Parameter' : 'Tampilkan Detail 5 Parameter'}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                <span>Ringkas</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                <span>Detail Parameter</span>
              </>
            )}
          </button>
        </div>
      </div>

      {!isExpanded ? (
        <div className="pt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            {AUDIT_PARAMETERS.map((param) => {
              const Icon = param.icon;
              return (
                <div 
                  key={param.no} 
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700 text-[11px] font-semibold"
                >
                  <Icon className={`w-3.5 h-3.5 ${param.color}`} />
                  <span>{param.title}</span>
                  <span className="text-[9px] px-1 py-0.2 bg-white border border-slate-200 rounded font-mono text-slate-500">
                    {param.pct}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="text-[11px] font-extrabold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-xl flex items-center gap-1">
            <span>Total: 100 Poin</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-3.5">
          {AUDIT_PARAMETERS.map((param) => {
            const Icon = param.icon;
            return (
              <div 
                key={param.no} 
                className="p-3.5 bg-slate-50/70 hover:bg-white rounded-2xl border border-slate-200/80 hover:border-blue-200 flex flex-col justify-between transition-all duration-200 hover:shadow-2xs group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center border ${param.bg} ${param.color} shadow-2xs`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[10px] font-extrabold bg-white border border-slate-200 text-slate-800 px-2 py-0.5 rounded-full shadow-2xs">
                      {param.bobot}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-xs mb-1 group-hover:text-blue-600 transition">
                    {param.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {param.desc}
                  </p>
                </div>
                <div className="pt-2 mt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Pilar {param.no}</span>
                  <span className="font-bold text-slate-600">Bobot {param.pct}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});

const AuditOrmawaReport = React.memo(function AuditOrmawaReport({ ormawas, prokers, currentUser }) {
  const isGuest = currentUser?.role === 'guest';
  const isDpm = currentUser?.ormawaId === 'dpm' && !isGuest;
  const canViewAll = isDpm || isGuest;
  const displayedOrmawas = canViewAll ? ormawas : ormawas.filter(o => o.id === currentUser?.ormawaId);

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-soft w-full max-w-full overflow-hidden">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">
            {canViewAll ? 'Rapor Kinerja & Akreditasi Ormawa' : `Rapor Kinerja: ${displayedOrmawas[0]?.shortName || 'Ormawa'}`}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Akumulasi skor mutu kegiatan dan ketertiban pelaporan periode aktif
          </p>
        </div>
      </div>

      <div className={`grid gap-3.5 sm:gap-4 mt-4 ${canViewAll ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 max-w-xl'}`}>
        {displayedOrmawas.map((o) => {
          const oProkers = prokers.filter(p => p.ormawaId === o.id);
          const auditedProkers = oProkers.filter(p => p.lpj?.auditScore);
          const avgScore = auditedProkers.length > 0
            ? Math.round(auditedProkers.reduce((acc, p) => acc + p.lpj.auditScore, 0) / auditedProkers.length)
            : null;
          const predikat = avgScore !== null
            ? (avgScore >= 85 ? 'Predikat A' : avgScore >= 70 ? 'Predikat B' : 'Predikat C')
            : 'Belum Dievaluasi';

          const dadakanProposals = oProkers.filter(p => p.proposal?.isDadakan).length;
          const hasOverdue = oProkers.some(p => p.status === 'lpj_overdue');

          return (
            <div 
              key={o.id}
              className={`p-4 rounded-2xl border flex flex-col justify-between h-full transition-all duration-200 hover:shadow-soft ${
                hasOverdue ? 'border-rose-200 bg-rose-50/20' : 'border-slate-200/90 bg-white hover:border-blue-200 shadow-2xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-9 h-9 p-1 rounded-xl bg-slate-50 border border-slate-200/80 shadow-2xs flex items-center justify-center shrink-0">
                    <img src={o.logo} alt={o.name} className="w-full h-full object-contain" />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                    hasOverdue 
                      ? 'bg-rose-50 text-rose-700 border-rose-200' 
                      : auditedProkers.length > 0 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}>
                    {hasOverdue ? 'Evaluasi Khusus' : predikat}
                  </span>
                </div>

                <div className="min-h-[42px] flex flex-col justify-start">
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-[13px] leading-snug truncate" title={o.name}>
                    {o.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-1" title={o.type}>
                    {o.type}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium text-slate-500">Skor Rata-rata</span>
                    <span className="font-black text-slate-900 text-xs sm:text-[13px]">
                      {avgScore !== null ? `${avgScore} / 100` : '-'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium text-slate-500">Total Proker</span>
                    <span className="font-bold text-slate-800 text-[11px]">
                      {oProkers.length} kegiatan
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium text-slate-500">Status LPJ</span>
                    <span className={`text-[11px] font-bold ${
                      hasOverdue ? 'text-rose-600' : oProkers.length > 0 ? 'text-emerald-600' : 'text-slate-500'
                    }`}>
                      {hasOverdue ? 'Ada Terlambat' : oProkers.length > 0 ? 'Tertib' : 'Belum Ada Kegiatan'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-center gap-1.5 text-center px-1">
                <span className="text-[10px] text-slate-400 font-medium shrink-0">Ketua:</span>
                <span className="text-[10.5px] font-semibold text-slate-700 leading-snug truncate" title={o.ketua}>
                  {o.ketua}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

function AuditProkerTable({ prokers, ormawas, onAuditLPJ, onPrintDoc }) {
  const currentUser = useStore(state => state.currentUser);
  const isGuest = currentUser?.role === 'guest';
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'pending', 'audited'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParam, setSelectedParam] = useState('all');
  const [collapsedCards, setCollapsedCards] = useState({});

  const toggleCardCollapse = (id) => {
    setCollapsedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter list
  const filteredProkers = useMemo(() => {
    return prokers.filter(p => {
      const ormawa = ormawas.find(o => o.id === p.ormawaId);
      const isAudited = Boolean(p.lpj?.auditDetails);

      if (filterStatus === 'pending' && isAudited) return false;
      if (filterStatus === 'audited' && !isAudited) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = p.title?.toLowerCase().includes(query);
        const matchOrmawa = ormawa?.name?.toLowerCase().includes(query) || ormawa?.shortName?.toLowerCase().includes(query);
        return matchTitle || matchOrmawa;
      }
      return true;
    });
  }, [prokers, ormawas, filterStatus, searchQuery]);

  const totalCount = prokers.length;
  const pendingCount = prokers.filter(p => !p.lpj?.auditDetails).length;
  const auditedCount = prokers.filter(p => p.lpj?.auditDetails).length;

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-soft w-full max-w-full overflow-hidden space-y-4">
      {/* Top Header & Search/Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-extrabold text-slate-900 text-sm">
            Rekapitulasi Audit Program Kerja
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar kegiatan ormawa untuk evaluasi parameter dan pengesahan LPJ
          </p>
        </div>

        {/* Action Controls: Search & Filter Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Status Tabs */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/70 text-xs">
            <button
              type="button"
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                filterStatus === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('pending')}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                filterStatus === 'pending'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Menunggu ({pendingCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('audited')}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                filterStatus === 'audited'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Selesai ({auditedCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari proker atau ormawa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* Mobile Audit View */}
      <div className="lg:hidden space-y-3 w-full max-w-full overflow-hidden">
        {filteredProkers.length === 0 ? (
          <div className="py-8 text-center bg-slate-50/60 rounded-2xl border border-slate-200/80 p-5 w-full max-w-full">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 ring-8 ring-blue-50/50 flex items-center justify-center mx-auto mb-2">
              <Award className="w-6 h-6 stroke-[1.8]" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Tidak ada kegiatan yang cocok</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Coba ubah kata kunci pencarian atau status filter.</p>
          </div>
        ) : (
          <div className="space-y-3 w-full max-w-full">
            {filteredProkers.map((p) => {
              const ormawa = ormawas.find(o => o.id === p.ormawaId);
              const audit = p.lpj?.auditDetails;
              const isCollapsed = collapsedCards[p.id];

              return (
                <div
                  key={`mob-audit-${p.id}`}
                  className="p-3.5 rounded-2xl border border-slate-200/80 bg-white shadow-2xs space-y-3 w-full max-w-full overflow-hidden"
                >
                  <div 
                    onClick={() => toggleCardCollapse(p.id)}
                    className="flex items-start justify-between gap-2 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 p-0.5 shrink-0 flex items-center justify-center">
                        <img src={ormawa?.logo} alt={ormawa?.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-xs text-slate-900 leading-snug truncate">{p.title}</h4>
                        <p className="text-[10px] text-slate-500 truncate">{ormawa?.shortName} • {formatDateIndo(p.startDate)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="p-1.5 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60 shrink-0 transition"
                      title={isCollapsed ? 'Buka Detail Parameter' : 'Tutup Detail Parameter'}
                    >
                      {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                    </button>
                  </div>

                  {!isCollapsed && (
                    <div className="space-y-2 pt-2 border-t border-slate-100 text-xs w-full animate-in fade-in-50 duration-150">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 block">Realisasi Kas</span>
                          <span className="font-black text-slate-900 text-xs block mt-0.5">
                            {formatRupiah(p.realisasiDana || p.rab)}
                          </span>
                        </div>
                        <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 block">Total Skor Audit</span>
                          <div className="mt-0.5">
                            <AuditScoreBadge audit={audit} />
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                        {isGuest ? (
                          audit ? (
                            <button
                              onClick={() => onPrintDoc({ type: 'audit', ...p, ormawaName: ormawa?.name })}
                              className="flex-1 min-h-[36px] py-1.5 px-3 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl font-bold text-xs inline-flex items-center justify-center gap-1.5 transition cursor-pointer"
                            >
                              <Printer className="w-3.5 h-3.5 text-amber-500" /> Cetak Berita Acara
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic py-1">Belum Ada Berita Acara</span>
                          )
                        ) : (
                          <>
                            <button
                              onClick={() => onAuditLPJ(p)}
                              className={`flex-1 min-h-[36px] py-1.5 px-3 rounded-xl font-bold text-xs shadow-2xs transition flex items-center justify-center gap-1.5 cursor-pointer ${
                                audit
                                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                              }`}
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>{audit ? 'Ubah Penilaian' : 'Input Audit'}</span>
                            </button>
                            {audit && (
                              <button
                                onClick={() => onPrintDoc({ type: 'audit', ...p, ormawaName: ormawa?.name })}
                                className="min-h-[36px] min-w-[36px] p-2 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl transition flex items-center justify-center shrink-0 cursor-pointer"
                                title="Cetak Berita Acara Audit"
                              >
                                <Printer className="w-3.5 h-3.5 text-amber-500" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <th className="pb-3 pr-4 whitespace-nowrap">Program Kerja &amp; Ormawa</th>
              <th className="pb-3 pr-4 whitespace-nowrap">Realisasi Anggaran</th>
              <th className="pb-3 pr-4 whitespace-nowrap">Waktu Rundown</th>
              <th className="pb-3 pr-4 whitespace-nowrap">SLA LPJ</th>
              <th className="pb-3 pr-4 whitespace-nowrap">Total Skor Audit</th>
              <th className="pb-3 text-right whitespace-nowrap">{isGuest ? 'Dokumen Audit' : 'Aksi DPM'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProkers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <Award className="w-8 h-8 text-slate-300 stroke-[1.5]" />
                    <p className="text-xs font-semibold text-slate-700">Tidak ada kegiatan yang sesuai filter</p>
                    <p className="text-[11px] text-slate-400">Silakan sesuaikan filter pencarian atau status.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredProkers.map((p) => {
                const ormawa = ormawas.find(o => o.id === p.ormawaId);
                const audit = p.lpj?.auditDetails;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 pr-4 min-w-[200px]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 p-0.5 shrink-0 flex items-center justify-center">
                          <img src={ormawa?.logo} alt={ormawa?.name} className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{p.title}</p>
                          <p className="text-[10px] text-slate-500">{ormawa?.shortName} • {formatDateIndo(p.startDate)}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 pr-4 whitespace-nowrap">
                      <span className="font-bold text-slate-900 block">
                        {formatRupiah(p.realisasiDana || p.rab)}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        RAB: {formatRupiah(p.rab)}
                      </span>
                    </td>

                    <td className="py-3.5 pr-4 whitespace-nowrap">
                      <span className="text-slate-700 font-medium">
                        {p.inspection?.rundownAccuracy || 'Belum Diinspeksi'}
                      </span>
                    </td>

                    <td className="py-3.5 pr-4 whitespace-nowrap">
                      <AuditSlaStatus p={p} />
                    </td>

                    <td className="py-3.5 pr-4 whitespace-nowrap">
                      <AuditScoreBadge audit={audit} />
                    </td>

                    <td className="py-3.5 text-right whitespace-nowrap">
                      {isGuest ? (
                        audit ? (
                          <button
                            onClick={() => onPrintDoc({ type: 'audit', ...p, ormawaName: ormawa?.name })}
                            className="px-3 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl font-bold text-xs inline-flex items-center gap-1.5 transition shadow-2xs"
                            title="Cetak Berita Acara Audit"
                          >
                            <Printer className="w-3.5 h-3.5 text-amber-500" /> Cetak BAP
                          </button>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Belum Ada BAP</span>
                        )
                      ) : (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onAuditLPJ(p)}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-95 ${
                              audit
                                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>{audit ? 'Ubah Penilaian' : 'Input Audit'}</span>
                          </button>
                          {audit && (
                            <button
                              onClick={() => onPrintDoc({ type: 'audit', ...p, ormawaName: ormawa?.name })}
                              className="p-1.5 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl transition cursor-pointer"
                              title="Cetak Berita Acara Audit"
                            >
                              <Printer className="w-4 h-4 text-amber-500" />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AuditView({ onAuditLPJ, onPrintDoc }) {
  const { ormawas, prokers, currentUser } = useStore(useShallow(state => ({
    ormawas: state.ormawas,
    prokers: state.prokers,
    currentUser: state.currentUser
  })));

  const isGuest = currentUser?.role === 'guest';
  const isDpm = currentUser?.ormawaId === 'dpm' && !isGuest;
  const canViewAll = isDpm || isGuest;

  const displayedProkers = canViewAll ? prokers : prokers.filter(p => p.ormawaId === currentUser?.ormawaId);
  const displayedOrmawas = canViewAll ? ormawas : ormawas.filter(o => o.id === currentUser?.ormawaId);

  // Quick Stats
  const auditedList = displayedProkers.filter(p => p.lpj?.auditScore);
  const avgScore = auditedList.length > 0 
    ? Math.round(auditedList.reduce((acc, p) => acc + p.lpj.auditScore, 0) / auditedList.length)
    : 0;
  const passedCount = auditedList.filter(p => p.lpj.auditScore >= 70).length;
  const evalCount = auditedList.filter(p => p.lpj.auditScore < 70).length;

  return (
    <div className="space-y-5">
      {/* Top Banner & Quick Metric Strip */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/70">
              AUDIT MUTU &amp; AKUNTABILITAS
            </span>
            <span className="text-xs text-slate-400 font-medium">Periode 2026/2027</span>
          </div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 mt-1">
            Evaluasi LPJ &amp; Akreditasi Ormawa Fasilkom
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Instrumen audit pengawasan legislatif berbasis 5 pilar mutu kegiatan dan transparansi anggaran.
          </p>
        </div>

        {/* 3 Quick Metric Pills */}
        <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap">
          <div className="p-2.5 sm:px-3.5 sm:py-2 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-medium block">Kegiatan Diaudit</span>
            <span className="text-xs sm:text-sm font-black text-slate-900 tabular-nums">
              {auditedList.length} <span className="text-[10px] text-slate-400 font-normal">/ {displayedProkers.length}</span>
            </span>
          </div>
          <div className="p-2.5 sm:px-3.5 sm:py-2 rounded-2xl bg-emerald-50/70 border border-emerald-200/70">
            <span className="text-[10px] text-emerald-600 font-medium block">Lulus Audit</span>
            <span className="text-xs sm:text-sm font-black text-emerald-700 tabular-nums">
              {passedCount} <span className="text-[10px] text-emerald-600/70 font-normal">proker</span>
            </span>
          </div>
          <div className="p-2.5 sm:px-3.5 sm:py-2 rounded-2xl bg-blue-50/70 border border-blue-200/70">
            <span className="text-[10px] text-blue-600 font-medium block">Rata-rata Skor</span>
            <span className="text-xs sm:text-sm font-black text-blue-700 tabular-nums">
              {avgScore > 0 ? `${avgScore} / 100` : '-'}
            </span>
          </div>
        </div>
      </div>

      <AuditParameterStandards />
      <AuditOrmawaReport ormawas={displayedOrmawas} prokers={displayedProkers} currentUser={currentUser} />
      <AuditProkerTable 
        prokers={displayedProkers} 
        ormawas={displayedOrmawas} 
        onAuditLPJ={onAuditLPJ} 
        onPrintDoc={onPrintDoc} 
      />
    </div>
  );
}
