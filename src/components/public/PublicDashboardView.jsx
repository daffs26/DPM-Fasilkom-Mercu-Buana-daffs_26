import React, { useState } from 'react';
import DashboardView from '../dashboard/DashboardView';
import ReviewProposalModal from '../proker/ReviewProposalModal';
import AuditLPJModal from '../audit/AuditLpjModal';

export default function PublicDashboardView() {
  const [selectedProkerForReview, setSelectedProkerForReview] = useState(null);
  const [selectedProkerForAudit, setSelectedProkerForAudit] = useState(null);

  return (
    <div className="space-y-6">
      {/* Main Dashboard View Component */}
      <DashboardView 
        onOpenAddProker={() => {}}
        onReviewProposal={(proker) => setSelectedProkerForReview(proker)}
        onAuditLPJ={(proker) => setSelectedProkerForAudit(proker)}
      />

      {/* Read-Only Proposal & LPJ Modals */}
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
    </div>
  );
}
