import React, { useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { 
  Filter, 
  Calendar, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Plus, 
  UploadCloud, 
  AlertOctagon, 
  AlertTriangle, 
  ChevronUp, 
  ChevronDown, 
  MapPin, 
  Users, 
  Printer, 
  Layers,
  RotateCcw
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import DropdownSelect from '@/components/ui/dropdown-select';
import { AjukanHapusProkerModal, KelolaHapusProkerModal } from './ProkerHapusModal';
import UploadRevisiModal from './UploadRevisiModal';
import { formatDateIndo, formatDateRange } from '@/utils/formatters';

const ORMAWA_ORDER = ['dpm', 'bem', 'himti', 'himsisfo'];

function ProkerStatusBadge({ p, isCompleted, isOverdue, isRevisi, pendingRevisions }) {
  if (p.status === 'deletion_pending' || p.deletionPending) {
    return (
      <span className="bg-rose-50 text-rose-700 text-[10px] font-extrabold tracking-tight px-2.5 py-0.5 rounded-full border border-rose-200 flex items-center gap-1 shrink-0">
        <AlertTriangle className="w-3 h-3 text-rose-600" /> Pengajuan Hapus
      </span>
    );
  }
  if (isCompleted) {
    return (
      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold tracking-tight px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1 shrink-0">
        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Selesai ({p.lpj?.auditScore})
      </span>
    );
  }
  if (isOverdue) {
    return (
      <span className="bg-red-50 text-red-700 text-[10px] font-extrabold tracking-tight px-2.5 py-0.5 rounded-full border border-red-300 flex items-center gap-1 animate-pulse shrink-0">
        <AlertOctagon className="w-3 h-3 text-red-600" /> LPJ Terlambat
      </span>
    );
  }
  if (isRevisi) {
    return (
      <span className="bg-amber-50 text-amber-800 text-[10px] font-extrabold tracking-tight px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1 shrink-0">
        <AlertCircle className="w-3 h-3 text-amber-600" /> Revisi {pendingRevisions > 0 ? `(${pendingRevisions})` : ''}
      </span>
    );
  }
  if (p.proposal?.reviewStatus === 'approved') {
    return <span className="bg-blue-50 text-blue-700 text-[10px] font-extrabold tracking-tight px-2.5 py-0.5 rounded-full border border-blue-200 shrink-0">Proposal Disetujui</span>;
  }
  if (p.proposal?.isDadakan) {
    return <span className="bg-amber-50 text-amber-800 text-[10px] font-extrabold tracking-tight px-2.5 py-0.5 rounded-full border border-amber-200 shrink-0">⚠️ Mendekati H-14</span>;
  }
  return <span className="bg-slate-100 text-slate-700 text-[10px] font-extrabold tracking-tight px-2.5 py-0.5 rounded-full border border-slate-200 shrink-0">Menunggu Review</span>;
}

export default function ProkerView({ onOpenAddProker, onReviewProposal, onOpenDetailProker, onAuditLPJ, onPrintDoc }) {
  const { 
    prokers, 
    ormawas, 
    selectedOrmawaFilter, 
    setSelectedOrmawaFilter, 
    searchQuery, 
    deleteProker,
    deletionRequests,
    currentUser
  } = useStore(useShallow(state => ({ 
    prokers: state.prokers, 
    ormawas: state.ormawas, 
    selectedOrmawaFilter: state.selectedOrmawaFilter, 
    setSelectedOrmawaFilter: state.setSelectedOrmawaFilter, 
    searchQuery: state.searchQuery, 
    deleteProker: state.deleteProker, 
    deletionRequests: state.deletionRequests, 
    currentUser: state.currentUser 
  })));

  const [statusFilter, setStatusFilter] = useState('all');
  const [prokerToDelete, setProkerToDelete] = useState(null);
  const [prokerToRequestDelete, setProkerToRequestDelete] = useState(null);
  const [prokerToRevise, setProkerToRevise] = useState(null);
  const [isManageDeletionOpen, setIsManageDeletionOpen] = useState(false);
  const [isKpiExpanded, setIsKpiExpanded] = useState(false);

  const pendingDeletionCount = (deletionRequests || []).filter(r => r.status === 'pending').length;
  const isGuest = currentUser?.role === 'guest';
  const isDpm = currentUser?.ormawaId === 'dpm' && !isGuest;
  const canViewAll = isDpm || isGuest;

  const sortedOrmawas = useMemo(() => {
    return [...ormawas].sort((a, b) => {
      const idxA = ORMAWA_ORDER.indexOf(a.id);
      const idxB = ORMAWA_ORDER.indexOf(b.id);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      return 0;
    });
  }, [ormawas]);

  const ormawaProkers = useMemo(() => {
    return prokers.filter(p => selectedOrmawaFilter === 'all' || p.ormawaId === selectedOrmawaFilter);
  }, [prokers, selectedOrmawaFilter]);

  const statusCounts = useMemo(() => ({
    all: ormawaProkers.length,
    pending: ormawaProkers.filter(p => p.status === 'proposal_pending').length,
    revisi: ormawaProkers.filter(p => p.status === 'proposal_revisi' || p.proposal?.reviewStatus === 'revisi').length,
    approved: ormawaProkers.filter(p => p.status === 'proposal_approved').length,
    overdue: ormawaProkers.filter(p => p.status === 'lpj_overdue').length,
    completed: ormawaProkers.filter(p => p.status === 'completed').length,
  }), [ormawaProkers]);

  const filtered = useMemo(() => {
    return prokers.filter((p) => {
      const matchOrmawa = selectedOrmawaFilter === 'all' || p.ormawaId === selectedOrmawaFilter;
      const q = (searchQuery || '').toLowerCase().trim();
      const matchSearch = !q || 
        p.title.toLowerCase().includes(q) ||
        p.pic.toLowerCase().includes(q) ||
        p.divisi.toLowerCase().includes(q);
      
      let matchStatus = true;
      if (statusFilter === 'pending') matchStatus = p.status === 'proposal_pending';
      if (statusFilter === 'revisi') matchStatus = p.status === 'proposal_revisi' || p.proposal?.reviewStatus === 'revisi';
      if (statusFilter === 'approved') matchStatus = p.status === 'proposal_approved';
      if (statusFilter === 'overdue') matchStatus = p.status === 'lpj_overdue';
      if (statusFilter === 'completed') matchStatus = p.status === 'completed';

      return matchOrmawa && matchSearch && matchStatus;
    });
  }, [prokers, selectedOrmawaFilter, searchQuery, statusFilter]);

  const handleInitiateDelete = (p) => {
    if (currentUser?.ormawaId === 'dpm') {
      setProkerToDelete(p);
    } else {
      setProkerToRequestDelete(p);
    }
  };

  const handleConfirmDelete = () => {
    if (prokerToDelete) {
      deleteProker(prokerToDelete.id);
      setProkerToDelete(null);
    }
  };

  const ormawaOptions = useMemo(() => [
    {
      value: 'all',
      label: 'Semua Ormawa',
      badge: prokers.length
    },
    ...sortedOrmawas.map(o => ({
      value: o.id,
      label: o.shortName,
      badge: prokers.filter(p => p.ormawaId === o.id).length
    }))
  ], [prokers, sortedOrmawas]);

  const statusOptions = useMemo(() => [
    { value: 'all', label: 'Semua Status', badge: statusCounts.all },
    { value: 'pending', label: 'Menunggu Review', badge: statusCounts.pending },
    { value: 'revisi', label: 'Perlu Revisi', badge: statusCounts.revisi },
    { value: 'approved', label: 'Proposal Disetujui', badge: statusCounts.approved },
    { value: 'overdue', label: 'LPJ Terlambat', badge: statusCounts.overdue },
    { value: 'completed', label: 'Proker Selesai', badge: statusCounts.completed }
  ], [statusCounts]);

  const kpiItems = [
    { label: 'Total Proker', count: statusCounts.all, bg: 'bg-slate-50 border-slate-200/80', text: 'text-slate-500', val: 'text-slate-900' },
    { label: 'Proposal Disetujui', count: statusCounts.approved, bg: 'bg-blue-50/60 border-blue-200', text: 'text-blue-700', val: 'text-blue-900' },
    { label: 'Perlu Revisi', count: statusCounts.revisi, bg: 'bg-amber-50/60 border-amber-200', text: 'text-amber-800', val: 'text-amber-900' },
    { label: 'LPJ Terlambat', count: statusCounts.overdue, bg: 'bg-rose-50/60 border-rose-200', text: 'text-rose-700', val: 'text-rose-900' },
    { label: 'Selesai Diaudit', count: statusCounts.completed, bg: 'bg-emerald-50/60 border-emerald-200 col-span-2 sm:col-span-1', text: 'text-emerald-700', val: 'text-emerald-900' }
  ];

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Top Filter & Quick KPI Strip */}
      <div className="bg-white rounded-3xl p-3.5 sm:p-4.5 border border-slate-200/80 shadow-soft transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="font-black text-slate-900 text-xs sm:text-sm tracking-tight truncate">
              Daftar Program Kerja
            </h3>
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
            {currentUser?.ormawaId === 'dpm' && currentUser?.role !== 'guest' && pendingDeletionCount > 0 && (
              <button
                type="button"
                onClick={() => setIsManageDeletionOpen(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 min-h-[40px] h-10 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer animate-pulse active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline tracking-tight">Permohonan Hapus</span>
                <span className="tabular-nums">({pendingDeletionCount})</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsKpiExpanded(!isKpiExpanded)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-2 min-h-[40px] h-10 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200/80 rounded-xl text-[11px] font-bold transition shadow-2xs cursor-pointer active:scale-95"
              title={isKpiExpanded ? 'Tutup Ringkasan' : 'Buka Ringkasan KPI'}
            >
              {isKpiExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline tracking-tight">{isKpiExpanded ? 'Ringkas KPI' : 'Statistik KPI'}</span>
              <span className="sm:hidden tracking-tight">KPI</span>
            </button>
            {currentUser?.role !== 'guest' && (
              <button
                onClick={onOpenAddProker}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 min-h-[40px] h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline tracking-tight">Tambah Proker</span>
                <span className="sm:hidden tracking-tight">Tambah</span>
              </button>
            )}
          </div>
        </div>

        {/* Expanded KPI Strip */}
        {isKpiExpanded && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-3 animate-in fade-in-50 duration-200">
            {kpiItems.map((item, idx) => (
              <div key={idx} className={`p-2.5 sm:p-3 rounded-2xl border text-center ${item.bg}`}>
                <span className={`text-[10px] font-bold uppercase tracking-wider block ${item.text}`}>{item.label}</span>
                <span className={`text-base sm:text-lg font-black block mt-0.5 tracking-tight tabular-nums ${item.val}`}>{item.count}</span>
              </div>
            ))}
          </div>
        )}

        {/* Baris Filter Dropdown Ormawa & Status Proker */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 shrink-0">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="tracking-tight">Filter:</span>
            </div>

            {canViewAll && (
              <div className="w-full sm:w-56">
                <DropdownSelect
                  value={selectedOrmawaFilter}
                  onChange={setSelectedOrmawaFilter}
                  options={ormawaOptions}
                  placeholder="Pilih Ormawa"
                  triggerClassName="min-h-[42px] py-2.5 rounded-xl text-xs bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300"
                  contentClassName="w-64 z-50 shadow-xl"
                />
              </div>
            )}

            <div className="w-full sm:w-64">
              <DropdownSelect
                value={statusFilter}
                onChange={setStatusFilter}
                options={statusOptions}
                placeholder="Pilih Status Proker"
                triggerClassName="min-h-[42px] py-2.5 rounded-xl text-xs bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300"
                contentClassName="w-72 z-50 shadow-xl"
              />
            </div>

            {/* Tombol Reset Filter jika ada filter aktif */}
            {(statusFilter !== 'all' || (canViewAll && selectedOrmawaFilter !== 'all')) && (
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('all');
                  if (canViewAll) setSelectedOrmawaFilter('all');
                }}
                className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer px-2 py-1.5 rounded-lg shrink-0 self-start sm:self-center transition active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="tracking-tight">Reset Filter</span>
              </button>
            )}
          </div>

          <div className="text-[11px] font-medium text-slate-500 shrink-0 self-end sm:self-center">
            Menampilkan: <span className="text-slate-900 font-black tabular-nums">{filtered.length}</span> proker
          </div>
        </div>
      </div>

      {/* Program Kerja Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filtered.map((p) => {
          const ormawa = ormawas.find(o => o.id === p.ormawaId);
          const isOverdue = p.status === 'lpj_overdue';
          const isCompleted = p.status === 'completed';
          const isRevisi = p.status === 'proposal_revisi' || p.proposal?.reviewStatus === 'revisi';
          const pendingRevisions = p.proposal?.revisionItems?.filter(i => !i.completed).length || 0;

          return (
            <div
              key={p.id}
              className={`bg-white rounded-3xl p-4 sm:p-5 lg:p-6 border transition-all duration-200 hover:shadow-card flex flex-col justify-between ${
                isOverdue ? 'border-red-300 ring-2 ring-red-500/10' : 'border-slate-200/80 shadow-soft'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-slate-50 border border-slate-200 p-0.5 shrink-0 flex items-center justify-center shadow-2xs">
                      <img src={ormawa?.logo} alt={ormawa?.name} className="w-full h-full object-contain" />
                    </div>
                    <span className="font-extrabold text-xs text-slate-900 tracking-tight">
                      {ormawa?.shortName}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <ProkerStatusBadge 
                      p={p} 
                      isCompleted={isCompleted} 
                      isOverdue={isOverdue} 
                      isRevisi={isRevisi} 
                      pendingRevisions={pendingRevisions} 
                    />

                    {currentUser?.role !== 'guest' && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInitiateDelete(p);
                        }}
                        className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer active:scale-95"
                        title={currentUser?.ormawaId === 'dpm' ? "Hapus Program Kerja" : "Ajukan Permohonan Hapus"}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="font-black text-slate-900 text-sm sm:text-base leading-snug tracking-tight line-clamp-2">
                  {p.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-600 font-medium tracking-normal mt-1">
                  {p.divisi} • PIC: <strong className="text-slate-800">{p.pic}</strong>
                </p>

                <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="tracking-tight">{formatDateRange(p.startDate, p.endDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate tracking-tight">{p.location}</span>
                  </div>
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      <span className="tabular-nums">{p.targetPeserta} Peserta</span>
                    </span>
                    <span className="font-black text-slate-900 tracking-tight tabular-nums">
                      Rp {p.rab.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <div className="mt-3.5 p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Proposal</span>
                    {p.proposal?.fileName ? (
                      <span className={`font-bold tracking-tight ${p.proposal.isDadakan ? 'text-red-600' : 'text-slate-800'}`}>
                        {p.proposal.isDadakan ? '⚠️ Terlambat' : '✓ Ada'} ({formatDateIndo(p.proposal.uploadDate)})
                      </span>
                    ) : (
                      <span className="text-slate-400">Belum diunggah</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">LPJ</span>
                    {p.lpj?.fileName ? (
                      <span className="text-emerald-600 font-bold tracking-tight">
                        ✓ Terlampir ({formatDateIndo(p.lpj.uploadDate)})
                      </span>
                    ) : isOverdue ? (
                      <span className="text-red-600 font-bold tracking-tight">
                        🔴 Terlambat
                      </span>
                    ) : (
                      <span className="text-slate-400 tracking-tight">
                        Deadline: {p.lpj?.deadlineDate ? formatDateIndo(p.lpj.deadlineDate) : 'H+14'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4.5 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                <div className="grid grid-cols-2 gap-2 flex-1 sm:flex sm:items-center sm:gap-1.5">
                  <button
                    type="button"
                    onClick={() => onOpenDetailProker ? onOpenDetailProker(p) : onReviewProposal(p)}
                    className="h-10 sm:h-9 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition text-center flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] flex-1 tracking-tight"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-600" />
                    <span>Detail</span>
                  </button>

                  {isRevisi && currentUser?.role !== 'guest' && (currentUser?.ormawaId === p.ormawaId || currentUser?.ormawaId !== 'dpm') ? (
                    <button
                      type="button"
                      onClick={() => setProkerToRevise(p)}
                      className="h-10 sm:h-9 px-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs shadow-xs transition text-center flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] flex-1 tracking-tight"
                      title="Unggah Berkas Revisi"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Kirim Revisi</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onAuditLPJ(p)}
                      className="h-10 sm:h-9 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-xs transition text-center flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] flex-1 tracking-tight"
                    >
                      <span>{p.lpj?.auditScore ? 'Hasil Audit' : 'Audit LPJ'}</span>
                    </button>
                  )}
                </div>

                {p.status === 'completed' && (
                  <button
                    type="button"
                    onClick={() => onPrintDoc({ type: 'audit', ...p, ormawaName: ormawa?.name })}
                    className="h-10 sm:h-9 px-3 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold shrink-0 active:scale-[0.98] tracking-tight"
                    title="Cetak Berita Acara DPM"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-600" />
                    <span className="sm:hidden">Cetak Berita Acara</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-3xl p-14 text-center border border-slate-200/80 shadow-soft">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 ring-8 ring-blue-50/50 flex items-center justify-center mx-auto mb-3">
            <Layers className="w-6 h-6 stroke-[1.8]" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-sm">Tidak Ada Program Kerja</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto font-normal">
            Tidak ada program kerja yang sesuai filter.
          </p>
        </div>
      )}

      {/* Modal Dialog Konfirmasi Hapus Langsung (DPM) */}
      <Dialog open={Boolean(prokerToDelete)} onOpenChange={(open) => !open && setProkerToDelete(null)}>
        <DialogContent className="max-w-md p-6 rounded-3xl border border-slate-200 shadow-2xl">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shrink-0 shadow-2xs">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-base font-extrabold text-slate-900">
                Hapus Program Kerja?
              </DialogTitle>
              <DialogDescription className="text-slate-600 text-xs mt-1.5">
                Hapus <strong>{prokerToDelete?.title}</strong> secara permanen dari sistem? Tindakan ini tidak dapat dibatalkan.
              </DialogDescription>
            </div>
          </div>

          <DialogFooter className="mt-6 flex flex-row items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setProkerToDelete(null)}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              Batal
            </button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmDelete}
              className="rounded-xl text-xs font-bold w-full sm:w-auto"
            >
              Ya, Hapus Proker
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AjukanHapusProkerModal
        isOpen={Boolean(prokerToRequestDelete)}
        onClose={() => setProkerToRequestDelete(null)}
        proker={prokerToRequestDelete}
      />

      <UploadRevisiModal
        isOpen={Boolean(prokerToRevise)}
        onClose={() => setProkerToRevise(null)}
        proker={prokerToRevise}
      />

      <KelolaHapusProkerModal
        isOpen={isManageDeletionOpen}
        onClose={() => setIsManageDeletionOpen(false)}
      />
    </div>
  );
}
