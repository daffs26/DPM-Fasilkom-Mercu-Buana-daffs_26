import React, { useState, useRef, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle2, 
  Camera, 
  Trash2, 
  FileImage,
  Receipt
} from 'lucide-react';
import DropdownSelect from '@/components/ui/dropdown-select';
import { useStore } from '@/store/useStore';
import { useShallow } from 'zustand/react/shallow';

export default function AddTransactionModal({ 
  isOpen, 
  onClose, 
  initialMode = 'pengeluaran', 
  initialOrmawa = '' 
}) {
  const { ormawas, prokers, addBudgetTransaction, currentUserName } = useStore(useShallow(state => ({ ormawas: state.ormawas, prokers: state.prokers, addBudgetTransaction: state.addBudgetTransaction, currentUserName: state.currentUserName })));

  const [mode, setMode] = useState(initialMode); // 'pemasukan' | 'pengeluaran'
  const [selectedOrmawa, setSelectedOrmawa] = useState(initialOrmawa || ormawas[0]?.id || 'dpm');
  const [selectedProkerId, setSelectedProkerId] = useState('none');
  const [type, setType] = useState('termin1');
  const [category, setCategory] = useState('Dana Kampus / Fakultas');
  const [title, setTitle] = useState('');
  const [nominal, setNominal] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [pic, setPic] = useState(currentUserName);
  const [receiptNumber, setReceiptNumber] = useState(() => `KW-${Date.now().toString().slice(-6)}`);
  const [notes, setNotes] = useState('');
  
  // State untuk upload foto kwitansi / nota
  const [receiptPhoto, setReceiptPhoto] = useState(null);
  const [receiptPhotoName, setReceiptPhotoName] = useState('');
  const [receiptPhotoSize, setReceiptPhotoSize] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const activeMode = initialMode === 'pemasukan' ? 'pemasukan' : 'pengeluaran';
      setMode(activeMode);
      if (initialOrmawa) {
        setSelectedOrmawa(initialOrmawa);
      } else if (!selectedOrmawa) {
        setSelectedOrmawa(ormawas[0]?.id || 'dpm');
      }
      setSelectedProkerId('none');
      setTitle('');
      setNominal('');
      setType(activeMode === 'pemasukan' ? 'sponsorship' : 'termin1');
      setCategory(activeMode === 'pemasukan' ? 'Sponsor & Donatur Luar' : 'Dana Kampus / Fakultas');
      setReceiptNumber(`KW-${Date.now().toString().slice(-6)}`);
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [isOpen, initialMode, initialOrmawa]);

  if (!isOpen) return null;

  // Filter proker untuk ormawa yang dipilih
  const availableProkers = prokers.filter(p => p.ormawaId === selectedOrmawa);

  const ormawaOptions = ormawas.map(o => ({
    value: o.id,
    label: o.name
  }));

  const prokerOptions = [
    { value: 'none', label: mode === 'pemasukan' ? 'Bukan Proker (Kas Umum Ormawa)' : 'Bukan Proker (Kas Rutin Ormawa)' },
    ...availableProkers.map(p => ({
      value: p.id,
      label: `${p.title} (Anggaran: Rp ${(p.rab || 0).toLocaleString('id-ID')})`
    }))
  ];

  // Opsi Jenis Pemasukan & Pengeluaran
  const pemasukanTypeOptions = [
    { value: 'sponsorship', label: 'Dana Sponsor / Kemitraan' },
    { value: 'pendaftaran', label: 'Uang Pendaftaran / Tiket Acara' },
    { value: 'iuran', label: 'Iuran Kas Masuk / Swadaya Anggota' },
    { value: 'subsidi', label: 'Subsidi / Hibah Khusus Fakultas' },
    { value: 'pemasukan_lain', label: 'Pemasukan Kas Lainnya' }
  ];

  const pengeluaranTypeOptions = [
    { value: 'termin1', label: 'Dana Awal Kegiatan (Termin 1 - 70% RAB)' },
    { value: 'termin2', label: 'Sisa Pelunasan Kegiatan (Termin 2 - 30% RAB)' },
    { value: 'operasional', label: 'Biaya Operasional Rutin Kas Ormawa' },
    { value: 'konsumsi_logistik', label: 'Logistik, ATK & Konsumsi Kegiatan' },
    { value: 'lainnya', label: 'Pengeluaran Kas Lain-lain' }
  ];

  const typeOptions = mode === 'pemasukan' ? pemasukanTypeOptions : pengeluaranTypeOptions;

  const pemasukanCategoryOptions = [
    { value: 'Sponsor & Donatur Luar', label: 'Sponsor & Donatur Luar' },
    { value: 'Uang Pendaftaran / Swadaya', label: 'Uang Pendaftaran / Peserta' },
    { value: 'Dana Kampus / Fakultas', label: 'Dana Kampus / Fakultas' },
    { value: 'Uang Kas Ormawa', label: 'Uang Kas Ormawa' }
  ];

  const pengeluaranCategoryOptions = [
    { value: 'Dana Kampus / Fakultas', label: 'Dana Kampus / Fakultas' },
    { value: 'Uang Kas Ormawa', label: 'Uang Kas Ormawa' },
    { value: 'Sponsor & Donatur Luar', label: 'Sponsor & Donatur Luar' },
    { value: 'Uang Pendaftaran / Swadaya', label: 'Uang Pendaftaran / Swadaya' }
  ];

  const categoryOptions = mode === 'pemasukan' ? pemasukanCategoryOptions : pengeluaranCategoryOptions;

  const handleSwitchMode = (newMode) => {
    setMode(newMode);
    if (newMode === 'pemasukan') {
      setType('sponsorship');
      setCategory('Sponsor & Donatur Luar');
    } else {
      setType('termin1');
      setCategory('Dana Kampus / Fakultas');
    }
  };

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
        if (mode === 'pemasukan') {
          setTitle(`Penerimaan Dana Acara: ${p.title}`);
        } else {
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
    }
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    if (mode === 'pengeluaran' && selectedProkerId !== 'none') {
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
      txMode: mode,
      category,
      title: title.trim() || (mode === 'pemasukan' ? 'Pemasukan Kas' : 'Pengeluaran Kas'),
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

  const currentOrmawaObj = ormawas.find(o => o.id === selectedOrmawa);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] sm:max-w-xl p-0 overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-2xl max-h-[92dvh] flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Header Sticky */}
          <DialogHeader className="px-5 sm:px-6 py-4 border-b border-slate-100 bg-white shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  {mode === 'pemasukan' ? 'Catat Pemasukan Kas' : 'Catat Pengeluaran Kas'}
                </DialogTitle>
                <Badge 
                  variant="outline" 
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    mode === 'pemasukan' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  {mode === 'pemasukan' ? 'Kas Masuk' : 'Kas Keluar'}
                </Badge>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                {currentOrmawaObj?.shortName || ''}
              </span>
            </div>
            <DialogDescription className="sr-only">
              Form pencatatan transaksi keuangan ormawa
            </DialogDescription>
          </DialogHeader>

          {/* Body Scrollable */}
          <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-3.5 text-xs">
            {/* Segmented Switcher Minimalis: Pemasukan vs Pengeluaran */}
            <div className="grid grid-cols-2 p-1 bg-slate-100/80 rounded-xl border border-slate-200/70">
              <button
                type="button"
                onClick={() => handleSwitchMode('pemasukan')}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-semibold text-xs transition cursor-pointer ${
                  mode === 'pemasukan'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ArrowDownLeft className="w-3.5 h-3.5" />
                <span>Pemasukan</span>
              </button>
              <button
                type="button"
                onClick={() => handleSwitchMode('pengeluaran')}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-semibold text-xs transition cursor-pointer ${
                  mode === 'pengeluaran'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Pengeluaran</span>
              </button>
            </div>

            {/* Ormawa & Proker Terkait */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Ormawa <span className="text-rose-500">*</span>
                </label>
                <DropdownSelect
                  value={selectedOrmawa}
                  onChange={(val) => {
                    setSelectedOrmawa(val);
                    setSelectedProkerId('none');
                  }}
                  options={ormawaOptions}
                  className="w-full"
                  triggerClassName="w-full bg-white border border-slate-200 rounded-xl px-3 h-9 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 flex items-center justify-between"
                  contentClassName="w-full min-w-full z-[100] shadow-xl"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Program Kerja
                </label>
                <DropdownSelect
                  value={selectedProkerId}
                  onChange={handleSelectProker}
                  options={prokerOptions}
                  className="w-full"
                  triggerClassName="w-full bg-white border border-slate-200 rounded-xl px-3 h-9 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 flex items-center justify-between"
                  contentClassName="w-full min-w-full z-[100] shadow-xl"
                />
              </div>
            </div>

            {/* Jenis Transaksi & Sumber Dana */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {mode === 'pemasukan' ? 'Kategori Masuk' : 'Jenis Pengeluaran'} <span className="text-rose-500">*</span>
                </label>
                <DropdownSelect
                  value={type}
                  onChange={handleTypeChange}
                  options={typeOptions}
                  className="w-full"
                  triggerClassName="w-full bg-white border border-slate-200 rounded-xl px-3 h-9 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 flex items-center justify-between"
                  contentClassName="w-full min-w-full z-[100] shadow-xl"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Sumber Kas
                </label>
                <DropdownSelect
                  value={category}
                  onChange={(val) => setCategory(val)}
                  options={categoryOptions}
                  className="w-full"
                  triggerClassName="w-full bg-white border border-slate-200 rounded-xl px-3 h-9 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 flex items-center justify-between"
                  contentClassName="w-full min-w-full z-[100] shadow-xl"
                />
              </div>
            </div>

            {/* Judul / Keperluan Transaksi */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Keperluan / Keterangan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={mode === 'pemasukan' ? 'Misal: Sponsor kemitraan seminar' : 'Misal: Konsumsi & sewa tempat'}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 h-9 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>

            {/* Nominal & Tanggal Transaksi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Nominal (Rp) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-xs">
                    Rp
                  </span>
                  <input
                    type="text"
                    required
                    value={nominal}
                    onChange={handleNominalChange}
                    placeholder="0"
                    className={`w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 h-9 text-xs font-semibold focus:outline-none focus:ring-1 ${
                      mode === 'pemasukan' 
                        ? 'text-emerald-700 focus:ring-emerald-500' 
                        : 'text-slate-900 focus:ring-blue-500'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Tanggal Transaksi
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 h-9 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* PIC & Nomor Bukti */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Penanggung Jawab
                </label>
                <input
                  type="text"
                  value={pic}
                  onChange={(e) => setPic(e.target.value)}
                  placeholder="Nama bendahara / PIC"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 h-9 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  No. Bukti / Kwitansi
                </label>
                <input
                  type="text"
                  value={receiptNumber}
                  onChange={(e) => setReceiptNumber(e.target.value)}
                  placeholder="KW-xxxxxx"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 h-9 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>

            {/* Upload Bukti Kwitansi / Nota */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Bukti Nota / Kwitansi (Opsional)
              </label>

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
                  className="border border-dashed border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer transition text-slate-500"
                >
                  <Camera className="w-4 h-4 text-slate-400" />
                  <span className="text-xs">Klik untuk unggah foto nota / bukti transfer (JPG/PNG maks 5MB)</span>
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl p-2.5 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileImage className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="font-medium text-xs text-slate-800 truncate max-w-[200px] sm:max-w-xs">
                        {receiptPhotoName} ({receiptPhotoSize})
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                      >
                        Ganti
                      </button>
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 transition cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-white max-h-36 flex items-center justify-center p-1">
                    <img 
                      src={receiptPhoto} 
                      alt="Preview Kwitansi" 
                      className="w-full h-auto max-h-32 object-contain rounded" 
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Catatan Tambahan */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Catatan Tambahan (Opsional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Keterangan tambahan jika diperlukan..."
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none transition"
              />
            </div>

          </div>

          {/* Sticky Modal Footer */}
          <div className="px-5 sm:px-6 py-3 border-t border-slate-100 bg-white shrink-0 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl font-semibold h-9 px-4 bg-red-600 hover:bg-red-700 text-white shadow-none cursor-pointer active:scale-95 transition text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              className={`rounded-xl font-semibold h-9 px-4 text-white shadow-none cursor-pointer active:scale-95 flex items-center gap-1.5 transition text-xs ${
                mode === 'pemasukan'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              <span>{mode === 'pemasukan' ? 'Simpan Pemasukan' : 'Simpan Pengeluaran'}</span>
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
