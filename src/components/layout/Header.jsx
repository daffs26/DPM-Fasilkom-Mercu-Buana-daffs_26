import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
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
  Filter, 
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
  Trash2,
  KeyRound,
  FileText
} from 'lucide-react';
import ProfileModal from './components/ProfileModal';
import ManageDeletionRequestsModal from '../proker/components/ManageDeletionRequestsModal';

export default function Header({ onOpenAddProker, onOpenIssueSP, onToggleSidebar }) {
  const navigate = useNavigate();
  const { 
    ormawas, 
    selectedOrmawaFilter, 
    setSelectedOrmawaFilter,
    searchQuery,
    setSearchQuery,
    prokers,
    activeTab,
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
  } = useStore(useShallow(state => ({ ormawas: state.ormawas, selectedOrmawaFilter: state.selectedOrmawaFilter, setSelectedOrmawaFilter: state.setSelectedOrmawaFilter, searchQuery: state.searchQuery, setSearchQuery: state.setSearchQuery, prokers: state.prokers, activeTab: state.activeTab, setActiveTab: state.setActiveTab, currentUser: state.currentUser, logout: state.logout, pendingAccounts: state.pendingAccounts, approveAccount: state.approveAccount, rejectAccount: state.rejectAccount, notifications: state.notifications, deletionRequests: state.deletionRequests, markNotificationAsRead: state.markNotificationAsRead, markAllNotificationsAsRead: state.markAllNotificationsAsRead })));

  const [isOrmawaDropdownOpen, setIsOrmawaDropdownOpen] = useState(false);
  const [isDesktopOrmawaOpen, setIsDesktopOrmawaOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isManageDeletionOpen, setIsManageDeletionOpen] = useState(false);

  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const desktopDropdownRef = useRef(null);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  const overdueCount = prokers.filter(p => p.status === 'lpj_overdue').length;
  const activeOrmawa = ormawas.find(o => o.id === selectedOrmawaFilter);

  // Filter notifikasi sesuai role & ormawa pengguna aktif
  const userNotifications = useMemo(() => {
    if (!currentUser) return [];
    const userOrmawa = currentUser.ormawaId;
    return (notifications || []).filter(n => {
      if (userOrmawa === 'dpm') {
        return n.targetOrmawaId === 'dpm' || n.targetOrmawaId === 'all';
      }
      return n.targetOrmawaId === userOrmawa || n.targetOrmawaId === 'all';
    });
  }, [notifications, currentUser]);

  const unreadNotifCount = userNotifications.filter(n => !n.isRead).length;
  const pendingDeletionCount = (deletionRequests || []).filter(r => r.status === 'pending').length;

  const ormawaOrder = ['dpm', 'bem', 'himti', 'himsisfo'];
  const sortedOrmawas = useMemo(() => {
    return [...ormawas].sort((a, b) => {
      const idxA = ormawaOrder.indexOf(a.id);
      const idxB = ormawaOrder.indexOf(b.id);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      return 0;
    });
  }, [ormawas]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
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

  const mobileInputRef = useRef(null);
  const handleCloseSearch = () => {
    setSearchQuery('');
    setIsSearchFocused(false);
    if (mobileInputRef.current) mobileInputRef.current.blur();
  };

  const predictiveSuggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const corpus = ['Proposal Kegiatan', 'Laporan Pertanggungjawaban (LPJ)', 'Sidang Umum Mahasiswa', 'Surat Peringatan (SP)', 'Surat Izin Dispensasi', 'Proposal Sponsor & Kerjasama', 'Surat Izin Peminjaman Ruangan', 'Audit LPJ Ormawa', 'Review Proposal DPM', 'Rancangan Anggaran Biaya (RAB)', 'Alokasi Anggaran Ormawa', 'Serapan Dana Kemahasiswaan', 'Rundown Acara', 'Seminar Nasional', 'Workshop Teknologi', 'Malam Keakraban (Makrab)', 'Latihan Kepemimpinan (LKMM-TD)', 'Tech Fair & Expo', 'Musyawarah Besar', 'Bakti Sosial', 'Webinar Fasilkom'];
    ormawas.forEach(o => { if (o.shortName && !corpus.includes(o.shortName)) corpus.push(o.shortName); if (o.name && !corpus.includes(o.name)) corpus.push(o.name); });
    prokers.forEach(p => { if (p.title && !corpus.includes(p.title)) corpus.push(p.title); if (p.divisi && !corpus.includes(p.divisi)) corpus.push(p.divisi); if (p.pic && !corpus.includes(p.pic)) corpus.push(p.pic); });
    const exactPrefix = [], wordPrefix = [], contains = [];
    corpus.forEach(item => {
      const itemLower = item.toLowerCase();
      if (itemLower.startsWith(q)) exactPrefix.push(item);
      else {
        const words = itemLower.split(/[\s\-_\/()]+/);
        if (words.some(w => w.startsWith(q))) wordPrefix.push(item);
        else if (itemLower.includes(q)) contains.push(item);
      }
    });
    return [...exactPrefix, ...wordPrefix, ...contains].slice(0, 5);
  }, [searchQuery, prokers, ormawas]);

  const isDPMAdmin = currentUser?.ormawaId === 'dpm' && currentUser?.role !== 'guest' && (currentUser?.role === 'ketua' || currentUser?.role === 'wakil');

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-20 px-3 sm:px-6 lg:px-8 py-3 sm:py-3.5">
      <div className="lg:hidden space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button onClick={onToggleSidebar} className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition shrink-0 -ml-1">
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-extrabold text-slate-900 tracking-normal">AUDITMAWA</h2>
          </div>
          <div className="flex items-center gap-2">
            {currentUser?.ormawaId === 'dpm' && (
              <div className="relative" ref={dropdownRef}>
                <button type="button" onClick={() => setIsOrmawaDropdownOpen(prev => !prev)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-2xs">
                  {activeOrmawa ? <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 bg-white rounded-sm p-0.5"><img src={activeOrmawa.logo} alt={activeOrmawa.shortName} className="w-full h-full object-contain" /></div><span>{activeOrmawa.shortName}</span></div> : <span>Semua Ormawa</span>}
                  <ChevronDown className={`w-3.5 h-3.5 text-blue-200 transition-transform ${isOrmawaDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOrmawaDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 p-1.5 space-y-1">
                    <button type="button" onClick={() => { setSelectedOrmawaFilter('all'); setIsOrmawaDropdownOpen(false); }} className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold ${selectedOrmawaFilter === 'all' ? 'bg-blue-50 text-blue-700' : 'text-slate-700'}`}>Semua Ormawa</button>
                    {ormawas.map(o => (
                      <button key={o.id} type="button" onClick={() => { setSelectedOrmawaFilter(o.id); setIsOrmawaDropdownOpen(false); }} className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold ${selectedOrmawaFilter === o.id ? 'bg-blue-600 text-white' : 'text-blue-700'}`}>
                        <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-md bg-white p-0.5"><img src={o.logo} alt={o.shortName} className="w-full h-full object-contain" /></div><span>{o.shortName}</span></div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Mobile Notification Bell */}
            <div className="relative" ref={notificationRef}>
              <button
                type="button"
                onClick={() => setIsNotificationsOpen(prev => !prev)}
                className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                title="Notifikasi"
              >
                {unreadNotifCount > 0 ? (
                  <BellRing className="w-4 h-4 text-amber-600 animate-bounce" />
                ) : (
                  <Bell className="w-4 h-4 text-slate-500" />
                )}
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-extrabold flex items-center justify-center animate-pulse">
                    {unreadNotifCount > 9 ? '9+' : unreadNotifCount}
                  </span>
                )}
              </button>

              {isNotificationsOpen && (
                <div className="fixed sm:absolute right-2 sm:right-0 top-14 sm:top-full mt-1 w-[92vw] sm:w-80 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-100 bg-slate-50/70">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Bell className="w-3.5 h-3.5" />
                      <span>Notifikasi ({unreadNotifCount})</span>
                    </span>
                    {unreadNotifCount > 0 && (
                      <button
                        type="button"
                        onClick={() => markAllNotificationsAsRead(currentUser?.ormawaId)}
                        className="text-[10px] text-blue-600 hover:underline font-bold"
                      >
                        Tandai dibaca
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {userNotifications.length === 0 ? (
                      <div className="py-6 text-center text-slate-400 text-xs">Belum ada notifikasi</div>
                    ) : (
                      userNotifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationAsRead(n.id);
                            if (n.linkTab) {
                              setActiveTab(n.linkTab);
                              navigate(`/${n.linkTab}`);
                            }
                            setIsNotificationsOpen(false);
                          }}
                          className={`p-3 text-left transition cursor-pointer ${!n.isRead ? 'bg-blue-50/40' : 'hover:bg-slate-50'}`}
                        >
                          <h5 className="text-xs font-bold text-slate-900">{n.title}</h5>
                          <p className="text-[11px] text-slate-500 leading-snug mt-0.5">{n.message}</p>
                          <span className="text-[9px] text-slate-400 block mt-1">{n.time || n.date}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={profileRef}>
              <button onClick={() => setIsProfileOpen(prev => !prev)} className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {currentUser?.name?.substring(0, 2).toUpperCase() || 'US'}
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 p-2 space-y-1">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="text-xs font-bold text-slate-900 truncate">{currentUser?.name}</p>
                    <p className="text-[10px] text-slate-500 capitalize">
                      {currentUser?.role === 'guest' ? 'Akses Transparansi Publik' : `${currentUser?.role} ${currentUser?.ormawaId}`}
                    </p>
                  </div>
                  {currentUser?.role !== 'guest' && (
                    <button 
                      onClick={() => { setIsProfileModalOpen(true); setIsProfileOpen(false); }} 
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition"
                    >
                      <User className="w-4 h-4 text-blue-600" />
                      <span>Profil Saya &amp; Password</span>
                    </button>
                  )}
                  {isDPMAdmin && pendingAccounts.length > 0 && (
                    <button onClick={() => { setIsApprovalModalOpen(true); setIsProfileOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-amber-700 hover:bg-amber-50 rounded-xl transition">
                      <Users className="w-4 h-4" />
                      <span>Validasi Akun ({pendingAccounts.length})</span>
                    </button>
                  )}
                  {isDPMAdmin && pendingDeletionCount > 0 && (
                    <button onClick={() => { setIsManageDeletionOpen(true); setIsProfileOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50 rounded-xl transition">
                      <Trash2 className="w-4 h-4" />
                      <span>Permohonan Hapus ({pendingDeletionCount})</span>
                    </button>
                  )}
                  <button onClick={() => { if (window.confirm(currentUser?.role === 'guest' ? 'Keluar dari mode tamu publik?' : 'Yakin ingin keluar?')) logout(); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition">
                    <LogOut className="w-4 h-4" />
                    <span>{currentUser?.role === 'guest' ? 'Keluar Mode Tamu' : 'Keluar Akun'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="relative" ref={searchRef}>
          <div className="relative flex items-center rounded-full bg-slate-50 border border-slate-200/90 shadow-2xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
            <input ref={mobileInputRef} type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onFocus={() => setIsSearchFocused(true)} placeholder="Cari..." className="w-full pl-9 pr-9 py-2 text-xs bg-transparent rounded-full" />
            <button type="button" onClick={handleCloseSearch} className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-700"><X className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      </div>
      <div className="hidden lg:block">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-extrabold text-slate-900 truncate">Sistem Pengawasan DPM FASILKOM</h2>
            <p className="text-xs text-slate-500 mt-0.5">Portal audit &amp; akuntabilitas</p>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="relative w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="rounded-full pl-9 pr-4 py-2 text-xs bg-slate-50" />
            </div>

            {/* Desktop Notification Bell */}
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
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/70">
                    <div className="flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-slate-700" />
                      <span className="text-xs font-bold text-slate-900">Notifikasi</span>
                      {unreadNotifCount > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
                          {unreadNotifCount} baru
                        </span>
                      )}
                    </div>
                    {unreadNotifCount > 0 && (
                      <button
                        type="button"
                        onClick={() => markAllNotificationsAsRead(currentUser?.ormawaId)}
                        className="text-[11px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>Tandai dibaca</span>
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
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
                          onClick={() => {
                            markNotificationAsRead(notif.id);
                            if (notif.linkTab) {
                              setActiveTab(notif.linkTab);
                              navigate(`/${notif.linkTab}`);
                            }
                            setIsNotificationsOpen(false);
                          }}
                          className={`p-3.5 transition cursor-pointer hover:bg-slate-50 flex items-start gap-3 ${
                            !notif.isRead ? 'bg-blue-50/40' : 'bg-white'
                          }`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {!notif.isRead ? (
                              <span className="w-2 h-2 rounded-full bg-blue-600 block mt-1" />
                            ) : (
                              <span className="w-2 h-2 rounded-full bg-slate-300 block mt-1" />
                            )}
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
              )}
            </div>

            {currentUser?.role !== 'guest' && (
              <>
                <button onClick={onOpenIssueSP} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 cursor-pointer">
                  <AlertOctagon className="w-3.5 h-3.5" />
                  <span>Cetak SP</span>
                </button>
                <Button onClick={onOpenAddProker} size="sm" className="rounded-xl flex items-center gap-1.5 cursor-pointer">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Proker</span>
                </Button>
              </>
            )}
            
            <div className="relative ml-1" ref={profileRef}>
              <button onClick={() => setIsProfileOpen(prev => !prev)} className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-xs cursor-pointer">
                {currentUser?.name?.substring(0, 2).toUpperCase() || 'US'}
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 p-2 space-y-1">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="text-xs font-bold text-slate-900 truncate">{currentUser?.name}</p>
                    <p className="text-[10px] text-slate-500 capitalize">
                      {currentUser?.role === 'guest' ? 'Akses Transparansi Publik' : `${currentUser?.role} ${currentUser?.ormawaId}`}
                    </p>
                  </div>
                  {currentUser?.role !== 'guest' && (
                    <button 
                      onClick={() => { setIsProfileModalOpen(true); setIsProfileOpen(false); }} 
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                    >
                      <User className="w-4 h-4 text-blue-600" />
                      <span>Profil Saya &amp; Password</span>
                    </button>
                  )}
                  {isDPMAdmin && pendingAccounts.length > 0 && (
                    <button onClick={() => { setIsApprovalModalOpen(true); setIsProfileOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-amber-700 hover:bg-amber-50 rounded-xl transition cursor-pointer">
                      <Users className="w-4 h-4" />
                      <span>Validasi Akun ({pendingAccounts.length})</span>
                    </button>
                  )}
                  {isDPMAdmin && pendingDeletionCount > 0 && (
                    <button onClick={() => { setIsManageDeletionOpen(true); setIsProfileOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50 rounded-xl transition cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                      <span>Permohonan Hapus ({pendingDeletionCount})</span>
                    </button>
                  )}
                  <button onClick={() => { if (window.confirm(currentUser?.role === 'guest' ? 'Keluar dari mode tamu publik?' : 'Yakin ingin keluar?')) logout(); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer">
                    <LogOut className="w-4 h-4" />
                    <span>{currentUser?.role === 'guest' ? 'Keluar Mode Tamu' : 'Keluar Akun'}</span>
                  </button>
                </div>
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

      {/* Modal Profil Pengurus */}
      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      />

      {/* Modal Manajemen Permohonan Hapus Proker */}
      <ManageDeletionRequestsModal 
        isOpen={isManageDeletionOpen} 
        onClose={() => setIsManageDeletionOpen(false)} 
      />
    </header>
  );
}
