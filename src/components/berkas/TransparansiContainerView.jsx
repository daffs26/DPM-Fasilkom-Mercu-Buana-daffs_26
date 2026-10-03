import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { FolderOpen, Wallet, ScrollText } from 'lucide-react';
import BerkasView from './BerkasView';
import AnggaranView from '../anggaran/AnggaranView';
import TemplateView from '../template/TemplateDokumenView';

export default function TransparansiContainerView({
  onReviewProposal,
  onAuditLPJ,
  onOpenSetPagu,
  onOpenAddTransaction,
  onPrintDoc
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTab = searchParams.get('tab') || 'berkas';

  const {
    currentUser,
    hasSeenTemplateTab = false,
    markTemplateTabAsSeen
  } = useStore(useShallow(state => ({
    currentUser: state.currentUser,
    hasSeenTemplateTab: state.hasSeenTemplateTab,
    markTemplateTabAsSeen: state.markTemplateTabAsSeen
  })));

  const isGuest = currentUser?.role === 'guest';
  const currentTab = (isGuest && rawTab === 'template') ? 'berkas' : rawTab;

  useEffect(() => {
    if (currentTab === 'template' && !hasSeenTemplateTab) {
      markTemplateTabAsSeen?.();
    }
  }, [currentTab, hasSeenTemplateTab, markTemplateTabAsSeen]);

  const allTabs = [
    {
      id: 'berkas',
      label: 'Berkas Dokumen',
      icon: FolderOpen,
      badge: null,
      allowed: true
    },
    {
      id: 'anggaran',
      label: 'Anggaran & Kas',
      icon: Wallet,
      badge: null,
      allowed: true
    },
    {
      id: 'template',
      label: 'Template Dokumen',
      icon: ScrollText,
      badge: !hasSeenTemplateTab ? { text: 'Baru', color: 'bg-blue-100 text-blue-800' } : null,
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
            Transparansi &amp; Kas
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Pusat berkas resmi, laporan kas anggaran, dan template dokumen standar.
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
      {currentTab === 'template' && !isGuest && (
        <TemplateView />
      )}
      {currentTab === 'anggaran' && (
        <AnggaranView 
          onOpenSetPagu={onOpenSetPagu}
          onOpenAddTransaction={onOpenAddTransaction}
          onPrintDoc={onPrintDoc}
        />
      )}
      {(currentTab === 'berkas' || (currentTab !== 'anggaran' && currentTab !== 'template')) && (
        <BerkasView 
          onReviewProposal={onReviewProposal}
          onAuditLPJ={onAuditLPJ}
        />
      )}
    </div>
  );
}
