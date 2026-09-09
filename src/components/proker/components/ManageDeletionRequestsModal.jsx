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
  Trash2, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Calendar, 
  Building2, 
  Clock, 
  MessageSquare 
} from 'lucide-react';

export default function ManageDeletionRequestsModal({ isOpen, onClose }) {
  const { deletionRequests, approveProkerDeletion, rejectProkerDeletion, ormawas } = useStore();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reviewNote, setReviewNote] = useState('');
  const [actionType, setActionType] = useState(null); // 'approve' | 'reject'
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
              const ormawa = ormawas.find(o => o.id === req.ormawaId);
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

                  {/* Inline Action Confirmation Form */}
                  {isSelected && (
                    <div className="mt-4 pt-3.5 border-t border-slate-200/80 space-y-2.5 bg-slate-50/80 -mx-4 -mb-4 p-4 rounded-b-2xl animate-in fade-in duration-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">
                          Konfirmasi Keputusan DPM: {' '}
                          <span className={actionType === 'approve' ? 'text-rose-600' : 'text-slate-700'}>
                            {actionType === 'approve' ? 'Setujui Pembatalan Proker' : 'Tolak Permohonan (Proker Tetap Aktif)'}
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
