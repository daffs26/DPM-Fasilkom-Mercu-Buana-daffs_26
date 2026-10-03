import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { Layers, CalendarDays, History } from 'lucide-react';
import ProkerView from './ProkerView';
import KalenderView from '../kalender/KalenderView';
import HistoryView from '../history/HistoryView';

export default function ProkerContainerView({
  onOpenAddProker,
  onReviewProposal,
  onOpenDetailProker,
  onAuditLPJ,
  onPrintDoc,
  calendarSelectedDate,
  onDateChange
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'daftar';

  const {
    prokers = [],
    activityLogs = [],
    lastReadHistoryCount = 0,
    markHistoryAsRead
  } = useStore(useShallow(state => ({
    prokers: state.prokers,
    activityLogs: state.activityLogs,
    lastReadHistoryCount: state.lastReadHistoryCount,
    markHistoryAsRead: state.markHistoryAsRead
  })));

  const pendingProposalCount = prokers.filter(p => p.status === 'proposal_pending').length;
  const totalProkerLogs = activityLogs.filter(l => l.type && (l.type.startsWith('proker_') || l.type.startsWith('proposal_') || l.type.startsWith('lpj_'))).length;
  const unreadProkerLogsCount = Math.max(0, totalProkerLogs - (lastReadHistoryCount || 0));

  useEffect(() => {
    if (currentTab === 'histori' && unreadProkerLogsCount > 0) {
      markHistoryAsRead?.();
    }
  }, [currentTab, unreadProkerLogsCount, markHistoryAsRead]);

  const tabs = [
    {
      id: 'daftar',
      label: 'Daftar Proker',
      icon: Layers,
      badge: pendingProposalCount > 0 ? { text: `${pendingProposalCount}`, color: 'bg-amber-100 text-amber-800' } : null
    },
    {
      id: 'kalender',
      label: 'Kalender Jadwal',
      icon: CalendarDays,
      badge: null
    },
    {
      id: 'histori',
      label: 'Riwayat & Log',
      icon: History,
      badge: unreadProkerLogsCount > 0 ? { text: `${unreadProkerLogsCount}`, color: 'bg-blue-100 text-blue-800' } : null
    }
  ];

  return (
    <div className="space-y-4">
      {/* Top Header & Sub-Navigation Segmented Control */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Program Kerja
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Kelola jadwal kegiatan, proposal, dan riwayat status program kerja ormawa.
          </p>
        </div>

        <div className="inline-flex p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 shadow-2xs self-start md:self-auto gap-1 max-w-full overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSearchParams({ tab: tab.id })}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer select-none shrink-0 active:scale-[0.98] ${
                  isActive
                    ? 'bg-white text-blue-700 shadow-2xs border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-600 stroke-[2.2]' : 'text-slate-400 stroke-[1.8]'}`} />
                <span className="tracking-tight">{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-extrabold uppercase tracking-wider ${tab.badge.color}`}>
                    {tab.badge.text}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab View */}
      {currentTab === 'kalender' && (
        <KalenderView 
          onOpenAddProker={(date) => onOpenAddProker(date || calendarSelectedDate)}
          onReviewProposal={onReviewProposal}
          onDateChange={onDateChange}
        />
      )}
      {currentTab === 'histori' && (
        <HistoryView 
          onOpenAddProker={() => onOpenAddProker('')}
          onOpenDetailProker={onOpenDetailProker}
          hideHeader={true}
        />
      )}
      {(currentTab === 'daftar' || (currentTab !== 'kalender' && currentTab !== 'histori')) && (
        <ProkerView 
          onOpenAddProker={() => onOpenAddProker('')}
          onReviewProposal={onReviewProposal}
          onOpenDetailProker={onOpenDetailProker}
          onAuditLPJ={onAuditLPJ}
          onPrintDoc={onPrintDoc}
        />
      )}
    </div>
  );
}
