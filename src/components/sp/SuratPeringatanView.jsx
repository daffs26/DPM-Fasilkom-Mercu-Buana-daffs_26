import React, { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { AlertOctagon, Plus, Printer, CheckCircle2, ShieldAlert, FileText, ArrowRight, Filter } from 'lucide-react';

export default function SuratPeringatanView({ onOpenIssueSP, onPrintDoc }) {
  const { suratPeringatan, ormawas, resolveSP } = useStore();
  const [filterStatus, setFilterStatus] = useState('all');

  const activeCount = useMemo(() => suratPeringatan.filter(s => s.status === 'active').length, [suratPeringatan]);
  const resolvedCount = useMemo(() => suratPeringatan.filter(s => s.status === 'resolved').length, [suratPeringatan]);

  const filteredSuratPeringatan = useMemo(() => {
    if (filterStatus === 'active') return suratPeringatan.filter(s => s.status === 'active');
    if (filterStatus === 'resolved') return suratPeringatan.filter(s => s.status === 'resolved');
    return suratPeringatan;
  }, [suratPeringatan, filterStatus]);

  return (
    <div className="space-y-6">
      {/* Top Banner Overview & Filter Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0 border border-rose-100">
              <AlertOctagon className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-slate-900 text-sm">
                  Surat Peringatan (SP) Ormawa
                </h3>
                {activeCount > 0 && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                    {activeCount} SP Aktif
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Pengawasan kedisiplinan administratif, tenggat proposal, dan pelaporan LPJ ormawa.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenIssueSP}
              className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-bold shadow-xs transition active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Terbitkan SP Baru</span>
            </button>
          </div>
        </div>

        {/* Status Filter Tabs with Counts */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100 overflow-x-auto pb-1 hide-scrollbar">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${
              filterStatus === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60'
            }`}
          >
            <span>Semua SP</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
              filterStatus === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {suratPeringatan.length}
            </span>
          </button>

          <button
            onClick={() => setFilterStatus('active')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${
              filterStatus === 'active'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-50 text-rose-700 hover:bg-rose-50 border border-slate-200/60'
            }`}
          >
            <span>SP Aktif</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
              filterStatus === 'active' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700'
            }`}>
              {activeCount}
            </span>
          </button>

          <button
            onClick={() => setFilterStatus('resolved')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${
              filterStatus === 'resolved'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-50 text-emerald-700 hover:bg-emerald-50 border border-slate-200/60'
            }`}
          >
            <span>Terselesaikan</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
              filterStatus === 'resolved' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {resolvedCount}
            </span>
          </button>
        </div>
      </div>

      {/* Grid of Surat Peringatan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredSuratPeringatan.map((sp) => {
          const ormawa = ormawas.find(o => o.id === sp.ormawaId);
          const isActive = sp.status === 'active';

          return (
            <div
              key={sp.id}
              className={`bg-white rounded-3xl p-6 border transition shadow-soft flex flex-col justify-between ${
                isActive ? 'border-red-300 ring-2 ring-red-500/10' : 'border-slate-200 opacity-80'
              }`}
            >
              <div>
                {/* Header SP */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-slate-50 border border-slate-200 p-0.5 shrink-0 flex items-center justify-center">
                      <img src={ormawa?.logo} alt={ormawa?.name} className="w-full h-full object-contain" />
                    </div>
                    <span className="font-extrabold text-xs text-slate-900">
                      {sp.ormawaName}
                    </span>
                  </div>

                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                    isActive
                      ? 'bg-red-50 text-red-700 border-red-200 animate-pulse'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {isActive ? `🔴 SP ${sp.level} AKTIF` : '✓ Terselesaikan'}
                  </span>
                </div>

                {/* Nomor Surat & Judul */}
                <span className="font-mono text-[10px] text-slate-600 block">
                  Nomor: {sp.noSurat}
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-1 leading-snug">
                  {sp.title}
                </h4>

                {/* Rincian Alasan Pelanggaran */}
                <div className="mt-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                  <span className="font-bold text-slate-800 text-[11px] block">
                    Dasar Pertimbangan Legislatif:
                  </span>
                  <p className="text-slate-700 text-xs leading-relaxed">
                    {sp.reason}
                  </p>
                  <p className="text-[11px] text-slate-600 pt-1 border-t border-slate-200">
                    Proker: <strong>{sp.prokerTitle}</strong>
                  </p>
                </div>

                {/* Signer Info */}
                <div className="mt-4 flex items-center justify-between text-[11px] text-slate-600">
                  <span>Diterbitkan: <strong>{sp.date}</strong></span>
                  <span>Penandatangan: <strong>{sp.signer}</strong></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onPrintDoc({ type: 'sp', ...sp })}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Cetak Surat Resmi</span>
                </button>

                {isActive && (
                  <button
                    onClick={() => {
                      if (window.confirm('Tandai Surat Peringatan ini sebagai terselesaikan (LPJ telah diserahkan)?')) {
                        resolveSP(sp.id);
                      }
                    }}
                    className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold transition"
                  >
                    Tandai Selesai
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredSuratPeringatan.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-soft">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
          <h4 className="font-bold text-slate-900 text-sm">
            {filterStatus === 'all'
              ? 'Tidak Ada Surat Peringatan'
              : filterStatus === 'active'
              ? 'Tidak Ada Surat Peringatan yang Sedang Aktif'
              : 'Belum Ada Surat Peringatan yang Ditandai Terselesaikan'}
          </h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {filterStatus === 'active'
              ? 'Seluruh ormawa Fasilkom saat ini tertib administratif dan mematuhi tenggat proker.'
              : 'Daftar riwayat SP akan tampil di sini setelah ada surat yang diselesaikan.'}
          </p>
          {filterStatus !== 'all' && (
            <button
              onClick={() => setFilterStatus('all')}
              className="mt-3 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
            >
              Lihat Semua SP
            </button>
          )}
        </div>
      )}
    </div>
  );
}
