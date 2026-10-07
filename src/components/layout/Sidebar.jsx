import React, { useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { 
  LayoutDashboard, 
  Layers, 
  FolderOpen, 
  Award, 
  Network, 
  RotateCcw, 
  X, 
  LogOut,
  ChevronDown,
  SlidersHorizontal
} from 'lucide-react';
import { 
  isViewerOnly, 
  getRoleConfig, 
  useIsMobile, 
  getMobileDirectPathForRole 
} from '@/utils/permissions';
import LastLoginWidget from './LastLoginWidget';

function getActiveMenuId(path) {
  const clean = path.replace(/^\//, '') || 'dashboard';
  if (['proker', 'history', 'kalender'].includes(clean)) return 'proker';
  if (['transparansi', 'berkas', 'anggaran', 'template'].includes(clean)) return 'transparansi';
  if (['audit', 'sp'].includes(clean)) return 'audit';
  return clean;
}

function SidebarNavList({ 
  items, 
  activeTab, 
  currentPathTab, 
  onSelectTab,
  isDpm = true,
  isKomisiOpen,
  setIsKomisiOpen,
  currentUser,
  isMobileDrawer = false 
}) {
  const directPath = isMobileDrawer ? getMobileDirectPathForRole(currentUser?.role) : null;
  const isAnyKomisiActive = currentPathTab.startsWith('komisi/') || (directPath && currentPathTab === directPath.replace(/^\//, ''));

  const allKomisiItems = [
    { id: 'komisi/keuangan', label: 'Keuangan', path: '/komisi/keuangan' },
    { id: 'komisi/kominfo', label: 'Kominfo', path: '/komisi/kominfo' },
    { id: 'komisi/advokasi', label: 'Advokasi', path: '/komisi/advokasi' },
    { id: 'komisi/bendahara', label: 'Bendahara', path: '/komisi/bendahara' },
    { id: 'audit', label: 'Pengawasan', path: '/audit' }
  ];

  // Pada HP untuk anggota komisi tertentu, langsung tampilkan sub-menu komisinya sendiri
  // Untuk Ketua, Wakil, atau tampilan Desktop, tampilkan seluruh daftar komisi
  const komisiItems = (isMobileDrawer && directPath)
    ? allKomisiItems.filter(sub => sub.path === directPath)
    : allKomisiItems.filter(sub => sub.id !== 'audit');

  return (
    <div className="p-3.5 space-y-1">
      <p className="px-3 text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-2">
        Menu Utama
      </p>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id || currentPathTab === item.id;
        return (
          <Link
            key={item.id}
            to={`/${item.id}`}
            onClick={() => onSelectTab(item.id)}
            className={`w-full min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-normal transition-all duration-150 cursor-pointer touch-manipulation select-none active:scale-[0.98] ${
              isActive
                ? 'bg-blue-50 text-blue-700 font-bold border border-blue-100/80 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-2.5 truncate">
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600 stroke-[2.2]' : 'text-slate-400 stroke-[1.8]'}`} />
              <span className="truncate tracking-tight">{item.label}</span>
            </div>
            {item.badge && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold tracking-tight shrink-0 ml-1.5 tabular-nums ${item.badge.color}`}>
                {item.badge.text}
              </span>
            )}
          </Link>
        );
      })}

      {/* Sub-menu Khusus Per-Komisi DPM (Konsep Workspace Tree) */}
      {isDpm && (
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setIsKomisiOpen(prev => !prev)}
            className={`w-full min-h-[42px] flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold tracking-normal transition-all duration-150 cursor-pointer select-none active:scale-[0.98] ${
              isAnyKomisiActive
                ? 'text-slate-900 bg-slate-100/80 font-bold'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-6 h-6 rounded-lg bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-700 shrink-0">
                <SlidersHorizontal className="w-3.5 h-3.5 stroke-[2]" />
              </div>
              <span className="truncate tracking-tight font-bold text-slate-800">Komisi</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isKomisiOpen ? 'rotate-180' : ''}`} />
          </button>

          {isKomisiOpen && (
            <div className="relative ml-6 pl-3 border-l border-slate-200/90 my-1 space-y-0.5 animate-in fade-in duration-150">
              {komisiItems.map((sub) => {
                const isSubActive = currentPathTab === sub.id;
                return (
                  <Link
                    key={sub.id}
                    to={sub.path}
                    onClick={() => onSelectTab(sub.id)}
                    className={`w-full min-h-[38px] flex items-center justify-between px-3 py-2 rounded-lg text-xs tracking-normal transition-all duration-150 cursor-pointer select-none active:scale-[0.98] ${
                      isSubActive
                        ? 'bg-slate-100 text-slate-900 font-bold shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    <span className="truncate">{sub.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SidebarRegulatoryCard() {
  return null;
}

function SidebarFooter({ currentUser, onLogout, onReset }) {
  const ormawas = useStore(state => state.ormawas);
  if (!currentUser) return null;
  const isViewer = isViewerOnly(currentUser.role);
  const roleCfg = getRoleConfig(currentUser.role);
  const userOrmawa = ormawas?.find(o => o.id === currentUser?.ormawaId) || ormawas?.find(o => o.id === 'dpm');
  const userLogo = userOrmawa?.logo || '/logos/logo-dpm.png';

  return (
    <div className="p-3.5 border-t border-slate-100 bg-slate-50/60 space-y-2 shrink-0">
      <div className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
        <div 
          className="w-9 h-9 min-w-[36px] min-h-[36px] max-w-[36px] max-h-[36px] rounded-full bg-white border border-slate-200/90 p-1 flex items-center justify-center shadow-2xs shrink-0 overflow-hidden"
          style={{ width: '36px', height: '36px' }}
        >
          <img 
            src={userLogo} 
            alt={userOrmawa?.shortName || 'Logo Ormawa'} 
            className="w-full h-full max-w-full max-h-full object-contain block" 
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              if (e.currentTarget.nextElementSibling) {
                e.currentTarget.nextElementSibling.style.display = 'flex';
              }
            }}
          />
          <span className="hidden w-full h-full bg-blue-600 text-white font-bold text-xs items-center justify-center rounded-full">
            {currentUser.name.substring(0, 2).toUpperCase()}
          </span>
        </div>
        <div className="overflow-hidden flex-1 space-y-0.5">
          <p className="text-xs font-bold text-slate-900 truncate">
            {currentUser.name}
          </p>
          <p className="text-[10px] text-blue-700 font-semibold truncate capitalize">
            {isViewer ? 'Akses Transparansi Publik' : `${roleCfg.label} • DPM`}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onLogout}
        className="w-full min-h-[40px] flex items-center justify-center gap-1.5 text-xs text-red-600 hover:text-red-700 py-2 font-bold transition bg-red-50 hover:bg-red-100 rounded-xl cursor-pointer active:scale-98"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span>{isViewer ? 'Keluar Mode Pelihat' : 'Keluar Akun'}</span>
      </button>

      {!isViewer && (
        <button
          type="button"
          onClick={onReset}
          className="w-full min-h-[36px] flex items-center justify-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 py-1.5 font-medium transition cursor-pointer active:scale-98"
        >
          <RotateCcw className="w-3 h-3 text-slate-400" />
          <span>Reset Data Demo</span>
        </button>
      )}
    </div>
  );
}

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPathTab = getActiveMenuId(location.pathname);

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
  } = useStore(useShallow(state => ({
    activeTab: state.activeTab,
    setActiveTab: state.setActiveTab,
    prokers: state.prokers,
    suratPeringatan: state.suratPeringatan,
    activityLogs: state.activityLogs,
    currentUser: state.currentUser,
    logout: state.logout,
    resetToDefaultData: state.resetToDefaultData,
    lastReadHistoryCount: state.lastReadHistoryCount,
    markHistoryAsRead: state.markHistoryAsRead,
    hasSeenTemplateTab: state.hasSeenTemplateTab,
    markTemplateTabAsSeen: state.markTemplateTabAsSeen
  })));

  const pendingProposalCount = prokers.filter(p => p.status === 'proposal_pending').length;
  const overdueLPJCount = prokers.filter(p => p.status === 'lpj_overdue').length;
  const activeSPCount = suratPeringatan.filter(s => s.status === 'active').length;
  const totalProkerLogs = activityLogs.filter(l => l.type && (l.type.startsWith('proker_') || l.type.startsWith('proposal_') || l.type.startsWith('lpj_'))).length;
  const unreadProkerLogsCount = Math.max(0, totalProkerLogs - (lastReadHistoryCount || 0));

  useEffect(() => {
    if ((activeTab === 'history' || currentPathTab === 'proker') && unreadProkerLogsCount > 0) {
      markHistoryAsRead?.();
    }
    if ((activeTab === 'template' || currentPathTab === 'transparansi') && !hasSeenTemplateTab) {
      markTemplateTabAsSeen?.();
    }
  }, [activeTab, currentPathTab, unreadProkerLogsCount, markHistoryAsRead, hasSeenTemplateTab, markTemplateTabAsSeen]);

  const isMobile = useIsMobile();
  const isGuest = currentUser?.role === 'guest';
  const isDpm = currentUser?.ormawaId === 'dpm' && !isGuest;
  const directPath = (isMobile && isDpm) ? getMobileDirectPathForRole(currentUser?.role) : null;

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'proker' && unreadProkerLogsCount > 0) markHistoryAsRead?.();
    if (tabId === 'transparansi' && !hasSeenTemplateTab) markTemplateTabAsSeen?.();
    if (tabId === 'dashboard' && directPath) {
      navigate(directPath);
    } else {
      navigate(`/${tabId}`);
    }
    onClose?.();
  };

  const handleLogout = () => {
    if (window.confirm(currentUser?.role === 'guest' ? 'Keluar dari mode tamu publik?' : 'Yakin ingin keluar dari akun?')) {
      logout();
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset data ke kondisi awal demo DPM?')) {
      resetToDefaultData();
    }
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
      label: 'Program Kerja', 
      icon: Layers, 
      badge: pendingProposalCount > 0 
        ? { text: `${pendingProposalCount} Menunggu`, color: 'bg-amber-100 text-amber-800' } 
        : unreadProkerLogsCount > 0 
          ? { text: `${unreadProkerLogsCount} Baru`, color: 'bg-blue-100 text-blue-800' } 
          : null 
    },
    { 
      id: 'transparansi', 
      label: 'Transparansi & Kas', 
      icon: FolderOpen, 
      badge: (!hasSeenTemplateTab && !isGuest)
        ? { text: 'Baru', color: 'bg-blue-100 text-blue-800' }
        : null 
    },
    { 
      id: 'audit', 
      label: 'Pengawasan & Audit', 
      icon: Award, 
      badge: activeSPCount > 0 
        ? { text: `${activeSPCount} SP Aktif`, color: 'bg-red-600 text-white' } 
        : overdueLPJCount > 0 
          ? { text: `${overdueLPJCount} Terlambat`, color: 'bg-rose-100 text-rose-800' } 
          : null 
    },
    { 
      id: 'struktur', 
      label: 'Struktur DPM', 
      icon: Network, 
      badge: null 
    }
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (!currentUser) return false;
    if (item.id === 'struktur') {
      return isDpm;
    }
    return true;
  });

  const [isKomisiOpen, setIsKomisiOpen] = React.useState(true);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[280px] h-screen sticky top-0 bg-white border-r border-slate-200/80 flex-col justify-between shrink-0 select-none z-30 overflow-hidden">
        <div className="flex-1 overflow-y-auto flex flex-col">
          <div className="p-3.5 sm:p-4 border-b border-slate-100 flex flex-col gap-2 shrink-0 bg-slate-50/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px] rounded-2xl bg-white border border-slate-200/80 p-1 flex items-center justify-center shrink-0 shadow-2xs">
                <img src="/logos/logo-dpm.png" alt="Logo DPM Fasilkom UMB" className="w-full h-full max-w-full max-h-full object-contain block" />
              </div>
              <div className="overflow-hidden min-w-0">
                <h1 className="text-sm font-extrabold text-slate-900 tracking-tight truncate leading-tight">
                  DPM FASILKOM
                </h1>
                <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                  Portal Pengawasan Ormawa
                </p>
              </div>
            </div>

            {/* Fitur Last Login Di Bawah Teks DPM Fasilkom */}
            <LastLoginWidget currentUser={currentUser} variant="sidebar" />
          </div>

          <SidebarNavList 
            items={filteredMenuItems} 
            activeTab={activeTab} 
            currentPathTab={currentPathTab} 
            onSelectTab={handleSelectTab} 
            isDpm={isDpm}
            isKomisiOpen={isKomisiOpen}
            setIsKomisiOpen={setIsKomisiOpen}
            currentUser={currentUser}
            isMobileDrawer={false}
          />

          <SidebarRegulatoryCard />
        </div>

        <SidebarFooter 
          currentUser={currentUser} 
          onLogout={handleLogout} 
          onReset={handleReset} 
        />
      </aside>

      {/* Mobile Sidebar Overlay Drawer */}
      <aside className={`lg:hidden fixed left-0 top-0 w-[285px] max-w-[85vw] h-screen h-[100dvh] min-h-[100dvh] bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 z-50 overflow-hidden sidebar-drawer ${
        isOpen ? 'sidebar-drawer-open opacity-100 pointer-events-auto visible' : 'sidebar-drawer-closed opacity-0 pointer-events-none invisible'
      }`}>
        <div className="flex-1 overflow-y-auto flex flex-col min-h-0 pb-4">
          <div className="p-3.5 sm:p-4 border-b border-slate-100 flex flex-col gap-2 shrink-0 bg-slate-50/30">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 min-w-[36px] min-h-[36px] max-w-[36px] max-h-[36px] rounded-xl bg-white border border-slate-200/80 p-1 flex items-center justify-center shrink-0 shadow-2xs">
                  <img src="/logos/logo-dpm.png" alt="Logo DPM Fasilkom UMB" className="w-full h-full max-w-full max-h-full object-contain block" />
                </div>
                <div className="overflow-hidden min-w-0">
                  <h1 className="text-sm font-black text-slate-900 tracking-tight truncate leading-tight">
                    DPM FASILKOM
                  </h1>
                  <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                    Portal Pengawasan Ormawa
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup Menu"
                className="w-10 h-10 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition shrink-0 cursor-pointer active:scale-95"
              >
                <X className="w-5 h-5 stroke-[2]" />
              </button>
            </div>

            {/* Fitur Last Login Di Bawah Teks DPM Fasilkom (Mobile) */}
            <LastLoginWidget currentUser={currentUser} variant="sidebar" />
          </div>

          <SidebarNavList 
            items={filteredMenuItems} 
            activeTab={activeTab} 
            currentPathTab={currentPathTab} 
            onSelectTab={handleSelectTab} 
            isDpm={isDpm}
            isKomisiOpen={isKomisiOpen}
            setIsKomisiOpen={setIsKomisiOpen}
            currentUser={currentUser}
            isMobileDrawer={true}
          />

          <SidebarRegulatoryCard />
        </div>

        <SidebarFooter 
          currentUser={currentUser} 
          onLogout={handleLogout} 
          onReset={handleReset} 
        />
      </aside>
    </>
  );
}
