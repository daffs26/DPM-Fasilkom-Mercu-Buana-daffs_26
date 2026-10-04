import React, { useState, lazy, Suspense, useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { AlertCircle } from 'lucide-react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardView from './components/dashboard/DashboardView';
import LoginView from './components/auth/LoginView';
import RegisterView from './components/auth/RegisterView';
import { Analytics } from '@vercel/analytics/react';
import { notificationService } from './services/notificationService';

// Consolidated primary domain containers loaded on-demand
const ProkerContainerView = lazy(() => import('./components/proker/ProkerContainerView'));
const TransparansiContainerView = lazy(() => import('./components/berkas/TransparansiContainerView'));
const PengawasanContainerView = lazy(() => import('./components/audit/PengawasanContainerView'));
const StrukturView = lazy(() => import('./components/struktur/StrukturView'));

// Modals loaded on-demand (Disederhanakan & Lokasi Per Fitur)
const AddProkerModal = lazy(() => import('./components/proker/TambahProkerModal'));
const ReviewProposalModal = lazy(() => import('./components/proker/ReviewProposalModal'));
const DetailProkerModal = lazy(() => import('./components/proker/DetailProkerModal'));
const AuditLPJModal = lazy(() => import('./components/audit/AuditLpjModal'));
const IssueSPModal = lazy(() => import('./components/sp/SuratPeringatanModals'));
const PrintDocModal = lazy(() => import('./components/print/PrintDocModal'));
const SetPaguModal = lazy(() => import('./components/anggaran/AturPaguModal'));
const AddTransactionModal = lazy(() => import('./components/anggaran/TambahTransaksiModal'));

import {
  DashboardSkeleton,
  ProkerSkeleton,
  AnggaranSkeleton,
  AuditSkeleton,
  KalenderSkeleton,
  BerkasSkeleton,
  TemplateSkeleton,
  SuratPeringatanSkeleton,
  HistorySkeleton,
  GenericPageSkeleton
} from './components/ui/skeleton';

function ViewLoadingFallback({ tab }) {
  switch (tab) {
    case 'dashboard':
      return <DashboardSkeleton />;
    case 'proker':
      return <ProkerSkeleton />;
    case 'transparansi':
      return <BerkasSkeleton />;
    case 'anggaran':
      return <AnggaranSkeleton />;
    case 'audit':
      return <AuditSkeleton />;
    case 'kalender':
      return <KalenderSkeleton />;
    case 'berkas':
      return <BerkasSkeleton />;
    case 'template':
      return <TemplateSkeleton />;
    case 'sp':
      return <SuratPeringatanSkeleton />;
    case 'history':
      return <HistorySkeleton />;
    case 'struktur':
      return <GenericPageSkeleton />;
    default:
      return <GenericPageSkeleton />;
  }
}

class RouteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('Route error caught:', error, errorInfo);
    // Jika kegagalan disebabkan oleh versi build baru (chunk hash usang), otomatis refresh sekali
    const isChunkError = 
      error?.name === 'ChunkLoadError' ||
      error?.message?.includes('Failed to fetch dynamically imported module') ||
      error?.message?.includes('Importing a module script failed') ||
      error?.message?.includes('Loading chunk');

    if (isChunkError && typeof window !== 'undefined') {
      const lastReload = window.sessionStorage.getItem('auditmawa_chunk_reload');
      const now = Date.now();
      if (!lastReload || now - parseInt(lastReload, 10) > 15000) {
        window.sessionStorage.setItem('auditmawa_chunk_reload', String(now));
        window.location.reload();
      }
    }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200/80 shadow-soft max-w-lg mx-auto my-8">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-base">Terjadi Kendala Memuat Halaman</h3>
          <p className="text-xs text-slate-500 mt-1.5 mb-5 leading-relaxed">
            Halaman mungkin telah diperbarui ke versi terbaru atau terdapat kendala modul. Silakan muat ulang halaman untuk memperbarui aset aplikasi.
          </p>
          <div className="flex items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
            >
              Muat Ulang Halaman
            </button>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/dashboard';
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Kembali ke Dashboard
            </button>
          </div>
          {import.meta.env.DEV && this.state.error && (
            <p className="mt-4 text-[10px] font-mono text-rose-500 bg-rose-50 p-2 rounded-lg text-left overflow-x-auto">
              {this.state.error.toString()}
            </p>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const { activeTab, currentUser, logout } = useStore(useShallow(state => ({ 
    activeTab: state.activeTab, 
    currentUser: state.currentUser,
    logout: state.logout 
  })));
  const isGuest = currentUser?.role === 'guest';
  const isDpm = currentUser?.ormawaId === 'dpm' && !isGuest;
  const [idleNotice, setIdleNotice] = useState('');
  const lastActivityRef = useRef(Date.now());

  // Sinkronkan URL path saat ini ke activeTab di Zustand store agar backward-compatible
  const rawPathTab = location.pathname.replace(/^\//, '') || 'dashboard';
  const getActiveTabFromPath = (path) => {
    if (['proker', 'history', 'kalender'].includes(path)) return 'proker';
    if (['transparansi', 'berkas', 'anggaran', 'template'].includes(path)) return 'transparansi';
    if (['audit', 'sp'].includes(path)) return 'audit';
    return path || 'dashboard';
  };
  const currentPathTab = getActiveTabFromPath(rawPathTab);

  useEffect(() => {
    const validTabs = ['dashboard', 'proker', 'transparansi', 'audit', 'struktur'];
    if (validTabs.includes(currentPathTab) && currentPathTab !== activeTab) {
      useStore.getState().setActiveTab(currentPathTab);
    }
  }, [currentPathTab, activeTab]);

  // 15-Minute Inactivity Auto-Logout (15 * 60 * 1000 ms)
  useEffect(() => {
    if (!currentUser) return;

    // Reset activity timer on any user action
    const resetTimer = () => {
      lastActivityRef.current = Date.now();
    };

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(ev => window.addEventListener(ev, resetTimer, { passive: true }));

    const IDLE_TIMEOUT_MS = 15 * 60 * 1000; // 15 menit
    const intervalId = setInterval(() => {
      if (Date.now() - lastActivityRef.current >= IDLE_TIMEOUT_MS) {
        logout();
        setIdleNotice('Sesi Anda telah berakhir otomatis karena tidak ada aktivitas selama 15 menit demi keamanan akun.');
        navigate('/login');
      }
    }, 5000);

    return () => {
      events.forEach(ev => window.removeEventListener(ev, resetTimer));
      clearInterval(intervalId);
    };
  }, [currentUser, logout, navigate]);

  // Realtime Supabase Notification Subscription (Hybrid Realtime Sesuai PRD)
  useEffect(() => {
    if (!currentUser || isGuest) return;

    const unsubscribe = notificationService.subscribeNotifications(
      currentUser.ormawaId,
      currentUser.id,
      (newNotif) => {
        useStore.getState().addNotification({
          id: newNotif.id,
          title: newNotif.title,
          message: newNotif.message,
          time: 'Baru saja',
          type: newNotif.type || 'system',
          targetOrmawaId: newNotif.recipient_ormawa_id,
          isRead: false,
          linkTab: newNotif.link_tab || 'dashboard'
        });
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [currentUser, isGuest]);

  // Modal States
  const [isAddProkerOpen, setIsAddProkerOpen] = useState(false);
  const [initialProkerDate, setInitialProkerDate] = useState('');
  const [calendarSelectedDate, setCalendarSelectedDate] = useState('');
  const [selectedProkerForReview, setSelectedProkerForReview] = useState(null);
  const [selectedProkerForDetail, setSelectedProkerForDetail] = useState(null);
  const [selectedProkerForAudit, setSelectedProkerForAudit] = useState(null);
  const [isIssueSPOpen, setIsIssueSPOpen] = useState(false);
  const [printDocData, setPrintDocData] = useState(null);
  const [isSetPaguOpen, setIsSetPaguOpen] = useState(false);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [addTransactionConfig, setAddTransactionConfig] = useState({ mode: 'pengeluaran', ormawaId: '' });

  // Mobile sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  const handleOpenAddTransaction = (mode = 'pengeluaran', ormawaId = '') => {
    if (isGuest) return;
    setAddTransactionConfig({ mode, ormawaId });
    setIsAddTransactionOpen(true);
  };

  const handleOpenAddProker = (date = '') => {
    if (isGuest) return;
    setInitialProkerDate(typeof date === 'string' ? date : '');
    setIsAddProkerOpen(true);
  };

  // Auth Routing: Jika belum login, hanya rute login/register yang dapat diakses
  if (!currentUser) {
    return (
      <>
        <Routes>
          <Route 
            path="/register" 
            element={<RegisterView onSwitchToLogin={() => navigate('/login')} />} 
          />
          <Route 
            path="/login" 
            element={
              <LoginView 
                onSwitchToRegister={() => navigate('/register')} 
                notice={idleNotice}
                onClearNotice={() => setIdleNotice('')}
              />
            } 
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <Analytics />
      </>
    );
  }

  // Authenticated Routing: Dashboard and Sub-pages
  return (
    <>
    <div className="flex h-screen h-[100dvh] overflow-hidden bg-[#F8FAFC] text-slate-900 font-sans selection:bg-slate-900 selection:text-amber-400">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm overlay-backdrop lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 h-screen h-[100dvh] overflow-y-auto">
        <Header 
          onOpenAddProker={() => {
            if (currentPathTab === 'kalender' && calendarSelectedDate) {
              handleOpenAddProker(calendarSelectedDate);
            } else {
              handleOpenAddProker('');
            }
          }}
          onOpenIssueSP={() => setIsIssueSPOpen(true)}
          onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
        />

        <main className="flex-1 p-3.5 sm:p-5 lg:p-7 xl:p-8 max-w-[1440px] w-full mx-auto overflow-x-hidden">
          <Suspense fallback={<ViewLoadingFallback tab={currentPathTab} />}>
            <RouteErrorBoundary>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/login" element={<Navigate to="/dashboard" replace />} />
                <Route path="/register" element={<Navigate to="/dashboard" replace />} />
                
                <Route path="/dashboard" element={
                  <DashboardView 
                    onOpenAddProker={() => handleOpenAddProker('')}
                    onReviewProposal={(proker) => setSelectedProkerForReview(proker)}
                    onAuditLPJ={(proker) => setSelectedProkerForAudit(proker)}
                  />
                } />

                <Route path="/proker" element={
                  <ProkerContainerView 
                    onOpenAddProker={handleOpenAddProker}
                    onReviewProposal={(proker) => setSelectedProkerForReview(proker)}
                    onOpenDetailProker={(proker) => setSelectedProkerForDetail(proker)}
                    onAuditLPJ={(proker) => setSelectedProkerForAudit(proker)}
                    onPrintDoc={(docData) => setPrintDocData(docData)}
                    calendarSelectedDate={calendarSelectedDate}
                    onDateChange={setCalendarSelectedDate}
                  />
                } />

                {/* Backward compatibility redirects for Proker */}
                <Route path="/history" element={<Navigate to="/proker?tab=histori" replace />} />
                <Route path="/kalender" element={<Navigate to="/proker?tab=kalender" replace />} />

                <Route path="/transparansi" element={
                  <TransparansiContainerView 
                    onReviewProposal={(proker) => setSelectedProkerForReview(proker)}
                    onAuditLPJ={(proker) => setSelectedProkerForAudit(proker)}
                    onOpenSetPagu={() => setIsSetPaguOpen(true)}
                    onOpenAddTransaction={handleOpenAddTransaction}
                    onPrintDoc={(docData) => setPrintDocData(docData)}
                  />
                } />

                {/* Backward compatibility redirects for Transparansi */}
                <Route path="/berkas" element={<Navigate to="/transparansi?tab=berkas" replace />} />
                <Route path="/anggaran" element={<Navigate to="/transparansi?tab=anggaran" replace />} />
                <Route path="/template" element={<Navigate to="/transparansi?tab=template" replace />} />

                <Route path="/audit" element={
                  <PengawasanContainerView 
                    onAuditLPJ={(proker) => setSelectedProkerForAudit(proker)}
                    onOpenIssueSP={() => setIsIssueSPOpen(true)}
                    onPrintDoc={(docData) => setPrintDocData(docData)}
                  />
                } />

                {/* Backward compatibility redirects for Pengawasan */}
                <Route path="/sp" element={<Navigate to="/audit?tab=sp" replace />} />

                {/* Struktur Organisasi DPM (Khusus Role DPM) */}
                <Route path="/struktur" element={isDpm ? <StrukturView /> : <Navigate to="/dashboard" replace />} />

                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </RouteErrorBoundary>
          </Suspense>
        </main>
      </div>

      <Suspense fallback={null}>
        {isAddProkerOpen && !isGuest && (
          <AddProkerModal 
            isOpen={isAddProkerOpen} 
            onClose={() => {
              setIsAddProkerOpen(false);
              setInitialProkerDate('');
            }}
            initialDate={initialProkerDate}
          />
        )}

        {!!selectedProkerForReview && (
          <ReviewProposalModal 
            isOpen={!!selectedProkerForReview} 
            onClose={() => setSelectedProkerForReview(null)}
            proker={selectedProkerForReview}
          />
        )}

        {!!selectedProkerForAudit && (
          <AuditLPJModal 
            isOpen={!!selectedProkerForAudit} 
            onClose={() => setSelectedProkerForAudit(null)}
            proker={selectedProkerForAudit}
          />
        )}

        {isIssueSPOpen && !isGuest && (
          <IssueSPModal 
            isOpen={isIssueSPOpen} 
            onClose={() => setIsIssueSPOpen(false)}
          />
        )}

        {!!printDocData && (
          <PrintDocModal 
            isOpen={!!printDocData} 
            onClose={() => setPrintDocData(null)}
            documentData={printDocData}
          />
        )}

        {isSetPaguOpen && !isGuest && (
          <SetPaguModal 
            isOpen={isSetPaguOpen}
            onClose={() => setIsSetPaguOpen(false)}
          />
        )}

        {isAddTransactionOpen && !isGuest && (
          <AddTransactionModal 
            isOpen={isAddTransactionOpen}
            initialMode={addTransactionConfig.mode}
            initialOrmawa={addTransactionConfig.ormawaId}
            onClose={() => setIsAddTransactionOpen(false)}
          />
        )}

        {!!selectedProkerForDetail && (
          <DetailProkerModal 
            isOpen={!!selectedProkerForDetail}
            onClose={() => setSelectedProkerForDetail(null)}
            proker={selectedProkerForDetail}
            onAuditLPJ={(proker) => {
              setSelectedProkerForDetail(null);
              setSelectedProkerForAudit(proker);
            }}
            onReviewProposal={(proker) => {
              setSelectedProkerForDetail(null);
              setSelectedProkerForReview(proker);
            }}
            onPrintRundown={(docData) => {
              setPrintDocData(docData);
            }}
          />
        )}
      </Suspense>

    </div>
    <Analytics />
    </>
  );
}
