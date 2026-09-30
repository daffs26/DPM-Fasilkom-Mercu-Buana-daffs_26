import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { useShallow } from 'zustand/react/shallow';
import TemplatePreviewModal from './PreviewTemplateModal';
import UploadTemplateModal from './UploadTemplateModal';
import DropdownSelect from '@/components/ui/dropdown-select';
import { TEMPLATE_CATEGORIES, TEMPLATE_PERIODES } from '@/data/templatesData';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { 
  FileText, 
  Download, 
  Eye, 
  Search, 
  Plus, 
  Files, 
  Trash2, 
  Building, 
  Scale, 
  Handshake, 
  FileSpreadsheet,
  Calendar,
  Filter,
  RotateCcw,
  X
} from 'lucide-react';

const CATEGORY_ICON_MAP = {
  all: Files,
  dispensasi: FileText,
  persidangan: Scale,
  sponsorship: Handshake,
  ruangan: Building,
  lpj: FileSpreadsheet
};

export default function TemplateView() {
  const { 
    templates, 
    deleteTemplate, 
    incrementTemplateDownload, 
    searchQuery, 
    setSearchQuery, 
    currentUser,
    hasSeenTemplateTab,
    markTemplateTabAsSeen
  } = useStore(useShallow(state => ({
    templates: state.templates,
    deleteTemplate: state.deleteTemplate,
    incrementTemplateDownload: state.incrementTemplateDownload,
    searchQuery: state.searchQuery,
    setSearchQuery: state.setSearchQuery,
    currentUser: state.currentUser,
    hasSeenTemplateTab: state.hasSeenTemplateTab,
    markTemplateTabAsSeen: state.markTemplateTabAsSeen
  })));

  const isGuest = currentUser?.role === 'guest';

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPeriode, setSelectedPeriode] = useState('all');
  const [hasClickedCategory, setHasClickedCategory] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [selectedTemplateForPreview, setSelectedTemplateForPreview] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);

  useEffect(() => {
    if (!hasSeenTemplateTab) {
      markTemplateTabAsSeen?.();
    }
  }, [hasSeenTemplateTab, markTemplateTabAsSeen]);

  const filteredTemplates = useMemo(() => {
    return templates.filter((tpl) => {
      if (selectedCategory !== 'all' && tpl.categorySlug !== selectedCategory) {
        return false;
      }
      const tplPeriode = tpl.periode || '2025/2026';
      if (selectedPeriode !== 'all' && tplPeriode !== selectedPeriode) {
        return false;
      }
      const query = (localSearch || searchQuery || '').toLowerCase().trim();
      if (!query) return true;

      const inTitle = tpl.title.toLowerCase().includes(query);
      const inDesc = tpl.description?.toLowerCase().includes(query);
      const inCat = tpl.category?.toLowerCase().includes(query);
      const inTags = tpl.tags?.some(t => t.toLowerCase().includes(query));
      const inFields = tpl.fields?.some(f => f.toLowerCase().includes(query));
      const inPeriode = tplPeriode.toLowerCase().includes(query);

      return inTitle || inDesc || inCat || inTags || inFields || inPeriode;
    });
  }, [templates, selectedCategory, selectedPeriode, localSearch, searchQuery]);

  const handleDownloadDirect = (tpl, e) => {
    e.stopPropagation();
    incrementTemplateDownload(tpl.id);

    if (tpl.uploadedFileUrl) {
      const link = document.createElement('a');
      link.href = tpl.uploadedFileUrl;
      link.download = tpl.uploadedFileName || `${tpl.title}.${(tpl.format || 'docx').toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    const content = tpl.contentPreview || tpl.description;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeTitle = tpl.title.toLowerCase().replace(/[^a-z0-9]/g, '_');
    link.download = `${safeTitle}_template.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDeleteClick = (tpl, e) => {
    e.stopPropagation();
    setTemplateToDelete(tpl);
  };

  const handleConfirmDelete = () => {
    if (templateToDelete) {
      deleteTemplate(templateToDelete.id);
      setTemplateToDelete(null);
    }
  };

  const categoryCounts = useMemo(() => {
    const periodFiltered = templates.filter(tpl => {
      if (selectedPeriode === 'all') return true;
      return (tpl.periode || '2025/2026') === selectedPeriode;
    });

    const counts = { all: periodFiltered.length };
    periodFiltered.forEach((tpl) => {
      if (tpl.categorySlug) {
        counts[tpl.categorySlug] = (counts[tpl.categorySlug] || 0) + 1;
      }
    });
    return counts;
  }, [templates, selectedPeriode]);

  const periodeCounts = useMemo(() => {
    const catFiltered = templates.filter(tpl => {
      if (selectedCategory === 'all') return true;
      return tpl.categorySlug === selectedCategory;
    });

    const counts = {
      all: catFiltered.length,
      '2025/2026': 0,
      '2026/2027': 0
    };
    catFiltered.forEach(tpl => {
      const p = tpl.periode || '2025/2026';
      counts[p] = (counts[p] || 0) + 1;
    });
    return counts;
  }, [templates, selectedCategory]);

  const categoryOptions = useMemo(() => {
    return TEMPLATE_CATEGORIES.map((cat) => {
      // Icon dihapus sesuai permintaan ("iconnya hapus aja")
      // Sembunyikan badge jika tab sudah dibuka atau opsi telah diklik
      const shouldShowBadge = !hasSeenTemplateTab && !hasClickedCategory && (categoryCounts[cat.id] || 0) > 0;
      return {
        value: cat.id,
        label: cat.label,
        badge: shouldShowBadge ? categoryCounts[cat.id] : null
      };
    });
  }, [categoryCounts, hasSeenTemplateTab, hasClickedCategory]);

  const periodeOptions = useMemo(() => {
    return TEMPLATE_PERIODES.map((p) => {
      return {
        value: p.id,
        label: p.label
      };
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-soft space-y-4">
        {/* Baris 1: Pencarian & Tombol Unggah Template */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Cari nama template, format (.docx/.pdf), atau kata kunci..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-9 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition font-medium"
            />
            {localSearch && (
              <button
                type="button"
                onClick={() => setLocalSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 rounded-md transition cursor-pointer"
                title="Hapus pencarian"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {!isGuest && (
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Unggah Template Baru</span>
            </button>
          )}
        </div>

        {/* Baris 2: Dropdown Kategori & Dropdown Berkas Periode */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 shrink-0">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Filter:</span>
            </div>

            {/* Dropdown Kategori (Pengganti deretan tombol horizontal) */}
            <div className="w-full sm:w-64">
              <DropdownSelect
                value={selectedCategory}
                onChange={(val) => {
                  setSelectedCategory(val);
                  setHasClickedCategory(true);
                  markTemplateTabAsSeen?.();
                }}
                options={categoryOptions}
                placeholder="Pilih Kategori Dokumen"
                triggerClassName="py-2.5 rounded-xl text-xs bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300"
                contentClassName="w-72 z-50 shadow-xl"
              />
            </div>

            {/* Dropdown Berkas Periode */}
            <div className="w-full sm:w-56">
              <DropdownSelect
                value={selectedPeriode}
                onChange={setSelectedPeriode}
                options={periodeOptions}
                placeholder="Pilih Periode Berkas"
                triggerClassName="py-2.5 rounded-xl text-xs bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300"
                contentClassName="w-60 z-50 shadow-xl"
              />
            </div>

            {/* Tombol Reset Filter jika ada filter aktif */}
            {(selectedCategory !== 'all' || selectedPeriode !== 'all' || localSearch.trim() || searchQuery.trim()) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedPeriode('all');
                  setLocalSearch('');
                  setSearchQuery('');
                }}
                className="text-xs font-semibold text-slate-500 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 px-2.5 py-2 rounded-xl transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                title="Reset semua filter pencarian"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filter</span>
              </button>
            )}
          </div>

          <div className="text-[11px] font-semibold text-slate-500 shrink-0 self-end sm:self-center">
            Menampilkan <span className="font-bold text-slate-800">{filteredTemplates.length}</span> dari <span className="font-bold text-slate-800">{templates.length}</span> template
          </div>
        </div>
      </div>

      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTemplates.map((tpl) => (
            <div
              key={tpl.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg ${
                      tpl.format === 'DOCX' 
                        ? 'bg-blue-100 text-blue-800' 
                        : tpl.format === 'PDF' 
                        ? 'bg-rose-100 text-rose-800' 
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      .{tpl.format}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {tpl.category}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100/80 flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5 text-indigo-500" />
                      {tpl.periode || '2025/2026'}
                    </span>
                  </div>

                  {!isGuest && (
                    <button
                      type="button"
                      onClick={(e) => handleDeleteClick(tpl, e)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 border border-transparent hover:border-rose-100 transition cursor-pointer"
                      title={`Hapus template "${tpl.title}"`}
                      aria-label={`Hapus template ${tpl.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-blue-600 transition leading-snug">
                  {tpl.title}
                </h3>
              </div>

              <div className="mt-5 pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="text-[10px] text-slate-500 font-medium">
                  <span>Ukuran: {tpl.fileSize}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 w-full sm:w-auto sm:flex sm:items-center">
                  <button
                    onClick={() => setSelectedTemplateForPreview(tpl)}
                    className="min-h-[38px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition cursor-pointer"
                    title="Pratinjau struktur dokumen & salin teks"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>Pratinjau</span>
                  </button>
                  <button
                    onClick={(e) => handleDownloadDirect(tpl, e)}
                    className="min-h-[38px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition cursor-pointer"
                    title="Unduh file template langsung"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-soft">
          <Files className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-extrabold text-slate-800">
            Tidak Ditemukan Template Dokumen
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Tidak ada dokumen yang cocok dengan filter atau kata kunci pencarian Anda. Coba kata kunci lain atau unggah template baru.
          </p>
          <button
            onClick={() => { setSelectedCategory('all'); setSelectedPeriode('all'); setLocalSearch(''); setSearchQuery(''); }}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
          >
            Reset Filter Pencarian
          </button>
        </div>
      )}

      <TemplatePreviewModal
        isOpen={Boolean(selectedTemplateForPreview)}
        onClose={() => setSelectedTemplateForPreview(null)}
        template={selectedTemplateForPreview}
      />

      <UploadTemplateModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

      {/* Modal Konfirmasi Hapus Template */}
      <Dialog open={Boolean(templateToDelete)} onOpenChange={(open) => { if (!open) setTemplateToDelete(null); }}>
        <DialogContent className="max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-xl">
          <DialogHeader>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3 border border-rose-100">
              <Trash2 className="w-6 h-6 stroke-[2]" />
            </div>
            <DialogTitle className="text-base font-extrabold text-slate-900 leading-snug">
              Hapus Template Dokumen?
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 mt-1 leading-relaxed">
              Template <strong className="text-slate-800 font-semibold">"{templateToDelete?.title}"</strong> akan dihapus dari daftar Bank Template Dokumen.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setTemplateToDelete(null)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-xs transition cursor-pointer"
            >
              Ya, Hapus Template
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
