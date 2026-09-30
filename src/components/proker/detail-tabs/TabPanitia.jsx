import React from 'react';
import { Plus, X, Phone, Trash2 } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function DetailPanitiaTab({
  panitiaItems,
  isAddingPanitia,
  setIsAddingPanitia,
  newPanitia,
  setNewPanitia,
  handleAddPanitia,
  handleDeletePanitia
}) {
  const currentUser = useStore(state => state.currentUser);
  const isGuest = currentUser?.role === 'guest';

  const formatContact = (contact) => {
    if (!contact) return '-';
    if (isGuest) {
      const clean = contact.replace(/\D/g, '');
      if (clean.length >= 8) {
        return clean.slice(0, 4) + '-****-' + clean.slice(-4);
      }
      return '****-****';
    }
    return contact;
  };

  const formatNim = (nim) => {
    if (!nim) return '';
    if (isGuest) {
      return nim.length > 4 ? `${nim.slice(0, 4)}****` : '****';
    }
    return nim;
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
        <div>
          <h4 className="font-extrabold text-xs text-slate-900">Struktur Panitia Pelaksana (OC)</h4>
          <p className="text-[11px] text-slate-500">Daftar penanggung jawab dan pembagian divisi panitia kegiatan.</p>
        </div>
        {!isGuest && (
          <button
            type="button"
            onClick={() => setIsAddingPanitia(!isAddingPanitia)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Panitia</span>
          </button>
        )}
      </div>

      {/* Form Input Tambah Panitia Baru */}
      {isAddingPanitia && !isGuest && (
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
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Nomor Induk Mahasiswa (NIM)</label>
              <input
                type="text"
                placeholder="Contoh: 41822010000"
                value={newPanitia.nim || ''}
                onChange={(e) => setNewPanitia({ ...newPanitia, nim: e.target.value })}
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
            <div className="sm:col-span-2">
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
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer"
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
                  {p.nim ? `NIM: ${formatNim(p.nim)} • ` : ''}{p.division}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {isGuest ? (
                <div 
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-1 rounded-lg"
                  title="Nomor kontak disamarkan untuk privasi publik"
                >
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span className="hidden sm:inline">{formatContact(p.contact)}</span>
                </div>
              ) : (
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
              )}
              {!isGuest && (
                <button
                  type="button"
                  onClick={() => handleDeletePanitia(idx)}
                  className="p-1 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                  title="Hapus panitia ini"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
