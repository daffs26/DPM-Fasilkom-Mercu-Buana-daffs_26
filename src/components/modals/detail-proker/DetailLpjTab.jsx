import React from 'react';
import { 
  FileCheck, 
  FileText, 
  Download, 
  ShieldCheck, 
  Edit3, 
  ListTodo, 
  CheckSquare, 
  Square 
} from 'lucide-react';

export default function DetailLpjTab({
  proker,
  isLPJUploaded,
  isLPJOverdue,
  lpjDeadline,
  onAuditLPJ,
  onReviewProposal,
  toggleProposalRevisionItem
}) {
  return (
    <div className="space-y-4">
      {/* Bagian LPJ */}
      <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-600" />
            <h4 className="font-extrabold text-xs text-slate-900">
              Laporan Pertanggungjawaban (LPJ)
            </h4>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            isLPJUploaded 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
              : isLPJOverdue 
              ? 'bg-red-50 text-red-700 border-red-300' 
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}>
            {isLPJUploaded ? 'LPJ Sudah Diunggah' : isLPJOverdue ? 'Terlambat (> H+14)' : 'Menunggu LPJ'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 bg-white rounded-xl border border-slate-200/60">
            <span className="text-[10px] text-slate-400 font-bold block">Tenggat Waktu SLA LPJ:</span>
            <span className="font-bold text-slate-800">{lpjDeadline}</span>
          </div>
          <div className="p-2.5 bg-white rounded-xl border border-slate-200/60">
            <span className="text-[10px] text-slate-400 font-bold block">Status Skor Audit DPM:</span>
            <span className="font-black text-slate-900">
              {proker.lpj?.auditScore ? `${proker.lpj.auditScore} / 100 (Lulus Audit)` : 'Belum Diaudit'}
            </span>
          </div>
        </div>

        {proker.lpj?.fileName && (
          <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="font-bold text-slate-900 block">{proker.lpj.fileName}</span>
                <span className="text-[10px] text-slate-400">Diunggah: {proker.lpj.uploadDate || '-'}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => alert(`Mengunduh file: ${proker.lpj.fileName}`)}
              className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              <span>Unduh</span>
            </button>
          </div>
        )}

        <div className="pt-1 flex items-center justify-end">
          <button
            type="button"
            onClick={() => onAuditLPJ && onAuditLPJ(proker)}
            className="w-full sm:w-auto justify-center px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer text-center"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{proker.lpj?.auditScore ? 'Lihat Lembar Audit LPJ' : 'Buka Form Audit LPJ'}</span>
          </button>
        </div>
      </div>

      {/* Bagian Proposal */}
      <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <h4 className="font-extrabold text-xs text-slate-900">
              Berkas Proposal Kegiatan
            </h4>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            proker.status === 'proposal_revisi' || proker.proposal?.reviewStatus === 'revisi'
              ? 'bg-amber-50 text-amber-800 border-amber-300'
              : proker.proposal?.reviewStatus === 'approved'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : proker.proposal?.fileName 
              ? 'bg-blue-50 text-blue-700 border-blue-200' 
              : 'bg-slate-100 text-slate-600 border-slate-200'
          }`}>
            {proker.status === 'proposal_revisi' || proker.proposal?.reviewStatus === 'revisi'
              ? '⚠️ Perlu Revisi DPM'
              : proker.proposal?.reviewStatus === 'approved'
              ? '✓ Proposal Disetujui (ACC)'
              : proker.proposal?.fileName 
              ? 'Menunggu Review' 
              : 'Belum Ada Berkas'}
          </span>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="w-4 h-4 text-blue-600 shrink-0" />
            <div className="min-w-0">
              <span className="font-bold text-slate-900 block truncate text-xs">
                {proker.proposal?.fileName || 'Proposal_Kegiatan.pdf'}
              </span>
              <span className="text-[10px] text-slate-400 block">
                {proker.proposal?.uploadDate ? `Diunggah: ${proker.proposal.uploadDate} • ${proker.proposal?.fileSize || '2.4 MB'}` : 'Menunggu pengunggahan berkas sah'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {proker.proposal?.fileName && (
              <button
                type="button"
                onClick={() => alert(`Mengunduh file: ${proker.proposal.fileName}`)}
                className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1 transition"
              >
                <Download className="w-3 h-3 text-slate-500" />
                <span>Unduh</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => onReviewProposal && onReviewProposal(proker)}
              className="w-full sm:w-auto justify-center px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
            >
              <Edit3 className="w-3 h-3" />
              <span>{proker.proposal?.fileName ? 'Review & Validasi' : 'Upload Proposal'}</span>
            </button>
          </div>
        </div>

        {/* Checklist Poin Revisi DPM (Jika Ada) */}
        {((proker.proposal?.revisionItems && proker.proposal.revisionItems.length > 0) || proker.status === 'proposal_revisi') && (
          <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-xs text-amber-900">
                <ListTodo className="w-3.5 h-3.5 text-amber-600" />
                <span>Daftar Poin Revisi dari DPM:</span>
              </div>
              {proker.proposal?.revisionItems?.length > 0 && (
                <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100/70 border border-amber-300 px-2 py-0.5 rounded-full">
                  {proker.proposal.revisionItems.filter(i => i.completed).length} dari {proker.proposal.revisionItems.length} Selesai
                </span>
              )}
            </div>

            {proker.proposal?.revisionItems && proker.proposal.revisionItems.length > 0 ? (
              <div className="space-y-1.5">
                {proker.proposal.revisionItems.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    onClick={() => toggleProposalRevisionItem(proker.id, item.id)}
                    className={`p-2.5 rounded-lg border transition cursor-pointer flex items-start gap-2 select-none ${
                      item.completed 
                        ? 'bg-emerald-50/60 border-emerald-200 text-slate-500' 
                        : 'bg-white border-amber-200/80 text-slate-900 shadow-2xs hover:border-amber-400'
                    }`}
                  >
                    <span className="mt-0.5 shrink-0">
                      {item.completed ? (
                        <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-amber-500" />
                      )}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs ${item.completed ? 'line-through text-slate-400 font-normal' : 'font-semibold text-slate-800'}`}>
                        {item.text}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span>Oleh {item.addedBy || 'DPM'}</span>
                        {item.completed && (
                          <span className="text-emerald-700 font-bold">✓ Selesai Diperbaiki</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-amber-800 italic">
                Proposal ditandai perlu revisi. DPM belum menambahkan butir spesifik di checklist.
              </p>
            )}

            {/* Catatan Umum DPM */}
            {proker.proposal?.notes && proker.proposal.notes.length > 0 && (
              <div className="pt-2 border-t border-amber-200/60 text-[11px] text-slate-600 space-y-1">
                <span className="font-bold text-slate-700 block">Catatan Umum DPM:</span>
                {proker.proposal.notes.slice(-2).map((n) => (
                  <p key={n.id} className="bg-white/80 p-2 rounded-lg border border-amber-100 text-slate-700">
                    <strong>{n.author}:</strong> "{n.text}"
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
