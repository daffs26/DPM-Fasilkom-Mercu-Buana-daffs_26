import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Calendar, 
  Clock, 
  AlertOctagon,
  User,
  ExternalLink
} from 'lucide-react';

export default function ReviewSPClarificationModal({ isOpen, onClose, sp }) {
  const { reviewSPClarification } = useStore();
  const [reviewNotes, setReviewNotes] = useState('');
  const [decision, setDecision] = useState('approved'); // 'approved' | 'rejected'
  const [loading, setLoading] = useState(false);

  if (!sp || !sp.clarification) return null;

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      reviewSPClarification(sp.id, {
        decision,
        reviewNotes: reviewNotes.trim()
      });
      setLoading(false);
      onClose();
    }, 400);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-xl p-0 overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="px-5 sm:px-6 pt-5 pb-4 border-b border-slate-100 bg-slate-50/70 space-y-1.5 shrink-0">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 text-[10px] font-bold uppercase tracking-wider">
              EVALUASI TANGGAPAN SP
            </Badge>
            <span className="text-xs font-semibold text-slate-500">
              {sp.ormawaName}
            </span>
          </div>
          <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Tinjau Tanggapan SP dari Ormawa</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Periksa surat penjelasan dan komitmen penyelesaian yang diajukan oleh pengurus.
          </DialogDescription>
        </DialogHeader>

        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* SP & Tanggapan Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
              <span className="font-mono text-[11px] text-slate-600">Surat: {sp.noSurat}</span>
              <span className="font-bold text-rose-700">Tingkat: SP {sp.level}</span>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Alasan Pelanggaran DPM</p>
              <p className="text-xs text-slate-700">{sp.reason}</p>
            </div>

            <div className="pt-2 border-t border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-extrabold text-blue-900 uppercase tracking-wider">
                  Uraian Klarifikasi Pengurus Ormawa
                </p>
                <span className="text-[10px] text-slate-400">
                  Diajukan: {sp.clarification.date} oleh {sp.clarification.submittedBy}
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200/90 text-xs text-slate-800 leading-relaxed">
                "{sp.clarification.text}"
              </div>
            </div>

            {sp.clarification.targetDate && (
              <div className="flex items-center gap-2 text-xs text-slate-600 bg-amber-50 p-2.5 rounded-xl border border-amber-200/70">
                <Calendar className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Komitmen Tanggal Penyelesaian: <strong>{sp.clarification.targetDate}</strong></span>
              </div>
            )}

            {sp.clarification.fileName && (
              <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-slate-800 truncate max-w-xs">{sp.clarification.fileName}</span>
                </div>
                <span className="text-[10px] text-slate-400">{sp.clarification.fileSize || '1.5 MB'}</span>
              </div>
            )}
          </div>

          {/* Opsi Keputusan DPM */}
          <div className="space-y-2 pt-1">
            <label className="text-xs font-bold text-slate-800 block">Keputusan Legislatif DPM</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDecision('approved')}
                className={`p-3 rounded-2xl border text-left transition flex items-start gap-2.5 cursor-pointer ${
                  decision === 'approved'
                    ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 mt-0.5 ${decision === 'approved' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <div>
                  <p className="text-xs font-bold text-slate-900">Terima &amp; Selesaikan</p>
                  <p className="text-[10px] text-slate-500 leading-tight mt-0.5">SP ditandai terselesaikan (resolved)</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDecision('rejected')}
                className={`p-3 rounded-2xl border text-left transition flex items-start gap-2.5 cursor-pointer ${
                  decision === 'rejected'
                    ? 'border-rose-500 bg-rose-50/50 ring-2 ring-rose-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <XCircle className={`w-4 h-4 mt-0.5 ${decision === 'rejected' ? 'text-rose-600' : 'text-slate-400'}`} />
                <div>
                  <p className="text-xs font-bold text-slate-900">Tolak Tanggapan</p>
                  <p className="text-[10px] text-slate-500 leading-tight mt-0.5">SP tetap aktif dan berlaku</p>
                </div>
              </button>
            </div>
          </div>

          {/* Catatan Evaluasi DPM */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Catatan Evaluasi / Instruksi DPM kepada Ormawa
            </label>
            <textarea
              rows={2}
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder={decision === 'approved' ? "Catatan penyelesaian SP (opsional)..." : "Wajib berikan instruksi perbaikan mengapa klarifikasi ditolak..."}
              className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none shadow-2xs"
            />
          </div>

          <DialogFooter className="pt-2 flex flex-row items-center justify-end gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl h-10 text-xs font-bold"
            >
              Batal
            </Button>
            <Button
              type="button"
              disabled={loading || (decision === 'rejected' && !reviewNotes.trim())}
              onClick={handleConfirm}
              className={`rounded-xl h-10 text-xs font-bold text-white shadow-xs ${
                decision === 'approved' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              {loading ? 'Memproses...' : (decision === 'approved' ? 'Sahkan Penyelesaian SP' : 'Tolak Tanggapan')}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
