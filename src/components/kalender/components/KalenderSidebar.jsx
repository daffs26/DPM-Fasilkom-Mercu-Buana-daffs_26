import React from 'react';
import { 
  PartyPopper, 
  Clock, 
  MapPin, 
  Users, 
  CalendarCheck2, 
  Plus 
} from 'lucide-react';

export default function KalenderSidebar({
  selectedDate,
  formattedSelectedDate,
  selectedDateHoliday,
  isSelectedDateWeekend,
  prokersOnDate,
  ormawas,
  onReviewProposal,
  onOpenAddProker
}) {
  return (
    <div className="w-full lg:w-[350px] xl:w-[380px] shrink-0 bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-soft flex flex-col justify-between lg:sticky lg:top-[80px] lg:self-start lg:max-h-[calc(100vh-100px)] overflow-hidden">
      <div className="space-y-3 flex-1 overflow-y-auto pr-1">
        {/* Header Rincian Hari Terpilih */}
        <div className="pb-3 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Agenda Tanggal Terpilih
            </span>
            {isSelectedDateWeekend && (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                Akhir Pekan
              </span>
            )}
          </div>
          <h3 className={`text-sm sm:text-base mt-1 font-extrabold ${selectedDateHoliday ? 'text-amber-800' : isSelectedDateWeekend ? 'text-rose-600' : 'text-slate-900'}`}>
            {formattedSelectedDate}
          </h3>
        </div>

        {/* Banner Khusus Tanggal Merah / Libur Nasional */}
        {selectedDateHoliday ? (
          <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100/50 border border-amber-200 text-amber-950 space-y-1 shadow-xs">
            <div className="flex items-center gap-1.5 text-amber-700">
              <PartyPopper className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-[10px] font-black uppercase tracking-wider">
                {selectedDateHoliday.type === 'cuti' ? 'Cuti Bersama Resmi' : 'Hari Libur Nasional (Tanggal Merah)'}
              </span>
            </div>
            <h4 className="font-extrabold text-xs text-amber-900 leading-snug">
              {selectedDateHoliday.name}
            </h4>
            <p className="text-[10px] text-amber-700 leading-relaxed pt-1 border-t border-amber-200/60">
              Hari libur resmi sesuai SKB 3 Menteri RI.
            </p>
          </div>
        ) : isSelectedDateWeekend ? (
          <div className="p-2.5 rounded-2xl bg-rose-50/40 border border-rose-100 text-rose-900">
            <div className="flex items-center gap-1.5 text-rose-700 text-xs font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>Akhir Pekan (Sabtu / Minggu)</span>
            </div>
          </div>
        ) : null}

        {/* Daftar Kegiatan Proker Ormawa */}
        <div>
          <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Daftar Proker Terjadwal ({prokersOnDate.length})</span>
            {prokersOnDate.length > 0 && (
              <span className="text-[10px] text-blue-600 font-bold">Aktif</span>
            )}
          </h4>

          {prokersOnDate.length > 0 ? (
            <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1">
              {prokersOnDate.map(p => {
                const ormawa = ormawas.find(o => o.id === p.ormawaId);
                return (
                  <div key={p.id} className="p-3 rounded-2xl border border-slate-200 bg-slate-50 space-y-1.5 text-xs hover:border-slate-300 transition">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[11px] text-slate-800 flex items-center gap-1.5">
                        <img src={ormawa?.logo} alt={ormawa?.name} className="w-3.5 h-3.5 object-contain" />
                        {ormawa?.name}
                      </span>
                      <span className="text-[9px] bg-white border border-slate-200 px-1.5 py-0.2 rounded-full font-bold text-slate-700">
                        {p.status}
                      </span>
                    </div>

                    <h5 className="font-bold text-slate-900 text-xs">{p.title}</h5>

                    <div className="pt-1.5 border-t border-slate-200 space-y-0.5 text-slate-600 text-[10px]">
                      <p className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{p.location}</span>
                      </p>
                      <p className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-slate-500" />
                        <span>Target: {p.targetPeserta} Mahasiswa</span>
                      </p>
                      <p className="flex items-center gap-1 font-bold text-slate-800">
                        <span>PIC: {p.pic} ({p.picContact})</span>
                      </p>
                    </div>

                    <button
                      onClick={() => onReviewProposal(p)}
                      className="w-full mt-1.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-[11px] transition text-center shadow-xs cursor-pointer"
                    >
                      Buka Detail Berkas
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center text-slate-500">
              <CalendarCheck2 className="w-7 h-7 text-slate-400 mx-auto mb-1.5" />
              <p className="font-bold text-slate-700 text-xs">Tidak Ada Agenda Proker di Tanggal Ini</p>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Ormawa bebas mengajukan dan menjadwalkan kegiatan pada tanggal ini tanpa risiko bentrok.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tombol Daftarkan Proker di Tanggal Ini */}
      <div className="pt-3 border-t border-slate-100 shrink-0 mt-2">
        <button
          onClick={() => onOpenAddProker?.(selectedDate)}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Jadwalkan Proker di Tanggal Ini
        </button>
      </div>
    </div>
  );
}
