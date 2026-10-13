import React from 'react';
import { useStore } from '@/store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { Plus } from 'lucide-react';
import KalenderView from './KalenderView';
import { canModifyProker } from '@/utils/permissions';

export default function KalenderContainerView({
  onOpenAddProker,
  onReviewProposal,
  calendarSelectedDate,
  onDateChange
}) {
  const { currentUser } = useStore(useShallow(state => ({
    currentUser: state.currentUser
  })));

  const canAdd = canModifyProker(currentUser?.role);

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Kalender Jadwal Kegiatan
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Sinkronisasi kalender terpadu program kerja ormawa, hari libur nasional, dan deteksi jadwal bentrok.
          </p>
        </div>

        {canAdd && (
          <button
            type="button"
            onClick={() => onOpenAddProker?.(calendarSelectedDate || '')}
            className="inline-flex items-center justify-center gap-2 min-h-[44px] h-11 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition active:scale-95 cursor-pointer shrink-0 self-stretch sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Ajukan Kegiatan Baru</span>
          </button>
        )}
      </div>

      {/* Kalender View */}
      <KalenderView 
        onOpenAddProker={(date) => onOpenAddProker?.(date || calendarSelectedDate)}
        onReviewProposal={onReviewProposal}
        onDateChange={onDateChange}
      />
    </div>
  );
}
