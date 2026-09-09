import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, User, AlertCircle, ArrowRight } from 'lucide-react';

export default function LoginView({ onSwitchToRegister }) {
  const { login } = useStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Mohon isi username dan password');
      return;
    }

    setLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      const result = login(username, password);
      if (!result.success) {
        setError(result.message);
      }
      setLoading(false);
    }, 600);
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

          {/* Top Left Icon */}
          <div className="relative z-10">
            <div className="w-9 h-9 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 6v12"/><path d="M17.196 9 6.804 15"/><path d="m6.804 9 10.392 6"/>
              </svg>
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
          
          {/* Top Asterisk Icon (like mockup) */}
          <div className="w-8 h-8 text-blue-600 mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 6v12"/><path d="M17.196 9 6.804 15"/><path d="m6.804 9 10.392 6"/>
            </svg>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Masuk ke Akun</h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              Akses dasbor pengawasan, pemantauan proker, dan administrasi ormawa dalam satu platform terpadu.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <p className="text-xs font-semibold text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-800 block">Username</label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 rounded-xl bg-white border-slate-200 focus-visible:ring-blue-600 focus-visible:border-blue-600 text-sm placeholder:text-slate-400 shadow-sm"
                placeholder="Masukkan username Anda"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-800 block">Kata Sandi</label>
              <div className="relative">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl bg-white border-slate-200 focus-visible:ring-blue-600 focus-visible:border-blue-600 text-sm placeholder:text-slate-400 shadow-sm pr-10"
                  placeholder="••••••••"
                />
              </div>
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
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => {
                    const res = login('admin', '123');
                    if (!res.success) setError(res.message);
                    setLoading(false);
                  }, 200);
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
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => {
                    const res = login('bem', '123');
                    if (!res.success) setError(res.message);
                    setLoading(false);
                  }, 200);
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
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => {
                    const res = login('himti', '123');
                    if (!res.success) setError(res.message);
                    setLoading(false);
                  }, 200);
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
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => {
                    const res = login('himsisfo', '123');
                    if (!res.success) setError(res.message);
                    setLoading(false);
                  }, 200);
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

          <div className="mt-6 text-center flex flex-col gap-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-slate-400 font-medium">SIWASMA FASILKOM UMB</span>
              </div>
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
    </div>
  );
}
