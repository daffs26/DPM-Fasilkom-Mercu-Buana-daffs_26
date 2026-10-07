import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { 
  Wallet, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Plus, 
  Calendar, 
  Receipt,
  PiggyBank,
  CheckCircle2,
  Filter,
  Search,
  Scale,
  FolderOpen,
  ChevronDown,
  ChevronUp,
  Tag,
  AlertCircle,
  Coins,
  Sparkles,
  UserCheck,
  Camera,
  Image as ImageIcon,
  Trash2,
  Eye,
  X
} from 'lucide-react';
import { canManageInternalBudget } from '@/utils/permissions';
import { formatRupiah } from '@/utils/formatters';
import DropdownSelect from '@/components/ui/dropdown-select';

// Data preset realistis pembukuan keuangan DPM berbasis Program Kerja (Proker)
const DEFAULT_PROKER_FINANCE = [
  {
    id: 'proker-sidang-umum',
    title: 'Sidang Umum Mahasiswa Fasilkom UMB',
    period: '18 - 20 September 2026',
    pic: 'Siti Nurhaliza (Bendahara DPM) & Presidium',
    rabTarget: 5500000,
    status: 'Selesai LPJ',
    statusVariant: 'success',
    description: 'Forum musyawarah tertinggi mahasiswa Fasilkom untuk evaluasi kinerja kelembagaan, amandemen tata tertib, dan suksesi kepemimpinan.',
    transactions: [
      {
        id: 'tx-su-in-1',
        date: '05 Sep 2026',
        type: 'pemasukan',
        category: 'Dana Kemahasiswaan Fakultas',
        nominal: 3500000,
        receiptNumber: 'KW-FAK-081',
        description: 'Pencairan termin 1 dari alokasi pagu Dekanat Fasilkom untuk operasional sidang akbar.',
        recordedBy: 'Siti Nurhaliza (Bendahara)'
      },
      {
        id: 'tx-su-in-2',
        date: '12 Sep 2026',
        type: 'pemasukan',
        category: 'Sponsorship Mitra',
        nominal: 1200000,
        receiptNumber: 'KW-SPN-014',
        description: 'Kemitraan paket konsumsi makan siang dan air mineral botol 15 karton.',
        recordedBy: 'Siti Nurhaliza (Bendahara)'
      },
      {
        id: 'tx-su-in-3',
        date: '15 Sep 2026',
        type: 'pemasukan',
        category: 'Iuran Pimpinan Parlemen',
        nominal: 800000,
        receiptNumber: 'KW-INT-029',
        description: 'Iuran sukarela pimpinan dan fungsionaris dewan untuk cadangan tak terduga.',
        recordedBy: 'Siti Nurhaliza (Bendahara)'
      },
      {
        id: 'tx-su-out-1',
        date: '17 Sep 2026',
        type: 'pengeluaran',
        category: 'Konsumsi & Logistik Makanan',
        nominal: 2450000,
        receiptNumber: 'NOTA-KTR-441',
        description: 'Konsumsi nasi kotak & snack box peserta sidang pleno, presidium, dan saksi 3 hari.',
        recordedBy: 'Siti Nurhaliza (Bendahara)'
      },
      {
        id: 'tx-su-out-2',
        date: '16 Sep 2026',
        type: 'pengeluaran',
        category: 'Percetakan & Palu Sidang',
        nominal: 850000,
        receiptNumber: 'NOTA-PRN-092',
        description: 'Pengadaan 2 set palu kayu sidang berlogo dewan dan cetak 40 buku draf konsideran.',
        recordedBy: 'Siti Nurhaliza (Bendahara)'
      },
      {
        id: 'tx-su-out-3',
        date: '17 Sep 2026',
        type: 'pengeluaran',
        category: 'Sewa Sound & Mic Delegate',
        nominal: 700000,
        receiptNumber: 'NOTA-SND-115',
        description: 'Sewa 4 unit mic delegate meja presidium dan sound system pendukung aula kampus.',
        recordedBy: 'Siti Nurhaliza (Bendahara)'
      },
      {
        id: 'tx-su-out-4',
        date: '18 Sep 2026',
        type: 'pengeluaran',
        category: 'Publikasi & Banner Panggung',
        nominal: 350000,
        receiptNumber: 'NOTA-ADV-302',
        description: 'Cetak backdrop panggung aula 6x3 meter dan standing banner selamat datang.',
        recordedBy: 'Siti Nurhaliza (Bendahara)'
      },
      {
        id: 'tx-su-out-5',
        date: '18 Sep 2026',
        type: 'pengeluaran',
        category: 'ATK & Kesekretariatan',
        nominal: 220000,
        receiptNumber: 'NOTA-ATK-208',
        description: 'Map berkas hasil ketetapan sidang pleno, kertas HVS SPJ, dan tinta stempel garuda.',
        recordedBy: 'Siti Nurhaliza (Bendahara)'
      }
    ]
  },
  {
    id: 'proker-raker-pleno',
    title: 'Rapat Kerja Parlemen & Pleno Pengawasan Triwulan I',
    period: '02 - 03 Oktober 2026',
    pic: 'Siti Nurhaliza (Bendahara DPM)',
    rabTarget: 2000000,
    status: 'Selesai LPJ',
    statusVariant: 'success',
    description: 'Rapat koordinasi komisi DPM untuk penetapan matriks audit ormawa, evaluasi kinerja bulanan, dan tata tertib dewan.',
    transactions: [
      {
        id: 'tx-rk-in-1',
        date: '28 Sep 2026',
        type: 'pemasukan',
        category: 'Kas Operasional Parlemen',
        nominal: 1500000,
        receiptNumber: 'KW-KAS-012',
        description: 'Alokasi kas internal dewan untuk operasional sidang komisi pengawasan.',
        recordedBy: 'Siti Nurhaliza (Bendahara)'
      },
      {
        id: 'tx-rk-in-2',
        date: '30 Sep 2026',
        type: 'pemasukan',
        category: 'Subsidi Kesekretariatan Dekanat',
        nominal: 500000,
        receiptNumber: 'KW-FAK-095',
        description: 'Bantuan operasional berkas evaluasi triwulan kemahasiswaan fakultas.',
        recordedBy: 'Siti Nurhaliza (Bendahara)'
      },
      {
        id: 'tx-rk-out-1',
        date: '02 Okt 2026',
        type: 'pengeluaran',
        category: 'Konsumsi Rapat Pleno',
        nominal: 650000,
        receiptNumber: 'NOTA-SNK-103',
        description: 'Snack box pembuka, kopi, dan makan siang anggota dewan 4 komisi (24 orang).',
        recordedBy: 'Siti Nurhaliza (Bendahara)'
      },
      {
        id: 'tx-rk-out-2',
        date: '01 Okt 2026',
        type: 'pengeluaran',
        category: 'Penggandaan Berkas Matriks',
        nominal: 275000,
        receiptNumber: 'NOTA-FCP-554',
        description: 'Fotokopi dan jilid spiral matriks audit proker BEM, HIMTI, HIMSISFO, dan DPM.',
        recordedBy: 'Siti Nurhaliza (Bendahara)'
      },
      {
        id: 'tx-rk-out-3',
        date: '02 Okt 2026',
        type: 'pengeluaran',
        category: 'ATK & Flipchart Rapat',
        nominal: 180000,
        receiptNumber: 'NOTA-ATK-771',
        description: 'Buku ekspedisi sidang, spidol whiteboard, dan sticky notes brainstorming komisi.',
        recordedBy: 'Siti Nurhaliza (Bendahara)'
      }
    ]
  },
  {
    id: 'proker-hearing-audiensi',
    title: 'Hearing & Audiensi Aspirasi Terbuka Mahasiswa Fasilkom',
    period: '24 Oktober 2026 (Mendatang)',
    pic: 'Ahmad Fauzan (Ketua Komisi IV) & Siti Nurhaliza',
    rabTarget: 1800000,
    status: 'Sedang Berjalan',
    statusVariant: 'info',
    description: 'Forum audiensi tatap muka terbuka antara mahasiswa Fasilkom dengan Dekanat & Pimpinan Ormawa guna menyampaikan advokasi fasilitas dan kurikulum.',
    transactions: [
      {
        id: 'tx-hr-in-1',
        date: '03 Okt 2026',
        type: 'pemasukan',
        category: 'Dana Kemahasiswaan Fakultas',
        nominal: 1000000,
        receiptNumber: 'KW-FAK-112',
        description: 'Pencairan termin awal untuk persiapan logistik, sound, dan publikasi hearing akbar.',
        recordedBy: 'Siti Nurhaliza (Bendahara)'
      },
      {
        id: 'tx-hr-in-2',
        date: '05 Okt 2026',
        type: 'pemasukan',
        category: 'Sponsorship Media Partner',
        nominal: 500000,
        receiptNumber: 'KW-SPN-089',
        description: 'Kerjasama sponsorship platform edukasi teknologi pendukung acara.',
        recordedBy: 'Siti Nurhaliza (Bendahara)'
      },
      {
        id: 'tx-hr-out-1',
        date: '04 Okt 2026',
        type: 'pengeluaran',
        category: 'Poster & Standing Banner Mading',
        nominal: 240000,
        receiptNumber: 'NOTA-PRT-819',
        description: 'Cetak poster fisik A3 dan standing banner promosi hearing di mading Menara Mercu Buana.',
        recordedBy: 'Siti Nurhaliza (Bendahara)'
      },
      {
        id: 'tx-hr-out-2',
        date: '05 Okt 2026',
        type: 'pengeluaran',
        category: 'Kotak & Lembar Suara Aspirasi',
        nominal: 120000,
        receiptNumber: 'NOTA-ATK-902',
        description: 'Pengadaan 3 drop box aspirasi fisik di lobby fakultas dan kertas form advokasi.',
        recordedBy: 'Siti Nurhaliza (Bendahara)'
      }
    ]
  },
  {
    id: 'proker-lklm',
    title: 'Latihan Kepemimpinan Legislatif Mahasiswa (LKLM) 2026',
    period: '14 - 15 November 2026',
    pic: 'Siti Nurhaliza (Bendahara DPM) & Panitia',
    rabTarget: 4000000,
    status: 'Perencanaan',
    statusVariant: 'warning',
    description: 'Kaderisasi dan pelatihan teknik persidangan, legal drafting perundang-undangan mahasiswa, serta audit bagi calon fungsionaris dewan.',
    transactions: [
      {
        id: 'tx-lk-in-1',
        date: '06 Okt 2026',
        type: 'pemasukan',
        category: 'Alokasi Kas Awal Parlemen',
        nominal: 1000000,
        receiptNumber: 'KW-INT-099',
        description: 'Alokasi kas dewan untuk uang muka sewa tempat dan modul materi kepemimpinan.',
        recordedBy: 'Siti Nurhaliza (Bendahara)'
      },
      {
        id: 'tx-lk-out-1',
        date: '06 Okt 2026',
        type: 'pengeluaran',
        category: 'Uang Muka Ruang Auditorium',
        nominal: 500000,
        receiptNumber: 'NOTA-DP-001',
        description: 'Uang muka pemesanan ruang auditorium kampus dan sound system pelatihan legislatif.',
        recordedBy: 'Siti Nurhaliza (Bendahara)'
      }
    ]
  },
  {
    id: 'proker-kas-rutin',
    title: 'Kas Operasional Rutin & Kesekretariatan (Non-Proker)',
    period: 'Periode Berjalan 2026/2027',
    pic: 'Siti Nurhaliza (Bendahara DPM)',
    rabTarget: 2500000,
    status: 'Rutin Berjalan',
    statusVariant: 'neutral',
    description: 'Pos kas harian internal untuk iuran wajib anggota dewan, belanja ATK kantor parlemen, dan konsumsi rapat koordinasi mingguan.',
    transactions: [
      {
        id: 'tx-rt-in-1',
        date: '04 Okt 2026',
        type: 'pemasukan',
        category: 'Iuran Wajib Anggota DPM',
        nominal: 1200000,
        receiptNumber: 'KW-IUR-001',
        description: 'Iuran wajib kas internal pengurus parlemen DPM periode ganjil (24 anggota @Rp 50.000).',
        recordedBy: 'Siti Nurhaliza (Bendahara)'
      },
      {
        id: 'tx-rt-out-1',
        date: '28 Sep 2026',
        type: 'pengeluaran',
        category: 'ATK Kesekretariatan Parlemen',
        nominal: 185000,
        receiptNumber: 'NOTA-ATK-019',
        description: 'Pembelian map arsip parlemen, tinta stempel resmi dewan, dan kertas berkas SPJ.',
        recordedBy: 'Siti Nurhaliza (Bendahara)'
      },
      {
        id: 'tx-rt-out-2',
        date: '02 Okt 2026',
        type: 'pengeluaran',
        category: 'Konsumsi Rapat Mingguan',
        nominal: 150000,
        receiptNumber: 'NOTA-MKN-088',
        description: 'Konsumsi snack rapat koordinasi pimpinan dan kesekretariatan dewan.',
        recordedBy: 'Siti Nurhaliza (Bendahara)'
      }
    ]
  }
];

