import React from 'react';
import { useStore } from '../../store/useStore';
import AuditParameterStandards from './components/AuditParameterStandards';
import AuditOrmawaReport from './components/AuditOrmawaReport';
import AuditProkerTable from './components/AuditProkerTable';

export default function AuditView({ onAuditLPJ, onPrintDoc }) {
  const { ormawas, prokers } = useStore();

  return (
    <div className="space-y-6">
      {/* 1. Header & Penjelasan Parameter Resmi DPM */}
      <AuditParameterStandards />

      {/* 2. RAPOR KINERJA & AKREDITASI INTERNAL ORMAWA */}
      <AuditOrmawaReport ormawas={ormawas} prokers={prokers} />

      {/* 3. DAFTAR HASIL AUDIT PROKER RIIL */}
      <AuditProkerTable 
        prokers={prokers} 
        ormawas={ormawas} 
        onAuditLPJ={onAuditLPJ} 
        onPrintDoc={onPrintDoc} 
      />
    </div>
  );
}
