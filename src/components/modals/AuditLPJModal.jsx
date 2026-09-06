import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { X, Award, UploadCloud, CheckCircle2, AlertTriangle, FileText, DollarSign, Clock, Users } from 'lucide-react';

export default function AuditLPJModal({ isOpen, onClose, proker }) {
  const { auditLPJ, uploadLPJ, currentUserName } = useStore();

  const [lpjFile, setLpjFile] = useState(null);
  const [realisasiDana, setRealisasiDana] = useState(proker?.realisasiDana || proker?.rab || 0);
  
  // 5 Parameter Nilai (0 - 20)
  const existingAudit = proker?.lpj?.auditDetails;
  const [rundownScore, setRundownScore] = useState(existingAudit?.rundownScore ?? 18);
  const [pesertaScore, setPesertaScore] = useState(existingAudit?.pesertaScore ?? 18);
  const [anggaranScore, setAnggaranScore] = useState(existingAudit?.anggaranScore ?? 18);
  const [slaScore, setSlaScore] = useState(existingAudit?.slaScore ?? (proker?.status === 'lpj_overdue' ? 10 : 20));
  const [outputScore, setOutputScore] = useState(existingAudit?.outputScore ?? 18);
  const [catatanDPM, setCatatanDPM] = useState(existingAudit?.catatanDPM || '');

  if (!isOpen || !proker) return null;

  const lpj = proker.lpj;
  const totalScore = Number(rundownScore) + Number(pesertaScore) + Number(anggaranScore) + Number(slaScore) + Number(outputScore);

  let predikat = 'A';
  let predikatBadge = 'bg-emerald-50 text-emerald-700 border-emerald-300';
  let predikatText = 'Sangat Berhasil';

  if (totalScore < 55) {
    predikat = 'D';
    predikatBadge = 'bg-red-50 text-red-700 border-red-300';
    predikatText = 'Kurang / Gagal';
  } else if (totalScore < 70) {
    predikat = 'C';
    predikatBadge = 'bg-amber-50 text-amber-700 border-amber-300';
    predikatText = 'Cukup / Evaluasi Khusus';
  } else if (totalScore < 85) {
    predikat = 'B';
    predikatBadge = 'bg-blue-50 text-blue-700 border-blue-300';
    predikatText = 'Berhasil';
  }

  // Hitung sisa waktu atau overdue LPJ
  const today = new Date();
  const deadlineDateObj = new Date(lpj?.deadlineDate || proker.endDate);
  const isOverdue = today.getTime() > deadlineDateObj.getTime();
  const diffDays = Math.abs(Math.ceil((today.getTime() - deadlineDateObj.getTime()) / (1000 * 60 * 60 * 24)));

  const handleUploadNewLPJ = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileInfo = {
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      };
      setLpjFile(fileInfo);
      uploadLPJ(proker.id, fileInfo);
    }
  };

  const handleSaveAudit = () => {
    auditLPJ(proker.id, {
      rundownScore,
      pesertaScore,
      anggaranScore,
      slaScore,
      outputScore,
      realisasiDana,
      catatanDPM: catatanDPM || 'Audit dan verifikasi LPJ disahkan resmi oleh DPM Fasilkom UMB.'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-[95vw] sm:max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded">
                DPM FASILKOM
              </span>
              <span className="text-[10px] sm:text-xs text-slate-600 font-medium truncate">Audit Mutu &amp; Laporan Pertanggungjawaban</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight mt-1 truncate">
              Audit Proker: {proker.title}
            </h3>
            <p className="text-[10px] sm:text-xs text-slate-600">
              Ormawa: <strong>{proker.ormawaId.toUpperCase()}</strong> • Pelaksanaan: {proker.startDate}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center transition shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 text-xs max-h-[calc(92vh-140px)]">
          {/* Status Waktu & Berkas LPJ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Status Deadline H+14 */}
            <div className={`p-4 rounded-2xl border ${isOverdue ? 'bg-red-50 border-red-200 text-red-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'}`}>
              <div className="flex items-center gap-2 mb-1">
                {isOverdue ? <AlertTriangle className="w-4 h-4 text-red-600" /> : <Clock className="w-4 h-4 text-emerald-600" />}
                <span className="font-bold text-xs uppercase tracking-wider">
                  {isOverdue ? 'STATUS: KETERLAMBATAN LPJ (> H+14)' : 'STATUS: TEPAT WAKTU (≤ H+14)'}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Tenggat H+14: <strong>{lpj?.deadlineDate || '14 hari pasca-acara'}</strong>
                {isOverdue && <span className="block text-red-700 font-bold mt-0.5">• Melewati batas waktu {diffDays} hari!</span>}
              </p>
            </div>

            {/* Status Berkas LPJ */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-slate-700 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900 truncate">
                    {lpj?.fileName || 'Belum Ada Berkas LPJ'}
                  </p>
                  <p className="text-[10px] text-slate-600">
                    {lpj?.fileName ? `Diunggah: ${lpj.uploadDate} (${lpj.fileSize})` : 'Ormawa belum mengunggah LPJ'}
                  </p>
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                <label className="text-slate-700 hover:text-slate-900 font-bold cursor-pointer inline-flex items-center gap-1 text-[11px]">
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>{lpj?.fileName ? 'Ganti File LPJ' : 'Unggah File LPJ'}</span>
                  <input type="file" accept=".pdf" onChange={handleUploadNewLPJ} className="hidden" />
                </label>
                {lpj?.fileName && (
                  <button 
                    onClick={() => alert(`Mengunduh file: ${lpj.fileName}`)}
                    className="text-slate-600 hover:text-slate-900 font-medium text-[11px]"
                  >
                    Unduh
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Realisasi Anggaran Keuangan */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-slate-600 font-bold uppercase tracking-wider block">
                  Realisasi Dana Keuangan vs RAB Awal:
                </span>
                <p className="text-xs text-slate-700 mt-0.5">
                  Alokasi RAB Awal: <strong>Rp {proker.rab.toLocaleString('id-ID')}</strong>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Realisasi (Rp):</span>
                <input
                  type="number"
                  value={realisasiDana}
                  onChange={(e) => setRealisasiDana(Number(e.target.value))}
                  className="w-40 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>
            {realisasiDana > proker.rab && (
              <p className="text-[11px] text-red-600 font-semibold mt-2">
                ⚠️ Pengeluaran melebihi anggaran RAB (Defisit: Rp {(realisasiDana - proker.rab).toLocaleString('id-ID')}). Harap periksa bukti nota!
              </p>
            )}
          </div>

          {/* MATRIKS PENILAIAN AUDIT DPM (5 PARAMETER) */}
          <div className="border border-slate-200 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h4 className="font-bold text-slate-900 text-xs">
                  5 Parameter Audit Keberhasilan Proker (DPM Fasilkom)
                </h4>
              </div>

              {/* Total Skor & Predikat */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">Total Skor:</span>
                <span className="text-sm font-extrabold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-xl">
                  {totalScore} / 100
                </span>
                <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-xl border ${predikatBadge}`}>
                  Predikat {predikat} ({predikatText})
                </span>
              </div>
            </div>

            {/* Slider / Range untuk Tiap Parameter */}
            <div className="space-y-3">
              {/* Parameter 1: Rundown */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-slate-800">
                    1. Kedisiplinan Waktu & Rundown Acara
                  </span>
                  <span className="font-bold text-slate-900">{rundownScore} / 20</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={rundownScore}
                  onChange={(e) => setRundownScore(Number(e.target.value))}
                  className="w-full accent-slate-900 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
                <p className="text-[10px] text-slate-600 mt-0.5">
                  Penilaian ketepatan waktu pembukaan, transisi sesi, dan ketiadaan pergeseran rundown berlebih.
                </p>
              </div>

              {/* Parameter 2: Target Peserta */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-slate-800">
                    2. Ketercapaian Target Peserta ({proker.realisasiPeserta || proker.targetPeserta}/{proker.targetPeserta} orang)
                  </span>
                  <span className="font-bold text-slate-900">{pesertaScore} / 20</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={pesertaScore}
                  onChange={(e) => setPesertaScore(Number(e.target.value))}
                  className="w-full accent-slate-900 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              {/* Parameter 3: Efisiensi Anggaran */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-slate-800">
                    3. Efisiensi & Kerapian Bukti Transaksi Keuangan
                  </span>
                  <span className="font-bold text-slate-900">{anggaranScore} / 20</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={anggaranScore}
                  onChange={(e) => setAnggaranScore(Number(e.target.value))}
                  className="w-full accent-slate-900 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              {/* Parameter 4: Kepatuhan SLA Proposal & LPJ */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-slate-800">
                    4. Kepatuhan Administratif & Deadline (SLA H-14 & H+14)
                  </span>
                  <span className="font-bold text-slate-900">{slaScore} / 20</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={slaScore}
                  onChange={(e) => setSlaScore(Number(e.target.value))}
                  className="w-full accent-slate-900 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              {/* Parameter 5: Kesesuaian Output */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-slate-800">
                    5. Kesesuaian Output Acara dengan Tupoksi Ormawa
                  </span>
                  <span className="font-bold text-slate-900">{outputScore} / 20</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={outputScore}
                  onChange={(e) => setOutputScore(Number(e.target.value))}
                  className="w-full accent-slate-900 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Catatan Resmi DPM */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">
              Catatan Resmi & Rekomendasi Pengawasan DPM:
            </label>
            <textarea
              rows={3}
              value={catatanDPM}
              onChange={(e) => setCatatanDPM(e.target.value)}
              placeholder=""
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition text-center cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSaveAudit}
            className="w-full sm:w-auto justify-center flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow transition active:scale-95 text-center cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>Sahkan Hasil Audit &amp; LPJ</span>
          </button>
        </div>
      </div>
    </div>
  );
}
