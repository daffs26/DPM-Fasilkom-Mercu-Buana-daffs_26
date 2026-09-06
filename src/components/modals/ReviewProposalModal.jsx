import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { 
  X, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Download, 
  Plus, 
  Trash2, 
  CheckSquare, 
  Square,
  Sparkles,
  ListTodo
} from 'lucide-react';

const COMMON_REVISION_PRESETS = [
  'Perbaiki rincian biaya konsumsi di RAB',
  'Lampirkan rundown rinci & PJ per sesi',
  'Lengkapi susunan panitia & kontak penanggung jawab',
  'Sertakan bukti konfirmasi pembicara / narasumber',
  'Sesuaikan target peserta dengan kapasitas ruangan'
];

export default function ReviewProposalModal({ isOpen, onClose, proker }) {
  const { 
    reviewProposal, 
    addProposalRevisionItem, 
    toggleProposalRevisionItem, 
    deleteProposalRevisionItem,
    currentUserName 
  } = useStore();

  const [noteText, setNoteText] = useState('');
  const [newRevisionInput, setNewRevisionInput] = useState('');

  if (!isOpen || !proker) return null;

  const proposal = proker.proposal;
  const revisionItems = proposal?.revisionItems || [];
  const totalItems = revisionItems.length;
  const completedItems = revisionItems.filter(i => i.completed).length;
  const pendingItems = totalItems - completedItems;
  const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const handleAddRevisionItem = (textToAdd) => {
    const text = (textToAdd || newRevisionInput).trim();
    if (!text) return;
    addProposalRevisionItem(proker.id, text);
    setNewRevisionInput('');
  };

  const handleAction = (status) => {
    if (status === 'approved' && pendingItems > 0) {
      const confirmApprove = window.confirm(
        `Masih ada ${pendingItems} butir revisi yang belum ditandai selesai oleh ormawa.\n\nApakah Anda yakin ingin tetap menyetujui (ACC) proposal ini?`
      );
      if (!confirmApprove) return;
    }

    reviewProposal(proker.id, status, noteText);
    setNoteText('');
    setNewRevisionInput('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
                DPM FASILKOM
              </span>
              <span className="text-xs text-slate-500 font-semibold">Review &amp; Validasi Proposal</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-1 leading-snug">
              {proker.title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ormawa: <strong>{proker.ormawaId.toUpperCase()}</strong> • Divisi: {proker.divisi || 'Umum'} • PJ: {proker.pic || '-'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center transition shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs">
          {/* File Card & SLA Tag */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0 shadow-2xs">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="font-extrabold text-slate-900 text-xs truncate">
                  {proposal?.fileName || 'Proposal_Kegiatan.pdf'}
                </p>
                <p className="text-[11px] text-slate-500">
                  Diunggah: {proposal?.uploadDate || 'Belum diunggah'} • {proposal?.fileSize || '2.4 MB'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert(`Mengunduh file proposal: ${proposal?.fileName || 'proposal.pdf'}`)}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs transition cursor-pointer shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Unduh Berkas</span>
            </button>
          </div>

          {/* SLA Indicator */}
          {proposal?.isDadakan ? (
            <div className="p-3.5 bg-red-50/80 border border-red-200 rounded-2xl flex items-start gap-2.5 text-red-800">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-black uppercase text-[10px] tracking-wider text-red-700 block">
                  ⚠️ Status Pengajuan: Terlambat (&lt; H-14)
                </span>
                <p className="text-[11px] text-red-700/90 mt-0.5 leading-relaxed">
                  Proposal diajukan kurang dari batas waktu 14 hari sebelum hari-H. Catatan keterlambatan ini terarsip di evaluasi kepatuhan DPM.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-xs text-emerald-800">
                  ✓ Pengajuan Tepat Waktu (≥ H-14)
                </span>
                <p className="text-[11px] text-emerald-600">
                  Proposal mematuhi standar tenggat regulasi DPM FASILKOM UMB.
                </p>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* FITUR 3: DAFTAR POIN REVISI INTERAKTIF (ITEMIZED CHECKLIST)              */}
          {/* ========================================================================= */}
          <div className="p-4 rounded-2xl border border-amber-200/80 bg-amber-50/30 space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ListTodo className="w-4 h-4 text-amber-600" />
                <h4 className="font-black text-xs text-slate-900">
                  Daftar Poin Revisi Interaktif DPM
                </h4>
              </div>
              {totalItems > 0 && (
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                    pendingItems === 0 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}>
                    {completedItems} dari {totalItems} Selesai ({progressPercent}%)
                  </span>
                </div>
              )}
            </div>

            {/* Progress bar jika ada item */}
            {totalItems > 0 && (
              <div className="w-full bg-slate-200/70 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${pendingItems === 0 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            )}

            {/* List Poin Revisi */}
            {totalItems > 0 ? (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {revisionItems.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className={`p-3 rounded-xl border transition-all flex items-start justify-between gap-2.5 ${
                      item.completed 
                        ? 'bg-emerald-50/50 border-emerald-200/70 text-slate-500' 
                        : 'bg-white border-amber-200 text-slate-900 shadow-2xs'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleProposalRevisionItem(proker.id, item.id)}
                      className="mt-0.5 text-slate-400 hover:text-emerald-600 transition shrink-0 cursor-pointer"
                      title={item.completed ? 'Tandai belum selesai' : 'Tandai sudah diperbaiki'}
                    >
                      {item.completed ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Square className="w-4 h-4 text-amber-500 hover:text-amber-600" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold leading-snug ${item.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                        {item.text}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                        <span>Oleh: {item.addedBy || 'DPM'}</span>
                        <span>•</span>
                        <span>{item.date || 'Hari ini'}</span>
                        {item.completed && (
                          <span className="text-emerald-700 font-bold bg-emerald-100/60 px-1.5 py-0.2 rounded">
                            ✓ Telah Diperbaiki
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteProposalRevisionItem(proker.id, item.id)}
                      className="p-1 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition shrink-0 cursor-pointer"
                      title="Hapus butir revisi ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 text-center bg-white/70 rounded-xl border border-dashed border-amber-200 text-slate-500 text-xs">
                Belum ada butir revisi spesifik. Tulis poin baru atau pilih dari rekomendasi cepat di bawah.
              </div>
            )}

            {/* Form Input Tambah Poin Baru */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleAddRevisionItem();
              }}
              className="flex items-center gap-2 pt-1"
            >
              <input
                type="text"
                value={newRevisionInput}
                onChange={(e) => setNewRevisionInput(e.target.value)}
                placeholder="Tulis butir revisi baru (mis: Perbaiki rincian konsumsi di RAB)..."
                className="flex-1 bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="submit"
                disabled={!newRevisionInput.trim()}
                className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs shadow-xs transition flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Poin</span>
              </button>
            </form>

            {/* Quick Chips Preset */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-800">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Rekomendasi Poin Revisi Cepat:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_REVISION_PRESETS.map((preset, idx) => (
                  <button
                    key={`preset-${idx}`}
                    type="button"
                    onClick={() => handleAddRevisionItem(preset)}
                    className="text-[10px] font-semibold bg-white hover:bg-amber-100/60 border border-amber-200 text-slate-700 hover:text-amber-900 px-2.5 py-1 rounded-lg transition cursor-pointer text-left"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form Input Catatan Tambahan / Arahan Umum DPM */}
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">
              Catatan &amp; Arahan Umum DPM (Opsional):
            </label>
            <textarea
              rows={2}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Tambahkan pesan pengantar atau batas waktu perbaikan untuk pengurus ormawa..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Riwayat Catatan Review Lama */}
          {proposal?.notes && proposal.notes.length > 0 && (
            <div className="space-y-2">
              <label className="font-bold text-slate-700 block text-[11px]">
                Riwayat Catatan Review Sebelumnya:
              </label>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {proposal.notes.map((n) => (
                  <div key={n.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-slate-900 text-[11px]">{n.author}</span>
                      <span className="text-[10px] text-slate-400">{n.date}</span>
                    </div>
                    <p className="text-slate-600 text-xs">{n.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Buttons */}
        <div className="p-4 sm:p-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/70 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            Tutup
          </button>
          
          <div className="w-full sm:w-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleAction('revisi')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition cursor-pointer active:scale-95"
            >
              <AlertCircle className="w-4 h-4" />
              <span>Minta Revisi Proposal</span>
            </button>

            <button
              type="button"
              onClick={() => handleAction('approved')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition cursor-pointer active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Setujui (ACC Ketua DPM)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

