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
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle2, 
  Camera, 
  UploadCloud, 
  Trash2, 
  FileImage,
  Receipt,
  Coins
} from 'lucide-react';
import DropdownSelect from '@/components/ui/dropdown-select';
import { useStore } from '../../store/useStore';

export default function AddTransactionModal({ 
  isOpen, 
  onClose, 
  initialMode = 'pengeluaran', 
  initialOrmawa = '' 
}) {
  const { ormawas, prokers, addBudgetTransaction, currentUserName } = useStore();

  const [mode, setMode] = useState(initialMode); // 'pemasukan' | 'pengeluaran'
  const [selectedOrmawa, setSelectedOrmawa] = useState(initialOrmawa || ormawas[0]?.id || 'dpm');
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
      <DialogContent className="w-[95vw] sm:max-w-xl p-0 overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-2xl max-h-[92vh] flex flex-col">
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-5 pb-3 border-b border-slate-100 bg-slate-50/70 space-y-1 shrink-0">
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                mode === 'pemasukan' 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              {mode === 'pemasukan' ? 'Kas Masuk' : 'Kas Keluar'}
            </Badge>
            <span className="text-xs text-slate-500 font-medium">
              Buku Kas &amp; Catatan Keuangan {currentOrmawaObj?.shortName ? `(${currentOrmawaObj.shortName})` : ''}
            </span>
          </div>
          <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            {mode === 'pemasukan' ? 'Catat Pemasukan Kas' : 'Catat Pengeluaran Kas'}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-600">
            {mode === 'pemasukan' 
              ? 'Formulir pencatatan dana sponsor, tiket pendaftaran, subsidi fakultas, dan iuran kas.' 
              : 'Formulir pencairan termin proker (70%/30%), biaya operasional ormawa, dan upload bukti kwitansi/nota.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-4 sm:px-6 pt-3 pb-6 space-y-4 text-xs max-h-[calc(92vh-120px)] overflow-y-auto">
          {/* Segmented Switcher Minimalis: Pemasukan vs Pengeluaran */}
          <div className="grid grid-cols-2 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80">
            <button
              type="button"
              onClick={() => handleSwitchMode('pemasukan')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                mode === 'pemasukan'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              <span>+ Pemasukan Kas</span>
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode('pengeluaran')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                mode === 'pengeluaran'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+ Pengeluaran Kas</span>
            </button>
          </div>

          {/* Ormawa & Proker Terkait */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Ormawa Terkait <span className="text-rose-500">*</span>
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
                {mode === 'pemasukan' ? 'Terkait Program Kerja (Opsional)' : 'Untuk Program Kerja'}
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
                {mode === 'pemasukan' ? 'Kategori Pemasukan' : 'Jenis Pengeluaran / Termin'} <span className="text-rose-500">*</span>
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
                {mode === 'pemasukan' ? 'Asal Sumber Dana Masuk' : 'Asal Kas Pembayaran'}
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
              placeholder={mode === 'pemasukan' ? 'Contoh: Dana Sponsor Bank Syariah untuk Seminar' : 'Contoh: Uang muka konsumsi & sewa tempat'}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Nominal & Tanggal Transaksi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                {mode === 'pemasukan' ? 'Jumlah Uang Masuk (Rp)' : 'Jumlah Uang Keluar (Rp)'} <span className="text-rose-500">*</span>
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
                  className={`w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 ${
                    mode === 'pemasukan' 
                      ? 'text-emerald-700 focus:ring-emerald-600' 
                      : 'text-slate-900 focus:ring-slate-900'
                  }`}
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
                Nomor Kwitansi / Bukti Kas
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

          {/* Upload Bukti Kwitansi / Nota */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-slate-500" />
                <span>Lampiran Foto Bukti / Kwitansi (Opsional)</span>
              </label>
              {receiptPhoto && (
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  ✓ Foto Terpasang
                </span>
              )}
            </div>

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
                className="border-2 border-dashed border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-white rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center cursor-pointer transition group"
              >
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-slate-500 group-hover:text-blue-600 transition mb-2">
                  <Camera className="w-4 h-4" />
                </div>
                <p className="font-bold text-xs text-slate-800">
                  Klik untuk unggah foto nota / bukti transfer
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Format JPG, PNG, atau WEBP (Maksimal 5 MB)
                </p>
              </div>
            ) : (
              <div className="border border-slate-200 rounded-2xl p-3 bg-slate-50/70 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <FileImage className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-slate-800 truncate max-w-[200px] sm:max-w-xs">
                        {receiptPhotoName}
                      </p>
                      <p className="text-[10px] text-slate-400">{receiptPhotoSize}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                    >
                      Ganti
                    </button>
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="p-1 rounded-lg text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      title="Hapus Foto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

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
              placeholder="Tulis rincian atau keterangan tambahan jika ada..."
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
              className={`w-full sm:w-auto justify-center px-5 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition flex items-center gap-1.5 text-center cursor-pointer ${
                mode === 'pemasukan'
                  ? 'bg-emerald-600 hover:bg-emerald-700 active:scale-95'
                  : 'bg-slate-900 hover:bg-slate-800 active:scale-95'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{mode === 'pemasukan' ? 'Simpan Pemasukan Kas' : 'Simpan Pengeluaran Kas'}</span>
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
