import React, { useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { 
  AlertOctagon, 
  Plus, 
  Printer, 
  CheckCircle2, 
  Clock,
  MessageSquare
} from 'lucide-react';
import { canManageSP, canPrintSP } from '@/utils/permissions';

export default function SuratPeringatanView({ onOpenIssueSP, onPrintDoc }) {
  const { suratPeringatan, ormawas, resolveSP, currentUser } = useStore(useShallow(state => ({
    suratPeringatan: state.suratPeringatan,
    ormawas: state.ormawas,
    resolveSP: state.resolveSP,
    currentUser: state.currentUser
  })));

  const [filterStatus, setFilterStatus] = useState('all');

  const activeCount = useMemo(() => suratPeringatan.filter(s => s.status === 'active').length, [suratPeringatan]);
  const resolvedCount = useMemo(() => suratPeringatan.filter(s => s.status === 'resolved').length, [suratPeringatan]);

  const filteredSuratPeringatan = useMemo(() => {
    if (filterStatus === 'active') return suratPeringatan.filter(s => s.status === 'active');
    if (filterStatus === 'resolved') return suratPeringatan.filter(s => s.status === 'resolved');
    return suratPeringatan;
  }, [suratPeringatan, filterStatus]);

  const canManage = canManageSP(currentUser?.role, currentUser?.ormawaId);
  const canPrint = canPrintSP(currentUser?.role, currentUser?.ormawaId);

  const filterTabs = [
    { id: 'all', label: 'Semua SP', count: suratPeringatan.length, activeCls: 'bg-slate-900 text-white shadow-xs', countActive: 'bg-white/20 text-white', countInactive: 'bg-slate-200 text-slate-700', inactiveCls: 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60' },
    { id: 'active', label: 'SP Aktif', count: activeCount, activeCls: 'bg-rose-600 text-white shadow-xs', countActive: 'bg-white/20 text-white', countInactive: 'bg-rose-100 text-rose-700', inactiveCls: 'bg-slate-50 text-rose-700 hover:bg-rose-50 border border-slate-200/60' },
    { id: 'resolved', label: 'Terselesaikan', count: resolvedCount, activeCls: 'bg-emerald-600 text-white shadow-xs', countActive: 'bg-white/20 text-white', countInactive: 'bg-emerald-100 text-emerald-700', inactiveCls: 'bg-slate-50 text-emerald-700 hover:bg-emerald-50 border border-slate-200/60' }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Banner Overview & Filter Bar */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-soft space-y-3.5 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0 border border-rose-100 mt-0.5 sm:mt-0">
              <AlertOctagon className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                  Surat Peringatan (SP) Ormawa
                </h3>
                {activeCount > 0 && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                    {activeCount} SP Aktif
                  </span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                Monitoring kedisiplinan dan kepatuhan administratif seluruh Ormawa
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {canPrint && (
              <button
                type="button"
                onClick={onOpenIssueSP}
                className="w-full sm:w-auto min-h-[44px] h-11 flex items-center justify-center gap-2 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold shadow-xs transition active:scale-95 shrink-0 cursor-pointer"
                title="Terbitkan & Cetak SP Baru (Ketua & Wakil Ketua DPM)"
              >
                <Plus className="w-4 h-4" />
                <span>Terbitkan SP Baru</span>
              </button>
            )}
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 overflow-x-auto pb-1 hide-scrollbar -mx-0.5 px-0.5">
          {filterTabs.map((tab) => {
            const isSelected = filterStatus === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterStatus(tab.id)}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                  isSelected ? tab.activeCls : tab.inactiveCls
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                  isSelected ? tab.countActive : tab.countInactive
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Surat Peringatan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {filteredSuratPeringatan.map((sp) => {
          const ormawa = ormawas.find(o => o.id === sp.ormawaId);
          const isActive = sp.status === 'active';
          const isClarification = sp.status === 'clarification';
          const isResolved = sp.status === 'resolved';

          return (
            <div
              key={sp.id}
              className={`bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 border transition shadow-soft flex flex-col justify-between ${
                isActive ? 'border-red-300 ring-2 ring-red-500/10' : isClarification ? 'border-amber-300 ring-2 ring-amber-500/10' : 'border-slate-200 opacity-90'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3 gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-xl bg-slate-50 border border-slate-200 p-0.5 shrink-0 flex items-center justify-center">
                      <img src={ormawa?.logo} alt={ormawa?.name} className="w-full h-full object-contain" />
                    </div>
                    <span className="font-extrabold text-xs text-slate-900 truncate">
                      {sp.ormawaName}
                    </span>
                  </div>

                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border shrink-0 ${
                    isActive
                      ? 'bg-red-50 text-red-700 border-red-200 animate-pulse'
                      : isClarification
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {isActive ? `🔴 SP ${sp.level} Aktif` : isClarification ? '💬 Tanggapan Masuk' : '✓ Terselesaikan'}
                  </span>
                </div>

                <span className="font-mono text-[10px] text-slate-500 block">
                  Nomor: {sp.noSurat}
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-1 leading-snug">
                  {sp.title}
                </h4>

                <div className="mt-3.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                  <span className="font-bold text-slate-700 text-[11px] block">
                    Pertimbangan:
                  </span>
                  <p className="text-slate-700 text-xs leading-relaxed">
                    {sp.reason}
                  </p>
                  <p className="text-[11px] text-slate-600 pt-1 border-t border-slate-200">
                    Proker: <strong>{sp.prokerTitle}</strong>
                  </p>
                </div>

                {sp.clarification && (
                  <div className="mt-3 p-3 bg-blue-50/70 rounded-2xl border border-blue-200/80 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-blue-900 text-[11px] flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                        Klarifikasi Ormawa ({sp.clarification.submittedBy})
                      </span>
                      <span className="text-[10px] text-blue-700 font-medium">{sp.clarification.submittedAt}</span>
                    </div>
                    <p className="text-slate-700 text-xs italic line-clamp-3 bg-white/70 p-2 rounded-xl border border-blue-100">
                      "{sp.clarification.clarificationText}"
                    </p>
                    {sp.clarification.commitmentDate && (
                      <div className="text-[11px] text-blue-800 font-semibold pt-1 border-t border-blue-100 flex items-center justify-between">
                        <span>Target Penyelesaian:</span>
                        <span className="font-bold">{sp.clarification.commitmentDate}</span>
                      </div>
                    )}
                    {sp.clarification.documentUrl && (
                      <div className="text-[11px] text-blue-800 flex items-center justify-between pt-0.5">
                        <span>Dokumen Terlampir:</span>
                        <span className="font-bold truncate max-w-[150px]">{sp.clarification.documentUrl}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-600 border-t border-slate-100/80 pt-2.5">
                  <span>Diterbitkan: <strong>{sp.date}</strong></span>
                  <span>Penandatangan: <strong>{sp.signer}</strong></span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                {canPrint ? (
                  <button
                    type="button"
                    onClick={() => onPrintDoc({ type: 'sp', ...sp })}
                    className="flex-1 min-h-[44px] h-11 flex items-center justify-center gap-2 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
                    title="Cetak Surat Peringatan Resmi (Ketua & Wakil Ketua DPM)"
                  >
                    <Printer className="w-4 h-4 text-amber-400" />
                    <span>Cetak Surat</span>
                  </button>
                ) : (
                  <div 
                    className="flex-1 min-h-[44px] h-11 flex items-center justify-center gap-2 py-2 px-3 bg-slate-100 text-slate-400 rounded-xl text-xs font-semibold border border-slate-200/60 cursor-not-allowed select-none"
                    title="Hanya Ketua dan Wakil Ketua DPM yang berwenang mencetak SP"
                  >
                    <Printer className="w-4 h-4 text-slate-400" />
                    <span>Cetak Khusus Pimpinan DPM</span>
                  </div>
                )}

                {canManage && isActive && (
                  <button
                    type="button"
                    onClick={() => {
                      const note = window.prompt('Catatan evaluasi penyelesaian SP (opsional):', 'Telah melengkapi LPJ & memenuhi komitmen administratif.');
                      if (note !== null) {
                        resolveSP(sp.id, note);
                      }
                    }}
                    className="w-full sm:w-auto min-h-[44px] h-11 flex items-center justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs active:scale-95"
                    title="Selesaikan SP secara langsung"
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
              ? 'Tidak Ada SP Aktif'
              : filterStatus === 'clarification'
              ? 'Tidak Ada Tanggapan Menunggu'
              : 'Belum Ada Riwayat Penyelesaian SP'}
          </h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {filterStatus === 'active'
              ? 'Seluruh ormawa tertib administratif.'
              : filterStatus === 'clarification'
              ? 'Tidak ada tanggapan yang menunggu review.'
              : 'Daftar riwayat SP akan tampil di sini.'}
          </p>
          {filterStatus !== 'all' && (
            <button
              onClick={() => setFilterStatus('all')}
              className="mt-3 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
            >
              Lihat Semua SP
            </button>
          )}
        </div>
      )}

    </div>
  );
}