function getStatusBadgeStyle(variant) {
  switch (variant) {
    case 'success':
      return 'bg-emerald-50 text-emerald-800 border-emerald-200/90';
    case 'info':
      return 'bg-sky-50 text-sky-800 border-sky-200/90';
    case 'warning':
      return 'bg-amber-50 text-amber-800 border-amber-200/90';
    case 'neutral':
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

export default function KomisiBendaharaView() {
  const { currentUser } = useStore(useShallow(state => ({
    currentUser: state.currentUser
  })));

  const canManage = canManageInternalBudget(currentUser?.role);

  // Inisialisasi data dari localStorage atau default
  const [prokerData, setProkerData] = useState(() => {
    try {
      const saved = localStorage.getItem('dpm-bendahara-proker-finance-v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Gagal memuat cache kas bendahara proker:', e);
    }
    return DEFAULT_PROKER_FINANCE;
  });

  // Simpan perubahan ke localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dpm-bendahara-proker-finance-v2', JSON.stringify(prokerData));
    } catch (e) {
      console.warn('Gagal menyimpan cache kas bendahara proker:', e);
    }
  }, [prokerData]);

  // State Filter & Pencarian
  const [selectedProkerId, setSelectedProkerId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCards, setExpandedCards] = useState({
    'proker-sidang-umum': true,
    'proker-raker-pleno': true
  });

  // State Modal
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isAddProkerModalOpen, setIsAddProkerModalOpen] = useState(false);
  const [selectedPreviewImage, setSelectedPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  // Form Transaksi
  const [formTx, setFormTx] = useState({
    targetProkerId: 'proker-sidang-umum',
    type: 'pengeluaran',
    category: 'Konsumsi & Logistik Makanan',
    nominal: '',
    receiptNumber: '',
    description: '',
    receiptPhoto: null,
    receiptPhotoName: '',
    receiptPhotoSize: ''
  });

  // Handler Upload Foto Bukti Nota
  const handleTxFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran foto terlalu besar! Maksimal 5 MB.');
      return;
    }

    const sizeInKb = Math.round(file.size / 1024);
    const formattedSize = sizeInKb > 1024 ? `${(sizeInKb / 1024).toFixed(1)} MB` : `${sizeInKb} KB`;

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormTx(prev => ({
        ...prev,
        receiptPhoto: event.target.result,
        receiptPhotoName: file.name,
        receiptPhotoSize: formattedSize
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveTxPhoto = () => {
    setFormTx(prev => ({
      ...prev,
      receiptPhoto: null,
      receiptPhotoName: '',
      receiptPhotoSize: ''
    }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Form Proker Baru
  const [formNewProker, setFormNewProker] = useState({
    title: '',
    period: '',
    pic: '',
    rabTarget: '',
    description: ''
  });

  const toggleExpand = (id) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Kalkulasi Global Seluruh Proker
  const globalStats = useMemo(() => {
    let totalPemasukan = 0;
    let totalPengeluaran = 0;
    let totalTxCount = 0;

    prokerData.forEach(p => {
      (p.transactions || []).forEach(tx => {
        totalTxCount++;
        if (tx.type === 'pemasukan') totalPemasukan += Number(tx.nominal || 0);
        if (tx.type === 'pengeluaran') totalPengeluaran += Number(tx.nominal || 0);
      });
    });

    const saldoBersih = totalPemasukan - totalPengeluaran;
    return {
      totalPemasukan,
      totalPengeluaran,
      saldoBersih,
      totalTxCount,
      totalProker: prokerData.length
    };
  }, [prokerData]);

  // Kalkulasi Angka Per-Proker
  const calculatedProkers = useMemo(() => {
    return prokerData.map(p => {
      let masuk = 0;
      let keluar = 0;
      const txs = p.transactions || [];

      txs.forEach(t => {
        if (t.type === 'pemasukan') masuk += Number(t.nominal || 0);
        if (t.type === 'pengeluaran') keluar += Number(t.nominal || 0);
      });

      const saldo = masuk - keluar;
      const serapanPersen = p.rabTarget > 0 ? Math.min(100, Math.round((keluar / p.rabTarget) * 100)) : 0;

      return {
        ...p,
        totalPemasukan: masuk,
        totalPengeluaran: keluar,
        saldo,
        serapanPersen
      };
    });
  }, [prokerData]);

  // Filter Proker
  const filteredProkers = useMemo(() => {
    let list = calculatedProkers;
    if (selectedProkerId !== 'all') {
      list = list.filter(p => p.id === selectedProkerId);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => {
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchTx = (p.transactions || []).some(t => 
          t.description.toLowerCase().includes(q) || 
          t.category.toLowerCase().includes(q) || 
          (t.receiptNumber && t.receiptNumber.toLowerCase().includes(q))
        );
        return matchTitle || matchTx;
      });
    }
    return list;
  }, [calculatedProkers, selectedProkerId, searchQuery]);

  // Tambah Transaksi ke Proker
  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!formTx.nominal || !formTx.description.trim()) return;

    const newTxItem = {
      id: `tx-${Date.now()}`,
      date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      type: formTx.type,
      category: formTx.category,
      nominal: Number(formTx.nominal),
      receiptNumber: formTx.receiptNumber.trim() || `KW-${Date.now().toString().slice(-6)}`,
      receiptPhoto: formTx.receiptPhoto || null,
      receiptPhotoName: formTx.receiptPhotoName || '',
      description: formTx.description.trim(),
      recordedBy: currentUser?.name || 'Siti Nurhaliza (Bendahara)'
    };

    setProkerData(prev => prev.map(p => {
      if (p.id === formTx.targetProkerId) {
        return {
          ...p,
          transactions: [newTxItem, ...(p.transactions || [])]
        };
      }
      return p;
    }));

    setExpandedCards(prev => ({ ...prev, [formTx.targetProkerId]: true }));
    setFormTx({
      targetProkerId: formTx.targetProkerId,
      type: 'pengeluaran',
      category: 'Konsumsi & Logistik Makanan',
      nominal: '',
      receiptNumber: '',
      description: '',
      receiptPhoto: null,
      receiptPhotoName: '',
      receiptPhotoSize: ''
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsTxModalOpen(false);
  };

  // Tambah Proker Baru
  const handleAddProker = (e) => {
    e.preventDefault();
    if (!formNewProker.title.trim()) return;

    const newProkerId = `proker-${Date.now()}`;
    const newProkerItem = {
      id: newProkerId,
      title: formNewProker.title.trim(),
      period: formNewProker.period.trim() || 'Periode 2026/2027',
      pic: formNewProker.pic.trim() || (currentUser?.name ? `${currentUser.name} (Bendahara)` : 'Bendahara DPM'),
      rabTarget: Number(formNewProker.rabTarget) || 0,
      status: 'Sedang Berjalan',
      statusVariant: 'info',
      description: formNewProker.description.trim() || 'Pos kegiatan dan alokasi kas terencana parlemen dewan.',
      transactions: []
    };

    setProkerData(prev => [newProkerItem, ...prev]);
    setSelectedProkerId(newProkerId);
    setExpandedCards(prev => ({ ...prev, [newProkerId]: true }));
    setFormNewProker({ title: '', period: '', pic: '', rabTarget: '', description: '' });
    setIsAddProkerModalOpen(false);
  };

  // Options Dropdown
  const prokerFilterOptions = [
    { value: 'all', label: 'Semua Program Kerja' },
    ...calculatedProkers.map(p => ({
      value: p.id,
      label: p.title
    }))
  ];

  const prokerModalOptions = calculatedProkers.map(p => ({
    value: p.id,
    label: p.title
  }));

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* 1. Header Banner Bersih & Mewah */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-2xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <p className="text-xs font-bold text-amber-900 tracking-wide">
                Buku Keuangan Internal Parlemen DPM
              </p>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Laporan Keuangan Per-Program Kerja
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              Transparansi penuh pemasukan, alokasi anggaran, dan rincian belanja pada tiap-tiap agenda kerja parlemen.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-center shrink-0">
            {canManage && (
              <>
                <button
                  type="button"
                  onClick={() => setIsAddProkerModalOpen(true)}
                  className="min-h-[42px] px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer active:scale-95"
                >
                  + Tambah Proker
                </button>
                <button
                  type="button"
                  onClick={() => setIsTxModalOpen(true)}
                  className="min-h-[42px] px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Catat Transaksi</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. Global Metric Cards (3 Kotak Rapi Tanpa Badge Berlebihan) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        {/* Total Saldo Bersih */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Saldo Kas Bersih</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {formatRupiah(globalStats.saldoBersih)}
          </p>
          <p className="text-[11px] font-semibold text-slate-400">
            Akumulasi dari {globalStats.totalProker} pos kegiatan parlemen
          </p>
        </div>

        {/* Total Pemasukan */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Seluruh Pemasukan</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-600 tracking-tight">
            {formatRupiah(globalStats.totalPemasukan)}
          </p>
          <p className="text-[11px] font-semibold text-slate-400">
            Dana Dekanat, iuran anggota &amp; sponsor mitra
          </p>
        </div>

        {/* Total Pengeluaran */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Seluruh Pengeluaran</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-rose-600 tracking-tight">
            {formatRupiah(globalStats.totalPengeluaran)}
          </p>
          <p className="text-[11px] font-semibold text-slate-400">
            Biaya sidang, konsumsi, dokumen &amp; ATK
          </p>
        </div>
      </div>

      {/* 3. Filter Bar yang Teratur */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-3.5 sm:p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-1 max-w-md">
            <div className="w-full">
              <DropdownSelect
                value={selectedProkerId}
                onChange={setSelectedProkerId}
                options={prokerFilterOptions}
                placeholder="Pilih Program Kerja"
                triggerClassName="min-h-[42px] h-10.5 py-2 px-3 rounded-xl text-xs sm:text-sm bg-slate-50 border-slate-200 w-full hover:bg-white"
                contentClassName="w-80 z-50 shadow-xl"
              />
            </div>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari uraian, nomor nota, kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full min-h-[42px] h-10.5 pl-9 pr-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            />
          </div>
        </div>
      </div>

      {/* 4. DAFTAR KARTU PROGRAM KERJA (KOMPARASI PEMASUKAN & PENGELUARAN YANG BERSIH) */}
      <div className="space-y-5">
        {filteredProkers.map((proker) => {
          const isExpanded = Boolean(expandedCards[proker.id]);
          const pemasukanList = (proker.transactions || []).filter(t => t.type === 'pemasukan');
          const pengeluaranList = (proker.transactions || []).filter(t => t.type === 'pengeluaran');

          return (
            <div 
              key={proker.id}
              className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden transition-all duration-200"
            >
              {/* Header Kartu Proker */}
              <div className="p-4 sm:p-6 border-b border-slate-100">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center justify-between sm:justify-start gap-2.5">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadgeStyle(proker.statusVariant)}`}>
                        {proker.status}
                      </span>
                      <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {proker.period}
                      </span>
                    </div>

                    <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
                      {proker.title}
                    </h2>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Penanggung Jawab: <strong className="text-slate-700 font-semibold">{proker.pic}</strong></span>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed max-w-2xl pt-0.5">
                      {proker.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start lg:self-center shrink-0 pt-1 lg:pt-0">
                    {canManage && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormTx(prev => ({ ...prev, targetProkerId: proker.id }));
                          setIsTxModalOpen(true);
                        }}
                        className="min-h-[38px] px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/90 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Catat Mutasi</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => toggleExpand(proker.id)}
                      className="min-h-[38px] px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold border border-slate-200/80 transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isExpanded ? 'Sembunyikan' : 'Lihat Rincian'}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Ringkasan Angka Proker: Pemasukan, Pengeluaran, Saldo Kas */}
                <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Pemasukan Proker */}
                  <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60 space-y-0.5">
                    <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                      <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
                      Total Pemasukan
                    </span>
                    <p className="text-base sm:text-lg font-black text-emerald-700 tracking-tight">
                      {formatRupiah(proker.totalPemasukan)}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Target RAB: {formatRupiah(proker.rabTarget)}
                    </p>
                  </div>

                  {/* Pengeluaran Proker */}
                  <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60 space-y-0.5">
                    <span className="text-[11px] font-bold text-rose-800 flex items-center gap-1">
                      <ArrowUpRight className="w-3.5 h-3.5 text-rose-600" />
                      Total Pengeluaran
                    </span>
                    <p className="text-base sm:text-lg font-black text-rose-700 tracking-tight">
                      {formatRupiah(proker.totalPengeluaran)}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Realisasi Belanja: {proker.serapanPersen}% dari RAB
                    </p>
                  </div>

                  {/* Sisa Saldo Proker */}
                  <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60 space-y-0.5">
                    <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5 text-amber-600" />
                      Sisa Saldo Kas Proker
                    </span>
                    <p className={`text-base sm:text-lg font-black tracking-tight ${
                      proker.saldo >= 0 ? 'text-slate-900' : 'text-red-600'
                    }`}>
                      {formatRupiah(proker.saldo)}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {proker.saldo >= 0 ? 'Surplus dana kegiatan' : 'Defisit anggaran'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rincian Komparasi Pemasukan & Pengeluaran (2 Kolom Bersih) */}
              {isExpanded && (
                <div className="p-4 sm:p-6 bg-slate-50/40">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* KOLOM KIRI: ALIRAN PEMASUKAN */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                        <span className="text-xs font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          Rincian Pemasukan ({pemasukanList.length})
                        </span>
                        <span className="text-xs font-black text-emerald-700 tabular-nums">
                          {formatRupiah(proker.totalPemasukan)}
                        </span>
                      </div>

                      {pemasukanList.length === 0 ? (
                        <div className="p-4 text-center text-xs text-slate-400 italic bg-white rounded-xl border border-slate-100">
                          Belum ada catatan dana masuk.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {pemasukanList.map((tx) => (
                            <div 
                              key={tx.id} 
                              className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-2"
                            >
                              <div className="flex items-start justify-between gap-2.5">
                                <div className="space-y-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs font-bold text-slate-900 block leading-snug">
                                      {tx.category}
                                    </span>
                                    {tx.receiptNumber && (
                                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold border border-slate-200/60">
                                        {tx.receiptNumber}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-slate-600 leading-relaxed">
                                    {tx.description}
                                  </p>
                                </div>
                                <span className="text-xs sm:text-sm font-black text-emerald-600 tabular-nums shrink-0 pt-0.5">
                                  + {formatRupiah(tx.nominal)}
                                </span>
                              </div>

                              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3 text-slate-400" />
                                  {tx.date}
                                </span>
                                <div className="flex items-center gap-2">
                                  {tx.receiptPhoto && (
                                    <button
                                      type="button"
                                      onClick={() => setSelectedPreviewImage({
                                        url: tx.receiptPhoto,
                                        title: tx.category,
                                        nota: tx.receiptNumber,
                                        nominal: tx.nominal,
                                        type: 'pemasukan',
                                        desc: tx.description
                                      })}
                                      className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200/80 transition cursor-pointer"
                                    >
                                      <Eye className="w-3 h-3" />
                                      <span>Foto Bukti</span>
                                    </button>
                                  )}
                                  <span>Dicatat: <strong className="text-slate-600 font-semibold">{tx.recordedBy}</strong></span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* KOLOM KANAN: ALIRAN PENGELUARAN */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                        <span className="text-xs font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
                          <span className="w-2 h-2 rounded-full bg-rose-500" />
                          Rincian Pengeluaran ({pengeluaranList.length})
                        </span>
                        <span className="text-xs font-black text-rose-700 tabular-nums">
                          {formatRupiah(proker.totalPengeluaran)}
                        </span>
                      </div>

                      {pengeluaranList.length === 0 ? (
                        <div className="p-4 text-center text-xs text-slate-400 italic bg-white rounded-xl border border-slate-100">
                          Belum ada catatan pengeluaran belanja.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {pengeluaranList.map((tx) => (
                            <div 
                              key={tx.id} 
                              className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-2"
                            >
                              <div className="flex items-start justify-between gap-2.5">
                                <div className="space-y-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs font-bold text-slate-900 block leading-snug">
                                      {tx.category}
                                    </span>
                                    {tx.receiptNumber && (
                                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold border border-slate-200/60">
                                        {tx.receiptNumber}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-slate-600 leading-relaxed">
                                    {tx.description}
                                  </p>
                                </div>
                                <span className="text-xs sm:text-sm font-black text-rose-600 tabular-nums shrink-0 pt-0.5">
                                  - {formatRupiah(tx.nominal)}
                                </span>
                              </div>

                              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3 text-slate-400" />
                                  {tx.date}
                                </span>
                                <div className="flex items-center gap-2">
                                  {tx.receiptPhoto && (
                                    <button
                                      type="button"
                                      onClick={() => setSelectedPreviewImage({
                                        url: tx.receiptPhoto,
                                        title: tx.category,
                                        nota: tx.receiptNumber,
                                        nominal: tx.nominal,
                                        type: 'pengeluaran',
                                        desc: tx.description
                                      })}
                                      className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 px-2 py-0.5 rounded border border-rose-200/80 transition cursor-pointer"
                                    >
                                      <Eye className="w-3 h-3" />
                                      <span>Foto Bukti</span>
                                    </button>
                                  )}
                                  <span>Dicatat: <strong className="text-slate-600 font-semibold">{tx.recordedBy}</strong></span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredProkers.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200/80 shadow-2xs space-y-2.5">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="text-xs sm:text-sm font-bold text-slate-800">Tidak ada program kerja yang cocok</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Silakan sesuaikan pilihan dropdown atau hapus kata kunci pencarian.
            </p>
            <button
              type="button"
              onClick={() => { setSelectedProkerId('all'); setSearchQuery(''); }}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Tampilkan Semua Proker
            </button>
          </div>
        )}
      </div>

      {/* MODAL 1: CATAT TRANSAKSI PROKER (Anti-Fatigue UX) */}
      {isTxModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Header Modal */}
            <div className="flex items-center justify-between p-4 sm:p-5 pb-3.5 border-b border-slate-100 bg-slate-50/60 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs border ${
                  formTx.type === 'pemasukan' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  <Receipt className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">Catat Mutasi Kas Proker</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Catatan kas terhubung langsung ke pembukuan proker terpilih</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsTxModalOpen(false)} 
                className="w-9 h-9 min-h-[36px] min-w-[36px] flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer active:scale-95 transition"
                aria-label="Tutup"
              >
                ✕
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleAddTransaction} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-sm flex-1">
                {/* 1. Pilih Proker */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-slate-800 flex items-center gap-1.5">
                      <FolderOpen className="w-3.5 h-3.5 text-slate-500" />
                      <span>Target Program Kerja</span>
                    </label>
                    <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">Wajib</span>
                  </div>
                  <DropdownSelect
                    value={formTx.targetProkerId}
                    onChange={(val) => setFormTx(prev => ({ ...prev, targetProkerId: val }))}
                    options={prokerModalOptions}
                    placeholder="Pilih Program Kerja"
                    triggerClassName="min-h-[44px] h-11 py-2 px-3 rounded-xl text-xs sm:text-sm bg-slate-50 hover:bg-white border-slate-200/90 w-full font-medium"
                    contentClassName="w-full z-50 shadow-xl"
                  />
                </div>

                {/* 2. Jenis Arus Kas (Segmented Switcher) */}
                <div>
                  <label className="font-bold text-slate-800 block mb-1.5">
                    Jenis Arus Kas
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormTx(prev => ({ 
                        ...prev, 
                        type: 'pengeluaran',
                        category: 'Konsumsi & Logistik Makanan'
                      }))}
                      className={`min-h-[42px] py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-2 active:scale-95 ${
                        formTx.type === 'pengeluaran'
                          ? 'bg-rose-50 border-rose-300 text-rose-800 font-black shadow-2xs ring-2 ring-rose-400/20'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <ArrowUpRight className="w-4 h-4 text-rose-600" />
                      <span>Pengeluaran (Biaya)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormTx(prev => ({ 
                        ...prev, 
                        type: 'pemasukan',
                        category: 'Dana Kemahasiswaan Fakultas'
                      }))}
                      className={`min-h-[42px] py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-2 active:scale-95 ${
                        formTx.type === 'pemasukan'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-black shadow-2xs ring-2 ring-emerald-400/20'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
                      <span>Pemasukan (Dana)</span>
                    </button>
                  </div>
                </div>

                {/* 3. Kategori Biaya / Sumber */}
                <div>
                  <label className="font-bold text-slate-800 block mb-1.5">
                    Kategori {formTx.type === 'pemasukan' ? 'Sumber Penerimaan' : 'Pos Belanja'}
                  </label>
                  <DropdownSelect
                    value={formTx.category}
                    onChange={(val) => setFormTx(prev => ({ ...prev, category: val }))}
                    options={formTx.type === 'pemasukan' ? [
                      { value: 'Dana Kemahasiswaan Fakultas', label: 'Dana Kemahasiswaan Fakultas' },
                      { value: 'Sponsorship Mitra', label: 'Sponsorship Mitra' },
                      { value: 'Iuran Pimpinan Parlemen', label: 'Iuran Pimpinan Parlemen' },
                      { value: 'Iuran Wajib Anggota DPM', label: 'Iuran Wajib Anggota DPM' },
                      { value: 'Kas Operasional Parlemen', label: 'Kas Operasional Parlemen' },
                      { value: 'Hibah & Donatur Lainnya', label: 'Hibah & Donatur Lainnya' }
                    ] : [
                      { value: 'Konsumsi & Logistik Makanan', label: 'Konsumsi & Logistik Makanan' },
                      { value: 'Percetakan & Palu Sidang', label: 'Percetakan & Palu Sidang' },
                      { value: 'Sewa Sound & Mic Delegate', label: 'Sewa Sound & Mic Delegate' },
                      { value: 'Publikasi & Banner Panggung', label: 'Publikasi & Banner Panggung' },
                      { value: 'ATK & Kesekretariatan', label: 'ATK & Kesekretariatan' },
                      { value: 'Penggandaan Berkas Matriks', label: 'Penggandaan Berkas Matriks' },
                      { value: 'Uang Muka Ruang Auditorium', label: 'Uang Muka Ruang Auditorium' },
                      { value: 'Honorarium Pemateri', label: 'Honorarium Pemateri' },
                      { value: 'Biaya Tak Terduga', label: 'Biaya Tak Terduga' }
                    ]}
                    placeholder="Pilih Kategori"
                    triggerClassName="min-h-[44px] h-11 py-2 px-3 rounded-xl text-xs sm:text-sm bg-slate-50 hover:bg-white border-slate-200/90 w-full font-medium"
                    contentClassName="w-full z-50 shadow-xl"
                  />
                </div>

                {/* 4. Nominal dengan Live Format Rupiah (Anti-Khawatir Angka Nol) */}
                <div className="p-3 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5 text-amber-600" />
                      <span>Nominal Transaksi (Rp)</span>
                    </label>
                    {formTx.nominal && Number(formTx.nominal) > 0 && (
                      <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/70 animate-in fade-in">
                        {formatRupiah(Number(formTx.nominal))}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">
                      Rp
                    </span>
                    <input
                      type="number"
                      required
                      placeholder="Contoh: 350000"
                      value={formTx.nominal}
                      onChange={(e) => setFormTx({ ...formTx, nominal: e.target.value })}
                      className="w-full min-h-[44px] h-11 pl-10 pr-3.5 rounded-xl border border-slate-200/90 bg-white font-bold text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-2xs"
                    />
                  </div>
                </div>

                {/* 5. Nomor Nota / Kwitansi */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Receipt className="w-3.5 h-3.5 text-slate-500" />
                      <span>Nomor Nota / Kwitansi</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-semibold bg-slate-100 px-2 py-0.5 rounded-full">Opsional</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Contoh: NOTA-KTR-442"
                    value={formTx.receiptNumber}
                    onChange={(e) => setFormTx({ ...formTx, receiptNumber: e.target.value })}
                    className="w-full min-h-[44px] h-11 px-3.5 rounded-xl border border-slate-200/90 bg-slate-50 hover:bg-white focus:bg-white font-medium text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-2xs"
                  />
                </div>

                {/* 6. Uraian Belanja */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-slate-800">Uraian / Keterangan Transaksi</label>
                    <span className="text-[10px] text-slate-400">{formTx.description.length} karakter</span>
                  </div>
                  <textarea
                    rows={3}
                    required
                    placeholder="Jelaskan secara ringkas peruntukan belanja atau sumber penerimaan..."
                    value={formTx.description}
                    onChange={(e) => setFormTx({ ...formTx, description: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200/90 bg-slate-50 hover:bg-white focus:bg-white font-medium text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-2xs"
                  />
                </div>

                {/* 7. Upload Foto Bukti Nota */}
                <div className="space-y-2 pt-1 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-blue-600" />
                      <span>Foto Bukti Fisik Nota / Kwitansi</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-semibold bg-slate-100 px-2 py-0.5 rounded-full">Opsional</span>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleTxFileChange}
                    accept="image/*"
                    className="hidden" 
                  />

                  {!formTx.receiptPhoto ? (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/70 hover:bg-blue-50/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-center gap-3 cursor-pointer transition text-slate-500 group active:scale-98"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 group-hover:border-blue-200 flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition shrink-0 shadow-2xs">
                        <Camera className="w-5 h-5" />
                      </div>
                      <div className="text-center sm:text-left">
                        <span className="text-xs font-bold text-slate-700 group-hover:text-blue-700 block leading-snug">
                          Klik untuk unggah foto nota fisik / struk belanja
                        </span>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          Format JPG, PNG, atau WebP (Maksimal 5 MB)
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-slate-200/90 rounded-2xl p-3 bg-slate-50/80 space-y-2.5 shadow-2xs">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <ImageIcon className="w-4 h-4 text-blue-600 shrink-0" />
                          <span className="font-bold text-xs text-slate-800 truncate max-w-[200px] sm:max-w-xs">
                            {formTx.receiptPhotoName} ({formTx.receiptPhotoSize})
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                          >
                            Ganti
                          </button>
                          <button
                            type="button"
                            onClick={handleRemoveTxPhoto}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="Hapus foto bukti"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-white max-h-36 flex items-center justify-center p-1.5 shadow-2xs">
                        <img 
                          src={formTx.receiptPhoto} 
                          alt="Preview Foto Bukti" 
                          className="w-full h-auto max-h-32 object-contain rounded-lg" 
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50 flex flex-col-reverse sm:flex-row justify-end gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsTxModalOpen(false)}
                  className="min-h-[42px] px-4 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 cursor-pointer active:scale-95 text-xs sm:text-sm transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="min-h-[42px] px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold cursor-pointer active:scale-95 text-xs sm:text-sm transition shadow-xs flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan Transaksi Kas</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: TAMBAH POS PROKER BARU (Anti-Fatigue UX) */}
      {isAddProkerModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Header Modal */}
            <div className="flex items-center justify-between p-4 sm:p-5 pb-3.5 border-b border-slate-100 bg-slate-50/60 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <FolderOpen className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">Buka Pos Program Kerja Baru</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Daftarkan pos kegiatan untuk mencatat arus kas dan anggaran</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsAddProkerModalOpen(false)} 
                className="w-9 h-9 min-h-[36px] min-w-[36px] flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer active:scale-95 transition"
                aria-label="Tutup"
              >
                ✕
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleAddProker} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-sm flex-1">
                {/* 1. Nama Proker */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-slate-800">Nama Program Kerja</label>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">Wajib</span>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Diskusi Publik Peraturan Mahasiswa"
                    value={formNewProker.title}
                    onChange={(e) => setFormNewProker({ ...formNewProker, title: e.target.value })}
                    className="w-full min-h-[44px] h-11 px-3.5 rounded-xl border border-slate-200/90 bg-slate-50 hover:bg-white focus:bg-white font-medium text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-2xs"
                  />
                </div>

                {/* 2. Target Anggaran (RAB) dengan Live Format Rupiah */}
                <div className="p-3 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5 text-blue-600" />
                      <span>Target Anggaran (RAB Rp)</span>
                    </label>
                    {formNewProker.rabTarget && Number(formNewProker.rabTarget) > 0 && (
                      <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/70">
                        {formatRupiah(Number(formNewProker.rabTarget))}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">
                      Rp
                    </span>
                    <input
                      type="number"
                      placeholder="Contoh: 2500000"
                      value={formNewProker.rabTarget}
                      onChange={(e) => setFormNewProker({ ...formNewProker, rabTarget: e.target.value })}
                      className="w-full min-h-[44px] h-11 pl-10 pr-3.5 rounded-xl border border-slate-200/90 bg-white font-bold text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-2xs"
                    />
                  </div>
                </div>

                {/* 3. Periode & PIC */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1.5">Periode Pelaksanaan</label>
                    <input
                      type="text"
                      placeholder="Contoh: 05 - 07 Des 2026"
                      value={formNewProker.period}
                      onChange={(e) => setFormNewProker({ ...formNewProker, period: e.target.value })}
                      className="w-full min-h-[44px] h-11 px-3.5 rounded-xl border border-slate-200/90 bg-slate-50 hover:bg-white focus:bg-white font-medium text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1.5">PIC / Bendahara Proker</label>
                    <input
                      type="text"
                      placeholder="Contoh: Siti Nurhaliza (Bendahara)"
                      value={formNewProker.pic}
                      onChange={(e) => setFormNewProker({ ...formNewProker, pic: e.target.value })}
                      className="w-full min-h-[44px] h-11 px-3.5 rounded-xl border border-slate-200/90 bg-slate-50 hover:bg-white focus:bg-white font-medium text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-2xs"
                    />
                  </div>
                </div>

                {/* 4. Deskripsi Singkat */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-slate-800">Deskripsi Agenda Kegiatan</label>
                    <span className="text-[10px] text-slate-400 font-semibold bg-slate-100 px-2 py-0.5 rounded-full">Opsional</span>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Jelaskan gambaran umum agenda kegiatan dan ruang lingkup pembukuannya..."
                    value={formNewProker.description}
                    onChange={(e) => setFormNewProker({ ...formNewProker, description: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200/90 bg-slate-50 hover:bg-white focus:bg-white font-medium text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-2xs"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50 flex flex-col-reverse sm:flex-row justify-end gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAddProkerModalOpen(false)}
                  className="min-h-[42px] px-4 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 cursor-pointer active:scale-95 text-xs sm:text-sm transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="min-h-[42px] px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold cursor-pointer active:scale-95 text-xs sm:text-sm transition shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Buat Proker Baru</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* MODAL 3: PREVIEW FOTO BUKTI / KWITANSI */}
      {selectedPreviewImage && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in"
          onClick={() => setSelectedPreviewImage(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-5 shadow-2xl border border-slate-100 space-y-3 animate-in zoom-in-95"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">Foto Bukti Nota / Kwitansi</h4>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  {selectedPreviewImage.nota ? `Nomor: ${selectedPreviewImage.nota}` : selectedPreviewImage.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPreviewImage(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900/5 flex items-center justify-center p-2 max-h-[70vh]">
              <img 
                src={selectedPreviewImage.url} 
                alt="Bukti Foto Nota" 
                className="w-full h-auto max-h-[65vh] object-contain rounded-lg shadow-xs" 
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
              <span className="text-slate-500 font-medium truncate max-w-xs">{selectedPreviewImage.desc}</span>
              <button
                type="button"
                onClick={() => setSelectedPreviewImage(null)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
