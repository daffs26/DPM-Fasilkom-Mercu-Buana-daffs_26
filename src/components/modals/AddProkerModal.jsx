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
import DatePickerDropdown from '@/components/ui/date-picker-dropdown';
import { X, UploadCloud, AlertTriangle, Calendar, Users, DollarSign, MapPin, CheckCircle2, Sparkles } from 'lucide-react';

export default function AddProkerModal({ isOpen, onClose, initialDate = '' }) {
  const { ormawas, prokers, addProker } = useStore();

  const [ormawaId, setOrmawaId] = useState('bem');
  const [title, setTitle] = useState('');
  const [divisi, setDivisi] = useState('');
  const [pic, setPic] = useState('');
  const [picContact, setPicContact] = useState('');
  const [startDate, setStartDate] = useState(initialDate || '');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [targetPeserta, setTargetPeserta] = useState(100);
  const [rab, setRab] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  // State rincian opsional saat pendaftaran
  const [showExtraDetails, setShowExtraDetails] = useState(false);
  const [tujuanText, setTujuanText] = useState('');
  const [sekretarisName, setSekretarisName] = useState('');
  const [bendaharaName, setBendaharaName] = useState('');

  // Sinkronisasi otomatis tanggal mulai acara berdasarkan tanggal terpilih saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setStartDate(initialDate || '');
      setEndDate('');
    }
  }, [isOpen, initialDate]);

  if (!isOpen) return null;

  // Tanggal proker yang sudah terdaftar untuk titik indikator kalender
  const prokerDates = prokers.flatMap(p => [p.startDate, p.endDate].filter(Boolean));

  // Collision Detection: Cek apakah ada proker ormawa lain di tanggal yang sama
  const overlappingProkers = startDate ? prokers.filter(p => {
    return (
      (p.startDate <= (endDate || startDate) && p.endDate >= startDate) ||
      p.startDate === startDate
    );
  }) : [];

  // Hitung apakah pengajuan proposal ini < H-14
  const today = new Date();
  const startObj = startDate ? new Date(startDate) : null;
  const daysDiff = startObj ? Math.ceil((startObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : null;
  const isDadakanWarning = daysDiff !== null && daysDiff < 14 && selectedFile;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      });
    }
  };

  const handleRabChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    if (!rawValue) {
      setRab('');
    } else {
      setRab(Number(rawValue).toLocaleString('id-ID'));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !startDate || !pic.trim()) {
      alert('Mohon lengkapi Nama Proker, Tanggal Pelaksanaan, dan Nama PIC!');
      return;
    }

    const tujuanArray = tujuanText.split('\n').map(t => t.trim()).filter(t => t.length > 0);
    const customPanitia = [];
    if (pic.trim()) {
      customPanitia.push({ role: 'Ketua Pelaksana', name: pic.trim(), contact: picContact.trim() || '0812-xxxx-xxxx', division: 'BPH' });
    }
    if (sekretarisName.trim()) {
      customPanitia.push({ role: 'Sekretaris', name: sekretarisName.trim(), contact: '0813-xxxx-xxxx', division: 'Kesekretariatan' });
    }
    if (bendaharaName.trim()) {
      customPanitia.push({ role: 'Bendahara', name: bendaharaName.trim(), contact: '0812-xxxx-xxxx', division: 'Keuangan' });
    }

    addProker({
      ormawaId,
      title,
      divisi,
      pic,
      picContact,
      startDate,
      endDate: endDate || startDate,
      location,
      targetPeserta: Number(targetPeserta) || 100,
      rab: Number(String(rab).replace(/\D/g, '')) || 0,
      description: description.trim(),
      tujuan: tujuanArray.length > 0 ? tujuanArray : null,
      kepanitiaan: customPanitia.length > 0 ? customPanitia : null,
      proposal: selectedFile ? {
        fileName: selectedFile.name,
        fileSize: selectedFile.size
      } : null
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] sm:max-w-2xl p-0 overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-2xl max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-5 pb-3 border-b border-slate-100 bg-slate-50/50 space-y-1.5 shrink-0">
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="bg-rose-50 text-rose-700 border-rose-200 text-[10px] font-bold">
              DPM FASILKOM UMB
            </Badge>
            <span className="text-xs text-slate-600 font-medium">Registrasi Proker Baru</span>
          </div>
          <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 tracking-tight pt-0.5">
            Tambah Program Kerja Ormawa
          </DialogTitle>
          <DialogDescription className="sr-only">
            Form pendaftaran program kerja ormawa
          </DialogDescription>
        </DialogHeader>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="px-4 sm:px-6 pt-3 pb-6 overflow-y-auto space-y-4 text-xs max-h-[calc(92vh-120px)]">
          {/* 1. Pemilihan Ormawa Penyelenggara dengan Warna PDH Resmi */}
          <div>
            <label className="font-bold text-slate-700 block mb-2">
              1. Pilih Ormawa Penyelenggara:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {ormawas.map((o) => {
                const isSelected = ormawaId === o.id;
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => setOrmawaId(o.id)}
                    className={`p-3 rounded-2xl border flex flex-col items-center text-center gap-1.5 transition ${
                      isSelected
                        ? o.id === 'dpm'
                          ? 'border-black bg-slate-950 text-white shadow-md'
                          : o.id === 'bem'
                          ? 'border-sky-500 bg-sky-500 text-white shadow-md'
                          : o.id === 'himti'
                          ? 'border-blue-950 bg-blue-950 text-white shadow-md'
                          : 'border-[#785E43] bg-[#9A7B56] text-white shadow-md'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-8 h-8 p-0.5 rounded-xl bg-white shadow-xs flex items-center justify-center">
                      <img src={o.logo} alt={o.name} className="w-full h-full object-contain" />
                    </div>
                    <span className="font-bold text-xs">{o.shortName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Judul Proker & Divisi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Nama Program Kerja <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder=""
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Departemen / Divisi Pelaksana
              </label>
              <input
                type="text"
                value={divisi}
                onChange={(e) => setDivisi(e.target.value)}
                placeholder=""
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* 3. PIC & Kontak */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Ketua Pelaksana (PIC) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={pic}
                onChange={(e) => setPic(e.target.value)}
                placeholder=""
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                No. WhatsApp / HP PIC
              </label>
              <input
                type="text"
                value={picContact}
                onChange={(e) => setPicContact(e.target.value)}
                placeholder=""
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* 4. Jadwal Pelaksanaan (Start & End Date) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Tanggal Mulai Acara <span className="text-red-500">*</span>
              </label>
              <DatePickerDropdown
                value={startDate}
                onChange={setStartDate}
                placeholder=""
                highlightDates={prokerDates}
                required
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Tanggal Selesai Acara
              </label>
              <DatePickerDropdown
                value={endDate}
                onChange={setEndDate}
                placeholder=""
                highlightDates={prokerDates}
              />
            </div>
          </div>

          {/* Collision Warning Box (Jika bentrok jadwal) */}
          {overlappingProkers.length > 0 && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-900">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-xs text-amber-800">
                  Perhatian: Terdeteksi {overlappingProkers.length} Kegiatan Lain di Tanggal Ini!
                </p>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  Kegiatan bersamaan: {overlappingProkers.map(p => `"${p.title}" (${p.ormawaId.toUpperCase()})`).join(', ')}. Pastikan tidak berebut ruangan atau audiens yang sama.
                </p>
              </div>
            </div>
          )}

          {/* 5. Lokasi, Target Peserta & Anggaran (RAB) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Lokasi / Tempat
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder=""
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Target Peserta (Orang)
              </label>
              <input
                type="number"
                value={targetPeserta}
                onChange={(e) => setTargetPeserta(e.target.value)}
                placeholder=""
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Estimasi Anggaran (Rp)
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={rab}
                onChange={handleRabChange}
                placeholder=""
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* 6. Drag & Drop Upload Proposal (Inspirasi Refrensi 2) */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">
              Upload Berkas Proposal & RAB (Opsional sekarang, bisa diunggah nanti):
            </label>
            <div className="border-2 border-dashed border-slate-200 hover:border-slate-400 rounded-2xl p-5 text-center bg-slate-50/60 hover:bg-slate-50 transition relative cursor-pointer">
              <input
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <UploadCloud className="w-8 h-8 text-slate-600 mx-auto mb-1.5" />
              {selectedFile ? (
                <div>
                  <p className="font-bold text-slate-900 text-xs text-emerald-600 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    {selectedFile.name} ({selectedFile.size})
                  </p>
                  <p className="text-[11px] text-slate-600 mt-1">Klik untuk mengganti file</p>
                </div>
              ) : (
                <div>
                  <p className="font-bold text-slate-700 text-xs">
                    Pilih file Proposal atau Tarik (Drag & Drop) ke sini
                  </p>
                  <p className="text-[11px] text-slate-600 mt-0.5">Format PDF atau DOCX (Maksimal 25MB)</p>
                </div>
              )}
            </div>

            {/* Peringatan Pengajuan Terlambat jika disubmit < H-14 */}
            {isDadakanWarning && (
              <div className="mt-2 p-2.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span className="text-[11px] font-semibold">
                  Peringatan SLA: Pelaksanaan kegiatan tinggal {daysDiff} hari lagi. Berkas akan otomatis diklasifikasikan sebagai <strong>"Pengajuan Terlambat" (&lt; H-14)</strong> oleh DPM.
                </span>
              </div>
            )}
          </div>

          {/* 7. Deskripsi Singkat */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">
              Deskripsi Singkat &amp; Gambaran Acara
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Gambaran umum pelaksanaan kegiatan..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* 8. Accordion Opsi Rincian Tambahan */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowExtraDetails(!showExtraDetails)}
              className="w-full py-2.5 px-3 rounded-2xl bg-blue-50/70 hover:bg-blue-50 border border-blue-100 text-blue-700 font-bold text-xs flex items-center justify-between gap-2 transition cursor-pointer"
            >
              <span className="flex items-center gap-2 min-w-0 flex-1 text-left">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-[11px] sm:text-xs leading-snug">
                  Isi Rincian Panitia &amp; Tujuan Sekarang (Opsional)
                </span>
              </span>
              <span className="text-[10px] bg-white border border-blue-200 px-2.5 py-1 rounded-full font-bold shrink-0 whitespace-nowrap shadow-2xs">
                {showExtraDetails ? 'Tutup' : '+ Buka'}
              </span>
            </button>

            {showExtraDetails && (
              <div className="mt-3 p-3.5 sm:p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3 animate-in fade-in-50 duration-150">
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5 text-[11px] sm:text-xs">
                    Tujuan &amp; Output Kegiatan (Ketik 1 tujuan per baris)
                  </label>
                  <textarea
                    rows={4}
                    value={tujuanText}
                    onChange={(e) => setTujuanText(e.target.value)}
                    placeholder="Contoh:&#10;• Meningkatkan pemahaman keorganisasian mahasiswa&#10;• Menghasilkan keputusan musyawarah yang transparan"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 leading-relaxed placeholder:text-slate-400 placeholder:leading-relaxed min-h-[96px] focus:outline-none focus:ring-2 focus:ring-slate-900 resize-y"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Nama Sekretaris Panitia
                    </label>
                    <input
                      type="text"
                      value={sekretarisName}
                      onChange={(e) => setSekretarisName(e.target.value)}
                      placeholder="Nama sekretaris pelaksana"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Nama Bendahara Panitia
                    </label>
                    <input
                      type="text"
                      value={bendaharaName}
                      onChange={(e) => setBendaharaName(e.target.value)}
                      placeholder="Nama bendahara pelaksana"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 italic">
                  💡 Catatan: Anda juga bisa menambah atau mengubah Rundown, Panitia, dan Rincian Pos RAB kapan saja melalui tombol <strong>"Detail Proker"</strong>.
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons (Shadcn UI Button) */}
          <div className="pt-3 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl font-bold w-full sm:w-auto"
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="rounded-xl font-bold w-full sm:w-auto"
            >
              Simpan Program Kerja
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
