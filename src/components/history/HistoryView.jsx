import React, { useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { 
  ArrowRight,
  Clock, 
  Search, 
  History, 
  X,
  Building2,
  Calendar,
  User,
  Info,
  Layers,
  Plus,
  Filter,
  RotateCcw
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import DropdownSelect from '@/components/ui/dropdown-select';

// 1. In-progress Icon (Half-filled circle from Image 2)
function InProgressIcon({ className = "w-3.5 h-3.5 shrink-0", active = false }) {
  if (active) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9.5" stroke="#FFFFFF" strokeWidth="2.5" />
        <path d="M12 2.5 A9.5 9.5 0 0 1 12 21.5 Z" fill="#FFFFFF" />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="2.5" />
      <path d="M12 2.5 A9.5 9.5 0 0 1 12 21.5 Z" fill="currentColor" />
    </svg>
  );
}

// 2. In-review Icon (Quarter-pie circle from Image 2)
function InReviewIcon({ className = "w-3.5 h-3.5 shrink-0", active = false }) {
  if (active) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9.5" stroke="#FFFFFF" strokeWidth="2.5" />
        <path d="M12 12 L12 21.5 A9.5 9.5 0 0 1 2.5 12 Z" fill="#FFFFFF" />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="2.5" />
      <path d="M12 12 L12 21.5 A9.5 9.5 0 0 1 2.5 12 Z" fill="currentColor" />
    </svg>
  );
}

