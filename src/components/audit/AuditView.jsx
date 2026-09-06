import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import DropdownSelect from '@/components/ui/dropdown-select';
import { 
  Award, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  FileText, 
  Printer, 
  TrendingUp,
  BarChart3,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function AuditView({ onAuditLPJ, onPrintDoc }) {
  const { ormawas, prokers } = useStore();
  const [selectedParam, setSelectedParam] = useState('all');
  const [collapsedCards, setCollapsedCards] = useState({});

  const toggleCardCollapse = (id) => {
    setCollapsedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Penjelasan Parameter Resmi DPM */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-soft w-full max-w-full overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Matriks Parameter Audit Keberhasilan Proker (DPM FASILKOM UMB)
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Standar baku penilaian mutu kegiatan ormawa berdasarkan 5 pilar indikator terukur (Skor 0–100).
              </p>
            </div>
          </div>
          <span className="text-xs font-extrabold text-slate-900 bg-slate-100 px-3 py-1 rounded-xl shrink-0">
            Regulasi DPM 2026/2027
          </span>
        </div>

        {/* 5 Parameter Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mt-5">
          {[
            {
              no: '01',
              title: 'Kedisiplinan Rundown',
              bobot: '20 Poin',
              desc: 'Acara dibuka & ditutup tepat waktu; rundown terlaksana tertib di lapangan.'
            },
            {
              no: '02',
              title: 'Capaian Target Peserta',
              bobot: '20 Poin',
              desc: 'Kehadiran peserta mencapai minimal 80%–100% dari target kuota proposal.'
            },
            {
              no: '03',
              title: 'Efisiensi Anggaran',
              bobot: '20 Poin',
              desc: 'Pengeluaran sesuai RAB, tidak defisit tak terduga, dan bukti nota sah terlampir.'
            },
            {
              no: '04',
              title: 'Kepatuhan SLA Berkas',
              bobot: '20 Poin',
              desc: 'Proposal masuk ≥ H-14 dan berkas LPJ diserahkan selambatnya ≤ H+14.'
            },
            {
              no: '05',
              title: 'Mutu Output Acara',
              bobot: '20 Poin',
              desc: 'Hasil kegiatan tercapai secara nyata sesuai visi & tupoksi ormawa.'
            }
          ].map((param) => (
            <div key={param.no} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-slate-600">{param.no}</span>
                  <span className="text-[10px] font-extrabold bg-white border border-slate-200 text-slate-800 px-2 py-0.5 rounded-full">
                    {param.bobot}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-xs mb-1">{param.title}</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">{param.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. RAPOR KINERJA & AKREDITASI INTERNAL ORMAWA */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-soft w-full max-w-full overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Rapor Kinerja & Akreditasi Ormawa Fasilkom
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Akumulasi performa ormawa berdasarkan seluruh audit kegiatan periode berjalan
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-5">
          {ormawas.map((o) => {
            const oProkers = prokers.filter(p => p.ormawaId === o.id);
            const auditedProkers = oProkers.filter(p => p.lpj?.auditScore);
            const avgScore = auditedProkers.length > 0
              ? Math.round(auditedProkers.reduce((acc, p) => acc + p.lpj.auditScore, 0) / auditedProkers.length)
              : null;
            const predikat = avgScore !== null
              ? (avgScore >= 85 ? 'Predikat A' : avgScore >= 70 ? 'Predikat B' : 'Predikat C')
              : 'Belum Dievaluasi';

            const onTimeProposals = oProkers.filter(p => p.proposal?.fileName && !p.proposal.isDadakan).length;
            const dadakanProposals = oProkers.filter(p => p.proposal?.isDadakan).length;
            const hasOverdue = oProkers.some(p => p.status === 'lpj_overdue');

            return (
              <div 
                key={o.id}
                className={`p-5 rounded-3xl border flex flex-col justify-between h-full transition-all duration-200 hover:shadow-soft ${
                  hasOverdue 
                    ? 'border-rose-200 bg-rose-50/30' 
                    : 'border-slate-200/90 bg-white hover:border-blue-200 shadow-2xs'
                }`}
              >
                {/* 1. Header: Logo & Status Badge */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <div className="w-10 h-10 p-1.5 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-2xs flex items-center justify-center shrink-0">
                      <img src={o.logo} alt={o.name} className="w-full h-full object-contain" />
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${
                      hasOverdue 
                        ? 'bg-rose-50 text-rose-700 border-rose-200' 
                        : auditedProkers.length > 0
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}>
                      {hasOverdue ? 'Evaluasi Khusus' : predikat}
                    </span>
                  </div>

                  {/* 2. Nama Ormawa & Tipe (Tinggi seragam agar garis pembatas di bawahnya sejajar sempurna) */}
                  <div className="min-h-[46px] flex flex-col justify-start">
                    <h4 className="font-extrabold text-slate-900 text-xs sm:text-[13px] leading-snug truncate" title={o.name}>
                      {o.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-2" title={o.type}>
                      {o.type}
                    </p>
                  </div>

                  {/* 3. Daftar Metrik Penilaian (Jarak vertikal dan horizontal terstruktur) */}
                  <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-medium text-slate-500">Skor Rata-rata</span>
                      <span className="font-bold text-slate-900 text-xs sm:text-[13px]">
                        {avgScore !== null ? `${avgScore} / 100` : '—'}
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
                        hasOverdue 
                          ? 'text-rose-600' 
                          : oProkers.length > 0 
                          ? 'text-emerald-600' 
                          : 'text-slate-500'
                      }`}>
                        {hasOverdue ? 'Melampaui Waktu' : oProkers.length > 0 ? 'Tertib' : 'Belum Ada Kegiatan'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4. Footer: Penanggung Jawab / Ketua Ormawa */}
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

      {/* 3. DAFTAR HASIL AUDIT PROKER RIIL */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-soft w-full max-w-full overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">
              Rekapitulasi Audit Seluruh Program Kerja
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Klik "Input Audit" untuk mengisi 5 parameter penilaian DPM
            </p>
          </div>

          {/* Sistem Dropdown Pemilihan Parameter Khusus Mobile (< lg) */}
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

        {/* ========================================================================= */}
        {/* A. MOBILE AUDIT VIEW (< lg) — Sistem Dropdown Murni, Pas 1 Layar HP       */}
        {/* ========================================================================= */}
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
                    {/* Header Card: Program Kerja & Ormawa + Tombol Buka/Tutup Dropdown */}
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
                        className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60 shrink-0 transition"
                        title={isCollapsed ? 'Buka Detail Parameter' : 'Tutup Detail Parameter'}
                      >
                        {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Isi Panel Parameter Sesuai Dropdown Pilihan */}
                    {!isCollapsed && (
                      <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs w-full animate-in fade-in-50 duration-150">
                        {/* 1. Program Kerja & Ormawa */}
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

                        {/* 2. Realisasi Anggaran */}
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

                        {/* 3. Waktu Rundown */}
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

                        {/* 4. SLA LPJ */}
                        {(selectedParam === 'all' || selectedParam === 'sla') && (
                          <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                              SLA LPJ (Batas H+14)
                            </span>
                            <div className="mt-1">
                              {p.status === 'lpj_overdue' ? (
                                <span className="text-red-600 font-extrabold text-[11px]">
                                  🔴 Melampaui Batas Waktu (&gt; H+14)
                                </span>
                              ) : p.lpj?.fileName ? (
                                <span className="text-emerald-600 font-bold text-[11px]">
                                  ✓ Tepat Waktu
                                </span>
                              ) : (
                                <span className="text-slate-600 text-[11px]">
                                  Deadline: {p.lpj?.deadlineDate}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* 5. Total Skor Audit */}
                        {(selectedParam === 'all' || selectedParam === 'skor') && (
                          <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                              Total Skor Audit
                            </span>
                            <div className="mt-1">
                              {audit ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-extrabold text-slate-900">{audit.totalScore}</span>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    Predikat {audit.predikat}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-slate-500 italic text-[11px]">Menunggu Audit</span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* 6. Aksi DPM */}
                        {(selectedParam === 'all' || selectedParam === 'aksi') && (
                          <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                            <button
                              onClick={() => onAuditLPJ(p)}
                              className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-xs transition text-center"
                            >
                              {audit ? 'Ubah Penilaian' : 'Input Audit'}
                            </button>
                            {audit && (
                              <button
                                onClick={() => onPrintDoc({ type: 'audit', ...p, ormawaName: ormawa?.name })}
                                className="p-2 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl transition shrink-0"
                                title="Cetak Berita Acara Audit"
                              >
                                <Printer className="w-4 h-4" />
                              </button>
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

        {/* ========================================================================= */}
        {/* B. DESKTOP VIEW (hidden on mobile, visible on lg+) — 100% UNTOUCHED       */}
        {/* ========================================================================= */}
        <div className="hidden lg:block overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-100">
                <th className="pb-3 pr-4 whitespace-nowrap">Program Kerja &amp; Ormawa</th>
                <th className="pb-3 pr-4 whitespace-nowrap">Realisasi Anggaran</th>
                <th className="pb-3 pr-4 whitespace-nowrap">Waktu Rundown</th>
                <th className="pb-3 pr-4 whitespace-nowrap">SLA LPJ</th>
                <th className="pb-3 pr-4 whitespace-nowrap">Total Skor Audit</th>
                <th className="pb-3 text-right whitespace-nowrap">Aksi DPM</th>
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
                        {p.status === 'lpj_overdue' ? (
                          <span className="text-red-600 font-extrabold text-[11px]">
                            🔴 Melampaui Batas Waktu (&gt; H+14)
                          </span>
                        ) : p.lpj?.fileName ? (
                          <span className="text-emerald-600 font-bold text-[11px]">
                            ✓ Tepat Waktu
                          </span>
                        ) : (
                          <span className="text-slate-600 text-[11px]">
                            Deadline: {p.lpj?.deadlineDate}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 pr-4 whitespace-nowrap">
                        {audit ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-extrabold text-slate-900">
                              {audit.totalScore}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Predikat {audit.predikat}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-600 italic text-[11px]">Menunggu Audit</span>
                        )}
                      </td>

                      <td className="py-3.5 text-right whitespace-nowrap">
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
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
