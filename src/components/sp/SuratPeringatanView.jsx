import React, { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { 
  AlertOctagon, 
  Plus, 
  Printer, 
  CheckCircle2, 
  ShieldAlert, 
  FileText, 
  ArrowRight, 
  Filter,
  MessageSquare,
  Send,
  Clock,
  ExternalLink
} from 'lucide-react';
import SPClarificationModal from './components/SPClarificationModal';
import ReviewSPClarificationModal from './components/ReviewSPClarificationModal';

export default function SuratPeringatanView({ onOpenIssueSP, onPrintDoc }) {
  const { suratPeringatan, ormawas, resolveSP, currentUser } = useStore();
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedSpForClarification, setSelectedSpForClarification] = useState(null);
  const [selectedSpForReview, setSelectedSpForReview] = useState(null);

  const activeCount = useMemo(() => suratPeringatan.filter(s => s.status === 'active').length, [suratPeringatan]);
  const clarificationCount = useMemo(() => suratPeringatan.filter(s => s.status === 'clarification_submitted').length, [suratPeringatan]);
  const resolvedCount = useMemo(() => suratPeringatan.filter(s => s.status === 'resolved').length, [suratPeringatan]);

  const filteredSuratPeringatan = useMemo(() => {
    if (filterStatus === 'active') return suratPeringatan.filter(s => s.status === 'active');
    if (filterStatus === 'clarification') return suratPeringatan.filter(s => s.status === 'clarification_submitted');
    if (filterStatus === 'resolved') return suratPeringatan.filter(s => s.status === 'resolved');
    return suratPeringatan;
  }, [suratPeringatan, filterStatus]);

  const isDpm = currentUser?.ormawaId === 'dpm';

  return (
    <div className="space-y-6">
      {/* Top Banner Overview & Filter Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-soft space-y-3.5 sm:space-y-4">
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
                {clarificationCount > 0 && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                    <MessageSquare className="w-3 h-3 text-amber-600" />
                    {clarificationCount} Tanggapan Menunggu
                  </span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">
                Pengawasan kedisiplinan administratif, tenggat proposal, dan pelaporan LPJ ormawa.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {isDpm && (
              <button
                onClick={onOpenIssueSP}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-bold shadow-xs transition active:scale-95 shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Terbitkan SP Baru</span>
              </button>
            )}
          </div>
        </div>

        {/* Status Filter Tabs with Counts */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 overflow-x-auto pb-1 hide-scrollbar -mx-0.5 px-0.5">
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
            onClick={() => setFilterStatus('clarification')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${
              filterStatus === 'clarification'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-50 text-amber-800 hover:bg-amber-50 border border-slate-200/60'
            }`}
          >
            <span>Tanggapan Masuk</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
              filterStatus === 'clarification' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
            }`}>
              {clarificationCount}
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
          const isClarification = sp.status === 'clarification_submitted';
          const isResolved = sp.status === 'resolved';

          const canClarify = !isResolved && (!isDpm || currentUser?.ormawaId === sp.ormawaId);

          return (
            <div
              key={sp.id}
              className={`bg-white rounded-3xl p-6 border transition shadow-soft flex flex-col justify-between ${
                isActive ? 'border-red-300 ring-2 ring-red-500/10' : isClarification ? 'border-amber-300 ring-2 ring-amber-500/10' : 'border-slate-200 opacity-85'
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
                      : isClarification
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {isActive ? `🔴 SP ${sp.level} AKTIF` : isClarification ? '💬 Tanggapan Masuk' : '✓ Terselesaikan'}
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

                {/* Tanggapan Ormawa (Jika ada) */}
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

                {/* Signer Info */}
                <div className="mt-4 flex items-center justify-between text-[11px] text-slate-600">
                  <span>Diterbitkan: <strong>{sp.date}</strong></span>
                  <span>Penandatangan: <strong>{sp.signer}</strong></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => onPrintDoc({ type: 'sp', ...sp })}
                  className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Cetak Surat</span>
                </button>

                {/* Tombol Tinjau Tanggapan (Khusus DPM saat ada tanggapan masuk) */}
                {isDpm && isClarification && (
                  <button
                    type="button"
                    onClick={() => setSelectedSpForReview(sp)}
                    className="flex-1 min-w-[130px] flex items-center justify-center gap-1.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Tinjau Tanggapan</span>
                  </button>
                )}

                {/* Tombol Ajukan Klarifikasi (Khusus Ormawa pada SP aktif) */}
                {canClarify && (
                  <button
                    type="button"
                    onClick={() => setSelectedSpForClarification(sp)}
                    className="flex-1 min-w-[130px] flex items-center justify-center gap-1.5 py-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-800 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-600" />
                    <span>{sp.clarification ? 'Update Tanggapan' : 'Beri Klarifikasi'}</span>
                  </button>
                )}

                {/* Tombol Tandai Selesai (Khusus DPM langsung tanpa klarifikasi atau resolusi manual) */}
                {isDpm && isActive && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Tandai Surat Peringatan ini sebagai terselesaikan (LPJ telah diserahkan)?')) {
                        resolveSP(sp.id);
                      }
                    }}
                    className="px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold transition cursor-pointer"
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
              ? 'Tidak Ada Surat Peringatan yang Sedang Aktif'
              : filterStatus === 'clarification'
              ? 'Belum Ada Tanggapan atau Klarifikasi Baru'
              : 'Belum Ada Surat Peringatan yang Ditandai Terselesaikan'}
          </h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {filterStatus === 'active'
              ? 'Seluruh ormawa Fasilkom saat ini tertib administratif dan mematuhi tenggat proker.'
              : filterStatus === 'clarification'
              ? 'Tidak ada klarifikasi atau tanggapan SP yang menunggu persetujuan komisi DPM.'
              : 'Daftar riwayat SP akan tampil di sini setelah ada surat yang diselesaikan.'}
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

      {/* Modal Klarifikasi SP oleh Ormawa */}
      <SPClarificationModal
        isOpen={Boolean(selectedSpForClarification)}
        onClose={() => setSelectedSpForClarification(null)}
        sp={selectedSpForClarification}
      />

      {/* Modal Tinjau Klarifikasi SP oleh DPM */}
      <ReviewSPClarificationModal
        isOpen={Boolean(selectedSpForReview)}
        onClose={() => setSelectedSpForReview(null)}
        sp={selectedSpForReview}
      />
    </div>
  );
}
