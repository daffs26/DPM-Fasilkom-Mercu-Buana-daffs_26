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
  AlertOctagon, 
  Send, 
  UploadCloud, 
  FileText, 
  Calendar, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

export default function SPClarificationModal({ isOpen, onClose, sp }) {
  const { submitSPClarification, currentUser } = useStore(useShallow(state => ({ submitSPClarification: state.submitSPClarification, currentUser: state.currentUser })));
  const [text, setText] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!sp) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!text.trim()) {
      setError('Mohon berikan uraian penjelasan/klarifikasi atas Surat Peringatan ini.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = submitSPClarification(sp.id, {
        text: text.trim(),
        targetDate,
        fileName: file ? file.name : 'Surat_Tanggapan_SP.pdf',
        fileSize: file ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : '1.5 MB'
      });

      setLoading(false);
      if (res.success) {
        onClose();
        setText('');
        setTargetDate('');
        setFile(null);
      } else {
        setError(res.message || 'Gagal mengirim klarifikasi.');
      }
    }, 400);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-xl p-0 overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="px-5 sm:px-6 pt-5 pb-4 border-b border-slate-100 bg-rose-50/40 space-y-1.5 shrink-0">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-rose-100 text-rose-800 border-rose-200 text-[10px] font-bold uppercase tracking-wider">
              TANGGAPAN FORMAL ORMAWA
            </Badge>
            <span className="text-xs font-semibold text-slate-500">
              SP {sp.level} • {sp.ormawaName}
            </span>
          </div>
          <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0" />
            <span>Kirim Tanggapan &amp; Klarifikasi SP</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Sampaikan penjelasan kendala administratif serta komitmen batas waktu penyelesaian kepada DPM.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* SP Summary Card */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono text-[10px] text-slate-600">No: {sp.noSurat}</span>
              <span className="font-bold text-rose-700">SP {sp.level}</span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">{sp.title}</h4>
            <p className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200/70">
              <strong>Dasar Pelanggaran DPM:</strong> "{sp.reason}"
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Uraian Klarifikasi */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Uraian Klarifikasi Kendala &amp; Alasan Keterlambatan <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Jelaskan secara detail kendala yang dihadapi (misal: keterlambatan pengumpulan kuitansi dari pihak ketiga, perubahan jadwal pembicara, dsb)..."
              className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-600 resize-none shadow-2xs"
            />
          </div>

          {/* Komitmen Tanggal Penyelesaian */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Komitmen Batas Waktu Pemenuhan Berkas / LPJ
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-600 shadow-2xs"
            />
            <p className="text-[10px] text-slate-400">
              Tentukan tenggat waktu maksimal ormawa Anda akan menyelesaikan kewajiban laporan pertanggungjawaban.
            </p>
          </div>

          {/* Upload Surat Tanggapan / Bukti */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Unggah Surat Tanggapan Resmi / Berkas Bukti Pendukung (PDF)
            </label>
            <div className="p-4 rounded-2xl border-2 border-dashed border-slate-300 hover:border-rose-400 transition bg-white text-center space-y-1.5 cursor-pointer relative">
              <input
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-800">
                {file ? file.name : 'Pilih Surat Tanggapan Resmi Ormawa'}
              </p>
              <p className="text-[10px] text-slate-400">
                {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB • Terpilih` : 'Format PDF atau scan surat bertanda tangan ketua ormawa'}
              </p>
            </div>
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
              type="submit"
              disabled={loading}
              className="rounded-xl h-10 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
            >
              {loading ? 'Mengirim Tanggapan...' : (
                <div className="flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Tanggapan ke DPM</span>
                </div>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
