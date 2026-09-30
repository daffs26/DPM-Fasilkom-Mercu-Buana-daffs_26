import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { 
  Search, 
  Plus, 
  AlertOctagon, 
  Menu, 
  ChevronDown, 
  X, 
  Building2, 
  Check, 
  LogOut, 
  User, 
  Users, 
  CheckCircle, 
  XCircle,
  Bell,
  BellRing,
  CheckCheck,
  Inbox,
  Trash2
} from 'lucide-react';
import ProfileModal from './ProfileModal';
import KelolaHapusProkerModal from '@/components/proker/KelolaHapusProkerModal';

const ORMAWA_ORDER = ['dpm', 'bem', 'himti', 'himsisfo'];

function ProfileMenuDropdown({ 
  currentUser, 
  isDPMAdmin, 
  pendingAccountsCount, 
  pendingDeletionCount, 
  onOpenProfile, 
  onOpenApproval, 
  onOpenDeletion, 
  onLogout 
}) {
  return (
    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 p-2 space-y-1">
      <div className="px-3 py-2 border-b border-slate-100 mb-1">
        <p className="text-xs font-bold text-slate-900 truncate">{currentUser?.name}</p>
        <p className="text-[10px] text-slate-500 capitalize">
          {currentUser?.role === 'guest' ? 'Akses Transparansi Publik' : `${currentUser?.role} ${currentUser?.ormawaId}`}
        </p>
      </div>

      {currentUser?.role !== 'guest' && (
        <button 
          onClick={onOpenProfile} 
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
        >
          <User className="w-4 h-4 text-blue-600" />
          <span>Profil Saya &amp; Password</span>
        </button>
      )}

      {isDPMAdmin && pendingAccountsCount > 0 && (
        <button 
          onClick={onOpenApproval} 
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-amber-700 hover:bg-amber-50 rounded-xl transition cursor-pointer"
        >
          <Users className="w-4 h-4" />
          <span>Validasi Akun ({pendingAccountsCount})</span>
        </button>
      )}

      {isDPMAdmin && pendingDeletionCount > 0 && (
        <button 
          onClick={onOpenDeletion} 
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50 rounded-xl transition cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          <span>Permohonan Hapus ({pendingDeletionCount})</span>
        </button>
      )}

      <button 
        onClick={onLogout} 
        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        <span>{currentUser?.role === 'guest' ? 'Keluar Mode Tamu' : 'Keluar Akun'}</span>
      </button>
    </div>
  );
}

