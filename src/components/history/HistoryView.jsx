import React, { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { 
  Plus, 
  Trash2, 
  Clock, 
  Search, 
  History,
  Building2,
  UserCheck,
  X
} from 'lucide-react';

export default function HistoryView() {
  const { activityLogs = [], ormawas = [], selectedOrmawaFilter, setSelectedOrmawaFilter } = useStore(useShallow(state => ({ activityLogs: state.activityLogs, ormawas: state.ormawas, selectedOrmawaFilter: state.selectedOrmawaFilter, setSelectedOrmawaFilter: state.setSelectedOrmawaFilter })));
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'added' | 'deleted'
  const [searchQuery, setSearchQuery] = useState('');

  // Filter khusus log proker (ditambahkan dan dihapus)
  const prokerLogs = useMemo(() => {
    return activityLogs.filter(log => log.type === 'proker_added' || log.type === 'proker_deleted');
  }, [activityLogs]);

  // Statistik Ringkasan
  const totalAdded = useMemo(() => {
    return prokerLogs.filter(l => l.type === 'proker_added').length;
  }, [prokerLogs]);

  const totalDeleted = useMemo(() => {
    return prokerLogs.filter(l => l.type === 'proker_deleted').length;
  }, [prokerLogs]);

  // Filter gabungan (kategori, ormawa, dan search)
  const filteredLogs = useMemo(() => {
    return prokerLogs.filter(log => {
      // Filter Kategori (Type)
      let matchType = true;
      if (typeFilter === 'added') matchType = log.type === 'proker_added';
      if (typeFilter === 'deleted') matchType = log.type === 'proker_deleted';

      // Filter Ormawa
      const matchOrmawa = selectedOrmawaFilter === 'all' || log.ormawaId === selectedOrmawaFilter;

      // Filter Pencarian
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        (log.title && log.title.toLowerCase().includes(q)) ||
        (log.description && log.description.toLowerCase().includes(q)) ||
        (log.actor && log.actor.toLowerCase().includes(q)) ||
        (log.prokerTitle && log.prokerTitle.toLowerCase().includes(q));

      return matchType && matchOrmawa && matchSearch;
    });
  }, [prokerLogs, typeFilter, selectedOrmawaFilter, searchQuery]);

  // Hitung jumlah log per ormawa
  const ormawaCounts = useMemo(() => {
    const counts = { all: prokerLogs.length };
    prokerLogs.forEach((l) => {
      if (l.ormawaId) {
        counts[l.ormawaId] = (counts[l.ormawaId] || 0) + 1;
      }
    });
    return counts;
  }, [prokerLogs]);

  const ormawaOptions = [
    { id: 'all', label: 'Semua Ormawa' },
    { id: 'dpm', label: 'DPM' },
    { id: 'bem', label: 'BEM' },
    { id: 'himsisfo', label: 'Himsisfo' },
    { id: 'himti', label: 'Himti' }
  ];

  return (
    <div className="space-y-5 w-full max-w-5xl mx-auto">
      {/* 1. Header Sederhana & Elegan */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Histori Proker
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Catatan riwayat program kerja yang dibuat dan dihapus.
          </p>
        </div>

        {/* Filter Entitas Ormawa Sederhana */}
        <div className="flex items-center gap-1.5 overflow-x-auto bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 shrink-0 self-start sm:self-auto">
          {ormawaOptions.map((item) => {
            const isSelected = selectedOrmawaFilter === item.id;
            const count = ormawaCounts[item.id] || 0;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedOrmawaFilter(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{item.label}</span>
                <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-slate-100 text-slate-800' : 'bg-slate-200/60 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Bilah Filter Minimalis Terpadu & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 sm:p-3.5 rounded-2xl border border-slate-200/80 shadow-soft">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {[
            { id: 'all', label: 'Semua', count: prokerLogs.length, dot: 'bg-slate-400' },
            { id: 'added', label: 'Dibuat', count: totalAdded, dot: 'bg-emerald-500' },
            { id: 'deleted', label: 'Dihapus', count: totalDeleted, dot: 'bg-rose-500' }
          ].map((tab) => {
            const isSelected = typeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTypeFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-transparent text-slate-900 border border-slate-300 shadow-2xs font-extrabold'
                    : 'bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${tab.dot}`} />
                <span>{tab.label}</span>
                <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-slate-100 text-slate-800 border border-slate-200/80' : 'bg-slate-100 text-slate-500'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Pencarian Ringkas */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari histori..."
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition font-medium"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-md transition"
              title="Hapus pencarian"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 3. List Riwayat Aktivitas Sederhana & Elegan */}
      <div className="space-y-2.5">
        {filteredLogs.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-soft">
            <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-2.5">
              <History className="w-5 h-5 stroke-[1.8]" />
            </div>
            <h3 className="font-bold text-slate-800 text-xs">Tidak Ada Histori</h3>
            <p className="text-[11px] text-slate-500 mt-0.5 max-w-xs mx-auto">
              {prokerLogs.length === 0 
                ? 'Seluruh riwayat proker yang dibuat atau dihapus akan tercatat di sini.'
                : 'Tidak ada riwayat yang sesuai dengan filter pencarian Anda.'}
            </p>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const ormawa = ormawas.find(o => o.id === log.ormawaId);
            const isAdded = log.type === 'proker_added';

            return (
              <div
                key={log.id}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-soft hover:shadow-card hover:border-slate-300 transition flex items-start gap-3.5"
              >
                {/* Ikon Indikator Bulat Minimalis */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                  isAdded 
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                    : 'bg-rose-50 text-rose-600 border-rose-100'
                }`}>
                  {isAdded ? (
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                  ) : (
                    <Trash2 className="w-4 h-4 stroke-[2.2]" />
                  )}
                </div>

                {/* Konten Riwayat */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      {/* Badge Ormawa */}
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 shrink-0">
                        {ormawa?.shortName || 'Ormawa'}
                      </span>
                      {/* Judul Proker / Aksi */}
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {log.title}
                      </h3>
                    </div>

                    {/* Badge Status */}
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md shrink-0 ${
                      isAdded 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'bg-rose-50 text-rose-700'
                    }`}>
                      {isAdded ? 'Dibuat' : 'Dihapus'}
                    </span>
                  </div>

                  {/* Keterangan Singkat */}
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {log.description}
                  </p>

                  {/* Footer Baris: Tanggal & Aktor */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 gap-2">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-slate-600" />
                      <span>{log.timestamp}</span>
                    </span>

                    {log.actor && (
                      <span className="text-slate-600 truncate">
                        Oleh: <strong className="text-slate-900 font-semibold">{log.actor}</strong>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
