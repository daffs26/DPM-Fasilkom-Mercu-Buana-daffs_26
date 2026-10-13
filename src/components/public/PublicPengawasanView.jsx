import React, { useState } from 'react';
import AuditView from '../audit/AuditView';
import AuditLPJModal from '../audit/AuditLpjModal';

export default function PublicPengawasanView() {
  const [selectedProkerForAudit, setSelectedProkerForAudit] = useState(null);

  return (
    <div className="space-y-6">
      {/* Main Audit View Component */}
      <AuditView 
        onAuditLPJ={(proker) => setSelectedProkerForAudit(proker)}
        onPrintDoc={() => {}}
      />

      {/* Read-Only Audit Modal Viewer */}
      {!!selectedProkerForAudit && (
        <AuditLPJModal 
          isOpen={!!selectedProkerForAudit} 
          onClose={() => setSelectedProkerForAudit(null)}
          proker={selectedProkerForAudit}
        />
      )}
    </div>
  );
}
