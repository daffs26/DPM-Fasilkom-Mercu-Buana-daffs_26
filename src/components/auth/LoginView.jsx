import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Lock, 
  AlertCircle, 
  Globe, 
  Search, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ArrowRight, 
  UserCheck,
  KeyRound,
  Download,
  Check
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { authService } from '@/services/authService';
import { downloadReceiptAsPng } from '@/utils/generateReceiptImage';

export default function LoginView({ onSwitchToRegister, notice, onClearNotice }) {
  const { login, loginAsGuest, ormawas, resetPasswordWithTicket } = useStore(useShallow(state => ({ 
    login: state.login, 
    loginAsGuest: state.loginAsGuest,
    ormawas: state.ormawas,
    resetPasswordWithTicket: state.resetPasswordWithTicket
  })));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // State untuk Cek Status Pengajuan Akun
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusQuery, setStatusQuery] = useState('');
  const [statusResult, setStatusResult] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState('');

  // State untuk Modal Lupa Kata Sandi (NIM + Nomor Tiket)
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetNim, setResetNim] = useState('');
  const [resetTicket, setResetTicket] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  const handleResetPassword = async (e) => {
    e?.preventDefault();
    setResetError('');
    setResetSuccess('');

    if (!resetNim || !resetNim.trim()) {
      setResetError('Mohon masukkan NIM Anda.');
      return;
    }

    if (!resetTicket || !resetTicket.trim()) {
      setResetError('Mohon masukkan Nomor Tiket pendaftaran Anda.');
      return;
    }

    if (!resetPassword || resetPassword.length < 6) {
      setResetError('Kata sandi baru minimal 6 karakter demi keamanan akun.');
      return;
    }

    if (resetPassword !== resetConfirmPassword) {
      setResetError('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    setResetLoading(true);
    try {
      const res = await resetPasswordWithTicket({
        nim: resetNim.trim(),
        ticketNumber: resetTicket.trim(),
        newPassword: resetPassword,
      });

      if (res && res.success) {
        setResetSuccess(res.message || 'Kata sandi berhasil diperbarui! Silakan masuk dengan kata sandi baru Anda.');
        setUsername(resetNim.trim());
        setPassword(resetPassword);
        setTimeout(() => {
          setIsResetModalOpen(false);
        }, 2200);
      } else {
        setResetError(res?.message || 'Gagal memproses permohonan. Pastikan NIM dan Nomor Tiket sesuai.');
      }
    } catch (err) {
      console.error('[LoginView] Error reset password:', err);
      setResetError('Terjadi kendala saat mereset kata sandi. Silakan periksa koneksi Anda.');
    } finally {
      setResetLoading(false);
    }
  };

  const handleCheckStatus = async (e) => {
    e?.preventDefault();
    if (!statusQuery || statusQuery.trim().length < 3) {
      setStatusError('Masukkan minimal 3 karakter username atau NIM.');
      return;
    }
    setStatusLoading(true);
    setStatusError('');
    setStatusResult(null);
    try {
      const res = await authService.checkAccountStatus(statusQuery.trim());
      if (res && res.found) {
        setStatusResult(res);
      } else {
        setStatusError(res?.message || 'Pengajuan akun dengan username atau NIM tersebut tidak ditemukan.');
      }
    } catch (err) {
      console.error('[LoginView] Error check status:', err);
      setStatusError('Terjadi kendala koneksi saat memeriksa status.');
    } finally {
      setStatusLoading(false);
    }
  };

  const isNumericOnly = /^\d+$/.test(username.trim());

  const getUsernameError = (val) => {
    if (!val && submitted) return 'Mohon masukkan username atau NIM Anda';
    if (/\s/.test(val)) return 'Username atau NIM tidak boleh mengandung spasi';
    return '';
  };

  const getPasswordError = (val) => {
    if (!val && submitted) return 'Mohon masukkan kata sandi Anda';
    return '';
  };

  const usernameError = getUsernameError(username);
  const passwordError = getPasswordError(password);

  const showUsernameError = (username.length > 0 && Boolean(usernameError)) || (submitted && Boolean(usernameError));
  const showPasswordError = submitted && Boolean(passwordError);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitted(true);
    onClearNotice?.();
    
    const cleanIdentifier = username.trim();
    if (!cleanIdentifier || !password || usernameError || passwordError) {
      return;
    }

    setLoading(true);
    try {
      const result = await login(cleanIdentifier, password);
      if (!result.success) {
        setError(result.message);
      }
    } catch (err) {
      console.error('[LoginView] Error:', err);
      setError('Terjadi kendala saat login. Silakan periksa koneksi Anda dan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#f3f4f9] p-4 sm:p-6 lg:p-8">
      {/* Mobile Background: UMB Building Photo */}
      <div className="fixed inset-0 z-0 md:hidden overflow-hidden pointer-events-none">
        <img 
          src="/umb-building.jpg" 
          alt="Universitas Mercu Buana" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl lg:max-w-5xl bg-white/95 md:bg-white backdrop-blur-md md:backdrop-blur-none rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border border-white/40 md:border-slate-100 overflow-hidden flex flex-col md:flex-row p-3 sm:p-4 gap-4 md:gap-8 items-center justify-center">
        
        {/* Left Side: UMB Image with Original 9:16 Ratio (No Crop) */}
        <div className="relative w-full md:w-[340px] lg:w-[365px] shrink-0 aspect-[9/16] rounded-[2rem] overflow-hidden hidden md:flex flex-col justify-between p-6 lg:p-8 text-white">
          {/* Background Image & Gradient */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/umb-building.jpg" 
              alt="Universitas Mercu Buana" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-black/20 to-slate-950/40"></div>
          </div>

          {/* Top Left Logo */}
          <div className="relative z-10">
            <div className="w-11 h-11 rounded-2xl bg-white/95 backdrop-blur-xs border border-white/40 p-1.5 flex items-center justify-center shadow-lg">
              <img src="/logos/logo-dpm.png" alt="DPM FASILKOM UMB" className="w-full h-full object-contain" />
            </div>
          </div>

          {/* Bottom Left Text */}
          <div className="relative z-10 mt-auto pt-16">
            <p className="text-white/80 text-xs sm:text-sm font-medium mb-2">Sistem Informasi Pengawasan</p>
            <h2 className="text-2xl lg:text-3xl font-extrabold leading-tight tracking-tight text-white">
              Pusat Kendali &<br />
              Pengawasan Ormawa<br />
              Fasilkom UMB
            </h2>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full flex-1 flex flex-col justify-center px-4 sm:px-8 lg:px-12 py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Masuk ke Akun</h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              Akses dasbor pengawasan, pemantauan proker, dan administrasi ormawa dalam satu platform terpadu.
            </p>
          </div>

          {notice && (
            <div className="mb-5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-amber-900 text-xs">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium leading-snug">{notice}</div>
            </div>
          )}

          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <p className="text-xs font-semibold text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className={cn(
                "text-sm font-semibold block transition-colors",
                showUsernameError ? "text-rose-500" : "text-slate-800"
              )}>
                Username atau NIM
              </label>
              <div className="relative flex items-center">
                <span className={cn(
                  "absolute left-3 flex items-center justify-center select-none transition-colors",
                  showUsernameError ? "text-rose-400" : "text-slate-400"
                )}>
                  {isNumericOnly ? (
                    <span className="font-bold text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded tracking-wide">
                      NIM
                    </span>
                  ) : (
                    <span className="font-bold text-sm">@</span>
                  )}
                </span>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  className={cn(
                    "h-12 rounded-xl bg-white text-sm placeholder:text-slate-400 transition-all",
                    isNumericOnly ? "pl-12" : "pl-8",
                    showUsernameError
                      ? "border-rose-400 ring-2 ring-rose-100 text-rose-950 focus-visible:ring-rose-200 focus-visible:border-rose-500 bg-rose-50/15"
                      : "border-slate-200 focus-visible:ring-blue-600 focus-visible:border-blue-600 shadow-sm"
                  )}
                  placeholder="Ketik username atau NIM Anda..."
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                />
              </div>
              {showUsernameError && (
                <p className="text-[12px] text-rose-500 font-medium mt-1 leading-tight animate-in fade-in duration-150">
                  {usernameError}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className={cn(
                  "text-sm font-semibold block transition-colors",
                  showPasswordError ? "text-rose-500" : "text-slate-800"
                )}>
                  Kata Sandi
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsResetModalOpen(true);
                    setResetNim(username || '');
                    setResetTicket('');
                    setResetPassword('');
                    setResetConfirmPassword('');
                    setResetError('');
                    setResetSuccess('');
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold hover:underline cursor-pointer"
                >
                  Lupa Kata Sandi?
                </button>
              </div>
              <div className="relative">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn(
                    "h-12 rounded-xl bg-white text-sm placeholder:text-slate-400 transition-all pr-10",
                    showPasswordError
                      ? "border-rose-400 ring-2 ring-rose-100 text-rose-950 focus-visible:ring-rose-200 focus-visible:border-rose-500 bg-rose-50/15"
                      : "border-slate-200 focus-visible:ring-blue-600 focus-visible:border-blue-600 shadow-sm"
                  )}
                  placeholder="••••••••"
                />
              </div>
              {showPasswordError && (
                <p className="text-[12px] text-rose-500 font-medium mt-1 leading-tight animate-in fade-in duration-150">
                  {passwordError}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 transition-all mt-4"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Memverifikasi...</span>
                </div>
              ) : (
                <span>Masuk ke Sistem</span>
              )}
            </Button>
          </form>

          {/* Section: Direct Demo Login (1-Klik) */}
          <div className="mt-5 p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <span className="text-[11px] font-extrabold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                Akses Demo 1-Klik
              </span>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100/70 border border-amber-300 px-2 py-0.5 rounded-full">
                Mode Uji Coba
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={async () => {
                  setLoading(true);
                  setError('');
                  try {
                    const res = await login('admin', '123');
                    if (!res.success) setError(res.message);
                  } finally {
                    setLoading(false);
                  }
                }}
                className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 hover:border-slate-800 hover:bg-slate-900 hover:text-white transition shadow-2xs group text-left cursor-pointer"
              >
                <div className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0 group-hover:bg-white group-hover:text-slate-900">
                  DPM
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate">DPM Ketua</p>
                  <p className="text-[10px] text-slate-400 group-hover:text-slate-300">Legislatif</p>
                </div>
              </button>

              <button
                type="button"
                onClick={async () => {
                  setLoading(true);
                  setError('');
                  try {
                    const res = await login('bem', '123');
                    if (!res.success) setError(res.message);
                  } finally {
                    setLoading(false);
                  }
                }}
                className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 hover:border-sky-500 hover:bg-sky-600 hover:text-white transition shadow-2xs group text-left cursor-pointer"
              >
                <div className="w-6 h-6 rounded-lg bg-sky-500 text-white flex items-center justify-center font-bold text-[10px] shrink-0 group-hover:bg-white group-hover:text-sky-600">
                  BEM
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate">BEM Fasilkom</p>
                  <p className="text-[10px] text-slate-400 group-hover:text-sky-100">Eksekutif</p>
                </div>
              </button>

              <button
                type="button"
                onClick={async () => {
                  setLoading(true);
                  setError('');
                  try {
                    const res = await login('himti', '123');
                    if (!res.success) setError(res.message);
                  } finally {
                    setLoading(false);
                  }
                }}
                className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 hover:border-blue-900 hover:bg-blue-950 hover:text-white transition shadow-2xs group text-left cursor-pointer"
              >
                <div className="w-6 h-6 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0 group-hover:bg-white group-hover:text-blue-950">
                  TI
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate">HiMTI</p>
                  <p className="text-[10px] text-slate-400 group-hover:text-blue-200">Teknik Informatika</p>
                </div>
              </button>

              <button
                type="button"
                onClick={async () => {
                  setLoading(true);
                  setError('');
                  try {
                    const res = await login('himsisfo', '123');
                    if (!res.success) setError(res.message);
                  } finally {
                    setLoading(false);
                  }
                }}
                className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 hover:border-amber-800 hover:bg-amber-900 hover:text-white transition shadow-2xs group text-left cursor-pointer"
              >
                <div className="w-6 h-6 rounded-lg bg-amber-800 text-white flex items-center justify-center font-bold text-[10px] shrink-0 group-hover:bg-white group-hover:text-amber-900">
                  SI
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate">HIMSISFO</p>
                  <p className="text-[10px] text-slate-400 group-hover:text-amber-200">Sistem Informasi</p>
                </div>
              </button>
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-2 italic">
              *Akses instan ini akan dihapus otomatis setelah integrasi database.
            </p>
          </div>

          {/* Akses Tamu Publik (Mode Transparansi Ormawa) */}
          <div className="mt-3.5">
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  loginAsGuest();
                  setLoading(false);
                }, 200);
              }}
              className="w-full py-2.5 px-3 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100/80 text-blue-800 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-2xs group cursor-pointer hover:border-blue-300"
            >
              <Globe className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
              <span>Eksplorasi Transparansi (Masuk sebagai Tamu Publik)</span>
            </button>
            <p className="text-[10px] text-slate-400 text-center mt-1">
              Akses terbuka untuk mahasiswa & umum memantau akuntabilitas tanpa login.
            </p>
          </div>

          <div className="mt-6 text-center flex flex-col gap-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-slate-400 font-medium">Bantuan &amp; Pendaftaran</span>
              </div>
            </div>

            <div className="flex items-center justify-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsStatusModalOpen(true);
                  setStatusQuery(username || '');
                  setStatusResult(null);
                  setStatusError('');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-blue-700 font-bold text-xs transition cursor-pointer active:scale-95 shadow-2xs"
              >
                <Search className="w-3.5 h-3.5 text-blue-600" />
                <span>Cek Status Pengajuan Akun</span>
              </button>
            </div>
            
            <p className="text-sm text-slate-500 font-medium">
              Belum memiliki akun?{' '}
              <button 
                type="button" 
                onClick={onSwitchToRegister}
                className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-colors cursor-pointer"
              >
                Daftar sekarang
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Modal Cek Status Pendaftaran Akun */}
      <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
        <DialogContent className="w-[95vw] sm:max-w-md p-0 overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xl">
          <DialogHeader className="px-5 pt-5 pb-3 border-b border-slate-100 bg-slate-50/60 space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold">
                AUDITMAWA TRACKER
              </span>
            </div>
            <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Pelacakan Status Akun Pengurus
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Ketikkan Username atau NIM Anda untuk memeriksa status verifikasi secara real-time.
            </DialogDescription>
          </DialogHeader>

          <div className="p-5 space-y-4">
            <form onSubmit={handleCheckStatus} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  value={statusQuery}
                  onChange={(e) => setStatusQuery(e.target.value)}
                  placeholder="Ketik Username atau NIM..."
                  className="pl-9 h-11 rounded-xl text-xs bg-slate-50 focus:bg-white"
                />
              </div>
              <Button
                type="submit"
                disabled={statusLoading}
                className="h-11 px-4 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white text-xs shrink-0 cursor-pointer shadow-md shadow-blue-500/20"
              >
                {statusLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>Periksa</span>
                )}
              </Button>
            </form>

            {statusError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{statusError}</span>
              </div>
            )}

            {statusResult && (
              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-2xs animate-in fade-in zoom-in-95">
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{statusResult.name}</h4>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      {statusResult.nim} • @{statusResult.username}
                    </p>
                  </div>
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wide uppercase flex items-center gap-1 shrink-0",
                    statusResult.status === 'approved' && "bg-emerald-100 text-emerald-800 border border-emerald-300",
                    statusResult.status === 'pending' && "bg-amber-100 text-amber-800 border border-amber-300",
                    statusResult.status === 'rejected' && "bg-rose-100 text-rose-800 border border-rose-300"
                  )}>
                    {statusResult.status === 'approved' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                    {statusResult.status === 'pending' && <Clock className="w-3 h-3 text-amber-600 animate-spin" />}
                    {statusResult.status === 'rejected' && <XCircle className="w-3 h-3 text-rose-600" />}
                    {statusResult.status === 'approved' ? 'Disetujui' : statusResult.status === 'rejected' ? 'Ditolak' : 'Menunggu ACC'}
                  </span>
                </div>

                {statusResult.ticket_number && (
                  <div className="text-[11px] text-slate-500 flex justify-between bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <span className="text-slate-400">No. Tiket:</span>
                    <span className="font-mono font-bold text-blue-600">{statusResult.ticket_number}</span>
                  </div>
                )}

                <div className="text-xs leading-relaxed">
                  {statusResult.status === 'pending' && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] space-y-1">
                      <p className="font-bold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        Sedang Dalam Antrean Verifikasi DPM
                      </p>
                      <p className="text-amber-800">
                        Pengajuan akun kepengurusan {(statusResult.ormawa_id || '').toUpperCase()} Anda sedang ditinjau oleh pimpinan DPM FASILKOM UMB. Anda akan dapat masuk setelah diverifikasi.
                      </p>
                    </div>
                  )}

                  {statusResult.status === 'approved' && (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-[11px] space-y-2">
                      <p className="font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Akun Anda Telah Aktif!
                      </p>
                      <p className="text-emerald-800">
                        Pimpinan DPM telah menyetujui akun Anda. Silakan masuk menggunakan kata sandi yang Anda buat saat pendaftaran.
                      </p>
                      <Button
                        type="button"
                        onClick={() => {
                          setUsername(statusResult.username);
                          setIsStatusModalOpen(false);
                        }}
                        className="w-full h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-sm"
                      >
                        <UserCheck className="w-3.5 h-3.5 mr-1.5" />
                        <span>Gunakan Akun Ini untuk Masuk</span>
                      </Button>
                    </div>
                  )}

                  {statusResult.status === 'rejected' && (
                    <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-900 text-[11px] space-y-1">
                      <p className="font-bold flex items-center gap-1.5">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        Pengajuan Ditolak oleh Pimpinan DPM
                      </p>
                      <p className="text-rose-800">
                        <strong>Alasan:</strong> {statusResult.rejection_reason || 'Data kepengurusan tidak valid atau tidak memenuhi kualifikasi.'}
                      </p>
                      <p className="text-rose-700 text-[10px] pt-1">
                        Silakan hubungi narahubung resmi DPM FASILKOM jika ini merupakan kekeliruan.
                      </p>
                    </div>
                  )}

                  {/* Tombol Unduh PNG Kartu Tanda Terima */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => downloadReceiptAsPng({
                      ticketNumber: statusResult.ticket_number,
                      name: statusResult.name,
                      nim: statusResult.nim,
                      ormawaId: statusResult.ormawa_id,
                      role: statusResult.role,
                      username: statusResult.username,
                      status: statusResult.status,
                      createdAt: statusResult.created_at,
                    })}
                    className="w-full h-9 rounded-xl border-blue-200 text-blue-700 hover:bg-blue-50 font-bold text-xs cursor-pointer shadow-2xs flex items-center justify-center gap-1.5 mt-2"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-600" />
                    <span>Unduh Kartu Tanda Terima (PNG)</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Pemulihan Kata Sandi Mandiri (NIM + Nomor Tiket) */}
      <Dialog open={isResetModalOpen} onOpenChange={setIsResetModalOpen}>
        <DialogContent className="w-[95vw] sm:max-w-md p-0 overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xl">
          <DialogHeader className="px-5 pt-5 pb-3 border-b border-slate-100 bg-slate-50/60 space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold">
                AUDITMAWA RECOVERY
              </span>
            </div>
            <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-blue-600" />
              <span>Pemulihan Kata Sandi Akun</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Ketikkan NIM dan Nomor Tiket pendaftaran Anda untuk mereset kata sandi secara instan tanpa perlu email.
            </DialogDescription>
          </DialogHeader>

          <div className="p-5 space-y-4">
            {resetSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-2 animate-in fade-in">
                <p className="font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Kata Sandi Berhasil Diperbarui!</span>
                </p>
                <p className="text-emerald-800 leading-relaxed">
                  {resetSuccess} Mengalihkan ke halaman masuk...
                </p>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-3.5">
                {resetError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{resetError}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">NIM Pengurus</label>
                  <Input
                    type="text"
                    value={resetNim}
                    onChange={(e) => setResetNim(e.target.value.replace(/\D/g, ''))}
                    placeholder="Masukkan NIM Anda"
                    className="h-10 text-xs rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 block">Nomor Tiket Registrasi</label>
                    <span className="text-[10px] text-blue-600 font-medium">Kunci Pemulihan</span>
                  </div>
                  <Input
                    type="text"
                    value={resetTicket}
                    onChange={(e) => setResetTicket(e.target.value.toUpperCase().trim())}
                    placeholder="Contoh: REG-BEM-20261004-8921"
                    className="h-10 text-xs font-mono rounded-xl uppercase tracking-wider"
                  />
                  <p className="text-[10px] text-slate-400 leading-tight">
                    *Lihat nomor tiket pada berkas gambar PNG atau salinan pendaftaran Anda.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">Kata Sandi Baru</label>
                  <Input
                    type="password"
                    value={resetPassword}
                    onChange={(e) => setResetPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="h-10 text-xs rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">Konfirmasi Kata Sandi Baru</label>
                  <Input
                    type="password"
                    value={resetConfirmPassword}
                    onChange={(e) => setResetConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi baru"
                    className="h-10 text-xs rounded-xl"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full h-11 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white text-xs cursor-pointer shadow-md shadow-blue-500/20 mt-2"
                >
                  {resetLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Memproses Pembaruan...</span>
                    </div>
                  ) : (
                    <span>Simpan Kata Sandi Baru</span>
                  )}
                </Button>

                <div className="pt-2 border-t border-slate-100 text-center">
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Kehilangan bukti nomor tiket Anda?{' '}
                    <span className="text-slate-600 font-semibold">
                      Silakan hubungi pimpinan DPM di sekretariat kampus untuk verifikasi fisik.
                    </span>
                  </p>
                </div>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