function NotificationMenuDropdown({ 
  userNotifications, 
  unreadNotifCount, 
  onMarkAllRead, 
  onNotificationClick,
  isMobile = false 
}) {
  return (
    <div className={isMobile 
      ? "fixed left-3 right-3 sm:left-auto sm:right-0 top-16 sm:top-full mt-1 sm:w-80 bg-white rounded-2xl border border-slate-200/90 shadow-2xl z-50 overflow-hidden"
      : "absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200/90 shadow-2xl z-50 overflow-hidden"
    }>
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center gap-1.5">
          <Bell className="w-4 h-4 text-slate-700" />
          <span className="text-xs font-bold text-slate-900 tracking-tight">Notifikasi</span>
          {unreadNotifCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold tabular-nums">
              {unreadNotifCount} baru
            </span>
          )}
        </div>
        {unreadNotifCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="text-[11px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Tandai dibaca</span>
          </button>
        )}
      </div>

      <div className={isMobile ? "max-h-72 overflow-y-auto divide-y divide-slate-100" : "max-h-80 overflow-y-auto divide-y divide-slate-100"}>
        {userNotifications.length === 0 ? (
          <div className="text-center py-8 px-4 text-slate-400 space-y-1">
            <Inbox className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs font-semibold">Belum ada notifikasi baru</p>
            <p className="text-[10px]">Aktivitas seputar proker dan pengawasan akan muncul di sini.</p>
          </div>
        ) : (
          userNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => onNotificationClick(notif)}
              className={`p-3.5 transition cursor-pointer hover:bg-slate-50 flex items-start gap-3 ${
                !notif.isRead ? 'bg-blue-50/40' : 'bg-white'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                <span className={`w-2 h-2 rounded-full block mt-1 ${!notif.isRead ? 'bg-blue-600' : 'bg-slate-300'}`} />
              </div>
              <div className="min-w-0 flex-1 space-y-0.5">
                <h5 className={`text-xs ${!notif.isRead ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                  {notif.title}
                </h5>
                <p className="text-[11px] text-slate-500 leading-snug">
                  {notif.message}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>{notif.time || notif.date}</span>
                  {notif.linkTab && (
                    <span className="text-blue-600 font-bold hover:underline">
                      Buka {notif.linkTab.toUpperCase()} &rarr;
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function Header({ onOpenAddProker, onOpenIssueSP, onToggleSidebar }) {
  const navigate = useNavigate();
  const { 
    ormawas, 
    selectedOrmawaFilter, 
    setSelectedOrmawaFilter,
    searchQuery,
    setSearchQuery,
    setActiveTab,
    currentUser,
    logout,
    pendingAccounts,
    approveAccount,
    rejectAccount,
    notifications,
    deletionRequests,
    markNotificationAsRead,
    markAllNotificationsAsRead
  } = useStore(useShallow(state => ({ 
    ormawas: state.ormawas, 
    selectedOrmawaFilter: state.selectedOrmawaFilter, 
    setSelectedOrmawaFilter: state.setSelectedOrmawaFilter, 
    searchQuery: state.searchQuery, 
    setSearchQuery: state.setSearchQuery, 
    setActiveTab: state.setActiveTab, 
    currentUser: state.currentUser, 
    logout: state.logout, 
    pendingAccounts: state.pendingAccounts, 
    approveAccount: state.approveAccount, 
    rejectAccount: state.rejectAccount, 
    notifications: state.notifications, 
    deletionRequests: state.deletionRequests, 
    markNotificationAsRead: state.markNotificationAsRead, 
    markAllNotificationsAsRead: state.markAllNotificationsAsRead 
  })));

  const [isOrmawaDropdownOpen, setIsOrmawaDropdownOpen] = useState(false);
  const [isDesktopOrmawaOpen, setIsDesktopOrmawaOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isManageDeletionOpen, setIsManageDeletionOpen] = useState(false);

  const dropdownRef = useRef(null);
  const desktopDropdownRef = useRef(null);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const mobileInputRef = useRef(null);

  const activeOrmawa = ormawas.find(o => o.id === selectedOrmawaFilter);

  const userNotifications = useMemo(() => {
    if (!currentUser) return [];
    const userOrmawa = currentUser.ormawaId;
    return (notifications || []).filter(n => {
      // Jika notifikasi sudah diklik / dibaca, jangan tampilkan lagi di dropdown
      if (n.isRead) return false;
      if (userOrmawa === 'dpm') {
        return n.targetOrmawaId === 'dpm' || n.targetOrmawaId === 'all';
      }
      return n.targetOrmawaId === userOrmawa || n.targetOrmawaId === 'all';
    });
  }, [notifications, currentUser]);

  const unreadNotifCount = userNotifications.length;
  const pendingDeletionCount = (deletionRequests || []).filter(r => r.status === 'pending').length;

  const sortedOrmawas = useMemo(() => {
    return [...ormawas].sort((a, b) => {
      const idxA = ORMAWA_ORDER.indexOf(a.id);
      const idxB = ORMAWA_ORDER.indexOf(b.id);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      return 0;
    });
  }, [ormawas]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOrmawaDropdownOpen(false);
      }
      if (desktopDropdownRef.current && !desktopDropdownRef.current.contains(e.target)) {
        setIsDesktopOrmawaOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCloseSearch = () => {
    setSearchQuery('');
    if (mobileInputRef.current) mobileInputRef.current.blur();
  };

  const handleNotificationClick = (notif) => {
    markNotificationAsRead(notif.id);
    if (notif.linkTab) {
      setActiveTab(notif.linkTab);
      navigate(`/${notif.linkTab}`);
    }
    setIsNotificationsOpen(false);
  };

  const handleLogout = () => {
    if (window.confirm(currentUser?.role === 'guest' ? 'Keluar dari mode tamu publik?' : 'Yakin ingin keluar?')) {
      logout();
    }
  };

  const isDPMAdmin = currentUser?.ormawaId === 'dpm' && currentUser?.role !== 'guest' && (currentUser?.role === 'ketua' || currentUser?.role === 'wakil');

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-20 px-3 sm:px-6 lg:px-8 py-3 sm:py-3.5">
      {/* Mobile Layout */}
      <div className="lg:hidden space-y-3">
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <button 
              onClick={onToggleSidebar} 
              className="w-10 h-10 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-700 transition shrink-0 cursor-pointer active:scale-95"
              title="Buka Navigasi"
            >
              <Menu className="w-5 h-5 stroke-[2]" />
            </button>
            <h2 className="text-sm font-black text-slate-900 tracking-tight">AUDITMAWA</h2>
          </div>

          <div className="flex items-center gap-2">
            {(currentUser?.ormawaId === 'dpm' || currentUser?.role === 'guest') && (
              <div className="relative" ref={dropdownRef}>
                <button 
                  type="button" 
                  onClick={() => setIsOrmawaDropdownOpen(prev => !prev)} 
                  className="min-h-[40px] h-10 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-2xs cursor-pointer transition active:scale-95"
                  title="Filter Ormawa"
                >
                  {activeOrmawa ? (
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 bg-white rounded-sm p-0.5 flex items-center justify-center shrink-0">
                        <img src={activeOrmawa.logo} alt={activeOrmawa.shortName} className="w-full h-full object-contain" />
                      </div>
                      <span className="max-w-[70px] truncate tracking-tight">{activeOrmawa.shortName}</span>
                    </div>
                  ) : (
                    <span className="tracking-tight">Ormawa</span>
                  )}
                  <ChevronDown className={`w-3.5 h-3.5 text-blue-200 transition-transform ${isOrmawaDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOrmawaDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-2xl border border-slate-200/90 shadow-xl z-50 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                    <button 
                      type="button" 
                      onClick={() => { setSelectedOrmawaFilter('all'); setIsOrmawaDropdownOpen(false); }} 
                      className={`w-full min-h-[38px] flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer active:scale-95 ${
                        selectedOrmawaFilter === 'all' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="tracking-tight">Semua Ormawa</span>
                      {selectedOrmawaFilter === 'all' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                    {sortedOrmawas.map(o => (
                      <button 
                        key={o.id} 
                        type="button" 
                        onClick={() => { setSelectedOrmawaFilter(o.id); setIsOrmawaDropdownOpen(false); }} 
                        className={`w-full min-h-[38px] flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer active:scale-95 ${
                          selectedOrmawaFilter === o.id ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <div className="w-5 h-5 rounded-md bg-white p-0.5 border border-slate-100 flex items-center justify-center shrink-0">
                            <img src={o.logo} alt={o.shortName} className="w-full h-full object-contain" />
                          </div>
                          <span className="truncate tracking-tight">{o.shortName}</span>
                        </div>
                        {selectedOrmawaFilter === o.id && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="relative" ref={notificationRef}>
              <button
                type="button"
                onClick={() => setIsNotificationsOpen(prev => !prev)}
                className="w-10 h-10 min-h-[40px] min-w-[40px] relative flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer active:scale-95"
                title="Notifikasi"
              >
                {unreadNotifCount > 0 ? (
                  <BellRing className="w-4 h-4 text-amber-600 animate-bounce" />
                ) : (
                  <Bell className="w-4 h-4 text-slate-500" />
                )}
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-extrabold flex items-center justify-center animate-pulse tabular-nums">
                    {unreadNotifCount > 9 ? '9+' : unreadNotifCount}
                  </span>
                )}
              </button>

              {isNotificationsOpen && (
                <NotificationMenuDropdown
                  userNotifications={userNotifications}
                  unreadNotifCount={unreadNotifCount}
                  onMarkAllRead={() => markAllNotificationsAsRead(currentUser?.ormawaId)}
                  onNotificationClick={handleNotificationClick}
                  isMobile
                />
              )}
            </div>

            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(prev => !prev)} 
                className="w-10 h-10 min-h-[40px] min-w-[40px] rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs cursor-pointer active:scale-95"
              >
                {currentUser?.name?.substring(0, 2).toUpperCase() || 'US'}
              </button>
              {isProfileOpen && (
                <ProfileMenuDropdown
                  currentUser={currentUser}
                  isDPMAdmin={isDPMAdmin}
                  pendingAccountsCount={pendingAccounts.length}
                  pendingDeletionCount={pendingDeletionCount}
                  onOpenProfile={() => { setIsProfileModalOpen(true); setIsProfileOpen(false); }}
                  onOpenApproval={() => { setIsApprovalModalOpen(true); setIsProfileOpen(false); }}
                  onOpenDeletion={() => { setIsManageDeletionOpen(true); setIsProfileOpen(false); }}
                  onLogout={handleLogout}
                />
              )}
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="relative flex items-center rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input 
              ref={mobileInputRef} 
              type="text" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              placeholder="Cari proker, dokumen, PIC..." 
              className="w-full min-h-[40px] h-10 pl-10 pr-9 text-xs bg-transparent rounded-2xl focus:outline-none tracking-normal font-medium text-slate-800 placeholder:text-slate-400" 
            />
            {searchQuery && (
              <button 
                type="button" 
                onClick={handleCloseSearch} 
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 rounded-md transition cursor-pointer"
                title="Hapus pencarian"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="flex items-center justify-between gap-3">
          <div className="shrink-0 min-w-0">
            <h2 className="text-xs xl:text-sm font-extrabold text-slate-900 tracking-tight whitespace-nowrap">
              Sistem Pengawasan DPM FASILKOM
            </h2>
            <p className="text-[10px] xl:text-[11px] text-slate-500 mt-0.5 whitespace-nowrap">
              Portal audit &amp; akuntabilitas
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {(currentUser?.ormawaId === 'dpm' || currentUser?.role === 'guest') && (
              <div className="relative" ref={desktopDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDesktopOrmawaOpen(prev => !prev)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-xs font-bold text-slate-700 shadow-2xs transition cursor-pointer"
                  title="Pilih Entitas Ormawa"
                >
                  {activeOrmawa ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-md bg-white p-0.5 border border-slate-200 flex items-center justify-center shrink-0">
                        <img src={activeOrmawa.logo} alt={activeOrmawa.shortName} className="w-full h-full object-contain" />
                      </div>
                      <span className="text-slate-900 font-bold">{activeOrmawa.shortName}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Semua Ormawa</span>
                    </div>
                  )}
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isDesktopOrmawaOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDesktopOrmawaOpen && (
                  <div className="absolute left-0 top-full mt-1.5 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                    <button
                      type="button"
                      onClick={() => { setSelectedOrmawaFilter('all'); setIsDesktopOrmawaOpen(false); }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        selectedOrmawaFilter === 'all' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>Semua Ormawa (Fasilkom)</span>
                      {selectedOrmawaFilter === 'all' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                    {sortedOrmawas.map(o => (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => { setSelectedOrmawaFilter(o.id); setIsDesktopOrmawaOpen(false); }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                          selectedOrmawaFilter === o.id ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <div className="w-5 h-5 rounded-md bg-white p-0.5 border border-slate-100 flex items-center justify-center shrink-0">
                            <img src={o.logo} alt={o.shortName} className="w-full h-full object-contain" />
                          </div>
                          <span className="truncate">{o.shortName}</span>
                        </div>
                        {selectedOrmawaFilter === o.id && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="relative w-44 xl:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input 
                type="text" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                placeholder="Cari proker, dokumen..." 
                className="w-full h-9 rounded-full border border-slate-200/90 bg-slate-50 pl-10 pr-8 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-2xs font-medium" 
              />
              {searchQuery && (
                <button 
                  type="button" 
                  onClick={handleCloseSearch} 
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 rounded-md transition cursor-pointer"
                  title="Hapus pencarian"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="relative" ref={notificationRef}>
              <button
                type="button"
                onClick={() => setIsNotificationsOpen(prev => !prev)}
                className="relative p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700 transition cursor-pointer"
                title="Notifikasi Sistem"
              >
                {unreadNotifCount > 0 ? (
                  <BellRing className="w-4 h-4 text-amber-600 animate-bounce" />
                ) : (
                  <Bell className="w-4 h-4 text-slate-600" />
                )}
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-rose-600 text-white text-[10px] font-extrabold flex items-center justify-center animate-pulse border-2 border-white">
                    {unreadNotifCount > 9 ? '9+' : unreadNotifCount}
                  </span>
                )}
              </button>

              {isNotificationsOpen && (
                <NotificationMenuDropdown
                  userNotifications={userNotifications}
                  unreadNotifCount={unreadNotifCount}
                  onMarkAllRead={() => markAllNotificationsAsRead(currentUser?.ormawaId)}
                  onNotificationClick={handleNotificationClick}
                />
              )}
            </div>

            {currentUser?.role !== 'guest' && (
              <>
                <button onClick={onOpenIssueSP} className="flex items-center gap-1.5 px-2.5 xl:px-3 py-2 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 cursor-pointer">
                  <AlertOctagon className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline">Cetak SP</span>
                  <span className="xl:hidden">SP</span>
                </button>
                <Button onClick={onOpenAddProker} size="sm" className="rounded-xl flex items-center gap-1.5 cursor-pointer">
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline">Tambah Proker</span>
                  <span className="xl:hidden">Proker</span>
                </Button>
              </>
            )}
            
            <div className="relative ml-1" ref={profileRef}>
              <button onClick={() => setIsProfileOpen(prev => !prev)} className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-xs cursor-pointer">
                {currentUser?.name?.substring(0, 2).toUpperCase() || 'US'}
              </button>
              {isProfileOpen && (
                <ProfileMenuDropdown
                  currentUser={currentUser}
                  isDPMAdmin={isDPMAdmin}
                  pendingAccountsCount={pendingAccounts.length}
                  pendingDeletionCount={pendingDeletionCount}
                  onOpenProfile={() => { setIsProfileModalOpen(true); setIsProfileOpen(false); }}
                  onOpenApproval={() => { setIsApprovalModalOpen(true); setIsProfileOpen(false); }}
                  onOpenDeletion={() => { setIsManageDeletionOpen(true); setIsProfileOpen(false); }}
                  onLogout={handleLogout}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Validasi Akun */}
      <Dialog open={isApprovalModalOpen} onOpenChange={setIsApprovalModalOpen}>
        <DialogContent className="w-[95vw] sm:max-w-xl p-0 overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-2xl max-h-[85vh] flex flex-col">
          <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-5 pb-3 border-b border-slate-100 bg-slate-50/50 space-y-1.5 shrink-0">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] font-bold">DPM FASILKOM UMB</Badge>
            </div>
            <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 tracking-tight pt-0.5">Persetujuan Akun Pengurus</DialogTitle>
            <DialogDescription className="text-xs text-slate-500">Berikut adalah daftar akun ormawa yang menunggu validasi/ACC.</DialogDescription>
          </DialogHeader>
          <div className="p-4 sm:p-6 overflow-y-auto space-y-3">
            {pendingAccounts.length === 0 ? (
              <div className="text-center py-8"><Users className="w-12 h-12 text-slate-200 mx-auto mb-3" /><p className="text-sm font-bold text-slate-500">Tidak ada antrean validasi akun</p></div>
            ) : (
              pendingAccounts.map(account => (
                <div key={account.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border border-slate-200 rounded-2xl bg-white shadow-2xs">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{account.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">{account.nim} • Username: <span className="font-semibold text-slate-700">{account.username}</span></p>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-blue-50 border border-blue-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">{account.role} {account.ormawaId}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:shrink-0 mt-1 sm:mt-0">
                    <Button variant="outline" size="sm" onClick={() => rejectAccount(account.id)} className="border-red-200 text-red-600 hover:bg-red-50 h-9 px-3 rounded-xl"><XCircle className="w-4 h-4 mr-1.5" /><span className="text-xs font-bold">Tolak</span></Button>
                    <Button size="sm" onClick={() => approveAccount(account.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white h-9 px-3 rounded-xl"><CheckCircle className="w-4 h-4 mr-1.5" /><span className="text-xs font-bold">Setujui</span></Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      />

      <KelolaHapusProkerModal 
        isOpen={isManageDeletionOpen} 
        onClose={() => setIsManageDeletionOpen(false)} 
      />
    </header>
  );
}
