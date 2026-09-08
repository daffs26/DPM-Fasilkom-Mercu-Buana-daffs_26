import React from 'react';
import { useStore } from '../../store/useStore';

// Modular Dashboard Sub-Components
import DashboardKpiSummary from './components/DashboardKpiSummary';
import DashboardScorecard from './components/DashboardScorecard';
import DashboardBudgetCard from './components/DashboardBudgetCard';
import DashboardProkerTable from './components/DashboardProkerTable';
import DashboardActivityFeed from './components/DashboardActivityFeed';

export default function DashboardView({ onOpenAddProker, onReviewProposal, onAuditLPJ }) {
  const { 
    ormawas, 
    prokers, 
    selectedOrmawaFilter, 
    setSelectedOrmawaFilter,
    activityLogs, 
    suratPeringatan 
  } = useStore();

  // Filter proker berdasarkan ormawa yang aktif
  const filteredProkers = selectedOrmawaFilter === 'all'
    ? prokers
    : prokers.filter(p => p.ormawaId === selectedOrmawaFilter);

  // Metrik Kalkulasi
  const totalProkers = filteredProkers.length;
  const pendingProposal = filteredProkers.filter(p => p.status === 'proposal_pending').length;
  const completedProkers = filteredProkers.filter(p => p.status === 'completed').length;
  const overdueLPJ = filteredProkers.filter(p => p.status === 'lpj_overdue').length;
  const activeSPCount = suratPeringatan.filter(s => s.status === 'active').length;

  // Hitung Skor Rata-rata Kepatuhan
  const prokersWithAudit = filteredProkers.filter(p => p.lpj?.auditScore);
  const avgScore = prokersWithAudit.length > 0
    ? Math.round(prokersWithAudit.reduce((acc, p) => {
        const val = typeof p.lpj.auditScore === 'number' ? p.lpj.auditScore : parseInt(p.lpj.auditScore, 10);
        return acc + (isNaN(val) ? 0 : val);
      }, 0) / prokersWithAudit.length)
    : null;
  const predikatAudit = avgScore !== null
    ? (avgScore >= 85 ? 'Predikat A' : avgScore >= 70 ? 'Predikat B' : 'Predikat C')
    : 'Belum Dievaluasi';

  // Hitung Kepatuhan SLA Waktu
  const totalWithProposal = filteredProkers.filter(p => p.proposal?.fileName).length;
  const onTimeProposalCount = filteredProkers.filter(p => p.proposal?.fileName && !p.proposal.isDadakan).length;
  const onTimePercentage = totalWithProposal > 0 ? Math.round((onTimeProposalCount / totalWithProposal) * 100) : null;

  // Hitung Serapan Anggaran
  const activeOrmawa = selectedOrmawaFilter === 'all' ? null : ormawas.find(o => o.id === selectedOrmawaFilter);
  const totalPagu = activeOrmawa 
    ? activeOrmawa.paguAnggaran 
    : ormawas.reduce((acc, o) => acc + o.paguAnggaran, 0);
  const totalSerapan = activeOrmawa 
    ? activeOrmawa.serapanAnggaran 
    : ormawas.reduce((acc, o) => acc + o.serapanAnggaran, 0);
  const serapanPercent = totalPagu > 0 ? Math.round((totalSerapan / totalPagu) * 100) : 0;

  // Metrik Khusus Ormawa Terpilih untuk Scorecard Fokus (Opsi B)
  const activeOrmawaProkers = activeOrmawa ? prokers.filter(p => p.ormawaId === activeOrmawa.id) : [];
  const activeOrmawaAudited = activeOrmawaProkers.filter(p => p.lpj?.auditScore);
  const activeOrmawaScore = activeOrmawaAudited.length > 0 
    ? Math.round(activeOrmawaAudited.reduce((acc, p) => {
        const val = typeof p.lpj.auditScore === 'number' ? p.lpj.auditScore : parseInt(p.lpj.auditScore, 10);
        return acc + (isNaN(val) ? 0 : val);
      }, 0) / activeOrmawaAudited.length)
    : null;
  const activeOrmawaPredikat = activeOrmawaScore !== null
    ? (activeOrmawaScore >= 85 ? 'Predikat A (Sangat Baik)' : activeOrmawaScore >= 70 ? 'Predikat B (Baik)' : 'Predikat C (Cukup)')
    : 'Belum Dievaluasi';

  const activeOrmawaWithProposal = activeOrmawaProkers.filter(p => p.proposal?.fileName);
  const activeOrmawaOnTimeProposal = activeOrmawaWithProposal.filter(p => !p.proposal?.isDadakan).length;
  const activeOrmawaProposalSlaPercent = activeOrmawaWithProposal.length > 0 
    ? Math.round((activeOrmawaOnTimeProposal / activeOrmawaWithProposal.length) * 100) 
    : null;

  const activeOrmawaOverdueLPJ = activeOrmawaProkers.filter(p => p.status === 'lpj_overdue').length;
  const activeOrmawaSPs = activeOrmawa ? suratPeringatan.filter(s => s.ormawaId === activeOrmawa.id && s.status === 'active') : [];

  return (
    <div className="space-y-6">
      {/* 1. TOP HERO KPI CARDS (Mobile + Desktop) */}
      <DashboardKpiSummary
        avgScore={avgScore}
        predikatAudit={predikatAudit}
        onTimePercentage={onTimePercentage}
        pendingProposal={pendingProposal}
        filteredProkers={filteredProkers}
        completedProkers={completedProkers}
        totalProkers={totalProkers}
        overdueLPJ={overdueLPJ}
        activeSPCount={activeSPCount}
      />

      {/* 2. MIDDLE ROW: SCORECARD ORMAWA & SERAPAN ANGGARAN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardScorecard
          selectedOrmawaFilter={selectedOrmawaFilter}
          setSelectedOrmawaFilter={setSelectedOrmawaFilter}
          ormawas={ormawas}
          prokers={prokers}
          activeOrmawa={activeOrmawa}
          activeOrmawaScore={activeOrmawaScore}
          activeOrmawaPredikat={activeOrmawaPredikat}
          activeOrmawaProposalSlaPercent={activeOrmawaProposalSlaPercent}
          activeOrmawaWithProposal={activeOrmawaWithProposal}
          activeOrmawaOverdueLPJ={activeOrmawaOverdueLPJ}
          activeOrmawaSPs={activeOrmawaSPs}
          activeOrmawaProkers={activeOrmawaProkers}
        />

        <DashboardBudgetCard
          totalSerapan={totalSerapan}
          totalPagu={totalPagu}
          serapanPercent={serapanPercent}
          ormawas={ormawas}
        />
      </div>

      {/* 3. BOTTOM SECTION: TABEL PROKER TERKINI & LIVE AUDIT FEED */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardProkerTable
          filteredProkers={filteredProkers}
          ormawas={ormawas}
          onOpenAddProker={onOpenAddProker}
          onReviewProposal={onReviewProposal}
          onAuditLPJ={onAuditLPJ}
        />

        <DashboardActivityFeed
          activityLogs={activityLogs}
          ormawas={ormawas}
        />
      </div>
    </div>
  );
}
