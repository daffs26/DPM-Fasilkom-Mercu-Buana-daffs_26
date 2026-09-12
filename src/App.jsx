import React, { useState, lazy, Suspense, useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import { useShallow } from 'zustand/react/shallow';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardView from './components/dashboard/DashboardView';
import ProkerView from './components/proker/ProkerView';
import LoginView from './components/auth/LoginView';
import RegisterView from './components/auth/RegisterView';

// Secondary views loaded on-demand
const HistoryView = lazy(() => import('./components/history/HistoryView'));
const BerkasView = lazy(() => import('./components/berkas/BerkasView'));
const AuditView = lazy(() => import('./components/audit/AuditView'));
const KalenderView = lazy(() => import('./components/kalender/KalenderView'));
const SuratPeringatanView = lazy(() => import('./components/sp/SuratPeringatanView'));
const TemplateView = lazy(() => import('./components/template/TemplateView'));
const AnggaranView = lazy(() => import('./components/anggaran/AnggaranView'));

// Modals loaded on-demand
const AddProkerModal = lazy(() => import('./components/proker/components/AddProkerModal'));
const ReviewProposalModal = lazy(() => import('./components/proker/components/ReviewProposalModal'));
const DetailProkerModal = lazy(() => import('./components/proker/components/DetailProkerModal'));
const AuditLPJModal = lazy(() => import('./components/audit/components/AuditLPJModal'));
const IssueSPModal = lazy(() => import('./components/sp/components/IssueSPModal'));
const PrintDocModal = lazy(() => import('./components/print/PrintDocModal'));
const SetPaguModal = lazy(() => import('./components/anggaran/components/SetPaguModal'));
const AddTransactionModal = lazy(() => import('./components/anggaran/components/AddTransactionModal'));

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
} from './components/ui/view-skeletons';

function ViewLoadingFallback({ tab }) {
  switch (tab) {
    case 'dashboard':
      return <DashboardSkeleton />;
    case 'proker':
      return <ProkerSkeleton />;
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
    default:
      return <GenericPageSkeleton />;
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
  const [idleNotice, setIdleNotice] = useState('');
  const lastActivityRef = useRef(Date.now());

  // Sinkronkan URL path saat ini ke activeTab di Zustand store agar backward-compatible
  const currentPathTab = location.pathname.replace(/^\//, '') || 'dashboard';
  useEffect(() => {
    const validTabs = ['dashboard', 'proker', 'history', 'anggaran', 'berkas', 'template', 'audit', 'kalender', 'sp'];
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

  // Dev & Preview Skeleton Toggle (allows instant live inspection of skeletons on local)
  const [isPreviewSkeleton, setIsPreviewSkeleton] = useState(false);

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
    );
  }

  // Authenticated Routing: Dashboard and Sub-pages
  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC] text-slate-900 font-sans selection:bg-slate-900 selection:text-amber-400">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm overlay-backdrop lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
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
          {isPreviewSkeleton ? (
            <ViewLoadingFallback tab={currentPathTab} />
          ) : (
            <Suspense fallback={<ViewLoadingFallback tab={currentPathTab} />}>
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
                  <ProkerView 
                    onOpenAddProker={() => handleOpenAddProker('')}
                    onReviewProposal={(proker) => setSelectedProkerForReview(proker)}
                    onOpenDetailProker={(proker) => setSelectedProkerForDetail(proker)}
                    onAuditLPJ={(proker) => setSelectedProkerForAudit(proker)}
                    onPrintDoc={(docData) => setPrintDocData(docData)}
                  />
                } />

                <Route path="/history" element={
                  <HistoryView 
                    onOpenAddProker={() => handleOpenAddProker('')}
                  />
                } />

                <Route path="/anggaran" element={
                  <AnggaranView 
                    onOpenSetPagu={() => setIsSetPaguOpen(true)}
                    onOpenAddTransaction={handleOpenAddTransaction}
                    onPrintDoc={(docData) => setPrintDocData(docData)}
                  />
                } />

                <Route path="/berkas" element={
                  <BerkasView 
                    onReviewProposal={(proker) => setSelectedProkerForReview(proker)}
                    onAuditLPJ={(proker) => setSelectedProkerForAudit(proker)}
                  />
                } />

                <Route path="/template" element={
                  isGuest ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <TemplateView />
                  )
                } />

                <Route path="/audit" element={
                  <AuditView 
                    onAuditLPJ={(proker) => setSelectedProkerForAudit(proker)}
                    onPrintDoc={(docData) => setPrintDocData(docData)}
                  />
                } />

                <Route path="/kalender" element={
                  <KalenderView 
                    onOpenAddProker={(date) => handleOpenAddProker(date || calendarSelectedDate)}
                    onReviewProposal={(proker) => setSelectedProkerForReview(proker)}
                    onDateChange={setCalendarSelectedDate}
                  />
                } />

                <Route path="/sp" element={
                  isGuest ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <SuratPeringatanView 
                      onOpenIssueSP={() => setIsIssueSPOpen(true)}
                      onPrintDoc={(docData) => setPrintDocData(docData)}
                    />
                  )
                } />

                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Suspense>
          )}
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

      {/* Floating Interactive Dev Controller: Skeleton Preview Mode (Hanya aktif di lokal/dev, otomatis hilang saat deploy produksi) */}
      {import.meta.env.DEV && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2.5 bg-slate-900/90 backdrop-blur-md text-white pl-3.5 pr-2 py-1.5 rounded-2xl shadow-2xl border border-slate-700/80 text-xs font-semibold select-none transition-all hover:border-slate-500">
          <span className="flex h-2.5 w-2.5 relative">
            {isPreviewSkeleton && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            )}
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isPreviewSkeleton ? 'bg-amber-400' : 'bg-slate-400'}`} />
          </span>
          <span className="text-slate-300">Mode Skeleton:</span>
          <button
            type="button"
            onClick={() => setIsPreviewSkeleton(prev => !prev)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
              isPreviewSkeleton 
                ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 ring-2 ring-amber-400/40' 
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            {isPreviewSkeleton ? 'AKTIF (Tampil)' : 'NONAKTIF'}
          </button>
        </div>
      )}
    </div>
  );
}
