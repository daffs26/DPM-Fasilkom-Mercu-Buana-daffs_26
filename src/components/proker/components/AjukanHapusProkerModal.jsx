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
import { AlertTriangle, Trash2, Send, HelpCircle, FileText } from 'lucide-react';

const REASON_CATEGORIES = [
  'Perubahan Kalender Akademik Kampus',
  'Kendala Finansial & Keterbatasan Sponsor',
  'Penggabungan / Merger dengan Proker Lain',
  'Keterbatasan Sumber Daya & Panitia',
  'Kebijakan Internal Ormawa / Pimpinan Fakultas',
  'Lainnya'
];

export default function RequestDeleteProkerModal({ isOpen, onClose, proker }) {
  const { requestProkerDeletion, currentUser } = useStore(useShallow(state => ({ requestProkerDeletion: state.requestProkerDeletion, currentUser: state.currentUser })));
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
          {/* Target Proker Preview Card */}
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

          {/* Kategori Alasan */}
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

          {/* Rincian Alasan */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Rincian Alasan &amp; Pertimbangan Internal Ormawa <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={reasonDetails}
              onChange={(e) => setReasonDetails(e.target.value)}
              placeholder="Jelaskan alasan pembatalan secara mendalam untuk pertimbangan sidang/verifikasi Komisi Pengawasan DPM..."
              className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none shadow-2xs"
            />
          </div>

          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-900 leading-relaxed">
              Setelah diajukan, status proker akan berubah menjadi <strong>"Menunggu ACC Hapus DPM"</strong>. Ketua/Wakil DPM akan meninjau dan memutuskan apakah pembatalan disahkan atau dikembalikan.
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
