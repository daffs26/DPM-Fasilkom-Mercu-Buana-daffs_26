import React, { useState } from 'react';
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
import { X, UploadCloud, CheckCircle2, FileText, AlertTriangle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import DropdownSelect from '@/components/ui/dropdown-select';

const CATEGORY_OPTIONS = [
  { value: 'Perizinan & Dispensasi', label: 'Perizinan & Dispensasi' },
  { value: 'Persidangan Ormawa', label: 'Persidangan Ormawa' },
  { value: 'Sponsorship & Kemitraan', label: 'Sponsorship & Kemitraan' },
  { value: 'Sarana & Peminjaman Ruangan', label: 'Sarana & Peminjaman Ruangan' },
  { value: 'LPJ & Keuangan', label: 'LPJ & Keuangan' },
  { value: 'Dokumen Lainnya', label: 'Dokumen Lainnya' }
];

const FORMAT_OPTIONS = [
  { value: 'DOCX', label: 'Microsoft Word (.docx)' },
  { value: 'PDF', label: 'Dokumen PDF (.pdf)' },
  { value: 'XLSX', label: 'Microsoft Excel (.xlsx)' }
];

export default function UploadTemplateModal({ isOpen, onClose }) {
  const { addTemplate, currentUserName } = useStore();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Perizinan & Dispensasi');
  const [format, setFormat] = useState('DOCX');
  const [author, setAuthor] = useState('DPM FASILKOM UMB');
  const [description, setDescription] = useState('');
  const [contentPreview, setContentPreview] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      const ext = file.name.split('.').pop()?.toUpperCase() || 'DOCX';
      setSelectedFile({
        name: file.name,
        size: `${sizeMB} MB`,
        type: ext
      });
      if (['DOCX', 'PDF', 'XLSX'].includes(ext)) {
        setFormat(ext);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Mohon isi Judul Template Dokumen!');
      return;
    }

    let categorySlug = 'dispensasi';
    if (category.includes('Persidangan')) categorySlug = 'persidangan';
    else if (category.includes('Sponsorship')) categorySlug = 'sponsorship';
    else if (category.includes('Ruangan')) categorySlug = 'ruangan';
    else if (category.includes('LPJ')) categorySlug = 'lpj';

    addTemplate({
      title: title.trim(),
      category,
      categorySlug,
      format,
      fileSize: selectedFile ? selectedFile.size : '180 KB',
      author: author.trim() || currentUserName,
      description: description.trim() || 'Template dokumen resmi ormawa Fasilkom UMB.',
      tags: [category.split(' ')[0], format, 'Template Baru'],
      fields: ['[Nama Ormawa]', '[Nama Kegiatan]', '[Tanggal Pelaksanaan]'],
      contentPreview: contentPreview.trim() || `TEMPLATE DOKUMEN: ${title.toUpperCase()}\nFAKULTAS ILMU KOMPUTER UNIVERSITAS MERCU BUANA\n\n[Silakan sesuaikan isi draf dokumen ini dengan kebutuhan kegiatan Anda.]`
    });

    // Reset state & close
    setTitle('');
    setDescription('');
    setContentPreview('');
    setSelectedFile(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl p-0 overflow-hidden rounded-3xl border border-slate-200/80 shadow-2xl">
        <DialogHeader className="px-6 pt-5 pb-3 border-b border-slate-100 bg-slate-50/70 space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-bold bg-white text-slate-700 border-slate-200">
              Bank Dokumen
            </Badge>
            <span className="text-xs text-slate-500 font-medium">Unggah Template Baru</span>
          </div>
          <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">
            Simpan Template Dokumen Baru
          </DialogTitle>
          <DialogDescription className="sr-only">
            Form pendaftaran template dokumen resmi
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 pt-3 pb-6 space-y-4 text-xs max-h-[calc(85vh-130px)] overflow-y-auto">
          {/* Judul Template */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">
              Judul Template Dokumen <span className="text-rose-500">*</span>
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

          {/* Kategori & Format Berkas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Kategori Dokumen
              </label>
              <DropdownSelect
                value={category}
                onChange={(val) => setCategory(val)}
                options={CATEGORY_OPTIONS}
                className="w-full"
                triggerClassName="w-full bg-slate-50 hover:bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 flex items-center justify-between"
                contentClassName="w-full min-w-full z-[100] shadow-xl"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Format Berkas
              </label>
              <DropdownSelect
                value={format}
                onChange={(val) => setFormat(val)}
                options={FORMAT_OPTIONS}
                className="w-full"
                triggerClassName="w-full bg-slate-50 hover:bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 flex items-center justify-between"
                contentClassName="w-full min-w-full z-[100] shadow-xl"
              />
            </div>
          </div>

          {/* Ormawa Pemilik / Penanggung Jawab */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">
              Ormawa / Instansi Pengunggah
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder=""
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Deskripsi Singkat */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">
              Deskripsi &amp; Panduan Penggunaan
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder=""
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
            />
          </div>

          {/* Drag & Drop File Upload */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">
              Upload File Berkas Template (Opsional)
            </label>
            <div className="border-2 border-dashed border-slate-200 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50 rounded-2xl p-4 text-center cursor-pointer relative transition">
              <input
                type="file"
                accept=".pdf,.docx,.doc,.xlsx,.xls,.txt"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <UploadCloud className="w-7 h-7 text-slate-500 mx-auto mb-1.5" />
              {selectedFile ? (
                <div>
                  <p className="font-bold text-xs text-emerald-600 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    {selectedFile.name} ({selectedFile.size})
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Klik untuk mengganti berkas</p>
                </div>
              ) : (
                <div>
                  <p className="font-bold text-slate-700 text-xs">
                    Pilih berkas template atau Tarik (Drag &amp; Drop) ke sini
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Format DOCX, PDF, atau XLSX (Maksimal 25MB)</p>
                </div>
              )}
            </div>
          </div>

          {/* Draf Format Teks */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">
              Draf Teks Format Template (Untuk Pratinjau &amp; Fitur Salin)
            </label>
            <textarea
              rows={4}
              value={contentPreview}
              onChange={(e) => setContentPreview(e.target.value)}
              placeholder=""
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-mono text-[11px] text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
            />
          </div>

          <DialogFooter className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition"
            >
              Simpan Template
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
