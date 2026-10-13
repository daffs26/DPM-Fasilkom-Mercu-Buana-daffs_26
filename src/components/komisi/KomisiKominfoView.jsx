import React, { useState, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { 
  Calendar, 
  Palette, 
  Camera, 
  Plus, 
  CheckCircle2, 
  ExternalLink,
  FileText,
  Users,
  Video,
  UploadCloud,
  X,
  Play,
  AlertCircle
} from 'lucide-react';

const TOOL_OPTIONS = [
  { value: 'CapCut', label: 'CapCut' },
  { value: 'Figma', label: 'Figma' },
  { value: 'Adobe Photoshop', label: 'Adobe Photoshop' },
  { value: 'Canva', label: 'Canva' }
];

import { 
  DEFAULT_CONTENT_SCHEDULES, 
  DEFAULT_DESIGN_TASKS, 
  DEFAULT_MEDIA_PARTNER_NOTES 
} from '@/data/komisiKominfoData';

export default function KomisiKominfoView() {
  const { currentUser } = useStore(useShallow(state => ({
    currentUser: state.currentUser
  })));

  const canEdit = ['ketua', 'wakil', 'komisi_kominfo'].includes((currentUser?.role || '').toLowerCase());
  const [activeTab, setActiveTab] = useState('konten'); // 'konten' | 'desain' | 'mediapartner'

  // 1. Data Jadwal Konten
  const [contentSchedules, setContentSchedules] = useState(DEFAULT_CONTENT_SCHEDULES);

  // 2. Data Progress Desain Media & Sosmed
  const [designTasks, setDesignTasks] = useState(DEFAULT_DESIGN_TASKS);

  // 3. Bukti Kehadiran & Liputan Media Partner
  const [mediaPartnerNotes, setMediaPartnerNotes] = useState(DEFAULT_MEDIA_PARTNER_NOTES);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('konten'); // 'konten' | 'desain' | 'mediapartner'

  // Input states
  const [formKonten, setFormKonten] = useState({ title: '', platform: 'Instagram Feed', publishDate: '', pic: '', copywriting: '' });
  const [formDesain, setFormDesain] = useState({ title: '', format: 'Figma', designer: '', deadline: '', linkFigma: '' });
  const [formMP, setFormMP] = useState({ 
    eventTitle: '', 
    eventDate: '', 
    location: '', 
    repsAttended: '', 
    coverageNote: '', 
    documentationLink: '',
    mediaFiles: []
  });

  // Upload & Lightbox state
  const mediaInputRef = useRef(null);
  const [uploadError, setUploadError] = useState('');
  const [previewMedia, setPreviewMedia] = useState(null);

  // Batas maksimal section upload: 10 MB
  const MAX_SECTION_BYTES = 10 * 1024 * 1024; // 10 MB

  // Handler upload foto atau video (Section Max 10 MB)
  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadError('');

    const currentTotalBytes = (formMP.mediaFiles || []).reduce((acc, m) => acc + (m.sizeBytes || 0), 0);
    let accumulatedBytes = currentTotalBytes;
    const validFiles = [];

    for (const file of files) {
      const isVid = file.type.startsWith('video/');
      const isImg = file.type.startsWith('image/');

      if (!isVid && !isImg) {
        setUploadError(`Berkas "${file.name}" tidak didukung. Harap unggah foto (JPG, PNG, WebP) atau video (MP4, MOV, WebM).`);
        return;
      }

      if (file.size > MAX_SECTION_BYTES) {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
        setUploadError(`Berkas "${file.name}" (${sizeMb} MB) melebihi batas maksimal 10 MB untuk section ini.`);
        return;
      }

      if (accumulatedBytes + file.size > MAX_SECTION_BYTES) {
        const currentMb = (accumulatedBytes / (1024 * 1024)).toFixed(1);
        const fileMb = (file.size / (1024 * 1024)).toFixed(1);
        setUploadError(`Total berkas melebihi kuota section 10 MB! (Terpakai: ${currentMb} MB + Berkas baru: ${fileMb} MB).`);
        return;
      }

      accumulatedBytes += file.size;
      validFiles.push(file);
    }

    // Baca berkas dengan FileReader
    validFiles.forEach(file => {
      const isVid = file.type.startsWith('video/');
      const sizeInKb = Math.round(file.size / 1024);
      const sizeStr = sizeInKb > 1024 ? `${(sizeInKb / 1024).toFixed(1)} MB` : `${sizeInKb} KB`;

      const reader = new FileReader();
      reader.onload = (event) => {
        setFormMP(prev => ({
          ...prev,
          mediaFiles: [
            ...(prev.mediaFiles || []),
            {
              id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
              name: file.name,
              sizeStr,
              sizeBytes: file.size,
              type: isVid ? 'video' : 'image',
              url: event.target.result
            }
          ]
        }));
      };
      reader.readAsDataURL(file);
    });

    if (mediaInputRef.current) {
      mediaInputRef.current.value = '';
    }
  };

  const handleRemoveMedia = (idToRemove) => {
    setFormMP(prev => ({
      ...prev,
      mediaFiles: (prev.mediaFiles || []).filter(m => m.id !== idToRemove)
    }));
    setUploadError('');
  };

  const handleSaveModal = (e) => {
    e.preventDefault();
    if (modalType === 'konten') {
      if (!formKonten.title) return;
      setContentSchedules([{
        id: `konten-${Date.now()}`,
        title: formKonten.title,
        platform: formKonten.platform,
        publishDate: formKonten.publishDate || 'Segera',
        status: 'Drafting',
        pic: formKonten.pic || currentUser?.name || 'Kominfo',
        copywriting: formKonten.copywriting,
        tags: ['#DPMFASILKOM']
      }, ...contentSchedules]);
      setFormKonten({ title: '', platform: 'Instagram Feed', publishDate: '', pic: '', copywriting: '' });
    } else if (modalType === 'desain') {
      if (!formDesain.title) return;
      setDesignTasks([{
        id: `ds-${Date.now()}`,
        title: formDesain.title,
        format: formDesain.format || 'Figma',
        designer: formDesain.designer || currentUser?.name || 'Tim Desain',
        progress: 10,
        status: 'Pengerjaan',
        deadline: formDesain.deadline || 'Minggu ini',
        linkFigma: formDesain.linkFigma || '#'
      }, ...designTasks]);
      setFormDesain({ title: '', format: 'Figma', designer: '', deadline: '', linkFigma: '' });
    } else {
      if (!formMP.eventTitle) return;
      setMediaPartnerNotes([{
        id: `mp-${Date.now()}`,
        eventTitle: formMP.eventTitle,
        eventDate: formMP.eventDate || 'Hari ini',
        location: formMP.location || 'Fasilkom UMB',
        repsAttended: formMP.repsAttended || currentUser?.name || 'Tim Kominfo',
        role: 'Official Media Partner',
        coverageNote: formMP.coverageNote,
        documentationLink: formMP.documentationLink || '#',
        mediaFiles: formMP.mediaFiles || [],
        verified: true
      }, ...mediaPartnerNotes]);
      setFormMP({ 
        eventTitle: '', 
        eventDate: '', 
        location: '', 
        repsAttended: '', 
        coverageNote: '', 
        documentationLink: '',
        mediaFiles: [] 
      });
      setUploadError('');
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-64 h-64 bg-purple-50/70 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3.5 sm:gap-4">
          <div className="space-y-1 sm:space-y-1.5">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Pusat Manajemen Konten &amp; Media Partner
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              Platform kerja Komisi Kominfo DPM FASILKOM untuk mengatur timeline publikasi, memonitor progres grafis sosial media, dan mendokumentasikan bukti kehadiran liputan media partner ormawa.
            </p>
          </div>

          {canEdit && (
            <button
              onClick={() => {
                setModalType(activeTab);
                setIsModalOpen(true);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[44px] h-11 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition active:scale-95 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>
                {activeTab === 'konten' ? 'Jadwalkan Konten' : activeTab === 'desain' ? 'Tambah Tugas Desain' : 'Catat Bukti Media Partner'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs - Horizontal Scroll on Mobile with Touch Comfort */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto hide-scrollbar -mx-1 px-1">
        <button
          onClick={() => setActiveTab('konten')}
          className={`flex items-center gap-2 min-h-[42px] px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer whitespace-nowrap shrink-0 active:scale-95 ${
            activeTab === 'konten'
              ? 'bg-purple-600 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 bg-slate-50 sm:bg-transparent'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Jadwal Konten ({contentSchedules.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('desain')}
          className={`flex items-center gap-2 min-h-[42px] px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer whitespace-nowrap shrink-0 active:scale-95 ${
            activeTab === 'desain'
              ? 'bg-purple-600 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 bg-slate-50 sm:bg-transparent'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Progres Desain ({designTasks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('mediapartner')}
          className={`flex items-center gap-2 min-h-[42px] px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer whitespace-nowrap shrink-0 active:scale-95 ${
            activeTab === 'mediapartner'
              ? 'bg-purple-600 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 bg-slate-50 sm:bg-transparent'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Bukti Media Partner ({mediaPartnerNotes.length})</span>
        </button>
      </div>

      {/* Tab 1: Jadwal Bikin Konten */}
      {activeTab === 'konten' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {contentSchedules.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                    {c.platform}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    c.status === 'Tayang' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : c.status === 'Proses Review' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-amber-100 text-amber-800'
                  }`}>
                    {c.status}
                  </span>
                </div>

                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">{c.title}</h3>
                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">{c.copywriting}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-purple-600" />
                  {c.publishDate}
                </span>
                <span className="font-semibold text-slate-700">{c.pic}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Progres Desain Medsos */}
      {activeTab === 'desain' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {designTasks.map((d) => (
            <div key={d.id} className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-3.5 sm:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                  {d.format}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  d.status === 'Selesai & ACC' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                }`}>
                  {d.status}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">{d.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Desainer: <strong className="text-slate-700">{d.designer}</strong></p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-500">Progres Desain</span>
                  <span className="text-purple-700">{d.progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-300"
                    style={{ width: `${d.progress}%` }}
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Tenggat: <strong className="text-slate-800">{d.deadline}</strong></span>
                {d.linkFigma && d.linkFigma !== '#' ? (
                  <a 
                    href={d.linkFigma} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center gap-1.5 min-h-[36px] px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold border border-purple-200/80 transition-colors active:scale-95 text-xs"
                    title={`Buka proyek di ${d.format || 'Tools Desain'}`}
                  >
                    <span>{d.format || 'Buka Desain'}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                ) : (
                  <span className="text-slate-400 font-medium text-[11px]">Tautan belum tersedia</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Bukti Kehadiran Media Partner */}
      {activeTab === 'mediapartner' && (
        <div className="space-y-3.5 sm:space-y-4">
          {mediaPartnerNotes.map((mp) => (
            <div key={mp.id} className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900">{mp.eventTitle}</h3>
                    <span className="text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Terverifikasi Hadir
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{mp.location} • {mp.eventDate}</p>
                </div>

                <div className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl self-start sm:self-auto">
                  {mp.role}
                </div>
              </div>

              <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/60 text-xs text-slate-700 leading-relaxed space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-[11px]">
                  <FileText className="w-3.5 h-3.5 text-purple-600" />
                  <span>Catatan Kehadiran &amp; Liputan Media:</span>
                </div>
                <p>{mp.coverageNote}</p>
              </div>

              {/* Tampilan Media (Foto / Video) yang Diunggah */}
              {mp.mediaFiles && mp.mediaFiles.length > 0 && (
                <div className="space-y-2 pt-1 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-purple-600" />
                      <span>Dokumentasi Liputan Terlampir ({mp.mediaFiles.length})</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">Klik media untuk melihat preview</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                    {mp.mediaFiles.map((media) => {
                      const isVid = media.type === 'video';
                      return (
                        <div 
                          key={media.id}
                          onClick={() => setPreviewMedia({ ...media, eventTitle: mp.eventTitle })}
                          className="group relative aspect-video bg-slate-900 rounded-xl overflow-hidden cursor-pointer border border-slate-200/80 hover:border-purple-400 hover:shadow-md transition-all flex items-center justify-center"
                        >
                          {isVid ? (
                            <video 
                              src={media.url} 
                              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300" 
                              preload="metadata"
                            />
                          ) : (
                            <img 
                              src={media.url} 
                              alt={media.name} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                            />
                          )}

                          {/* Overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                          {/* Play Icon for Video */}
                          {isVid && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-8 h-8 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                                <Play className="w-4 h-4 fill-white ml-0.5" />
                              </div>
                            </div>
                          )}

                          {/* Type Badge Top Left */}
                          <div className="absolute top-1.5 left-1.5">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 text-white backdrop-blur-xs ${
                              isVid ? 'bg-rose-600/90' : 'bg-slate-900/80'
                            }`}>
                              {isVid ? <Video className="w-2.5 h-2.5" /> : <Camera className="w-2.5 h-2.5" />}
                              <span>{isVid ? 'VIDEO' : 'FOTO'}</span>
                            </span>
                          </div>

                          {/* File size & title bottom */}
                          <div className="absolute bottom-1.5 inset-x-1.5 text-white flex items-center justify-between text-[10px] pointer-events-none">
                            <span className="truncate max-w-[70%] font-medium text-[9px]">{media.name}</span>
                            <span className="text-[9px] opacity-80 shrink-0 tabular-nums">{media.sizeStr}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2 pt-1">
                <span className="text-[11px]">Delegasi DPM Hadir: <strong className="text-slate-800">{mp.repsAttended}</strong></span>
                {mp.documentationLink && mp.documentationLink !== '#' && (
                  <a
                    href={mp.documentationLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-800 hover:underline"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Folder Dokumentasi Liputan &rarr;</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Input Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50/60 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 shadow-2xs">
                  {modalType === 'konten' ? (
                    <Calendar className="w-4 h-4" />
                  ) : modalType === 'desain' ? (
                    <Palette className="w-4 h-4" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">
                    {modalType === 'konten' ? 'Jadwalkan Konten Baru' : modalType === 'desain' ? 'Tambah Tugas Desain' : 'Catat Bukti Kehadiran Media Partner'}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {modalType === 'konten' ? 'Rencanakan publikasi media sosial resmi DPM' : modalType === 'desain' ? 'Delegasikan pengerjaan materi visual' : 'Dokumentasikan kehadiran liputan acara ormawa'}
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setUploadError('');
                }} 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-sm flex-1">
                {modalType === 'konten' && (
                  <div className="space-y-3.5">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="font-bold text-slate-700">Judul Konten</label>
                        <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">Wajib</span>
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="Misal: Infografis Anggaran Triwulan DPM"
                        value={formKonten.title}
                        onChange={(e) => setFormKonten({ ...formKonten, title: e.target.value })}
                        className="w-full min-h-[44px] h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50/70 font-medium text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="font-bold text-slate-700">Platform Publikasi</label>
                        <span className="text-[10px] text-slate-400 font-medium">Pilih cepat atau ketik</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {['Instagram Feed', 'Instagram Story', 'Reels', 'TikTok', 'Website', 'LinkedIn'].map((p) => {
                          const isActive = formKonten.platform === p;
                          return (
                            <button
                              key={p}
                              type="button"
                              onClick={() => setFormKonten({ ...formKonten, platform: p })}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                                isActive 
                                  ? 'bg-purple-600 text-white shadow-2xs' 
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                              }`}
                            >
                              {p}
                            </button>
                          );
                        })}
                      </div>
                      <input
                        type="text"
                        placeholder="Atau ketik platform lainnya..."
                        value={formKonten.platform}
                        onChange={(e) => setFormKonten({ ...formKonten, platform: e.target.value })}
                        className="w-full min-h-[44px] h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50/70 font-medium text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="font-bold text-slate-700">Rencana Tanggal Tayang</label>
                        <span className="text-[10px] text-slate-400 font-medium">Format bebas / tanggal</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Misal: 15 Okt 2026 atau Minggu Ke-3 Oktober"
                        value={formKonten.publishDate}
                        onChange={(e) => setFormKonten({ ...formKonten, publishDate: e.target.value })}
                        className="w-full min-h-[44px] h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50/70 font-medium text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="font-bold text-slate-700">Draf Copywriting / Deskripsi</label>
                        <span className="text-[10px] text-slate-400 tabular-nums">
                          {(formKonten.copywriting || '').length} karakter
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        placeholder="Tuliskan intisari caption, poin utama informasi, atau tagar yang akan digunakan..."
                        value={formKonten.copywriting}
                        onChange={(e) => setFormKonten({ ...formKonten, copywriting: e.target.value })}
                        className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50/70 font-medium text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition resize-none"
                      />
                    </div>
                  </div>
                )}

                {modalType === 'desain' && (
                  <div className="space-y-3.5">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="font-bold text-slate-700">Judul Desain</label>
                        <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">Wajib</span>
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="Misal: Desain Feed Instagram Sambutan Maba"
                        value={formDesain.title}
                        onChange={(e) => setFormDesain({ ...formDesain, title: e.target.value })}
                        className="w-full min-h-[44px] h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50/70 font-medium text-xs sm:text-sm focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition outline-hidden"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="font-bold text-slate-700">Tools / Software Desain</label>
                        <span className="text-[10px] text-slate-400 font-medium">Klik untuk memilih</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {TOOL_OPTIONS.map((tool) => {
                          const isSelected = formDesain.format === tool.value;
                          return (
                            <button
                              key={tool.value}
                              type="button"
                              onClick={() => setFormDesain(prev => ({ ...prev, format: tool.value }))}
                              className={`min-h-[40px] py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center text-center cursor-pointer ${
                                isSelected
                                  ? 'bg-purple-600 text-white shadow-sm ring-2 ring-purple-600/30'
                                  : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              {tool.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="font-bold text-slate-700">
                          Tautan Project / Berkas {formDesain.format ? `(${formDesain.format})` : ''}
                        </label>
                        <span className="text-[10px] text-slate-400 font-medium">Tautan cloud / file</span>
                      </div>
                      <input
                        type="text"
                        placeholder={
                          formDesain.format === 'Canva' 
                            ? 'https://canva.com/design/...' 
                            : formDesain.format === 'CapCut'
                              ? 'https://capcut.com/...' 
                              : formDesain.format === 'Adobe Photoshop'
                                ? 'Tautan Google Drive atau Adobe Creative Cloud'
                                : 'https://figma.com/file/...'
                        }
                        value={formDesain.linkFigma}
                        onChange={(e) => setFormDesain({ ...formDesain, linkFigma: e.target.value })}
                        className="w-full min-h-[44px] h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50/70 font-medium text-xs sm:text-sm focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition outline-hidden"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1.5">Tenggat Waktu (Deadline)</label>
                        <input
                          type="text"
                          placeholder="Misal: 12 Okt 2026"
                          value={formDesain.deadline}
                          onChange={(e) => setFormDesain({ ...formDesain, deadline: e.target.value })}
                          className="w-full min-h-[44px] h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50/70 font-medium text-xs sm:text-sm focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition outline-hidden"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="font-bold text-slate-700">Desainer / PIC</label>
                          <span className="text-[10px] text-slate-400">Opsional</span>
                        </div>
                        <input
                          type="text"
                          placeholder="Nama anggota desainer"
                          value={formDesain.designer}
                          onChange={(e) => setFormDesain({ ...formDesain, designer: e.target.value })}
                          className="w-full min-h-[44px] h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50/70 font-medium text-xs sm:text-sm focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition outline-hidden"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {modalType === 'mediapartner' && (
                  <div className="space-y-4">
                    {/* Grup 1: Detail Kegiatan */}
                    <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                        <Users className="w-3.5 h-3.5 text-purple-600" />
                        <span>1. Detail Acara &amp; Delegasi</span>
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Nama Acara / Kegiatan Ormawa</label>
                        <input
                          type="text"
                          required
                          placeholder="Misal: Seminar AI BEM FASILKOM"
                          value={formMP.eventTitle}
                          onChange={(e) => setFormMP({ ...formMP, eventTitle: e.target.value })}
                          className="w-full min-h-[44px] h-11 px-3.5 rounded-xl border border-slate-200 bg-white font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Lokasi &amp; Tanggal Acara</label>
                          <input
                            type="text"
                            placeholder="Misal: Audit UMB • 10 Okt"
                            value={formMP.location}
                            onChange={(e) => setFormMP({ ...formMP, location: e.target.value })}
                            className="w-full min-h-[44px] h-11 px-3 rounded-xl border border-slate-200 bg-white font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Delegasi Hadir (Kominfo DPM)</label>
                          <input
                            type="text"
                            placeholder="Nama-nama anggota hadir"
                            value={formMP.repsAttended}
                            onChange={(e) => setFormMP({ ...formMP, repsAttended: e.target.value })}
                            className="w-full min-h-[44px] h-11 px-3 rounded-xl border border-slate-200 bg-white font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Grup 2: Bukti Liputan & Media */}
                    <div className="p-3.5 rounded-2xl bg-purple-50/30 border border-purple-100 space-y-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
                        <Camera className="w-3.5 h-3.5 text-purple-600" />
                        <span>2. Laporan Liputan &amp; Dokumentasi</span>
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Catatan Liputan / Hasil Kehadiran</label>
                        <textarea
                          rows={2}
                          placeholder="Ringkasan jalannya liputan atau catatan penting selama acara berlangsung..."
                          value={formMP.coverageNote}
                          onChange={(e) => setFormMP({ ...formMP, coverageNote: e.target.value })}
                          className="w-full p-3 rounded-xl border border-slate-200 bg-white font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Tautan Drive Dokumentasi Lengkap</label>
                        <input
                          type="text"
                          placeholder="https://drive.google.com/..."
                          value={formMP.documentationLink}
                          onChange={(e) => setFormMP({ ...formMP, documentationLink: e.target.value })}
                          className="w-full min-h-[44px] h-11 px-3.5 rounded-xl border border-slate-200 bg-white font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                        />
                      </div>

                      {/* Upload Foto / Video Bukti Kehadiran */}
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between">
                          <label className="font-bold text-slate-800 text-xs">
                            Unggah Foto / Video Liputan
                          </label>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                            Maks. 10 MB total
                          </span>
                        </div>

                        {/* Progress Bar Kapasitas */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                            <span>Kapasitas Terpakai:</span>
                            <span className="font-bold text-slate-700 tabular-nums">
                              {((formMP.mediaFiles || []).reduce((acc, m) => acc + (m.sizeBytes || 0), 0) / (1024 * 1024)).toFixed(1)} MB / 10.0 MB
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-300 rounded-full ${
                                ((formMP.mediaFiles || []).reduce((acc, m) => acc + (m.sizeBytes || 0), 0) / (1024 * 1024)) > 8
                                  ? 'bg-amber-500'
                                  : 'bg-purple-600'
                              }`}
                              style={{
                                width: `${Math.min(100, (((formMP.mediaFiles || []).reduce((acc, m) => acc + (m.sizeBytes || 0), 0)) / (10 * 1024 * 1024)) * 100)}%`
                              }}
                            />
                          </div>
                        </div>

                        {uploadError && (
                          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[11px] flex items-start gap-2 animate-in fade-in">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                            <span className="font-medium leading-tight">{uploadError}</span>
                          </div>
                        )}

                        {/* Upload Dropzone */}
                        <div 
                          onClick={() => mediaInputRef.current?.click()}
                          className="border-2 border-dashed border-purple-200 hover:border-purple-400 bg-white hover:bg-purple-50/50 rounded-2xl p-3.5 text-center cursor-pointer transition flex flex-col items-center justify-center gap-1 group"
                        >
                          <input 
                            ref={mediaInputRef}
                            type="file" 
                            accept="image/*,video/*"
                            multiple
                            onChange={handleMediaUpload}
                            className="hidden" 
                          />
                          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-105 transition">
                            <UploadCloud className="w-4 h-4" />
                          </div>
                          <p className="font-bold text-slate-800 text-[11px]">
                            Klik untuk unggah foto atau rekaman video
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Mendukung JPG, PNG, WEBP, MP4
                          </p>
                        </div>

                        {/* List Berkas Terunggah */}
                        {(formMP.mediaFiles && formMP.mediaFiles.length > 0) && (
                          <div className="space-y-1.5 pt-1">
                            <p className="text-[11px] font-bold text-slate-700">
                              Berkas Terunggah ({formMP.mediaFiles.length}):
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                              {formMP.mediaFiles.map((m) => {
                                const isVid = m.type === 'video';
                                return (
                                  <div 
                                    key={m.id}
                                    className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 shadow-2xs group relative"
                                  >
                                    <div className="w-10 h-10 rounded-lg bg-slate-900 shrink-0 overflow-hidden relative flex items-center justify-center">
                                      {isVid ? (
                                        <>
                                          <video src={m.url} className="w-full h-full object-cover opacity-80" />
                                          <Play className="w-3 h-3 fill-white text-white absolute" />
                                        </>
                                      ) : (
                                        <img src={m.url} alt={m.name} className="w-full h-full object-cover" />
                                      )}
                                      <span className={`absolute top-0.5 left-0.5 text-[7px] font-bold px-1 rounded text-white ${isVid ? 'bg-rose-600' : 'bg-purple-600'}`}>
                                        {isVid ? 'VID' : 'IMG'}
                                      </span>
                                    </div>

                                    <div className="flex-1 min-w-0 pr-6">
                                      <p className="font-bold text-slate-800 truncate text-[11px]">{m.name}</p>
                                      <p className="text-[9px] text-slate-400 font-medium tabular-nums">{m.sizeStr}</p>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveMedia(m.id);
                                      }}
                                      className="absolute right-1.5 top-1.5 p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                      title="Hapus berkas"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setUploadError('');
                  }}
                  className="min-h-[44px] h-11 px-5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold transition-all cursor-pointer shadow-2xs active:scale-95 text-xs sm:text-sm text-center flex items-center justify-center"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] h-11 px-6 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all cursor-pointer shadow-md shadow-purple-500/25 hover:shadow-purple-500/35 active:scale-95 text-xs sm:text-sm flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan Data</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Preview Modal for Attached Photo / Video */}
      {previewMedia && (
        <div 
          onClick={() => setPreviewMedia(null)}
          className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-700/60 shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Top Header in Lightbox */}
            <div className="flex items-center justify-between p-4 px-5 border-b border-slate-800 text-white">
              <div>
                <h4 className="font-extrabold text-sm truncate max-w-md">{previewMedia.name}</h4>
                <p className="text-[11px] text-slate-400">{previewMedia.eventTitle || 'Dokumentasi Liputan'} • {previewMedia.sizeStr}</p>
              </div>
              <button
                onClick={() => setPreviewMedia(null)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media Content */}
            <div className="flex-1 overflow-hidden flex items-center justify-center p-4 bg-black/60">
              {previewMedia.type === 'video' ? (
                <video 
                  src={previewMedia.url} 
                  controls 
                  autoPlay 
                  className="max-h-[70vh] w-auto max-w-full rounded-xl shadow-lg"
                />
              ) : (
                <img 
                  src={previewMedia.url} 
                  alt={previewMedia.name} 
                  className="max-h-[70vh] w-auto max-w-full rounded-xl object-contain shadow-lg"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
