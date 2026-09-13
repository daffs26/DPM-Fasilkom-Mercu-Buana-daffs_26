import React from 'react';

export default function PrintBeritaAcaraAudit({ documentData }) {
  return (
    <div className="mt-4 sm:mt-6 space-y-4 text-xs leading-relaxed">
      <div className="text-center my-3 sm:my-4">
        <h3 className="font-extrabold text-xs sm:text-sm uppercase tracking-wider underline text-slate-900">
          BERITA ACARA AUDIT &amp; PENGESAHAN LAPORAN PERTANGGUNGJAWABAN
        </h3>
        <p className="text-[10px] sm:text-[11px] font-mono mt-1 text-slate-700 font-bold">
          Nomor: BA.AUDIT/DPM-FASILKOM/UMB/2026
        </p>
      </div>

      <div className="p-3 sm:p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-[11px] sm:text-xs">
          <p>Nama Proker: <strong>{documentData.title}</strong></p>
          <p>Ormawa: <strong>{documentData.ormawaName}</strong></p>
          <p>Tanggal Acara: <strong>{documentData.startDate}</strong></p>
          <p>Ketua Pelaksana: <strong>{documentData.pic}</strong></p>
          <p>RAB Awal: <strong>Rp {documentData.rab?.toLocaleString('id-ID')}</strong></p>
          <p>Realisasi Dana: <strong>Rp {documentData.realisasiDana?.toLocaleString('id-ID')}</strong></p>
        </div>
      </div>

      <div className="border border-slate-200 rounded-xl p-3 sm:p-4">
        <h4 className="font-bold text-slate-900 mb-2">Hasil Evaluasi 5 Parameter DPM:</h4>
        <div className="space-y-1 text-slate-700 text-[11px] sm:text-xs">
          <p>1. Kedisiplinan Waktu: <strong>{documentData.lpj?.auditDetails?.rundownScore || 20} / 20</strong></p>
          <p>2. Capaian Peserta: <strong>{documentData.lpj?.auditDetails?.pesertaScore || 20} / 20</strong></p>
          <p>3. Efisiensi &amp; Transparansi Anggaran: <strong>{documentData.lpj?.auditDetails?.anggaranScore || 20} / 20</strong></p>
          <p>4. Kepatuhan SLA Proposal &amp; LPJ: <strong>{documentData.lpj?.auditDetails?.slaScore || 20} / 20</strong></p>
          <p>5. Mutu Output: <strong>{documentData.lpj?.auditDetails?.outputScore || 20} / 20</strong></p>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1 font-bold">
          <span>TOTAL SKOR AUDIT DPM:</span>
          <span className="text-sm sm:text-base text-emerald-700">
            {documentData.lpj?.auditScore || 90} / 100 (PREDIKAT {documentData.lpj?.auditDetails?.predikat || 'A'})
          </span>
        </div>
      </div>

      <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-4">
        <div className="text-center w-full sm:w-48">
          <p className="font-semibold text-slate-700">Penyelenggara Kegiatan,</p>
          <div className="h-14 sm:h-16"></div>
          <p className="font-bold underline text-slate-900">{documentData.pic}</p>
          <p className="text-[10px] text-slate-600">Ketua Pelaksana</p>
        </div>

        <div className="text-center w-full sm:w-48">
          <p className="font-semibold text-slate-700">Mengesahkan,</p>
          <div className="h-14 sm:h-16"></div>
          <p className="font-bold underline text-slate-900">Muhammad Daffa Aulia Syahrul</p>
          <p className="text-[10px] text-slate-600">Ketua DPM FASILKOM UMB</p>
        </div>
      </div>
    </div>
  );
}
