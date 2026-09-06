import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  User, 
  Phone, 
  ShieldCheck, 
  Download, 
  Plus, 
  Trash2, 
  Edit3,
  Wallet,
  Coins,
  ChevronRight,
  ExternalLink,
  Receipt,
  FileCheck,
  Sparkles,
  ClipboardList,
  Save,
  Printer,
  X,
  CheckSquare,
  Square,
  ListTodo,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function DetailProkerModal({ 
  isOpen, 
  onClose, 
  proker, 
  onAuditLPJ, 
  onReviewProposal,
  onPrintRundown
}) {
  const { ormawas, updateProkerDetails, toggleProposalRevisionItem } = useStore();
  const [activeTab, setActiveTab] = useState('deskripsi'); // 'deskripsi' | 'panitia' | 'rundown' | 'rab' | 'lpj'

  // Default values
  const defaultDeskripsi = proker?.description || 
    `Program kerja resmi yang diselenggarakan oleh ${proker?.ormawaId?.toUpperCase() || 'Ormawa'} untuk memperkuat koordinasi, kompetensi, dan capaian target organisasi mahasiswa Fakultas Ilmu Komputer Universitas Mercu Buana. Kegiatan ini dirancang terstruktur dengan memperhatikan efisiensi anggaran dan kepatuhan terhadap regulasi DPM FASILKOM.`;

  const defaultTujuan = [
    'Menetapkan pedoman dan strategi pelaksanaan program kerja organisasi.',
    'Meningkatkan transparansi, akuntabilitas, dan sinergi antar fungsionaris ormawa.',
    'Memfasilitasi aspirasi serta kebutuhan pengembangan kapasitas mahasiswa Fasilkom.',
    'Menghasilkan output kegiatan yang terukur dan berdampak nyata bagi sivitas akademika.'
  ];

  const defaultPanitia = [
    { role: 'Ketua Pelaksana', name: proker?.pic || 'Penanggung Jawab', contact: proker?.picContact || '0812-9876-5432', division: 'BPH Panitia' },
    { role: 'Sekretaris Pelaksana', name: 'Aisyah Putri', contact: '0813-1122-3344', division: 'Kesekretariatan' },
    { role: 'Bendahara Pelaksana', name: 'Rian Pratama', contact: '0812-5566-7788', division: 'Keuangan' },
    { role: 'Koordinator Sie Acara', name: 'Dimas Aditya', contact: '0819-3344-5566', division: 'Divisi Acara' },
    { role: 'Koordinator Perlengkapan', name: 'Fajar Nugraha', contact: '0857-7788-9900', division: 'Divisi Logistik' },
    { role: 'Koordinator Konsumsi', name: 'Nabila Zahra', contact: '0821-4455-6677', division: 'Divisi Konsumsi' },
    { role: 'Koordinator Humas & PDD', name: 'Kevin Sanjaya', contact: '0878-9900-1122', division: 'Divisi Humas & Dokumentasi' }
  ];

  const defaultRundown = [
    { time: '08:00 - 08:30', session: 'Registrasi & Presensi Peserta', pic: 'Kesekretariatan', note: 'Pengecekan daftar hadir dan pembagian name tag peserta' },
    { time: '08:30 - 09:00', session: 'Pembukaan & Menyanyikan Indonesia Raya', pic: 'Sie Acara & MC', note: 'Menyanyikan lagu kebangsaan dipandu dirigen' },
    { time: '09:00 - 09:30', session: 'Sambutan Ketua Pelaksana & BPH Ormawa', pic: proker?.pic || 'Ketua Panitia', note: 'Laporan kesiapan dan sambutan perwakilan ormawa' },
    { time: '09:30 - 11:30', session: 'Sesi Inti / Sidang Pleno / Materi Acara', pic: 'Presidium / Narasumber', note: 'Pelaksanaan agenda inti sesuai jadwal' },
    { time: '11:30 - 12:30', session: 'ISHOMA (Istirahat, Sholat, Makan)', pic: 'Sie Konsumsi & Logistik', note: 'Pembagian konsumsi makan siang dan ibadah' },
    { time: '12:30 - 14:00', session: 'Sesi Diskusi, Tanya Jawab & Pleno', pic: 'Sie Acara', note: 'Pembahasan draft hasil dan perumusan keputusan' },
    { time: '14:00 - 14:30', session: 'Evaluasi Panitia, Foto Bersama & Penutupan', pic: 'PDD & MC', note: 'Foto dokumentasi seluruh peserta dan penutupan resmi' }
  ];

  const totalRabInitial = proker?.rab || 500000;
  const defaultRabBreakdown = [
    { pos: 'Kesekretariatan & Administrasi', desc: 'Penggandaan dokumen, map, cetak notulensi, ID Card', subtotal: Math.round(totalRabInitial * 0.15) },
    { pos: 'Konsumsi Peserta & Panitia', desc: 'Snack box, air mineral, dan makan siang panitia', subtotal: Math.round(totalRabInitial * 0.45) },
    { pos: 'Perlengkapan, Tempat & Sound', desc: 'Sewa perlengkapan pendukung, kabel, banner', subtotal: Math.round(totalRabInitial * 0.25) },
    { pos: 'Publikasi, Dokumentasi & P3K', desc: 'Cetak spanduk panggung, obat-obatan cadangan', subtotal: Math.round(totalRabInitial * 0.10) },
    { pos: 'Dana Operasional Tak Terduga', desc: 'Biaya darurat kebutuhan mendesak hari-H', subtotal: totalRabInitial - (Math.round(totalRabInitial * 0.15) + Math.round(totalRabInitial * 0.45) + Math.round(totalRabInitial * 0.25) + Math.round(totalRabInitial * 0.10)) }
  ];

  // Local states for editing Deskripsi & Tujuan
  const [isEditingDeskripsi, setIsEditingDeskripsi] = useState(false);
  const [deskripsiText, setDeskripsiText] = useState(defaultDeskripsi);
  const [tujuanItems, setTujuanItems] = useState(defaultTujuan);
  const [newTujuanInput, setNewTujuanInput] = useState('');

  // Local states for Kepanitiaan
  const [panitiaItems, setPanitiaItems] = useState(defaultPanitia);
  const [isAddingPanitia, setIsAddingPanitia] = useState(false);
  const [newPanitia, setNewPanitia] = useState({
    role: '',
    name: '',
    division: '',
    contact: ''
  });

  // Local states for Rundown
  const [rundownItems, setRundownItems] = useState(defaultRundown);
  const [isAddingRundown, setIsAddingRundown] = useState(false);
  const [newRundownList, setNewRundownList] = useState([
    { time: '', session: '', pic: '', note: '' }
  ]);
  const [customDays, setCustomDays] = useState([1]);
  const [selectedDay, setSelectedDay] = useState('all'); // 'all' | 1 | 2 ...
  const [formTargetDay, setFormTargetDay] = useState(1);

  // Available days: distinct days from items + customDays + [1]
  const availableDays = Array.from(new Set([
    ...rundownItems.map(r => Number(r.day) || 1),
    ...customDays,
    1
  ])).sort((a, b) => a - b);

  // Local states for RAB
  const [rabItems, setRabItems] = useState(defaultRabBreakdown);
  const [isAddingRab, setIsAddingRab] = useState(false);
  const [newRab, setNewRab] = useState({
    pos: '',
    desc: '',
    subtotal: ''
  });

  // Sync state whenever proker changes
  useEffect(() => {
    if (proker) {
      setDeskripsiText(proker.description || defaultDeskripsi);
      setTujuanItems(proker.tujuan || defaultTujuan);
      setPanitiaItems(proker.kepanitiaan || defaultPanitia);
      setRundownItems(proker.rundown || defaultRundown);
      setRabItems(proker.rabBreakdown || defaultRabBreakdown);
      setIsEditingDeskripsi(false);
      setIsAddingPanitia(false);
      setIsAddingRundown(false);
      setIsAddingRab(false);
      setNewRundownList([{ time: '', session: '', pic: '', note: '' }]);
      setSelectedDay('all');
      setFormTargetDay(1);
      const daysInProker = Array.from(new Set((proker.rundown || defaultRundown).map(r => Number(r.day) || 1)));
      setCustomDays(daysInProker.length > 0 ? daysInProker : [1]);
    }
  }, [proker]);

  if (!isOpen || !proker) return null;

  const ormawa = ormawas.find(o => o.id === proker.ormawaId) || {
    name: proker.ormawaId?.toUpperCase() || 'Ormawa',
    shortName: proker.ormawaId?.toUpperCase() || 'Ormawa',
    color: { primary: '#2563EB', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
    logo: ''
  };

  const totalRabCurrent = rabItems.reduce((acc, curr) => acc + (Number(curr.subtotal) || 0), 0) || proker.rab || 500000;
  const realisasiDana = proker.realisasiDana || 0;
  const selisihRab = totalRabCurrent - realisasiDana;

  const lpjDeadline = proker.lpj?.deadlineDate || 'H+14 setelah acara';
  const isLPJUploaded = !!proker.lpj?.fileName;
  const isLPJOverdue = !isLPJUploaded && proker.lpj?.deadlineDate && new Date() > new Date(proker.lpj.deadlineDate);

  // Status Badge Helper
  const getStatusBadge = () => {
    switch (proker.status) {
      case 'completed':
        return { label: 'Proker Selesai', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'proposal_approved':
        return { label: 'Proposal Disetujui', color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'proposal_revisi':
        return { label: 'Perlu Revisi', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'proposal_pending':
        return { label: 'Menunggu Review', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      default:
        return { label: 'Draft Proker', color: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const statusBadge = getStatusBadge();

  // --- Handlers: Deskripsi & Tujuan ---
  const handleSaveDeskripsiTujuan = () => {
    const cleanedTujuan = tujuanItems.filter(t => t.trim().length > 0);
    updateProkerDetails(proker.id, {
      description: deskripsiText.trim(),
      tujuan: cleanedTujuan
    });
    setTujuanItems(cleanedTujuan);
    setIsEditingDeskripsi(false);
  };

  const handleAddTujuan = () => {
    if (!newTujuanInput.trim()) return;
    setTujuanItems([...tujuanItems, newTujuanInput.trim()]);
    setNewTujuanInput('');
  };

  const handleDeleteTujuan = (idx) => {
    setTujuanItems(tujuanItems.filter((_, i) => i !== idx));
  };

  // --- Handlers: Kepanitiaan ---
  const handleAddPanitia = (e) => {
    e.preventDefault();
    if (!newPanitia.name.trim() || !newPanitia.role.trim()) {
      alert('Nama dan Jabatan Panitia wajib diisi!');
      return;
    }
    const updated = [...panitiaItems, {
      role: newPanitia.role.trim(),
      name: newPanitia.name.trim(),
      division: newPanitia.division.trim() || 'Panitia Pelaksana',
      contact: newPanitia.contact.trim() || '0812-xxxx-xxxx'
    }];
    setPanitiaItems(updated);
    updateProkerDetails(proker.id, { kepanitiaan: updated });
    setNewPanitia({ role: '', name: '', division: '', contact: '' });
    setIsAddingPanitia(false);
  };

  const handleDeletePanitia = (idx) => {
    const updated = panitiaItems.filter((_, i) => i !== idx);
    setPanitiaItems(updated);
    updateProkerDetails(proker.id, { kepanitiaan: updated });
  };

  // --- Handlers: Rundown ---
  const handleAddDay = () => {
    const nextDay = Math.max(...availableDays, 0) + 1;
    setCustomDays(prev => [...prev, nextDay]);
    setSelectedDay(nextDay);
    setFormTargetDay(nextDay);
    setIsAddingRundown(true);
    setNewRundownList([{ time: '', session: '', pic: '', note: '' }]);
  };

  const handleDeleteDay = (dayToDelete) => {
    if (dayToDelete === 1 && availableDays.length === 1) {
      alert('Hari 1 adalah hari utama kegiatan dan tidak dapat dihapus.');
      return;
    }
    const updated = rundownItems.filter(r => (Number(r.day) || 1) !== dayToDelete);
    setRundownItems(updated);
    setCustomDays(prev => prev.filter(d => d !== dayToDelete));
    updateProkerDetails(proker.id, { rundown: updated });
    setSelectedDay('all');
  };

  const handlePrintRundown = () => {
    const docData = {
      type: 'rundown',
      proker,
      ormawa,
      title: proker.title,
      ormawaName: ormawa.name,
      groupedDays: availableDays.map(d => ({
        dayNum: d,
        items: rundownItems.filter(r => (Number(r.day) || 1) === d)
      }))
    };
    if (onPrintRundown) {
      onPrintRundown(docData);
    } else {
      window.print();
    }
  };

  const handleAddSessionRow = () => {
    setNewRundownList(prev => [
      ...prev,
      { time: '', session: '', pic: '', note: '' }
    ]);
  };

  const handleRemoveSessionRow = (index) => {
    if (newRundownList.length <= 1) return;
    setNewRundownList(prev => prev.filter((_, i) => i !== index));
  };

  const handleSessionChange = (index, field, value) => {
    setNewRundownList(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddRundown = (e) => {
    e.preventDefault();
    const filledSessions = newRundownList.filter(s => s.time.trim() || s.session.trim());
    if (filledSessions.length === 0) {
      alert('Harap isi minimal 1 sesi dengan Jam Pelaksanaan dan Nama Sesi!');
      return;
    }

    const hasIncomplete = newRundownList.some(s => (s.time.trim() && !s.session.trim()) || (!s.time.trim() && s.session.trim()));
    if (hasIncomplete) {
      alert('Terdapat sesi yang belum lengkap. Harap lengkapi Jam Pelaksanaan dan Nama Sesi, atau hapus baris yang kosong.');
      return;
    }

    const targetDayNumber = Number(formTargetDay) || 1;
    const formatted = filledSessions.map(s => ({
      day: targetDayNumber,
      time: s.time.trim(),
      session: s.session.trim(),
      pic: s.pic.trim() || 'Sie Acara',
      note: s.note.trim()
    }));

    const updated = [...rundownItems, ...formatted];
    setRundownItems(updated);
    updateProkerDetails(proker.id, { rundown: updated });
    setNewRundownList([{ time: '', session: '', pic: '', note: '' }]);
    setIsAddingRundown(false);
  };

  const handleDeleteRundown = (idx) => {
    const updated = rundownItems.filter((_, i) => i !== idx);
    setRundownItems(updated);
    updateProkerDetails(proker.id, { rundown: updated });
  };

  // --- Handlers: RAB ---
  const handleAddRab = (e) => {
    e.preventDefault();
    const rawSubtotal = Number(String(newRab.subtotal).replace(/\D/g, '')) || 0;
    if (!newRab.pos.trim() || rawSubtotal <= 0) {
      alert('Nama Pos Anggaran dan Jumlah Biaya wajib diisi!');
      return;
    }
    const updated = [...rabItems, {
      pos: newRab.pos.trim(),
      desc: newRab.desc.trim() || 'Biaya operasional kegiatan',
      subtotal: rawSubtotal
    }];
    setRabItems(updated);
    const calculatedTotal = updated.reduce((acc, curr) => acc + (curr.subtotal || 0), 0);
    updateProkerDetails(proker.id, { 
      rabBreakdown: updated,
      rab: calculatedTotal
    });
    setNewRab({ pos: '', desc: '', subtotal: '' });
    setIsAddingRab(false);
  };

  const handleDeleteRab = (idx) => {
    const updated = rabItems.filter((_, i) => i !== idx);
    setRabItems(updated);
    const calculatedTotal = updated.reduce((acc, curr) => acc + (curr.subtotal || 0), 0);
    updateProkerDetails(proker.id, { 
      rabBreakdown: updated,
      rab: calculatedTotal
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[96vw] sm:max-w-3xl p-0 overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-2xl max-h-[92vh] flex flex-col">
        {/* Header Proker */}
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-5 pb-3 sm:pb-3.5 border-b border-slate-100 bg-slate-50/70 space-y-2 shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ormawa.color?.bg || 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                {ormawa.shortName}
              </span>
              <span className="text-xs text-slate-500 font-medium">Divisi: {proker.divisi || 'BPH'}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusBadge.color}`}>
                {statusBadge.label}
              </span>
            </div>

            <span className="text-xs font-black text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-xl shadow-2xs">
              Anggaran: Rp {totalRabCurrent.toLocaleString('id-ID')}
            </span>
          </div>

          <DialogTitle className="text-base sm:text-xl font-black text-slate-900 tracking-tight leading-snug">
            {proker.title}
          </DialogTitle>

          {/* Quick Meta Chips */}
          <div className="flex items-center gap-2 sm:gap-4 text-xs text-slate-600 flex-wrap pt-0.5">
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{proker.startDate} {proker.endDate && proker.endDate !== proker.startDate ? `s/d ${proker.endDate}` : ''}</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{proker.location || 'Kampus Fasilkom'}</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>{proker.targetPeserta || 0} Target Peserta</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>PJ: {proker.pic || '-'}</span>
            </span>
          </div>
        </DialogHeader>

        {/* Tab Bar Navigation */}
        <div className="px-3 sm:px-6 border-b border-slate-200/80 bg-white flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0">
          {[
            { id: 'deskripsi', label: 'Deskripsi & Tujuan', icon: FileText },
            { id: 'panitia', label: 'Kepanitiaan', icon: Users, badge: panitiaItems.length },
            { id: 'rundown', label: 'Rundown Acara', icon: Clock, badge: rundownItems.length },
            { id: 'rab', label: 'RAB & Anggaran', icon: Wallet },
            { id: 'lpj', label: 'LPJ & Proposal', icon: FileCheck, highlight: isLPJOverdue }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2.5 sm:py-3 px-2.5 sm:px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
                  isActive 
                    ? 'border-slate-900 text-slate-900' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tab.badge}
                  </span>
                )}
                {tab.highlight && (
                  <span className="w-2 h-2 rounded-full bg-red-500" title="LPJ Terlambat" />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="p-3.5 sm:p-6 text-xs max-h-[calc(90vh-180px)] overflow-y-auto space-y-4">
          
          {/* ========================================================================= */}
          {/* TAB 1: DESKRIPSI ACARA & TUJUAN ACARA                                     */}
          {/* ========================================================================= */}
          {activeTab === 'deskripsi' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900">Deskripsi &amp; Target Tujuan Acara</h4>
                  <p className="text-[11px] text-slate-500">Anda dapat mengubah dan menyesuaikan penjelasan serta butir tujuan kegiatan.</p>
                </div>
                {!isEditingDeskripsi ? (
                  <button
                    type="button"
                    onClick={() => setIsEditingDeskripsi(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition cursor-pointer self-start sm:self-auto"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Ubah Deskripsi &amp; Tujuan</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setDeskripsiText(proker.description || defaultDeskripsi);
                        setTujuanItems(proker.tujuan || defaultTujuan);
                        setIsEditingDeskripsi(false);
                      }}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100 transition cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveDeskripsiTujuan}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Simpan</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Deskripsi Kegiatan */}
              <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <h4 className="font-extrabold text-xs text-slate-900">Deskripsi &amp; Konsep Acara</h4>
                </div>
                {!isEditingDeskripsi ? (
                  <p className="text-slate-700 leading-relaxed text-xs whitespace-pre-line">
                    {deskripsiText}
                  </p>
                ) : (
                  <textarea
                    rows={4}
                    value={deskripsiText}
                    onChange={(e) => setDeskripsiText(e.target.value)}
                    placeholder="Tuliskan latar belakang dan gambaran umum program kerja ini..."
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                )}
              </div>

              {/* Tujuan Acara */}
              <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <h4 className="font-extrabold text-xs text-slate-900">Tujuan &amp; Output Kegiatan</h4>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">
                    {tujuanItems.length} Butir Tujuan
                  </span>
                </div>

                <div className="space-y-2">
                  {tujuanItems.map((t, idx) => (
                    <div key={`tujuan-${idx}`} className="flex items-start justify-between gap-2.5 p-2 rounded-xl bg-white border border-slate-200/60">
                      <div className="flex items-start gap-2.5 min-w-0 flex-1">
                        <span className="w-5 h-5 rounded-lg bg-emerald-50 text-emerald-700 font-extrabold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-xs text-slate-800 font-medium leading-normal">
                          {t}
                        </p>
                      </div>
                      {isEditingDeskripsi && (
                        <button
                          type="button"
                          onClick={() => handleDeleteTujuan(idx)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition shrink-0"
                          title="Hapus butir tujuan ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Input Tambah Butir Tujuan Baru saat mode edit */}
                  {isEditingDeskripsi && (
                    <div className="pt-2 flex items-center gap-2">
                      <input
                        type="text"
                        value={newTujuanInput}
                        onChange={(e) => setNewTujuanInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTujuan())}
                        placeholder="Ketik butir tujuan baru lalu tekan Enter atau klik Tambah..."
                        className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                      <button
                        type="button"
                        onClick={handleAddTujuan}
                        className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition flex items-center gap-1 shrink-0 shadow-2xs cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Rincian Teknis Pelaksanaan */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-white rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Bentuk Acara</span>
                  <span className="font-bold text-slate-900 text-xs mt-0.5 block">
                    Tatap Muka (Luring)
                  </span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Sasaran Peserta</span>
                  <span className="font-bold text-slate-900 text-xs mt-0.5 block">
                    Mahasiswa FASILKOM UMB
                  </span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Penanggung Jawab (PIC)</span>
                  <span className="font-bold text-slate-900 text-xs mt-0.5 block truncate">
                    {proker.pic || '-'} ({proker.picContact || 'Kontak BPH'})
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: SUSUNAN KEPANITIAAN                                                */}
          {/* ========================================================================= */}
          {activeTab === 'panitia' && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900">Struktur Panitia Pelaksana (OC)</h4>
                  <p className="text-[11px] text-slate-500">Daftar penanggung jawab dan pembagian divisi panitia kegiatan.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingPanitia(!isAddingPanitia)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Panitia</span>
                </button>
              </div>

              {/* Form Input Tambah Panitia Baru */}
              {isAddingPanitia && (
                <form onSubmit={handleAddPanitia} className="p-4 rounded-2xl border border-blue-200 bg-blue-50/50 space-y-3 animate-in fade-in-50">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-blue-900">Input Data Panitia Baru</span>
                    <button 
                      type="button" 
                      onClick={() => setIsAddingPanitia(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Jabatan / Role *</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Koordinator Acara, Bendahara, dll."
                        value={newPanitia.role}
                        onChange={(e) => setNewPanitia({ ...newPanitia, role: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Nama Mahasiswa *</label>
                      <input
                        type="text"
                        required
                        placeholder="Nama lengkap panitia"
                        value={newPanitia.name}
                        onChange={(e) => setNewPanitia({ ...newPanitia, name: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Divisi / Seksi</label>
                      <input
                        type="text"
                        placeholder="Contoh: Divisi Acara, Divisi Logistik"
                        value={newPanitia.division}
                        onChange={(e) => setNewPanitia({ ...newPanitia, division: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">No. WhatsApp / Kontak</label>
                      <input
                        type="text"
                        placeholder="0812-xxxx-xxxx"
                        value={newPanitia.contact}
                        onChange={(e) => setNewPanitia({ ...newPanitia, contact: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingPanitia(false)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
                    >
                      Simpan Panitia
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {panitiaItems.map((p, idx) => (
                  <div 
                    key={`panitia-${idx}`}
                    className="p-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition flex items-start justify-between gap-2 sm:gap-3 shadow-2xs group"
                  >
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-extrabold text-xs">
                        {p.name ? p.name.charAt(0) : 'P'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block truncate">
                          {p.role}
                        </span>
                        <h5 className="font-extrabold text-xs text-slate-900 truncate">
                          {p.name}
                        </h5>
                        <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                          {p.division}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <a 
                        href={`https://wa.me/${p.contact.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg hover:bg-emerald-100 transition"
                        title="Hubungi via WhatsApp"
                      >
                        <Phone className="w-3 h-3" />
                        <span className="hidden sm:inline">{p.contact}</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => handleDeletePanitia(idx)}
                        className="p-1 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        title="Hapus panitia ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: RUNDOWN ACARA (SUSUNAN JADWAL)                                     */}
          {/* ========================================================================= */}
          {activeTab === 'rundown' && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-1">
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900">Susunan Jadwal &amp; Rundown Kegiatan</h4>
                  <p className="text-[11px] text-slate-500">Atur urutan sesi jam kegiatan per hari dari pembukaan hingga penutupan.</p>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap shrink-0">
                  <button
                    type="button"
                    onClick={handlePrintRundown}
                    className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition cursor-pointer"
                    title="Cetak atau unduh dokumen rundown resmi"
                  >
                    <Printer className="w-3.5 h-3.5 text-blue-600" />
                    <span>Cetak Rundown</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleAddDay}
                    className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50/80 hover:bg-blue-100 text-blue-700 font-bold text-xs shadow-2xs transition cursor-pointer"
                    title="Tambah hari kegiatan (misal: Hari 2, Hari 3)"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Hari</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingRundown(!isAddingRundown);
                      setFormTargetDay(selectedDay === 'all' ? 1 : selectedDay);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Sesi</span>
                  </button>
                </div>
              </div>

              {/* Day Filter Bar */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 border-b border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedDay('all')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    selectedDay === 'all'
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>Semua Hari</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    selectedDay === 'all' ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {rundownItems.length}
                  </span>
                </button>

                {availableDays.map(d => {
                  const count = rundownItems.filter(r => (Number(r.day) || 1) === d).length;
                  const isSelected = selectedDay === d;
                  return (
                    <div key={`day-pill-${d}`} className="flex items-center gap-0.5">
                      <button
                        type="button"
                        onClick={() => setSelectedDay(d)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <Calendar className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                        <span>Hari {d}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isSelected ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {count}
                        </span>
                      </button>
                      {availableDays.length > 1 && d > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteDay(d)}
                          className="text-slate-300 hover:text-rose-500 p-1 transition cursor-pointer"
                          title={`Hapus Hari ${d}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Form Input Tambah Sesi Rundown Baru */}
              {isAddingRundown && (
                <form onSubmit={handleAddRundown} className="p-4 rounded-2xl border border-blue-200 bg-blue-50/50 space-y-3.5 animate-in fade-in-50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-blue-200/60">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-xs text-blue-900">Input Sesi Rundown Baru</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                        {newRundownList.length} Sesi Terbuka
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <div className="flex items-center gap-1 bg-white border border-blue-200 px-2 py-1 rounded-lg">
                        <span className="text-[10px] font-bold text-slate-600">Untuk:</span>
                        <select
                          value={formTargetDay}
                          onChange={(e) => setFormTargetDay(Number(e.target.value))}
                          className="text-xs font-bold text-blue-700 bg-transparent focus:outline-none cursor-pointer"
                        >
                          {availableDays.map(d => (
                            <option key={`sel-day-${d}`} value={d}>Hari {d}</option>
                          ))}
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddSessionRow}
                        className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition shadow-2xs cursor-pointer"
                        title="Tambah sesi baru dengan icon plus"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Sesi</span>
                      </button>
                      <button 
                        type="button" 
                        onClick={() => {
                          setNewRundownList([{ time: '', session: '', pic: '', note: '' }]);
                          setIsAddingRundown(false);
                        }}
                        className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-white/60 transition cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* List Blok Input Sesi */}
                  <div className="space-y-3">
                    {newRundownList.map((sessionItem, index) => (
                      <div 
                        key={`new-session-${index}`}
                        className="p-3.5 rounded-xl border border-blue-200/90 bg-white shadow-2xs space-y-2.5 relative"
                      >
                        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-blue-600 text-white font-black text-[10px] flex items-center justify-center">
                              {index + 1}
                            </span>
                            <span className="font-bold text-xs text-slate-800">
                              Sesi #{index + 1}
                            </span>
                          </div>
                          {newRundownList.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveSessionRow(index)}
                              className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-lg transition text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                              title="Hapus sesi ini dari form"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Hapus Sesi</span>
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <div>
                            <label className="text-[11px] font-bold text-slate-700 block mb-1">
                              Jam Pelaksanaan *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="Contoh: 08:00 - 09:00"
                              value={sessionItem.time}
                              onChange={(e) => handleSessionChange(index, 'time', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="text-[11px] font-bold text-slate-700 block mb-1">
                              Nama Sesi / Agenda *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="Contoh: Pembukaan & Sambutan Ketua Pelaksana"
                              value={sessionItem.session}
                              onChange={(e) => handleSessionChange(index, 'session', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-slate-700 block mb-1">
                              Penanggung Jawab (PJ)
                            </label>
                            <input
                              type="text"
                              placeholder="Contoh: Sie Acara / MC"
                              value={sessionItem.pic}
                              onChange={(e) => handleSessionChange(index, 'pic', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="text-[11px] font-bold text-slate-700 block mb-1">
                              Catatan / Keterangan Teknis
                            </label>
                            <input
                              type="text"
                              placeholder="Contoh: Mempersiapkan mic wireless dan proyektor"
                              value={sessionItem.note}
                              onChange={(e) => handleSessionChange(index, 'note', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1 border-t border-blue-200/60">
                    <span className="text-[11px] text-slate-500">
                      Total <strong>{newRundownList.length}</strong> sesi yang siap disimpan ke <strong>Hari {formTargetDay}</strong>.
                    </span>
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setNewRundownList([{ time: '', session: '', pic: '', note: '' }]);
                          setIsAddingRundown(false);
                        }}
                        className="w-full sm:w-auto px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100 cursor-pointer text-center"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="w-full sm:w-auto justify-center px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5 text-center"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Simpan {newRundownList.length > 1 ? `${newRundownList.length} Sesi` : 'Sesi'}</span>
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Rundown List per Hari */}
              <div className="space-y-4">
                {(selectedDay === 'all' ? availableDays : [selectedDay]).map(dayNum => {
                  const dayItems = rundownItems.filter(r => (Number(r.day) || 1) === dayNum);
                  return (
                    <div key={`rundown-day-group-${dayNum}`} className="space-y-2">
                      <div className="flex items-center justify-between pb-1 border-b border-slate-200/80">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-extrabold text-xs flex items-center justify-center">
                            H{dayNum}
                          </span>
                          <span className="font-extrabold text-xs text-slate-800">
                            Jadwal Kegiatan — Hari ke-{dayNum}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">
                            ({dayItems.length} Sesi)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setFormTargetDay(dayNum);
                            setIsAddingRundown(true);
                          }}
                          className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Tambah di Hari {dayNum}</span>
                        </button>
                      </div>

                      {dayItems.length === 0 ? (
                        <div className="p-4 rounded-2xl border border-dashed border-slate-200 text-center text-slate-400 text-xs">
                          Belum ada sesi di Hari {dayNum}. Klik <strong>Tambah di Hari {dayNum}</strong> untuk mengisi.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {dayItems.map((r, i) => {
                            const originalIdx = rundownItems.indexOf(r);
                            return (
                              <div 
                                key={`rundown-item-${dayNum}-${i}`}
                                className="p-3 rounded-2xl border border-slate-200/80 bg-white hover:bg-slate-50/60 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-2xs group"
                              >
                                <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                                  <div className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-800 font-mono font-bold text-[11px] shrink-0 border border-slate-200 flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-slate-500" />
                                    <span>{r.time}</span>
                                  </div>
                                  <div className="min-w-0">
                                    <h5 className="font-bold text-xs text-slate-900">{r.session}</h5>
                                    {r.note && (
                                      <p className="text-[10px] text-slate-500 mt-0.5">{r.note}</p>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                  <span className="text-[10px] font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
                                    PJ: {r.pic}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteRundown(originalIdx)}
                                    className="p-1 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                    title="Hapus sesi ini"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: RAB & ANGGARAN                                                     */}
          {/* ========================================================================= */}
          {activeTab === 'rab' && (
            <div className="space-y-4">
              {/* Ringkasan Finansial */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-2xl">
                  <span className="text-[10px] font-bold text-blue-700 uppercase block">Total Alokasi RAB</span>
                  <span className="font-black text-sm text-blue-950 mt-0.5 block">
                    Rp {totalRabCurrent.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl">
                  <span className="text-[10px] font-bold text-amber-700 uppercase block">Realisasi Kas Cair</span>
                  <span className="font-black text-sm text-amber-950 mt-0.5 block">
                    Rp {realisasiDana.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase block">Sisa Anggaran</span>
                  <span className="font-black text-sm text-emerald-950 mt-0.5 block">
                    Rp {Math.max(0, selisihRab).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Action Tambah Pos RAB */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h5 className="font-bold text-xs text-slate-900">Rincian Pos Pengeluaran RAB</h5>
                <button
                  type="button"
                  onClick={() => setIsAddingRab(!isAddingRab)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Pos RAB</span>
                </button>
              </div>

              {/* Form Input Tambah Pos RAB Baru */}
              {isAddingRab && (
                <form onSubmit={handleAddRab} className="p-4 rounded-2xl border border-blue-200 bg-blue-50/50 space-y-3 animate-in fade-in-50">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-blue-900">Input Pos Anggaran Baru</span>
                    <button 
                      type="button" 
                      onClick={() => setIsAddingRab(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Nama Pos Anggaran *</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Konsumsi Snack & Makan"
                        value={newRab.pos}
                        onChange={(e) => setNewRab({ ...newRab, pos: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Rincian Kebutuhan</label>
                      <input
                        type="text"
                        placeholder="Contoh: 50 box @ Rp 20.000"
                        value={newRab.desc}
                        onChange={(e) => setNewRab({ ...newRab, desc: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Jumlah Biaya (Rp) *</label>
                      <input
                        type="text"
                        required
                        placeholder="0"
                        value={newRab.subtotal ? Number(newRab.subtotal.replace(/\D/g, '')).toLocaleString('id-ID') : ''}
                        onChange={(e) => setNewRab({ ...newRab, subtotal: e.target.value.replace(/\D/g, '') })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingRab(false)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
                    >
                      Simpan Pos RAB
                    </button>
                  </div>
                </form>
              )}

              {/* Tabel Rincian Pos Pengeluaran RAB */}
              <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs">
                <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <h5 className="font-bold text-xs text-slate-900">Rincian Pos Anggaran Biaya (RAB)</h5>
                  <span className="text-[10px] font-bold text-slate-500">Standar Baku Keuangan DPM</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {rabItems.map((item, idx) => (
                    <div key={`rab-item-${idx}`} className="p-3 flex items-center justify-between gap-3 text-xs hover:bg-slate-50/50 group">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900">{item.pos}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-black text-slate-900 text-xs">
                          Rp {(item.subtotal || 0).toLocaleString('id-ID')}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteRab(idx)}
                          className="p-1 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Hapus pos RAB ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-slate-50/80 border-t border-slate-200 flex items-center justify-between font-black text-xs text-slate-900">
                  <span>TOTAL ESTIMASI RAB</span>
                  <span className="text-sm text-blue-700">Rp {totalRabCurrent.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: BERKAS LPJ & PROPOSAL                                              */}
          {/* ========================================================================= */}
          {activeTab === 'lpj' && (
            <div className="space-y-4">
              {/* Bagian LPJ */}
              <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <h4 className="font-extrabold text-xs text-slate-900">
                      Laporan Pertanggungjawaban (LPJ)
                    </h4>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isLPJUploaded 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : isLPJOverdue 
                      ? 'bg-red-50 text-red-700 border-red-300' 
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {isLPJUploaded ? 'LPJ Sudah Diunggah' : isLPJOverdue ? 'Terlambat (> H+14)' : 'Menunggu LPJ'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200/60">
                    <span className="text-[10px] text-slate-400 font-bold block">Tenggat Waktu SLA LPJ:</span>
                    <span className="font-bold text-slate-800">{lpjDeadline}</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200/60">
                    <span className="text-[10px] text-slate-400 font-bold block">Status Skor Audit DPM:</span>
                    <span className="font-black text-slate-900">
                      {proker.lpj?.auditScore ? `${proker.lpj.auditScore} / 100 (Lulus Audit)` : 'Belum Diaudit'}
                    </span>
                  </div>
                </div>

                {proker.lpj?.fileName && (
                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="font-bold text-slate-900 block">{proker.lpj.fileName}</span>
                        <span className="text-[10px] text-slate-400">Diunggah: {proker.lpj.uploadDate || '-'}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => alert(`Mengunduh file: ${proker.lpj.fileName}`)}
                      className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Unduh</span>
                    </button>
                  </div>
                )}

                <div className="pt-1 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => onAuditLPJ && onAuditLPJ(proker)}
                    className="w-full sm:w-auto justify-center px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer text-center"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{proker.lpj?.auditScore ? 'Lihat Lembar Audit LPJ' : 'Buka Form Audit LPJ'}</span>
                  </button>
                </div>
              </div>

              {/* Bagian Proposal */}
              <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <h4 className="font-extrabold text-xs text-slate-900">
                      Berkas Proposal Kegiatan
                    </h4>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    proker.status === 'proposal_revisi' || proker.proposal?.reviewStatus === 'revisi'
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : proker.proposal?.reviewStatus === 'approved'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : proker.proposal?.fileName 
                      ? 'bg-blue-50 text-blue-700 border-blue-200' 
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {proker.status === 'proposal_revisi' || proker.proposal?.reviewStatus === 'revisi'
                      ? '⚠️ Perlu Revisi DPM'
                      : proker.proposal?.reviewStatus === 'approved'
                      ? '✓ Proposal Disetujui (ACC)'
                      : proker.proposal?.fileName 
                      ? 'Menunggu Review' 
                      : 'Belum Ada Berkas'}
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                    <div className="min-w-0">
                      <span className="font-bold text-slate-900 block truncate text-xs">
                        {proker.proposal?.fileName || 'Proposal_Kegiatan.pdf'}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {proker.proposal?.uploadDate ? `Diunggah: ${proker.proposal.uploadDate} • ${proker.proposal?.fileSize || '2.4 MB'}` : 'Menunggu pengunggahan berkas sah'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {proker.proposal?.fileName && (
                      <button
                        type="button"
                        onClick={() => alert(`Mengunduh file: ${proker.proposal.fileName}`)}
                        className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1 transition"
                      >
                        <Download className="w-3 h-3 text-slate-500" />
                        <span>Unduh</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onReviewProposal && onReviewProposal(proker)}
                      className="w-full sm:w-auto justify-center px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{proker.proposal?.fileName ? 'Review & Validasi' : 'Upload Proposal'}</span>
                    </button>
                  </div>
                </div>

                {/* Checklist Poin Revisi DPM (Jika Ada) */}
                {((proker.proposal?.revisionItems && proker.proposal.revisionItems.length > 0) || proker.status === 'proposal_revisi') && (
                  <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-amber-900">
                        <ListTodo className="w-3.5 h-3.5 text-amber-600" />
                        <span>Daftar Poin Revisi dari DPM:</span>
                      </div>
                      {proker.proposal?.revisionItems?.length > 0 && (
                        <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100/70 border border-amber-300 px-2 py-0.5 rounded-full">
                          {proker.proposal.revisionItems.filter(i => i.completed).length} dari {proker.proposal.revisionItems.length} Selesai
                        </span>
                      )}
                    </div>

                    {proker.proposal?.revisionItems && proker.proposal.revisionItems.length > 0 ? (
                      <div className="space-y-1.5">
                        {proker.proposal.revisionItems.map((item, idx) => (
                          <div
                            key={item.id || idx}
                            onClick={() => toggleProposalRevisionItem(proker.id, item.id)}
                            className={`p-2.5 rounded-lg border transition cursor-pointer flex items-start gap-2 select-none ${
                              item.completed 
                                ? 'bg-emerald-50/60 border-emerald-200 text-slate-500' 
                                : 'bg-white border-amber-200/80 text-slate-900 shadow-2xs hover:border-amber-400'
                            }`}
                          >
                            <span className="mt-0.5 shrink-0">
                              {item.completed ? (
                                <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Square className="w-3.5 h-3.5 text-amber-500" />
                              )}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs ${item.completed ? 'line-through text-slate-400 font-normal' : 'font-semibold text-slate-800'}`}>
                                {item.text}
                              </p>
                              <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                                <span>Oleh {item.addedBy || 'DPM'}</span>
                                {item.completed && (
                                  <span className="text-emerald-700 font-bold">✓ Selesai Diperbaiki</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-amber-800 italic">
                        Proposal ditandai perlu revisi. DPM belum menambahkan butir spesifik di checklist.
                      </p>
                    )}

                    {/* Catatan Umum DPM */}
                    {proker.proposal?.notes && proker.proposal.notes.length > 0 && (
                      <div className="pt-2 border-t border-amber-200/60 text-[11px] text-slate-600 space-y-1">
                        <span className="font-bold text-slate-700 block">Catatan Umum DPM:</span>
                        {proker.proposal.notes.slice(-2).map((n) => (
                          <p key={n.id} className="bg-white/80 p-2 rounded-lg border border-amber-100 text-slate-700">
                            <strong>{n.author}:</strong> "{n.text}"
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <DialogFooter className="px-4 sm:px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between gap-2">
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            SIWASMA DPM FASILKOM • Rincian Program Kerja
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition shadow-xs cursor-pointer text-center"
          >
            Tutup
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
