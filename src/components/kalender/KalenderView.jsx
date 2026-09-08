import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { Calendar as CalendarIcon, AlertTriangle } from 'lucide-react';
import { getHoliday } from '../../data/holidays';
import KalenderGrid from './components/KalenderGrid';
import KalenderSidebar from './components/KalenderSidebar';

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

export default function KalenderView({ onOpenAddProker, onReviewProposal, onDateChange }) {
  const { prokers, ormawas } = useStore();

  const today = new Date();
  const todayISO = today.toISOString().split('T')[0];

  const initialYear = Math.min(Math.max(today.getFullYear(), 2026), 2028);
  const [currentYear, setCurrentYear] = useState(initialYear);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(todayISO);

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

  // Deteksi Tabrakan Jadwal
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

  // Perhitungan Hari Kalender
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days = [];

    // Hari dari bulan sebelumnya
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

    // Hari dari bulan berjalan
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

    // Hari dari bulan berikutnya untuk melengkapi kelipatan 7
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

  const selectedDateHoliday = useMemo(() => {
    return getHoliday(selectedDate);
  }, [selectedDate]);

  const selectedDateDayOfWeek = useMemo(() => {
    const parts = selectedDate.split('-').map(Number);
    if (parts.length === 3) {
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      return d.getDay();
    }
    return null;
  }, [selectedDate]);

  const isSelectedDateWeekend = selectedDateDayOfWeek === 0 || selectedDateDayOfWeek === 6;

  const formattedSelectedDate = useMemo(() => {
    try {
      const parts = selectedDate.split('-').map(Number);
      if (parts.length === 3) {
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        return d.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      }
    } catch {
      // fallback
    }
    return selectedDate;
  }, [selectedDate]);

  const holidaysInMonth = useMemo(() => {
    return calendarDays.filter(d => d.isCurrentMonth && d.holiday);
  }, [calendarDays]);

  return (
    <div className="space-y-3.5">
      {/* Collision Alert Banner */}
      {collisions.length > 0 ? (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-amber-900 shadow-2xs">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold text-xs text-amber-800">
              Peringatan Sistem: Ditemukan {collisions.length} Jadwal Kegiatan yang Berdekatan / Bentrok!
            </h4>
            <p className="text-[11px] text-amber-700 mt-0.5 leading-relaxed">
              DPM Fasilkom merekomendasikan koordinasi teknis antar-ormawa terkait agar penggunaan fasilitas aula, laboratorium, dan audiens mahasiswa tidak saling berebut.
            </p>
          </div>
        </div>
      ) : (
        <div className="py-2.5 px-4 bg-emerald-50/90 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-emerald-900 shadow-2xs">
          <CalendarIcon className="w-4 h-4 text-emerald-600 shrink-0" />
          <p className="text-xs font-bold text-emerald-800">
            Jadwal Terpadu Aman: Tidak ditemukan tabrakan tanggal proker aktif antar-ormawa saat ini.
          </p>
        </div>
      )}

      {/* Grid 2 Kolom: Kalender (Kiri) & Card Agenda Terpilih (Kanan Atas Sticky) */}
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
            onOpenAddProker={onOpenAddProker}
            monthNames={MONTH_NAMES}
            weekdayNames={WEEKDAY_NAMES}
            supportedYears={SUPPORTED_YEARS}
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