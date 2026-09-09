import React from 'react';
import { 
  Plus, 
  X, 
  Link2, 
  Receipt, 
  UploadCloud, 
  Trash2, 
  ExternalLink 
} from 'lucide-react';
import { formatRupiah } from '@/utils/formatters';

export default function DetailRabTab({
  totalRabCurrent,
  realisasiDana,
  selisihRab,
  rabItems,
  isAddingRab,
  setIsAddingRab,
  newRab,
  setNewRab,
  rabReceiptInputRef,
  handleRabReceiptChange,
  handleRemoveRabReceipt,
  handleAddRab,
  handleDeleteRab,
  setPreviewRabReceipt
}) {
  return (
    <div className="space-y-4">
      {/* Ringkasan Finansial */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-2xl">
          <span className="text-[10px] font-bold text-blue-700 uppercase block">Total Alokasi RAB</span>
          <span className="font-black text-sm text-blue-950 mt-0.5 block">
            {formatRupiah(totalRabCurrent)}
          </span>
        </div>
        <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl">
          <span className="text-[10px] font-bold text-amber-700 uppercase block">Realisasi Kas Cair</span>
          <span className="font-black text-sm text-amber-950 mt-0.5 block">
            {formatRupiah(realisasiDana)}
          </span>
        </div>
        <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl">
          <span className="text-[10px] font-bold text-emerald-700 uppercase block">Sisa Anggaran</span>
          <span className="font-black text-sm text-emerald-950 mt-0.5 block">
            {formatRupiah(Math.max(0, selisihRab))}
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

          {/* Input Tambahan: Link Toko Online / E-Commerce (Opsional) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Link Toko Online / E-Commerce Barang</span>
              </label>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                Opsional
              </span>
            </div>
            <input
              type="url"
              placeholder="Contoh: https://tokopedia.com/... atau https://shopee.co.id/... (Boleh dikosongkan)"
              value={newRab.link}
              onChange={(e) => setNewRab({ ...newRab, link: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Tautan produk online memudahkan tim pengawas DPM memverifikasi estimasi harga barang di RAB. Form tetap dapat disimpan meski kolom ini kosong.
            </p>
          </div>

          {/* Input Tambahan 2: Placeholder Unggah Bukti Pembayaran / Nota (Opsional) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                <span>Unggah Bukti Pembayaran / Nota / Kuitansi</span>
              </label>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                Opsional
              </span>
            </div>

            <input 
              type="file" 
              ref={rabReceiptInputRef} 
              onChange={handleRabReceiptChange} 
              accept="image/*,.pdf" 
              className="hidden" 
            />

            {!newRab.receiptPhoto ? (
              <div 
                onClick={() => rabReceiptInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-emerald-400 bg-white hover:bg-emerald-50/20 rounded-xl p-3 text-center cursor-pointer transition flex items-center justify-center gap-3 group shadow-2xs"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-slate-700 block group-hover:text-emerald-700 transition">
                    Pilih file foto nota / kuitansi / struk belanja
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    Format JPG, PNG, atau PDF (Maks. 5 MB) • Boleh dikosongkan jika belum ada nota
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-2.5 bg-white border border-emerald-200 rounded-xl flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  {newRab.receiptPhoto.startsWith('data:image') ? (
                    <img 
                      src={newRab.receiptPhoto} 
                      alt="Thumbnail Nota" 
                      className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0" 
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
                      <Receipt className="w-4 h-4" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <span className="font-bold text-xs text-slate-900 truncate block">
                      {newRab.receiptName || 'Bukti Pembayaran Terlampir'}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold block">
                      {newRab.receiptSize ? `${newRab.receiptSize} • Siap disimpan` : 'Siap disimpan'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => rabReceiptInputRef.current?.click()}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition cursor-pointer"
                  >
                    Ganti
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveRabReceipt}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    title="Hapus nota ini"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddingRab(false)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer"
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
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-900">{item.pos}</span>
                  {item.link && (
                    <a
                      href={item.link.startsWith('http') ? item.link : `https://${item.link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 px-2 py-0.5 rounded-md transition shadow-2xs"
                      title="Buka link toko online barang ini di tab baru"
                    >
                      <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                      <span className="truncate max-w-[180px] sm:max-w-xs">Lihat Toko Online</span>
                    </a>
                  )}
                  {item.receiptPhoto && (
                    <button
                      type="button"
                      onClick={() => setPreviewRabReceipt({
                        photo: item.receiptPhoto,
                        name: item.receiptName || `Nota - ${item.pos}`,
                        pos: item.pos,
                        subtotal: item.subtotal
                      })}
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-2 py-0.5 rounded-md transition shadow-2xs cursor-pointer"
                      title="Lihat foto bukti pembayaran / nota belanja"
                    >
                      <Receipt className="w-2.5 h-2.5 shrink-0" />
                      <span>Lihat Bukti Nota</span>
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-black text-slate-900 text-xs">
                  {formatRupiah(item.subtotal)}
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteRab(idx)}
                  className="p-1 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
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
          <span className="text-sm text-blue-700">{formatRupiah(totalRabCurrent)}</span>
        </div>
      </div>
    </div>
  );
}
