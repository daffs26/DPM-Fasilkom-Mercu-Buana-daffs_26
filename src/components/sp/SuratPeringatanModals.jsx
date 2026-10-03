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
import DropdownSelect from '@/components/ui/dropdown-select';
import { 
  X, 
  AlertOctagon, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  FileText, 
  UploadCloud, 
  Send,
  AlertCircle 
} from 'lucide-react';
import { formatDateIndo } from '@/utils/formatters';

/**
 * 1. TerbitkanSPModal (Wewenang Legislatif DPM)
 */
export function TerbitkanSPModal({ isOpen, onClose }) {
  const { ormawas, prokers, issueSP } = useStore(useShallow(state => ({ 
    ormawas: state.ormawas, 
    prokers: state.prokers, 
    issueSP: state.issueSP 
  })));

  const [ormawaId, setOrmawaId] = useState('bem');
  const [prokerId, setProkerId] = useState('');
  const [level, setLevel] = useState(1);
  const [reason, setReason] = useState(
    'Keterlambatan penyerahan Laporan Pertanggungjawaban (LPJ) yang telah melampaui tenggat waktu H+14 dan belum mengindahkan peringatan berkala DPM.'
  );

  if (!isOpen) return null;

  const availableProkers = prokers.filter(p => p.ormawaId === ormawaId);
  const selectedProker = prokers.find(p => p.id === prokerId) || availableProkers[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    const targetProker = selectedProker || { id: 'umum', title: 'Kedisiplinan Organisasi' };

    issueSP({
      ormawaId,
      prokerId: targetProker.id,
      prokerTitle: targetProker.title,
      level: Number(level),
      reason
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-rose-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 shadow-xs">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded">
                Komisi Pengawasan DPM
              </span>
              <h3 className="text-base font-bold text-slate-900 tracking-tight mt-0.5">
                Terbitkan Surat Peringatan (SP)
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">Ormawa Penerima SP:</label>
            <DropdownSelect
              value={ormawaId}
              onChange={(val) => {
                setOrmawaId(val);
                setProkerId('');
              }}
              options={ormawas.filter(o => o.id !== 'dpm').map(o => ({
                value: o.id,
                label: `${o.name} (${o.shortName})`
              }))}
              triggerClassName="py-2.5 px-3.5 font-bold text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1.5">Kegiatan Terkait:</label>
            <DropdownSelect
              value={prokerId || (availableProkers[0]?.id || 'umum')}
              onChange={(val) => setProkerId(val)}
              options={[
                ...availableProkers.map(p => ({
                  value: p.id,
                  label: `${p.title} (${p.status === 'lpj_overdue' ? 'LPJ Terlambat' : formatDateIndo(p.startDate)})`
                })),
                { value: 'umum', label: 'Evaluasi Kedisiplinan Umum Organisasi' }
              ]}
              triggerClassName="py-2.5 px-3.5 text-xs font-medium"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1.5">Tingkat Surat Peringatan:</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { lvl: 1, label: 'Teguran I (SP 1)', desc: 'Peringatan Awal' },
                { lvl: 2, label: 'SP 2', desc: 'Peringatan Keras' },
                { lvl: 3, label: 'SP 3', desc: 'Sanksi Anggaran' }
              ].map(item => (
                <button
                  key={item.lvl}
                  type="button"
                  onClick={() => setLevel(item.lvl)}
                  className={`p-2.5 rounded-xl border text-center transition ${
                    level === item.lvl
                      ? 'border-red-600 bg-red-50 text-red-700 font-bold shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="block font-bold text-xs">{item.label}</span>
                  <span className="block text-[10px] text-slate-600 mt-0.5">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1.5">Alasan Penerbitan &amp; Pertimbangan DPM:</label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-amber-800">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Surat Peringatan resmi ini akan tercatat dalam Rapor Kinerja Ormawa dan diteruskan ke pihak kemahasiswaan fakultas.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-700/20 transition active:scale-95"
            >
              Terbitkan Surat Peringatan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * 2. ReviewKlarifikasiModal (DPM mengevaluasi respon SP dari ormawa)
 */
export function ReviewKlarifikasiModal({ isOpen, onClose, sp }) {
  const { reviewSPClarification } = useStore(useShallow(state => ({ reviewSPClarification: state.reviewSPClarification })));
  const [reviewNotes, setReviewNotes] = useState('');
  const [decision, setDecision] = useState('approved');
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
              Tinjauan Klarifikasi SP
            </Badge>
            <span className="text-xs font-semibold text-slate-500">{sp.ormawaName}</span>
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

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Catatan Evaluasi / Instruksi DPM</label>
            <textarea
              rows={2}
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder={decision === 'approved' ? "Catatan penyelesaian SP (opsional)..." : "Wajib berikan instruksi perbaikan..."}
              className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none shadow-2xs"
            />
          </div>

          <DialogFooter className="pt-2 flex flex-row items-center justify-end gap-2 shrink-0">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl h-10 text-xs font-bold">
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

/**
 * 3. KlarifikasiSPModal (Ormawa mengirim tanggapan klarifikasi SP)
 */
export function KlarifikasiSPModal({ isOpen, onClose, sp }) {
  const submitSPClarification = useStore(state => state.submitSPClarification);
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

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Uraian Klarifikasi Kendala &amp; Alasan Keterlambatan <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Jelaskan secara detail kendala yang dihadapi..."
              className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-600 resize-none shadow-2xs"
            />
          </div>

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
          </div>

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
                {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB • Terpilih` : 'Format PDF atau scan surat'}
              </p>
            </div>
          </div>

          <DialogFooter className="pt-2 flex flex-row items-center justify-end gap-2 shrink-0">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl h-10 text-xs font-bold">
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

export default TerbitkanSPModal;
