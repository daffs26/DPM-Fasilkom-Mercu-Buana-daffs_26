import React from 'react';
import { X, Printer, Download } from 'lucide-react';

export default function PrintDocModal({ isOpen, onClose, documentData }) {
  if (!isOpen || !documentData) return null;

  const handlePrint = () => {
    window.print();
  };

  const isSP = documentData.type === 'sp';
  const isRundown = documentData.type === 'rundown';
  const isRekapAnggaran = documentData.type === 'rekap_anggaran';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
      <div className={`bg-white w-[96vw] rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[95vh] flex flex-col ${
        isRekapAnggaran ? 'sm:max-w-4xl' : 'sm:max-w-3xl'
      }`}>
        {/* Modal Top Bar (Hidden on print) */}
        <div className="p-3 sm:p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 no-print gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-bold text-slate-700 truncate">
              {isRundown 
                ? 'Pratinjau Dokumen Rundown Acara Resmi' 
                : isRekapAnggaran
                ? 'Pratinjau Laporan Rekapitulasi Anggaran & LPJ Semester (DPM FASILKOM)'
                : 'Pratinjau Dokumen Resmi DPM Fasilkom'}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Cetak / Simpan PDF</span>
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

          {/* Isi Dokumen Berdasarkan Tipe */}
          {isRekapAnggaran ? (
            /* LAPORAN REKAPITULASI ANGGARAN & LPJ SEMESTER */
            <div className="mt-4 sm:mt-6 space-y-5 text-xs leading-relaxed">
              <div className="text-center my-3 sm:my-4">
                <h3 className="font-extrabold text-xs sm:text-sm uppercase tracking-wider underline text-slate-900">
                  LAPORAN REKAPITULASI PENGAWASAN ANGGARAN &amp; LPJ ORMAWA
                </h3>
                <p className="text-[10px] sm:text-[11px] font-mono mt-1 text-slate-700 font-bold">
                  Nomor: REKAP.ANGGARAN/DPM-FASILKOM/UMB/{new Date().getFullYear()}
                </p>
              </div>

              {/* Meta Dokumen */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div>
                  <p>Tanggal Laporan: <strong>{documentData.date}</strong></p>
                  <p>Tahun Akademik: <strong>2026/2027</strong></p>
                </div>
                <div className="text-left sm:text-right">
                  <p>Sifat: <strong>DOKUMEN LPJ &amp; AKUNTABILITAS RESMI</strong></p>
                  <p>Cakupan Entitas: <strong>{documentData.filter?.toUpperCase() === 'ALL' ? 'SELURUH ORMAWA FASILKOM' : documentData.filter?.toUpperCase()}</strong></p>
                </div>
              </div>

              {/* Seksi 1: 4 Indikator Finansial Utama */}
              <div>
                <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wide mb-2">
                  I. Ringkasan Eksekutif Keuangan Fakultas
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl">
                    <span className="text-[10px] text-slate-600 block uppercase font-bold">Total Pagu Alokasi</span>
                    <span className="font-black text-xs sm:text-sm text-slate-900 block mt-0.5">
                      Rp {(documentData.totalPaguFakultas || 0).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl">
                    <span className="text-[10px] text-slate-600 block uppercase font-bold">Total RAB Proker</span>
                    <span className="font-black text-xs sm:text-sm text-blue-900 block mt-0.5">
                      Rp {(documentData.totalRabTerencana || 0).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl">
                    <span className="text-[10px] text-slate-600 block uppercase font-bold">Total Realisasi Kas</span>
                    <span className="font-black text-xs sm:text-sm text-amber-900 block mt-0.5">
                      Rp {(documentData.totalRealisasiAktual || 0).toLocaleString('id-ID')}
                    </span>
                    <span className="text-[9px] text-amber-700 font-bold block">
                      Serapan: {documentData.persentaseSerapanFakultas || 0}%
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl">
                    <span className="text-[10px] text-slate-600 block uppercase font-bold">Sisa Saldo Kas</span>
                    <span className="font-black text-xs sm:text-sm text-emerald-900 block mt-0.5">
                      Rp {(documentData.sisaSaldoFakultas || 0).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Seksi 2: Tabel Rekapitulasi Alokasi & Serapan per Ormawa */}
              <div>
                <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wide mb-2">
                  II. Rekapitulasi Alokasi &amp; Serapan Kas per Ormawa
                </h4>
                <div className="overflow-x-auto border border-slate-300 rounded-xl">
                  <table className="w-full border-collapse text-[11px]">
                    <thead>
                      <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                        <th className="px-2.5 py-1.5 text-center w-8 border-r border-slate-300">No</th>
                        <th className="px-3 py-1.5 text-left border-r border-slate-300">Nama Organisasi Mahasiswa</th>
                        <th className="px-3 py-1.5 text-right border-r border-slate-300">Pagu Anggaran</th>
                        <th className="px-3 py-1.5 text-right border-r border-slate-300">Realisasi Kas</th>
                        <th className="px-3 py-1.5 text-right border-r border-slate-300">Sisa Saldo</th>
                        <th className="px-2 py-1.5 text-center border-r border-slate-300 w-16">Serapan</th>
                        <th className="px-2.5 py-1.5 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {(documentData.ormawas || []).map((o, idx) => {
                        const pagu = o.paguAnggaran || 0;
                        const serapan = o.serapanAnggaran || 0;
                        const sisa = Math.max(0, pagu - serapan);
                        const pct = pagu > 0 ? Math.round((serapan / pagu) * 100) : 0;
                        return (
                          <tr key={`print-ormawa-${o.id}`} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                            <td className="px-2.5 py-1.5 text-center border-r border-slate-300">{idx + 1}</td>
                            <td className="px-3 py-1.5 font-bold text-slate-900 border-r border-slate-300">
                              {o.name} <span className="text-[10px] text-slate-500 font-normal">({o.type})</span>
                            </td>
                            <td className="px-3 py-1.5 text-right font-mono border-r border-slate-300">
                              Rp {pagu.toLocaleString('id-ID')}
                            </td>
                            <td className="px-3 py-1.5 text-right font-mono font-bold text-amber-900 border-r border-slate-300">
                              Rp {serapan.toLocaleString('id-ID')}
                            </td>
                            <td className="px-3 py-1.5 text-right font-mono font-bold text-emerald-900 border-r border-slate-300">
                              Rp {sisa.toLocaleString('id-ID')}
                            </td>
                            <td className="px-2 py-1.5 text-center font-bold border-r border-slate-300">{pct}%</td>
                            <td className="px-2.5 py-1.5 text-center font-semibold text-[10px]">
                              {pct >= 80 ? 'Terserap Optimal' : pct > 0 ? 'Berjalan Normal' : 'Belum Serapan'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-100 font-black border-t-2 border-slate-300 text-slate-900">
                        <td colSpan={2} className="px-3 py-2 text-center border-r border-slate-300">TOTAL FAKULTAS</td>
                        <td className="px-3 py-2 text-right font-mono border-r border-slate-300">
                          Rp {(documentData.totalPaguFakultas || 0).toLocaleString('id-ID')}
                        </td>
                        <td className="px-3 py-2 text-right font-mono border-r border-slate-300 text-amber-900">
                          Rp {(documentData.totalRealisasiAktual || 0).toLocaleString('id-ID')}
                        </td>
                        <td className="px-3 py-2 text-right font-mono border-r border-slate-300 text-emerald-900">
                          Rp {(documentData.sisaSaldoFakultas || 0).toLocaleString('id-ID')}
                        </td>
                        <td className="px-2 py-2 text-center border-r border-slate-300">{documentData.persentaseSerapanFakultas || 0}%</td>
                        <td className="px-2.5 py-2 text-center text-[10px]">Laporan Sah</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Seksi 3: Matriks Anggaran Program Kerja */}
              <div>
                <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wide mb-2">
                  III. Matriks Anggaran Program Kerja Mahasiswa
                </h4>
                <div className="overflow-x-auto border border-slate-300 rounded-xl">
                  <table className="w-full border-collapse text-[10px] sm:text-[11px]">
                    <thead>
                      <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                        <th className="px-2 py-1.5 text-center w-8 border-r border-slate-300">No</th>
                        <th className="px-2.5 py-1.5 text-left border-r border-slate-300">Program Kerja</th>
                        <th className="px-2 py-1.5 text-center border-r border-slate-300 w-16">Ormawa</th>
                        <th className="px-2 py-1.5 text-center border-r border-slate-300 w-20">Tanggal</th>
                        <th className="px-2.5 py-1.5 text-right border-r border-slate-300">RAB (Rp)</th>
                        <th className="px-2.5 py-1.5 text-right border-r border-slate-300">Kas Cair (Rp)</th>
                        <th className="px-2.5 py-1.5 text-right border-r border-slate-300">Selisih (Rp)</th>
                        <th className="px-2 py-1.5 text-center">Status LPJ / Audit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {(documentData.prokers || []).length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-3 py-3 text-center text-slate-400 italic">
                            Tidak ada program kerja terdaftar
                          </td>
                        </tr>
                      ) : (
                        (documentData.prokers || []).map((p, idx) => {
                          const rab = p.rab || 0;
                          const realisasi = p.realisasiDana || 0;
                          const selisih = rab - realisasi;
                          return (
                            <tr key={`print-proker-${p.id}`} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                              <td className="px-2 py-1.5 text-center border-r border-slate-300">{idx + 1}</td>
                              <td className="px-2.5 py-1.5 font-bold text-slate-900 border-r border-slate-300">
                                {p.title}
                                <span className="block text-[9px] text-slate-500 font-normal">PJ: {p.pic || '-'}</span>
                              </td>
                              <td className="px-2 py-1.5 text-center font-bold border-r border-slate-300 uppercase">
                                {p.ormawaId}
                              </td>
                              <td className="px-2 py-1.5 text-center border-r border-slate-300 font-mono text-[9px]">
                                {p.startDate}
                              </td>
                              <td className="px-2.5 py-1.5 text-right font-mono border-r border-slate-300">
                                {rab.toLocaleString('id-ID')}
                              </td>
                              <td className="px-2.5 py-1.5 text-right font-mono font-bold text-amber-900 border-r border-slate-300">
                                {realisasi.toLocaleString('id-ID')}
                              </td>
                              <td className="px-2.5 py-1.5 text-right font-mono font-bold text-emerald-900 border-r border-slate-300">
                                {Math.max(0, selisih).toLocaleString('id-ID')}
                              </td>
                              <td className="px-2 py-1.5 text-center font-semibold text-[9px]">
                                {p.status === 'completed' 
                                  ? `Selesai (${p.lpj?.auditScore || 90}/100)` 
                                  : p.status === 'proposal_approved' 
                                  ? 'Proposal ACC' 
                                  : p.status === 'proposal_revisi'
                                  ? 'Perlu Revisi'
                                  : 'Draft / Proses'}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Seksi 4: Buku Kas & Riwayat Pencairan Kas */}
              <div>
                <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wide mb-2">
                  IV. Riwayat Buku Kas &amp; Transaksi Pencairan Dana
                </h4>
                <div className="overflow-x-auto border border-slate-300 rounded-xl">
                  <table className="w-full border-collapse text-[10px] sm:text-[11px]">
                    <thead>
                      <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                        <th className="px-2 py-1.5 text-center w-8 border-r border-slate-300">No</th>
                        <th className="px-2.5 py-1.5 text-center border-r border-slate-300 w-24">Tanggal</th>
                        <th className="px-2 py-1.5 text-center border-r border-slate-300 w-20">Ormawa</th>
                        <th className="px-2.5 py-1.5 text-left border-r border-slate-300 w-32">Kategori</th>
                        <th className="px-3 py-1.5 text-right border-r border-slate-300 w-28">Nominal</th>
                        <th className="px-3 py-1.5 text-left">Keterangan / Keperluan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {(documentData.transactions || []).length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-3 py-3 text-center text-slate-400 italic">
                            Belum ada catatan transaksi pencairan kas
                          </td>
                        </tr>
                      ) : (
                        (documentData.transactions || []).map((t, idx) => (
                          <tr key={`print-trans-${t.id || idx}`} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                            <td className="px-2 py-1.5 text-center border-r border-slate-300">{idx + 1}</td>
                            <td className="px-2.5 py-1.5 text-center font-mono border-r border-slate-300">{t.date}</td>
                            <td className="px-2 py-1.5 text-center font-bold uppercase border-r border-slate-300">{t.ormawaId}</td>
                            <td className="px-2.5 py-1.5 font-medium border-r border-slate-300">{t.type}</td>
                            <td className="px-3 py-1.5 text-right font-mono font-bold text-slate-900 border-r border-slate-300">
                              Rp {(t.amount || 0).toLocaleString('id-ID')}
                            </td>
                            <td className="px-3 py-1.5 text-slate-700">{t.note || '-'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pengesahan 3 Pihak Resmi */}
              <div className="pt-6 sm:pt-8 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="font-semibold text-slate-700 text-[10px] sm:text-xs">Perwakilan Eksekutif,</p>
                  <p className="font-bold text-slate-900 text-[10px] sm:text-xs uppercase">BEM / HIMPUNAN</p>
                  <div className="h-14 sm:h-16"></div>
                  <p className="font-bold underline text-slate-900 text-[10px] sm:text-xs">Rafi Pratama</p>
                  <p className="text-[9px] text-slate-600 font-medium">Ketua BEM FASILKOM UMB</p>
                </div>

                <div>
                  <p className="font-semibold text-slate-700 text-[10px] sm:text-xs">Komisi Anggaran &amp; Pengawas,</p>
                  <p className="font-bold text-slate-900 text-[10px] sm:text-xs uppercase">DPM FASILKOM UMB</p>
                  <div className="h-14 sm:h-16"></div>
                  <p className="font-bold underline text-slate-900 text-[10px] sm:text-xs">Komisi Pengawas Anggaran</p>
                  <p className="text-[9px] text-slate-600 font-medium">DPM FASILKOM UMB</p>
                </div>

                <div>
                  <p className="font-semibold text-slate-700 text-[10px] sm:text-xs">Mengetahui &amp; Mengesahkan,</p>
                  <p className="font-bold text-slate-900 text-[10px] sm:text-xs uppercase">KETUA DPM FASILKOM</p>
                  <div className="h-14 sm:h-16"></div>
                  <p className="font-bold underline text-slate-900 text-[10px] sm:text-xs">
                    {documentData.signer || 'Muhammad Daffa Aulia Syahrul'}
                  </p>
                  <p className="text-[9px] text-slate-600 font-bold uppercase tracking-wider">
                    Ketua DPM FASILKOM UMB
                  </p>
                </div>
              </div>
            </div>
          ) : isSP ? (
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

