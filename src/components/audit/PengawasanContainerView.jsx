import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { Award, AlertOctagon } from 'lucide-react';
import AuditView from './AuditView';
import SuratPeringatanView from '../sp/SuratPeringatanView';

export default function PengawasanContainerView({
  onAuditLPJ,
  onOpenIssueSP,
  onPrintDoc
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTab = searchParams.get('tab') || 'audit';

  const {
    currentUser,
    prokers = [],
    suratPeringatan = []
  } = useStore(useShallow(state => ({
    currentUser: state.currentUser,
    prokers: state.prokers,
    suratPeringatan: state.suratPeringatan
  })));

  const isGuest = currentUser?.role === 'guest';
  // Guest cannot access 'sp'
  const currentTab = (isGuest && rawTab === 'sp') ? 'audit' : rawTab;

  const overdueLPJCount = prokers.filter(p => p.status === 'lpj_overdue').length;
  const activeSPCount = suratPeringatan.filter(s => s.status === 'active').length;

  const allTabs = [
    {
      id: 'audit',
      label: 'Audit & Skor Ormawa',
      icon: Award,
      badge: overdueLPJCount > 0 ? { text: `${overdueLPJCount} Terlambat`, color: 'bg-rose-100 text-rose-800' } : null,
      allowed: true
    },
    {
      id: 'sp',
      label: 'Surat Peringatan',
      icon: AlertOctagon,
      badge: activeSPCount > 0 ? { text: `${activeSPCount}`, color: 'bg-red-600 text-white' } : null,
      allowed: !isGuest
    }
  ];

  const visibleTabs = allTabs.filter(t => t.allowed);

  return (
    <div className="space-y-4">
      {/* Top Header & Sub-Navigation Segmented Control */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Pengawasan &amp; Audit
          </h1>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Evaluasi LPJ dan pengawasan ormawa.
          </p>
        </div>

        <div className="inline-flex p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 shadow-2xs self-start md:self-auto gap-1 max-w-full overflow-x-auto hide-scrollbar">
          {visibleTabs.map((tab) => {
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
      {currentTab === 'sp' && !isGuest ? (
        <SuratPeringatanView 
          onOpenIssueSP={onOpenIssueSP}
          onPrintDoc={onPrintDoc}
        />
      ) : (
        <AuditView 
          onAuditLPJ={onAuditLPJ}
          onPrintDoc={onPrintDoc}
        />
      )}
    </div>
  );
}
