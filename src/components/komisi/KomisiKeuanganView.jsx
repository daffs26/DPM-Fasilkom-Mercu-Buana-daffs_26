import React, { useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { 
  Coins, 
  TrendingUp, 
  Lightbulb, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Filter, 
  ArrowUpRight,
  ShieldAlert,
  Sparkles,
  PieChart,
  HelpCircle,
  Target,
  Calendar,
  FileText
} from 'lucide-react';
import { canManageOrmawaBudget } from '@/utils/permissions';
import { formatRupiah } from '@/utils/formatters';
import DropdownSelect from '@/components/ui/dropdown-select';

function getOrmawaColorConfig(ormawaId) {
  switch (ormawaId) {
    case 'bem':
      return {
        bar: 'bg-sky-500',
        badge: 'bg-sky-50 text-sky-800 border-sky-200/90'
      };
    case 'himti':
      return {
        bar: 'bg-blue-600',
        badge: 'bg-blue-50 text-blue-900 border-blue-200/90'
      };
    case 'himsisfo':
      return {
        bar: 'bg-[#9A7B56]',
        badge: 'bg-[#FBF9F5] text-[#785E43] border-[#E8DEC8]'
      };
    case 'dpm':
    default:
      return {
        bar: 'bg-amber-500',
        badge: 'bg-amber-50 text-amber-800 border-amber-200/90'
      };
  }
}

function getPriorityBadgeStyle(priority) {
  switch (priority) {
    case 'Tinggi':
      return 'bg-rose-50 text-rose-700 border-rose-200/80';
    case 'Penting':
      return 'bg-amber-50 text-amber-700 border-amber-200/80';
    case 'Sedang':
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200/80';
  }
}

function getStatusStyle(status) {
  switch (status) {
    case 'Diterapkan':
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100',
        dot: 'bg-emerald-500'
      };
    case 'Sedang Berjalan':
      return {
        bg: 'bg-blue-50 text-blue-700 border-blue-200/80 hover:bg-blue-100',
        dot: 'bg-blue-500'
      };
    case 'Menunggu Tindak Lanjut':
    default:
      return {
        bg: 'bg-amber-50 text-amber-700 border-amber-200/80 hover:bg-amber-100',
        dot: 'bg-amber-500'
      };
  }
}

