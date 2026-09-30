import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Video, 
  Plus, 
  X, 
  Trash2, 
  Eye, 
  Play, 
  UploadCloud, 
  Link as LinkIcon, 
  ExternalLink,
  Film,
  Calendar,
  Tag,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';

// Helper mengekstrak embed URL YouTube
export function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = String(url).match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}?autoplay=1` : null;
}

// Helper mengekstrak thumbnail YouTube
export function getYouTubeThumbnail(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = String(url).match(regExp);
  return (match && match[2].length === 11) ? `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg` : null;
}

// Helper mengekstrak Google Drive preview link
export function getGoogleDriveEmbedUrl(url) {
  if (!url) return null;
  if (url.includes('drive.google.com/file/d/')) {
    return url.replace(/\/view(\?.*)?$/, '/preview');
  }
  return null;
}

export default function DetailDokumentasiTab({
  proker,
  mediaItems = [],
  onAddMedia,
  onDeleteMedia
}) {
  const currentUser = useStore(state => state.currentUser);
  const isGuest = currentUser?.role === 'guest';

  // State untuk form tambah media
  const [isAddingMedia, setIsAddingMedia] = useState(false);
  const [mediaType, setMediaType] = useState('image'); // 'image' | 'video'
  const [sourceType, setSourceType] = useState('upload'); // 'upload' | 'url'
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaCaption, setMediaCaption] = useState('');
  const [mediaCategory, setMediaCategory] = useState('Acara Utama');
  const [mediaUrlInput, setMediaUrlInput] = useState('');
  const [uploadedDataUrl, setUploadedDataUrl] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileSize, setUploadedFileSize] = useState('');
  const [formError, setFormError] = useState('');

  // Filter gallery
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'image' | 'video'

  // Modal Lightbox Preview
  const [previewMediaItem, setPreviewMediaItem] = useState(null);

  const fileInputRef = useRef(null);

  const photoCount = mediaItems.filter(m => m.type === 'image').length;
  const videoCount = mediaItems.filter(m => m.type === 'video').length;

  const filteredMedia = mediaItems.filter(item => {
    if (typeFilter === 'image') return item.type === 'image';
    if (typeFilter === 'video') return item.type === 'video';
    return true;
  });

  // Handler upload berkas lokal
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormError('');

    const maxImageSize = 5 * 1024 * 1024; // 5 MB
    const maxVideoSize = 25 * 1024 * 1024; // 25 MB

    if (mediaType === 'image' && file.size > maxImageSize) {
      setFormError('Ukuran foto terlalu besar. Maksimal 5 MB.');
      return;
    }

    if (mediaType === 'video' && file.size > maxVideoSize) {
      setFormError('Ukuran video terlalu besar untuk penyimpanan lokal. Maksimal 25 MB atau gunakan tautan URL video.');
      return;
    }

    const sizeInKb = Math.round(file.size / 1024);
    const sizeStr = sizeInKb > 1024 ? `${(sizeInKb / 1024).toFixed(1)} MB` : `${sizeInKb} KB`;

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedDataUrl(event.target.result);
      setUploadedFileName(file.name);
      setUploadedFileSize(sizeStr);
      if (!mediaTitle.trim()) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setMediaTitle(cleanName);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetForm = () => {
    setMediaTitle('');
    setMediaCaption('');
    setMediaCategory('Acara Utama');
    setMediaUrlInput('');
    setUploadedDataUrl(null);
    setUploadedFileName('');
    setUploadedFileSize('');
    setFormError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsAddingMedia(false);
  };

  const handleSubmitMedia = (e) => {
    e.preventDefault();
    setFormError('');

    if (!mediaTitle.trim()) {
      setFormError('Judul dokumentasi wajib diisi.');
      return;
    }

    let finalUrl = '';
    if (sourceType === 'upload') {
      if (!uploadedDataUrl) {
        setFormError('Harap pilih berkas foto atau video yang ingin diunggah.');
        return;
      }
      finalUrl = uploadedDataUrl;
    } else {
      if (!mediaUrlInput.trim()) {
        setFormError('Tautan URL media wajib diisi.');
        return;
      }
      finalUrl = mediaUrlInput.trim();
    }

    const today = new Date();
    const formattedDate = today.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const newMedia = {
      id: `media-${Date.now()}`,
      type: mediaType,
      sourceType,
      url: finalUrl,
      title: mediaTitle.trim(),
      caption: mediaCaption.trim(),
      category: mediaCategory,
      fileName: uploadedFileName || null,
      fileSize: uploadedFileSize || null,
      uploadedAt: formattedDate,
      uploader: currentUser?.name || 'Panitia'
    };

    onAddMedia(newMedia);
    handleResetForm();
  };

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <h4 className="font-extrabold text-xs text-slate-900">
            Dokumentasi &amp; Galeri Media
          </h4>
          <p className="text-[11px] text-slate-500">
            Koleksi foto kegiatan dan tautan video dokumentasi resmi program kerja.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {!isGuest && (
            <button
              type="button"
              onClick={() => {
                setIsAddingMedia(!isAddingMedia);
                setFormError('');
              }}
              className="min-h-[40px] h-10 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition cursor-pointer active:scale-95"
            >
              {isAddingMedia ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span className="tracking-tight">{isAddingMedia ? 'Tutup Form' : 'Tambah Foto / Video'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Form Tambah Media Baru */}
      {isAddingMedia && !isGuest && (
        <form onSubmit={handleSubmitMedia} className="p-4 sm:p-5 rounded-2xl border border-blue-200 bg-blue-50/50 space-y-4 animate-in fade-in-50">
          <div className="flex items-center justify-between border-b border-blue-100 pb-2.5">
            <span className="font-extrabold text-xs text-blue-900 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-blue-600" />
              <span>Tambah Dokumentasi Baru</span>
            </span>
            <span className="text-[10px] text-blue-700 font-semibold">
              Format: JPG, PNG, WebP, MP4, atau Link URL
            </span>
          </div>

          {/* Pemilih Tipe Media (Foto vs Video) */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setMediaType('image');
                setUploadedDataUrl(null);
                setFormError('');
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition border cursor-pointer ${
                mediaType === 'image'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Foto Kegiatan</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMediaType('video');
                setUploadedDataUrl(null);
                setFormError('');
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition border cursor-pointer ${
                mediaType === 'video'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Video / Aftermovie</span>
            </button>
          </div>

          {/* Pemilih Metode Input (Unggah Berkas vs Link URL) */}
          <div className="flex items-center gap-2 pt-0.5">
            <span className="text-[11px] font-bold text-slate-600">Metode Sumber:</span>
            <div className="inline-flex rounded-xl bg-slate-200/70 p-0.5">
              <button
                type="button"
                onClick={() => {
                  setSourceType('upload');
                  setFormError('');
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  sourceType === 'upload' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UploadCloud className="w-3 h-3" />
                <span>Unggah Berkas</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSourceType('url');
                  setFormError('');
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  sourceType === 'url' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LinkIcon className="w-3 h-3" />
                <span>Tautan URL</span>
              </button>
            </div>
          </div>

          {/* Input Sumber Berkas / URL */}
          {sourceType === 'upload' ? (
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-700">
                Pilih Berkas {mediaType === 'image' ? 'Foto (JPG, PNG, WebP)' : 'Video Pendek (MP4, WebM)'}:
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept={mediaType === 'image' ? 'image/*' : 'video/mp4,video/webm'}
                onChange={handleFileChange}
                className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer border border-slate-200 rounded-xl bg-white p-1"
              />
              {uploadedFileName && (
                <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Berkas dipilih: {uploadedFileName} ({uploadedFileSize})</span>
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-700">
                {mediaType === 'video' ? 'Tautan Video (YouTube, Google Drive, atau MP4 direct):' : 'Tautan URL Gambar:'}
              </label>
              <input
                type="url"
                value={mediaUrlInput}
                onChange={(e) => setMediaUrlInput(e.target.value)}
                placeholder={mediaType === 'video' ? 'https://www.youtube.com/watch?v=... atau link video' : 'https://images.unsplash.com/...'}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Form Metadata: Judul, Kategori & Deskripsi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-700">
                Judul Dokumentasi <span className="text-rose-500">*</span>:
              </label>
              <input
                type="text"
                value={mediaTitle}
                onChange={(e) => setMediaTitle(e.target.value)}
                placeholder="Contoh: Foto Bersama Dekanat dan Narasumber"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-700">
                Kategori Dokumentasi:
              </label>
              <select
                value={mediaCategory}
                onChange={(e) => setMediaCategory(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Acara Utama">Acara Utama</option>
                <option value="Pembukaan">Pembukaan &amp; Sambutan</option>
                <option value="Sesi Materi">Sesi Materi &amp; Diskusi</option>
                <option value="Foto Bersama">Foto Bersama</option>
                <option value="Dokumentasi Panitia">Dokumentasi Panitia</option>
                <option value="Penutupan">Penutupan &amp; Penyerahan Plakat</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-700">
              Keterangan / Catatan Singkat (Opsional):
            </label>
            <input
              type="text"
              value={mediaCaption}
              onChange={(e) => setMediaCaption(e.target.value)}
              placeholder="Contoh: Diambil di Aula Gedung B lantai 4 saat sesi pembukaan."
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Kotak Pratinjau Cepat */}
          {(uploadedDataUrl || mediaUrlInput) && (
            <div className="p-3 bg-white rounded-xl border border-blue-200 space-y-2">
              <span className="text-[10px] font-bold text-slate-500 block uppercase">
                Pratinjau Media Sebelum Simpan:
              </span>
              <div className="aspect-video max-h-48 rounded-lg overflow-hidden bg-slate-900 flex items-center justify-center">
                {mediaType === 'image' ? (
                  <img
                    src={uploadedDataUrl || mediaUrlInput}
                    alt="Pratinjau"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <>
                    {sourceType === 'url' && getYouTubeEmbedUrl(mediaUrlInput) ? (
                      <iframe
                        src={getYouTubeEmbedUrl(mediaUrlInput)}
                        title="Pratinjau YouTube"
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    ) : (
                      <video
                        src={uploadedDataUrl || mediaUrlInput}
                        controls
                        className="w-full h-full object-contain"
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Error Message */}
          {formError && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Tombol Aksi Form */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={handleResetForm}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
            >
              Simpan Dokumentasi
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs & Stats Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
        <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setTypeFilter('all')}
            className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer active:scale-95 ${
              typeFilter === 'all'
                ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="tracking-tight">Semua Media</span>
            <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-mono bg-slate-200 text-slate-700 font-bold tabular-nums">
              {mediaItems.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setTypeFilter('image')}
            className={`min-h-[36px] flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer active:scale-95 ${
              typeFilter === 'image'
                ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="tracking-tight">Foto</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-mono bg-slate-200 text-slate-700 font-bold tabular-nums">
              {photoCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setTypeFilter('video')}
            className={`min-h-[36px] flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer active:scale-95 ${
              typeFilter === 'video'
                ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span className="tracking-tight">Video</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-mono bg-slate-200 text-slate-700 font-bold tabular-nums">
              {videoCount}
            </span>
          </button>
        </div>

        <span className="text-[11px] text-slate-500 font-medium">
          Menampilkan <strong className="text-slate-800 font-black tabular-nums">{filteredMedia.length}</strong> dari <span className="tabular-nums">{mediaItems.length}</span> media
        </span>
      </div>

      {/* Media Grid / Empty State */}
      {filteredMedia.length === 0 ? (
        <div className="p-8 sm:p-12 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center mx-auto shadow-2xs">
            <Camera className="w-6 h-6 stroke-[1.8]" />
          </div>
          <div className="max-w-sm mx-auto space-y-1">
            <h5 className="font-extrabold text-xs text-slate-800 tracking-tight">
              Belum Ada Dokumentasi {typeFilter === 'image' ? 'Foto' : typeFilter === 'video' ? 'Video' : 'Kegiatan'}
            </h5>
            <p className="text-[11px] text-slate-500 leading-normal">
              {isGuest
                ? 'Panitia belum mengunggah foto atau video dokumentasi resmi untuk kegiatan ini.'
                : 'Unggah foto keseruan kegiatan atau sematkan tautan video dokumentasi program kerja ini.'}
            </p>
          </div>
          {!isGuest && (
            <button
              type="button"
              onClick={() => setIsAddingMedia(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[40px] h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition cursor-pointer mt-2 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="tracking-tight">Unggah Dokumentasi Sekarang</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {filteredMedia.map((item) => {
            const isVideo = item.type === 'video';
            const ytThumb = isVideo ? getYouTubeThumbnail(item.url) : null;

            return (
              <div
                key={item.id}
                className="group bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-card hover:border-slate-300 transition-all duration-200 overflow-hidden flex flex-col justify-between"
              >
                {/* Media Thumbnail Container */}
                <div 
                  onClick={() => setPreviewMediaItem(item)}
                  className="relative aspect-video bg-slate-900 cursor-pointer overflow-hidden flex items-center justify-center"
                >
                  {isVideo ? (
                    ytThumb ? (
                      <img
                        src={ytThumb}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-400">
                        <Film className="w-10 h-10 opacity-40" />
                      </div>
                    )
                  ) : (
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}

                  {/* Play Overlay Icon for Video */}
                  {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition">
                      <div className="w-10 h-10 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                    </div>
                  )}

                  {/* Type Badge (Top Left) */}
                  <div className="absolute top-2 left-2 flex items-center gap-1">
                    <span className={`text-[10px] font-bold tracking-tight px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1 ${
                      isVideo
                        ? 'bg-rose-600/90 text-white'
                        : 'bg-slate-900/80 text-white'
                    }`}>
                      {isVideo ? <Video className="w-3 h-3" /> : <Camera className="w-3 h-3" />}
                      <span>{isVideo ? 'Video' : 'Foto'}</span>
                    </span>
                  </div>

                  {/* Quick Action Overlay (Top Right) */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 opacity-90 group-hover:opacity-100 transition">
                    {!isGuest && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteMedia(item.id);
                        }}
                        className="w-8 h-8 rounded-lg bg-black/60 hover:bg-rose-600 text-white flex items-center justify-center transition shadow-xs cursor-pointer active:scale-90"
                        title="Hapus media ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Media Card Info */}
                <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {item.category || 'Dokumentasi'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium tracking-tight">
                        {item.uploadedAt}
                      </span>
                    </div>

                    <h5 className="font-black text-xs text-slate-900 tracking-tight line-clamp-1 group-hover:text-blue-600 transition" title={item.title}>
                      {item.title}
                    </h5>

                    {item.caption && (
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed tracking-normal font-normal">
                        {item.caption}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-medium tracking-normal truncate">
                      Oleh: {item.uploader || 'Panitia'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPreviewMediaItem(item)}
                      className="min-h-[32px] px-2 py-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer transition active:scale-95"
                    >
                      <span className="tracking-tight">{isVideo ? 'Putar Video' : 'Lihat Penuh'}</span>
                      <Eye className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Lightbox Preview Media */}
      {previewMediaItem && (
        <Dialog open={!!previewMediaItem} onOpenChange={(open) => !open && setPreviewMediaItem(null)}>
          <DialogContent className="w-[95vw] sm:max-w-3xl p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-2xl max-h-[92vh] flex flex-col">
            <DialogHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    previewMediaItem.type === 'video' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {previewMediaItem.type === 'video' ? 'Video Dokumentasi' : 'Foto Dokumentasi'}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {previewMediaItem.category} • {previewMediaItem.uploadedAt}
                  </span>
                </div>
                <DialogTitle className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
                  {previewMediaItem.title}
                </DialogTitle>
                {previewMediaItem.caption && (
                  <DialogDescription className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {previewMediaItem.caption}
                  </DialogDescription>
                )}
              </div>
            </DialogHeader>

            <div className="py-4 flex-1 flex items-center justify-center overflow-hidden bg-slate-950 rounded-2xl min-h-[300px] max-h-[62vh]">
              {previewMediaItem.type === 'image' ? (
                <img
                  src={previewMediaItem.url}
                  alt={previewMediaItem.title}
                  className="max-h-[58vh] w-auto max-w-full object-contain rounded-lg shadow-lg"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {getYouTubeEmbedUrl(previewMediaItem.url) ? (
                    <iframe
                      src={getYouTubeEmbedUrl(previewMediaItem.url)}
                      title={previewMediaItem.title}
                      className="w-full aspect-video max-h-[58vh] rounded-lg border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : getGoogleDriveEmbedUrl(previewMediaItem.url) ? (
                    <iframe
                      src={getGoogleDriveEmbedUrl(previewMediaItem.url)}
                      title={previewMediaItem.title}
                      className="w-full aspect-video max-h-[58vh] rounded-lg border-0"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={previewMediaItem.url}
                      controls
                      autoPlay
                      className="max-h-[58vh] w-full object-contain rounded-lg"
                    />
                  )}
                </div>
              )}
            </div>

            <DialogFooter className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2">
              <span className="text-[11px] text-slate-400">
                Diunggah oleh: <strong className="text-slate-700">{previewMediaItem.uploader || 'Panitia'}</strong>
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {previewMediaItem.sourceType === 'url' && (
                  <a
                    href={previewMediaItem.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition flex items-center gap-1.5"
                  >
                    <span>Buka Tautan Sumber</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setPreviewMediaItem(null)}
                  className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
