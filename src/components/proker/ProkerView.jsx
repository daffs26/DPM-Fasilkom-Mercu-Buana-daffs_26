import React, { useState } from 'react';
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
  DollarSign, 
  Calendar,
  AlertOctagon,
  Printer,
  Layers,
  Eye,
  Trash2,
  AlertCircle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';

export default function ProkerView({ onOpenAddProker, onReviewProposal, onOpenDetailProker, onAuditLPJ, onPrintDoc }) {
  const { prokers, ormawas, selectedOrmawaFilter, setSelectedOrmawaFilter, searchQuery, deleteProker } = useStore();
  const [statusFilter, setStatusFilter] = useState('all');
  const [prokerToDelete, setProkerToDelete] = useState(null);

  // Filter gabungan
  const filtered = prokers.filter((p) => {
    const matchOrmawa = selectedOrmawaFilter === 'all' || p.ormawaId === selectedOrmawaFilter;
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.pic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.divisi.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchStatus = true;
    if (statusFilter === 'pending') matchStatus = p.status === 'proposal_pending';
    if (statusFilter === 'revisi') matchStatus = p.status === 'proposal_revisi' || p.proposal?.reviewStatus === 'revisi';
    if (statusFilter === 'approved') matchStatus = p.status === 'proposal_approved';
    if (statusFilter === 'overdue') matchStatus = p.status === 'lpj_overdue';
    if (statusFilter === 'completed') matchStatus = p.status === 'completed';

    return matchOrmawa && matchSearch && matchStatus;
  });

  const handleConfirmDelete = () => {
    if (prokerToDelete) {
      deleteProker(prokerToDelete.id);
      setProkerToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls: Filter Status & Add / History Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-soft">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'Semua Status' },
            { id: 'pending', label: 'Menunggu Review' },
            { id: 'revisi', label: 'Perlu Revisi' },
            { id: 'approved', label: 'Proposal ACC' },
            { id: 'overdue', label: 'LPJ Terlambat' },
            { id: 'completed', label: 'Proker Selesai' }
          ].map((tab) => {
            const isSelected = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Action Buttons: Histori Proker & Tambah Proker Baru */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenAddProker}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Program Kerja</span>
          </button>
        </div>
      </div>

      {/* Grid Kartu Proker */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
                    <div className="w-7 h-7 rounded-xl bg-slate-50 border border-slate-200 p-0.5 shrink-0 flex items-center justify-center">
                      <img src={ormawa?.logo} alt={ormawa?.name} className="w-full h-full object-contain" />
                    </div>
                    <span className="font-extrabold text-xs text-slate-900">
                      {ormawa?.shortName}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Status Badge */}
                    {isCompleted ? (
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Selesai ({p.lpj?.auditScore})
                      </span>
                    ) : isOverdue ? (
                      <span className="bg-red-50 text-red-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-red-300 flex items-center gap-1 animate-pulse">
                        <AlertOctagon className="w-3 h-3 text-red-600" /> LPJ Terlambat
                      </span>
                    ) : isRevisi ? (
                      <span className="bg-amber-50 text-amber-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-amber-600" /> Perlu Revisi {pendingRevisions > 0 ? `(${pendingRevisions})` : ''}
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

                    {/* Tombol Hapus di Header Card */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setProkerToDelete(p);
                      }}
                      className="p-1 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Hapus Program Kerja"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Judul & Divisi */}
                <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                  {p.title}
                </h3>
                <p className="text-[11px] text-slate-600 font-medium mt-1">
                  {p.divisi} • PIC: <strong>{p.pic}</strong>
                </p>

                {/* Info Metrik: Tanggal, Lokasi, Target & RAB */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    <span>{p.startDate} s/d {p.endDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    <span className="truncate">{p.location}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-600" />
                      <span>{p.targetPeserta} Peserta</span>
                    </span>
                    <span className="font-bold text-slate-900">
                      Rp {p.rab.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Berkas Pengawasan Snapshot */}
                <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                  {/* Proposal Row */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium">1. Proposal:</span>
                    {p.proposal?.fileName ? (
                      <span className={`font-bold ${p.proposal.isDadakan ? 'text-red-600' : 'text-slate-800'}`}>
                        {p.proposal.isDadakan ? '⚠️ Terlambat (< H-14)' : '✓ Ada'} ({p.proposal.uploadDate})
                      </span>
                    ) : (
                      <span className="text-slate-600 italic">Belum diunggah</span>
                    )}
                  </div>

                  {/* LPJ Row */}
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
                      <span className="text-slate-600">
                        Batas: {p.lpj?.deadlineDate || 'H+14'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
                <button
                  type="button"
                  onClick={() => onOpenDetailProker ? onOpenDetailProker(p) : onReviewProposal(p)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-600" />
                  <span>Detail Proker</span>
                </button>
                <button
                  type="button"
                  onClick={() => onAuditLPJ(p)}
                  className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-xs transition text-center cursor-pointer"
                >
                  {p.lpj?.auditScore ? 'Hasil Audit' : 'Audit LPJ'}
                </button>
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
                    setProkerToDelete(p);
                  }}
                  className="p-2 border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition shrink-0 cursor-pointer"
                  title="Hapus Program Kerja"
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

      {/* Modal Alert Konfirmasi Hapus Proker */}
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
              <DialogDescription className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Apakah Anda yakin ingin menghapus program kerja <strong className="text-slate-800">"{prokerToDelete?.title}"</strong>? Seluruh data jadwal, rincian anggaran, kepanitiaan, dan berkas terkait akan dihapus secara permanen dari sistem.
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
            <button
              type="button"
              onClick={handleConfirmDelete}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Ya, Hapus Proker</span>
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
