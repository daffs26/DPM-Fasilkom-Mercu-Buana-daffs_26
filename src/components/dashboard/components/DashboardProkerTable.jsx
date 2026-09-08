import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Layers } from 'lucide-react';

export default function DashboardProkerTable({
  filteredProkers,
  ormawas,
  onOpenAddProker,
  onReviewProposal,
  onAuditLPJ
}) {
  return (
    <Card className="lg:col-span-2 rounded-3xl p-5 sm:p-6 border-slate-200/80 shadow-soft">
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <div>
          <h3 className="font-extrabold text-slate-900 text-sm">
            Status Pengawasan Program Kerja
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Monitoring berkas proposal, inspeksi hari-H, dan audit LPJ
          </p>
        </div>
      </div>

      {/* 1. DESKTOP SHADCN UI TABLE */}
      <div className="hidden lg:block mt-3.5 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-100">
              <TableHead className="pb-3 whitespace-nowrap">Ormawa &amp; Kegiatan</TableHead>
              <TableHead className="pb-3 whitespace-nowrap">Jadwal Acara</TableHead>
              <TableHead className="pb-3 whitespace-nowrap">Status Proposal</TableHead>
              <TableHead className="pb-3 whitespace-nowrap">Status LPJ (H+14)</TableHead>
              <TableHead className="pb-3 text-right whitespace-nowrap">Aksi DPM</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProkers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 ring-8 ring-blue-50/50 flex items-center justify-center mb-3">
                      <Layers className="w-6 h-6 stroke-[1.8]" />
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-900">Belum Ada Program Kerja</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 font-normal">
                      Daftarkan kegiatan baru atau ganti filter ormawa untuk melihat status monitoring berkas.
                    </p>
                    <Button
                      onClick={onOpenAddProker}
                      className="mt-3"
                      size="sm"
                    >
                      + Tambah Proker Baru
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredProkers.slice(0, 5).map((p) => {
                const ormawa = ormawas.find(o => o.id === p.ormawaId);
                return (
                  <TableRow key={p.id}>
                    {/* Ormawa & Judul */}
                    <TableCell className="py-3 pr-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 p-0.5 shrink-0 flex items-center justify-center">
                          <img src={ormawa?.logo} alt={ormawa?.name} className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-xs line-clamp-1">{p.title}</p>
                          <p className="text-[10px] text-slate-500">{ormawa?.shortName} • PIC: {p.pic}</p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Jadwal */}
                    <TableCell className="py-3 pr-3 text-slate-600 font-medium text-[11px]">
                      {p.startDate}
                    </TableCell>

                    {/* Status Proposal */}
                    <TableCell className="py-3 pr-3">
                      {p.proposal?.reviewStatus === 'approved' ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200/60">
                          ✓ ACC DPM
                        </span>
                      ) : p.proposal?.reviewStatus === 'revisi' ? (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200/60">
                          Perlu Revisi
                        </span>
                      ) : p.proposal?.isDadakan ? (
                        <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-200/60">
                          ⚠️ Terlambat (&lt; H-14)
                        </span>
                      ) : p.proposal?.fileName ? (
                        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200/60">
                          Menunggu Review
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px] italic">Belum Ada Berkas</span>
                      )}
                    </TableCell>

                    {/* Status LPJ */}
                    <TableCell className="py-3 pr-3">
                      {p.status === 'completed' ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200/60">
                          ✓ Selesai ({p.lpj?.auditScore})
                        </span>
                      ) : p.status === 'lpj_overdue' ? (
                        <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-red-300 animate-pulse">
                          🔴 Keterlambatan LPJ
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[10px]">
                          Deadline: {p.lpj?.deadlineDate || '-'}
                        </span>
                      )}
                    </TableCell>

                    {/* Aksi DPM */}
                    <TableCell className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {p.proposal?.fileName && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onReviewProposal(p)}
                            className="h-7 px-2.5 text-[11px]"
                          >
                            Review
                          </Button>
                        )}
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => onAuditLPJ(p)}
                          className="h-7 px-2.5 text-[11px]"
                        >
                          Audit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* 2. MOBILE PROKER CARD LIST (< lg) */}
      <div className="lg:hidden mt-3.5 space-y-3">
        {filteredProkers.length === 0 ? (
          <div className="py-8 text-center bg-slate-50/60 rounded-2xl border border-slate-200/80 p-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 ring-6 ring-blue-50/50 flex items-center justify-center mx-auto mb-2">
              <Layers className="w-5 h-5 stroke-[1.8]" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Belum Ada Program Kerja</h4>
            <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
              Daftarkan kegiatan baru atau ganti filter ormawa.
            </p>
            <Button onClick={onOpenAddProker} className="mt-3 text-xs" size="sm">
              + Tambah Proker Baru
            </Button>
          </div>
        ) : (
          filteredProkers.slice(0, 5).map((p) => {
            const ormawa = ormawas.find(o => o.id === p.ormawaId);
            return (
              <div
                key={p.id}
                className="p-3.5 rounded-2xl border border-slate-200/80 bg-white shadow-2xs space-y-2.5"
              >
                {/* Header: Logo + Ormawa + Tanggal Acara */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-slate-50 border border-slate-200 p-0.5 shrink-0 flex items-center justify-center">
                      <img src={ormawa?.logo} alt={ormawa?.name} className="w-full h-full object-contain" />
                    </div>
                    <span className="font-extrabold text-xs text-slate-900">{ormawa?.shortName}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-semibold">{p.startDate}</span>
                </div>

                {/* Judul Proker & PIC */}
                <div>
                  <h4 className="font-bold text-xs text-slate-900 leading-snug">{p.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    PIC: <strong className="text-slate-700">{p.pic}</strong> • Divisi: {p.divisi}
                  </p>
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-100">
                  {p.proposal?.reviewStatus === 'approved' ? (
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200/60">
                      ✓ Proposal ACC
                    </span>
                  ) : p.proposal?.reviewStatus === 'revisi' ? (
                    <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200/60">
                      Perlu Revisi
                    </span>
                  ) : p.proposal?.isDadakan ? (
                    <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-200/60">
                      ⚠️ Terlambat (&lt; H-14)
                    </span>
                  ) : p.proposal?.fileName ? (
                    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200/60">
                      Menunggu Review
                    </span>
                  ) : (
                    <span className="text-slate-400 text-[10px] italic">Belum Ada Proposal</span>
                  )}

                  {p.status === 'completed' ? (
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200/60">
                      ✓ LPJ Selesai ({p.lpj?.auditScore})
                    </span>
                  ) : p.status === 'lpj_overdue' ? (
                    <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-red-300">
                      🔴 LPJ Terlambat
                    </span>
                  ) : (
                    <span className="text-slate-500 text-[10px] bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
                      Deadline: {p.lpj?.deadlineDate || '-'}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  {p.proposal?.fileName && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onReviewProposal(p)}
                      className="flex-1 h-8 text-xs font-semibold rounded-xl"
                    >
                      Review Proposal
                    </Button>
                  )}
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onAuditLPJ(p)}
                    className="flex-1 h-8 text-xs font-semibold rounded-xl"
                  >
                    Audit LPJ
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
