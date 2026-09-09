import React, { useState, lazy, Suspense } from 'react';
import { useStore } from './store/useStore';
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

function ViewLoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[300px] w-full">
      <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  const { activeTab, currentUser } = useStore();
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

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
    setAddTransactionConfig({ mode, ormawaId });
    setIsAddTransactionOpen(true);
  };

  const handleOpenAddProker = (date = '') => {
    setInitialProkerDate(typeof date === 'string' ? date : '');
    setIsAddProkerOpen(true);
  };

  if (!currentUser) {
    if (authMode === 'register') {
      return <RegisterView onSwitchToLogin={() => setAuthMode('login')} />;
    }
    return <LoginView onSwitchToRegister={() => setAuthMode('register')} />;
  }

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
            if (activeTab === 'kalender' && calendarSelectedDate) {
              handleOpenAddProker(calendarSelectedDate);
            } else {
              handleOpenAddProker('');
            }
          }}
          onOpenIssueSP={() => setIsIssueSPOpen(true)}
          onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
        />

        <main className="flex-1 p-3.5 sm:p-5 lg:p-7 xl:p-8 max-w-[1440px] w-full mx-auto overflow-x-hidden">
          <Suspense fallback={<ViewLoadingFallback />}>
            {activeTab === 'dashboard' && (
              <DashboardView 
                onOpenAddProker={() => handleOpenAddProker('')}
                onReviewProposal={(proker) => setSelectedProkerForReview(proker)}
                onAuditLPJ={(proker) => setSelectedProkerForAudit(proker)}
              />
            )}

            {activeTab === 'proker' && (
              <ProkerView 
                onOpenAddProker={() => handleOpenAddProker('')}
                onReviewProposal={(proker) => setSelectedProkerForReview(proker)}
                onOpenDetailProker={(proker) => setSelectedProkerForDetail(proker)}
                onAuditLPJ={(proker) => setSelectedProkerForAudit(proker)}
                onPrintDoc={(docData) => setPrintDocData(docData)}
              />
            )}

            {activeTab === 'history' && (
              <HistoryView 
                onOpenAddProker={() => handleOpenAddProker('')}
              />
            )}

            {activeTab === 'anggaran' && (
              <AnggaranView 
                onOpenSetPagu={() => setIsSetPaguOpen(true)}
                onOpenAddTransaction={handleOpenAddTransaction}
                onPrintDoc={(docData) => setPrintDocData(docData)}
              />
            )}

            {activeTab === 'berkas' && (
              <BerkasView 
                onReviewProposal={(proker) => setSelectedProkerForReview(proker)}
                onAuditLPJ={(proker) => setSelectedProkerForAudit(proker)}
              />
            )}

            {activeTab === 'template' && (
              <TemplateView />
            )}

            {activeTab === 'audit' && (
              <AuditView 
                onAuditLPJ={(proker) => setSelectedProkerForAudit(proker)}
                onPrintDoc={(docData) => setPrintDocData(docData)}
              />
            )}

            {activeTab === 'kalender' && (
              <KalenderView 
                onOpenAddProker={(date) => handleOpenAddProker(date || calendarSelectedDate)}
                onReviewProposal={(proker) => setSelectedProkerForReview(proker)}
                onDateChange={setCalendarSelectedDate}
              />
            )}

            {activeTab === 'sp' && (
              <SuratPeringatanView 
                onOpenIssueSP={() => setIsIssueSPOpen(true)}
                onPrintDoc={(docData) => setPrintDocData(docData)}
              />
            )}
          </Suspense>
        </main>
      </div>

      <Suspense fallback={null}>
        {isAddProkerOpen && (
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

        {isIssueSPOpen && (
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

        {isSetPaguOpen && (
          <SetPaguModal 
            isOpen={isSetPaguOpen}
            onClose={() => setIsSetPaguOpen(false)}
          />
        )}

        {isAddTransactionOpen && (
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
  );
}
