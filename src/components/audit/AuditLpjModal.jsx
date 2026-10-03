import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { 
  X, 
  UploadCloud, 
  AlertTriangle, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Users, 
  Coins, 
  FileCheck, 
  Target, 
  ShieldCheck, 
  Download,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import { formatRupiah, formatDateRange } from '@/utils/formatters';

// Konfigurasi visual 5 Pilar Audit
const PILLAR_CONFIGS = {
  rundown: {
    icon: Clock,
    title: 'Kedisiplinan Rundown',
    subtitle: 'Ketepatan waktu sesi acara & ketiadaan delay berlebih',
    badgeCls: 'bg-amber-50 text-amber-700 border-amber-200',
    iconCls: 'bg-amber-50 text-amber-600 border-amber-200',
    accentCls: 'accent-amber-500',
    activePresetCls: 'bg-amber-500 text-white shadow-2xs'
  },
  peserta: {
    icon: Users,
    title: 'Capaian Target Peserta',
    subtitle: 'Realisasi kehadiran peserta dibanding kuota proposal',
    badgeCls: 'bg-sky-50 text-sky-700 border-sky-200',
    iconCls: 'bg-sky-50 text-sky-600 border-sky-200',
    accentCls: 'accent-sky-500',
    activePresetCls: 'bg-sky-500 text-white shadow-2xs'
  },
  anggaran: {
    icon: Coins,
    title: 'Efisiensi Anggaran & Bukti Nota',
    subtitle: 'Kesesuaian realisasi dengan RAB & kelengkapan nota',
    badgeCls: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconCls: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    accentCls: 'accent-emerald-500',
    activePresetCls: 'bg-emerald-500 text-white shadow-2xs'
  },
  sla: {
    icon: FileCheck,
    title: 'Ketepatan Waktu Berkas',
    subtitle: 'Ketepatan waktu pengajuan Proposal (H-14) & LPJ (H+14)',
    badgeCls: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    iconCls: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    accentCls: 'accent-indigo-500',
    activePresetCls: 'bg-indigo-500 text-white shadow-2xs'
  },
  output: {
    icon: Target,
    title: 'Mutu Output & Dampak',
    subtitle: 'Kesesuaian hasil nyata kegiatan dengan visi ormawa',
    badgeCls: 'bg-rose-50 text-rose-700 border-rose-200',
    iconCls: 'bg-rose-50 text-rose-600 border-rose-200',
    accentCls: 'accent-rose-500',
    activePresetCls: 'bg-rose-500 text-white shadow-2xs'
  }
};

// Komponen Input Nilai Pilar Audit (0 - 20 Poin)
function ParameterRow({ 
  pillarKey,
  score, 
  onChange, 
  disabled = false,
  customSubtitle
}) {
  const cfg = PILLAR_CONFIGS[pillarKey] || PILLAR_CONFIGS.rundown;
  const Icon = cfg.icon;

  const getScoreBadge = (val) => {
    if (val === 20) return { label: 'Maksimal', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    if (val >= 16) return { label: 'Baik', cls: 'bg-blue-50 text-blue-700 border-blue-200' };
    if (val >= 12) return { label: 'Cukup', cls: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { label: 'Kurang', cls: 'bg-rose-50 text-rose-700 border-rose-200' };
  };

  const badge = getScoreBadge(score);
  const presets = [10, 15, 18, 20];

  return (
    <div className="p-3 sm:p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all space-y-2.5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 shadow-2xs ${cfg.iconCls}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-900 truncate">{cfg.title}</h4>
            <p className="text-[10px] text-slate-500 truncate">{customSubtitle || cfg.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.cls}`}>
            {badge.label}
          </span>
          <span className="text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg tabular-nums">
            {score} / 20
          </span>
        </div>
      </div>

      <div className="space-y-2 pt-0.5">
        <input
          type="range"
          min="0"
          max="20"
          step="1"
          value={score}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className={`w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer ${cfg.accentCls} disabled:opacity-50`}
        />

        {!disabled && (
          <div className="flex items-center justify-between pt-0.5">
            <span className="text-[10px] font-medium text-slate-400">Pilih Cepat:</span>
            <div className="flex items-center gap-1">
              {presets.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => onChange(val)}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition cursor-pointer ${
                    score === val 
                      ? cfg.activePresetCls 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AuditLPJModal({ isOpen, onClose, proker }) {
  const { auditLPJ, uploadLPJ, ormawas, currentUser } = useStore(useShallow(state => ({ 
    auditLPJ: state.auditLPJ, 
    uploadLPJ: state.uploadLPJ,
    ormawas: state.ormawas,
    currentUser: state.currentUser
  })));

  const isGuest = currentUser?.role === 'guest';
  const ormawa = ormawas?.find(o => o.id === proker?.ormawaId);

  const initialRealisasi = proker?.realisasiDana || proker?.rab || 0;
  const [realisasiDana, setRealisasiDana] = useState(
    initialRealisasi ? Number(initialRealisasi).toLocaleString('id-ID') : '0'
  );

  useEffect(() => {
    if (proker) {
      const initial = proker.realisasiDana || proker.rab || 0;
      setRealisasiDana(initial ? Number(initial).toLocaleString('id-ID') : '0');
    }
  }, [proker]);

  const numericRealisasi = typeof realisasiDana === 'string'
    ? Number(realisasiDana.replace(/\D/g, '')) || 0
    : Number(realisasiDana) || 0;

  const handleRealisasiChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    if (!rawValue) {
      setRealisasiDana('');
    } else {
      setRealisasiDana(Number(rawValue).toLocaleString('id-ID'));
    }
  };

  const handleSetPercentageRealisasi = (pct) => {
    const calculated = Math.round((rabAwal * pct) / 100);
    setRealisasiDana(calculated.toLocaleString('id-ID'));
  };
  
  // 5 Parameter Nilai (0 - 20)
  const existingAudit = proker?.lpj?.auditDetails;
  const [rundownScore, setRundownScore] = useState(existingAudit?.rundownScore ?? 18);
  const [pesertaScore, setPesertaScore] = useState(existingAudit?.pesertaScore ?? 18);
  const [anggaranScore, setAnggaranScore] = useState(existingAudit?.anggaranScore ?? 18);
  const [slaScore, setSlaScore] = useState(existingAudit?.slaScore ?? (proker?.status === 'lpj_overdue' ? 10 : 20));
  const [outputScore, setOutputScore] = useState(existingAudit?.outputScore ?? 18);
  const [catatanDPM, setCatatanDPM] = useState(existingAudit?.catatanDPM || '');

  // Reset or preset all scores
  const handleSetAllScores = (val) => {
    setRundownScore(val);
    setPesertaScore(val);
    setAnggaranScore(val);
    setSlaScore(val);
    setOutputScore(val);
  };

  if (!isOpen || !proker) return null;

  const lpj = proker.lpj;
  const totalScore = Number(rundownScore) + Number(pesertaScore) + Number(anggaranScore) + Number(slaScore) + Number(outputScore);

  // Evaluasi Predikat & Skema Warna
  let predikat = 'A';
  let predikatBadge = 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-500/10';
  let predikatBar = 'bg-emerald-500';
  let predikatText = 'Sangat Baik';
  let heroScoreBg = 'bg-gradient-to-br from-slate-900 to-slate-800 border-emerald-500/30';

  if (totalScore < 55) {
    predikat = 'D';
    predikatBadge = 'bg-rose-50 text-rose-700 border-rose-300 ring-2 ring-rose-500/10';
    predikatBar = 'bg-rose-500';
    predikatText = 'Perlu Perbaikan';
    heroScoreBg = 'bg-gradient-to-br from-slate-900 to-slate-800 border-rose-500/30';
  } else if (totalScore < 70) {
    predikat = 'C';
    predikatBadge = 'bg-amber-50 text-amber-700 border-amber-300 ring-2 ring-amber-500/10';
    predikatBar = 'bg-amber-500';
    predikatText = 'Cukup (Perlu Evaluasi)';
    heroScoreBg = 'bg-gradient-to-br from-slate-900 to-slate-800 border-amber-500/30';
  } else if (totalScore < 85) {
    predikat = 'B';
    predikatBadge = 'bg-blue-50 text-blue-700 border-blue-300 ring-2 ring-blue-500/10';
    predikatBar = 'bg-blue-500';
    predikatText = 'Baik';
    heroScoreBg = 'bg-gradient-to-br from-slate-900 to-slate-800 border-blue-500/30';
  }

  // Hitung selisih keuangan
  const rabAwal = proker.rab || 0;
  const selisihAnggaran = rabAwal - numericRealisasi;
  const isDefisit = numericRealisasi > rabAwal;
  const persentaseSerapan = rabAwal > 0 ? Math.round((numericRealisasi / rabAwal) * 100) : 0;

  // Hitung status deadline H+14
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
      uploadLPJ(proker.id, fileInfo);
    }
  };

  const handleDownloadLPJ = () => {
    if (lpj?.fileName) {
      const blob = new Blob([
        `LEMBAR AUDIT LPJ RESMI DPM FASILKOM\n\n` +
        `Program Kerja: ${proker.title}\n` +
        `Ormawa: ${ormawa?.name || proker.ormawaId.toUpperCase()}\n` +
        `Pelaksanaan: ${formatDateRange(proker.startDate, proker.endDate)}\n` +
        `Total Skor: ${totalScore} / 100 (Predikat ${predikat} - ${predikatText})\n` +
        `Realisasi Anggaran: Rp ${numericRealisasi.toLocaleString('id-ID')} (RAB: Rp ${rabAwal.toLocaleString('id-ID')})\n` +
        `Berkas: ${lpj.fileName}\n` +
        `Catatan DPM: ${catatanDPM || '-'}\n`
      ], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = lpj.fileName.endsWith('.pdf') ? lpj.fileName : `${lpj.fileName}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleSaveAudit = () => {
    auditLPJ(proker.id, {
      rundownScore,
      pesertaScore,
      anggaranScore,
      slaScore,
      outputScore,
      realisasiDana: numericRealisasi,
      catatanDPM: catatanDPM || 'Audit dan verifikasi LPJ disahkan resmi oleh DPM Fasilkom UMB.'
    });
    onClose();
  };

  // Preset rekomendasi cepat
  const recommendationPresets = [
    '✅ LPJ Disetujui Penuh & Tertib',
    '⚠️ Catatan: Lengkapi Kuitansi Fisik',
    '⏱️ Evaluasi: Kedisiplinan Rundown',
    '📈 Rekomendasi: Tingkatkan Partisipasi'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-50 w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden max-h-[94vh] flex flex-col">
        {/* Header Modal */}
        <div className="px-5 sm:px-6 py-3.5 bg-white border-b border-slate-100 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/70">
                  DPM FASILKOM
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Penilaian &amp; Pengesahan Audit LPJ
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight truncate mt-0.5">
                {proker.title}
              </h3>
              <p className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5 flex-wrap">
                <span className="font-semibold text-slate-700">{ormawa?.name || proker.ormawaId.toUpperCase()}</span>
                <span>•</span>
                <span>{formatDateRange(proker.startDate, proker.endDate)}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 flex items-center justify-center transition shrink-0 cursor-pointer"
            title="Tutup Form"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body (Scrollable) */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs max-h-[calc(94vh-130px)]">
          {/* Top Hero Banner: Score Summary & SLA status */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl text-white flex flex-col items-center justify-center shrink-0 shadow-sm border ${heroScoreBg}`}>
                <span className="text-xl sm:text-2xl font-black tabular-nums leading-none tracking-tight">
                  {totalScore}
                </span>
                <span className="text-[9px] text-slate-400 font-bold uppercase mt-1">/ 100</span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-black px-2.5 py-0.5 rounded-xl border ${predikatBadge}`}>
                    Predikat {predikat}
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {predikatText}
                  </span>
                </div>
                <div className="w-48 sm:w-60 bg-slate-100 h-2 rounded-full overflow-hidden mt-2 border border-slate-200/70">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${predikatBar}`}
                    style={{ width: `${Math.min(100, Math.max(0, totalScore))}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Status Deadline Kepatuhan H+14 */}
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 self-start md:self-auto">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isOverdue ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                {isOverdue ? <AlertTriangle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
              </div>
              <div className="min-w-0 text-[11px]">
                <span className="font-bold text-slate-800 block">
                  {isOverdue ? 'Status LPJ: Terlambat' : 'Status LPJ: Tepat Waktu'}
                </span>
                <span className="text-slate-500">
                  Tenggat: {lpj?.deadlineDate || 'H+14 pasca-acara'}
                  {isOverdue && <strong className="text-rose-600 ml-1">(+{diffDays} hari)</strong>}
                </span>
              </div>
            </div>
          </div>

          {/* 2-Column Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* Kolom Kiri: Berkas, Keuangan & Rekomendasi (5 Kolom) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Card 1: Dokumen Berkas LPJ */}
              <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-xs">Dokumen Berkas LPJ</h4>
                  </div>
                  {lpj?.fileName ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Terlampir
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      Belum Ada
                    </span>
                  )}
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <p className="font-bold text-slate-900 text-xs truncate" title={lpj?.fileName}>
                    {lpj?.fileName || 'Belum Ada Berkas LPJ'}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {lpj?.fileName ? `Diunggah: ${lpj.uploadDate} • Ukuran: ${lpj.fileSize}` : 'Ormawa belum melampirkan berkas LPJ resmi'}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-0.5">
                  {!isGuest && (
                    <label className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold text-xs rounded-xl transition cursor-pointer active:scale-95 text-center">
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>{lpj?.fileName ? 'Ganti LPJ' : 'Unggah LPJ'}</span>
                      <input type="file" accept=".pdf" onChange={handleUploadNewLPJ} className="hidden" />
                    </label>
                  )}
                  {lpj?.fileName && (
                    <button
                      type="button"
                      onClick={handleDownloadLPJ}
                      className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                      title="Unduh Berkas LPJ"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                      <span>Unduh</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Card 2: Akuntabilitas Keuangan vs RAB */}
              <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/60">
                      <Coins className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-xs">Realisasi Anggaran</h4>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isDefisit 
                      ? 'bg-rose-50 text-rose-700 border-rose-200' 
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {isDefisit ? 'Defisit' : 'Hemat / Sesuai'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                    <span className="text-[10px] text-slate-400 font-medium block">RAB Awal</span>
                    <strong className="text-slate-900 font-extrabold text-xs block mt-0.5 truncate">
                      {formatRupiah(rabAwal)}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                    <span className="text-[10px] text-slate-400 font-medium block">Realisasi Kas</span>
                    <strong className="text-blue-700 font-extrabold text-xs block mt-0.5 truncate">
                      {formatRupiah(numericRealisasi)}
                    </strong>
                  </div>
                </div>

                {/* Status Selisih */}
                <div className={`p-2 rounded-xl text-[11px] font-semibold flex items-center justify-between border ${
                  isDefisit 
                    ? 'bg-rose-50 text-rose-700 border-rose-100' 
                    : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                }`}>
                  <span className="flex items-center gap-1">
                    {isDefisit ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    <span>{isDefisit ? 'Defisit Anggaran:' : 'Efisiensi / Sisa Dana:'}</span>
                  </span>
                  <strong className="font-bold">
                    {isDefisit ? `+${formatRupiah(Math.abs(selisihAnggaran))}` : formatRupiah(selisihAnggaran)}
                  </strong>
                </div>

                {/* Input Realisasi Kas */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-700">
                      Input Realisasi Kas Riil:
                    </label>
                    {!isGuest && rabAwal > 0 && (
                      <div className="flex items-center gap-1">
                        {[100, 90, 80].map(pct => (
                          <button
                            key={pct}
                            type="button"
                            onClick={() => handleSetPercentageRealisasi(pct)}
                            className="px-1.5 py-0.5 text-[9px] font-bold bg-slate-100 hover:bg-blue-50 hover:text-blue-700 rounded transition cursor-pointer text-slate-600"
                          >
                            {pct}%
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {isGuest ? (
                    <div className="p-2.5 bg-slate-100 rounded-xl font-bold text-slate-800">
                      {formatRupiah(numericRealisasi)}
                    </div>
                  ) : (
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={realisasiDana}
                        onChange={handleRealisasiChange}
                        placeholder="0"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-2xs"
                      />
                    </div>
                  )}
                </div>

                {/* Progress bar serapan */}
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium mb-1">
                    <span>Tingkat Serapan</span>
                    <span className="font-bold text-slate-800">{persentaseSerapan}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${isDefisit ? 'bg-rose-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min(100, persentaseSerapan)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Card 3: Rekomendasi Pengawasan DPM */}
              <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-slate-900 text-xs block">
                    Catatan &amp; Arahan Evaluasi
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">Catatan DPM</span>
                </div>

                {!isGuest && (
                  <div className="flex flex-wrap gap-1">
                    {recommendationPresets.map((rec, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCatatanDPM(rec)}
                        className="text-[10px] font-medium bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-600 px-2 py-1 rounded-lg border border-slate-200/70 transition cursor-pointer text-left"
                      >
                        {rec}
                      </button>
                    ))}
                  </div>
                )}

                <textarea
                  rows={3}
                  value={catatanDPM}
                  onChange={(e) => setCatatanDPM(e.target.value)}
                  readOnly={isGuest}
                  disabled={isGuest}
                  placeholder={isGuest ? 'Tidak ada catatan DPM.' : 'Catatan hasil audit dan evaluasi proker ormawa...'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-none disabled:opacity-80"
                />
              </div>

            </div>

            {/* Kolom Kanan: 5 Pilar Mutu Audit DPM (7 Kolom) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">5 Pilar Penilaian Mutu</h4>
                  <p className="text-[11px] text-slate-500">Masing-masing pilar berbobot maksimal 20 poin</p>
                </div>
                {!isGuest && (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleSetAllScores(20)}
                      className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer"
                    >
                      Maks. 100
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetAllScores(18)}
                      className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition cursor-pointer"
                    >
                      Baik (90)
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2.5">
                {/* Pilar 1: Rundown */}
                <ParameterRow
                  pillarKey="rundown"
                  score={rundownScore}
                  onChange={setRundownScore}
                  disabled={isGuest}
                />

                {/* Pilar 2: Peserta */}
                <ParameterRow
                  pillarKey="peserta"
                  score={pesertaScore}
                  onChange={setPesertaScore}
                  disabled={isGuest}
                  customSubtitle={`Realisasi: ${proker.realisasiPeserta || proker.targetPeserta} dari ${proker.targetPeserta} peserta`}
                />

                {/* Pilar 3: Efisiensi Anggaran */}
                <ParameterRow
                  pillarKey="anggaran"
                  score={anggaranScore}
                  onChange={setAnggaranScore}
                  disabled={isGuest}
                />

                {/* Pilar 4: Kepatuhan SLA Berkas */}
                <ParameterRow
                  pillarKey="sla"
                  score={slaScore}
                  onChange={setSlaScore}
                  disabled={isGuest}
                />

                {/* Pilar 5: Mutu Output */}
                <ParameterRow
                  pillarKey="output"
                  score={outputScore}
                  onChange={setOutputScore}
                  disabled={isGuest}
                />
              </div>
            </div>

          </div>
        </div>

        {/* Footer Modal */}
        <div className="px-5 sm:px-6 py-3.5 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 font-medium">
            Akumulasi: <strong className="text-slate-900 font-extrabold">{totalScore} / 100</strong> • Predikat: <strong className="text-slate-900 font-extrabold">{predikat} ({predikatText})</strong>
          </div>

          <div className="flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition cursor-pointer text-center"
            >
              Batal
            </button>
            {!isGuest && (
              <button
                type="button"
                onClick={handleSaveAudit}
                className="flex-1 sm:flex-initial px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Simpan &amp; Sahkan Audit</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
