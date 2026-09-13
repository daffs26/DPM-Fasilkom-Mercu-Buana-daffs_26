import React from 'react';

export default function PrintRundown({ documentData }) {
  return (
    <div className="mt-4 sm:mt-6 space-y-4 text-xs leading-relaxed">
      <div className="text-center my-3 sm:my-4">
        <h3 className="font-extrabold text-xs sm:text-sm uppercase tracking-wider underline text-slate-900">
          SUSUNAN JADWAL &amp; RUNDOWN KEGIATAN MAHASISWA
        </h3>
        <p className="text-[10px] sm:text-[11px] font-mono mt-1 text-slate-700 font-bold">
          Nomor: RND/{documentData.ormawa?.shortName || 'ORMAWA'}/DPM-FASILKOM/{new Date().getFullYear()}
        </p>
      </div>

      {/* Detail Meta Acara */}
      <div className="p-3 sm:p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-[11px] sm:text-xs">
          <p>Nama Program Kerja: <strong>{documentData.proker?.title || documentData.title}</strong></p>
          <p>Ormawa Penyelenggara: <strong>{documentData.ormawa?.name || documentData.ormawaName}</strong></p>
          <p>Tanggal Pelaksanaan: <strong>{documentData.proker?.startDate} {documentData.proker?.endDate && documentData.proker?.endDate !== documentData.proker?.startDate ? `s/d ${documentData.proker?.endDate}` : ''}</strong></p>
          <p>Lokasi Kegiatan: <strong>{documentData.proker?.location || 'Kampus Fasilkom UMB'}</strong></p>
          <p>Ketua Pelaksana / PJ: <strong>{documentData.proker?.pic || '-'}</strong></p>
          <p>Target Peserta: <strong>{documentData.proker?.targetPeserta || 0} Mahasiswa</strong></p>
        </div>
      </div>

      {/* Tabel Rundown Acara per Hari */}
      <div className="space-y-4 pt-1">
        {documentData.groupedDays?.map(({ dayNum, items }) => (
          <div key={`print-day-${dayNum}`} className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs text-slate-900 border-b border-slate-300 pb-1">
              <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-extrabold text-[10px]">
                HARI {dayNum}
              </span>
              <span>Susunan Acara Hari ke-{dayNum}</span>
              <span className="text-[10px] text-slate-500 font-normal">
                ({items.length} Sesi Kegiatan)
              </span>
            </div>

            <div className="overflow-x-auto -mx-1 sm:mx-0">
              <table className="w-full min-w-[500px] sm:min-w-full border-collapse border border-slate-300 text-[11px]">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold">
                    <th className="border border-slate-300 px-2 py-1.5 text-center w-10">No</th>
                    <th className="border border-slate-300 px-3 py-1.5 text-left w-32 font-mono">Waktu</th>
                    <th className="border border-slate-300 px-3 py-1.5 text-left">Nama Sesi &amp; Agenda Acara</th>
                    <th className="border border-slate-300 px-3 py-1.5 text-left w-36">Penanggung Jawab</th>
                    <th className="border border-slate-300 px-3 py-1.5 text-left w-44 sm:w-48">Keterangan Teknis</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="border border-slate-300 px-3 py-2 text-center text-slate-400 italic">
                        Belum ada sesi terdaftar untuk hari ini
                      </td>
                    </tr>
                  ) : (
                    items.map((r, idx) => (
                      <tr key={`print-item-${idx}`} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                        <td className="border border-slate-300 px-2 py-1.5 text-center font-medium">{idx + 1}</td>
                        <td className="border border-slate-300 px-3 py-1.5 font-mono font-bold text-slate-900">{r.time}</td>
                        <td className="border border-slate-300 px-3 py-1.5 font-semibold text-slate-900">{r.session}</td>
                        <td className="border border-slate-300 px-3 py-1.5 text-slate-700">{r.pic || '-'}</td>
                        <td className="border border-slate-300 px-3 py-1.5 text-slate-600">{r.note || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Tanda Tangan Pengesahan */}
      <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-4">
        <div className="text-center w-full sm:w-52">
          <p className="font-semibold text-slate-700">Penyelenggara Kegiatan,</p>
          <div className="h-14 sm:h-16"></div>
          <p className="font-bold underline text-slate-900">{documentData.proker?.pic || 'Ketua Pelaksana'}</p>
          <p className="text-[10px] text-slate-600">Ketua Pelaksana Kegiatan</p>
        </div>

        <div className="text-center w-full sm:w-52">
          <p className="font-semibold text-slate-700">Mengetahui &amp; Menyetujui,</p>
          <div className="h-14 sm:h-16"></div>
          <p className="font-bold underline text-slate-900">Muhammad Daffa Aulia Syahrul</p>
          <p className="text-[10px] text-slate-600">Ketua DPM FASILKOM UMB</p>
        </div>
      </div>
    </div>
  );
}
