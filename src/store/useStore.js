import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  INITIAL_ORMAWA, 
  INITIAL_PROKER, 
  INITIAL_SP, 
  INITIAL_ACTIVITY_LOGS, 
  INITIAL_BUDGET_TRANSACTIONS,
  INITIAL_USERS,
  INITIAL_PENDING_USERS
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
      
      // Approval & Workflow State
      deletionRequests: [], // { id, prokerId, prokerTitle, ormawaId, requesterName, reasonCategory, reasonDetails, date, status: 'pending'|'approved'|'rejected', reviewNote }
      notifications: [], // { id, title, message, time, date, type, targetOrmawaId, isRead, linkTab, linkId }
      
      // Auth State
      users: INITIAL_USERS,
      pendingAccounts: INITIAL_PENDING_USERS,
      currentUser: null, // null means not logged in
      
      // UI State
      activeTab: 'dashboard',
      selectedOrmawaFilter: 'all',
      searchQuery: '',

      // Setters
      setActiveTab: (tab) => set({ activeTab: tab }),
      setSelectedOrmawaFilter: (filter) => {
        const user = get().currentUser;
        if (user && user.ormawaId !== 'dpm') {
          set({ selectedOrmawaFilter: user.ormawaId });
        } else {
          set({ selectedOrmawaFilter: filter });
        }
      },
      setSearchQuery: (query) => set({ searchQuery: query }),

      // Auth Methods
      login: (username, password) => {
        const user = get().users.find(u => u.username === username && u.password === password && u.status === 'approved');
        if (user) {
          const initialFilter = user.ormawaId === 'dpm' ? 'all' : user.ormawaId;
          set({ currentUser: user, selectedOrmawaFilter: initialFilter });
          return { success: true };
        }
        return { success: false, message: 'Username atau password salah, atau akun belum di-ACC DPM.' };
      },

      // Direct Login khusus akun demo (akan dihapus saat integrasi backend)
      directLogin: (username) => {
        const user = get().users.find(u => u.username === username && u.status === 'approved');
        if (user) {
          const initialFilter = user.ormawaId === 'dpm' ? 'all' : user.ormawaId;
          set({ currentUser: user, selectedOrmawaFilter: initialFilter });
          return { success: true };
        }
        return { success: false, message: `Akun demo ${username} tidak ditemukan.` };
      },

      logout: () => {
        set({ currentUser: null, activeTab: 'dashboard', selectedOrmawaFilter: 'all' });
      },

      updateUserProfile: (userId, updatedData) => {
        set((state) => {
          const updatedUsers = state.users.map(u => u.id === userId ? { ...u, ...updatedData } : u);
          const updatedCurrentUser = state.currentUser?.id === userId ? { ...state.currentUser, ...updatedData } : state.currentUser;
          return {
            users: updatedUsers,
            currentUser: updatedCurrentUser
          };
        });
        return { success: true };
      },

      changeUserPassword: (userId, oldPassword, newPassword) => {
        const user = get().users.find(u => u.id === userId);
        if (!user) return { success: false, message: 'Pengguna tidak ditemukan.' };
        if (user.password !== oldPassword) {
          return { success: false, message: 'Password saat ini salah.' };
        }
        if (!newPassword || newPassword.length < 3) {
          return { success: false, message: 'Password baru minimal 3 karakter.' };
        }

        set((state) => {
          const updatedUsers = state.users.map(u => u.id === userId ? { ...u, password: newPassword } : u);
          const updatedCurrentUser = state.currentUser?.id === userId ? { ...state.currentUser, password: newPassword } : state.currentUser;
          return {
            users: updatedUsers,
            currentUser: updatedCurrentUser
          };
        });
        return { success: true, message: 'Password berhasil diperbarui!' };
      },

      register: (name, nim, ormawaId, role, username, password) => {
        const exists = get().users.find(u => u.username === username) || get().pendingAccounts.find(u => u.username === username);
        if (exists) {
          return { success: false, message: 'Username sudah digunakan.' };
        }
        
        const newAccount = {
          id: `user-${Date.now()}`,
          name,
          nim,
          ormawaId,
          role,
          username,
          password,
          status: 'pending'
        };
        
        const newNotif = {
          id: `notif-${Date.now()}`,
          title: 'Registrasi Akun Baru Menunggu ACC',
          message: `${name} (${role.toUpperCase()} ${ormawaId.toUpperCase()}) telah mendaftar dan menunggu validasi DPM.`,
          time: 'Baru saja',
          date: get().getFormattedDate(),
          type: 'account_pending',
          targetOrmawaId: 'dpm',
          isRead: false,
          linkTab: 'dashboard'
        };

        set((state) => ({
          pendingAccounts: [newAccount, ...state.pendingAccounts],
          notifications: [newNotif, ...state.notifications]
        }));
        
        return { success: true };
      },

      approveAccount: (userId) => {
        set((state) => {
          const account = state.pendingAccounts.find(a => a.id === userId);
          if (!account) return state;
          
          const approvedNotif = {
            id: `notif-${Date.now()}`,
            title: 'Akun Anda Telah Disetujui DPM',
            message: `Akun ${account.name} resmi disetujui. Anda kini memiliki akses penuh sebagai pengurus ${account.ormawaId.toUpperCase()}.`,
            time: 'Baru saja',
            date: get().getFormattedDate(),
            type: 'account_approved',
            targetOrmawaId: account.ormawaId,
            isRead: false,
            linkTab: 'dashboard'
          };

          return {
            pendingAccounts: state.pendingAccounts.filter(a => a.id !== userId),
            users: [...state.users, { ...account, status: 'approved' }],
            notifications: [approvedNotif, ...state.notifications]
          };
        });
      },

      rejectAccount: (userId) => {
        set((state) => ({
          pendingAccounts: state.pendingAccounts.filter(a => a.id !== userId)
        }));
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
          actor: (get().currentUser?.name || 'Sistem'),
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

      // HAPUS PROGRAM KERJA (LANGSUNG OLEH DPM)
      deleteProker: (prokerId) => {
        set((state) => {
          const target = state.prokers.find(p => p.id === prokerId);
          const ormawaName = state.ormawas.find(o => o.id === target?.ormawaId)?.name || 'Ormawa';
          const newLog = target ? createLogEntry({
            ormawaId: target.ormawaId,
            type: 'proker_deleted',
            title: `Program Kerja Dihapus: ${target.title}`,
            description: `Program kerja "${target.title}" dari ${ormawaName} (${target.divisi}) telah dihapus dari sistem pengawasan oleh ${(get().currentUser?.name || 'Sistem')}.`,
            actor: (get().currentUser?.name || 'Sistem'),
            prokerTitle: target.title,
            prokerId: target.id,
            formattedDate: get().getFormattedDate()
          }) : null;

          return {
            prokers: state.prokers.filter(p => p.id !== prokerId),
            deletionRequests: state.deletionRequests.filter(r => r.prokerId !== prokerId),
            activityLogs: newLog ? [newLog, ...state.activityLogs] : state.activityLogs
          };
        });
      },

      // PERMOHONAN HAPUS PROKER OLEH ORMAWA (MENUNGGU ACC DPM)
      requestProkerDeletion: ({ prokerId, reasonCategory, reasonDetails }) => {
        const todayStr = new Date().toISOString().split('T')[0];
        const proker = get().prokers.find(p => p.id === prokerId);
        if (!proker) return { success: false, message: 'Proker tidak ditemukan' };

        const ormawa = get().ormawas.find(o => o.id === proker.ormawaId);
        const ormawaName = ormawa?.name || proker.ormawaId.toUpperCase();
        const requesterName = get().currentUser?.name || 'Pengurus Ormawa';

        const newRequest = {
          id: `delreq-${Date.now()}`,
          prokerId,
          prokerTitle: proker.title,
          ormawaId: proker.ormawaId,
          ormawaName,
          requesterName,
          requesterRole: get().currentUser?.role || 'pengurus',
          reasonCategory: reasonCategory || 'Kendala Lainnya',
          reasonDetails: reasonDetails || 'Permohonan pembatalan proker oleh ormawa.',
          date: todayStr,
          status: 'pending', // 'pending' | 'approved' | 'rejected'
          reviewNote: null,
          reviewedBy: null,
          reviewedDate: null
        };

        const newLog = createLogEntry({
          ormawaId: proker.ormawaId,
          type: 'proker_deletion_requested',
          title: `Permohonan Hapus Proker: ${proker.title}`,
          description: `${requesterName} (${ormawaName}) mengajukan permohonan pembatalan/penghapusan program kerja "${proker.title}". Alasan: [${newRequest.reasonCategory}] ${newRequest.reasonDetails}. Menunggu verifikasi DPM.`,
          actor: requesterName,
          prokerTitle: proker.title,
          prokerId: proker.id,
          formattedDate: get().getFormattedDate()
        });

        const newNotif = {
          id: `notif-${Date.now()}`,
          title: `Permohonan Hapus Proker: ${proker.title}`,
          message: `${ormawaName} mengajukan permohonan pembatalan program kerja "${proker.title}". Alasan: ${newRequest.reasonCategory}.`,
          time: 'Baru saja',
          date: get().getFormattedDate(),
          type: 'deletion_request',
          targetOrmawaId: 'dpm',
          isRead: false,
          linkTab: 'proker',
          linkId: proker.id
        };

        set((state) => ({
          prokers: state.prokers.map(p => p.id === prokerId ? { ...p, deletionPending: true, previousStatus: p.status, status: 'deletion_pending' } : p),
          deletionRequests: [newRequest, ...state.deletionRequests],
          activityLogs: [newLog, ...state.activityLogs],
          notifications: [newNotif, ...state.notifications]
        }));

        return { success: true };
      },

      // ACC PERMOHONAN HAPUS OLEH DPM
      approveProkerDeletion: (requestId, reviewNote = '') => {
        const todayStr = new Date().toISOString().split('T')[0];
        const req = get().deletionRequests.find(r => r.id === requestId);
        if (!req) return { success: false, message: 'Permohonan tidak ditemukan' };

        const reviewerName = get().currentUser?.name || 'Ketua DPM';

        const newLog = createLogEntry({
          ormawaId: req.ormawaId,
          type: 'proker_deletion_approved',
          title: `Permohonan Hapus Disetujui DPM: ${req.prokerTitle}`,
          description: `DPM (${reviewerName}) menyetujui penghapusan proker "${req.prokerTitle}" dari ${req.ormawaName}. Proker resmi dihapus dari sistem pengawasan.${reviewNote ? ` Catatan: "${reviewNote}"` : ''}`,
          actor: reviewerName,
          prokerTitle: req.prokerTitle,
          prokerId: req.prokerId,
          formattedDate: get().getFormattedDate()
        });

        const ormawaNotif = {
          id: `notif-${Date.now()}`,
          title: `Permohonan Hapus Proker Disetujui (ACC)`,
          message: `DPM telah menyetujui permohonan pembatalan proker "${req.prokerTitle}". Proker telah dihapus dari agenda.${reviewNote ? ` Catatan: "${reviewNote}"` : ''}`,
          time: 'Baru saja',
          date: get().getFormattedDate(),
          type: 'deletion_approved',
          targetOrmawaId: req.ormawaId,
          isRead: false,
          linkTab: 'proker',
          linkId: req.prokerId
        };

        set((state) => ({
          prokers: state.prokers.filter(p => p.id !== req.prokerId),
          deletionRequests: state.deletionRequests.map(r => r.id === requestId ? {
            ...r,
            status: 'approved',
            reviewNote: reviewNote || 'Disetujui oleh DPM FASILKOM',
            reviewedBy: reviewerName,
            reviewedDate: todayStr
          } : r),
          activityLogs: [newLog, ...state.activityLogs],
          notifications: [ormawaNotif, ...state.notifications]
        }));

        return { success: true };
      },

      // TOLAK PERMOHONAN HAPUS OLEH DPM
      rejectProkerDeletion: (requestId, reviewNote = 'Permohonan dibatalkan oleh DPM') => {
        const todayStr = new Date().toISOString().split('T')[0];
        const req = get().deletionRequests.find(r => r.id === requestId);
        if (!req) return { success: false, message: 'Permohonan tidak ditemukan' };

        const reviewerName = get().currentUser?.name || 'Ketua DPM';

        const newLog = createLogEntry({
          ormawaId: req.ormawaId,
          type: 'proker_deletion_rejected',
          title: `Permohonan Hapus Ditolak DPM: ${req.prokerTitle}`,
          description: `DPM menolak permohonan penghapusan proker "${req.prokerTitle}". Alasan penolakan: "${reviewNote}". Proker dikembalikan ke status aktif pengawasan.`,
          actor: reviewerName,
          prokerTitle: req.prokerTitle,
          prokerId: req.prokerId,
          formattedDate: get().getFormattedDate()
        });

        const ormawaNotif = {
          id: `notif-${Date.now()}`,
          title: `Permohonan Hapus Proker Ditolak DPM`,
          message: `DPM tidak menyetujui permohonan pembatalan proker "${req.prokerTitle}". Catatan DPM: "${reviewNote}". Proker tetap harus dilaksanakan / dikoordinasikan kembali.`,
          time: 'Baru saja',
          date: get().getFormattedDate(),
          type: 'deletion_rejected',
          targetOrmawaId: req.ormawaId,
          isRead: false,
          linkTab: 'proker',
          linkId: req.prokerId
        };

        set((state) => ({
          prokers: state.prokers.map(p => {
            if (p.id === req.prokerId) {
              return {
                ...p,
                deletionPending: false,
                status: p.previousStatus || (p.proposal?.fileName ? 'proposal_pending' : 'draft')
              };
            }
            return p;
          }),
          deletionRequests: state.deletionRequests.map(r => r.id === requestId ? {
            ...r,
            status: 'rejected',
            reviewNote,
            reviewedBy: reviewerName,
            reviewedDate: todayStr
          } : r),
          activityLogs: [newLog, ...state.activityLogs],
          notifications: [ormawaNotif, ...state.notifications]
        }));

        return { success: true };
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
            actor: (get().currentUser?.name || 'Sistem'),
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
            author: (get().currentUser?.name || 'Sistem'),
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
            approvedBy: isApproved ? (get().currentUser?.name || 'Sistem') : null,
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
            actor: (get().currentUser?.name || 'Sistem'),
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
          addedBy: (get().currentUser?.name || 'Sistem'),
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
            description: `${(get().currentUser?.name || 'Sistem')} menambahkan butir revisi: "${newItem.text}".`,
            actor: (get().currentUser?.name || 'Sistem'),
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
            description: `Butir revisi "${targetItemText}" ditandai ${isNowCompleted ? 'SELESAI DIPERBAIKI' : 'BELUM SELESAI'} oleh ${(get().currentUser?.name || 'Sistem')}.`,
            actor: (get().currentUser?.name || 'Sistem'),
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

      // SUBMIT REVISI PROPOSAL OLEH ORMAWA
      submitProposalRevision: (prokerId, fileInfo, changelogNotes = '') => {
        const todayStr = new Date().toISOString().split('T')[0];
        const proker = get().prokers.find(p => p.id === prokerId);
        if (!proker) return { success: false, message: 'Proker tidak ditemukan' };

        const ormawa = get().ormawas.find(o => o.id === proker.ormawaId);
        const ormawaName = ormawa?.name || proker.ormawaId.toUpperCase();
        const currentVersion = proker.proposal?.version || 1;
        const newVersion = currentVersion + 1;

        const newChangelogNote = {
          id: Date.now(),
          author: get().currentUser?.name || ormawaName,
          text: `[Revisi v${newVersion}] ${changelogNotes || 'Pengajuan berkas perbaikan proposal sesuai catatan DPM.'}`,
          date: todayStr,
          isChangelog: true
        };

        const existingNotes = proker.proposal?.notes || [];

        const updatedProposal = {
          ...proker.proposal,
          fileName: fileInfo?.name || `Proposal_Revisi_v${newVersion}_${proker.title.replace(/\s+/g, '_')}.pdf`,
          fileSize: fileInfo?.size || '2.8 MB',
          uploadDate: todayStr,
          reviewStatus: 'pending',
          version: newVersion,
          notes: [...existingNotes, newChangelogNote]
        };

        const newLog = createLogEntry({
          ormawaId: proker.ormawaId,
          type: 'proposal_revision_submitted',
          title: `Berkas Revisi Proposal Diunggah: ${proker.title} (v${newVersion})`,
          description: `${ormawaName} mengunggah berkas revisi proposal ke-${newVersion}. Catatan perbaikan: "${changelogNotes || 'Telah disesuaikan dengan checklist revisi DPM'}". Status dialihkan kembali ke antrean review DPM.`,
          actor: get().currentUser?.name || ormawaName,
          prokerTitle: proker.title,
          prokerId: proker.id,
          formattedDate: get().getFormattedDate()
        });

        const dpmNotif = {
          id: `notif-${Date.now()}`,
          title: `Revisi Proposal Masuk: ${proker.title}`,
          message: `${ormawaName} telah mengunggah revisi proposal (v${newVersion}) untuk ditinjau ulang DPM.`,
          time: 'Baru saja',
          date: get().getFormattedDate(),
          type: 'proposal_revised',
          targetOrmawaId: 'dpm',
          isRead: false,
          linkTab: 'proker',
          linkId: proker.id
        };

        set((state) => ({
          prokers: state.prokers.map(p => p.id === prokerId ? {
            ...p,
            status: 'proposal_pending',
            proposal: updatedProposal
          } : p),
          activityLogs: [newLog, ...state.activityLogs],
          notifications: [dpmNotif, ...state.notifications]
        }));

        return { success: true };
      },

      // SUBMIT REVISI LPJ OLEH ORMAWA
      submitLpjRevision: (prokerId, fileInfo, changelogNotes = '') => {
        const todayStr = new Date().toISOString().split('T')[0];
        const proker = get().prokers.find(p => p.id === prokerId);
        if (!proker) return { success: false, message: 'Proker tidak ditemukan' };

        const ormawa = get().ormawas.find(o => o.id === proker.ormawaId);
        const ormawaName = ormawa?.name || proker.ormawaId.toUpperCase();
        const currentVersion = proker.lpj?.version || 1;
        const newVersion = currentVersion + 1;

        const newChangelogNote = {
          id: Date.now(),
          author: get().currentUser?.name || ormawaName,
          text: `[Revisi LPJ v${newVersion}] ${changelogNotes || 'Perbaikan berkas LPJ dan kelengkapan bukti transaksi.'}`,
          date: todayStr,
          isChangelog: true
        };

        const existingNotes = proker.lpj?.notes || [];

        const updatedLpj = {
          ...proker.lpj,
          fileName: fileInfo?.name || `LPJ_Revisi_v${newVersion}_${proker.title.replace(/\s+/g, '_')}.pdf`,
          fileSize: fileInfo?.size || '5.5 MB',
          uploadDate: todayStr,
          reviewStatus: 'pending',
          version: newVersion,
          notes: [...existingNotes, newChangelogNote]
        };

        const newLog = createLogEntry({
          ormawaId: proker.ormawaId,
          type: 'lpj_revision_submitted',
          title: `Berkas Revisi LPJ Diunggah: ${proker.title}`,
          description: `${ormawaName} mengunggah berkas revisi LPJ. Catatan: "${changelogNotes}". Menunggu audit ulang DPM.`,
          actor: get().currentUser?.name || ormawaName,
          prokerTitle: proker.title,
          prokerId: proker.id,
          formattedDate: get().getFormattedDate()
        });

        const dpmNotif = {
          id: `notif-${Date.now()}`,
          title: `Revisi LPJ Masuk: ${proker.title}`,
          message: `${ormawaName} telah mengunggah revisi LPJ untuk diaudit kembali oleh DPM.`,
          time: 'Baru saja',
          date: get().getFormattedDate(),
          type: 'lpj_revised',
          targetOrmawaId: 'dpm',
          isRead: false,
          linkTab: 'proker',
          linkId: proker.id
        };

        set((state) => ({
          prokers: state.prokers.map(p => p.id === prokerId ? {
            ...p,
            status: 'lpj_pending',
            lpj: updatedLpj
          } : p),
          activityLogs: [newLog, ...state.activityLogs],
          notifications: [dpmNotif, ...state.notifications]
        }));

        return { success: true };
      },

      // 4. INSPEKSI LAPANGAN HARI-H DPM
      saveInspection: (prokerId, inspectionData) => {
        const todayStr = new Date().toISOString().split('T')[0];

        set((state) => {
          const proker = state.prokers.find(p => p.id === prokerId);
          if (!proker) return state;

          const inspectionObj = {
            inspected: true,
            inspectorName: (get().currentUser?.name || 'Sistem'),
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
            actor: (get().currentUser?.name || 'Sistem'),
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
            actor: (get().currentUser?.name || 'Sistem'),
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
            actor: (get().currentUser?.name || 'Sistem'),
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
          auditedBy: (get().currentUser?.name || 'Sistem'),
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
            actor: (get().currentUser?.name || 'Sistem'),
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
          status: 'active', // 'active' | 'clarification_submitted' | 'resolved'
          clarification: null,
          resolveNote: null,
          clarificationRejectNote: null,
          resolvedDate: null
        };

        const newLog = createLogEntry({
          ormawaId: spPayload.ormawaId,
          type: 'sp_issued',
          title: `Penerbitan ${spItem.title}`,
          description: `Ketua DPM menerbitkan ${spItem.title} dengan No: ${noSurat}. Alasan: ${spPayload.reason}`,
          actor: (get().currentUser?.name || 'Sistem'),
          formattedDate: get().getFormattedDate()
        });

        const spNotif = {
          id: `notif-${Date.now()}`,
          title: `Surat Peringatan ${spPayload.level} Diterbitkan!`,
          message: `DPM menerbitkan SP ${spPayload.level} untuk kegiatan "${spPayload.prokerTitle}". Segera berikan tanggapan / klarifikasi.`,
          time: 'Baru saja',
          date: get().getFormattedDate(),
          type: 'sp_issued',
          targetOrmawaId: spPayload.ormawaId,
          isRead: false,
          linkTab: 'sp',
          linkId: spItem.id
        };

        set((state) => ({
          suratPeringatan: [spItem, ...state.suratPeringatan],
          activityLogs: [newLog, ...state.activityLogs],
          notifications: [spNotif, ...state.notifications]
        }));

        return spItem;
      },

      // 8. RESOLVE SP LANGSUNG OLEH DPM
      resolveSP: (spId, noteText = 'SP ditandai terselesaikan oleh DPM') => {
        const todayStr = new Date().toISOString().split('T')[0];
        set((state) => ({
          suratPeringatan: state.suratPeringatan.map(s => s.id === spId ? { 
            ...s, 
            status: 'resolved',
            resolveNote: noteText,
            resolvedDate: todayStr
          } : s)
        }));
      },

      // SUBMIT KLARIFIKASI / TANGGAPAN SP OLEH ORMAWA
      submitSPClarification: (spId, clarificationData) => {
        const todayStr = new Date().toISOString().split('T')[0];
        const sp = get().suratPeringatan.find(s => s.id === spId);
        if (!sp) return { success: false, message: 'SP tidak ditemukan' };

        const clarificationObj = {
          text: clarificationData.text || '',
          fileName: clarificationData.fileName || 'Surat_Tanggapan_SP.pdf',
          fileSize: clarificationData.fileSize || '1.5 MB',
          targetDate: clarificationData.targetDate || '',
          date: todayStr,
          submittedBy: get().currentUser?.name || 'Pengurus Ormawa'
        };

        const newLog = createLogEntry({
          ormawaId: sp.ormawaId,
          type: 'sp_clarification_submitted',
          title: `Tanggapan SP Diajukan: ${sp.title}`,
          description: `${sp.ormawaName} mengajukan klarifikasi & tanggapan atas ${sp.title}. Catatan: "${clarificationObj.text}". Komitmen penyelesaian: ${clarificationObj.targetDate || '-'}.`,
          actor: clarificationObj.submittedBy,
          formattedDate: get().getFormattedDate()
        });

        const dpmNotif = {
          id: `notif-${Date.now()}`,
          title: `Tanggapan SP Masuk: ${sp.ormawaName}`,
          message: `${sp.ormawaName} mengajukan surat tanggapan/klarifikasi atas ${sp.title}. Menunggu evaluasi DPM.`,
          time: 'Baru saja',
          date: get().getFormattedDate(),
          type: 'sp_clarification',
          targetOrmawaId: 'dpm',
          isRead: false,
          linkTab: 'sp',
          linkId: sp.id
        };

        set((state) => ({
          suratPeringatan: state.suratPeringatan.map(s => s.id === spId ? {
            ...s,
            status: 'clarification_submitted',
            clarification: clarificationObj
          } : s),
          activityLogs: [newLog, ...state.activityLogs],
          notifications: [dpmNotif, ...state.notifications]
        }));

        return { success: true };
      },

      // REVIEW KLARIFIKASI SP OLEH DPM
      reviewSPClarification: (spId, { decision, reviewNotes }) => {
        const todayStr = new Date().toISOString().split('T')[0];
        const sp = get().suratPeringatan.find(s => s.id === spId);
        if (!sp) return { success: false, message: 'SP tidak ditemukan' };

        const reviewerName = get().currentUser?.name || 'Ketua DPM';
        const isAccepted = decision === 'approved';

        const newLog = createLogEntry({
          ormawaId: sp.ormawaId,
          type: isAccepted ? 'sp_resolved' : 'sp_clarification_rejected',
          title: isAccepted ? `SP Diselesaikan (Resolved): ${sp.title}` : `Tanggapan SP Ditolak DPM: ${sp.title}`,
          description: isAccepted 
            ? `DPM menerima klarifikasi dari ${sp.ormawaName}. SP No: ${sp.noSurat} resmi ditandai Terselesaikan. Catatan: "${reviewNotes || 'Sanksi dicabut dan evaluasi diterima.'}"`
            : `DPM menolak klarifikasi dari ${sp.ormawaName}. Alasan: "${reviewNotes}". Status SP tetap Aktif.`,
          actor: reviewerName,
          formattedDate: get().getFormattedDate()
        });

        const ormawaNotif = {
          id: `notif-${Date.now()}`,
          title: isAccepted ? `Klarifikasi SP Diterima DPM (Resolved)` : `Tanggapan SP Belum Diterima DPM`,
          message: isAccepted 
            ? `DPM telah menerima klarifikasi atas ${sp.title}. Status sanksi administratif telah diselesaikan.`
            : `DPM belum menerima tanggapan atas ${sp.title}. Catatan evaluasi: "${reviewNotes}". SP tetap berlaku aktif.`,
          time: 'Baru saja',
          date: get().getFormattedDate(),
          type: isAccepted ? 'sp_resolved' : 'sp_rejected',
          targetOrmawaId: sp.ormawaId,
          isRead: false,
          linkTab: 'sp',
          linkId: sp.id
        };

        set((state) => ({
          suratPeringatan: state.suratPeringatan.map(s => s.id === spId ? {
            ...s,
            status: isAccepted ? 'resolved' : 'active',
            resolveNote: isAccepted ? reviewNotes : s.resolveNote,
            clarificationRejectNote: !isAccepted ? reviewNotes : null,
            resolvedDate: isAccepted ? todayStr : s.resolvedDate
          } : s),
          activityLogs: [newLog, ...state.activityLogs],
          notifications: [ormawaNotif, ...state.notifications]
        }));

        return { success: true };
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
          author: newTemplate.author || (get().currentUser?.name || 'Sistem'),
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
              actor: (get().currentUser?.name || 'Sistem'),
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
                description: `Template "${target?.title || 'Dokumen'}" berhasil diperbarui oleh ${(get().currentUser?.name || 'Sistem')}.`,
                actor: (get().currentUser?.name || 'Sistem'),
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
                actor: (get().currentUser?.name || 'Sistem'),
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
          txMode: newTx.txMode || (['termin1', 'termin2', 'operasional', 'konsumsi_logistik', 'lainnya'].includes(newTx.type) ? 'pengeluaran' : 'pemasukan'),
          category: newTx.category || 'Dana Kemahasiswaan Fakultas',
          title: newTx.title || (newTx.txMode === 'pemasukan' ? 'Pemasukan Kas' : 'Pencairan Anggaran'),
          nominal,
          date: newTx.date || todayStr,
          pic: newTx.pic || (get().currentUser?.name || 'Sistem'),
          receiptNumber: newTx.receiptNumber || `KW-${Date.now().toString().slice(-6)}`,
          receiptPhoto: newTx.receiptPhoto || null,
          receiptPhotoName: newTx.receiptPhotoName || null,
          notes: newTx.notes || '',
          status: 'completed'
        };

        set((state) => {
          const updatedTransactions = [txItem, ...(state.budgetTransactions || [])];
          
          const isExpense = txItem.txMode === 'pengeluaran' || ['termin1', 'termin2', 'operasional', 'konsumsi_logistik', 'lainnya'].includes(txItem.type);

          const updatedOrmawas = state.ormawas.map(o => {
            if (o.id === newTx.ormawaId) {
              const additionalSerapan = isExpense ? nominal : 0;
              return {
                ...o,
                serapanAnggaran: (o.serapanAnggaran || 0) + additionalSerapan
              };
            }
            return o;
          });

          let updatedProkers = state.prokers;
          if (newTx.prokerId && isExpense) {
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
                title: `${txItem.txMode === 'pemasukan' ? 'Pemasukan Kas' : 'Pengeluaran Kas'} ${ormawa?.shortName || ''} Dicatat`,
                description: `${txItem.title}: Rp ${nominal.toLocaleString('id-ID')} (${txItem.category})`,
                actor: (get().currentUser?.name || 'Sistem'),
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

          const isExpense = tx.txMode === 'pengeluaran' || ['termin1', 'termin2', 'operasional', 'konsumsi_logistik', 'lainnya'].includes(tx.type);
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

      // 12. NOTIFIKASI INTERAKTIF ROLE-AWARE
      addNotification: (notif) => {
        set((state) => ({
          notifications: [{
            id: `notif-${Date.now()}`,
            time: 'Baru saja',
            date: get().getFormattedDate(),
            isRead: false,
            ...notif
          }, ...state.notifications]
        }));
      },

      markNotificationAsRead: (notifId) => {
        set((state) => ({
          notifications: state.notifications.map(n => n.id === notifId ? { ...n, isRead: true } : n)
        }));
      },

      markAllNotificationsAsRead: (targetOrmawaId) => {
        set((state) => ({
          notifications: state.notifications.map(n => {
            if (!targetOrmawaId || n.targetOrmawaId === targetOrmawaId || (targetOrmawaId !== 'dpm' && n.targetOrmawaId === 'all') || targetOrmawaId === 'dpm') {
              return { ...n, isRead: true };
            }
            return n;
          })
        }));
      },

      // Tracking read status for Histori Proker notification badge
      lastReadHistoryCount: 0,
      markHistoryAsRead: () => {
        const count = get().activityLogs.filter(l => l.type === 'proker_added' || l.type === 'proker_deleted').length;
        set({ lastReadHistoryCount: count });
      },

      // Tracking seen status for Template Dokumen notification badge
      hasSeenTemplateTab: false,
      markTemplateTabAsSeen: () => {
        set({ hasSeenTemplateTab: true });
      },

      // Reset data
      resetToDefaultData: () => {
        set({
          ormawas: INITIAL_ORMAWA,
          prokers: INITIAL_PROKER,
          suratPeringatan: INITIAL_SP,
          activityLogs: INITIAL_ACTIVITY_LOGS,
          templates: INITIAL_TEMPLATES,
          budgetTransactions: INITIAL_BUDGET_TRANSACTIONS,
          deletionRequests: [],
          notifications: [],
          users: INITIAL_USERS,
          pendingAccounts: INITIAL_PENDING_USERS,
          lastReadHistoryCount: 0,
          hasSeenTemplateTab: false
        });
      }
    }),
    {
      name: 'auditmawa-dpm-fasilkom-storage-v1',
      storage: createJSONStorage(() => ({
        getItem: (key) => {
          if (typeof window === 'undefined') return null;
          const val = localStorage.getItem(key);
          if (val) return val;
          const legacy = localStorage.getItem('siwasma-dpm-fasilkom-storage-v3');
          if (legacy) {
            localStorage.setItem(key, legacy);
            return legacy;
          }
          return null;
        },
        setItem: (key, val) => {
          if (typeof window !== 'undefined') localStorage.setItem(key, val);
        },
        removeItem: (key) => {
          if (typeof window !== 'undefined') localStorage.removeItem(key);
        }
      })),
      partialize: (state) => ({
        ormawas: state.ormawas,
        prokers: state.prokers,
        suratPeringatan: state.suratPeringatan,
        activityLogs: state.activityLogs,
        templates: state.templates,
        budgetTransactions: state.budgetTransactions,
        deletionRequests: state.deletionRequests,
        notifications: state.notifications,
        users: state.users,
        pendingAccounts: state.pendingAccounts,
        currentUser: state.currentUser,
        lastReadHistoryCount: state.lastReadHistoryCount,
        hasSeenTemplateTab: state.hasSeenTemplateTab
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...persistedState,
        users: (persistedState && Array.isArray(persistedState.users) && persistedState.users.length > 0)
          ? [
              ...persistedState.users,
              ...currentState.users.filter(u => !persistedState.users.some(pu => pu.username === u.username))
            ]
          : currentState.users,
        deletionRequests: (persistedState && Array.isArray(persistedState.deletionRequests))
          ? persistedState.deletionRequests
          : currentState.deletionRequests,
        notifications: (persistedState && Array.isArray(persistedState.notifications))
          ? persistedState.notifications
          : currentState.notifications,
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
