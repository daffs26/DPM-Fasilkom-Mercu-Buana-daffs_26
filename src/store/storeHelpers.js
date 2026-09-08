/**
 * Helper functions and factory generators for Zustand useStore
 * SIWASMA DPM FASILKOM UMB
 */

export function createLogEntry({
  ormawaId,
  type,
  title,
  description,
  actor,
  prokerTitle = null,
  prokerId = null,
  formattedDate = null
}) {
  const now = new Date();
  const dateString = formattedDate || now.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const timeString = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  return {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    timestamp: `${dateString} ${timeString} WIB`,
    ormawaId: ormawaId || 'dpm',
    type,
    title,
    description,
    actor,
    prokerTitle,
    prokerId
  };
}

export function calculateLpjDeadline(startDate, endDate = null, daysOffset = 14) {
  const targetDate = new Date(endDate || startDate || new Date());
  targetDate.setDate(targetDate.getDate() + daysOffset);
  return targetDate.toISOString().split('T')[0];
}

export function checkIsDadakan(eventStartDate, uploadDateStr = null, thresholdDays = 14) {
  const todayStr = uploadDateStr || new Date().toISOString().split('T')[0];
  const startDateObj = new Date(eventStartDate);
  const uploadDateObj = new Date(todayStr);
  const diffTime = startDateObj.getTime() - uploadDateObj.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return {
    diffDays,
    isDadakan: diffDays < thresholdDays
  };
}

export function createDefaultProposal(fileInfo = null, isDadakan = false, uploadDate = null) {
  if (!fileInfo || !fileInfo.name) {
    return {
      fileName: null,
      fileSize: null,
      uploadDate: null,
      isDadakan: false,
      reviewStatus: 'not_uploaded',
      approvedDate: null,
      approvedBy: null,
      notes: [],
      revisionItems: []
    };
  }

  return {
    fileName: fileInfo.name,
    fileSize: fileInfo.size || '2.5 MB',
    uploadDate: uploadDate || new Date().toISOString().split('T')[0],
    isDadakan,
    reviewStatus: 'pending',
    approvedDate: null,
    approvedBy: null,
    notes: [],
    revisionItems: []
  };
}

export function createDefaultLpj(deadlineDate) {
  return {
    fileName: null,
    fileSize: null,
    uploadDate: null,
    deadlineDate,
    reviewStatus: 'not_uploaded',
    notes: [],
    auditScore: null,
    auditDetails: null
  };
}
