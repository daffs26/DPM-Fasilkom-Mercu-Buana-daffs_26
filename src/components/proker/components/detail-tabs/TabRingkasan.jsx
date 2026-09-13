import React from 'react';
import { useStore } from '@/store/useStore';
import { 
  FileText, 
  Sparkles, 
  Edit3, 
  Trash2, 
  Plus, 
  Save 
} from 'lucide-react';

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
  const isGuest = currentUser?.role === 'guest';

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
        <div>
          <h4 className="font-extrabold text-xs text-slate-900">Deskripsi &amp; Target Tujuan Acara</h4>
          <p className="text-[11px] text-slate-500">
            {isGuest ? 'Penjelasan dan target tujuan kegiatan ormawa.' : 'Anda dapat mengubah dan menyesuaikan penjelasan serta butir tujuan kegiatan.'}
          </p>
        </div>
        {!isEditingDeskripsi ? (
          !isGuest && (
            <button
              type="button"
              onClick={() => setIsEditingDeskripsi(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition cursor-pointer self-start sm:self-auto"
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-600" />
              <span>Ubah Deskripsi &amp; Tujuan</span>
            </button>
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
          <span className="text-[10px] font-bold text-slate-400 block uppercase">Metode Verifikasi</span>
          <span className="font-bold text-slate-900 text-xs mt-0.5 block">
            Presensi &amp; Berita Acara
          </span>
        </div>
      </div>
    </div>
  );
}
