import React, { useState, useEffect, useRef } from 'react';
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
  X, 
  Download, 
  Copy, 
  Check, 
  Printer, 
  FileText, 
  CheckCircle2, 
  Edit3,
  Save,
  UploadCloud
} from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function TemplatePreviewModal({ isOpen, onClose, template }) {
  const { templates, updateTemplate, incrementTemplateDownload } = useStore();
  
  // Ambil data template paling mutakhir dari store berdasarkan ID
  const activeTemplate = templates.find(t => t.id === template?.id) || template;

  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updateMode, setUpdateMode] = useState('upload'); // 'upload' | 'text'
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fileInputRef = useRef(null);

  // Sinkronisasi data saat template dibuka atau berganti
  useEffect(() => {
    if (activeTemplate) {
      setEditTitle(activeTemplate.title || '');
      setEditContent(activeTemplate.contentPreview || activeTemplate.description || '');
      setIsEditing(false);
      setUpdateMode('upload');
      setUploadedFile(null);
      setIsDragging(false);
      setSaveSuccess(false);
    }
  }, [activeTemplate?.id, isOpen]);

  if (!isOpen || !activeTemplate) return null;

  const handleStartEdit = () => {
    setEditTitle(activeTemplate.title || '');
    setEditContent(activeTemplate.contentPreview || activeTemplate.description || '');
    setUploadedFile(null);
    setUpdateMode('upload');
    setIsEditing(true);
    setSaveSuccess(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(activeTemplate.title || '');
    setEditContent(activeTemplate.contentPreview || activeTemplate.description || '');
    setUploadedFile(null);
    setIsEditing(false);
  };

  const processFile = (file) => {
    const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';
    const sizeFormatted = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`;

    setUploadedFile({
      name: file.name,
      size: sizeFormatted,
      format: ext,
      rawFile: file
    });

    // Jika file .txt, baca teksnya langsung ke isi template
    if (file.name.toLowerCase().endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        if (typeof text === 'string') {
          setEditContent(text);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleSaveUpdate = () => {
    if (!editTitle.trim()) {
      alert('Judul template tidak boleh kosong.');
      return;
    }

    const updatedPayload = {
      title: editTitle.trim(),
      contentPreview: editContent
    };

    if (uploadedFile) {
      updatedPayload.fileSize = uploadedFile.size;
      updatedPayload.format = uploadedFile.format;
      if (uploadedFile.rawFile) {
        updatedPayload.uploadedFileUrl = URL.createObjectURL(uploadedFile.rawFile);
        updatedPayload.uploadedFileName = uploadedFile.name;
      }
    }

    updateTemplate(activeTemplate.id, updatedPayload);

    setIsEditing(false);
    setUploadedFile(null);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCopyText = async () => {
    try {
      const textToCopy = isEditing ? editContent : (activeTemplate.contentPreview || activeTemplate.description);
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDownload = () => {
    incrementTemplateDownload(activeTemplate.id);

    // Jika ada file asli yang pernah diunggah
    if (activeTemplate.uploadedFileUrl) {
      const link = document.createElement('a');
      link.href = activeTemplate.uploadedFileUrl;
      link.download = activeTemplate.uploadedFileName || `${activeTemplate.title}.${(activeTemplate.format || 'docx').toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // Buat file blob dari konten template untuk download langsung
    const content = activeTemplate.contentPreview || activeTemplate.description;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeTitle = (activeTemplate.title || 'template').toLowerCase().replace(/[^a-z0-9]/g, '_');
    link.download = `${safeTitle}_template.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] sm:max-w-3xl p-0 overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-2xl max-h-[92vh] flex flex-col">
        {/* Modal Top Bar */}
        <DialogHeader className="px-4 sm:px-6 py-3 border-b border-slate-100 bg-slate-50/70 flex flex-row items-center justify-between space-y-0 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
              {uploadedFile?.format || activeTemplate.format}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Badge variant="outline" className="text-[10px] font-semibold bg-white text-slate-700 border-slate-200 py-0 px-2">
                  {activeTemplate.category}
                </Badge>
                {isEditing && (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                    Mode Edit Template
                  </span>
                )}
                {saveSuccess && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Tersimpan
                  </span>
                )}
              </div>

              {isEditing ? (
                <div className="mt-1">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full text-xs font-bold text-slate-900 bg-white border border-blue-300 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="Judul template..."
                  />
                </div>
              ) : (
                <DialogTitle className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5 truncate">
                  {activeTemplate.title}
                </DialogTitle>
              )}
            </div>
          </div>
          <DialogDescription className="sr-only">
            Pratinjau dokumen template resmi
          </DialogDescription>
        </DialogHeader>

        {/* Modal Body: Document Preview / Update Options */}
        <div className="p-4 sm:p-6 max-h-[calc(92vh-130px)] overflow-y-auto space-y-4 text-xs bg-slate-50/30">
          {/* Pilihan Metode Update Saat Mode Edit Aktif */}
          {isEditing && (
            <div className="flex items-center justify-center p-1 bg-slate-100 rounded-xl max-w-xs mx-auto border border-slate-200">
              <button
                type="button"
                onClick={() => setUpdateMode('upload')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition ${
                  updateMode === 'upload'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload Dokumen</span>
              </button>
              <button
                type="button"
                onClick={() => setUpdateMode('text')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition ${
                  updateMode === 'text'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Teks Manual</span>
              </button>
            </div>
          )}

          {/* Lembar Dokumen / Konten Update */}
          <div className="bg-white p-4 sm:p-7 md:p-8 rounded-2xl border border-slate-200 shadow-sm print-page">
            {/* Kop Surat Resmi */}
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b-2 sm:border-b-4 border-double border-slate-900 gap-2 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center p-0.5">
                <img 
                  src="/logos/logo-dpm.png" 
                  alt="Logo DPM Fasilkom UMB" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <div className="text-center flex-1 px-1 sm:px-3">
                <h2 className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-red-700">
                  UNIVERSITAS MERCU BUANA
                </h2>
                <h1 className="text-xs sm:text-sm font-extrabold tracking-tight uppercase text-slate-900 mt-0.5 leading-snug">
                  DEWAN PERWAKILAN MAHASISWA FAKULTAS ILMU KOMPUTER
                </h1>
                <p className="text-[8px] sm:text-[9px] text-slate-600 font-medium mt-0.5 hidden sm:block">
                  Gedung Kuliah Terpadu Lantai 3, Jl. Meruya Selatan No. 1, Kembangan, Jakarta Barat 11650
                </p>
                <p className="text-[8px] sm:text-[9px] text-slate-600">
                  Email: dpm.fasilkom@mercubuana.ac.id • Laman: dpm-fasilkom.mercubuana.ac.id
                </p>
              </div>
            </div>

            {/* Konten Dokumen Berdasarkan Mode */}
            <div className="mt-4">
              {isEditing ? (
                updateMode === 'upload' ? (
                  /* OPSI 1: UPLOAD BERKAS DOKUMEN */
                  <div className="space-y-4">
                    {uploadedFile ? (
                      <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                            {uploadedFile.format}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">{uploadedFile.name}</p>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                              <span>Ukuran: <strong className="text-slate-800">{uploadedFile.size}</strong></span>
                              <span>•</span>
                              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                Berkas siap di-update
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => { setUploadedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-100 rounded-lg transition border border-rose-200 shrink-0"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Ganti File</span>
                        </button>
                      </div>
                    ) : (
                      <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleFileDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition ${
                          isDragging
                            ? 'border-blue-500 bg-blue-50/70'
                            : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50/20 bg-slate-50/50'
                        }`}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".docx,.doc,.pdf,.txt,.xlsx,.pptx"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-2">
                          <UploadCloud className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold text-slate-800">
                          Klik untuk memilih berkas dokumen atau seret & lepas ke sini
                        </p>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Format: <strong className="text-slate-700">.DOCX, .PDF, .TXT</strong> (Maksimal 10 MB)
                        </p>
                      </div>
                    )}

                    {/* Pratinjau Teks Template Saat Ini */}
                    <div className="pt-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mb-1">
                        <span>Pratinjau isi dokumen:</span>
                        <span className="text-[10px] text-slate-400">Tersimpan otomatis saat update</span>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 max-h-44 overflow-y-auto">
                        <pre className="font-sans whitespace-pre-wrap text-[11px] leading-relaxed text-slate-700">
                          {editContent || activeTemplate.contentPreview}
                        </pre>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* OPSI 2: EDIT TEKS MANUAL */
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                      <span>Edit format isi surat template:</span>
                      <span className="text-[10px] text-blue-600 font-semibold">{editContent.length} karakter</span>
                    </div>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={14}
                      className="w-full font-mono sm:font-sans text-xs leading-relaxed text-slate-800 bg-slate-50/50 border border-blue-200 focus:border-blue-500 focus:bg-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-100 transition resize-y min-h-[260px]"
                      placeholder="Tuliskan format isi template..."
                    />
                  </div>
                )
              ) : (
                /* MODE PRATINJAU DOKUMEN BIASA */
                <pre className="font-sans whitespace-pre-wrap text-[11px] leading-relaxed text-slate-800 selection:bg-blue-100">
                  {activeTemplate.contentPreview}
                </pre>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer: Info Ukuran File & Tombol Aksi Ramping */}
        <DialogFooter className="px-4 sm:px-6 py-2.5 border-t border-slate-100 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
          {/* Info Ukuran File: Terlindungi & Tidak Pernah Tertutup */}
          <div className="text-slate-500 text-xs font-medium shrink-0 flex items-center gap-1.5">
            <span>Ukuran File: <strong className="text-slate-800 font-bold">{uploadedFile?.size || activeTemplate.fileSize}</strong></span>
            {uploadedFile && (
              <span className="text-blue-600 text-[10px] font-semibold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                Baru
              </span>
            )}
          </div>

          {/* Tombol Aksi: Ramping, Proporsional, Tidak Berdesakan */}
          <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap justify-end w-full sm:w-auto">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                >
                  <X className="w-3.5 h-3.5 text-slate-500" />
                  <span>Batal</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveUpdate}
                  className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Perubahan</span>
                </button>
              </>
            ) : (
              <>
                {/* Fitur Update Template - Letaknya di KIRI button Salin Teks */}
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 transition shrink-0"
                  title="Update isi atau upload file template"
                >
                  <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Update Template</span>
                </button>

                {/* Button Salin Teks Template */}
                <button
                  type="button"
                  onClick={handleCopyText}
                  className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition shrink-0"
                  title="Salin teks template ke clipboard"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Salin Teks</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition shrink-0"
                  title="Cetak PDF"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                  <span>Cetak PDF</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh</span>
                </button>
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
