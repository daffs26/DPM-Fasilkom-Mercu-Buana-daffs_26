import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DatePickerDropdown from '@/components/ui/date-picker-dropdown';
import { 
  UploadCloud, 
  AlertTriangle, 
  Users, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  ArrowRight,
  ArrowLeft,
  Target,
  Building2,
  Calendar,
  DollarSign,
  FileText
} from 'lucide-react';

export default function AddProkerModal({ isOpen, onClose, initialDate = '' }) {
  const { ormawas, prokers, addProker, currentUser } = useStore(useShallow(state => ({ 
    ormawas: state.ormawas, 
    prokers: state.prokers, 
    addProker: state.addProker, 
    currentUser: state.currentUser 
  })));

  // Navigasi Multi-Step Form
  const [currentStep, setCurrentStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const scrollContainerRef = useRef(null);

  // Field Halaman 1: Informasi Dasar & Panitia
  const [ormawaId, setOrmawaId] = useState(currentUser?.ormawaId !== 'dpm' ? currentUser?.ormawaId : 'bem');
  const [title, setTitle] = useState('');
  const [divisi, setDivisi] = useState('');
  const [pic, setPic] = useState('');
  const [picContact, setPicContact] = useState('');
  const [startDate, setStartDate] = useState(initialDate || '');
  const [endDate, setEndDate] = useState('');
  const [showPanitiaDetails, setShowPanitiaDetails] = useState(false);
  const [panitiaList, setPanitiaList] = useState([
    { role: '', name: '', nim: '', division: '', contact: '' },
    { role: '', name: '', division: '', contact: '' }
  ]);

  // Field Halaman 2: Pelaksanaan, Dokumen & Tujuan Output
  const [location, setLocation] = useState('');
  const [targetPeserta, setTargetPeserta] = useState(100);
  const [rab, setRab] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [tujuanText, setTujuanText] = useState('');

  // Sinkronisasi otomatis tanggal mulai acara berdasarkan tanggal terpilih saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setStartDate(initialDate || '');
      setEndDate('');
      setCurrentStep(1);
      setErrorMessage('');
    }
  }, [isOpen, initialDate]);

  // Gulir ke atas kontainer form saat berganti halaman
  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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

  const handleAddPanitiaRow = (roleName = '', divisionName = '') => {
    setPanitiaList(prev => [
      ...prev,
      { role: roleName, name: '', nim: '', division: divisionName, contact: '' }
    ]);
  };

  const handleRemovePanitiaRow = (index) => {
    setPanitiaList(prev => prev.filter((_, i) => i !== index));
  };

  const handlePanitiaChange = (index, field, value) => {
    setPanitiaList(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Navigasi ke Step 2 (Pelaksanaan, Berkas & Output)
  const handleNextStep = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setErrorMessage('');
    setCurrentStep(2);
    scrollToTop();
  };

  // Navigasi kembali ke Step 1 (Menjaga data tetap utuh)
  const handlePrevStep = () => {
    setErrorMessage('');
    setCurrentStep(1);
    scrollToTop();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Jika form disubmit saat masih di Step 1 (misal via tombol Enter di keyboard), jangan buat proker melainkan alihkan ke Step 2
    if (currentStep === 1) {
      handleNextStep(e);
      return;
    }

    // Validasi final sebelum simpan
    if (!title.trim() || !startDate || !pic.trim()) {
      setErrorMessage('Mohon lengkapi Nama Proker, Tanggal Pelaksanaan, dan Nama PIC di Langkah 1!');
      setCurrentStep(1);
      scrollToTop();
      return;
    }

    const tujuanArray = tujuanText.split('\n').map(t => t.trim()).filter(t => t.length > 0);
    const customPanitia = [];
    if (pic.trim()) {
      customPanitia.push({
        role: 'Ketua Pelaksana',
        name: pic.trim(),
        contact: picContact.trim() || '0812-xxxx-xxxx',
        division: divisi.trim() || 'BPH'
      });
    }
    panitiaList.forEach(p => {
      if (p.name.trim() || p.role.trim()) {
        customPanitia.push({
          role: p.role.trim() || 'Anggota Panitia',
          name: p.name.trim() || 'Panitia Pelaksana',
          nim: p.nim?.trim() || '',
          contact: p.contact.trim() || '0812-xxxx-xxxx',
          division: p.division.trim() || 'Panitia Pelaksana'
        });
      }
    });

    addProker({
      ormawaId,
      title: title.trim(),
      divisi: divisi.trim(),
      pic: pic.trim(),
      picContact: picContact.trim(),
      startDate,
      endDate: endDate || startDate,
      location: location.trim(),
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

  const currentOrmawaObj = ormawas.find(o => o.id === ormawaId);
  const tujuanArrayCount = tujuanText.split('\n').map(t => t.trim()).filter(t => t.length > 0).length;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] sm:max-w-2xl p-0 overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-2xl max-h-[92dvh] flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          
          {/* Modal Header: Bersih dan Elegan */}
          <DialogHeader className="px-5 sm:px-6 py-4 border-b border-slate-100 bg-white shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Tambah Program Kerja
              </DialogTitle>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                Langkah {currentStep} dari 2
              </span>
            </div>
            <DialogDescription className="sr-only">
              Form pendaftaran program kerja ormawa
            </DialogDescription>
          </DialogHeader>

          {/* Step Indicator Bar */}
          <div className="px-5 sm:px-6 py-2 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrevStep}
                className={`flex items-center gap-1.5 font-medium transition cursor-pointer ${
                  currentStep === 1 ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  currentStep === 1 ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
                }`}>
                  {currentStep > 1 ? '✓' : '1'}
                </span>
                <span>Informasi Dasar</span>
              </button>

              <span className="text-slate-300">/</span>

              <button
                type="button"
                onClick={handleNextStep}
                className={`flex items-center gap-1.5 font-medium transition cursor-pointer ${
                  currentStep === 2 ? 'text-blue-600 font-semibold' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  currentStep === 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  2
                </span>
                <span>Pelaksanaan &amp; Berkas</span>
              </button>
            </div>

            <div className="w-16 h-1 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                style={{ width: currentStep === 1 ? '50%' : '100%' }}
              />
            </div>
          </div>

          {/* Modal Body: Scrollable mandiri */}
          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-3.5 text-xs"
          >
            {/* Inline Error Banner */}
            {errorMessage && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-800 animate-in fade-in-50 duration-150">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="text-xs font-medium flex-1">{errorMessage}</span>
                <button
                  type="button"
                  onClick={() => setErrorMessage('')}
                  className="text-rose-400 hover:text-rose-700 text-xs font-bold"
                >
                  ✕
                </button>
              </div>
            )}

            {/* ========================================================================= */}
            {/* HALAMAN 1: INFORMASI DASAR                                                */}
            {/* ========================================================================= */}
            {currentStep === 1 && (
              <div className="space-y-3.5 animate-in fade-in-50 duration-150">
                
                {/* 1. Ormawa Penyelenggara */}
                {currentUser?.ormawaId === 'dpm' ? (
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                      Ormawa Penyelenggara
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {ormawas.map((o) => {
                        const isSelected = ormawaId === o.id;
                        return (
                          <button
                            key={o.id}
                            type="button"
                            onClick={() => setOrmawaId(o.id)}
                            className={`py-2 px-2.5 rounded-xl border flex items-center justify-center gap-2 transition cursor-pointer ${
                              isSelected
                                ? 'border-blue-600 bg-blue-50/60 text-blue-900 font-bold shadow-2xs'
                                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                            }`}
                          >
                            <img src={o.logo} alt="" className="w-5 h-5 object-contain" />
                            <span className="text-xs">{o.shortName}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={currentOrmawaObj?.logo} alt="" className="w-6 h-6 object-contain" />
                      <span className="text-xs font-semibold text-slate-800">{currentOrmawaObj?.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">Penyelenggara</span>
                  </div>
                )}

                {/* 2. Judul Proker & Divisi */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Nama Program Kerja <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      placeholder="Nama kegiatan / acara"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 h-9 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Divisi Pelaksana
                    </label>
                    <input
                      type="text"
                      value={divisi}
                      onChange={(e) => setDivisi(e.target.value)}
                      placeholder="Misal: Litbang / Humas"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 h-9 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>
                </div>

                {/* 3. PIC & Kontak */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Ketua Pelaksana <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={pic}
                      onChange={(e) => {
                        setPic(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      placeholder="Nama ketua pelaksana"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 h-9 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      No. WhatsApp
                    </label>
                    <input
                      type="text"
                      value={picContact}
                      onChange={(e) => setPicContact(e.target.value)}
                      placeholder="0812-xxxx-xxxx"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 h-9 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>
                </div>

                {/* 4. Jadwal Pelaksanaan */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Tanggal Mulai <span className="text-red-500">*</span>
                    </label>
                    <DatePickerDropdown
                      value={startDate}
                      onChange={(val) => {
                        setStartDate(val);
                        if (errorMessage) setErrorMessage('');
                      }}
                      placeholder="Pilih tanggal mulai"
                      highlightDates={prokerDates}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Tanggal Selesai
                    </label>
                    <DatePickerDropdown
                      value={endDate}
                      onChange={setEndDate}
                      placeholder="Pilih tanggal (opsional)"
                      highlightDates={prokerDates}
                    />
                  </div>
                </div>

                {/* Collision Warning Box (Jika bentrok jadwal) */}
                {overlappingProkers.length > 0 && (
                  <div className="p-2.5 bg-amber-50/70 border border-amber-200/70 rounded-xl flex items-center gap-2 text-amber-800 text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>
                      <strong>Jadwal bersamaan:</strong> {overlappingProkers.map(p => p.title).join(', ')}
                    </span>
                  </div>
                )}

              </div>
            )}

            {/* ========================================================================= */}
            {/* HALAMAN 2: PELAKSANAAN, BERKAS & SUSUNAN PANITIA                          */}
            {/* ========================================================================= */}
            {currentStep === 2 && (
              <div className="space-y-3.5 animate-in fade-in-50 duration-150">
                
                {/* 1. Lokasi, Target Peserta & Estimasi RAB */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Lokasi
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Ruang / Zoom"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 h-9 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Target Peserta
                    </label>
                    <input
                      type="number"
                      value={targetPeserta}
                      onChange={(e) => setTargetPeserta(e.target.value)}
                      placeholder="100"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 h-9 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Estimasi RAB (Rp)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={rab}
                      onChange={handleRabChange}
                      placeholder="Rp 0"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 h-9 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>
                </div>

                {/* 2. Upload Proposal */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Proposal Kegiatan (Opsional)
                  </label>
                  <div className="border border-dashed border-slate-200 hover:border-slate-300 rounded-xl p-3 text-center bg-slate-50/50 hover:bg-slate-50 transition relative cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,.docx,.doc"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {selectedFile ? (
                      <div className="flex items-center justify-center gap-2 text-emerald-700 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="truncate max-w-[280px]">{selectedFile.name} ({selectedFile.size})</span>
                        <span className="text-[10px] text-slate-400 hover:text-slate-600 ml-1">Ganti</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2 text-slate-500">
                        <UploadCloud className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="text-xs">Klik atau seret file proposal (PDF/DOCX, maks 25MB)</span>
                      </div>
                    )}
                  </div>

                  {isDadakanWarning && (
                    <div className="mt-2 p-2 bg-rose-50/70 border border-rose-200/70 rounded-xl flex items-center gap-2 text-rose-700 text-xs">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>Pelaksanaan &lt; H-14 ({daysDiff} hari lagi), berstatus pengajuan terlambat.</span>
                    </div>
                  )}
                </div>

                {/* 3. Rincian Panitia Pelaksana */}
                <div>
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/40">
                    <button
                      type="button"
                      onClick={() => setShowPanitiaDetails(!showPanitiaDetails)}
                      className="w-full py-2.5 px-3.5 flex items-center justify-between text-left text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                    >
                      <span className="flex items-center gap-2 text-xs font-semibold">
                        <Users className="w-3.5 h-3.5 text-blue-600" />
                        <span>Susunan Panitia {panitiaList.length > 0 && `(${panitiaList.length})`}</span>
                      </span>
                      <span className="text-[11px] text-blue-600 font-medium">
                        {showPanitiaDetails ? 'Tutup' : '+ Atur Panitia'}
                      </span>
                    </button>

                    {showPanitiaDetails && (
                      <div className="p-3 border-t border-slate-200 bg-white space-y-2.5 animate-in fade-in-50 duration-150">
                        <div className="space-y-2 max-h-56 overflow-y-auto pr-0.5">
                          {panitiaList.map((p, idx) => (
                            <div 
                              key={idx}
                              className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/60 space-y-2 relative"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                                  Panitia #{idx + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleRemovePanitiaRow(idx)}
                                  className="p-0.5 rounded text-slate-400 hover:text-rose-600 transition cursor-pointer"
                                  title="Hapus"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  value={p.role}
                                  onChange={(e) => handlePanitiaChange(idx, 'role', e.target.value)}
                                  placeholder="Jabatan (cth: Sekretaris) *"
                                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 h-8 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                <input
                                  type="text"
                                  value={p.name}
                                  onChange={(e) => handlePanitiaChange(idx, 'name', e.target.value)}
                                  placeholder="Nama panitia *"
                                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 h-8 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <input
                                  type="text"
                                  value={p.nim || ''}
                                  onChange={(e) => handlePanitiaChange(idx, 'nim', e.target.value)}
                                  placeholder="NIM (opsional)"
                                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 h-8 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                <input
                                  type="text"
                                  value={p.division}
                                  onChange={(e) => handlePanitiaChange(idx, 'division', e.target.value)}
                                  placeholder="Divisi"
                                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 h-8 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                <input
                                  type="text"
                                  value={p.contact}
                                  onChange={(e) => handlePanitiaChange(idx, 'contact', e.target.value)}
                                  placeholder="No. WhatsApp"
                                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 h-8 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                              </div>
                            </div>
                          ))}

                          {panitiaList.length === 0 && (
                            <p className="text-center text-slate-400 py-2 text-xs">
                              Belum ada anggota tambahan.
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAddPanitiaRow('', '')}
                          className="w-full py-1.5 border border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-slate-600 hover:text-blue-600 rounded-lg font-medium text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Tambah Anggota</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Deskripsi Singkat */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Deskripsi Singkat
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Gambaran umum atau konsep kegiatan..."
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>

                {/* 5. Tujuan & Output */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-blue-600" />
                      <span>Tujuan &amp; Output</span>
                    </label>
                    {tujuanArrayCount > 0 && (
                      <span className="text-[10px] text-slate-400">{tujuanArrayCount} butir</span>
                    )}
                  </div>

                  <textarea
                    rows={3}
                    value={tujuanText}
                    onChange={(e) => setTujuanText(e.target.value)}
                    placeholder="1. Target capaian kegiatan&#10;2. Luaran atau modul yang dihasilkan"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition resize-y"
                  />

                  {/* Pills saran target ringkas */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                    {[
                      'Partisipasi 100+ Peserta', 
                      'Luaran Modul / Karya', 
                      'Kepuasan ≥ 85%',
                      'Publikasi Dokumentasi'
                    ].map((rec, rIdx) => (
                      <button
                        key={rIdx}
                        type="button"
                        onClick={() => {
                          if (!tujuanText.includes(rec)) {
                            setTujuanText(prev => prev.trim() ? `${prev.trim()}\n${rec}` : rec);
                          }
                        }}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 transition cursor-pointer"
                      >
                        + {rec}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Sticky Modal Footer: Kontrol Navigasi */}
          <div className="px-5 sm:px-6 py-3 border-t border-slate-100 bg-white shrink-0 flex items-center justify-between gap-3">
            {currentStep === 1 ? (
              <>
                <Button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl font-semibold h-9 px-4 bg-red-600 hover:bg-red-700 text-white shadow-none cursor-pointer active:scale-95 transition text-xs"
                >
                  Batal
                </Button>
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="rounded-xl font-semibold h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white shadow-none cursor-pointer active:scale-95 flex items-center gap-1.5 transition text-xs"
                >
                  <span>Lanjut</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl font-semibold h-9 px-4 bg-red-600 hover:bg-red-700 text-white shadow-none cursor-pointer active:scale-95 transition text-xs"
                  >
                    Batal
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevStep}
                    className="rounded-xl font-semibold h-9 px-3 border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer flex items-center gap-1.5 transition text-xs"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Kembali</span>
                  </Button>
                </div>
                <Button
                  type="submit"
                  className="rounded-xl font-semibold h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white shadow-none cursor-pointer active:scale-95 flex items-center gap-1.5 transition text-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  <span>Simpan Program Kerja</span>
                </Button>
              </>
            )}
          </div>

        </form>
      </DialogContent>
    </Dialog>
  );
}
