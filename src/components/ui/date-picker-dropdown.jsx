import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function DatePickerDropdown({
  value,
  onChange,
  placeholder = 'Select date',
  highlightDates = [],
  className = '',
  required = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Helper untuk parsing format YYYY-MM-DD secara konsisten tanpa bias zona waktu
  const parseDateParts = (val) => {
    if (!val || typeof val !== 'string') return null;
    const parts = val.split('-');
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        return { year: y, month: m, day: d, dateObj: new Date(y, m, d) };
      }
    }
    return null;
  };

  // Initialize view year & month from current value or today
  const initialParsed = parseDateParts(value);
  const now = new Date();
  const [viewYear, setViewYear] = useState(
    initialParsed ? initialParsed.year : now.getFullYear()
  );
  const [viewMonth, setViewMonth] = useState(
    initialParsed ? initialParsed.month : now.getMonth()
  );

  // Keep view year & month synced when value changes
  useEffect(() => {
    if (value) {
      const parsed = parseDateParts(value);
      if (parsed) {
        setViewYear(parsed.year);
        setViewMonth(parsed.month);
      }
    }
  }, [value]);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Navigate months
  const handlePrevMonth = (e) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  // Generate calendar days
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sun, 1 = Mon ...
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  // Selected date parsed
  const parsedSelected = parseDateParts(value);
  const isSelectedDate = (year, month, day) => {
    if (!parsedSelected) return false;
    return (
      parsedSelected.year === year &&
      parsedSelected.month === month &&
      parsedSelected.day === day
    );
  };

  // Format ISO String YYYY-MM-DD
  const formatISO = (year, month, day) => {
    const y = year;
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const handleSelectDate = (year, month, day) => {
    const isoString = formatISO(year, month, day);
    onChange(isoString);
    setIsOpen(false);
  };

  // Format displayed value
  const displayFormatted = () => {
    if (!value) return '';
    const parts = value.split('-');
    if (parts.length === 3) {
      // Return dd/mm/yyyy
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return value;
  };

  // Active day of week highlighted in blue (e.g. today or selected day's column)
  const activeDayColumn = parsedSelected && parsedSelected.month === viewMonth && parsedSelected.year === viewYear
    ? parsedSelected.dateObj.getDay()
    : new Date().getMonth() === viewMonth && new Date().getFullYear() === viewYear
    ? new Date().getDay()
    : -1;

  // Build grid days
  const gridCells = [];

  // Trailing days from previous month
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const prevMonthIdx = viewMonth === 0 ? 11 : viewMonth - 1;
    const prevYearNum = viewMonth === 0 ? viewYear - 1 : viewYear;
    const iso = formatISO(prevYearNum, prevMonthIdx, dayNum);
    const hasDot = highlightDates.includes(iso);
    gridCells.push({
      day: dayNum,
      year: prevYearNum,
      month: prevMonthIdx,
      isCurrentMonth: false,
      hasDot
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = formatISO(viewYear, viewMonth, d);
    const hasDot = highlightDates.includes(iso);
    gridCells.push({
      day: d,
      year: viewYear,
      month: viewMonth,
      isCurrentMonth: true,
      hasDot
    });
  }

  // Next month leading days to complete the 35 or 42 grid
  const remainingCells = (7 - (gridCells.length % 7)) % 7;
  for (let n = 1; n <= remainingCells; n++) {
    const nextMonthIdx = viewMonth === 11 ? 0 : viewMonth + 1;
    const nextYearNum = viewMonth === 11 ? viewYear + 1 : viewYear;
    const iso = formatISO(nextYearNum, nextMonthIdx, n);
    const hasDot = highlightDates.includes(iso);
    gridCells.push({
      day: n,
      year: nextYearNum,
      month: nextMonthIdx,
      isCurrentMonth: false,
      hasDot
    });
  }

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Input Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 flex items-center justify-between cursor-pointer hover:bg-white hover:border-slate-300 focus-within:ring-2 focus-within:ring-slate-900 transition"
      >
        <span className={value ? 'text-slate-800 font-medium' : 'text-slate-400 font-normal'}>
          {displayFormatted() || placeholder}
        </span>
        <CalendarIcon className="w-4 h-4 text-slate-400 shrink-0" />
      </div>

      {/* Hidden input for native HTML form required validation */}
      {required && (
        <input
          type="text"
          value={value}
          required={required}
          onChange={() => {}}
          className="sr-only"
          tabIndex={-1}
        />
      )}

      {/* Calendar Dropdown Popover */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 z-50 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 w-72 sm:w-76 animate-in fade-in zoom-in-95 duration-150 select-none">
          {/* Header Navigation */}
          <div className="flex items-center justify-between mb-4 px-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
              aria-label="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="text-sm tracking-tight text-center">
              <span className="font-bold text-slate-900 mr-1.5">
                {MONTH_NAMES[viewMonth]}
              </span>
              <span className="font-medium text-slate-500">
                {viewYear}
              </span>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Weekday Names */}
          <div className="grid grid-cols-7 mb-2 text-center">
            {DAY_NAMES.map((name, idx) => (
              <span
                key={name}
                className={`text-[11px] font-bold py-1 ${
                  idx === activeDayColumn
                    ? 'text-blue-600 font-extrabold'
                    : 'text-slate-800'
                }`}
              >
                {name}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-y-1.5 place-items-center text-xs">
            {gridCells.map((cell, idx) => {
              const isSelected = isSelectedDate(cell.year, cell.month, cell.day);

              return (
                <button
                  key={`${cell.year}-${cell.month}-${cell.day}-${idx}`}
                  type="button"
                  onClick={() => handleSelectDate(cell.year, cell.month, cell.day)}
                  className={`w-8 h-8 rounded-full flex flex-col items-center justify-center transition-all relative ${
                    isSelected
                      ? 'bg-blue-50 text-blue-600 font-bold ring-1 ring-blue-200'
                      : cell.isCurrentMonth
                      ? 'text-slate-700 font-medium hover:bg-slate-100'
                      : 'text-slate-300 font-normal hover:bg-slate-50'
                  }`}
                >
                  <span className="leading-none text-[12px]">{cell.day}</span>
                  {cell.hasDot && (
                    <span className={`w-1 h-1 rounded-full mt-0.5 ${
                      isSelected ? 'bg-blue-600' : 'bg-blue-500'
                    }`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
