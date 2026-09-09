import React, { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { 
  Plus, 
  Search, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Award, 
  MapPin, 
  Users, 
  Calendar,
  AlertOctagon,
  Printer,
  Layers,
  Eye,
  Trash2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  TrendingUp,
  UploadCloud
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import RequestDeleteProkerModal from './components/RequestDeleteProkerModal';
import SubmitRevisionModal from './components/SubmitRevisionModal';
import ManageDeletionRequestsModal from './components/ManageDeletionRequestsModal';

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
  } = useStore();
  const [statusFilter, setStatusFilter] = useState('all');
  const [prokerToDelete, setProkerToDelete] = useState(null);
  const [prokerToRequestDelete, setProkerToRequestDelete] = useState(null);
  const [prokerToRevise, setProkerToRevise] = useState(null);
  const [isManageDeletionOpen, setIsManageDeletionOpen] = useState(false);
  const [isKpiExpanded, setIsKpiExpanded] = useState(false);

  const pendingDeletionCount = (deletionRequests || []).filter(r => r.status === 'pending').length;

  // Filter ormawa dasar untuk menghitung status counts
  const ormawaProkers = useMemo(() => {
    return prokers.filter(p => selectedOrmawaFilter === 'all' || p.ormawaId === selectedOrmawaFilter);
  }, [prokers, selectedOrmawaFilter]);

  // Hitungan kuantitas per status secara real-time
  const statusCounts = useMemo(() => {
    return {
      all: ormawaProkers.length,
      pending: ormawaProkers.filter(p => p.status === 'proposal_pending').length,
      revisi: ormawaProkers.filter(p => p.status === 'proposal_revisi' || p.proposal?.reviewStatus === 'revisi').length,
      approved: ormawaProkers.filter(p => p.status === 'proposal_approved').length,
      overdue: ormawaProkers.filter(p => p.status === 'lpj_overdue').length,
      completed: ormawaProkers.filter(p => p.status === 'completed').length,
    };
  }, [ormawaProkers]);

  // Filter gabungan
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

  const filterTabs = [
    { id: 'all', label: 'Semua Status', count: statusCounts.all, color: 'text-slate-600' },
    { id: 'pending', label: 'Menunggu Review', count: statusCounts.pending, color: 'text-amber-600' },
    { id: 'revisi', label: 'Perlu Revisi', count: statusCounts.revisi, color: 'text-rose-600' },
    { id: 'approved', label: 'Proposal ACC', count: statusCounts.approved, color: 'text-blue-600' },
    { id: 'overdue', label: 'LPJ Terlambat', count: statusCounts.overdue, color: 'text-red-600' },
    { id: 'completed', label: 'Proker Selesai', count: statusCounts.completed, color: 'text-emerald-600' }
  ];

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* 1. TOP EFFICIENCY STRIP: Mini KPI & Ringkasan Cepat */}
      <div className="bg-white rounded-3xl p-3.5 sm:p-4 border border-slate-200/80 shadow-soft transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm truncate sm:whitespace-normal">
              Manajemen &amp; Pengawasan Program Kerja
            </h3>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
            {currentUser?.ormawaId === 'dpm' && pendingDeletionCount > 0 && (
              <button
                type="button"
                onClick={() => setIsManageDeletionOpen(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer animate-pulse"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Permohonan Hapus ({pendingDeletionCount})</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsKpiExpanded(!isKpiExpanded)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200/80 rounded-xl text-[11px] font-bold transition shadow-2xs cursor-pointer"
              title={isKpiExpanded ? 'Tutup Ringkasan' : 'Buka Ringkasan KPI'}
            >
              {isKpiExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              <span>{isKpiExpanded ? 'Ringkas KPI' : 'Statistik KPI'}</span>
            </button>
            <button
              onClick={onOpenAddProker}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 sm:px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Proker</span>
            </button>
          </div>
        </div>

        {/* Expanded Mini KPI Strip */}
        {isKpiExpanded && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-3 animate-in fade-in-50 duration-200">
            <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Total Proker</span>
              <span className="text-base font-black text-slate-900 block mt-0.5">{statusCounts.all}</span>
            </div>
            <div className="p-2.5 bg-blue-50/60 rounded-2xl border border-blue-200 text-center">
              <span className="text-[10px] text-blue-700 font-bold uppercase block">Proposal ACC</span>
              <span className="text-base font-black text-blue-900 block mt-0.5">{statusCounts.approved}</span>
            </div>
            <div className="p-2.5 bg-amber-50/60 rounded-2xl border border-amber-200 text-center">
              <span className="text-[10px] text-amber-800 font-bold uppercase block">Perlu Revisi</span>
              <span className="text-base font-black text-amber-900 block mt-0.5">{statusCounts.revisi}</span>
            </div>
            <div className="p-2.5 bg-rose-50/60 rounded-2xl border border-rose-200 text-center">
              <span className="text-[10px] text-rose-700 font-bold uppercase block">LPJ Terlambat</span>
              <span className="text-base font-black text-rose-900 block mt-0.5">{statusCounts.overdue}</span>
            </div>
            <div className="p-2.5 bg-emerald-50/60 rounded-2xl border border-emerald-200 text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] text-emerald-700 font-bold uppercase block">Selesai Diaudit</span>
              <span className="text-base font-black text-emerald-900 block mt-0.5">{statusCounts.completed}</span>
            </div>
          </div>
        )}

        {/* Filter Status Tabs with Smart Real-Time Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2.5 hide-scrollbar">
          {filterTabs.map((tab) => {
            const isSelected = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 bg-slate-50 border border-slate-200/60'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : tab.count > 0 && tab.id === 'overdue'
                    ? 'bg-rose-100 text-rose-700'
                    : tab.count > 0 && tab.id === 'revisi'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. GRID KARTU PROGRAM KERJA */}
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
              className={`bg-white rounded-3xl p-5 border transition-all duration-200 hover:shadow-card flex flex-col justify-between ${
                isOverdue ? 'border-red-300 ring-2 ring-red-500/10' : 'border-slate-200/80 shadow-soft'
              }`}
            >
              <div>
                {/* Header Card: Ormawa Logo, Status & Tombol Hapus */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-slate-50 border border-slate-200 p-0.5 shrink-0 flex items-center justify-center shadow-2xs">
                      <img src={ormawa?.logo} alt={ormawa?.name} className="w-full h-full object-contain" />
                    </div>
                    <span className="font-extrabold text-xs text-slate-900">
                      {ormawa?.shortName}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Status Badge */}
                    {p.status === 'deletion_pending' || p.deletionPending ? (
                      <span className="bg-rose-50 text-rose-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-rose-600" /> Hapus (Menunggu DPM)
                      </span>
                    ) : isCompleted ? (
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Selesai ({p.lpj?.auditScore})
                      </span>
                    ) : isOverdue ? (
                      <span className="bg-red-50 text-red-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-red-300 flex items-center gap-1 animate-pulse">
                        <AlertOctagon className="w-3 h-3 text-red-600" /> LPJ Terlambat
                      </span>
                    ) : isRevisi ? (
                      <span className="bg-amber-50 text-amber-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-amber-600" /> Revisi {pendingRevisions > 0 ? `(${pendingRevisions})` : ''}
                      </span>
                    ) : p.proposal?.reviewStatus === 'approved' ? (
                      <span className="bg-blue-50 text-blue-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-blue-200">
                        Proposal ACC
                      </span>
                    ) : p.proposal?.isDadakan ? (
                      <span className="bg-red-50 text-red-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-red-200">
                        ⚠️ Terlambat (&lt; H-14)
                      </span>
                    ) : (
                      <span className="bg-amber-50 text-amber-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-200">
                        Menunggu Review
                      </span>
                    )}

                    {/* Tombol Hapus */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInitiateDelete(p);
                      }}
                      className="p-1 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title={currentUser?.ormawaId === 'dpm' ? "Hapus Program Kerja" : "Ajukan Permohonan Hapus"}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Judul & Divisi */}
                <h3 className="font-extrabold text-slate-900 text-sm leading-snug line-clamp-2">
                  {p.title}
                </h3>
                <p className="text-[11px] text-slate-600 font-medium mt-1">
                  {p.divisi} • PIC: <strong>{p.pic}</strong>
                </p>

                {/* Info Metrik: Tanggal, Lokasi, Target & RAB */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{p.startDate} s/d {p.endDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{p.location}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      <span>{p.targetPeserta} Peserta</span>
                    </span>
                    <span className="font-bold text-slate-900">
                      Rp {p.rab.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Berkas Pengawasan Snapshot */}
                <div className="mt-3.5 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium">1. Proposal:</span>
                    {p.proposal?.fileName ? (
                      <span className={`font-bold ${p.proposal.isDadakan ? 'text-red-600' : 'text-slate-800'}`}>
                        {p.proposal.isDadakan ? '⚠️ Terlambat (< H-14)' : '✓ Ada'} ({p.proposal.uploadDate})
                      </span>
                    ) : (
                      <span className="text-slate-500">Belum diunggah</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium">2. Berkas LPJ:</span>
                    {p.lpj?.fileName ? (
                      <span className="text-emerald-600 font-bold">
                        ✓ Terlampir ({p.lpj.uploadDate})
                      </span>
                    ) : isOverdue ? (
                      <span className="text-red-600 font-bold">
                        🔴 Terlambat (&gt; H+14)
                      </span>
                    ) : (
                      <span className="text-slate-500">
                        Batas: {p.lpj?.deadlineDate || 'H+14'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => onOpenDetailProker ? onOpenDetailProker(p) : onReviewProposal(p)}
                  className="flex-1 min-w-[90px] py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-600" />
                  <span>Detail</span>
                </button>

                {isRevisi && (currentUser?.ormawaId === p.ormawaId || currentUser?.ormawaId !== 'dpm') ? (
                  <button
                    type="button"
                    onClick={() => setProkerToRevise(p)}
                    className="flex-1 min-w-[110px] py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs shadow-xs transition text-center flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Unggah Berkas Revisi"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Kirim Revisi</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onAuditLPJ(p)}
                    className="flex-1 min-w-[90px] py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-xs transition text-center cursor-pointer"
                  >
                    {p.lpj?.auditScore ? 'Hasil Audit' : 'Audit LPJ'}
                  </button>
                )}

                {p.status === 'completed' && (
                  <button
                    type="button"
                    onClick={() => onPrintDoc({ type: 'audit', ...p, ormawaName: ormawa?.name })}
                    className="p-2 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl transition cursor-pointer"
                    title="Cetak Berita Acara DPM"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleInitiateDelete(p);
                  }}
                  className="p-2 border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition shrink-0 cursor-pointer"
                  title={currentUser?.ormawaId === 'dpm' ? "Hapus Program Kerja" : "Ajukan Permohonan Hapus"}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
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
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto font-normal">
            Coba sesuaikan filter ormawa atau kata kunci pencarian Anda di atas.
          </p>
        </div>
      )}

      {/* Modal Alert Konfirmasi Hapus Proker (Khusus DPM) */}
      <Dialog open={Boolean(prokerToDelete)} onOpenChange={(open) => !open && setProkerToDelete(null)}>
        <DialogContent className="max-w-md p-6 rounded-3xl border border-slate-200 shadow-2xl">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shrink-0 shadow-2xs">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-base font-extrabold text-slate-900">
                Hapus Program Kerja Langsung?
              </DialogTitle>
              <DialogDescription className="text-slate-600 text-xs mt-1.5">
                Sebagai DPM, Anda dapat menghapus proker <strong>{prokerToDelete?.title}</strong> secara langsung. Data yang dihapus tidak dapat dikembalikan.
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

      {/* Modal Permohonan Hapus (Ormawa -> DPM) */}
      <RequestDeleteProkerModal
        isOpen={Boolean(prokerToRequestDelete)}
        onClose={() => setProkerToRequestDelete(null)}
        proker={prokerToRequestDelete}
      />

      {/* Modal Unggah Revisi Berkas (Ormawa) */}
      <SubmitRevisionModal
        isOpen={Boolean(prokerToRevise)}
        onClose={() => setProkerToRevise(null)}
        proker={prokerToRevise}
      />

      {/* Modal Kelola Permohonan Hapus (DPM) */}
      <ManageDeletionRequestsModal
        isOpen={isManageDeletionOpen}
        onClose={() => setIsManageDeletionOpen(false)}
      />
    </div>
  );
}
