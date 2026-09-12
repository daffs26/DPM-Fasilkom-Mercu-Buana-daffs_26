import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { 
  LayoutDashboard, 
  Layers, 
  History,
  Wallet,
  FolderOpen, 
  Award, 
  CalendarDays, 
  AlertOctagon, 
  ShieldAlert,
  RotateCcw,
  ScrollText,
  X,
  LogOut
} from 'lucide-react';
export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPathTab = location.pathname.replace(/^\//, '') || 'dashboard';

  const {
    activeTab, 
    setActiveTab, 
    prokers, 
    suratPeringatan,
    activityLogs = [],
    currentUser,
    logout,
    resetToDefaultData,
    lastReadHistoryCount = 0,
    markHistoryAsRead,
    hasSeenTemplateTab = false,
    markTemplateTabAsSeen
  } = useStore(useShallow(state => ({ activeTab: state.activeTab, setActiveTab: state.setActiveTab, prokers: state.prokers, suratPeringatan: state.suratPeringatan, activityLogs: state.activityLogs, currentUser: state.currentUser, logout: state.logout, resetToDefaultData: state.resetToDefaultData, lastReadHistoryCount: state.lastReadHistoryCount, markHistoryAsRead: state.markHistoryAsRead, hasSeenTemplateTab: state.hasSeenTemplateTab, markTemplateTabAsSeen: state.markTemplateTabAsSeen })));

  // Hitung badge
  const pendingProposalCount = prokers.filter(p => p.status === 'proposal_pending').length;
  const overdueLPJCount = prokers.filter(p => p.status === 'lpj_overdue').length;
  const activeSPCount = suratPeringatan.filter(s => s.status === 'active').length;
  const totalProkerLogs = activityLogs.filter(l => l.type === 'proker_added' || l.type === 'proker_deleted').length;
  const unreadProkerLogsCount = Math.max(0, totalProkerLogs - (lastReadHistoryCount || 0));

  // Ketika pengguna membuka tab Histori Proker, otomatis tandai notifikasi sebagai sudah dibaca
  useEffect(() => {
    if ((activeTab === 'history' || currentPathTab === 'history') && unreadProkerLogsCount > 0) {
      markHistoryAsRead?.();
    }
    if ((activeTab === 'template' || currentPathTab === 'template') && !hasSeenTemplateTab) {
      markTemplateTabAsSeen?.();
    }
  }, [activeTab, currentPathTab, unreadProkerLogsCount, markHistoryAsRead, hasSeenTemplateTab, markTemplateTabAsSeen]);

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'history') {
      markHistoryAsRead?.();
    }
    if (tabId === 'template') {
      markTemplateTabAsSeen?.();
    }
    navigate(`/${tabId}`);
    onClose?.();
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'proker',
      label: 'Proker',
      icon: Layers,
      badge: pendingProposalCount > 0 ? { text: `${pendingProposalCount} Pending`, color: 'bg-amber-100 text-amber-800' } : null
    },
    {
      id: 'history',
      label: 'Histori Proker',
      icon: History,
      badge: unreadProkerLogsCount > 0 ? { text: `${unreadProkerLogsCount}`, color: 'bg-blue-100 text-blue-800' } : null
    },
    {
      id: 'anggaran',
      label: 'Kelola Anggaran',
      icon: Wallet,
      badge: null
    },
    {
      id: 'berkas',
      label: 'Transparansi Berkas',
      icon: FolderOpen,
      badge: null
    },
    {
      id: 'template',
      label: 'Template Dokumen',
      icon: ScrollText,
      badge: !hasSeenTemplateTab ? { text: 'Baru', color: 'bg-blue-100 text-blue-800' } : null
    },
    {
      id: 'audit',
      label: 'Audit & Skor Ormawa',
      icon: Award,
      badge: overdueLPJCount > 0 ? { text: `${overdueLPJCount} Terlambat`, color: 'bg-rose-100 text-rose-800' } : null
    },
    {
      id: 'kalender',
      label: 'Kalender Kegiatan',
      icon: CalendarDays,
      badge: null
    },
    {
      id: 'sp',
      label: 'Surat Peringatan',
      icon: AlertOctagon,
      badge: activeSPCount > 0 ? { text: `${activeSPCount} Aktif`, color: 'bg-red-600 text-white' } : null
    }
  ];

  // Filter menu items based on role
  const filteredMenuItems = menuItems.filter(item => {
    if (!currentUser) return false;
    
    // Guest / Publik hanya dapat melihat modul transparansi publik
    if (currentUser.role === 'guest') {
      return ['dashboard', 'proker', 'history', 'anggaran', 'berkas', 'audit', 'kalender'].includes(item.id);
    }

    // DPM has full access (Ketua/Wakil) or partial (Sekre, Bendahara)
    if (currentUser.ormawaId === 'dpm') {
      if (currentUser.role === 'ketua' || currentUser.role === 'wakil') return true;
      if (currentUser.role === 'sekre') {
        return ['dashboard', 'berkas', 'template', 'kalender', 'proker', 'history'].includes(item.id);
      }
      if (currentUser.role === 'bendahara') {
        return ['dashboard', 'anggaran', 'history'].includes(item.id);
      }
    } else {
      // BEM/HIMSISFO/HIMTI
      if (currentUser.role === 'ketua' || currentUser.role === 'wakil') {
        return ['dashboard', 'proker', 'history', 'berkas', 'kalender', 'template'].includes(item.id);
      }
      if (currentUser.role === 'sekre') {
        return ['dashboard', 'proker', 'history', 'berkas', 'template', 'kalender'].includes(item.id);
      }
      if (currentUser.role === 'bendahara') {
        return ['dashboard', 'anggaran', 'history'].includes(item.id);
      }
    }
    return true; // fallback
  });

  return (
    <>
      {/* Desktop sidebar — always visible, sticky, in document flow */}
      <aside className="hidden lg:flex w-[280px] h-screen sticky top-0 bg-white border-r border-slate-200/80 flex-col justify-between shrink-0 select-none z-30 overflow-hidden">
      <div className="flex-1 overflow-y-auto flex flex-col">
        {/* Institutional Branding */}
          <div className="p-5 border-b border-slate-100 flex items-center gap-3 shrink-0">
            <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-200/80 p-1 flex items-center justify-center shrink-0 shadow-xs">
              <img 
                src="/logos/logo-dpm.png" 
                alt="Logo DPM Fasilkom UMB" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="overflow-hidden">
              <h1 className="text-sm font-extrabold text-slate-900 tracking-normal mt-0.5 truncate">
                DPM FASILKOM
              </h1>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="p-3.5 space-y-1.5">
            <p className="px-3 text-[10px] font-bold tracking-wider uppercase text-slate-400 mb-2">
            Menu Legislatif & Pengawasan
          </p>
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || currentPathTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-bold border border-blue-100/80 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600 stroke-[2.2]' : 'text-slate-400 stroke-[1.8]'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ml-1.5 ${item.badge.color}`}>
                    {item.badge.text}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Standar Pengawasan Box (Slide 3 Feature Style) */}
        <div className="px-3.5 py-2">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-50 via-blue-50/25 to-slate-50 border border-blue-100/80 shadow-2xs text-slate-800">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100/80 shadow-2xs">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-900 tracking-tight">Standar Pengawasan DPM</span>
            </div>
            <div className="space-y-1.5 text-[11px] text-slate-600 leading-snug font-normal">
              <div className="flex items-start gap-1.5">
                <span className="text-blue-500 font-bold shrink-0 mt-0.5">•</span>
                <span>Proposal diajukan <strong className="text-slate-900 font-semibold">minimal 14 hari sebelum acara</strong> (H-14)</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-blue-500 font-bold shrink-0 mt-0.5">•</span>
                <span>LPJ diserahkan <strong className="text-slate-900 font-semibold">maksimal 14 hari setelah acara</strong> (H+14)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Role & Reset Controls */}
      <div className="p-3.5 border-t border-slate-100 bg-slate-50/60 space-y-2.5 shrink-0">
        {/* User Card */}
        {currentUser && (
          <div className="flex items-center gap-2.5 p-2 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
              {currentUser.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-blue-700 font-semibold truncate capitalize">
                {currentUser.role === 'guest' ? 'Akses Transparansi Publik' : `${currentUser.role} ${currentUser.ormawaId.toUpperCase()}`}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={() => {
            if (window.confirm('Yakin ingin keluar?')) {
              logout();
            }
          }}
          className="w-full flex items-center justify-center gap-1.5 text-[11px] text-red-500 hover:text-red-700 py-1 font-medium transition bg-red-50 hover:bg-red-100 rounded-lg"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Keluar Sistem</span>
        </button>

        {currentUser.role !== 'guest' && (
          <button
            onClick={() => {
              if (window.confirm('Reset data ke kondisi awal demo DPM?')) {
                resetToDefaultData();
              }
            }}
            className="w-full flex items-center justify-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-800 py-1 font-medium transition"
          >
            <RotateCcw className="w-3 h-3 text-slate-400" />
            <span>Reset Data Demo</span>
          </button>
        )}
      </div>
    </aside>

      {/* Mobile sidebar — fixed overlay drawer, only on < lg */}
      <aside className={`lg:hidden fixed left-0 top-0 w-[280px] h-screen bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 select-none z-50 overflow-hidden sidebar-drawer ${
        isOpen ? 'sidebar-drawer-open opacity-100 pointer-events-auto visible' : 'sidebar-drawer-closed opacity-0 pointer-events-none invisible'
      }`}>
        <div className="flex-1 overflow-y-auto flex flex-col">
          {/* Institutional Branding with Close Button */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-200/80 p-1 flex items-center justify-center shrink-0 shadow-xs">
                <img src="/logos/logo-dpm.png" alt="Logo DPM Fasilkom UMB" className="w-full h-full object-contain" />
              </div>
              <div className="overflow-hidden">
                <h1 className="text-sm font-extrabold text-slate-900 tracking-normal mt-0.5 truncate">
                  DPM FASILKOM
                </h1>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Tutup Menu"
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Menu */}
          <div className="p-3.5 space-y-1.5">
            <p className="px-3 text-[10px] font-bold tracking-wider uppercase text-slate-400 mb-2">
              Menu Legislatif & Pengawasan
            </p>
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || currentPathTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-bold border border-blue-100/80 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600 stroke-[2.2]' : 'text-slate-400 stroke-[1.8]'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ml-1.5 ${item.badge.color}`}>
                      {item.badge.text}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Standar Pengawasan Box */}
          <div className="px-3.5 py-2">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-50 via-blue-50/25 to-slate-50 border border-blue-100/80 shadow-2xs text-slate-800">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900 tracking-tight">Standar Pengawasan</span>
              </div>
              <div className="space-y-1.5 text-[11px] text-slate-600 leading-snug font-normal">
                <div className="flex items-start gap-1.5">
                  <span className="text-blue-500 font-bold shrink-0 mt-0.5">•</span>
                  <span>Proposal diajukan <strong className="text-slate-900 font-semibold">minimal 14 hari sebelum acara</strong> (H-14)</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-blue-500 font-bold shrink-0 mt-0.5">•</span>
                  <span>LPJ diserahkan <strong className="text-slate-900 font-semibold">maksimal 14 hari setelah acara</strong> (H+14)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Role & Reset Controls */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50/60 space-y-2.5 shrink-0">
          {currentUser && (
            <div className="flex items-center gap-2.5 p-2 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
                {currentUser.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-blue-700 font-semibold truncate capitalize">
                  {currentUser.role === 'guest' ? 'Akses Transparansi Publik' : `${currentUser.role} ${currentUser.ormawaId.toUpperCase()}`}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={() => {
              if (window.confirm('Yakin ingin keluar?')) {
                logout();
              }
            }}
            className="w-full flex items-center justify-center gap-1.5 text-[11px] text-red-500 hover:text-red-700 py-1.5 font-medium transition bg-red-50 hover:bg-red-100 rounded-lg"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Sistem</span>
          </button>

          {currentUser.role !== 'guest' && (
            <button
              onClick={() => {
                if (window.confirm('Reset data ke kondisi awal demo DPM?')) {
                  resetToDefaultData();
                }
              }}
              className="w-full flex items-center justify-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-800 py-1 font-medium transition"
            >
              <RotateCcw className="w-3 h-3 text-slate-400" />
              <span>Reset Data Demo</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}

