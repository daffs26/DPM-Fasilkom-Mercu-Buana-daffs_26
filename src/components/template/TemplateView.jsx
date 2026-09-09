import React, { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { useShallow } from 'zustand/react/shallow';
import TemplatePreviewModal from './components/TemplatePreviewModal';
import UploadTemplateModal from './components/UploadTemplateModal';
import { TEMPLATE_CATEGORIES } from '../../data/templatesData';
import { 
  FileText, 
  Download, 
  Eye, 
  Search, 
  Plus, 
  CheckCircle2, 
  Files, 
  Sparkles, 
  Trash2, 
  Clock, 
  Building, 
  Scale, 
  Handshake, 
  FileSpreadsheet,
  Layers
} from 'lucide-react';

export default function TemplateView() {
  const { templates, deleteTemplate, incrementTemplateDownload, searchQuery, setSearchQuery } = useStore(useShallow(state => ({ templates: state.templates, deleteTemplate: state.deleteTemplate, incrementTemplateDownload: state.incrementTemplateDownload, searchQuery: state.searchQuery, setSearchQuery: state.setSearchQuery })));

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [localSearch, setLocalSearch] = useState('');
  const [selectedTemplateForPreview, setSelectedTemplateForPreview] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return templates.filter((tpl) => {
      // Filter kategori
      if (selectedCategory !== 'all' && tpl.categorySlug !== selectedCategory) {
        return false;
      }

      // Filter pencarian
      const query = (localSearch || searchQuery || '').toLowerCase().trim();
      if (!query) return true;

      const inTitle = tpl.title.toLowerCase().includes(query);
      const inDesc = tpl.description?.toLowerCase().includes(query);
      const inCat = tpl.category?.toLowerCase().includes(query);
      const inTags = tpl.tags?.some(t => t.toLowerCase().includes(query));
      const inFields = tpl.fields?.some(f => f.toLowerCase().includes(query));

      return inTitle || inDesc || inCat || inTags || inFields;
    });
  }, [templates, selectedCategory, localSearch, searchQuery]);

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

  const handleDelete = (id, title, e) => {
    e.stopPropagation();
    if (window.confirm(`Hapus template "${title}" dari daftar?`)) {
      deleteTemplate(id);
    }
  };

  // Hitung jumlah template per kategori
  const categoryCounts = useMemo(() => {
    const counts = { all: templates.length };
    templates.forEach((tpl) => {
      if (tpl.categorySlug) {
        counts[tpl.categorySlug] = (counts[tpl.categorySlug] || 0) + 1;
      }
    });
    return counts;
  }, [templates]);

  const categoryIconMap = {
    all: Files,
    dispensasi: FileText,
    persidangan: Scale,
    sponsorship: Handshake,
    ruangan: Building,
    lpj: FileSpreadsheet
  };

  return (
    <div className="space-y-6">
      {/* Action Bar & Kategori */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Cari nama template, format (.docx/.pdf), atau kata kunci..."
              className="w-full bg-slate-50 border border-slate-200 rounded-full pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
            />
          </div>

          {/* Tombol Unggah Template Baru */}
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Unggah Template Baru</span>
          </button>
        </div>

        {/* Category Pills Filter with Icons and Dynamic Count Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
          {TEMPLATE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const IconComp = categoryIconMap[cat.id] || Files;
            const count = categoryCounts[cat.id] || 0;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition shrink-0 flex items-center gap-2 ${
                  isSelected
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60'
                }`}
              >
                <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/70 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Kartu Template Dokumen */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTemplates.map((tpl) => {
            return (
              <div
                key={tpl.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar Card: Format & Category & Badge */}
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
                    </div>

                    {!tpl.isOfficial && (
                      <button
                        onClick={(e) => handleDelete(tpl.id, tpl.title, e)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                        title="Hapus template kustom ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-blue-600 transition leading-snug">
                    {tpl.title}
                  </h3>
                </div>

                {/* Footer Card: Meta & Actions */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="text-[10px] text-slate-400 font-medium">
                    <span>{tpl.fileSize}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSelectedTemplateForPreview(tpl)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition"
                      title="Pratinjau struktur dokumen & salin teks"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>Pratinjau</span>
                    </button>
                    <button
                      onClick={(e) => handleDownloadDirect(tpl, e)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition"
                      title="Unduh file template langsung"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
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
            onClick={() => { setSelectedCategory('all'); setLocalSearch(''); setSearchQuery(''); }}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
          >
            Reset Filter Pencarian
          </button>
        </div>
      )}

      {/* Modals */}
      <TemplatePreviewModal
        isOpen={Boolean(selectedTemplateForPreview)}
        onClose={() => setSelectedTemplateForPreview(null)}
        template={selectedTemplateForPreview}
      />

      <UploadTemplateModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
}
