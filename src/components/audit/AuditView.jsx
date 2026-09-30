import React, { useState } from 'react';
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
  Printer 
} from 'lucide-react';
import DropdownSelect from '@/components/ui/dropdown-select';

const AUDIT_PARAMETERS = [
  { no: '01', title: 'Kedisiplinan Rundown', bobot: '20 Poin', pct: '20%', desc: 'Acara dibuka & ditutup tepat waktu; rundown terlaksana tertib di lapangan.', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
  { no: '02', title: 'Capaian Target Peserta', bobot: '20 Poin', pct: '20%', desc: 'Kehadiran peserta mencapai minimal 80% - 100% dari target kuota proposal.', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
  { no: '03', title: 'Efisiensi Anggaran', bobot: '20 Poin', pct: '20%', desc: 'Pengeluaran sesuai RAB, tidak defisit tak terduga, dan bukti nota sah terlampir.', icon: Coins, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
  { no: '04', title: 'Kepatuhan SLA Berkas', bobot: '20 Poin', pct: '20%', desc: 'Proposal diajukan minimal 14 hari sebelum acara (H-14), dan LPJ diserahkan maksimal 14 hari setelah acara (H+14).', icon: FileCheck, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200' },
  { no: '05', title: 'Mutu Output Acara', bobot: '20 Poin', pct: '20%', desc: 'Hasil kegiatan tercapai secara nyata sesuai visi & tupoksi ormawa.', icon: Target, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200' }
];

function AuditSlaStatus({ p }) {
  if (p.status === 'lpj_overdue') {
    return <span className="text-red-600 font-extrabold text-[11px]">🔴 Melampaui Batas Waktu (&gt; H+14)</span>;
  }
  if (p.lpj?.fileName) {
    return <span className="text-emerald-600 font-bold text-[11px]">✓ Tepat Waktu</span>;
  }
  return <span className="text-slate-600 text-[11px]">Deadline: {p.lpj?.deadlineDate}</span>;
}

function AuditScoreBadge({ audit }) {
  if (!audit) return <span className="text-slate-500 italic text-[11px]">Menunggu Audit</span>;
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-sm font-extrabold text-slate-900">{audit.totalScore}</span>
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
        Predikat {audit.predikat}
      </span>
    </div>
  );
}

const AuditParameterStandards = React.memo(function AuditParameterStandards() {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-soft w-full max-w-full overflow-hidden transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-100 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                Matriks Parameter Audit Keberhasilan Proker
              </h3>
              <span className="hidden sm:inline-flex text-[10px] font-extrabold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                5 Pilar Mutu
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              Standar baku evaluasi akuntabilitas & kelayakan LPJ (Skor 0 - 100 Poin)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <span className="text-[10px] font-extrabold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-xl">
            Regulasi DPM 2026/2027
          </span>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200/80 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer min-h-[38px]"
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
                <span>Detail</span>
              </>
            )}
          </button>
        </div>
      </div>

      {!isExpanded ? (
        <div className="pt-3.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {AUDIT_PARAMETERS.map((param) => {
              const Icon = param.icon;
              return (
                <div 
                  key={param.no}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700 text-[11px] font-bold shadow-2xs"
                >
                  <Icon className={`w-3.5 h-3.5 ${param.color}`} />
                  <span>{param.title}</span>
                  <span className="text-[9px] px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-slate-500">
                    20%
                  </span>
                </div>
              );
            })}
          </div>
          <div className="text-[11px] font-extrabold text-slate-800 bg-amber-50/80 border border-amber-200 px-3.5 py-1 rounded-xl flex items-center gap-1">
            <span>Total: 100 Poin</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-4">
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
    <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-soft w-full max-w-full overflow-hidden">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">
            {canViewAll ? 'Rapor Kinerja & Akreditasi Ormawa Fasilkom' : `Rapor Kinerja & Akreditasi: ${displayedOrmawas[0]?.shortName || 'Ormawa'}`}
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            {canViewAll 
              ? 'Akumulasi performa ormawa berdasarkan seluruh audit kegiatan periode berjalan'
              : `Akumulasi performa internal ${displayedOrmawas[0]?.name || 'Ormawa'} berdasarkan seluruh audit kegiatan periode berjalan`}
          </p>
        </div>
      </div>

      <div className={`grid gap-4 sm:gap-5 mt-5 ${canViewAll ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 max-w-xl'}`}>
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
              className={`p-5 rounded-3xl border flex flex-col justify-between h-full transition-all duration-200 hover:shadow-soft ${
                hasOverdue ? 'border-rose-200 bg-rose-50/30' : 'border-slate-200/90 bg-white hover:border-blue-200 shadow-2xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3.5">
                  <div className="w-10 h-10 p-1.5 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-2xs flex items-center justify-center shrink-0">
                    <img src={o.logo} alt={o.name} className="w-full h-full object-contain" />
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${
                    hasOverdue ? 'bg-rose-50 text-rose-700 border-rose-200' : auditedProkers.length > 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}>
                    {hasOverdue ? 'Evaluasi Khusus' : predikat}
                  </span>
                </div>

                <div className="min-h-[46px] flex flex-col justify-start">
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-[13px] leading-snug truncate" title={o.name}>
                    {o.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-2" title={o.type}>
                    {o.type}
                  </p>
                </div>

                <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium text-slate-500">Skor Rata-rata</span>
                    <span className="font-bold text-slate-900 text-xs sm:text-[13px]">
                      {avgScore !== null ? `${avgScore} / 100` : '-'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium text-slate-500">Total Proker</span>
                    <span className="font-bold text-slate-800 text-[11px] sm:text-xs">
                      {oProkers.length} kegiatan
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium text-slate-500">Pengajuan Terlambat</span>
                    <span className={`font-bold text-[11px] sm:text-xs ${dadakanProposals > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                      {dadakanProposals} berkas
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium text-slate-500">Status LPJ</span>
                    <span className={`text-[11px] font-bold ${
                      hasOverdue ? 'text-rose-600' : oProkers.length > 0 ? 'text-emerald-600' : 'text-slate-500'
                    }`}>
                      {hasOverdue ? 'Melampaui Waktu' : oProkers.length > 0 ? 'Tertib' : 'Belum Ada Kegiatan'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-center px-1">
                <span className="text-[10px] text-slate-400 font-medium shrink-0">Ketua:</span>
                <span className="text-[10.5px] font-semibold text-slate-700 leading-snug" title={o.ketua}>
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
  const [selectedParam, setSelectedParam] = useState('all');
  const [collapsedCards, setCollapsedCards] = useState({});

  const toggleCardCollapse = (id) => {
    setCollapsedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-soft w-full max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-extrabold text-slate-900 text-sm">
            Rekapitulasi Audit Seluruh Program Kerja
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {isGuest ? 'Transparansi parameter dan skor penilaian DPM' : 'Klik "Input Audit" untuk mengisi 5 parameter penilaian DPM'}
          </p>
        </div>

        <div className="lg:hidden flex items-center gap-2 w-full sm:w-auto">
          <span className="text-[11px] font-bold text-slate-600 shrink-0">Pilih Kolom:</span>
          <DropdownSelect
            value={selectedParam}
            onChange={(val) => setSelectedParam(val)}
            options={[
              { value: 'all', label: 'Semua Parameter (Lengkap)' },
              { value: 'ormawa', label: 'Program Kerja & Ormawa' },
              { value: 'anggaran', label: 'Realisasi Anggaran' },
              { value: 'rundown', label: 'Waktu Rundown' },
              { value: 'sla', label: 'SLA LPJ' },
              { value: 'skor', label: 'Total Skor Audit' },
              { value: 'aksi', label: 'Aksi DPM' }
            ]}
            className="flex-1 min-w-0"
            triggerClassName="w-full py-1.5 px-3 font-bold text-xs rounded-xl bg-slate-50 border border-slate-200 shadow-2xs flex items-center justify-between"
          />
        </div>
      </div>

      {/* Mobile Audit View */}
      <div className="lg:hidden mt-3.5 space-y-3 w-full max-w-full overflow-hidden">
        {prokers.length === 0 ? (
          <div className="py-8 text-center bg-slate-50/60 rounded-2xl border border-slate-200/80 p-5 w-full max-w-full">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 ring-8 ring-blue-50/50 flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 stroke-[1.8]" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Belum Ada Kegiatan untuk Diaudit</h4>
            <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
              Daftarkan program kerja terlebih dahulu melalui menu Program Kerja atau Beranda.
            </p>
          </div>
        ) : (
          <div className="space-y-3 w-full max-w-full">
            {prokers.map((p) => {
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
                        <p className="text-[10px] text-slate-500 truncate">{ormawa?.shortName} • {p.startDate}</p>
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
                    <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs w-full animate-in fade-in-50 duration-150">
                      {(selectedParam === 'all' || selectedParam === 'ormawa') && (
                        <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            Program Kerja &amp; Ormawa
                          </span>
                          <p className="font-extrabold text-slate-900 text-xs mt-0.5">{p.title}</p>
                          <p className="text-[11px] text-slate-600 mt-0.5">
                            Penyelenggara: <strong>{ormawa?.name}</strong> ({ormawa?.shortName}) • PIC: {p.pic}
                          </p>
                        </div>
                      )}

                      {(selectedParam === 'all' || selectedParam === 'anggaran') && (
                        <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            Realisasi Anggaran
                          </span>
                          <div className="flex items-baseline justify-between mt-1">
                            <span className="font-extrabold text-slate-900 text-xs">
                              Rp {(p.realisasiDana || p.rab).toLocaleString('id-ID')}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium">
                              RAB: Rp {p.rab.toLocaleString('id-ID')}
                            </span>
                          </div>
                        </div>
                      )}

                      {(selectedParam === 'all' || selectedParam === 'rundown') && (
                        <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            Waktu Rundown
                          </span>
                          <p className="text-slate-800 font-bold text-xs mt-1">
                            {p.inspection?.rundownAccuracy || 'Belum Diinspeksi'}
                          </p>
                        </div>
                      )}

                      {(selectedParam === 'all' || selectedParam === 'sla') && (
                        <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            SLA LPJ (Batas H+14)
                          </span>
                          <div className="mt-1">
                            <AuditSlaStatus p={p} />
                          </div>
                        </div>
                      )}

                      {(selectedParam === 'all' || selectedParam === 'skor') && (
                        <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            Total Skor Audit
                          </span>
                          <div className="mt-1">
                            <AuditScoreBadge audit={audit} />
                          </div>
                        </div>
                      )}

                      {(selectedParam === 'all' || selectedParam === 'aksi') && (
                        <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                          {isGuest ? (
                            audit ? (
                              <button
                                onClick={() => onPrintDoc({ type: 'audit', ...p, ormawaName: ormawa?.name })}
                                className="flex-1 min-h-[38px] py-2 px-3 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl font-bold text-xs inline-flex items-center justify-center gap-1.5 transition cursor-pointer"
                              >
                                <Printer className="w-4 h-4 text-amber-500" /> Cetak Berita Acara
                              </button>
                            ) : (
                              <span className="text-[11px] text-slate-400 italic py-1">Belum Ada Berita Acara</span>
                            )
                          ) : (
                            <>
                              <button
                                onClick={() => onAuditLPJ(p)}
                                className="flex-1 min-h-[38px] py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-xs transition flex items-center justify-center cursor-pointer"
                              >
                                {audit ? 'Ubah Penilaian' : 'Input Audit'}
                              </button>
                              {audit && (
                                <button
                                  onClick={() => onPrintDoc({ type: 'audit', ...p, ormawaName: ormawa?.name })}
                                  className="min-h-[38px] min-w-[38px] p-2 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl transition flex items-center justify-center shrink-0 cursor-pointer"
                                  title="Cetak Berita Acara Audit"
                                >
                                  <Printer className="w-4 h-4 text-amber-500" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block overflow-x-auto mt-4">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-100">
              <th className="pb-3 pr-4 whitespace-nowrap">Program Kerja &amp; Ormawa</th>
              <th className="pb-3 pr-4 whitespace-nowrap">Realisasi Anggaran</th>
              <th className="pb-3 pr-4 whitespace-nowrap">Waktu Rundown</th>
              <th className="pb-3 pr-4 whitespace-nowrap">SLA LPJ</th>
              <th className="pb-3 pr-4 whitespace-nowrap">Total Skor Audit</th>
              <th className="pb-3 text-right whitespace-nowrap">{isGuest ? 'Dokumen Audit' : 'Aksi DPM'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {prokers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Award className="w-8 h-8 text-slate-300 stroke-[1.5]" />
                    <p className="text-xs font-semibold text-slate-700">Belum ada kegiatan untuk diaudit</p>
                    <p className="text-[11px] text-slate-400">Daftarkan program kerja terlebih dahulu melalui menu Program Kerja atau Beranda.</p>
                  </div>
                </td>
              </tr>
            ) : (
              prokers.map((p) => {
                const ormawa = ormawas.find(o => o.id === p.ormawaId);
                const audit = p.lpj?.auditDetails;

                return (
                  <tr key={p.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 pr-4 min-w-[200px]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 p-0.5 shrink-0 flex items-center justify-center">
                          <img src={ormawa?.logo} alt={ormawa?.name} className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{p.title}</p>
                          <p className="text-[10px] text-slate-600">{ormawa?.shortName} • {p.startDate}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 pr-4 whitespace-nowrap">
                      <span className="font-bold text-slate-900">
                        Rp {(p.realisasiDana || p.rab).toLocaleString('id-ID')}
                      </span>
                      <span className="block text-[10px] text-slate-600">
                        RAB: Rp {p.rab.toLocaleString('id-ID')}
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
                            <Printer className="w-3.5 h-3.5" /> Cetak Berita Acara
                          </button>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Belum Ada Berita Acara</span>
                        )
                      ) : (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onAuditLPJ(p)}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-xs transition"
                          >
                            {audit ? 'Ubah Penilaian' : 'Input Audit'}
                          </button>
                          {audit && (
                            <button
                              onClick={() => onPrintDoc({ type: 'audit', ...p, ormawaName: ormawa?.name })}
                              className="p-1.5 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl transition"
                              title="Cetak Berita Acara Audit"
                            >
                              <Printer className="w-4 h-4" />
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

  return (
    <div className="space-y-6">
      <AuditParameterStandards />
      <AuditOrmawaReport ormawas={ormawas} prokers={prokers} currentUser={currentUser} />
      <AuditProkerTable 
        prokers={displayedProkers} 
        ormawas={displayedOrmawas} 
        onAuditLPJ={onAuditLPJ} 
        onPrintDoc={onPrintDoc} 
      />
    </div>
  );
}
