import React from 'react';
import { X, Printer, Download } from 'lucide-react';

export default function PrintDocModal({ isOpen, onClose, documentData }) {
  if (!isOpen || !documentData) return null;

  const handlePrint = () => {
    window.print();
  };

  const isSP = documentData.type === 'sp';
  const isRundown = documentData.type === 'rundown';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-[96vw] sm:max-w-3xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[95vh] flex flex-col">
        {/* Modal Top Bar (Hidden on print) */}
        <div className="p-3 sm:p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 no-print gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-bold text-slate-700 truncate">
              {isRundown 
                ? 'Pratinjau Dokumen Rundown Acara Resmi' 
                : 'Pratinjau Dokumen Resmi DPM Fasilkom'}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Cetak / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-800 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Paper */}
        <div className="p-4 sm:p-8 md:p-12 overflow-y-auto bg-white text-slate-900 font-sans print-page">
          {/* Official Kop Surat DPM FASILKOM UMB */}
          <div className="flex items-center justify-between pb-3 sm:pb-4 border-b-2 sm:border-b-4 border-double border-slate-900 gap-2 sm:gap-4">
            <div className="w-14 h-14 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center">
              <img 
                src="/logos/logo-dpm.png" 
                alt="Logo DPM Fasilkom UMB" 
                className="w-full h-full object-contain" 
              />
            </div>
            <div className="text-center flex-1 px-1 sm:px-4">
              <h2 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-red-700">
                UNIVERSITAS MERCU BUANA
              </h2>
              <h1 className="text-xs sm:text-base font-extrabold tracking-tight uppercase text-slate-900 mt-0.5 leading-snug">
                DEWAN PERWAKILAN MAHASISWA FAKULTAS ILMU KOMPUTER
              </h1>
              <p className="text-[9px] sm:text-[10px] text-slate-600 font-medium mt-0.5 hidden sm:block">
                Gedung Kuliah Terpadu Lantai 3, Jl. Meruya Selatan No. 1, Kembangan, Jakarta Barat 11650
              </p>
              <p className="text-[8px] sm:text-[10px] text-slate-600">
                Email: dpm.fasilkom@mercubuana.ac.id • Laman: dpm-fasilkom.mercubuana.ac.id
              </p>
            </div>
          </div>

          {/* Isi Dokumen: Surat Peringatan (SP) */}
          {isSP ? (
            <div className="mt-6 space-y-4 text-xs leading-relaxed">
              <div className="text-center my-4">
                <h3 className="font-extrabold text-sm uppercase tracking-wider underline text-slate-900">
                  SURAT PERINGATAN {documentData.level === 1 ? 'I (PERTAMA)' : documentData.level === 2 ? 'II (KEDUA)' : 'III (KETIGA)'}
                </h3>
                <p className="text-[11px] font-mono mt-1 text-slate-700 font-bold">
                  Nomor: {documentData.noSurat}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 py-2 border-y border-slate-200">
                <div>
                  <p><strong>Kepada Yth:</strong></p>
                  <p className="font-bold text-slate-900 mt-0.5">{documentData.ormawaName}</p>
                  <p className="text-slate-600">Fakultas Ilmu Komputer Universitas Mercu Buana</p>
                  <p className="text-slate-600">Di Tempat</p>
                </div>
                <div className="text-left sm:text-right">
                  <p>Jakarta, {documentData.date}</p>
                  <p>Sifat: <strong>PENTING / PERINGATAN</strong></p>
                  <p>Perihal: <strong>{documentData.title}</strong></p>
                </div>
              </div>

              <div>
                <p className="font-bold mb-1">Dengan hormat,</p>
                <p className="text-justify text-slate-700">
                  Berdasarkan fungsi legislasi dan pengawasan Dewan Perwakilan Mahasiswa (DPM) Fakultas Ilmu Komputer Universitas Mercu Buana terhadap kepatuhan pelaksanaan program kerja dan akuntabilitas organisasi kemahasiswaan:
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <p className="font-bold text-slate-900">Dasar dan Alasan Penerbitan Peringatan:</p>
                <p className="text-justify text-slate-800">
                  {documentData.reason}
                </p>
                <div className="text-[11px] text-slate-600 pt-2 border-t border-slate-200">
                  Program Kerja Terkait: <strong>{documentData.prokerTitle}</strong>
                </div>
              </div>

              <div className="text-justify space-y-2 text-slate-700">
                <p>
                  Sehubungan dengan hal tersebut, Dewan Perwakilan Mahasiswa (DPM) Fasilkom menginstruksikan kepada seluruh jajaran BPH dan Panitia Pelaksana untuk:
                </p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Segera menyelesaikan dan menyerahkan seluruh berkas Laporan Pertanggungjawaban (LPJ) beserta bukti transaksi keuangan fisik dan digital ke sekretariat DPM selambat-lambatnya <strong>3x24 jam</strong> sejak surat ini diterbitkan.</li>
                  <li>Menghadiri Rapat Dengar Pendapat (RDP) Khusus Evaluasi bersama Tim Komisi Pengawas DPM Fasilkom.</li>
                  <li>Apabila peringatan ini tidak diindahkan, DPM Fasilkom akan menerbitkan rekomendasi pembekuan hak pengajuan proker dan penahanan anggaran kemahasiswaan kepada pihak Dekanat.</li>
                </ol>
                <p>
                  Demikian Surat Peringatan ini disampaikan agar dilaksanakan dengan penuh rasa tanggung jawab demi menjaga integritas ormawa Fasilkom UMB.
                </p>
              </div>

              {/* Tanda Tangan Resmi */}
              <div className="pt-6 sm:pt-8 flex justify-center sm:justify-end">
                <div className="text-center w-full sm:w-64">
                  <p className="font-semibold text-slate-700">Hormat kami,</p>
                  <p className="font-bold text-slate-900 uppercase">
                    Dewan Perwakilan Mahasiswa<br/>Fakultas Ilmu Komputer UMB
                  </p>
                  
                  {/* Space for signature / stamp */}
                  <div className="h-16 sm:h-20 flex items-center justify-center relative my-1">
                    <div className="w-16 h-16 rounded-full border-2 border-red-700/30 flex items-center justify-center text-[9px] font-bold text-red-700/50 uppercase transform -rotate-12 pointer-events-none">
                      STEMPEL DPM
                    </div>
                  </div>

                  <p className="font-extrabold text-slate-900 underline text-xs">
                    {documentData.signer || 'Muhammad Daffa Aulia Syahrul'}
                  </p>
                  <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">
                    Ketua DPM FASILKOM UMB
                  </p>
                </div>
              </div>

              {/* Tembusan */}
              <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-600">
                <p className="font-bold">Tembusan:</p>
                <ol className="list-decimal pl-4">
                  <li>Dekan Fakultas Ilmu Komputer Universitas Mercu Buana</li>
                  <li>Wakil Dekan Bidang Kemahasiswaan Fasilkom UMB</li>
                  <li>Ketua Program Studi Teknik Informatika & Sistem Informasi UMB</li>
                  <li>Arsip Sekretariat DPM Fasilkom UMB</li>
                </ol>
              </div>
            </div>
          ) : isRundown ? (
            /* Lembar Jadwal & Rundown Acara Resmi */
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
          ) : (
            /* Lembar Berita Acara Audit Proker */
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
          )}
        </div>
      </div>
    </div>
  );
}

