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
  UploadCloud, 
  FileText, 
  CheckSquare, 
  Square, 
  ListTodo, 
  Send, 
  AlertCircle,
  FileCheck,
  Sparkles
} from 'lucide-react';

export default function SubmitRevisionModal({ isOpen, onClose, proker, docType = 'proposal' }) {
  const { submitProposalRevision, submitLpjRevision, toggleProposalRevisionItem } = useStore(useShallow(state => ({ submitProposalRevision: state.submitProposalRevision, submitLpjRevision: state.submitLpjRevision, toggleProposalRevisionItem: state.toggleProposalRevisionItem })));
  const [file, setFile] = useState(null);
  const [changelogNotes, setChangelogNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!proker) return null;

  const targetDoc = docType === 'lpj' ? proker.lpj : proker.proposal;
  const revisionItems = targetDoc?.revisionItems || [];
  const completedCount = revisionItems.filter(i => i.completed).length;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!changelogNotes.trim()) {
      setError('Mohon tuliskan ringkasan perbaikan/tanggapan revisi untuk DPM.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const fileInfo = file ? {
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      } : null;

      let res;
      if (docType === 'lpj') {
        res = submitLpjRevision(proker.id, fileInfo, changelogNotes.trim());
      } else {
        res = submitProposalRevision(proker.id, fileInfo, changelogNotes.trim());
      }

      setLoading(false);
      if (res.success) {
        onClose();
        setFile(null);
        setChangelogNotes('');
      } else {
        setError(res.message || 'Gagal mengirim revisi.');
      }
    }, 450);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-xl p-0 overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="px-5 sm:px-6 pt-5 pb-4 border-b border-slate-100 bg-blue-50/50 space-y-1.5 shrink-0">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 text-[10px] font-bold uppercase tracking-wider">
              {docType === 'lpj' ? 'REVISI LPJ KEGIATAN' : 'REVISI PROPOSAL KEGIATAN'}
            </Badge>
            <span className="text-xs font-semibold text-slate-500">
              Versi Berikutnya: v{(targetDoc?.version || 1) + 1}
            </span>
          </div>
          <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-blue-600 shrink-0" />
            <span>Unggah Berkas Revisi &amp; Ajukan Ulang</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Kirimkan draf perbaikan proposal yang telah disesuaikan dengan masukan dan checklist DPM.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Target Proker Info */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Program Kerja</p>
            <h4 className="text-sm font-bold text-slate-900">{proker.title}</h4>
            <p className="text-xs text-slate-500 font-medium">{proker.divisi || 'Umum'} • PIC: {proker.pic}</p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Checklist Revisi DPM */}
          {revisionItems.length > 0 && (
            <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <ListTodo className="w-4 h-4 text-amber-600" />
                  <span>Poin Checklist Perbaikan dari DPM:</span>
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                  {completedCount} dari {revisionItems.length} Selesai
                </span>
              </div>

              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {revisionItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleProposalRevisionItem(proker.id, item.id)}
                    className={`p-2.5 rounded-xl border transition cursor-pointer flex items-start gap-2.5 select-none ${
                      item.completed 
                        ? 'bg-emerald-50 border-emerald-200 text-slate-500' 
                        : 'bg-white border-amber-200 text-slate-900 shadow-2xs hover:border-amber-400'
                    }`}
                  >
                    <span className="mt-0.5 shrink-0">
                      {item.completed ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Square className="w-4 h-4 text-amber-500" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs ${item.completed ? 'line-through text-slate-400 font-normal' : 'font-semibold text-slate-800'}`}>
                        {item.text}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        {item.completed ? '✓ Selesai diperbaiki' : 'Klik jika sudah diperbaiki'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Berkas Baru */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Unggah Dokumen Hasil Revisi (PDF / DOCX)
            </label>
            <div className="p-4 rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-500 transition-colors bg-white text-center space-y-2 cursor-pointer relative">
              <input
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  {file ? file.name : 'Pilih berkas revisi baru atau seret ke sini'}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB • Berkas siap diunggah` : 'Format didukung: PDF, DOCX (Maksimal 10MB)'}
                </p>
              </div>
            </div>
          </div>

          {/* Ringkasan Perbaikan / Changelog Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Catatan Perubahan / Rangkuman Revisi <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={changelogNotes}
              onChange={(e) => setChangelogNotes(e.target.value)}
              placeholder="Contoh: Lampiran RAB telah dirinci ulang, rundown hari ke-2 disesuaikan dengan izin ruangan rektorat, susunan panitia diperbarui..."
              className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none shadow-2xs"
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
              type="submit"
              disabled={loading}
              className="rounded-xl h-10 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
            >
              {loading ? 'Mengunggah Revisi...' : (
                <div className="flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Revisi ke DPM</span>
                </div>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