// 3. Completed Icon (Filled circle with checkmark from Image 2)
function CompletedIcon({ className = "w-3.5 h-3.5 shrink-0", active = false }) {
  if (active) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10.5" fill="#FFFFFF" />
        <path d="M7.5 12.5L10.5 15.5L16.5 9" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10.5" fill="currentColor" />
      <path d="M7.5 12.5L10.5 15.5L16.5 9" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 4. Cancelled / Dihapus Icon
function CancelledIcon({ className = "w-3.5 h-3.5 shrink-0", active = false }) {
  if (active) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10.5" fill="#FFFFFF" />
        <path d="M15 9L9 15M9 9L15 15" stroke="#BE123C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10.5" fill="currentColor" />
      <path d="M15 9L9 15M9 9L15 15" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ProkerHistoryBadge with Image 2 styling
export function ProkerHistoryBadge({ status, label }) {
  let badgeConfig = {
    bg: 'bg-[#FFF7ED] text-[#EA580C] border-[#FED7AA]',
    icon: <InProgressIcon />,
    text: label || 'In-progress'
  };

  if (status === 'in-review') {
    badgeConfig = {
      bg: 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
      icon: <InReviewIcon />,
      text: label || 'In-review'
    };
  } else if (status === 'completed') {
    badgeConfig = {
      bg: 'bg-[#ECFDF5] text-[#15803D] border-[#A7F3D0]',
      icon: <CompletedIcon />,
      text: label || 'Completed'
    };
  } else if (status === 'cancelled' || status === 'deleted') {
    badgeConfig = {
      bg: 'bg-[#FFF1F2] text-[#E11D48] border-[#FECDD3]',
      icon: <CancelledIcon />,
      text: label || 'Dihapus'
    };
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border tracking-tight shadow-3xs transition-all ${badgeConfig.bg}`}>
      {badgeConfig.icon}
      <span>{badgeConfig.text}</span>
    </span>
  );
}

function getLogStatusCategory(log) {
  const type = log.type || '';
  if (type === 'proker_deleted' || type === 'proker_deletion_approved') {
    return { status: 'cancelled', label: 'Dihapus' };
  }
  if (type === 'proposal_approved' || type === 'lpj_reviewed' || type.includes('completed') || type.includes('resolved')) {
    return { status: 'completed', label: 'Completed' };
  }
  if (type === 'proposal_uploaded' || type === 'proker_deletion_requested' || type === 'lpj_uploaded' || type.includes('review') || type.includes('pending')) {
    return { status: 'in-review', label: 'In-review' };
  }
  return { status: 'in-progress', label: 'In-progress' };
}

function formatDisplayDate(timestamp, formattedDate) {
  if (formattedDate) return formattedDate;
  if (!timestamp) return 'Tanggal tidak tercatat';
  return timestamp;
}

export default function HistoryView({ onOpenAddProker, onOpenDetailProker }) {
  const { 
    activityLogs = [], 
    ormawas = [], 
    prokers = [],
    selectedOrmawaFilter, 
    setSelectedOrmawaFilter,
    currentUser
  } = useStore(useShallow(state => ({
    activityLogs: state.activityLogs,
    ormawas: state.ormawas,
    prokers: state.prokers,
    selectedOrmawaFilter: state.selectedOrmawaFilter,
    setSelectedOrmawaFilter: state.setSelectedOrmawaFilter,
    currentUser: state.currentUser
  })));

  const isGuest = currentUser?.role === 'guest';
  const isDpm = currentUser?.ormawaId === 'dpm' && !isGuest;
  const canViewAll = isDpm || isGuest;

  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArchivedLog, setSelectedArchivedLog] = useState(null);

  // Filter logs that belong to proker lifecycle
  const prokerLogs = useMemo(() => {
    return activityLogs.filter(log => {
      const t = log.type || '';
      return t.startsWith('proker_') || t.startsWith('proposal_') || t.startsWith('lpj_');
    });
  }, [activityLogs]);

  // Status counts for tabs
  const statusCounts = useMemo(() => {
    const counts = {
      all: prokerLogs.length,
      'in-progress': 0,
      'in-review': 0,
      completed: 0,
      cancelled: 0
    };

    prokerLogs.forEach(log => {
      const { status } = getLogStatusCategory(log);
      if (counts[status] !== undefined) {
        counts[status] += 1;
      }
    });

    return counts;
  }, [prokerLogs]);

  // Ormawa counts
  const ormawaCounts = useMemo(() => {
    const counts = { all: prokerLogs.length };
    prokerLogs.forEach(l => {
      if (l.ormawaId) {
        counts[l.ormawaId] = (counts[l.ormawaId] || 0) + 1;
      }
    });
    return counts;
  }, [prokerLogs]);

  const ormawaOrder = ['dpm', 'bem', 'himti', 'himsisfo'];
  const sortedOrmawas = useMemo(() => {
    return [...ormawas].sort((a, b) => {
      const idxA = ormawaOrder.indexOf(a.id);
      const idxB = ormawaOrder.indexOf(b.id);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      return 0;
    });
  }, [ormawas]);

  // Filtered log list
  const filteredLogs = useMemo(() => {
    return prokerLogs.filter(log => {
      const { status } = getLogStatusCategory(log);
      
      let matchStatus = true;
      if (statusFilter !== 'all') {
        matchStatus = status === statusFilter;
      }

      const matchOrmawa = selectedOrmawaFilter === 'all' || log.ormawaId === selectedOrmawaFilter;

      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        (log.title && log.title.toLowerCase().includes(q)) ||
        (log.description && log.description.toLowerCase().includes(q)) ||
        (log.actor && log.actor.toLowerCase().includes(q)) ||
        (log.prokerTitle && log.prokerTitle.toLowerCase().includes(q));

      return matchStatus && matchOrmawa && matchSearch;
    });
  }, [prokerLogs, statusFilter, selectedOrmawaFilter, searchQuery]);

  const statusOptions = useMemo(() => [
    { value: 'all', label: 'Semua Status', badge: statusCounts.all },
    { value: 'in-progress', label: 'In-progress', badge: statusCounts['in-progress'] },
    { value: 'in-review', label: 'In-review', badge: statusCounts['in-review'] },
    { value: 'completed', label: 'Completed', badge: statusCounts.completed },
    { value: 'cancelled', label: 'Dihapus', badge: statusCounts.cancelled }
  ], [statusCounts]);

  const ormawaOptions = useMemo(() => [
    {
      value: 'all',
      label: 'Semua Ormawa',
      badge: prokerLogs.length
    },
    ...sortedOrmawas.map(o => ({
      value: o.id,
      label: o.shortName,
      badge: ormawaCounts[o.id] || 0
    }))
  ], [prokerLogs.length, sortedOrmawas, ormawaCounts]);

  const handleActionClick = (log) => {
    if (log.prokerId) {
      const targetProker = prokers.find(p => p.id === log.prokerId);
      if (targetProker && onOpenDetailProker) {
        onOpenDetailProker(targetProker);
        return;
      }
    }
    // Jika proker sudah dihapus atau tidak ditemukan di daftar aktif, buka rincian arsip log
    setSelectedArchivedLog(log);
  };

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Histori Proker
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Catatan lini masa dan riwayat resmi aktivitas program kerja ormawa.
          </p>
        </div>
      </div>

      {/* Filter Toolbar: Ormawa & Status Dropdowns + Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-soft">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="tracking-tight">Filter:</span>
          </div>

          {canViewAll && (
            <div className="w-full sm:w-48">
              <DropdownSelect
                value={selectedOrmawaFilter}
                onChange={setSelectedOrmawaFilter}
                options={ormawaOptions}
                placeholder="Pilih Ormawa"
                triggerClassName="min-h-[42px] py-2 rounded-xl text-xs bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300"
                contentClassName="w-56 z-50 shadow-xl"
              />
            </div>
          )}

          <div className="w-full sm:w-52">
            <DropdownSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={statusOptions}
              placeholder="Pilih Status"
              triggerClassName="min-h-[42px] py-2 rounded-xl text-xs bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300"
              contentClassName="w-60 z-50 shadow-xl"
            />
          </div>

          {(statusFilter !== 'all' || (canViewAll && selectedOrmawaFilter !== 'all') || searchQuery.trim()) && (
            <button
              type="button"
              onClick={() => {
                setStatusFilter('all');
                if (canViewAll) setSelectedOrmawaFilter('all');
                setSearchQuery('');
              }}
              className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer px-2 py-1.5 rounded-lg shrink-0 self-start sm:self-center transition active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="tracking-tight">Reset</span>
            </button>
          )}
        </div>

        <div className="relative w-full sm:w-60 shrink-0">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari histori proker..."
            className="w-full min-h-[42px] h-10.5 pl-9 pr-8 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition font-medium tracking-normal"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md transition cursor-pointer"
              title="Hapus pencarian"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Timeline List (Concept Image 1 & Image 2) */}
      <div className="relative">
        {filteredLogs.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 sm:p-14 text-center border border-slate-200/80 shadow-soft">
            <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-3 border border-slate-200/60">
              <History className="w-6 h-6 stroke-[1.8]" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">Belum Ada Histori Proker</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto font-normal">
              {prokerLogs.length === 0 
                ? 'Seluruh riwayat pembuatan, persetujuan, revisi, hingga penghapusan program kerja akan tercatat rapi di sini.'
                : 'Tidak ada riwayat yang sesuai dengan filter pencarian Anda.'}
            </p>
            {prokerLogs.length === 0 && onOpenAddProker && (
              <button
                type="button"
                onClick={onOpenAddProker}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 min-h-[40px] h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-2xs transition cursor-pointer active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="tracking-tight">Buat Proker Pertama</span>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-0">
            {filteredLogs.map((log, index) => {
              const ormawa = ormawas.find(o => o.id === log.ormawaId);
              const { status, label } = getLogStatusCategory(log);
              const isLast = index === filteredLogs.length - 1;
              const hasExistingProker = log.prokerId && prokers.some(p => p.id === log.prokerId);

              return (
                <div key={log.id} className="relative">
                  {/* Card Element from Image 1 */}
                  <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/90 shadow-xs hover:shadow-card hover:border-slate-300 transition duration-150">
                    {/* Top Row: Date from Image 1 */}
                    <div className="flex items-center justify-between gap-3 text-xs text-slate-500 font-medium tracking-normal mb-2.5">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="tracking-tight">{formatDisplayDate(log.timestamp, log.formattedDate)}</span>
                      </div>

                      {ormawa && (
                        <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-0.5 rounded-lg border border-slate-200/70 text-slate-700 text-[11px] font-bold">
                          <img src={ormawa.logo} alt={ormawa.shortName} className="w-3.5 h-3.5 object-contain shrink-0" />
                          <span className="tracking-tight">{ormawa.shortName}</span>
                        </div>
                      )}
                    </div>

                    {/* Headline Row with Badge from Image 1 & Image 2 */}
                    <div className="flex flex-wrap items-center gap-2.5 mt-1">
                      <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
                        {log.title}
                      </h3>
                      <ProkerHistoryBadge status={status} label={label} />
                    </div>

                    {/* Description Paragraph from Image 1 */}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed tracking-normal mt-2.5 font-normal">
                      {log.description}
                    </p>

                    {/* Bottom Action Footer from Image 1 */}
                    <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => handleActionClick(log)}
                        className="inline-flex items-center gap-2 px-4 py-2 min-h-[40px] h-10 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-2xs hover:border-slate-300 transition group cursor-pointer active:scale-[0.98]"
                      >
                        <span className="tracking-tight">{hasExistingProker ? 'Lihat Detail Proker' : 'Rincian Riwayat'}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 group-hover:text-slate-700 transition" />
                      </button>

                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 tracking-normal">
                        <span>Dicatat oleh:</span>
                        <strong className="text-slate-700 font-semibold">{log.actor || 'Sistem'}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Vertical Connector Line from Image 1 */}
                  {!isLast && (
                    <div className="flex justify-start pl-8 sm:pl-10 my-0">
                      <div className="w-[2px] h-6 sm:h-7 bg-blue-200/80 rounded-full" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Rincian Riwayat untuk Arsip Log */}
      <Dialog open={!!selectedArchivedLog} onOpenChange={(open) => { if (!open) setSelectedArchivedLog(null); }}>
        <DialogContent className="max-w-md bg-white rounded-2xl p-6 border border-slate-200 shadow-xl">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              {selectedArchivedLog && (
                <ProkerHistoryBadge 
                  status={getLogStatusCategory(selectedArchivedLog).status} 
                  label={getLogStatusCategory(selectedArchivedLog).label} 
                />
              )}
            </div>
            <DialogTitle className="text-base font-extrabold text-slate-900 leading-snug">
              {selectedArchivedLog?.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {selectedArchivedLog && formatDisplayDate(selectedArchivedLog.timestamp, selectedArchivedLog.formattedDate)}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-3 space-y-3.5 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-400">Entitas Ormawa:</span>
                <span className="font-bold text-slate-800 uppercase">{selectedArchivedLog?.ormawaId}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-400">Penanggung Jawab Aksi:</span>
                <span className="font-bold text-slate-800">{selectedArchivedLog?.actor || 'Sistem'}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-400">ID Referensi:</span>
                <span className="font-mono text-[11px] text-slate-600">{selectedArchivedLog?.id}</span>
              </div>
            </div>

            <div>
              <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Keterangan Log Resmi
              </h4>
              <p className="text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200/70">
                {selectedArchivedLog?.description}
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedArchivedLog(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
              >
                Tutup Rincian
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
