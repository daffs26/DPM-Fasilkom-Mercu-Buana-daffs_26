import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { useShallow } from 'zustand/react/shallow';
import {
  Calendar as CalendarIcon,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Info,
  PartyPopper,
  Clock,
  MapPin,
  Users,
  CalendarCheck2,
  Plus
} from 'lucide-react';
import { getHoliday } from '@/data/holidays';
import DropdownSelect from '@/components/ui/dropdown-select';

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const WEEKDAY_NAMES = [
  { short: 'Min', full: 'Minggu', isWeekend: true },
  { short: 'Sen', full: 'Senin', isWeekend: false },
  { short: 'Sel', full: 'Selasa', isWeekend: false },
  { short: 'Rab', full: 'Rabu', isWeekend: false },
  { short: 'Kam', full: 'Kamis', isWeekend: false },
  { short: 'Jum', full: 'Jumat', isWeekend: false },
  { short: 'Sab', full: 'Sabtu', isWeekend: true },
];

const SUPPORTED_YEARS = [2026, 2027, 2028];

function KalenderGrid({
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
  handleGoToToday,
  onOpenAddProker
}) {
  const legendItems = [
    { label: 'Sabtu & Minggu', dot: 'bg-rose-600', box: 'bg-rose-50/80 border-rose-100 text-rose-700' },
    { label: 'Libur Nasional', dot: 'bg-amber-400 ring-1 ring-amber-200', box: 'bg-amber-50/90 border-amber-200 text-amber-900' },
    { label: 'Proker Ormawa', dot: 'bg-blue-600', box: 'bg-blue-50/80 border-blue-100 text-blue-700' },
    { label: `${holidaysInMonth.length} Hari Libur`, dot: 'bg-amber-500', box: 'bg-amber-50 text-amber-800 border-amber-200' }
  ];

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-soft flex flex-col justify-between">
      <div>
        {/* Header & Month/Year Selectors */}
        <div className="flex flex-col gap-2.5 pb-2.5 border-b border-slate-100 w-full">
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-2xs shrink-0">
                <CalendarIcon className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </h3>
            </div>

            {handleGoToToday && (
              <button
                type="button"
                onClick={handleGoToToday}
                className="px-2.5 py-1 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition shadow-2xs shrink-0 cursor-pointer"
                title="Kembali ke Tanggal Hari Ini"
              >
                Hari Ini
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
            <div className="w-full flex items-center justify-between gap-1 bg-slate-50 p-1 rounded-2xl border border-slate-200 shadow-2xs">
              <button
                type="button"
                onClick={handlePrevMonth}
                disabled={currentYear === 2026 && currentMonth === 0}
                className="p-2 min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl hover:bg-white text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition shrink-0"
                title="Bulan Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <DropdownSelect
                value={currentMonth}
                onChange={(val) => handleSelectMonth(val)}
                options={MONTH_NAMES.map((name, idx) => ({ value: idx, label: name }))}
                className="flex-1 min-w-0"
                triggerClassName="w-full min-h-[38px] py-1.5 px-3 font-bold text-xs rounded-xl bg-white border border-slate-200/60 shadow-2xs hover:bg-slate-100 flex items-center justify-between"
              />

              <button
                type="button"
                onClick={handleNextMonth}
                disabled={currentYear === 2028 && currentMonth === 11}
                className="p-2 min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl hover:bg-white text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition shrink-0"
                title="Bulan Berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="w-full grid grid-cols-3 gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-1 shadow-2xs">
              {SUPPORTED_YEARS.map(yr => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => handleSelectYear(yr)}
                  className={`text-xs font-bold py-1.5 min-h-[38px] rounded-xl transition text-center flex items-center justify-center ${
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

        {/* Legend */}
        <div className="pt-2 pb-2 text-[10px] sm:text-[11px] border-b border-slate-100 space-y-1.5">
          <span className="font-bold text-slate-500 text-[10px] uppercase tracking-wider block">
            Panduan:
          </span>
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2 w-full">
            {legendItems.map((item, idx) => (
              <div key={idx} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border font-bold min-w-0 ${item.box}`}>
                <span className={`w-2 h-2 rounded-full shrink-0 ${item.dot}`} />
                <span className="truncate">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5 mt-2 text-center">
          {WEEKDAY_NAMES.map((w) => (
            <div 
              key={w.short} 
              className={`text-[9px] sm:text-[10px] py-1 rounded-lg uppercase tracking-wider ${
                w.isWeekend ? 'font-extrabold text-rose-600 bg-rose-50/60' : 'font-bold text-slate-600'
              }`}
              title={w.full}
            >
              {w.short}
            </div>
          ))}

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
                <div className="flex items-center justify-between">
                  <span 
                    className={`text-[11px] sm:text-xs leading-none ${
                      isSelected
                        ? item.holiday ? 'font-black text-amber-700' : item.isWeekend ? 'font-black text-rose-700' : 'font-black text-blue-950'
                        : item.holiday ? 'font-black text-amber-600' : item.isWeekend ? 'font-black text-rose-600' : item.isCurrentMonth ? 'font-bold text-slate-800' : 'font-semibold text-slate-400'
                    }`}
                  >
                    {item.day}
                  </span>

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

                {hasEvents.length > 0 && (
                  <div className="space-y-0.5">
                    <div
                      className={`text-[8px] font-bold truncate px-1 py-0.2 rounded leading-tight ${
                        isSelected ? 'bg-blue-600 text-white shadow-2xs' : 'bg-slate-900 text-white'
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

      <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Tanggal merah &amp; cuti bersama terintegrasi resmi dari SKB 3 Menteri.</span>
        </div>
        <div className="font-bold text-slate-700">
          Periode: 2026 - 2028
        </div>
      </div>
    </div>
  );
}

function KalenderSidebar({
  formattedSelectedDate,
  selectedDateHoliday,
  isSelectedDateWeekend,
  prokersOnDate,
  ormawas,
  onReviewProposal,
  onOpenAddProker,
  selectedDate
}) {
  const currentUser = useStore(state => state.currentUser);
  const isGuest = currentUser?.role === 'guest';

  const formatContact = (contact) => {
    if (!isGuest || !contact) return contact;
    const clean = contact.replace(/[^0-9]/g, '');
    return clean.length > 7 ? `${clean.slice(0, 4)}-****-${clean.slice(-4)}` : '****';
  };

  return (
    <div className="w-full lg:w-[350px] xl:w-[380px] shrink-0 bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-soft flex flex-col justify-between lg:sticky lg:top-[80px] lg:self-start lg:max-h-[calc(100vh-100px)] overflow-hidden">
      <div className="space-y-3 flex-1 overflow-y-auto pr-1">
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
                        <span>PIC: {p.pic} {p.picContact ? `(${formatContact(p.picContact)})` : ''}</span>
                      </p>
                    </div>

                    <button
                      onClick={() => onReviewProposal(p)}
                      className="w-full mt-1.5 min-h-[38px] py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition flex items-center justify-center text-center shadow-xs cursor-pointer"
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

      {!isGuest && (
        <div className="pt-3 border-t border-slate-100 shrink-0 mt-2">
          <button
            onClick={() => onOpenAddProker?.(selectedDate)}
            className="w-full min-h-[38px] py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Jadwalkan Proker di Tanggal Ini
          </button>
        </div>
      )}
    </div>
  );
}

export default function KalenderView({ onOpenAddProker, onReviewProposal, onDateChange }) {
  const { prokers, ormawas } = useStore(useShallow(state => ({ prokers: state.prokers, ormawas: state.ormawas })));

  const today = new Date();
  const todayISO = today.toISOString().split('T')[0];

  const initialYear = Math.min(Math.max(today.getFullYear(), 2026), 2028);
  const [currentYear, setCurrentYear] = useState(initialYear);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(todayISO);
  const [isCollisionExpanded, setIsCollisionExpanded] = useState(false);

  useEffect(() => {
    onDateChange?.(selectedDate);
  }, [selectedDate, onDateChange]);

  const syncDateForNewMonthYear = (yr, mo) => {
    const currentDayNum = Number(selectedDate.split('-')[2]) || 1;
    const maxDays = new Date(yr, mo + 1, 0).getDate();
    const safeDay = Math.min(currentDayNum, maxDays);
    const newDateStr = `${yr}-${String(mo + 1).padStart(2, '0')}-${String(safeDay).padStart(2, '0')}`;
    setSelectedDate(newDateStr);
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      if (currentYear > 2026) {
        const nextYr = currentYear - 1;
        setCurrentYear(nextYr);
        setCurrentMonth(11);
        syncDateForNewMonthYear(nextYr, 11);
      }
    } else {
      const nextMo = currentMonth - 1;
      setCurrentMonth(nextMo);
      syncDateForNewMonthYear(currentYear, nextMo);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      if (currentYear < 2028) {
        const nextYr = currentYear + 1;
        setCurrentYear(nextYr);
        setCurrentMonth(0);
        syncDateForNewMonthYear(nextYr, 0);
      }
    } else {
      const nextMo = currentMonth + 1;
      setCurrentMonth(nextMo);
      syncDateForNewMonthYear(currentYear, nextMo);
    }
  };

  const handleSelectMonth = (mo) => {
    const monthNum = Number(mo);
    setCurrentMonth(monthNum);
    syncDateForNewMonthYear(currentYear, monthNum);
  };

  const handleSelectYear = (yr) => {
    const yearNum = Number(yr);
    setCurrentYear(yearNum);
    syncDateForNewMonthYear(yearNum, currentMonth);
  };

  const handleGoToToday = () => {
    const yr = Math.min(Math.max(today.getFullYear(), 2026), 2028);
    setCurrentYear(yr);
    setCurrentMonth(today.getMonth());
    setSelectedDate(todayISO);
  };

  const collisions = useMemo(() => {
    const result = [];
    prokers.forEach((p1, idx) => {
      prokers.slice(idx + 1).forEach((p2) => {
        if (p1.startDate === p2.startDate || (p1.startDate <= p2.endDate && p1.endDate >= p2.startDate)) {
          result.push({ p1, p2, date: p1.startDate });
        }
      });
    });
    return result;
  }, [prokers]);

  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
    const days = [];

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayOfWeek = (new Date(prevYear, prevMonth, d)).getDay();
      days.push({
        day: d,
        dateStr,
        isCurrentMonth: false,
        dayOfWeek,
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        holiday: getHoliday(dateStr)
      });
    }

    for (let d = 1; d <= daysInCurrentMonth; d++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayOfWeek = (firstDayIndex + d - 1) % 7;
      days.push({
        day: d,
        dateStr,
        isCurrentMonth: true,
        dayOfWeek,
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        holiday: getHoliday(dateStr)
      });
    }

    const remainingSlots = (7 - (days.length % 7)) % 7;
    for (let d = 1; d <= remainingSlots; d++) {
      const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayOfWeek = (new Date(nextYear, nextMonth, d)).getDay();
      days.push({
        day: d,
        dateStr,
        isCurrentMonth: false,
        dayOfWeek,
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        holiday: getHoliday(dateStr)
      });
    }

    return days;
  }, [currentYear, currentMonth]);

  const prokersOnDate = useMemo(() => {
    return prokers.filter(p => p.startDate === selectedDate || (p.startDate <= selectedDate && p.endDate >= selectedDate));
  }, [prokers, selectedDate]);

  const selectedDateHoliday = useMemo(() => getHoliday(selectedDate), [selectedDate]);

  const selectedDateDayOfWeek = useMemo(() => {
    const parts = selectedDate.split('-').map(Number);
    return parts.length === 3 ? (new Date(parts[0], parts[1] - 1, parts[2])).getDay() : null;
  }, [selectedDate]);

  const isSelectedDateWeekend = selectedDateDayOfWeek === 0 || selectedDateDayOfWeek === 6;

  const formattedSelectedDate = useMemo(() => {
    try {
      const parts = selectedDate.split('-').map(Number);
      if (parts.length === 3) {
        return (new Date(parts[0], parts[1] - 1, parts[2])).toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      }
    } catch {
      // ignore
    }
    return selectedDate;
  }, [selectedDate]);

  const holidaysInMonth = useMemo(() => {
    return calendarDays.filter(d => d.isCurrentMonth && d.holiday);
  }, [calendarDays]);

  return (
    <div className="space-y-3.5">
      {collisions.length > 0 ? (
        <div className="p-2.5 sm:p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start justify-between gap-2.5 text-amber-900 shadow-2xs transition-all duration-200">
          <div className="flex items-start gap-2.5 min-w-0 flex-1">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-xs text-amber-800 truncate">
                  {collisions.length} Jadwal Bentrok / Berdekatan
                </h4>
                <span className="hidden sm:inline-flex text-[9px] font-mono font-bold bg-amber-200/70 text-amber-900 px-1.5 py-0.2 rounded-full">
                  Perlu Koordinasi
                </span>
              </div>
              {isCollisionExpanded && (
                <p className="text-[11px] text-amber-700 mt-1 leading-relaxed animate-in fade-in-50 duration-150">
                  Koordinasikan penggunaan fasilitas ruangan dan audiens peserta kegiatan.
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCollisionExpanded(!isCollisionExpanded)}
            className="flex items-center gap-1 text-[11px] font-bold text-amber-800 hover:text-amber-950 px-2 py-0.5 rounded-lg bg-amber-100/60 hover:bg-amber-100 border border-amber-300/60 shrink-0 transition"
          >
            {isCollisionExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            <span>{isCollisionExpanded ? 'Tutup' : 'Detail'}</span>
          </button>
        </div>
      ) : (
        <div className="py-2 px-3.5 bg-emerald-50/90 border border-emerald-200 rounded-2xl flex items-center justify-between gap-2 text-emerald-900 shadow-2xs">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <p className="text-xs font-bold text-emerald-800">
              Jadwal Terpadu: Tidak ada bentrok kegiatan ormawa.
            </p>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
            Aman
          </span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row items-start gap-4 xl:gap-5">
        <div className="flex-1 min-w-0 w-full">
          <KalenderGrid 
            currentYear={currentYear}
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            calendarDays={calendarDays}
            holidaysInMonth={holidaysInMonth}
            prokers={prokers}
            ormawas={ormawas}
            todayISO={todayISO}
            handlePrevMonth={handlePrevMonth}
            handleNextMonth={handleNextMonth}
            handleSelectMonth={handleSelectMonth}
            handleSelectYear={handleSelectYear}
            handleGoToToday={handleGoToToday}
            onOpenAddProker={onOpenAddProker}
          />
        </div>

        <KalenderSidebar 
          selectedDate={selectedDate}
          formattedSelectedDate={formattedSelectedDate}
          selectedDateHoliday={selectedDateHoliday}
          isSelectedDateWeekend={isSelectedDateWeekend}
          prokersOnDate={prokersOnDate}
          ormawas={ormawas}
          onReviewProposal={onReviewProposal}
          onOpenAddProker={onOpenAddProker}
        />
      </div>
    </div>
  );
}