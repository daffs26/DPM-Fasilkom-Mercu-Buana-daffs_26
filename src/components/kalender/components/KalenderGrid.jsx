import React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import DropdownSelect from '@/components/ui/dropdown-select';

export default function KalenderGrid({
  currentYear,
  currentMonth,
  selectedDate,
  setSelectedDate,
  calendarDays,
  holidaysInMonth,
  prokers,
  ormawas,
  todayISO,
  handlePrevMonth,
  handleNextMonth,
  handleSelectMonth,
  handleSelectYear,
  onOpenAddProker,
  monthNames,
  weekdayNames,
  supportedYears
}) {
  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-soft flex flex-col justify-between">
      <div>
        {/* Header Kalender & Navigasi */}
        <div className="flex flex-col gap-2.5 pb-2.5 border-b border-slate-100 w-full">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-2xs shrink-0">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                {monthNames[currentMonth]} {currentYear}
              </h3>
            </div>
          </div>

          {/* Selector & Navigasi Tombol: Memanjang Memenuhi Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
            {/* Cluster Navigasi Bulan: Prev, Dropdown, Next (Memanjang Memenuhi Card) */}
            <div className="w-full flex items-center justify-between gap-1 bg-slate-50 p-1 rounded-2xl border border-slate-200 shadow-2xs">
              <button
                type="button"
                onClick={handlePrevMonth}
                disabled={currentYear === 2026 && currentMonth === 0}
                className="p-1.5 rounded-xl hover:bg-white text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition shrink-0"
                title="Bulan Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <DropdownSelect
                value={currentMonth}
                onChange={(val) => handleSelectMonth(val)}
                options={monthNames.map((name, idx) => ({ value: idx, label: name }))}
                className="flex-1 min-w-0"
                triggerClassName="w-full py-1.5 px-3 font-bold text-xs rounded-xl bg-white border border-slate-200/60 shadow-2xs hover:bg-slate-100 flex items-center justify-between"
              />

              <button
                type="button"
                onClick={handleNextMonth}
                disabled={currentYear === 2028 && currentMonth === 11}
                className="p-1.5 rounded-xl hover:bg-white text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition shrink-0"
                title="Bulan Berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Cluster Tahun: Segmented Pills (2026 - 2028) (Memanjang Memenuhi Card) */}
            <div className="w-full grid grid-cols-3 gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-1 shadow-2xs">
              {supportedYears.map(yr => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => handleSelectYear(yr)}
                  className={`text-xs font-bold py-1.5 rounded-xl transition text-center ${
                    currentYear === yr
                      ? 'bg-white text-blue-600 shadow-xs ring-1 ring-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Legend / Panduan Warna: Grid 2 x 2 */}
        <div className="pt-2 pb-2 text-[10px] sm:text-[11px] border-b border-slate-100 space-y-1.5">
          <span className="font-bold text-slate-500 text-[10px] uppercase tracking-wider block">
            Panduan:
          </span>
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2 w-full">
            {/* 1. Sabtu & Minggu */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-rose-50/80 border border-rose-100 text-rose-700 font-bold min-w-0">
              <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0"></span>
              <span className="truncate">Sabtu &amp; Minggu</span>
            </div>

            {/* 2. Tanggal Merah / Libur Nasional */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 font-bold min-w-0">
              <span className="w-2 h-2 rounded-full bg-amber-400 ring-1 ring-amber-200 shrink-0"></span>
              <span className="truncate" title="Tanggal Merah / Libur Nasional">
                Tanggal Merah / Libur Nasional
              </span>
            </div>

            {/* 3. Proker Ormawa */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blue-50/80 border border-blue-100 text-blue-700 font-bold min-w-0">
              <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
              <span className="truncate">Proker Ormawa</span>
            </div>

            {/* 4. Total Hari Libur Bulan Ini */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 font-bold min-w-0">
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
              <span className="truncate">{holidaysInMonth.length} Hari Libur</span>
            </div>
          </div>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5 mt-2 text-center">
          {/* Header Nama Hari: Min dan Sab BOLD MERAH */}
          {weekdayNames.map((w) => (
            <div 
              key={w.short} 
              className={`text-[9px] sm:text-[10px] py-1 rounded-lg uppercase tracking-wider ${
                w.isWeekend 
                  ? 'font-extrabold text-rose-600 bg-rose-50/60' 
                  : 'font-bold text-slate-600'
              }`}
              title={w.full}
            >
              {w.short}
            </div>
          ))}

          {/* Grid Hari Kalender: Tinggi kompak (h-[48px] s/d h-[62px]) */}
          {calendarDays.map((item, idx) => {
            const isSelected = selectedDate === item.dateStr;
            const hasEvents = prokers.filter(
              p => p.startDate === item.dateStr || (p.startDate <= item.dateStr && p.endDate >= item.dateStr)
            );
            const isToday = item.dateStr === todayISO;

            return (
              <div
                key={`${item.dateStr}-${idx}`}
                onClick={() => setSelectedDate(item.dateStr)}
                onDoubleClick={() => {
                  setSelectedDate(item.dateStr);
                  onOpenAddProker?.(item.dateStr);
                }}
                className={`h-[48px] sm:h-[54px] lg:h-[58px] xl:h-[62px] p-1 sm:p-1.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between group relative ${
                  isSelected
                    ? 'border-blue-400 bg-blue-50/90 shadow-xs ring-2 ring-blue-300/80 z-10'
                    : item.isCurrentMonth
                    ? item.holiday
                      ? 'border-amber-300 bg-amber-50/70 hover:bg-amber-100/80 text-slate-800 hover:border-amber-400 shadow-2xs'
                      : item.isWeekend
                      ? 'border-rose-100 bg-rose-50/25 hover:bg-rose-50/60 text-slate-800 hover:border-rose-200'
                      : hasEvents.length > 0
                      ? 'border-blue-200 bg-blue-50/30 hover:bg-blue-50/60 text-slate-800 hover:border-blue-300'
                      : 'border-slate-100 hover:bg-slate-50/90 text-slate-700 hover:border-slate-200'
                    : 'border-transparent bg-slate-50/30 text-slate-300 opacity-40 hover:opacity-70'
                }`}
              >
                {/* Baris Atas: Tanggal & Indikator */}
                <div className="flex items-center justify-between">
                  <span 
                    className={`text-[11px] sm:text-xs leading-none ${
                      isSelected
                        ? item.holiday
                          ? 'font-black text-amber-700'
                          : item.isWeekend
                          ? 'font-black text-rose-700'
                          : 'font-black text-blue-950'
                        : item.holiday
                        ? 'font-black text-amber-600'
                        : item.isWeekend
                        ? 'font-black text-rose-600'
                        : item.isCurrentMonth
                        ? 'font-bold text-slate-800'
                        : 'font-semibold text-slate-400'
                    }`}
                  >
                    {item.day}
                  </span>

                  {/* Tag Hari Ini atau Dot Libur */}
                  <div className="flex items-center gap-1">
                    {isToday && (
                      <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-blue-600 ring-2 ring-white' : 'bg-blue-600'}`} title="Hari Ini" />
                    )}
                    {item.holiday && (
                      <span 
                        className={`w-1.5 h-1.5 rounded-full ${
                          isSelected ? 'bg-amber-500 ring-2 ring-white' : 'bg-amber-500 ring-1 ring-amber-200'
                        }`}
                        title={item.holiday.name}
                      />
                    )}
                  </div>
                </div>

                {/* Badge Tanggal Merah / Libur jika ada */}
                {item.holiday && (
                  <div 
                    className={`text-[8px] font-bold px-1 py-0.2 rounded leading-tight truncate ${
                      isSelected 
                        ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                        : 'bg-amber-100/90 text-amber-900 border border-amber-200'
                    }`}
                    title={item.holiday.name}
                  >
                    {item.holiday.name}
                  </div>
                )}

                {/* Proker Event Badges */}
                {hasEvents.length > 0 && (
                  <div className="space-y-0.5">
                    <div
                      className={`text-[8px] font-bold truncate px-1 py-0.2 rounded leading-tight ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-slate-900 text-white'
                      }`}
                      title={`${ormawas.find(o => o.id === hasEvents[0].ormawaId)?.shortName}: ${hasEvents[0].title}`}
                    >
                      <span>{hasEvents[0].title}</span>
                    </div>
                    {hasEvents.length > 1 && (
                      <div className={`text-[7px] font-bold px-0.5 leading-none ${isSelected ? 'text-blue-800' : 'text-slate-500'}`}>
                        +{hasEvents.length - 1} lagi
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info Kalender */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Tanggal merah &amp; cuti bersama terintegrasi resmi dari SKB 3 Menteri.</span>
        </div>
        <div className="font-bold text-slate-700">
          Periode: 2026 – 2028
        </div>
      </div>
    </div>
  );
}
