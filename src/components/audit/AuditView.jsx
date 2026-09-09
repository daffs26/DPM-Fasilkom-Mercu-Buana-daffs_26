import React from 'react';
import { useStore } from '../../store/useStore';
import { useShallow } from 'zustand/react/shallow';
import AuditParameterStandards from './components/AuditParameterStandards';
import AuditOrmawaReport from './components/AuditOrmawaReport';
import AuditProkerTable from './components/AuditProkerTable';

export default function AuditView({ onAuditLPJ, onPrintDoc }) {
  const { ormawas, prokers, currentUser } = useStore(useShallow(state => ({ ormawas: state.ormawas, prokers: state.prokers, currentUser: state.currentUser })));
  const isDpm = currentUser?.ormawaId === 'dpm';

  const displayedProkers = isDpm 
    ? prokers 
    : prokers.filter(p => p.ormawaId === currentUser?.ormawaId);

  const displayedOrmawas = isDpm 
    ? ormawas 
    : ormawas.filter(o => o.id === currentUser?.ormawaId);

  return (
    <div className="space-y-6">
      {/* 1. Header & Penjelasan Parameter Resmi DPM */}
      <AuditParameterStandards />

      {/* 2. RAPOR KINERJA & AKREDITASI INTERNAL ORMAWA */}
      <AuditOrmawaReport ormawas={ormawas} prokers={prokers} currentUser={currentUser} />

      {/* 3. DAFTAR HASIL AUDIT PROKER RIIL */}
      <AuditProkerTable 
        prokers={displayedProkers} 
        ormawas={displayedOrmawas} 
        onAuditLPJ={onAuditLPJ} 
        onPrintDoc={onPrintDoc} 
      />
    </div>
  );
}
