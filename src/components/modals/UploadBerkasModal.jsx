import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
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
import DatePickerDropdown from '@/components/ui/date-picker-dropdown';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  FileCheck2,
  Files
} from 'lucide-react';

export default function UploadBerkasModal({ isOpen, onClose, defaultOrmawaId = 'bem' }) {
  const { ormawas, prokers, uploadProposal, uploadLPJ, uploadOtherDoc, addProker } = useStore();

  const [ormawaId, setOrmawaId] = useState(defaultOrmawaId);
  const [docCategory, setDocCategory] = useState('proposal'); // 'proposal' | 'lpj' | 'other'
  const [targetMode, setTargetMode] = useState('existing'); // 'existing' | 'new'
  const [selectedProkerId, setSelectedProkerId] = useState('');
  
  // State untuk pembuatan proker baru langsung dari form upload berkas
  const [newTitle, setNewTitle] = useState('');
  const [newDivisi, setNewDivisi] = useState('');
  const [newDate, setNewDate] = useState('');

  // File upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [notes, setNotes] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Proker yang sesuai dengan ormawa yang dipilih
  const availableProkers = prokers.filter(p => p.ormawaId === ormawaId);

  useEffect(() => {
    if (isOpen) {
      setOrmawaId(defaultOrmawaId || 'bem');
      setSelectedFile(null);
      setNotes('');
      setNewTitle('');
      setNewDivisi('');
      setNewDate('');
    }
  }, [isOpen, defaultOrmawaId]);

  useEffect(() => {
    if (availableProkers.length > 0) {
      setSelectedProkerId(availableProkers[0].id);
      setTargetMode('existing');
    } else {
      setSelectedProkerId('');
      setTargetMode('new');
    }
  }, [ormawaId, prokers]);

  if (!isOpen) return null;

  const currentProker = availableProkers.find(p => p.id === selectedProkerId);

  // Cek SLA Warning (H-14 untuk Proposal)
  const checkEventDate = targetMode === 'existing' ? currentProker?.startDate : newDate;
  let isDadakan = false;
  let daysDiff = null;
  if (checkEventDate && docCategory === 'proposal') {
    const today = new Date();
    const eventObj = new Date(checkEventDate);
    daysDiff = Math.ceil((eventObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    isDadakan = daysDiff < 14;
  }

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      });
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const filePayload = selectedFile || {
      name: docCategory === 'proposal'
        ? `${targetMode === 'existing' ? currentProker?.title : newTitle}_Proposal.pdf`
        : docCategory === 'lpj'
        ? `${targetMode === 'existing' ? currentProker?.title : newTitle}_LPJ.pdf`
        : `${targetMode === 'existing' ? currentProker?.title : newTitle}_Dokumen_Lainnya.pdf`,
      size: '2.4 MB'
    };

    if (targetMode === 'existing' && selectedProkerId) {
      if (docCategory === 'proposal') {
        uploadProposal(selectedProkerId, filePayload);
      } else if (docCategory === 'lpj') {
        uploadLPJ(selectedProkerId, filePayload);
      } else if (docCategory === 'other') {
        uploadOtherDoc(selectedProkerId, filePayload, notes || 'Dokumen Lainnya');
      }
    } else {
      // Daftarkan kegiatan baru bersama berkas yang diunggah
      const eventDate = newDate || new Date(Date.now() + 20 * 24 * 3600 * 1000).toISOString().split('T')[0];
      const todayStr = new Date().toISOString().split('T')[0];
      addProker({
        ormawaId,
        title: newTitle || (docCategory === 'other' ? 'Dokumen Administrasi Ormawa' : 'Kegiatan Ormawa Baru'),
        divisi: newDivisi || 'BPH',
        startDate: eventDate,
        endDate: eventDate,
        proposal: docCategory === 'proposal' ? {
          fileName: filePayload.name,
          fileSize: filePayload.size
        } : null,
        lpj: docCategory === 'lpj' ? {
          fileName: filePayload.name,
          fileSize: filePayload.size
        } : null,
        otherDocs: docCategory === 'other' ? [{
          id: `doc-${Date.now()}`,
          fileName: filePayload.name,
          fileSize: filePayload.size,
          uploadDate: todayStr,
          title: notes || filePayload.name || 'Dokumen Lainnya',
          reviewStatus: 'verified',
          notes: []
        }] : []
      });
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl p-0 overflow-hidden rounded-3xl">
        {/* Header */}
        <DialogHeader className="px-6 pt-5 pb-3 border-b border-slate-100 bg-slate-50/50 space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
              DPM FASILKOM UMB
            </Badge>
            <span className="text-xs text-slate-600 font-medium">Transparansi Berkas</span>
          </div>
          <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">
            Form Upload Berkas Ormawa
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Unggah dokumen proposal kegiatan, laporan pertanggungjawaban (LPJ), atau dokumen administrasi lainnya untuk ditinjau oleh DPM.
          </DialogDescription>
        </DialogHeader>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4 overflow-y-auto space-y-4 text-xs max-h-[calc(85vh-130px)]">
          {/* 1. Pemilihan Ormawa Pengunggah */}
          <div>
            <label className="font-bold text-slate-700 block mb-2">
              1. Ormawa Penyelenggara:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {ormawas.map((o) => {
                const isSelected = ormawaId === o.id;
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => setOrmawaId(o.id)}
                    className={`p-2.5 rounded-2xl border flex flex-col items-center text-center gap-1 transition cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/80 text-blue-900 font-bold shadow-xs ring-2 ring-blue-200'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-lg bg-white p-0.5 border border-slate-100 flex items-center justify-center">
                      <img src={o.logo} alt={o.name} className="w-full h-full object-contain" />
                    </div>
                    <span className="text-xs font-bold">{o.shortName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Jenis Dokumen */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">
              2. Kategori Dokumen:
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
              <button
                type="button"
                onClick={() => setDocCategory('proposal')}
                className={`flex-1 min-w-[140px] shrink-0 p-2.5 rounded-2xl border text-left transition cursor-pointer flex items-center gap-2 ${
                  docCategory === 'proposal'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-200'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                  docCategory === 'proposal' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-[11px] sm:text-xs whitespace-nowrap truncate">Proposal & RAB</div>
                  <div className="text-[9px] sm:text-[10px] text-slate-500 whitespace-nowrap truncate">Standar: ≥ H-14</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDocCategory('lpj')}
                className={`flex-1 min-w-[140px] shrink-0 p-2.5 rounded-2xl border text-left transition cursor-pointer flex items-center gap-2 ${
                  docCategory === 'lpj'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-200'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                  docCategory === 'lpj' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <FileCheck2 className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-[11px] sm:text-xs whitespace-nowrap truncate">LPJ & Kwitansi</div>
                  <div className="text-[9px] sm:text-[10px] text-slate-500 whitespace-nowrap truncate">Tenggat: ≤ H+14</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDocCategory('other')}
                className={`flex-1 min-w-[140px] shrink-0 p-2.5 rounded-2xl border text-left transition cursor-pointer flex items-center gap-2 ${
                  docCategory === 'other'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-200'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                  docCategory === 'other' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <Files className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-[11px] sm:text-xs whitespace-nowrap truncate">Dokumen Lainnya</div>
                  <div className="text-[9px] sm:text-[10px] text-slate-500 whitespace-nowrap truncate">Surat & Lampiran</div>
                </div>
              </button>
            </div>
          </div>

          {/* 3. Target Program Kerja */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-slate-700">
                3. Program Kerja Terkait:
              </label>
              {availableProkers.length > 0 && (
                <button
                  type="button"
                  onClick={() => setTargetMode(targetMode === 'existing' ? 'new' : 'existing')}
                  className="text-[11px] text-blue-600 hover:text-blue-700 font-bold hover:underline"
                >
                  {targetMode === 'existing' ? '+ Daftarkan Kegiatan Baru' : '← Pilih Proker Terdaftar'}
                </button>
              )}
            </div>

            {targetMode === 'existing' && availableProkers.length > 0 ? (
              <DropdownSelect
                value={selectedProkerId}
                onChange={(val) => setSelectedProkerId(val)}
                options={availableProkers.map(p => ({
                  value: p.id,
                  label: `${p.title} (Pelaksanaan: ${p.startDate})`
                }))}
                triggerClassName="py-2.5 px-3 font-semibold text-xs"
              />
            ) : (
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                <div className="text-[11px] text-slate-600">
                  {availableProkers.length === 0 
                    ? `Belum ada proker terdaftar untuk ${ormawas.find(o => o.id === ormawaId)?.shortName}. Berkas akan didaftarkan sebagai kegiatan baru.`
                    : 'Masukkan detail kegiatan baru untuk berkas ini:'}
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {docCategory === 'other' ? 'Nama Berkas / Perihal:' : 'Judul Kegiatan / Proker:'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder=""
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Divisi:
                    </label>
                    <input
                      type="text"
                      value={newDivisi}
                      onChange={(e) => setNewDivisi(e.target.value)}
                      placeholder=""
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Tanggal Pelaksanaan:
                    </label>
                    <DatePickerDropdown
                      value={newDate}
                      onChange={(val) => setNewDate(val)}
                      placeholder=""
                      buttonClassName="py-2 px-3 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SLA Indicator Preview */}
          {docCategory === 'proposal' && checkEventDate && (
            <div className={`p-3 rounded-2xl border flex items-start gap-2.5 ${
              isDadakan 
                ? 'bg-rose-50 border-rose-200 text-rose-800' 
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}>
              {isDadakan ? (
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              )}
              <div className="text-[11px] leading-relaxed">
                <span className="font-bold block">
                  {isDadakan ? 'Peringatan SLA: Pengajuan < H-14' : 'Kepatuhan SLA: Pengajuan Tepat Waktu (≥ H-14)'}
                </span>
                {isDadakan ? (
                  <span>Pengajuan {Math.abs(daysDiff)} hari sebelum acara. Akan diberi label <strong>Terlambat (&lt; H-14)</strong> dalam rekap audit DPM.</span>
                ) : (
                  <span>Tenggat waktu pengajuan proposal terpenuhi sesuai SOP Pengawasan DPM Fasilkom.</span>
                )}
              </div>
            </div>
          )}

          {/* 4. Dropzone File Upload */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">
              4. Dokumen Berkas (PDF, DOCX, XLSX):
            </label>
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleFileDrop}
              className={`border-2 border-dashed rounded-2xl p-4 text-center transition ${
                isDragging 
                  ? 'border-blue-500 bg-blue-50/60' 
                  : selectedFile 
                  ? 'border-emerald-300 bg-emerald-50/40' 
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              {selectedFile ? (
                <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-emerald-200 shadow-2xs">
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="text-left truncate">
                      <p className="font-bold text-slate-900 text-xs truncate">{selectedFile.name}</p>
                      <p className="text-[10px] text-slate-500">{selectedFile.size}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition"
                    title="Hapus File"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div>
                  <UploadCloud className="w-8 h-8 text-blue-600 mx-auto mb-1.5" />
                  <p className="font-bold text-slate-800 text-xs">
                    Tarik dan lepaskan file berkas ke sini
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Mendukung format PDF, Word, atau Excel (Maks. 15MB)
                  </p>
                  <label className="mt-2.5 inline-block px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs cursor-pointer shadow-2xs transition">
                    <span>Pilih Berkas dari Perangkat</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* 5. Catatan Tambahan (Opsional) */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              5. Catatan / Keterangan Pengantar (Opsional):
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder=""
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Footer Action */}
          <DialogFooter className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl text-xs"
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Berkas Sekarang</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
