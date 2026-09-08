import React from 'react';

export default function PrintSuratPeringatan({ documentData }) {
  return (
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
          <li>Ketua Program Studi Teknik Informatika &amp; Sistem Informasi UMB</li>
          <li>Arsip Sekretariat DPM Fasilkom UMB</li>
        </ol>
      </div>
    </div>
  );
}
