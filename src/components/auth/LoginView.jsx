import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  AlertCircle, 
  Globe, 
  Eye,
  EyeOff,
  ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';

const DPM_DEMO_ACCOUNTS = [
  { username: 'ketua', title: 'Ketua', sub: 'Pimpinan', badge: 'KT', badgeBg: 'bg-slate-900 text-white' },
  { username: 'wakil', title: 'Wakil', sub: 'Pimpinan', badge: 'WK', badgeBg: 'bg-slate-800 text-white' },
  { username: 'sekretaris', title: 'Sekretaris', sub: 'Kesekretariatan', badge: 'SK', badgeBg: 'bg-emerald-800 text-white' },
  { username: 'bendahara', title: 'Bendahara', sub: 'Kebendaharaan', badge: 'BD', badgeBg: 'bg-amber-800 text-white' },
  { username: 'pengawasan', title: 'Pengawasan', sub: 'Komisi I', badge: 'K1', badgeBg: 'bg-blue-800 text-white' },
  { username: 'keuangan', title: 'Keuangan', sub: 'Komisi II', badge: 'K2', badgeBg: 'bg-indigo-800 text-white' },
  { username: 'kominfo', title: 'Kominfo', sub: 'Komisi III', badge: 'K3', badgeBg: 'bg-purple-800 text-white' },
  { username: 'advokasi', title: 'Advokasi', sub: 'Komisi IV', badge: 'K4', badgeBg: 'bg-teal-800 text-white' }
];

export default function LoginView({ onSwitchToRegister, notice, onClearNotice }) {
  const { login, directLogin, loginAsGuest } = useStore(useShallow(state => ({ 
    login: state.login, 
    directLogin: state.directLogin,
    loginAsGuest: state.loginAsGuest
  })));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

  const handleDemoLogin = async (demoUsername) => {
    setLoading(true);
    setError('');
    try {
      const res = await login(demoUsername, '123');
      if (!res?.success) {
        // Fallback langsung ke directLogin jika ada kendala jaringan / DB
        const directRes = directLogin(demoUsername);
        if (!directRes?.success) {
          setError(res?.message || directRes?.message);
        }
      }
    } catch {
      directLogin(demoUsername);
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
            <h2 className="text-2xl lg:text-3xl font-extrabold leading-tight tracking-tight text-white">
              Sistem Informasi<br />
              Audit Ormawa Fasilkom UMB
            </h2>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full flex-1 flex flex-col justify-center px-3 sm:px-8 lg:px-12 py-5 sm:py-6">
          <div className="mb-2">
            <Link 
              to="/" 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors py-1 group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Kembali ke Website Publik</span>
            </Link>
          </div>

          <div className="mb-5 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-1.5 sm:mb-2">Portal Pengurus</h1>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              Khusus pengurus DPM dan ormawa untuk mengelola proker, audit LPJ, dan administrasi anggaran.
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
                <span className="text-xs text-slate-400 font-mono">Demo: 123</span>
              </div>
              <div className="relative flex items-center">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn(
                    "h-12 rounded-xl bg-white text-sm placeholder:text-slate-400 transition-all pr-11",
                    showPasswordError
                      ? "border-rose-400 ring-2 ring-rose-100 text-rose-950 focus-visible:ring-rose-200 focus-visible:border-rose-500 bg-rose-50/15"
                      : "border-slate-200 focus-visible:ring-blue-600 focus-visible:border-blue-600 shadow-sm"
                  )}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                  title={showPassword ? "Sembunyikan sandi" : "Lihat sandi"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
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
              className="w-full h-12 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 transition-all mt-4 cursor-pointer active:scale-98"
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
                Akses Cepat Komisi DPM (1-Klik)
              </span>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100/70 border border-amber-300 px-2 py-0.5 rounded-full">
                Mode Demo
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DPM_DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.username}
                  type="button"
                  onClick={() => handleDemoLogin(acc.username)}
                  className="flex items-center gap-2 p-2 sm:p-2.5 min-h-[44px] rounded-xl bg-white border border-slate-200 hover:border-slate-800 hover:bg-slate-900 hover:text-white transition shadow-2xs group text-left cursor-pointer active:scale-95"
                >
                  <div className={cn(
                    "w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[10px] shrink-0 group-hover:bg-white group-hover:text-slate-900 transition-colors",
                    acc.badgeBg
                  )}>
                    {acc.badge}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate leading-tight">{acc.title}</p>
                    <p className="text-[10px] text-slate-400 group-hover:text-slate-300 truncate leading-tight">{acc.sub}</p>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-2 italic">
              *Klik komisi untuk langsung mencoba wewenang dan batasan fiturnya (sandi demo: 123).
            </p>
          </div>

          {/* Akses Pengunjung / Publik Tanpa Login */}
          <div className="mt-4 p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-center space-y-1.5">
            <p className="text-xs font-bold text-slate-700">
              Bukan pengurus atau ingin melihat transparansi publik?
            </p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Pengunjung umum dapat langsung menjelajahi dashboard, daftar proker, audit, dan struktur organisasi tanpa perlu login.
            </p>
            <div className="pt-1">
              <Link
                to="/"
                className="w-full min-h-[40px] py-2 px-3 rounded-xl border border-blue-200 bg-white hover:bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-2xs group"
              >
                <Globe className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition-transform" />
                <span>Buka Website Publik DPM (Tanpa Login)</span>
              </Link>
            </div>
          </div>

          <div className="mt-5 text-center">
            <p className="text-sm text-slate-500 font-medium">
              Belum memiliki akun pengurus?{' '}
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
    </div>
  );
}
