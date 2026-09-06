import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import UploadBerkasModal from '../modals/UploadBerkasModal';
import { 
  Folder, 
  FolderOpen, 
  FileText, 
  Download, 
  Eye, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  UploadCloud,
  FileCheck,
  Tag,
  Files,
  ScrollText
} from 'lucide-react';

export default function BerkasView({ onReviewProposal, onAuditLPJ }) {
  const { prokers, ormawas, selectedOrmawaFilter, setSelectedOrmawaFilter, searchQuery, setActiveTab } = useStore();
  
  const [selectedFolder, setSelectedFolder] = useState('all'); // 'all' | 'proposal' | 'lpj' | 'other'
  const [selectedFileItem, setSelectedFileItem] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Kumpulkan semua berkas dari seluruh proker
  const allFiles = [];
  prokers.forEach(p => {
    const ormawa = ormawas.find(o => o.id === p.ormawaId);
    
    // File Proposal
    if (p.proposal?.fileName) {
      allFiles.push({
        id: `prop-${p.id}`,
        prokerId: p.id,
        prokerTitle: p.title,
        ormawaId: p.ormawaId,
        ormawaName: ormawa?.name,
        ormawaShort: ormawa?.shortName,
        ormawaLogo: ormawa?.logo,
        fileName: p.proposal.fileName,
        fileSize: p.proposal.fileSize,
        category: 'proposal',
        uploadDate: p.proposal.uploadDate,
        status: p.proposal.reviewStatus,
        isDadakan: p.proposal.isDadakan,
        notes: p.proposal.notes || [],
        approvedBy: p.proposal.approvedBy,
        originalProker: p
      });
    }

    // File LPJ
    if (p.lpj?.fileName) {
      allFiles.push({
        id: `lpj-${p.id}`,
        prokerId: p.id,
        prokerTitle: p.title,
        ormawaId: p.ormawaId,
        ormawaName: ormawa?.name,
        ormawaShort: ormawa?.shortName,
        ormawaLogo: ormawa?.logo,
        fileName: p.lpj.fileName,
        fileSize: p.lpj.fileSize,
        category: 'lpj',
        uploadDate: p.lpj.uploadDate,
        status: p.lpj.reviewStatus,
        score: p.lpj.auditScore,
        notes: p.lpj.notes || [],
        originalProker: p
      });
    }

    // File Dokumen Lainnya (otherDocs)
    if (p.otherDocs && Array.isArray(p.otherDocs)) {
      p.otherDocs.forEach(d => {
        allFiles.push({
          id: `doc-${d.id || Math.random()}`,
          prokerId: p.id,
          prokerTitle: p.title,
          ormawaId: p.ormawaId,
          ormawaName: ormawa?.name,
          ormawaShort: ormawa?.shortName,
          ormawaLogo: ormawa?.logo,
          fileName: d.fileName,
          fileSize: d.fileSize || '2.0 MB',
          category: 'other',
          uploadDate: d.uploadDate || p.startDate,
          status: d.reviewStatus || 'verified',
          isDadakan: false,
          notes: d.notes || [],
          originalProker: p
        });
      });
    }
  });

  // Filter berkas
  const filteredFiles = allFiles.filter(f => {
    const matchOrmawa = selectedOrmawaFilter === 'all' || f.ormawaId === selectedOrmawaFilter;
    const matchCategory = selectedFolder === 'all' || f.category === selectedFolder;
    const matchSearch = f.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.prokerTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchOrmawa && matchCategory && matchSearch;
  });

  const activeFile = selectedFileItem || filteredFiles[0] || null;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden min-h-[750px] flex flex-col">
      {/* 1. LEFT SUB-SIDEBAR — becomes horizontal scrollable tabs on mobile, left col on md+ */}
      <div className="flex md:flex-row flex-col min-h-0 flex-1">
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-100 p-4 md:p-5 bg-slate-50/40 md:shrink-0 space-y-4 md:space-y-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-2 px-2">
              Kategori Berkas
            </span>
            <div className="flex md:flex-col gap-1.5 md:gap-1 overflow-x-auto md:overflow-x-visible pb-1 md:pb-0 hide-scrollbar">
            {[
              { id: 'all', label: 'Semua Berkas', count: allFiles.length },
              { id: 'proposal', label: 'Proposal & RAB', count: allFiles.filter(f => f.category === 'proposal').length },
              { id: 'lpj', label: 'Berkas LPJ & Nota', count: allFiles.filter(f => f.category === 'lpj').length },
              { id: 'other', label: 'Dokumen Lainnya', count: allFiles.filter(f => f.category === 'other').length }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedFolder(cat.id)}
                className={`shrink-0 flex items-center justify-between px-3 py-2 md:py-2.5 rounded-xl md:rounded-2xl text-xs font-semibold transition ${
                  selectedFolder === cat.id
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Folder className={`w-3.5 h-3.5 ${selectedFolder === cat.id ? 'text-blue-600 fill-blue-50' : 'text-slate-600'}`} />
                  <span className="whitespace-nowrap">{cat.label}</span>
                </div>
                <span className="text-[10px] bg-slate-100 px-1.5 py-0.2 rounded-full font-bold ml-1.5">
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Ormawa Folders - hidden on mobile, ormawa filter available in header */}
        <div className="hidden md:block">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-2 px-2">
            Folder per Ormawa
          </span>
          <div className="space-y-1">
            {ormawas.map(o => {
              const count = allFiles.filter(f => f.ormawaId === o.id).length;
              const isSelected = selectedOrmawaFilter === o.id;

              // Style warna khusus per ormawa saat dipilih (selected)
              const getOrmawaStyles = (id) => {
                switch (id) {
                  case 'dpm':
                    return {
                      selected: 'bg-slate-900 text-white font-bold shadow-xs ring-2 ring-slate-900/15',
                      badge: 'bg-slate-800 text-white',
                      hover: 'hover:bg-slate-100 hover:text-slate-900'
                    };
                  case 'bem':
                    return {
                      selected: 'bg-sky-500 text-white font-bold shadow-xs ring-2 ring-sky-400/20',
                      badge: 'bg-sky-600 text-white',
                      hover: 'hover:bg-sky-50 hover:text-sky-900'
                    };
                  case 'himti':
                    return {
                      selected: 'bg-blue-900 text-white font-bold shadow-xs ring-2 ring-blue-900/20',
                      badge: 'bg-blue-950 text-white',
                      hover: 'hover:bg-blue-50 hover:text-blue-950'
                    };
                  case 'himsisfo':
                    return {
                      selected: 'bg-[#9A7B56] text-white font-bold shadow-xs ring-2 ring-[#9A7B56]/20',
                      badge: 'bg-[#785E43] text-white',
                      hover: 'hover:bg-[#FBF9F5] hover:text-[#785E43]'
                    };
                  default:
                    return {
                      selected: 'bg-slate-900 text-white font-bold shadow-xs',
                      badge: 'bg-slate-700 text-white',
                      hover: 'hover:bg-slate-100 hover:text-slate-900'
                    };
                }
              };

              const styles = getOrmawaStyles(o.id);

              return (
                <button
                  key={o.id}
                  onClick={() => setSelectedOrmawaFilter(isSelected ? 'all' : o.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition ${
                    isSelected
                      ? styles.selected
                      : `text-slate-600 ${styles.hover}`
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <div className="w-5 h-5 rounded-md bg-white p-0.5 flex items-center justify-center shrink-0 shadow-2xs border border-slate-100">
                      <img src={o.logo} alt={o.name} className="w-full h-full object-contain" />
                    </div>
                    <span className="truncate">{o.shortName}</span>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? styles.badge : 'bg-slate-200 text-slate-700'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

          {/* Storage Quota Card */}
          <div className="hidden md:block p-3.5 bg-white border border-slate-200/80 rounded-2xl">
            <span className="text-[11px] font-bold text-slate-700 block">Arsip Digital Terbuka</span>
            <p className="text-[10px] text-slate-600 mt-1">
              Transparansi arsip digital untuk memitigasi keterlambatan berkas proposal dan pelaporan LPJ.
            </p>
          </div>
        </div>

        {/* 2. CENTER AREA: FILE GRID */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {/* Banner Pintasan Template Dokumen Resmi */}
          <div className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-blue-50/90 to-indigo-50/70 border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <ScrollText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Butuh Template Dokumen &amp; Surat Resmi Ormawa?
                </h4>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Tersedia format baku surat izin dispensasi panitia, sidang umum ormawa (SUO), proposal sponsor, dan peminjaman ruangan.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('template')}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-blue-700 font-bold text-xs rounded-xl border border-blue-200 shadow-2xs transition shrink-0 cursor-pointer"
            >
              <span>Buka Bank Template</span>
              <ScrollText className="w-3.5 h-3.5 text-blue-600" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Berkas Pengawasan ({filteredFiles.length} Dokumen)
              </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Klik pada file untuk melihat detail catatan review & tanggal upload
            </p>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center justify-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs transition cursor-pointer shrink-0"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Berkas</span>
          </button>
        </div>

        {/* Grid Dokumen File Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
          {filteredFiles.map((file) => {
            const isSelected = activeFile?.id === file.id;
            const isProp = file.category === 'proposal';
            const isOther = file.category === 'other';

            return (
              <div
                key={file.id}
                onClick={() => setSelectedFileItem(file)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between hover:shadow-md ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/20 ring-2 ring-blue-500/10 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isProp ? 'bg-red-50 text-red-600' : isOther ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {isOther ? <Files className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                    </div>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                      isOther
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        : file.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : file.status === 'revisi'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : file.isDadakan
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {isOther
                        ? '✓ Tersimpan di Arsip'
                        : file.status === 'approved'
                        ? '✓ Disetujui'
                        : file.status === 'revisi'
                        ? 'Perlu Revisi'
                        : file.isDadakan
                        ? '⚠️ Terlambat (< H-14)'
                        : 'Menunggu Review'}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-slate-900 truncate" title={file.fileName}>
                    {file.fileName}
                  </h4>
                  <p className="text-[11px] text-slate-600 truncate mt-0.5">
                    {file.prokerTitle}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-600">
                  <span className="font-semibold text-slate-700">{file.ormawaShort}</span>
                  <span>{file.fileSize}</span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredFiles.length === 0 && (
          <div className="p-14 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 ring-8 ring-blue-50/50 flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 stroke-[1.8]" />
            </div>
            <p className="font-extrabold text-slate-900 text-sm">Belum Ada Berkas yang Sesuai</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto font-normal">
              Pilih folder ormawa lain atau unggah berkas pengawasan baru.
            </p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Berkas Sekarang</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. RIGHT SIDEBAR: SELECTED FILE DETAILS & ACTION (Inspirasi Documents Ref 3) */}
      {activeFile && (
        <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-100 p-6 bg-slate-50/50 shrink-0 flex flex-col justify-between">
          <div className="space-y-5 text-xs">
            {/* File Header */}
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center mb-3">
                {activeFile.category === 'other' ? (
                  <Files className="w-6 h-6 text-indigo-600" />
                ) : (
                  <FileText className="w-6 h-6 text-slate-800" />
                )}
              </div>
              <h4 className="font-bold text-sm text-slate-900 break-all leading-snug">
                {activeFile.fileName}
              </h4>
              <p className="text-slate-600 mt-0.5">
                Program Kerja: <strong>{activeFile.prokerTitle}</strong>
              </p>
            </div>

            {/* Metadata Info */}
            <div className="space-y-2 py-3 border-y border-slate-200/80">
              <div className="flex justify-between">
                <span className="text-slate-600">Ormawa:</span>
                <span className="font-bold text-slate-900">{activeFile.ormawaName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Jenis Dokumen:</span>
                <span className="font-bold text-slate-900 uppercase">
                  {activeFile.category === 'other' ? 'Dokumen Lainnya' : activeFile.category}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Tanggal Upload:</span>
                <span className="font-bold text-slate-900">{activeFile.uploadDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Ukuran Berkas:</span>
                <span className="font-bold text-slate-900">{activeFile.fileSize}</span>
              </div>
            </div>

            {/* Audit Status SLA */}
            {activeFile.category === 'other' ? (
              <div>
                <span className="font-bold text-slate-700 block mb-1">Status Dokumen:</span>
                <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-800 text-[11px] leading-relaxed">
                  📁 <strong>Dokumen Pendukung / Arsip</strong>. Berkas administrasi ormawa telah tersimpan dalam arsip transparansi DPM Fasilkom.
                </div>
              </div>
            ) : (
              <div>
                <span className="font-bold text-slate-700 block mb-1">Status Kepatuhan Waktu:</span>
                {activeFile.isDadakan ? (
                  <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-800 text-[11px] leading-relaxed">
                    ⚠️ <strong>Pengajuan Terlambat (&lt; H-14)</strong>. Berkas diajukan melampaui batas waktu standar regulasi DPM.
                  </div>
                ) : (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-[11px] leading-relaxed">
                    ✓ <strong>Diajukan Tepat Waktu (≥ H-14)</strong>. Memenuhi standar batas waktu pengajuan DPM Fasilkom.
                  </div>
                )}
              </div>
            )}

            {/* Riwayat Catatan Review DPM */}
            <div>
              <span className="font-bold text-slate-700 block mb-1.5">
                Catatan Review DPM:
              </span>
              {activeFile.notes && activeFile.notes.length > 0 ? (
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {activeFile.notes.map(n => (
                    <div key={n.id} className="p-2.5 bg-white border border-slate-200 rounded-xl text-[11px]">
                      <span className="font-bold text-slate-900 block">{n.author}:</span>
                      <p className="text-slate-700 mt-0.5">{n.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-600 italic text-[11px] p-2.5 bg-white border border-slate-200 rounded-xl">
                  Belum ada catatan revisi pada berkas ini.
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 space-y-2 mt-4">
            <button
              onClick={() => alert(`Mengunduh file: ${activeFile.fileName}`)}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl font-bold text-xs text-slate-800 transition shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Berkas</span>
            </button>
            <button
              onClick={() => {
                if (activeFile.category === 'proposal') {
                  onReviewProposal(activeFile.originalProker);
                } else if (activeFile.category === 'lpj') {
                  onAuditLPJ(activeFile.originalProker);
                } else {
                  onReviewProposal(activeFile.originalProker);
                }
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-md shadow-slate-900/10 transition active:scale-95 cursor-pointer"
            >
              <FileCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {activeFile.category === 'proposal'
                  ? 'Buka Form Review DPM'
                  : activeFile.category === 'lpj'
                  ? 'Buka Form Audit LPJ'
                  : 'Lihat Detail Proker'}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Modal Upload Berkas */}
      <UploadBerkasModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        defaultOrmawaId={selectedOrmawaFilter !== 'all' ? selectedOrmawaFilter : 'bem'}
      />
      </div>
    </div>
  );
}
