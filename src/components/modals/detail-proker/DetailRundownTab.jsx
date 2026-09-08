import React from 'react';
import { 
  Clock, 
  Calendar, 
  Printer, 
  Plus, 
  Trash2, 
  X 
} from 'lucide-react';

export default function DetailRundownTab({
  rundownItems,
  isAddingRundown,
  setIsAddingRundown,
  newRundownList,
  setNewRundownList,
  availableDays,
  selectedDay,
  setSelectedDay,
  formTargetDay,
  setFormTargetDay,
  handleAddDay,
  handleDeleteDay,
  handleAddSessionRow,
  handleRemoveSessionRow,
  handleSessionChange,
  handleAddRundown,
  handleDeleteRundown,
  handlePrintRundown
}) {
  return (
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

          <div className="space-y-2.5">
            {newRundownList.map((row, idx) => (
              <div key={`input-row-${idx}`} className="p-3 bg-white rounded-xl border border-blue-100/90 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                    Sesi #{idx + 1}
                  </span>
                  {newRundownList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSessionRow(idx)}
                      className="text-slate-300 hover:text-rose-600 p-1 transition cursor-pointer"
                      title="Hapus baris sesi ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Jam / Waktu *</label>
                    <input
                      type="text"
                      placeholder="08:00 - 09:00"
                      value={row.time}
                      onChange={(e) => handleSessionChange(idx, 'time', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Nama Sesi Acara *</label>
                    <input
                      type="text"
                      placeholder="Contoh: Pembukaan & Sambutan Dekan"
                      value={row.session}
                      onChange={(e) => handleSessionChange(idx, 'session', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Penanggung Jawab (PJ)</label>
                    <input
                      type="text"
                      placeholder="Sie Acara / MC"
                      value={row.pic}
                      onChange={(e) => handleSessionChange(idx, 'pic', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Catatan Teknis / Perlengkapan (Opsional)</label>
                  <input
                    type="text"
                    placeholder="Contoh: Mic 2 buah, sound system standby"
                    value={row.note}
                    onChange={(e) => handleSessionChange(idx, 'note', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleAddSessionRow}
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-800 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Tambah Baris Sesi Lagi</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setNewRundownList([{ time: '', session: '', pic: '', note: '' }]);
                  setIsAddingRundown(false);
                }}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Simpan Semua Sesi
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Daftar Sesi Rundown Terkelompok per Hari */}
      <div className="space-y-4">
        {(selectedDay === 'all' ? availableDays : [selectedDay]).map(dayNum => {
          const dayItems = rundownItems.filter(r => (Number(r.day) || 1) === dayNum);

          return (
            <div key={`day-group-${dayNum}`} className="space-y-2">
              <div className="flex items-center justify-between bg-slate-100/80 px-3 py-1.5 rounded-xl">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span className="font-extrabold text-xs text-slate-800">Hari {dayNum}</span>
                  <span className="text-[10px] text-slate-500 font-bold">
                    ({dayItems.length} Sesi Terdaftar)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormTargetDay(dayNum);
                    setIsAddingRundown(true);
                  }}
                  className="text-[11px] font-bold text-blue-700 hover:underline cursor-pointer"
                >
                  + Tambah di Hari {dayNum}
                </button>
              </div>

              {dayItems.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
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
  );
}
