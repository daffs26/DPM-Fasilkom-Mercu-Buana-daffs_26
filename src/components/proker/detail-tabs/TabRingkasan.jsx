import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { 
  FileText, 
  Target, 
  Edit3, 
  Edit2,
  Trash2, 
  Plus, 
  Save, 
  Lock,
  Check,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

const PRESET_TUJUAN_OPTIONS = [
  'Meningkatkan kompetensi teknis dan soft skill mahasiswa Fasilkom',
  'Mencapai tingkat partisipasi aktif minimal 100 mahasiswa',
  'Menghasilkan luaran modul dan arsip dokumentasi resmi',
  'Mencapai indeks kepuasan peserta survei evaluasi minimal 85%',
  'Memperluas jejaring profesional dan kolaborasi eksternal'
];

export default function DetailOverviewTab({
  proker,
  isEditingDeskripsi,
  setIsEditingDeskripsi,
  deskripsiText,
  setDeskripsiText,
  defaultDeskripsi,
  tujuanItems,
  setTujuanItems,
  defaultTujuan,
  newTujuanInput,
  setNewTujuanInput,
  handleSaveDeskripsiTujuan,
  handleDeleteTujuan,
  handleAddTujuan
}) {
  const currentUser = useStore(state => state.currentUser);
  const ormawas = useStore(state => state.ormawas);
  const updateProkerDetails = useStore(state => state.updateProkerDetails);
  const isGuest = currentUser?.role === 'guest';

  // Role creator check:
  // Hanya role / pengurus Ormawa yang membuat proker tersebut yang dapat mengkustomisasi
  const isCreator = !isGuest && (
    currentUser?.ormawaId === proker?.ormawaId || 
    (proker?.createdBy && (currentUser?.username === proker?.createdBy || currentUser?.id === proker?.createdBy))
  );

  const prokerOrmawa = ormawas?.find(o => o.id === proker?.ormawaId);
  const ormawaName = prokerOrmawa?.name || proker?.ormawaId?.toUpperCase() || 'Ormawa Pembuat';

  // State lokal khusus mode kustomisasi Tujuan & Output kegiatan
  const [isEditingTujuanOnly, setIsEditingTujuanOnly] = useState(false);
  const [editingItemIdx, setEditingItemIdx] = useState(null);
  const [editingItemText, setEditingItemText] = useState('');
  const [localNewTujuan, setLocalNewTujuan] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const isCustomizingTujuan = isEditingDeskripsi || isEditingTujuanOnly;

  // Handlers untuk edit butir individual
  const handleStartEditItem = (idx, currentText) => {
    setEditingItemIdx(idx);
    setEditingItemText(currentText);
  };

  const handleSaveEditItem = (idx) => {
    if (!editingItemText.trim()) return;
    const updated = [...tujuanItems];
    updated[idx] = editingItemText.trim();
    setTujuanItems(updated);
    setEditingItemIdx(null);
    setEditingItemText('');
  };

  const handleCancelEditItem = () => {
    setEditingItemIdx(null);
    setEditingItemText('');
  };

  // Geser urutan prioritas butir tujuan
  const handleMoveTujuan = (idx, direction) => {
    if (direction === 'up' && idx > 0) {
      const updated = [...tujuanItems];
      const temp = updated[idx];
      updated[idx] = updated[idx - 1];
      updated[idx - 1] = temp;
      setTujuanItems(updated);
    } else if (direction === 'down' && idx < tujuanItems.length - 1) {
      const updated = [...tujuanItems];
      const temp = updated[idx];
      updated[idx] = updated[idx + 1];
      updated[idx + 1] = temp;
      setTujuanItems(updated);
    }
  };

  // Simpan perubahan khusus Tujuan & Output ke store
  const handleSaveTujuanOnly = () => {
    const cleaned = tujuanItems.filter(t => t.trim().length > 0);
    updateProkerDetails(proker.id, { tujuan: cleaned });
    setTujuanItems(cleaned);
    setIsEditingTujuanOnly(false);
    setEditingItemIdx(null);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Batal kustomisasi Tujuan & Output
  const handleCancelTujuanOnly = () => {
    setTujuanItems(proker.tujuan || defaultTujuan);
    setIsEditingTujuanOnly(false);
    setEditingItemIdx(null);
  };

  // Tambah butir baru pada mode kustomisasi mandiri
  const handleAddLocalTujuan = () => {
    const textToAdd = localNewTujuan.trim();
    if (!textToAdd) return;
    setTujuanItems([...tujuanItems, textToAdd]);
    setLocalNewTujuan('');
  };

  // Tambah dari preset rekomendasi
  const handleAddPreset = (presetText) => {
    if (tujuanItems.includes(presetText)) return;
    setTujuanItems([...tujuanItems, presetText]);
  };

  return (
    <div className="space-y-4">
      {/* Header Bar: Status Kontrol & Izin Edit */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
        <div>
          <h4 className="font-extrabold text-xs text-slate-900 tracking-tight">Deskripsi &amp; Target Tujuan Acara</h4>
          <p className="text-[11px] text-slate-500 tracking-normal mt-0.5">
            {isCreator 
              ? 'Anda memiliki hak akses penuh untuk mengkustomisasi deskripsi serta butir tujuan kegiatan ini.' 
              : `Dikelola oleh pengurus ${ormawaName}. Mode tinjauan aktif.`}
          </p>
        </div>

        {!isEditingDeskripsi ? (
          isCreator ? (
            <button
              type="button"
              onClick={() => setIsEditingDeskripsi(true)}
              className="min-h-[38px] flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition cursor-pointer self-start sm:self-auto active:scale-95"
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-600" />
              <span className="tracking-tight">Ubah Deskripsi &amp; Tujuan</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-500 text-xs border border-slate-200/70 self-start sm:self-auto">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] font-medium">Hanya {ormawaName} yang dapat mengedit</span>
            </div>
          )
        ) : (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => {
                setDeskripsiText(proker.description || defaultDeskripsi);
                setTujuanItems(proker.tujuan || defaultTujuan);
                setIsEditingDeskripsi(false);
              }}
              className="min-h-[38px] px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100 transition cursor-pointer active:scale-95"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSaveDeskripsiTujuan}
              className="min-h-[38px] flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition cursor-pointer active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span className="tracking-tight">Simpan</span>
            </button>
          </div>
        )}
      </div>

      {/* Deskripsi Kegiatan */}
      <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-2">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" />
          <h4 className="font-extrabold text-xs text-slate-900 tracking-tight">Deskripsi &amp; Konsep Acara</h4>
        </div>
        {!isEditingDeskripsi ? (
          <p className="text-slate-700 leading-relaxed text-xs whitespace-pre-line tracking-normal font-normal">
            {deskripsiText}
          </p>
        ) : (
          <textarea
            rows={4}
            value={deskripsiText}
            onChange={(e) => setDeskripsiText(e.target.value)}
            placeholder="Tuliskan latar belakang dan gambaran umum program kerja ini..."
            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 tracking-normal"
          />
        )}
      </div>

      {/* Tujuan Acara & Output Kegiatan */}
      <div className="bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <h4 className="font-extrabold text-xs text-slate-900 tracking-tight">Tujuan &amp; Output Kegiatan</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Target luaran dan sasaran mutu program kerja
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200/80 px-2.5 py-1 rounded-full tabular-nums shadow-2xs">
              {tujuanItems.length} Butir Target
            </span>

            {/* Jika User adalah Creator (Pembuat Proker): Tampilkan Tombol Kustomisasi Mandiri */}
            {isCreator ? (
              !isCustomizingTujuan ? (
                <button
                  type="button"
                  onClick={() => setIsEditingTujuanOnly(true)}
                  className="min-h-[32px] flex items-center gap-1.5 px-3 py-1 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs shadow-2xs transition cursor-pointer active:scale-95"
                >
                  <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Kustomisasi Tujuan &amp; Output</span>
                </button>
              ) : isEditingTujuanOnly ? (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleCancelTujuanOnly}
                    className="min-h-[32px] px-2.5 py-1 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100 transition cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveTujuanOnly}
                    className="min-h-[32px] flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition cursor-pointer active:scale-95"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Simpan Perubahan</span>
                  </button>
                </div>
              ) : null
            ) : (
              /* Jika BUKAN Creator: Tampilkan Badge Proteksi Akses */
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-medium border border-slate-200">
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Hanya {ormawaName} yang dapat mengkustomisasi</span>
              </div>
            )}
          </div>
        </div>

        {/* Notifikasi Simpan Berhasil */}
        {saveSuccess && (
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium text-xs flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Tujuan dan output kegiatan berhasil disimpan dan diperbarui.</span>
          </div>
        )}

        {/* Daftar Butir Tujuan */}
        <div className="space-y-2">
          {tujuanItems.map((t, idx) => (
            <div 
              key={`tujuan-${idx}`} 
              className={`flex items-start justify-between gap-2.5 p-2.5 rounded-xl border transition ${
                editingItemIdx === idx 
                  ? 'bg-blue-50/60 border-blue-300 ring-2 ring-blue-100' 
                  : 'bg-white border-slate-200/70 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-2.5 min-w-0 flex-1">
                <span className="w-5 h-5 rounded-lg bg-emerald-50 text-emerald-700 font-extrabold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>

                {editingItemIdx === idx ? (
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      autoFocus
                      value={editingItemText}
                      onChange={(e) => setEditingItemText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSaveEditItem(idx);
                        } else if (e.key === 'Escape') {
                          handleCancelEditItem();
                        }
                      }}
                      className="w-full bg-white border border-blue-400 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium"
                    />
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleSaveEditItem(idx)}
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3 h-3" />
                        <span>Selesai Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEditItem}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-[11px] cursor-pointer"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-800 font-medium leading-normal pt-0.5">
                    {t}
                  </p>
                )}
              </div>

              {/* Action Buttons saat Mode Kustomisasi Aktif */}
              {isCustomizingTujuan && editingItemIdx !== idx && (
                <div className="flex items-center gap-1 shrink-0 pt-0.5">
                  <button
                    type="button"
                    onClick={() => handleStartEditItem(idx, t)}
                    className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                    title="Ubah teks butir ini"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveTujuan(idx, 'up')}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                    title="Geser ke atas"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === tujuanItems.length - 1}
                    onClick={() => handleMoveTujuan(idx, 'down')}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                    title="Geser ke bawah"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (isEditingDeskripsi && handleDeleteTujuan) {
                        handleDeleteTujuan(idx);
                      } else {
                        const updated = tujuanItems.filter((_, i) => i !== idx);
                        setTujuanItems(updated);
                      }
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    title="Hapus butir tujuan ini"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Form Tambah Butir Tujuan Baru saat Mode Kustomisasi */}
          {isCustomizingTujuan && (
            <div className="pt-3 space-y-2.5 border-t border-slate-200/80">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={isEditingTujuanOnly ? localNewTujuan : newTujuanInput}
                  onChange={(e) => {
                    if (isEditingTujuanOnly) {
                      setLocalNewTujuan(e.target.value);
                    } else {
                      setNewTujuanInput(e.target.value);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (isEditingTujuanOnly) {
                        handleAddLocalTujuan();
                      } else {
                        handleAddTujuan();
                      }
                    }
                  }}
                  placeholder="Ketik butir tujuan atau target output baru..."
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={isEditingTujuanOnly ? handleAddLocalTujuan : handleAddTujuan}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition flex items-center gap-1.5 shrink-0 shadow-2xs cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Butir</span>
                </button>
              </div>

              {/* Rekomendasi / Preset Cepat Target Output */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Pilihan Rekomendasi Target Output:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_TUJUAN_OPTIONS.map((preset, pIdx) => {
                    const isAdded = tujuanItems.includes(preset);
                    return (
                      <button
                        key={pIdx}
                        type="button"
                        disabled={isAdded}
                        onClick={() => handleAddPreset(preset)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition text-left ${
                          isAdded 
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                            : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border-slate-200 hover:border-emerald-300 cursor-pointer'
                        }`}
                      >
                        {isAdded ? '✓ ' : '+ '}{preset}
                      </button>
                    );
                  })}
                </div>
              </div>
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
          <span className="text-[10px] font-bold text-slate-400 block uppercase">Metode Verifikasi</span>
          <span className="font-bold text-slate-900 text-xs mt-0.5 block">
            Presensi &amp; Berita Acara
          </span>
        </div>
      </div>
    </div>
  );
}
