import React, { useState } from 'react';
import DropdownSelect from '@/components/ui/dropdown-select';
import { Award, Printer, ChevronDown, ChevronUp } from 'lucide-react';

export default function AuditProkerTable({ prokers, ormawas, onAuditLPJ, onPrintDoc }) {
  const [selectedParam, setSelectedParam] = useState('all');
  const [collapsedCards, setCollapsedCards] = useState({});

  const toggleCardCollapse = (id) => {
    setCollapsedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
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

      {/* A. MOBILE AUDIT VIEW (< lg) */}
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
                  {/* Header Card: Program Kerja & Ormawa */}
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

      {/* B. DESKTOP VIEW (lg+) */}
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
                            <Printer className="w-4 h-4" />
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
  );
}
