import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Shield, 
  KeyRound, 
  Building2, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle,
  Lock,
  Save
} from 'lucide-react';

export default function ProfileModal({ isOpen, onClose }) {
  const { currentUser, updateUserProfile, changeUserPassword, ormawas } = useStore(useShallow(state => ({ currentUser: state.currentUser, updateUserProfile: state.updateUserProfile, changeUserPassword: state.changeUserPassword, ormawas: state.ormawas })));
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'password'

  // Profile Form States
  const [name, setName] = useState(currentUser?.name || '');
  const [nim, setNim] = useState(currentUser?.nim || '');
  const [profileSuccess, setProfileSuccess] = useState('');

  // Password Form States
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  if (!currentUser) return null;

  const ormawa = ormawas.find(o => o.id === currentUser.ormawaId);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setProfileSuccess('');

    updateUserProfile(currentUser.id, {
      name: name.trim(),
      nim: nim.trim()
    });

    setProfileSuccess('Profil berhasil diperbarui!');
    setTimeout(() => setProfileSuccess(''), 3000);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('Konfirmasi password baru tidak cocok.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = changeUserPassword(currentUser.id, oldPassword, newPassword);
      setLoading(false);

      if (res.success) {
        setPasswordSuccess(res.message);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordError(res.message);
      }
    }, 400);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-md p-0 overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-2xl max-h-[88vh] flex flex-col">
        <DialogHeader className="px-5 sm:px-6 pt-4 pb-3 border-b border-slate-100 bg-slate-50/70 space-y-1 shrink-0">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200 text-[10px] font-bold uppercase tracking-wider">
              {currentUser.ormawaId.toUpperCase()} • {currentUser.role.toUpperCase()}
            </Badge>
          </div>
          <DialogTitle className="text-sm sm:text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Profil Pengurus &amp; Keamanan</span>
          </DialogTitle>
          <DialogDescription className="text-[11px] text-slate-500">
            Kelola data diri pengurus serta keamanan akun SIWASMA DPM FASILKOM.
          </DialogDescription>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 px-5 sm:px-6 pt-2 gap-4 shrink-0 bg-white">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`pb-2 text-xs font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Informasi Akun</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('password')}
            className={`pb-2 text-xs font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'password'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Ganti Password</span>
          </button>
        </div>

        <div className="p-4 sm:p-5 overflow-y-auto flex-1">
          {activeTab === 'profile' ? (
            <form onSubmit={handleUpdateProfile} className="space-y-3.5">
              {profileSuccess && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{profileSuccess}</span>
                </div>
              )}

              {/* Avatar & Role Header */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-600 text-white font-extrabold text-sm sm:text-base flex items-center justify-center shadow-xs shrink-0">
                  {currentUser.name?.substring(0, 2).toUpperCase() || 'US'}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{currentUser.name}</h4>
                  <p className="text-[11px] text-slate-500 font-medium truncate">Username: <span className="font-mono text-slate-800">{currentUser.username}</span></p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider">
                      Akun Terverifikasi DPM
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block">Nama Lengkap</label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-9 sm:h-10 text-xs rounded-xl"
                  placeholder="Nama Lengkap Pengurus"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block">Nomor Induk Mahasiswa (NIM)</label>
                <Input
                  type="text"
                  value={nim}
                  onChange={(e) => setNim(e.target.value)}
                  className="h-9 sm:h-10 text-xs rounded-xl"
                  placeholder="NIM Mahasiswa"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-0.5">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Ormawa Naungan</span>
                  <span className="text-xs font-bold text-slate-800 truncate block">{ormawa?.shortName || ormawa?.name || currentUser.ormawaId.toUpperCase()}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Jabatan / Role</span>
                  <span className="text-xs font-bold text-slate-800 capitalize truncate block">{currentUser.role}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  size="sm"
                  className="rounded-xl h-9 sm:h-10 px-4 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5 mr-1.5" />
                  <span>Simpan Perubahan</span>
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-3">
              {passwordError && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordSuccess && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block">Password Saat Ini</label>
                <Input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="h-9 sm:h-10 text-xs rounded-xl"
                  placeholder="Masukkan password saat ini"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block">Password Baru</label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-9 sm:h-10 text-xs rounded-xl"
                  placeholder="Minimal 3 karakter"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block">Konfirmasi Password Baru</label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-9 sm:h-10 text-xs rounded-xl"
                  placeholder="Ulangi password baru"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  disabled={loading}
                  size="sm"
                  className="rounded-xl h-9 sm:h-10 px-4 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer"
                >
                  {loading ? 'Menyimpan...' : (
                    <div className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Perbarui Password</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
