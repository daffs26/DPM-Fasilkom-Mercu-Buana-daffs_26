import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { X, FileText, CheckCircle2, AlertCircle, AlertTriangle, Send, Download } from 'lucide-react';

export default function ReviewProposalModal({ isOpen, onClose, proker }) {
  const { reviewProposal, currentUserName } = useStore();
  const [noteText, setNoteText] = useState('');

  if (!isOpen || !proker) return null;

  const proposal = proker.proposal;

  const handleAction = (status) => {
    reviewProposal(proker.id, status, noteText);
    setNoteText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded">
                DPM FASILKOM
              </span>
              <span className="text-xs text-slate-600 font-medium">Review & Validasi Proposal</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight mt-1">
              {proker.title}
            </h3>
            <p className="text-xs text-slate-600">
              Penyelenggara: <strong>{proker.ormawaId.toUpperCase()}</strong> • Divisi: {proker.divisi}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* File Card & SLA Tag */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-xs">
                  {proposal?.fileName || 'Proposal_Kegiatan.pdf'}
                </p>
                <p className="text-[11px] text-slate-600">
                  Diunggah pada: {proposal?.uploadDate || 'Belum diunggah'} • {proposal?.fileSize || '2.4 MB'}
                </p>
              </div>
            </div>

            <button
              onClick={() => alert(`Mengunduh file: ${proposal?.fileName || 'proposal.pdf'}`)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh</span>
            </button>
          </div>

          {/* SLA Indicator: Terlambat vs Tepat Waktu */}
          {proposal?.isDadakan ? (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-red-800">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold uppercase text-[11px] tracking-wider text-red-700 block">
                  ⚠️ STATUS: PENGAJUAN TERLAMBAT (&lt; H-14)
                </span>
                <p className="text-[11px] text-red-700 mt-0.5 leading-relaxed">
                  Proposal ini diajukan kurang dari 14 hari sebelum pelaksanaan kegiatan (&lt; H-14). Ketidakpatuhan batas waktu pengajuan ini tercatat pada evaluasi kinerja ormawa.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-xs text-emerald-700">
                  ✓ Status: Pengajuan Tepat Waktu (≥ H-14)
                </span>
                <p className="text-[11px] text-emerald-600">
                  Ormawa mematuhi standar tenggat waktu pengajuan proposal DPM Fasilkom.
                </p>
              </div>
            </div>
          )}

          {/* Riwayat Catatan Revisi */}
          <div>
            <label className="font-bold text-slate-700 block mb-2">
              Riwayat Catatan Review DPM:
            </label>
            {proposal?.notes && proposal.notes.length > 0 ? (
              <div className="space-y-2">
                {proposal.notes.map((n) => (
                  <div key={n.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 text-xs">{n.author}</span>
                      <span className="text-[10px] text-slate-600">{n.date}</span>
                    </div>
                    <p className="text-slate-700 text-xs">{n.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-600 italic text-xs p-3 bg-slate-50 rounded-xl">
                Belum ada catatan review sebelumnya.
              </p>
            )}
          </div>

          {/* Form Input Catatan Baru dari DPM */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">
              Tulis Catatan / Poin Revisi DPM:
            </label>
            <textarea
              rows={3}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder=""
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-slate-100 flex items-center justify-between gap-3 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
          >
            Tutup
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleAction('revisi')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Minta Revisi</span>
            </button>
            <button
              type="button"
              onClick={() => handleAction('approved')}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition active:scale-95"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Setujui (ACC Ketua DPM)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
