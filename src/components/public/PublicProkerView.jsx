import React, { useState } from 'react';
import ProkerView from '../proker/ProkerView';
import DetailProkerModal from '../proker/DetailProkerModal';
import ReviewProposalModal from '../proker/ReviewProposalModal';
import AuditLPJModal from '../audit/AuditLpjModal';

export default function PublicProkerView() {
  const [selectedProkerForDetail, setSelectedProkerForDetail] = useState(null);
  const [selectedProkerForReview, setSelectedProkerForReview] = useState(null);
  const [selectedProkerForAudit, setSelectedProkerForAudit] = useState(null);

  return (
    <div className="space-y-6">
      {/* Main Proker View Component */}
      <ProkerView 
        onOpenAddProker={() => {}}
        onReviewProposal={(proker) => setSelectedProkerForReview(proker)}
        onOpenDetailProker={(proker) => setSelectedProkerForDetail(proker)}
        onAuditLPJ={(proker) => setSelectedProkerForAudit(proker)}
        onPrintDoc={() => {}}
      />

      {/* Detail Proker Modal (Read-Only) */}
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
          onPrintRundown={() => {}}
        />
      )}

      {/* Review Proposal Modal (Read-Only) */}
      {!!selectedProkerForReview && (
        <ReviewProposalModal 
          isOpen={!!selectedProkerForReview} 
          onClose={() => setSelectedProkerForReview(null)}
          proker={selectedProkerForReview}
        />
      )}

      {/* Audit LPJ Modal (Read-Only) */}
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
