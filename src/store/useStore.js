import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { INITIAL_ORMAWA, INITIAL_PROKER, INITIAL_SP, INITIAL_ACTIVITY_LOGS, INITIAL_BUDGET_TRANSACTIONS } from '../data/initialData';
import { INITIAL_TEMPLATES } from '../data/templatesData';

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
      activeTab: 'dashboard', // 'dashboard' | 'proker' | 'history' | 'anggaran' | 'berkas' | 'template' | 'audit' | 'kalender' | 'sp'
      selectedOrmawaFilter: 'all', // 'all' | 'dpm' | 'bem' | 'himti' | 'himsisfo'
      searchQuery: '',
      currentUserRole: 'dpm', // 'dpm' | 'bem' | 'himti' | 'himsisfo'
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
        
        // Cek apakah proposal diunggah sekarang
        const todayStr = new Date().toISOString().split('T')[0];
        let isDadakan = false;
        if (newProker.proposal?.fileName) {
          const startDateObj = new Date(newProker.startDate);
          const uploadDateObj = new Date(todayStr);
          const diffTime = startDateObj.getTime() - uploadDateObj.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          isDadakan = diffDays < 14;
        }

        // Hitung deadline LPJ (startDate + 14 hari)
        const eventEndObj = new Date(newProker.endDate || newProker.startDate);
        eventEndObj.setDate(eventEndObj.getDate() + 14);
        const lpjDeadline = eventEndObj.toISOString().split('T')[0];

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
          proposal: newProker.proposal?.fileName ? {
            fileName: newProker.proposal.fileName,
            fileSize: newProker.proposal.fileSize || '2.5 MB',
            uploadDate: todayStr,
            isDadakan,
            reviewStatus: 'pending',
            approvedDate: null,
            approvedBy: null,
            notes: []
          } : {
            fileName: null,
            fileSize: null,
            uploadDate: null,
            isDadakan: false,
            reviewStatus: 'not_uploaded',
            approvedDate: null,
            approvedBy: null,
            notes: []
          },
          inspection: null,
          lpj: {
            fileName: null,
            fileSize: null,
            uploadDate: null,
            deadlineDate: lpjDeadline,
            reviewStatus: 'not_uploaded',
            notes: [],
            auditScore: null,
            auditDetails: null
          },
          otherDocs: newProker.otherDocs || []
        };

        const ormawaName = get().ormawas.find(o => o.id === newProker.ormawaId)?.name || 'Ormawa';

        const newLog = {
          id: `log-${Date.now()}`,
          timestamp: `${get().getFormattedDate()} ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`,
          ormawaId: newProker.ormawaId,
          type: 'proker_added',
          title: `Program Kerja Baru Ditambahkan: ${newProker.title}`,
          description: `${ormawaName} mendaftarkan program kerja baru "${newProker.title}". Jadwal: ${newProker.startDate}. Status Proposal: ${prokerItem.proposal.fileName ? (isDadakan ? 'Diunggah di Luar Batas Waktu (< H-14)' : 'Diunggah Tepat Waktu (≥ H-14)') : 'Belum Ada Berkas Proposal'}.`,
          actor: get().currentUserName,
          prokerTitle: newProker.title,
          prokerId: id
        };

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
          const newLog = target ? {
            id: `log-${Date.now()}`,
            timestamp: `${get().getFormattedDate()} ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`,
            ormawaId: target.ormawaId,
            type: 'proker_deleted',
            title: `Program Kerja Dihapus: ${target.title}`,
            description: `Program kerja "${target.title}" dari ${ormawaName} (${target.divisi}) telah dihapus dari sistem pengawasan oleh ${get().currentUserName}.`,
            actor: get().currentUserName,
            prokerTitle: target.title,
            prokerId: target.id
          } : null;

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

          const startDateObj = new Date(proker.startDate);
          const uploadDateObj = new Date(todayStr);
          const diffTime = startDateObj.getTime() - uploadDateObj.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const isDadakan = diffDays < 14;

          const updatedProposal = {
            fileName: fileInfo.name || 'Proposal_Kegiatan.pdf',
            fileSize: fileInfo.size || '2.4 MB',
            uploadDate: todayStr,
            isDadakan,
            reviewStatus: 'pending',
            approvedDate: null,
            approvedBy: null,
            notes: proker.proposal?.notes || []
          };

          const ormawaName = state.ormawas.find(o => o.id === proker.ormawaId)?.name || 'Ormawa';
          const newLog = {
            id: `log-${Date.now()}`,
            timestamp: `${get().getFormattedDate()} ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`,
            ormawaId: proker.ormawaId,
            type: 'proposal_uploaded',
            title: `Proposal Diunggah: ${proker.title}`,
            description: `${ormawaName} mengunggah berkas proposal. Selisih ke Hari-H: ${diffDays} hari (${isDadakan ? 'DITANDAI TERLAMBAT < H-14' : 'TEPAT WAKTU ≥ H-14'}).`,
            actor: get().currentUserName
          };

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
            reviewStatus: status,
            approvedDate: isApproved ? todayStr : null,
            approvedBy: isApproved ? get().currentUserName : null,
            notes: updatedNotes
          };

          const newLog = {
            id: `log-${Date.now()}`,
            timestamp: `${get().getFormattedDate()} ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`,
            ormawaId: proker.ormawaId,
            type: isApproved ? 'proposal_approved' : 'proposal_revisi',
            title: isApproved ? `Proposal Disetujui (ACC): ${proker.title}` : `Catatan Revisi Proposal: ${proker.title}`,
            description: isApproved 
              ? `Ketua DPM resmi menyetujui proposal ${proker.title}. Proker siap berlanjut ke tahap pelaksanaan.`
              : `DPM memberikan catatan revisi: "${noteText || 'Tolong lengkapi rincian anggaran dan rundown'}"`,
            actor: get().currentUserName
          };

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

      // UPDATE DETAIL LENGKAP PROKER (RUNDOWN, KEPANITIAAN, TUJUAN, DESKRIPSI, RAB)
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

          const newLog = {
            id: `log-${Date.now()}`,
            timestamp: `${get().getFormattedDate()} ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`,
            ormawaId: proker.ormawaId,
            type: 'inspection_done',
            title: `Berita Acara Hari-H Diisi: ${proker.title}`,
            description: `Tim DPM telah melakukan pengawasan lapangan. Rundown: ${inspectionObj.rundownAccuracy}. Kepatuhan SOP: ${inspectionObj.sopCompliance}.`,
            actor: get().currentUserName
          };

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
          const newLog = {
            id: `log-${Date.now()}`,
            timestamp: `${get().getFormattedDate()} ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`,
            ormawaId: proker.ormawaId,
            type: 'lpj_uploaded',
            title: `Berkas LPJ Diunggah: ${proker.title}`,
            description: `${ormawaName} mengunggah berkas LPJ dan nota keuangan. Status waktu: ${isOverdue ? 'MELAMPAUI BATAS WAKTU (> H+14)' : 'MEMENUHI BATAS WAKTU (≤ H+14)'}.`,
            actor: get().currentUserName
          };

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

      // 5.b. UPLOAD DOKUMEN LAINNYA (SURAT, SK, LAMPIRAN)
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
          const newLog = {
            id: `log-${Date.now()}`,
            timestamp: `${get().getFormattedDate()} ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`,
            ormawaId: proker.ormawaId,
            type: 'doc_uploaded',
            title: `Dokumen Lainnya Diunggah: ${newDoc.fileName}`,
            description: `${ormawaName} mengunggah dokumen administrasi/lampiran untuk kegiatan ${proker.title}.`,
            actor: get().currentUserName
          };

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

        // 5 Parameter Penilaian (Masing-masing 0 - 20, Total 100)
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

          const newLog = {
            id: `log-${Date.now()}`,
            timestamp: `${get().getFormattedDate()} ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`,
            ormawaId: proker.ormawaId,
            type: 'lpj_approved',
            title: `Audit Selesai: ${proker.title} — Nilai ${totalScore} (${predikat})`,
            description: `DPM resmi mengesahkan LPJ ${proker.title} dengan predikat ${predikat} (Skor: ${totalScore}/100). Catatan: "${auditDetails.catatanDPM}"`,
            actor: get().currentUserName
          };

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
          level: spPayload.level, // 1 | 2 | 3
          title: `Surat Peringatan ${spPayload.level} (SP ${spPayload.level}) — ${spPayload.prokerTitle}`,
          reason: spPayload.reason,
          prokerId: spPayload.prokerId,
          prokerTitle: spPayload.prokerTitle,
          date: todayStr,
          signer: 'Muhammad Daffa Aulia Syahrul',
          signerRole: 'Ketua DPM FASILKOM Universitas Mercu Buana',
          status: 'active'
        };

        const newLog = {
          id: `log-${Date.now()}`,
          timestamp: `${get().getFormattedDate()} ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`,
          ormawaId: spPayload.ormawaId,
          type: 'sp_issued',
          title: `Penerbitan ${spItem.title}`,
          description: `Ketua DPM menerbitkan ${spItem.title} dengan No: ${noSurat}. Alasan: ${spPayload.reason}`,
          actor: get().currentUserName
        };

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
            {
              id: `log-${Date.now()}`,
              timestamp: new Date().toISOString(),
              text: `Template baru "${templateItem.title}" berhasil ditambahkan ke Bank Template Dokumen.`,
              type: 'template_added'
            },
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
              {
                id: `log-${Date.now()}`,
                timestamp: new Date().toISOString(),
                text: `Template "${target?.title || 'Dokumen'}" berhasil diperbarui.`,
                type: 'template_updated'
              },
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
              {
                id: `log-${Date.now()}`,
                title: `Alokasi Anggaran ${targetOrmawa?.shortName || ormawaId} Diperbarui`,
                desc: `Alokasi anggaran ditetapkan sebesar Rp ${(Number(newPagu) || 0).toLocaleString('id-ID')}`,
                timestamp: 'Baru saja',
                time: get().getFormattedDate(),
                type: 'budget_updated'
              },
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
          type: newTx.type || 'termin1', // 'termin1' | 'termin2' | 'operasional' | 'sponsorship' | 'lainnya'
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
          
          // Sinkronisasi serapan anggaran ormawa terkait
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

          // Jika ada proker terkait dan transaksi pencairan, sinkronkan realisasiDana proker
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
              {
                id: `log-${Date.now()}`,
                title: `Transaksi Anggaran ${ormawa?.shortName || ''} Dicatat`,
                desc: `${txItem.title}: Rp ${nominal.toLocaleString('id-ID')} (${txItem.category})`,
                timestamp: 'Baru saja',
                time: get().getFormattedDate(),
                type: 'transaction_added'
              },
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
          ? persistedState.templates
          : currentState.templates,
        budgetTransactions: (persistedState && Array.isArray(persistedState.budgetTransactions))
          ? persistedState.budgetTransactions
          : currentState.budgetTransactions
      })
    }
  )
);
