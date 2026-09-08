import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  INITIAL_ORMAWA, 
  INITIAL_PROKER, 
  INITIAL_SP, 
  INITIAL_ACTIVITY_LOGS, 
  INITIAL_BUDGET_TRANSACTIONS 
} from '../data/initialData';
import { INITIAL_TEMPLATES } from '../data/templatesData';
import {
  createLogEntry,
  calculateLpjDeadline,
  checkIsDadakan,
  createDefaultProposal,
  createDefaultLpj
} from './storeHelpers';

export const useStore = create(
  persist(
    (set, get) => ({
      // State
      ormawas: INITIAL_ORMAWA,
      prokers: INITIAL_PROKER,
      suratPeringatan: INITIAL_SP,
      activityLogs: INITIAL_ACTIVITY_LOGS,
      templates: INITIAL_TEMPLATES,
      budgetTransactions: INITIAL_BUDGET_TRANSACTIONS,
      
      // UI State
      activeTab: 'dashboard',
      selectedOrmawaFilter: 'all',
      searchQuery: '',
      currentUserRole: 'dpm',
      currentUserName: 'Muhammad Daffa Aulia Syahrul (DPM)',

      // Setters
      setActiveTab: (tab) => set({ activeTab: tab }),
      setSelectedOrmawaFilter: (filter) => set({ selectedOrmawaFilter: filter }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setCurrentUserRole: (role) => {
        let name = 'Muhammad Daffa Aulia Syahrul (DPM)';
        if (role === 'bem') name = 'Rafi Pratama (BEM)';
        if (role === 'himti') name = 'Aldi Renaldi (HiMTI)';
        if (role === 'himsisfo') name = 'Perwakilan HIMSISFO';
        set({ currentUserRole: role, currentUserName: name });
      },

      // Helper: Format tanggal lokal
      getFormattedDate: (dateObj = new Date()) => {
        return dateObj.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      },

      // 1. TAMBAH PROKER
      addProker: (newProker) => {
        const id = `proker-${Date.now()}`;
        const todayStr = new Date().toISOString().split('T')[0];
        const { isDadakan } = checkIsDadakan(newProker.startDate, todayStr, 14);
        const lpjDeadline = calculateLpjDeadline(newProker.startDate, newProker.endDate, 14);

        const prokerItem = {
          id,
          ormawaId: newProker.ormawaId,
          title: newProker.title,
          divisi: newProker.divisi || 'Umum',
          pic: newProker.pic,
          picContact: newProker.picContact || '-',
          startDate: newProker.startDate,
          endDate: newProker.endDate || newProker.startDate,
          location: newProker.location || 'Kampus Meruya UMB',
          targetAudience: newProker.targetAudience || 'Mahasiswa Fasilkom',
          targetPeserta: Number(newProker.targetPeserta) || 100,
          realisasiPeserta: 0,
          rab: Number(newProker.rab) || 0,
          realisasiDana: 0,
          description: newProker.description || '',
          tujuan: newProker.tujuan || null,
          kepanitiaan: newProker.kepanitiaan || null,
          rundown: newProker.rundown || null,
          rabBreakdown: newProker.rabBreakdown || null,
          status: newProker.proposal?.fileName ? 'proposal_pending' : 'draft',
          proposal: createDefaultProposal(newProker.proposal, isDadakan, todayStr),
          inspection: null,
          lpj: createDefaultLpj(lpjDeadline),
          otherDocs: newProker.otherDocs || []
        };

        const ormawaName = get().ormawas.find(o => o.id === newProker.ormawaId)?.name || 'Ormawa';

        const newLog = createLogEntry({
          ormawaId: newProker.ormawaId,
          type: 'proker_added',
          title: `Program Kerja Baru Ditambahkan: ${newProker.title}`,
          description: `${ormawaName} mendaftarkan program kerja baru "${newProker.title}". Jadwal: ${newProker.startDate}. Status Proposal: ${prokerItem.proposal.fileName ? (isDadakan ? 'Diunggah di Luar Batas Waktu (< H-14)' : 'Diunggah Tepat Waktu (≥ H-14)') : 'Belum Ada Berkas Proposal'}.`,
          actor: get().currentUserName,
          prokerTitle: newProker.title,
          prokerId: id,
          formattedDate: get().getFormattedDate()
        });

        set((state) => ({
          prokers: [prokerItem, ...state.prokers],
          activityLogs: [newLog, ...state.activityLogs]
        }));

        return prokerItem;
      },

      // HAPUS PROGRAM KERJA
      deleteProker: (prokerId) => {
        set((state) => {
          const target = state.prokers.find(p => p.id === prokerId);
          const ormawaName = state.ormawas.find(o => o.id === target?.ormawaId)?.name || 'Ormawa';
          const newLog = target ? createLogEntry({
            ormawaId: target.ormawaId,
            type: 'proker_deleted',
            title: `Program Kerja Dihapus: ${target.title}`,
            description: `Program kerja "${target.title}" dari ${ormawaName} (${target.divisi}) telah dihapus dari sistem pengawasan oleh ${get().currentUserName}.`,
            actor: get().currentUserName,
            prokerTitle: target.title,
            prokerId: target.id,
            formattedDate: get().getFormattedDate()
          }) : null;

          return {
            prokers: state.prokers.filter(p => p.id !== prokerId),
            activityLogs: newLog ? [newLog, ...state.activityLogs] : state.activityLogs
          };
        });
      },

      // 2. UPLOAD PROPOSAL UNTUK PROKER TERTENTU
      uploadProposal: (prokerId, fileInfo) => {
        const todayStr = new Date().toISOString().split('T')[0];
        
        set((state) => {
          const proker = state.prokers.find(p => p.id === prokerId);
          if (!proker) return state;

          const { diffDays, isDadakan } = checkIsDadakan(proker.startDate, todayStr, 14);

          const updatedProposal = {
            fileName: fileInfo.name || 'Proposal_Kegiatan.pdf',
            fileSize: fileInfo.size || '2.4 MB',
            uploadDate: todayStr,
            isDadakan,
            reviewStatus: 'pending',
            approvedDate: null,
            approvedBy: null,
            notes: proker.proposal?.notes || [],
            revisionItems: proker.proposal?.revisionItems || []
          };

          const ormawaName = state.ormawas.find(o => o.id === proker.ormawaId)?.name || 'Ormawa';
          const newLog = createLogEntry({
            ormawaId: proker.ormawaId,
            type: 'proposal_uploaded',
            title: `Proposal Diunggah: ${proker.title}`,
            description: `${ormawaName} mengunggah berkas proposal. Selisih ke Hari-H: ${diffDays} hari (${isDadakan ? 'DITANDAI TERLAMBAT < H-14' : 'TEPAT WAKTU ≥ H-14'}).`,
            actor: get().currentUserName,
            formattedDate: get().getFormattedDate()
          });

          return {
            prokers: state.prokers.map(p => p.id === prokerId ? {
              ...p,
              status: 'proposal_pending',
              proposal: updatedProposal
            } : p),
            activityLogs: [newLog, ...state.activityLogs]
          };
        });
      },

      // 3. REVIEW PROPOSAL (ACC / REVISI DENGAN CATATAN DPM)
      reviewProposal: (prokerId, status, noteText) => {
        const todayStr = new Date().toISOString().split('T')[0];
        
        set((state) => {
          const proker = state.prokers.find(p => p.id === prokerId);
          if (!proker || !proker.proposal) return state;

          const newNote = noteText ? {
            id: Date.now(),
            author: get().currentUserName,
            text: noteText,
            date: todayStr
          } : null;

          const existingNotes = proker.proposal.notes || [];
          const updatedNotes = newNote ? [...existingNotes, newNote] : existingNotes;

          const isApproved = status === 'approved';
          const newStatus = isApproved ? 'proposal_approved' : 'proposal_revisi';

          const updatedProposal = {
            ...proker.proposal,
            reviewStatus: isApproved ? 'approved' : 'revisi',
            approvedDate: isApproved ? todayStr : null,
            approvedBy: isApproved ? get().currentUserName : null,
            notes: updatedNotes,
            revisionItems: proker.proposal.revisionItems || []
          };

          const newLog = createLogEntry({
            ormawaId: proker.ormawaId,
            type: isApproved ? 'proposal_approved' : 'proposal_revisi',
            title: isApproved ? `Proposal Disetujui (ACC): ${proker.title}` : `Catatan Revisi Proposal: ${proker.title}`,
            description: isApproved 
              ? `Ketua DPM resmi menyetujui proposal ${proker.title}. Proker siap berlanjut ke tahap pelaksanaan.`
              : `DPM memberikan catatan revisi: "${noteText || 'Proposal memerlukan revisi butir teknis sebelum disetujui.'}"`,
            actor: get().currentUserName,
            formattedDate: get().getFormattedDate()
          });

          return {
            prokers: state.prokers.map(p => p.id === prokerId ? {
              ...p,
              status: newStatus,
              proposal: updatedProposal
            } : p),
            activityLogs: [newLog, ...state.activityLogs]
          };
        });
      },

      // ACTION: TAMBAH BUTIR REVISI PROPOSAL
      addProposalRevisionItem: (prokerId, text) => {
        if (!text || !text.trim()) return;
        const todayStr = new Date().toISOString().split('T')[0];
        const newItem = {
          id: `rev-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          text: text.trim(),
          completed: false,
          addedBy: get().currentUserName,
          date: todayStr
        };

        set((state) => {
          const proker = state.prokers.find(p => p.id === prokerId);
          if (!proker || !proker.proposal) return state;

          const currentRevisionItems = proker.proposal.revisionItems || [];
          const updatedRevisionItems = [...currentRevisionItems, newItem];

          const updatedProposal = {
            ...proker.proposal,
            revisionItems: updatedRevisionItems,
            reviewStatus: 'revisi'
          };

          const newLog = createLogEntry({
            ormawaId: proker.ormawaId,
            type: 'proposal_revision_item_added',
            title: `Poin Revisi Proposal Ditambahkan: ${proker.title}`,
            description: `${get().currentUserName} menambahkan butir revisi: "${newItem.text}".`,
            actor: get().currentUserName,
            prokerTitle: proker.title,
            prokerId: proker.id,
            formattedDate: get().getFormattedDate()
          });

          return {
            prokers: state.prokers.map(p => p.id === prokerId ? {
              ...p,
              status: 'proposal_revisi',
              proposal: updatedProposal
            } : p),
            activityLogs: [newLog, ...state.activityLogs]
          };
        });
      },

      // ACTION: TOGGLE SELESAI BUTIR REVISI
      toggleProposalRevisionItem: (prokerId, itemId) => {
        set((state) => {
          const proker = state.prokers.find(p => p.id === prokerId);
          if (!proker || !proker.proposal || !proker.proposal.revisionItems) return state;

          let targetItemText = '';
          let isNowCompleted = false;

          const updatedRevisionItems = proker.proposal.revisionItems.map(item => {
            if (item.id === itemId) {
              targetItemText = item.text;
              isNowCompleted = !item.completed;
              return { ...item, completed: isNowCompleted };
            }
            return item;
          });

          const updatedProposal = {
            ...proker.proposal,
            revisionItems: updatedRevisionItems
          };

          const newLog = createLogEntry({
            ormawaId: proker.ormawaId,
            type: 'proposal_revision_item_toggled',
            title: `Status Poin Revisi Diubah: ${proker.title}`,
            description: `Butir revisi "${targetItemText}" ditandai ${isNowCompleted ? 'SELESAI DIPERBAIKI' : 'BELUM SELESAI'} oleh ${get().currentUserName}.`,
            actor: get().currentUserName,
            prokerTitle: proker.title,
            prokerId: proker.id,
            formattedDate: get().getFormattedDate()
          });

          return {
            prokers: state.prokers.map(p => p.id === prokerId ? {
              ...p,
              proposal: updatedProposal
            } : p),
            activityLogs: [newLog, ...state.activityLogs]
          };
        });
      },

      // ACTION: HAPUS BUTIR REVISI PROPOSAL
      deleteProposalRevisionItem: (prokerId, itemId) => {
        set((state) => {
          const proker = state.prokers.find(p => p.id === prokerId);
          if (!proker || !proker.proposal || !proker.proposal.revisionItems) return state;

          return {
            prokers: state.prokers.map(p => p.id === prokerId ? {
              ...p,
              proposal: {
                ...p.proposal,
                revisionItems: p.proposal.revisionItems.filter(item => item.id !== itemId)
              }
            } : p)
          };
        });
      },

      // UPDATE DETAIL LENGKAP PROKER
      updateProkerDetails: (prokerId, updatedData) => {
        set((state) => ({
          prokers: state.prokers.map(p => 
            p.id === prokerId ? { ...p, ...updatedData } : p
          )
        }));
      },

      // 4. INSPEKSI LAPANGAN HARI-H DPM
      saveInspection: (prokerId, inspectionData) => {
        const todayStr = new Date().toISOString().split('T')[0];

        set((state) => {
          const proker = state.prokers.find(p => p.id === prokerId);
          if (!proker) return state;

          const inspectionObj = {
            inspected: true,
            inspectorName: get().currentUserName,
            inspectionDate: todayStr,
            rundownAccuracy: inspectionData.rundownAccuracy || 'On-Time',
            sopCompliance: inspectionData.sopCompliance || 'Sangat Patuh',
            realisasiPeserta: Number(inspectionData.realisasiPeserta) || proker.targetPeserta,
            inspectionNotes: inspectionData.inspectionNotes || 'Pengawasan hari-H terlaksana dengan baik.'
          };

          const newLog = createLogEntry({
            ormawaId: proker.ormawaId,
            type: 'inspection_done',
            title: `Berita Acara Hari-H Diisi: ${proker.title}`,
            description: `Tim DPM telah melakukan pengawasan lapangan. Rundown: ${inspectionObj.rundownAccuracy}. Kepatuhan SOP: ${inspectionObj.sopCompliance}.`,
            actor: get().currentUserName,
            formattedDate: get().getFormattedDate()
          });

          return {
            prokers: state.prokers.map(p => p.id === prokerId ? {
              ...p,
              realisasiPeserta: inspectionObj.realisasiPeserta,
              inspection: inspectionObj
            } : p),
            activityLogs: [newLog, ...state.activityLogs]
          };
        });
      },

      // 5. UPLOAD LPJ PROKER
      uploadLPJ: (prokerId, fileInfo) => {
        const todayStr = new Date().toISOString().split('T')[0];

        set((state) => {
          const proker = state.prokers.find(p => p.id === prokerId);
          if (!proker) return state;

          const deadlineObj = new Date(proker.lpj?.deadlineDate || proker.endDate);
          const uploadDateObj = new Date(todayStr);
          const isOverdue = uploadDateObj.getTime() > deadlineObj.getTime();

          const updatedLPJ = {
            fileName: fileInfo.name || 'LPJ_Kegiatan_Final.pdf',
            fileSize: fileInfo.size || '5.2 MB',
            uploadDate: todayStr,
            deadlineDate: proker.lpj?.deadlineDate,
            isOverdue,
            reviewStatus: 'pending',
            notes: proker.lpj?.notes || [],
            auditScore: null,
            auditDetails: null
          };

          const ormawaName = state.ormawas.find(o => o.id === proker.ormawaId)?.name || 'Ormawa';
          const newLog = createLogEntry({
            ormawaId: proker.ormawaId,
            type: 'lpj_uploaded',
            title: `Berkas LPJ Diunggah: ${proker.title}`,
            description: `${ormawaName} mengunggah berkas LPJ dan nota keuangan. Status waktu: ${isOverdue ? 'MELAMPAUI BATAS WAKTU (> H+14)' : 'MEMENUHI BATAS WAKTU (≤ H+14)'}.`,
            actor: get().currentUserName,
            formattedDate: get().getFormattedDate()
          });

          return {
            prokers: state.prokers.map(p => p.id === prokerId ? {
              ...p,
              status: isOverdue ? 'lpj_overdue' : 'lpj_pending',
              lpj: updatedLPJ
            } : p),
            activityLogs: [newLog, ...state.activityLogs]
          };
        });
      },

      // 5.b. UPLOAD DOKUMEN LAINNYA
      uploadOtherDoc: (prokerId, fileInfo, docTitle = 'Dokumen Lainnya') => {
        const todayStr = new Date().toISOString().split('T')[0];

        set((state) => {
          const proker = state.prokers.find(p => p.id === prokerId);
          if (!proker) return state;

          const newDoc = {
            id: `doc-${Date.now()}`,
            fileName: fileInfo.name || 'Dokumen_Pendukung.pdf',
            fileSize: fileInfo.size || '1.8 MB',
            uploadDate: todayStr,
            title: docTitle || fileInfo.name || 'Dokumen Lampiran / SK',
            reviewStatus: 'verified',
            notes: []
          };

          const existingDocs = proker.otherDocs || [];
          const ormawaName = state.ormawas.find(o => o.id === proker.ormawaId)?.name || 'Ormawa';
          const newLog = createLogEntry({
            ormawaId: proker.ormawaId,
            type: 'doc_uploaded',
            title: `Dokumen Lainnya Diunggah: ${newDoc.fileName}`,
            description: `${ormawaName} mengunggah dokumen administrasi/lampiran untuk kegiatan ${proker.title}.`,
            actor: get().currentUserName,
            formattedDate: get().getFormattedDate()
          });

          return {
            prokers: state.prokers.map(p => p.id === prokerId ? {
              ...p,
              otherDocs: [...existingDocs, newDoc]
            } : p),
            activityLogs: [newLog, ...state.activityLogs]
          };
        });
      },

      // 6. AUDIT PARAMETER KEBERHASILAN PROKER DPM
      auditLPJ: (prokerId, auditData) => {
        const todayStr = new Date().toISOString().split('T')[0];

        const rundownScore = Number(auditData.rundownScore) || 20;
        const pesertaScore = Number(auditData.pesertaScore) || 20;
        const anggaranScore = Number(auditData.anggaranScore) || 20;
        const slaScore = Number(auditData.slaScore) || 20;
        const outputScore = Number(auditData.outputScore) || 20;
        const totalScore = Math.min(100, Math.max(0, rundownScore + pesertaScore + anggaranScore + slaScore + outputScore));

        let predikat = 'A';
        if (totalScore < 55) predikat = 'D';
        else if (totalScore < 70) predikat = 'C';
        else if (totalScore < 85) predikat = 'B';

        const auditDetails = {
          rundownScore,
          pesertaScore,
          anggaranScore,
          slaScore,
          outputScore,
          totalScore,
          predikat,
          catatanDPM: auditData.catatanDPM || 'Pelaksanaan kegiatan telah diaudit dan disahkan oleh DPM Fasilkom UMB.',
          auditedBy: get().currentUserName,
          auditDate: todayStr
        };

        set((state) => {
          const proker = state.prokers.find(p => p.id === prokerId);
          if (!proker) return state;

          const updatedLPJ = {
            ...proker.lpj,
            reviewStatus: 'approved',
            auditScore: totalScore,
            auditDetails
          };

          const newLog = createLogEntry({
            ormawaId: proker.ormawaId,
            type: 'lpj_approved',
            title: `Audit Selesai: ${proker.title} — Nilai ${totalScore} (${predikat})`,
            description: `DPM resmi mengesahkan LPJ ${proker.title} dengan predikat ${predikat} (Skor: ${totalScore}/100). Catatan: "${auditDetails.catatanDPM}"`,
            actor: get().currentUserName,
            formattedDate: get().getFormattedDate()
          });

          return {
            prokers: state.prokers.map(p => p.id === prokerId ? {
              ...p,
              status: 'completed',
              realisasiDana: Number(auditData.realisasiDana) || p.rab,
              lpj: updatedLPJ
            } : p),
            activityLogs: [newLog, ...state.activityLogs]
          };
        });
      },

      // 7. TERBITKAN SURAT PERINGATAN (SP 1, SP 2, SP 3)
      issueSP: (spPayload) => {
        const todayStr = new Date().toISOString().split('T')[0];
        const romanMonths = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
        const currentMonth = romanMonths[new Date().getMonth()];
        const currentYear = new Date().getFullYear();
        const count = get().suratPeringatan.length + 1;
        const noSurat = `0${count}/SP-${spPayload.level}/DPM-FASILKOM/UMB/${currentMonth}/${currentYear}`;

        const spItem = {
          id: `sp-${Date.now()}`,
          noSurat,
          ormawaId: spPayload.ormawaId,
          ormawaName: get().ormawas.find(o => o.id === spPayload.ormawaId)?.name || 'Ormawa',
          level: spPayload.level,
          title: `Surat Peringatan ${spPayload.level} (SP ${spPayload.level}) — ${spPayload.prokerTitle}`,
          reason: spPayload.reason,
          prokerId: spPayload.prokerId,
          prokerTitle: spPayload.prokerTitle,
          date: todayStr,
          signer: 'Muhammad Daffa Aulia Syahrul',
          signerRole: 'Ketua DPM FASILKOM Universitas Mercu Buana',
          status: 'active'
        };

        const newLog = createLogEntry({
          ormawaId: spPayload.ormawaId,
          type: 'sp_issued',
          title: `Penerbitan ${spItem.title}`,
          description: `Ketua DPM menerbitkan ${spItem.title} dengan No: ${noSurat}. Alasan: ${spPayload.reason}`,
          actor: get().currentUserName,
          formattedDate: get().getFormattedDate()
        });

        set((state) => ({
          suratPeringatan: [spItem, ...state.suratPeringatan],
          activityLogs: [newLog, ...state.activityLogs]
        }));

        return spItem;
      },

      // 8. RESOLVE SP
      resolveSP: (spId) => {
        set((state) => ({
          suratPeringatan: state.suratPeringatan.map(s => s.id === spId ? { ...s, status: 'resolved' } : s)
        }));
      },

      // 9. BANK TEMPLATE DOKUMEN
      addTemplate: (newTemplate) => {
        const id = `tpl-${Date.now()}`;
        const templateItem = {
          id,
          title: newTemplate.title,
          category: newTemplate.category,
          categorySlug: newTemplate.categorySlug || 'dispensasi',
          format: newTemplate.format || 'DOCX',
          fileSize: newTemplate.fileSize || '150 KB',
          downloadCount: 0,
          updatedAt: new Date().toISOString().split('T')[0],
          isOfficial: false,
          isCustom: true,
          author: newTemplate.author || get().currentUserName,
          description: newTemplate.description || '',
          tags: newTemplate.tags || ['Custom', 'Template Baru'],
          fields: newTemplate.fields || ['[Nama Ormawa]', '[Tanggal]', '[Nama Proker]'],
          contentPreview: newTemplate.contentPreview || 'Template Dokumen Resmi'
        };

        set((state) => ({
          templates: [templateItem, ...state.templates],
          activityLogs: [
            createLogEntry({
              ormawaId: 'dpm',
              type: 'template_added',
              title: `Template Ditambahkan: ${templateItem.title}`,
              description: `Template baru "${templateItem.title}" berhasil ditambahkan ke Bank Template Dokumen.`,
              actor: get().currentUserName,
              formattedDate: get().getFormattedDate()
            }),
            ...state.activityLogs
          ]
        }));

        return templateItem;
      },

      deleteTemplate: (templateId) => {
        set((state) => ({
          templates: state.templates.filter(t => t.id !== templateId)
        }));
      },

      updateTemplate: (templateId, updatedData) => {
        set((state) => {
          const updatedTemplates = state.templates.map(t => 
            t.id === templateId 
              ? { 
                  ...t, 
                  ...updatedData, 
                  updatedAt: new Date().toISOString().split('T')[0] 
                } 
              : t
          );
          const target = updatedTemplates.find(t => t.id === templateId);
          return {
            templates: updatedTemplates,
            activityLogs: [
              createLogEntry({
                ormawaId: 'dpm',
                type: 'template_updated',
                title: `Template Diperbarui: ${target?.title || 'Dokumen'}`,
                description: `Template "${target?.title || 'Dokumen'}" berhasil diperbarui oleh ${get().currentUserName}.`,
                actor: get().currentUserName,
                formattedDate: get().getFormattedDate()
              }),
              ...state.activityLogs
            ]
          };
        });
      },

      incrementTemplateDownload: (templateId) => {
        set((state) => ({
          templates: state.templates.map(t => 
            t.id === templateId ? { ...t, downloadCount: (t.downloadCount || 0) + 1 } : t
          )
        }));
      },

      // 10. KELOLA PAGU ANGGARAN ORMAWA
      updateOrmawaPagu: (ormawaId, newPagu) => {
        set((state) => {
          const updatedOrmawas = state.ormawas.map(o => 
            o.id === ormawaId ? { ...o, paguAnggaran: Number(newPagu) || 0 } : o
          );
          const targetOrmawa = updatedOrmawas.find(o => o.id === ormawaId);
          return {
            ormawas: updatedOrmawas,
            activityLogs: [
              createLogEntry({
                ormawaId,
                type: 'budget_updated',
                title: `Alokasi Anggaran ${targetOrmawa?.shortName || ormawaId} Diperbarui`,
                description: `Alokasi anggaran ditetapkan sebesar Rp ${(Number(newPagu) || 0).toLocaleString('id-ID')}`,
                actor: get().currentUserName,
                formattedDate: get().getFormattedDate()
              }),
              ...state.activityLogs
            ]
          };
        });
      },

      // 11. TAMBAH TRANSAKSI ANGGARAN
      addBudgetTransaction: (newTx) => {
        const id = `tx-${Date.now()}`;
        const todayStr = new Date().toISOString().split('T')[0];
        const nominal = Number(newTx.nominal) || 0;

        const txItem = {
          id,
          ormawaId: newTx.ormawaId,
          prokerId: newTx.prokerId || null,
          type: newTx.type || 'termin1',
          category: newTx.category || 'Dana Kemahasiswaan Fakultas',
          title: newTx.title || 'Pencairan Anggaran',
          nominal,
          date: newTx.date || todayStr,
          pic: newTx.pic || get().currentUserName,
          receiptNumber: newTx.receiptNumber || `KW-${Date.now().toString().slice(-6)}`,
          receiptPhoto: newTx.receiptPhoto || null,
          receiptPhotoName: newTx.receiptPhotoName || null,
          notes: newTx.notes || '',
          status: 'completed'
        };

        set((state) => {
          const updatedTransactions = [txItem, ...(state.budgetTransactions || [])];
          
          const updatedOrmawas = state.ormawas.map(o => {
            if (o.id === newTx.ormawaId) {
              const isExpense = ['termin1', 'termin2', 'operasional', 'lainnya'].includes(txItem.type);
              const additionalSerapan = isExpense ? nominal : 0;
              return {
                ...o,
                serapanAnggaran: (o.serapanAnggaran || 0) + additionalSerapan
              };
            }
            return o;
          });

          let updatedProkers = state.prokers;
          if (newTx.prokerId) {
            updatedProkers = state.prokers.map(p => {
              if (p.id === newTx.prokerId) {
                return {
                  ...p,
                  realisasiDana: (p.realisasiDana || 0) + nominal
                };
              }
              return p;
            });
          }

          const ormawa = updatedOrmawas.find(o => o.id === newTx.ormawaId);

          return {
            budgetTransactions: updatedTransactions,
            ormawas: updatedOrmawas,
            prokers: updatedProkers,
            activityLogs: [
              createLogEntry({
                ormawaId: newTx.ormawaId,
                type: 'transaction_added',
                title: `Transaksi Anggaran ${ormawa?.shortName || ''} Dicatat`,
                description: `${txItem.title}: Rp ${nominal.toLocaleString('id-ID')} (${txItem.category})`,
                actor: get().currentUserName,
                formattedDate: get().getFormattedDate()
              }),
              ...state.activityLogs
            ]
          };
        });

        return txItem;
      },

      deleteBudgetTransaction: (transactionId) => {
        set((state) => {
          const tx = (state.budgetTransactions || []).find(t => t.id === transactionId);
          if (!tx) return state;

          const updatedTransactions = (state.budgetTransactions || []).filter(t => t.id !== transactionId);

          const isExpense = ['termin1', 'termin2', 'operasional', 'lainnya'].includes(tx.type);
          const updatedOrmawas = state.ormawas.map(o => {
            if (o.id === tx.ormawaId && isExpense) {
              return {
                ...o,
                serapanAnggaran: Math.max(0, (o.serapanAnggaran || 0) - (tx.nominal || 0))
              };
            }
            return o;
          });

          let updatedProkers = state.prokers;
          if (tx.prokerId) {
            updatedProkers = state.prokers.map(p => {
              if (p.id === tx.prokerId) {
                return {
                  ...p,
                  realisasiDana: Math.max(0, (p.realisasiDana || 0) - (tx.nominal || 0))
                };
              }
              return p;
            });
          }

          return {
            budgetTransactions: updatedTransactions,
            ormawas: updatedOrmawas,
            prokers: updatedProkers
          };
        });
      },

      // Reset data
      resetToDefaultData: () => {
        set({
          ormawas: INITIAL_ORMAWA,
          prokers: INITIAL_PROKER,
          suratPeringatan: INITIAL_SP,
          activityLogs: INITIAL_ACTIVITY_LOGS,
          templates: INITIAL_TEMPLATES,
          budgetTransactions: INITIAL_BUDGET_TRANSACTIONS
        });
      }
    }),
    {
      name: 'siwasma-dpm-fasilkom-storage-v3',
      partialize: (state) => ({
        ormawas: state.ormawas,
        prokers: state.prokers,
        suratPeringatan: state.suratPeringatan,
        activityLogs: state.activityLogs,
        templates: state.templates,
        budgetTransactions: state.budgetTransactions
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...persistedState,
        templates: (persistedState && Array.isArray(persistedState.templates) && persistedState.templates.length > 0)
          ? persistedState.templates.map((t) => {
              const defaultTpl = currentState.templates?.find((init) => init.id === t.id && init.isOfficial);
              return defaultTpl ? { ...t, title: defaultTpl.title, description: defaultTpl.description } : t;
            })
          : currentState.templates,
        budgetTransactions: (persistedState && Array.isArray(persistedState.budgetTransactions))
          ? persistedState.budgetTransactions
          : currentState.budgetTransactions
      })
    }
  )
);
