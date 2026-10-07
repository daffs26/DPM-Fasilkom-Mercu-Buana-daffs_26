import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { 
  Scale, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  Building, 
  BookOpen, 
  CreditCard,
  Send,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import DropdownSelect from '@/components/ui/dropdown-select';

export default function KomisiAdvokasiView() {
  const { currentUser } = useStore(useShallow(state => ({
    currentUser: state.currentUser
  })));

  const canEdit = ['ketua', 'wakil', 'komisi_advokasi'].includes((currentUser?.role || '').toLowerCase());
  const [filterCategory, setFilterCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Data Aspirasi & Advokasi
  const [aspirasiList, setAspirasiList] = useState([
    {
      id: 'asp-1',
      ticketNo: 'ADV-2026-001',
      title: 'Keluhan Kecepatan Wi-Fi & Fasilitas Stopkontak Lab Komputer 401',
      category: 'Fasilitas & Sarpras',
      date: '04 Okt 2026',
      status: 'Dalam Advokasi Dekanat',
      priority: 'Tinggi',
      summary: 'Mahasiswa prodi Informatika melaporkan seringnya diskoneksi jaringan saat praktikum mata kuliah Jaringan Komputer, serta keterbatasan colokan listrik untuk laptop.',
      actionTaken: 'Audiensi tahap 1 telah dilakukan bersama Wakil Dekan II dan Kepala Lab Komputer. Dijadwalkan pemasangan access point tambahan minggu depan.',
      targetDepartment: 'Laboratorium & Bagian Umum Fasilkom'
    },
    {
      id: 'asp-2',
      ticketNo: 'ADV-2026-002',
      title: 'Keterlambatan Input Nilai Praktikum Basis Data Semester Lalu',
      category: 'Akademik & Perkuliahan',
      date: '29 Sep 2026',
      status: 'Selesai & Tuntas',
      priority: 'Sedang',
      summary: 'Mahasiswa angkatan 2024 menyampaikan kendala nilai KHS belum terbit tepat waktu menjelang pengisian KRS semester baru.',
      actionTaken: 'Komisi Advokasi melayangkan surat konfirmasi resmi kepada Sekretaris Program Studi. Seluruh nilai telah disinkronkan ke SIAKAD.',
      targetDepartment: 'Program Studi Sistem Informasi'
    },
    {
      id: 'asp-3',
      ticketNo: 'ADV-2026-003',
      title: 'Permohonan Keringanan Batas Pembayaran Cicilan UKT Tahap 2',
      category: 'Finansial & Beasiswa',
      date: '02 Okt 2026',
      status: 'Diterima & Verifikasi Berkas',
      priority: 'Tinggi',
      summary: 'Perwakilan mahasiswa mengajukan perpanjangan batas akhir pembayaran SPP/BPP karena kendala pencairan beasiswa eksternal.',
      actionTaken: 'Mengumpulkan 12 berkas mahasiswa terdampak untuk diteruskan dalam nota dinas advokasi kolektif ke Biro Keuangan Universitas.',
      targetDepartment: 'Biro Keuangan UMB'
    }
  ]);

  const [formAsp, setFormAsp] = useState({
    title: '',
    category: 'Fasilitas & Sarpras',
    priority: 'Sedang',
    summary: '',
    targetDepartment: ''
  });

  const handleSaveAsp = (e) => {
    e.preventDefault();
    if (!formAsp.title.trim() || !formAsp.summary.trim()) return;

    setAspirasiList([{
      id: `asp-${Date.now()}`,
      ticketNo: `ADV-2026-00${aspirasiList.length + 1}`,
      title: formAsp.title,
      category: formAsp.category,
      date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Menunggu Kajian DPM',
      priority: formAsp.priority,
      summary: formAsp.summary,
      actionTaken: 'Aspirasi telah dicatat dan masuk dalam agenda rapat kerja Komisi Advokasi.',
      targetDepartment: formAsp.targetDepartment || 'Dekanat Fasilkom'
    }, ...aspirasiList]);

    setFormAsp({
      title: '',
      category: 'Fasilitas & Sarpras',
      priority: 'Sedang',
      summary: '',
      targetDepartment: ''
    });
    setIsModalOpen(false);
  };

  const filteredList = filterCategory === 'all' 
    ? aspirasiList 
    : aspirasiList.filter(a => a.category === filterCategory);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-64 h-64 bg-teal-50/70 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3.5 sm:gap-4">
          <div className="space-y-1 sm:space-y-1.5">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Kanal Advokasi &amp; Suara Mahasiswa
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              Kanal resmi Komisi Advokasi DPM FASILKOM UMB untuk menjaring keluhan civitas mahasiswa seputar fasilitas, akademik, dan finansial serta mengawal tindak lanjutnya bersama pimpinan fakultas.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[44px] h-11 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition active:scale-95 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Sampaikan / Catat Aspirasi</span>
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500">Total Aspirasi</span>
          <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1 sm:mt-2">{aspirasiList.length} Isu</p>
          <p className="text-[10px] sm:text-[11px] text-teal-600 font-bold mt-1">Semester Ganjil 2026/2027</p>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500">Sedang Diadvokasi</span>
          <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1 sm:mt-2">
            {aspirasiList.filter(a => a.status.includes('Advokasi')).length} Kasus
          </p>
          <p className="text-[10px] sm:text-[11px] text-amber-600 font-bold mt-1">Dalam proses audiensi</p>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500">Dituntaskan</span>
          <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1 sm:mt-2">
            {aspirasiList.filter(a => a.status.includes('Selesai')).length} Kasus
          </p>
          <p className="text-[10px] sm:text-[11px] text-emerald-600 font-bold mt-1">Solutif &amp; terekam resmi</p>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500">Respon SLA</span>
          <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1 sm:mt-2">&lt; 48 Jam</p>
          <p className="text-[10px] sm:text-[11px] text-teal-600 font-bold mt-1">SLA parlemen</p>
        </div>
      </div>

      {/* Filter Kategori - Horizontal Scroll on Mobile */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 hide-scrollbar -mx-1 px-1">
        {[
          { key: 'all', label: 'Semua Kategori' },
          { key: 'Fasilitas & Sarpras', label: 'Fasilitas & Sarpras' },
          { key: 'Akademik & Perkuliahan', label: 'Akademik & Dosen' },
          { key: 'Finansial & Beasiswa', label: 'Finansial & UKT' }
        ].map(cat => (
          <button
            key={cat.key}
            onClick={() => setFilterCategory(cat.key)}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap shrink-0 active:scale-95 ${
              filterCategory === cat.key
                ? 'bg-teal-600 text-white shadow-2xs'
                : 'bg-white border border-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* List Aspirasi */}
      <div className="space-y-3.5 sm:space-y-4">
        {filteredList.map((asp) => (
          <div key={asp.id} className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-3.5 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                  {asp.ticketNo}
                </span>
                <span className="text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
                  {asp.category}
                </span>
                <span className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  asp.priority === 'Tinggi' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  Prioritas {asp.priority}
                </span>
              </div>

              <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl self-start sm:self-auto">
                {asp.status}
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">{asp.title}</h3>
              <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed mt-1.5">{asp.summary}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60 text-xs sm:text-[13px] text-slate-700 space-y-1">
              <span className="font-bold text-slate-900 text-xs block">Langkah &amp; Tindak Lanjut Komisi Advokasi:</span>
              <p className="leading-relaxed">{asp.actionTaken}</p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-1 pt-1 border-t border-slate-100">
              <span>Sasaran: <strong className="text-slate-700">{asp.targetDepartment}</strong></span>
              <span>Tanggal Masuk: {asp.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Input Aspirasi */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">Formulir Aspirasi &amp; Advokasi Mahasiswa</h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="w-8 h-8 min-h-[32px] min-w-[32px] flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer active:scale-95 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAsp} className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Judul / Pokok Keluhan</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Kendala Jaringan Lab Komputer"
                  value={formAsp.title}
                  onChange={(e) => setFormAsp({ ...formAsp, title: e.target.value })}
                  className="w-full min-h-[44px] h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kategori Masalah</label>
                  <DropdownSelect
                    value={formAsp.category}
                    onChange={(val) => setFormAsp(prev => ({ ...prev, category: val }))}
                    options={[
                      { value: 'Fasilitas & Sarpras', label: 'Fasilitas & Sarpras' },
                      { value: 'Akademik & Perkuliahan', label: 'Akademik & Perkuliahan' },
                      { value: 'Finansial & Beasiswa', label: 'Finansial & Beasiswa' },
                      { value: 'Pelayanan Kampus', label: 'Pelayanan Kampus' }
                    ]}
                    placeholder="Pilih Kategori"
                    triggerClassName="min-h-[44px] h-11 py-2 px-3 rounded-xl text-xs sm:text-sm bg-slate-50 border-slate-200 w-full"
                    contentClassName="w-full z-50 shadow-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tingkat Urgensi</label>
                  <DropdownSelect
                    value={formAsp.priority}
                    onChange={(val) => setFormAsp(prev => ({ ...prev, priority: val }))}
                    options={[
                      { value: 'Sedang', label: 'Sedang' },
                      { value: 'Tinggi', label: 'Tinggi' },
                      { value: 'Mendesak', label: 'Mendesak' }
                    ]}
                    placeholder="Pilih Urgensi"
                    triggerClassName="min-h-[44px] h-11 py-2 px-3 rounded-xl text-xs sm:text-sm bg-slate-50 border-slate-200 w-full"
                    contentClassName="w-full z-50 shadow-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Uraian Detail Masalah</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Jelaskan kronologi, lokasi, dan dampak terhadap mahasiswa..."
                  value={formAsp.summary}
                  onChange={(e) => setFormAsp({ ...formAsp, summary: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-medium text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Pihak / Bagian Sasaran</label>
                <input
                  type="text"
                  placeholder="Misal: Bagian Laboratorium / Biro Keuangan / Kaprodi"
                  value={formAsp.targetDepartment}
                  onChange={(e) => setFormAsp({ ...formAsp, targetDepartment: e.target.value })}
                  className="w-full min-h-[44px] h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="min-h-[44px] h-11 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 cursor-pointer active:scale-95 text-xs sm:text-sm transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] h-11 px-5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold cursor-pointer active:scale-95 text-xs sm:text-sm transition shadow-xs"
                >
                  Kirim Aspirasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
