import React, { useState, useRef, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  PlusCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  Camera, 
  UploadCloud, 
  Trash2, 
  FileImage,
  Receipt
} from 'lucide-react';
import DropdownSelect from '@/components/ui/dropdown-select';
import { useStore } from '../../store/useStore';

export default function AddTransactionModal({ isOpen, onClose }) {
  const { ormawas, prokers, addBudgetTransaction, currentUserName } = useStore();

  const [selectedOrmawa, setSelectedOrmawa] = useState(ormawas[0]?.id || 'dpm');
  const [selectedProkerId, setSelectedProkerId] = useState('none');
  const [type, setType] = useState('termin1');
  const [category, setCategory] = useState('Dana Kampus / Fakultas');
  const [title, setTitle] = useState('');
  const [nominal, setNominal] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [pic, setPic] = useState(currentUserName);
  const [receiptNumber, setReceiptNumber] = useState(`KW-${Date.now().toString().slice(-6)}`);
  const [notes, setNotes] = useState('');
  
  // State untuk upload foto kwitansi / nota
  const [receiptPhoto, setReceiptPhoto] = useState(null);
  const [receiptPhotoName, setReceiptPhotoName] = useState('');
  const [receiptPhotoSize, setReceiptPhotoSize] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setReceiptNumber(`KW-${Date.now().toString().slice(-6)}`);
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter proker untuk ormawa yang dipilih
  const availableProkers = prokers.filter(p => p.ormawaId === selectedOrmawa);

  const ormawaOptions = ormawas.map(o => ({
    value: o.id,
    label: o.name
  }));

  const prokerOptions = [
    { value: 'none', label: 'Bukan Proker (Kas Rutin Ormawa)' },
    ...availableProkers.map(p => ({
      value: p.id,
      label: `${p.title} (Anggaran: Rp ${(p.rab || 0).toLocaleString('id-ID')})`
    }))
  ];

  // Bahasa sederhana & mudah dimengerti mahasiswa
  const typeOptions = [
    { value: 'termin1', label: 'Dana Awal Kegiatan (70%)' },
    { value: 'termin2', label: 'Sisa Dana / Pelunasan (30%)' },
    { value: 'operasional', label: 'Biaya Kas Operasional' },
    { value: 'sponsorship', label: 'Uang Sponsor / Mitra' },
    { value: 'lainnya', label: 'Pengeluaran Lain-lain' }
  ];

  const categoryOptions = [
    { value: 'Dana Kampus / Fakultas', label: 'Dana Kampus / Fakultas' },
    { value: 'Uang Kas Ormawa', label: 'Uang Kas Ormawa' },
    { value: 'Sponsor & Donatur Luar', label: 'Sponsor & Donatur Luar' },
    { value: 'Uang Pendaftaran / Swadaya', label: 'Uang Pendaftaran / Peserta' }
  ];

  const handleNominalChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    if (!rawValue) {
      setNominal('');
    } else {
      setNominal(Number(rawValue).toLocaleString('id-ID'));
    }
  };

  const handleSelectProker = (prokerId) => {
    setSelectedProkerId(prokerId);
    if (prokerId !== 'none') {
      const p = prokers.find(item => item.id === prokerId);
      if (p) {
        setTitle(`Uang Kegiatan: ${p.title}`);
        if (type === 'termin1' && p.rab) {
          const termin1Amount = Math.round(p.rab * 0.7);
          setNominal(termin1Amount.toLocaleString('id-ID'));
        } else if (type === 'termin2' && p.rab) {
          const termin2Amount = Math.round(p.rab * 0.3);
          setNominal(termin2Amount.toLocaleString('id-ID'));
        }
      }
    }
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    if (selectedProkerId !== 'none') {
      const p = prokers.find(item => item.id === selectedProkerId);
      if (p && p.rab) {
        if (newType === 'termin1') {
          setNominal(Math.round(p.rab * 0.7).toLocaleString('id-ID'));
        } else if (newType === 'termin2') {
          setNominal(Math.round(p.rab * 0.3).toLocaleString('id-ID'));
        }
      }
    }
  };

  // Upload foto kwitansi / nota
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran foto terlalu besar! Maksimal 5 MB.');
      return;
    }

    setReceiptPhotoName(file.name);
    const sizeInKb = Math.round(file.size / 1024);
    setReceiptPhotoSize(sizeInKb > 1024 ? `${(sizeInKb / 1024).toFixed(1)} MB` : `${sizeInKb} KB`);

    const reader = new FileReader();
    reader.onload = (event) => {
      setReceiptPhoto(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setReceiptPhoto(null);
    setReceiptPhotoName('');
    setReceiptPhotoSize('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const rawNominal = Number(String(nominal).replace(/\D/g, '')) || 0;

    if (!rawNominal) {
      alert('Jumlah uang wajib diisi!');
      return;
    }

    addBudgetTransaction({
      ormawaId: selectedOrmawa,
      prokerId: selectedProkerId === 'none' ? null : selectedProkerId,
      type,
      category,
      title: title.trim() || 'Catatan Transaksi Kas',
      nominal: rawNominal,
      date,
      pic: pic.trim() || currentUserName,
      receiptNumber: receiptNumber.trim() || `KW-${Date.now().toString().slice(-6)}`,
      receiptPhoto,
      receiptPhotoName,
      notes: notes.trim()
    });

    handleRemovePhoto();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] sm:max-w-xl p-0 overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-2xl max-h-[92vh] flex flex-col">
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-5 pb-3 border-b border-slate-100 bg-slate-50/70 space-y-1 shrink-0">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-bold bg-white text-blue-700 border-blue-200">
              Input Anggaran
            </Badge>
            <span className="text-xs text-slate-500 font-medium">Buku Kas &amp; Catatan Keuangan</span>
          </div>
          <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Catat Uang Masuk &amp; Keluar
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-600">
            Formulir untuk mencatat uang kegiatan, operasional kas ormawa, dan upload bukti kwitansi atau nota.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-4 sm:px-6 pt-3 pb-6 space-y-4 text-xs max-h-[calc(92vh-120px)] overflow-y-auto">
          {/* Ormawa & Proker Terkait */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Pilih Ormawa <span className="text-rose-500">*</span>
              </label>
              <DropdownSelect
                value={selectedOrmawa}
                onChange={(val) => {
                  setSelectedOrmawa(val);
                  setSelectedProkerId('none');
                }}
                options={ormawaOptions}
                className="w-full"
                triggerClassName="w-full bg-slate-50 hover:bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 flex items-center justify-between"
                contentClassName="w-full min-w-full z-[100] shadow-xl"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Untuk Program Kerja
              </label>
              <DropdownSelect
                value={selectedProkerId}
                onChange={handleSelectProker}
                options={prokerOptions}
                className="w-full"
                triggerClassName="w-full bg-slate-50 hover:bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 flex items-center justify-between"
                contentClassName="w-full min-w-full z-[100] shadow-xl"
              />
            </div>
          </div>

          {/* Jenis Transaksi & Sumber Dana */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Jenis Pengeluaran / Pemasukan <span className="text-rose-500">*</span>
              </label>
              <DropdownSelect
                value={type}
                onChange={handleTypeChange}
                options={typeOptions}
                className="w-full"
                triggerClassName="w-full bg-slate-50 hover:bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 flex items-center justify-between"
                contentClassName="w-full min-w-full z-[100] shadow-xl"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Asal Sumber Dana
              </label>
              <DropdownSelect
                value={category}
                onChange={(val) => setCategory(val)}
                options={categoryOptions}
                className="w-full"
                triggerClassName="w-full bg-slate-50 hover:bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 flex items-center justify-between"
                contentClassName="w-full min-w-full z-[100] shadow-xl"
              />
            </div>
          </div>

          {/* Judul / Keperluan Transaksi */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">
              Nama Keperluan / Keterangan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Uang muka konsumsi & sewa tempat"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Nominal & Tanggal Transaksi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Jumlah Uang (Rp) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                  Rp
                </span>
                <input
                  type="text"
                  required
                  value={nominal}
                  onChange={handleNominalChange}
                  placeholder="0"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Tanggal Transaksi
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* PIC & Nomor Bukti */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Nama Penanggung Jawab / Bendahara
              </label>
              <input
                type="text"
                value={pic}
                onChange={(e) => setPic(e.target.value)}
                placeholder="Nama bendahara / PIC"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Nomor Kwitansi / Nota
              </label>
              <input
                type="text"
                value={receiptNumber}
                onChange={(e) => setReceiptNumber(e.target.value)}
                placeholder="Contoh: NOTA-001 atau KW-123"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono text-xs"
              />
            </div>
          </div>

          {/* ========================================================================= */}
          {/* FITUR UPLOAD FOTO KWITANSI / NOTA                                         */}
          {/* ========================================================================= */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-blue-600" />
                <span>Upload Foto Kwitansi atau Nota</span>
                <span className="text-[10px] text-slate-400 font-normal">(Opsional)</span>
              </label>

              {receiptPhoto && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Foto Terlampir
                </span>
              )}
            </div>

            {/* Hidden native file input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />

            {!receiptPhoto ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/70 hover:bg-blue-50/30 rounded-2xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center gap-1.5 group"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 group-hover:border-blue-200 text-slate-500 group-hover:text-blue-600 flex items-center justify-center shadow-2xs transition">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block group-hover:text-blue-600 transition">
                    Klik di sini untuk upload foto kwitansi / nota belanja
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Bisa format JPG, PNG, atau JPEG • Bisa langsung foto dari kamera HP
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
                      <FileImage className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-xs text-slate-900 truncate block">
                        {receiptPhotoName || 'Foto Kwitansi/Nota'}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        {receiptPhotoSize || 'Foto siap disimpan'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-[11px] transition shadow-2xs"
                    >
                      Ganti Foto
                    </button>
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="p-1 rounded-lg bg-white border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition shadow-2xs"
                      title="Hapus foto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Thumbnail Preview */}
                <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-white max-h-44 flex items-center justify-center p-1">
                  <img 
                    src={receiptPhoto} 
                    alt="Preview Kwitansi" 
                    className="w-full h-auto max-h-40 object-contain rounded-lg" 
                  />
                </div>
              </div>
            )}
          </div>

          {/* Catatan Tambahan */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">
              Catatan Tambahan (Opsional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tulis rincian belanja atau keterangan tambahan jika ada..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
            />
          </div>

          <DialogFooter className="pt-3 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition text-center cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto justify-center px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition flex items-center gap-1.5 text-center cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Simpan Transaksi &amp; Nota</span>
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
