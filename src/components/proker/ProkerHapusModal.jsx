import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { useShallow } from 'zustand/react/shallow';
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
  AlertTriangle, 
  Trash2, 
  Send, 
  HelpCircle, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';

const REASON_CATEGORIES = [
  'Perubahan Kalender Akademik Kampus',
  'Kendala Finansial & Keterbatasan Sponsor',
  'Penggabungan / Merger dengan Proker Lain',
  'Keterbatasan Sumber Daya & Panitia',
  'Kebijakan Internal Ormawa / Pimpinan Fakultas',
  'Lainnya'
];

/**
 * 1. AjukanHapusProkerModal (Khusus Eksekutif Ormawa)
 */
export function AjukanHapusProkerModal({ isOpen, onClose, proker }) {
  const requestProkerDeletion = useStore(state => state.requestProkerDeletion);
  const [reasonCategory, setReasonCategory] = useState(REASON_CATEGORIES[0]);
  const [reasonDetails, setReasonDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!proker) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!reasonDetails.trim()) {
      setError('Mohon berikan rincian penjelasan alasan pembatalan/penghapusan proker.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = requestProkerDeletion({
        prokerId: proker.id,
        reasonCategory,
        reasonDetails: reasonDetails.trim()
      });

      setLoading(false);
      if (res.success) {
        onClose();
      } else {
        setError(res.message || 'Gagal mengajukan permohonan.');
      }
    }, 400);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-lg p-0 overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-2xl max-h-[88vh] flex flex-col">
        <DialogHeader className="px-5 sm:px-6 pt-5 pb-4 border-b border-slate-100 bg-rose-50/50 space-y-1.5 shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-extrabold uppercase tracking-wider">
              Permohonan Pembatalan Proker
            </span>
          </div>
          <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>Ajukan Hapus Program Kerja</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Sesuai regulasi pengawasan DPM, penghapusan program kerja harus melalui persetujuan legislatif.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Target Program Kerja</p>
            <h4 className="text-sm font-bold text-slate-900">{proker.title}</h4>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>{proker.divisi || 'Umum'}</span>
              <span>•</span>
              <span>PIC: {proker.pic}</span>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Kategori Alasan Pembatalan</label>
            <select
              value={reasonCategory}
              onChange={(e) => setReasonCategory(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {REASON_CATEGORIES.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Rincian Alasan &amp; Pertimbangan Internal Ormawa <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={reasonDetails}
              onChange={(e) => setReasonDetails(e.target.value)}
              placeholder="Jelaskan alasan pembatalan secara mendalam..."
              className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none shadow-2xs"
            />
          </div>

          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-900 leading-relaxed">
              Setelah diajukan, status proker akan berubah menjadi <strong>"Menunggu ACC Hapus DPM"</strong>.
            </p>
          </div>

          <DialogFooter className="pt-2 flex flex-row items-center justify-end gap-2 shrink-0 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl h-10 text-xs font-bold"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-xl h-10 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
            >
              {loading ? 'Mengirim Permohonan...' : (
                <div className="flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Permohonan ke DPM</span>
                </div>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/**
 * 2. KelolaHapusProkerModal (Khusus DPM)
 */
export function KelolaHapusProkerModal({ isOpen, onClose }) {
  const { deletionRequests, approveProkerDeletion, rejectProkerDeletion } = useStore(useShallow(state => ({ 
    deletionRequests: state.deletionRequests, 
    approveProkerDeletion: state.approveProkerDeletion, 
    rejectProkerDeletion: state.rejectProkerDeletion 
  })));
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reviewNote, setReviewNote] = useState('');
  const [actionType, setActionType] = useState(null);
  const [loading, setLoading] = useState(false);

  const pendingRequests = (deletionRequests || []).filter(r => r.status === 'pending');

  const handleConfirmAction = () => {
    if (!selectedRequest || !actionType) return;

    setLoading(true);
    setTimeout(() => {
      if (actionType === 'approve') {
        approveProkerDeletion(selectedRequest.id, reviewNote.trim());
      } else {
        rejectProkerDeletion(selectedRequest.id, reviewNote.trim() || 'Permohonan ditolak oleh DPM');
      }

      setLoading(false);
      setSelectedRequest(null);
      setActionType(null);
      setReviewNote('');
    }, 350);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-2xl p-0 overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-2xl max-h-[85vh] flex flex-col">
        <DialogHeader className="px-5 sm:px-6 pt-5 pb-4 border-b border-slate-100 bg-slate-50/70 space-y-1.5 shrink-0">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 text-[10px] font-bold">
              KOMISI PENGAWASAN DPM
            </Badge>
            <span className="text-xs font-semibold text-slate-500">
              Antrean Permohonan: {pendingRequests.length}
            </span>
          </div>
          <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-rose-600 shrink-0" />
            <span>Verifikasi Permohonan Hapus Proker</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Tinjau permohonan pembatalan/penghapusan program kerja yang diajukan oleh pengurus ormawa.
          </DialogDescription>
        </DialogHeader>

        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {pendingRequests.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto opacity-80" />
              <h4 className="text-sm font-bold text-slate-800">Tidak Ada Antrean Permohonan Hapus</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Semua proker ormawa saat ini tercatat aktif tanpa ada permohonan pembatalan yang tertunda.
              </p>
            </div>
          ) : (
            pendingRequests.map((req) => {
              const isSelected = selectedRequest?.id === req.id;

              return (
                <div 
                  key={req.id} 
                  className={`p-4 rounded-2xl border transition-all ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50/20 ring-2 ring-blue-500/10' 
                      : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider">
                          {req.ormawaName}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Diajukan oleh: <strong className="text-slate-700">{req.requesterName}</strong>
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">{req.prokerTitle}</h4>
                      
                      <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1 text-xs mt-2">
                        <span className="font-bold text-slate-700 block text-[11px]">
                          Kategori: <span className="text-rose-700 font-semibold">{req.reasonCategory}</span>
                        </span>
                        <p className="text-slate-600 leading-relaxed italic">
                          "{req.reasonDetails}"
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:shrink-0 mt-2 sm:mt-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedRequest(req);
                          setActionType('reject');
                          setReviewNote('');
                        }}
                        className="h-9 px-3 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold"
                      >
                        <XCircle className="w-4 h-4 mr-1.5 text-red-500" />
                        <span>Tolak</span>
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedRequest(req);
                          setActionType('approve');
                          setReviewNote('');
                        }}
                        className="h-9 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
                      >
                        <CheckCircle className="w-4 h-4 mr-1.5" />
                        <span>Setujui Hapus (ACC)</span>
                      </Button>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="mt-4 pt-3.5 border-t border-slate-200/80 space-y-2.5 bg-slate-50/80 -mx-4 -mb-4 p-4 rounded-b-2xl animate-in fade-in duration-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">
                          Konfirmasi Keputusan DPM: {' '}
                          <span className={actionType === 'approve' ? 'text-rose-600' : 'text-slate-700'}>
                            {actionType === 'approve' ? 'Setujui Pembatalan Proker' : 'Tolak Permohonan'}
                          </span>
                        </span>
                        <button
                          onClick={() => { setSelectedRequest(null); setActionType(null); }}
                          className="text-[11px] text-slate-400 hover:text-slate-600 font-bold"
                        >
                          Tutup
                        </button>
                      </div>

                      <textarea
                        rows={2}
                        value={reviewNote}
                        onChange={(e) => setReviewNote(e.target.value)}
                        placeholder={actionType === 'approve' ? "Catatan legislatif penutupan proker (opsional)..." : "Wajib jelaskan alasan DPM menolak permohonan pembatalan..."}
                        className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none shadow-2xs"
                      />

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => { setSelectedRequest(null); setActionType(null); }}
                          className="h-8 text-xs font-semibold rounded-lg"
                        >
                          Batal
                        </Button>
                        <Button
                          size="sm"
                          disabled={loading || (actionType === 'reject' && !reviewNote.trim())}
                          onClick={handleConfirmAction}
                          className={`h-8 px-4 text-xs font-bold rounded-lg text-white ${
                            actionType === 'approve' 
                              ? 'bg-rose-600 hover:bg-rose-700' 
                              : 'bg-slate-900 hover:bg-slate-800'
                          }`}
                        >
                          {loading ? 'Memproses...' : (actionType === 'approve' ? 'Ya, Hapus Proker Permanen' : 'Kirim Penolakan')}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default KelolaHapusProkerModal;
