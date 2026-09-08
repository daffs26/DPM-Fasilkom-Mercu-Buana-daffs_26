import React, { useState, useEffect, useRef } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  FileText, 
  User, 
  Wallet,
  FileCheck
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { formatRupiah, getStatusBadge } from '../../utils/formatters';

// Tab Sub-Components
import DetailOverviewTab from './detail-proker/DetailOverviewTab';
import DetailPanitiaTab from './detail-proker/DetailPanitiaTab';
import DetailRundownTab from './detail-proker/DetailRundownTab';
import DetailRabTab from './detail-proker/DetailRabTab';
import DetailLpjTab from './detail-proker/DetailLpjTab';
import ReceiptPreviewModal from './detail-proker/ReceiptPreviewModal';

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
  const [newPanitia, setNewPanitia] = useState({ role: '', name: '', division: '', contact: '' });

  // Local states for Rundown
  const [rundownItems, setRundownItems] = useState(defaultRundown);
  const [isAddingRundown, setIsAddingRundown] = useState(false);
  const [newRundownList, setNewRundownList] = useState([{ time: '', session: '', pic: '', note: '' }]);
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
    subtotal: '',
    link: '',
    receiptPhoto: null,
    receiptName: '',
    receiptSize: ''
  });
  const [previewRabReceipt, setPreviewRabReceipt] = useState(null);
  const rabReceiptInputRef = useRef(null);

  const handleRabReceiptChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran berkas bukti pembayaran terlalu besar! Maksimal 5 MB.');
      return;
    }

    const sizeInKb = Math.round(file.size / 1024);
    const sizeStr = sizeInKb > 1024 ? `${(sizeInKb / 1024).toFixed(1)} MB` : `${sizeInKb} KB`;

    const reader = new FileReader();
    reader.onload = (event) => {
      setNewRab(prev => ({
        ...prev,
        receiptPhoto: event.target.result,
        receiptName: file.name,
        receiptSize: sizeStr
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveRabReceipt = () => {
    setNewRab(prev => ({
      ...prev,
      receiptPhoto: null,
      receiptName: '',
      receiptSize: ''
    }));
    if (rabReceiptInputRef.current) rabReceiptInputRef.current.value = '';
  };

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

  const statusBadge = getStatusBadge(proker.status);

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
      subtotal: rawSubtotal,
      link: newRab.link?.trim() || '',
      receiptPhoto: newRab.receiptPhoto || null,
      receiptName: newRab.receiptName || '',
      receiptSize: newRab.receiptSize || ''
    }];
    setRabItems(updated);
    const calculatedTotal = updated.reduce((acc, curr) => acc + (curr.subtotal || 0), 0);
    updateProkerDetails(proker.id, { 
      rabBreakdown: updated,
      rab: calculatedTotal
    });
    setNewRab({
      pos: '',
      desc: '',
      subtotal: '',
      link: '',
      receiptPhoto: null,
      receiptName: '',
      receiptSize: ''
    });
    if (rabReceiptInputRef.current) rabReceiptInputRef.current.value = '';
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
    <>
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
                Anggaran: {formatRupiah(totalRabCurrent)}
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
            {activeTab === 'deskripsi' && (
              <DetailOverviewTab
                proker={proker}
                isEditingDeskripsi={isEditingDeskripsi}
                setIsEditingDeskripsi={setIsEditingDeskripsi}
                deskripsiText={deskripsiText}
                setDeskripsiText={setDeskripsiText}
                defaultDeskripsi={defaultDeskripsi}
                tujuanItems={tujuanItems}
                setTujuanItems={setTujuanItems}
                defaultTujuan={defaultTujuan}
                newTujuanInput={newTujuanInput}
                setNewTujuanInput={setNewTujuanInput}
                handleSaveDeskripsiTujuan={handleSaveDeskripsiTujuan}
                handleDeleteTujuan={handleDeleteTujuan}
                handleAddTujuan={handleAddTujuan}
              />
            )}

            {activeTab === 'panitia' && (
              <DetailPanitiaTab
                panitiaItems={panitiaItems}
                isAddingPanitia={isAddingPanitia}
                setIsAddingPanitia={setIsAddingPanitia}
                newPanitia={newPanitia}
                setNewPanitia={setNewPanitia}
                handleAddPanitia={handleAddPanitia}
                handleDeletePanitia={handleDeletePanitia}
              />
            )}

            {activeTab === 'rundown' && (
              <DetailRundownTab
                rundownItems={rundownItems}
                isAddingRundown={isAddingRundown}
                setIsAddingRundown={setIsAddingRundown}
                newRundownList={newRundownList}
                setNewRundownList={setNewRundownList}
                availableDays={availableDays}
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
                formTargetDay={formTargetDay}
                setFormTargetDay={setFormTargetDay}
                handleAddDay={handleAddDay}
                handleDeleteDay={handleDeleteDay}
                handleAddSessionRow={handleAddSessionRow}
                handleRemoveSessionRow={handleRemoveSessionRow}
                handleSessionChange={handleSessionChange}
                handleAddRundown={handleAddRundown}
                handleDeleteRundown={handleDeleteRundown}
                handlePrintRundown={handlePrintRundown}
              />
            )}

            {activeTab === 'rab' && (
              <DetailRabTab
                totalRabCurrent={totalRabCurrent}
                realisasiDana={realisasiDana}
                selisihRab={selisihRab}
                rabItems={rabItems}
                isAddingRab={isAddingRab}
                setIsAddingRab={setIsAddingRab}
                newRab={newRab}
                setNewRab={setNewRab}
                rabReceiptInputRef={rabReceiptInputRef}
                handleRabReceiptChange={handleRabReceiptChange}
                handleRemoveRabReceipt={handleRemoveRabReceipt}
                handleAddRab={handleAddRab}
                handleDeleteRab={handleDeleteRab}
                setPreviewRabReceipt={setPreviewRabReceipt}
              />
            )}

            {activeTab === 'lpj' && (
              <DetailLpjTab
                proker={proker}
                isLPJUploaded={isLPJUploaded}
                isLPJOverdue={isLPJOverdue}
                lpjDeadline={lpjDeadline}
                onAuditLPJ={onAuditLPJ}
                onReviewProposal={onReviewProposal}
                toggleProposalRevisionItem={toggleProposalRevisionItem}
              />
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

      {/* Modal Pratinjau Foto Bukti Pembayaran RAB */}
      <ReceiptPreviewModal
        previewRabReceipt={previewRabReceipt}
        onClose={() => setPreviewRabReceipt(null)}
      />
    </>
  );
}