export default function KomisiKeuanganView() {
  const { ormawas, budgetTransactions, currentUser } = useStore(useShallow(state => ({
    ormawas: state.ormawas,
    budgetTransactions: state.budgetTransactions,
    currentUser: state.currentUser
  })));

  const canManage = canManageOrmawaBudget(currentUser?.role);
  const [selectedOrmawa, setSelectedOrmawa] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Rekomendasi Anggaran (State lokal dengan preset realistis parlemen kampus)
  const [recommendations, setRecommendations] = useState([
    {
      id: 'rec-1',
      ormawaId: 'bem',
      ormawaName: 'BEM FASILKOM UMB',
      title: 'Optimalisasi Pos Konsumsi Proker Seminar',
      category: 'Efisiensi Anggaran',
      priority: 'Tinggi',
      status: 'Menunggu Tindak Lanjut',
      date: '05 Okt 2026',
      author: 'Komisi Keuangan DPM',
      content: 'Berdasarkan telaah RAB proker mendatang, estimasi alokasi konsumsi mencapai 45% dari total anggaran. Disarankan melakukan negosiasi katering paket mahasiswa atau mencari sponsor konsumsi agar dana dapat dialihkan ke publikasi dan sertifikasi peserta.',
      impact: 'Potensi penghematan dana hingga Rp 2.500.000 untuk dialokasikan ke pos proker prioritas.'
    },
    {
      id: 'rec-2',
      ormawaId: 'himti',
      ormawaName: 'HIMTI UMB',
      title: 'Realisasi Serapan Dana Triwulan Pertama',
      category: 'Percepatan Realisasi',
      priority: 'Sedang',
      status: 'Diterapkan',
      date: '02 Okt 2026',
      author: 'Komisi Keuangan DPM',
      content: 'Tingkat serapan dana HIMTI baru mencapai 18% dari pagu semester. Direkomendasikan segera mengajukan proposal proker Workshop Tech agar pencairan termin 2 tidak tertunda.',
      impact: 'Menjaga kelancaran siklus pendanaan dan kepatuhan timeline kalender kegiatan.'
    },
    {
      id: 'rec-3',
      ormawaId: 'himsisfo',
      ormawaName: 'HIMSISFO UMB',
      title: 'Standardisasi Format Nota & Bukti Kas Fisik',
      category: 'Kepatuhan SPJ',
      priority: 'Penting',
      status: 'Sedang Berjalan',
      date: '28 Sep 2026',
      author: 'Komisi Keuangan DPM',
      content: 'Penggunaan bukti struk digital disarankan dicetak dan ditempelkan pada lembar rekap kas fisik disertai stempel toko resmi untuk mempermudah validasi audit LPJ akhir periode.',
      impact: 'Mencegah potensi temuan administratif saat verifikasi LPJ bersama Dekanat.'
    }
  ]);

  // Form input state
  const [newRec, setNewRec] = useState({
    ormawaId: 'bem',
    title: '',
    category: 'Efisiensi Anggaran',
    priority: 'Sedang',
    content: '',
    impact: ''
  });

  // Perhitungan agregat
  const activeOrmawaObj = useMemo(() => {
    if (selectedOrmawa === 'all') return null;
    return ormawas.find(o => o.id === selectedOrmawa) || null;
  }, [ormawas, selectedOrmawa]);

  const totalPagu = useMemo(() => {
    if (activeOrmawaObj) return Number(activeOrmawaObj.paguAnggaran) || 0;
    return ormawas.reduce((acc, o) => acc + (Number(o.paguAnggaran) || 0), 0);
  }, [ormawas, activeOrmawaObj]);

  const totalSerapan = useMemo(() => {
    if (activeOrmawaObj) return Number(activeOrmawaObj.serapanAnggaran) || 0;
    return ormawas.reduce((acc, o) => acc + (Number(o.serapanAnggaran) || 0), 0);
  }, [ormawas, activeOrmawaObj]);

  const rasioSerapan = totalPagu > 0 ? ((totalSerapan / totalPagu) * 100).toFixed(1) : 0;

  const filteredRecs = useMemo(() => {
    if (selectedOrmawa === 'all') return recommendations;
    return recommendations.filter(r => r.ormawaId === selectedOrmawa);
  }, [recommendations, selectedOrmawa]);

  const completedRecsCount = useMemo(() => {
    return filteredRecs.filter(r => r.status === 'Diterapkan').length;
  }, [filteredRecs]);

  const ormawaFilterOptions = useMemo(() => [
    { value: 'all', label: 'Semua Ormawa' },
    ...ormawas.map(o => ({
      value: o.id,
      label: o.shortName || o.name
    }))
  ], [ormawas]);

  const ormawaFormOptions = useMemo(() => ormawas.map(o => ({
    value: o.id,
    label: o.name
  })), [ormawas]);

  const categoryOptions = [
    { value: 'Pagu & Alokasi Anggaran', label: 'Pagu & Alokasi Anggaran' },
    { value: 'Serapan & Realisasi Dana', label: 'Serapan & Realisasi Dana' },
    { value: 'Efisiensi Pos Biaya', label: 'Efisiensi Pos Biaya' },
    { value: 'Kepatuhan SPJ & Nota Fisik', label: 'Kepatuhan SPJ & Nota Fisik' },
    { value: 'Lainnya', label: 'Lainnya' }
  ];

  const priorityOptions = [
    { value: 'Sedang', label: 'Sedang' },
    { value: 'Penting', label: 'Penting' },
    { value: 'Tinggi', label: 'Tinggi' }
  ];

  const handleCycleStatus = (recId) => {
    setRecommendations(prev => prev.map(item => {
      if (item.id !== recId) return item;
      const nextStatus = item.status === 'Menunggu Tindak Lanjut'
        ? 'Sedang Berjalan'
        : item.status === 'Sedang Berjalan'
          ? 'Diterapkan'
          : 'Menunggu Tindak Lanjut';
      return { ...item, status: nextStatus };
    }));
  };

  const handleAddRec = (e) => {
    e.preventDefault();
    if (!newRec.title.trim() || !newRec.content.trim()) return;

    const targetOrm = ormawas.find(o => o.id === newRec.ormawaId) || { name: 'Ormawa' };
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

    const item = {
      id: `rec-${Date.now()}`,
      ormawaId: newRec.ormawaId,
      ormawaName: targetOrm.shortName || targetOrm.name,
      title: newRec.title,
      category: newRec.category,
      priority: newRec.priority,
      status: 'Menunggu Tindak Lanjut',
      date: dateFormatted,
      author: currentUser?.name || 'Komisi Keuangan DPM',
      content: newRec.content,
      impact: newRec.impact || ''
    };

    setRecommendations([item, ...recommendations]);
    setNewRec({
      ormawaId: 'bem',
      title: '',
      category: 'Efisiensi Pos Biaya',
      priority: 'Sedang',
      content: '',
      impact: ''
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* 1. Header Banner Bersih & Mewah */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-2xs relative overflow-hidden">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-50/60 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              <p className="text-xs font-bold text-indigo-900 tracking-wide">
                Pengawasan Anggaran &amp; Rekomendasi Finansial
              </p>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Pusat Catatan &amp; Efisiensi Keuangan
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              Kanal resmi Komisi Keuangan DPM FASILKOM untuk memantau serapan anggaran, menganalisis pos pembiayaan ormawa, dan menerbitkan rekomendasi langkah perbaikan finansial.
            </p>
          </div>

          {canManage && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[42px] h-10.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition active:scale-95 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Catatan Anggaran Ormawa</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Metric Cards: 4 Kotak Rapi dan Seimbang */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Card 1: Total Anggaran */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between h-full space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span className="truncate max-w-[170px]">{activeOrmawaObj ? `Pagu ${activeOrmawaObj.shortName}` : 'Total Pagu Anggaran'}</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{formatRupiah(totalPagu)}</p>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
              {activeOrmawaObj 
                ? `Alokasi resmi fakultas untuk ${activeOrmawaObj.shortName}` 
                : 'Akumulasi jatah dana fakultas seluruh ormawa'}
            </p>
          </div>
        </div>

        {/* Card 2: Serapan Anggaran */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between h-full space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span className="truncate max-w-[170px]">{activeOrmawaObj ? `Serapan ${activeOrmawaObj.shortName}` : 'Realisasi Serapan Dana'}</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-black text-emerald-600 tracking-tight">{formatRupiah(totalSerapan)}</p>
            <p className="text-[11px] text-emerald-700 font-semibold mt-0.5 leading-snug">
              {totalPagu > 0 
                ? `${rasioSerapan}% dari total alokasi pagu anggaran` 
                : 'Belum ada realisasi pengeluaran tercatat'}
            </p>
          </div>
        </div>

        {/* Card 3: Evaluasi & Catatan DPM */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between h-full space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span className="truncate max-w-[170px]">{activeOrmawaObj ? `Catatan ${activeOrmawaObj.shortName}` : 'Catatan Evaluasi DPM'}</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Lightbulb className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {filteredRecs.length} Masukan
            </p>
            <p className="text-[11px] text-indigo-700 font-semibold mt-0.5 leading-snug">
              Arahan efisiensi &amp; telaah pos pembiayaan
            </p>
          </div>
        </div>

        {/* Card 4: Saran Diterapkan */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between h-full space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span className="truncate max-w-[170px]">Rekomendasi Terlaksana</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {completedRecsCount} Selesai
            </p>
            <p className="text-[11px] text-amber-700 font-semibold mt-0.5 leading-snug">
              {completedRecsCount > 0 
                ? 'Ormawa berhasil menyesuaikan anggaran' 
                : 'Menunggu penyesuaian oleh pengurus ormawa'}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Filter & Kontainer Daftar Catatan */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-2xs p-4 sm:p-6 space-y-4 sm:space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 sm:pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900">Catatan &amp; Evaluasi Anggaran Ormawa</h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/70">
                {filteredRecs.length} Catatan
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Catatan telaah dan hal-hal penting yang perlu diperhatikan oleh Ormawa terpilih</p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="w-full sm:w-56">
              <DropdownSelect
                value={selectedOrmawa}
                onChange={setSelectedOrmawa}
                options={ormawaFilterOptions}
                placeholder="Pilih Ormawa"
                triggerClassName="min-h-[42px] h-10.5 py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300 w-full"
                contentClassName="w-full sm:w-56 z-50 shadow-xl"
              />
            </div>
          </div>
        </div>

        {/* 4. Grid Kartu Evaluasi: Estetik, Rapi, Tanpa Badge Menumpuk */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredRecs.map((rec) => {
            const targetOrm = ormawas.find(o => o.id === rec.ormawaId);
            const ormColor = getOrmawaColorConfig(rec.ormawaId);
            const statusStyle = getStatusStyle(rec.status);
            const priorityStyle = getPriorityBadgeStyle(rec.priority);

            return (
              <div 
                key={rec.id} 
                className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
              >
                {/* Garis Aksen Warna Ormawa yang Rapi */}
                <div className={`h-1.5 w-full ${ormColor.bar}`} />

                <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 gap-4">
                  {/* Bagian Atas: Metadata, Judul, Uraian, dan Arahan Tindak Lanjut */}
                  <div className="space-y-3">
                    {/* Header Row: Identitas Ormawa & Kategori di Kiri, Status Badge di Kanan */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                        {/* Pill Ormawa dengan Logo */}
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-[11px] font-bold border border-slate-200/70 shrink-0">
                          <img 
                            src={targetOrm?.logo || '/logos/logo-dpm.png'} 
                            alt={rec.ormawaName} 
                            className="w-3.5 h-3.5 object-contain" 
                          />
                          <span className="truncate max-w-[120px]">{targetOrm?.shortName || rec.ormawaName}</span>
                        </span>

                        {/* Kategori Tag */}
                        <span className="text-[11px] font-semibold text-slate-400 font-mono tracking-tight">
                          • {rec.category}
                        </span>
                      </div>

                      {/* Status Badge: Klik untuk mengganti status jika memiliki wewenang */}
                      {canManage ? (
                        <button
                          type="button"
                          onClick={() => handleCycleStatus(rec.id)}
                          title="Klik untuk mengubah status: Menunggu Tindak Lanjut → Sedang Berjalan → Diterapkan"
                          className={`inline-flex items-center gap-1.5 min-h-[30px] px-2.5 py-1 rounded-full text-[11px] font-bold border transition cursor-pointer active:scale-95 shrink-0 ${statusStyle.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                          <span>{rec.status}</span>
                        </button>
                      ) : (
                        <span className={`inline-flex items-center gap-1.5 min-h-[30px] px-2.5 py-1 rounded-full text-[11px] font-bold border shrink-0 ${statusStyle.bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                          <span>{rec.status}</span>
                        </span>
                      )}
                    </div>

                    {/* Judul Catatan */}
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug group-hover:text-indigo-600 transition-colors">
                      {rec.title}
                    </h3>

                    {/* Uraian Pokok Masalah / Catatan */}
                    <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">
                      {rec.content}
                    </p>

                    {/* Box Khusus: Tindak Lanjut yang Harus Dilakukan */}
                    {rec.impact && (
                      <div className="p-3 rounded-xl bg-slate-50/90 border border-slate-200/70 text-xs sm:text-[13px] space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-700 font-bold text-[10px] uppercase tracking-wider">
                          <Target className="w-3 h-3 text-indigo-600 shrink-0" />
                          <span>Arahan Tindak Lanjut</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                          {rec.impact}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer Row: Tanggal di Kiri, Tingkat Prioritas di Kanan (Rapi, Sejajar, Tidak Pernah Patah) */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-400 font-medium text-xs">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{rec.date}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] text-slate-400 font-medium">Prioritas:</span>
                      <span className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md border ${priorityStyle}`}>
                        {rec.priority}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Catat Evaluasi / Hal Penting Ormawa (Anti-Fatigue UX) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Header Modal */}
            <div className="flex items-center justify-between p-4 sm:p-5 pb-3.5 border-b border-slate-100 bg-slate-50/60 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <Lightbulb className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">Catat Evaluasi Anggaran Ormawa</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Berikan arahan atau rekomendasi keuangan yang mudah dipahami Ormawa</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 min-h-[36px] min-w-[36px] flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer active:scale-95 transition"
                aria-label="Tutup"
              >
                ✕
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleAddRec} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-sm flex-1">
                {/* 1. Target Ormawa */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Target Ormawa</span>
                    </label>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200/60">Wajib</span>
                  </div>
                  <DropdownSelect
                    value={newRec.ormawaId}
                    onChange={(val) => setNewRec(prev => ({ ...prev, ormawaId: val }))}
                    options={ormawaFormOptions}
                    placeholder="Pilih Ormawa yang ingin dicatat"
                    triggerClassName="min-h-[44px] h-11 py-2 px-3 rounded-xl text-xs sm:text-sm bg-slate-50 hover:bg-white border-slate-200/90 w-full font-medium"
                    contentClassName="w-full z-50 shadow-xl"
                  />
                </div>

                {/* 2. Judul Catatan */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-slate-800 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Pokok Catatan / Topik Evaluasi</span>
                    </label>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200/60">Wajib</span>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Misal: Penyesuaian Pos Konsumsi RAB Termin 1"
                    value={newRec.title}
                    onChange={(e) => setNewRec({ ...newRec, title: e.target.value })}
                    className="w-full min-h-[44px] h-11 px-3.5 rounded-xl border border-slate-200/90 bg-slate-50 hover:bg-white focus:bg-white font-medium text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition shadow-2xs"
                  />
                </div>

                {/* 3. Kategori & Prioritas (Segmented Buttons for Zero Fatigue) */}
                <div className="space-y-3.5 p-3 rounded-2xl bg-slate-50/70 border border-slate-200/70">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1.5 text-xs">
                      Kategori Evaluasi
                    </label>
                    <DropdownSelect
                      value={newRec.category}
                      onChange={(val) => setNewRec(prev => ({ ...prev, category: val }))}
                      options={categoryOptions}
                      placeholder="Pilih Kategori"
                      triggerClassName="min-h-[42px] h-10.5 py-2 px-3 rounded-xl text-xs sm:text-sm bg-white border-slate-200 w-full font-medium"
                      contentClassName="w-full z-50 shadow-xl"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1.5 text-xs">
                      Tingkat Urgensi / Prioritas Tindak Lanjut
                    </label>
                    {/* Segmented Buttons: Menghilangkan dropdown fatigue */}
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { val: 'Sedang', label: 'Sedang', color: 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-2 ring-emerald-400/20' },
                        { val: 'Penting', label: 'Penting', color: 'bg-amber-50 text-amber-800 border-amber-300 ring-2 ring-amber-400/20' },
                        { val: 'Tinggi', label: 'Tinggi', color: 'bg-rose-50 text-rose-800 border-rose-300 ring-2 ring-rose-400/20' }
                      ].map(p => {
                        const isSelected = newRec.priority === p.val;
                        return (
                          <button
                            key={p.val}
                            type="button"
                            onClick={() => setNewRec(prev => ({ ...prev, priority: p.val }))}
                            className={`min-h-[38px] py-1.5 px-2 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 ${
                              isSelected 
                                ? `${p.color} font-black shadow-2xs` 
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-current' : 'bg-slate-400'}`} />
                            <span>{p.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 4. Uraian Catatan */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-slate-800 flex items-center gap-1.5">
                      <span>Uraian Penjelasan Evaluasi</span>
                    </label>
                    <span className="text-[10px] text-slate-400">{newRec.content.length} karakter</span>
                  </div>
                  <textarea
                    rows={3}
                    required
                    placeholder="Uraikan temuan keuangan atau catatan audit dengan bahasa yang jelas dan konstruktif bagi Ormawa..."
                    value={newRec.content}
                    onChange={(e) => setNewRec({ ...newRec, content: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200/90 bg-slate-50 hover:bg-white focus:bg-white font-medium text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition shadow-2xs"
                  />
                </div>

                {/* 5. Tindak Lanjut / Solusi (Opsional) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Rekomendasi Tindak Lanjut / Solusi</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-semibold bg-slate-100 px-2 py-0.5 rounded-full">Opsional</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Misal: Negosiasi paket katering mahasiswa atau submit revisi sebelum termin 2"
                    value={newRec.impact}
                    onChange={(e) => setNewRec({ ...newRec, impact: e.target.value })}
                    className="w-full min-h-[44px] h-11 px-3.5 rounded-xl border border-slate-200/90 bg-slate-50 hover:bg-white focus:bg-white font-medium text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition shadow-2xs"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Langkah nyata yang disarankan agar ormawa dapat langsung mengeksekusi perbaikan.</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50 flex flex-col-reverse sm:flex-row justify-end gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="min-h-[42px] px-4 rounded-xl border border-slate-200 text-slate-700 font-bold cursor-pointer hover:bg-slate-100 text-xs sm:text-sm active:scale-95 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="min-h-[42px] px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer shadow-xs active:scale-95 transition text-xs sm:text-sm flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan Catatan Ormawa</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
