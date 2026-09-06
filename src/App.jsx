import React, { useState } from 'react';
import { useStore } from './store/useStore';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardView from './components/dashboard/DashboardView';
import ProkerView from './components/proker/ProkerView';
import HistoryView from './components/history/HistoryView';
import BerkasView from './components/berkas/BerkasView';
import AuditView from './components/audit/AuditView';
import KalenderView from './components/kalender/KalenderView';
import SuratPeringatanView from './components/sp/SuratPeringatanView';
import TemplateView from './components/template/TemplateView';
import AnggaranView from './components/anggaran/AnggaranView';

// Modals
import AddProkerModal from './components/modals/AddProkerModal';
import ReviewProposalModal from './components/modals/ReviewProposalModal';
import AuditLPJModal from './components/modals/AuditLPJModal';
import IssueSPModal from './components/modals/IssueSPModal';
import PrintDocModal from './components/modals/PrintDocModal';
import SetPaguModal from './components/modals/SetPaguModal';
import AddTransactionModal from './components/modals/AddTransactionModal';
import DetailProkerModal from './components/modals/DetailProkerModal';

export default function App() {
  const { activeTab } = useStore();

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

  // Mobile sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleOpenAddProker = (date = '') => {
    setInitialProkerDate(typeof date === 'string' ? date : '');
    setIsAddProkerOpen(true);
  };

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
              onOpenAddTransaction={() => setIsAddTransactionOpen(true)}
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
        </main>
      </div>

      <AddProkerModal 
        isOpen={isAddProkerOpen} 
        onClose={() => {
          setIsAddProkerOpen(false);
          setInitialProkerDate('');
        }}
        initialDate={initialProkerDate}
      />

      <ReviewProposalModal 
        isOpen={!!selectedProkerForReview} 
        onClose={() => setSelectedProkerForReview(null)}
        proker={selectedProkerForReview}
      />

      <AuditLPJModal 
        isOpen={!!selectedProkerForAudit} 
        onClose={() => setSelectedProkerForAudit(null)}
        proker={selectedProkerForAudit}
      />

      <IssueSPModal 
        isOpen={isIssueSPOpen} 
        onClose={() => setIsIssueSPOpen(false)}
      />

      <PrintDocModal 
        isOpen={!!printDocData} 
        onClose={() => setPrintDocData(null)}
        documentData={printDocData}
      />

      <SetPaguModal 
        isOpen={isSetPaguOpen}
        onClose={() => setIsSetPaguOpen(false)}
      />

      <AddTransactionModal 
        isOpen={isAddTransactionOpen}
        onClose={() => setIsAddTransactionOpen(false)}
      />

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
    </div>
  );
}
