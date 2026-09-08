import React from 'react';
import { Award } from 'lucide-react';

const AUDIT_PARAMETERS = [
  {
    no: '01',
    title: 'Kedisiplinan Rundown',
    bobot: '20 Poin',
    desc: 'Acara dibuka & ditutup tepat waktu; rundown terlaksana tertib di lapangan.'
  },
  {
    no: '02',
    title: 'Capaian Target Peserta',
    bobot: '20 Poin',
    desc: 'Kehadiran peserta mencapai minimal 80%–100% dari target kuota proposal.'
  },
  {
    no: '03',
    title: 'Efisiensi Anggaran',
    bobot: '20 Poin',
    desc: 'Pengeluaran sesuai RAB, tidak defisit tak terduga, dan bukti nota sah terlampir.'
  },
  {
    no: '04',
    title: 'Kepatuhan SLA Berkas',
    bobot: '20 Poin',
    desc: 'Proposal masuk ≥ H-14 dan berkas LPJ diserahkan selambatnya ≤ H+14.'
  },
  {
    no: '05',
    title: 'Mutu Output Acara',
    bobot: '20 Poin',
    desc: 'Hasil kegiatan tercapai secara nyata sesuai visi & tupoksi ormawa.'
  }
];

export default function AuditParameterStandards() {
  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-soft w-full max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Matriks Parameter Audit Keberhasilan Proker (DPM FASILKOM UMB)
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Standar baku penilaian mutu kegiatan ormawa berdasarkan 5 pilar indikator terukur (Skor 0–100).
            </p>
          </div>
        </div>
        <span className="text-xs font-extrabold text-slate-900 bg-slate-100 px-3 py-1 rounded-xl shrink-0">
          Regulasi DPM 2026/2027
        </span>
      </div>

      {/* 5 Parameter Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mt-5">
        {AUDIT_PARAMETERS.map((param) => (
          <div key={param.no} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold text-slate-600">{param.no}</span>
                <span className="text-[10px] font-extrabold bg-white border border-slate-200 text-slate-800 px-2 py-0.5 rounded-full">
                  {param.bobot}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs mb-1">{param.title}</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">{param.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
