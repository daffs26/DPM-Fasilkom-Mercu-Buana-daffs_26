import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Lock, Building2, BadgeCheck, ArrowLeft, Send } from 'lucide-react';
import DropdownSelect from '@/components/ui/dropdown-select';

export default function RegisterView({ onSwitchToLogin }) {
  const { ormawas, register } = useStore(useShallow(state => ({ ormawas: state.ormawas, register: state.register })));
  
  const [name, setName] = useState('');
  const [nim, setNim] = useState('');
  const [ormawaId, setOrmawaId] = useState('');
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const ORMAWA_OPTIONS = ormawas.map(o => ({ value: o.id, label: o.shortName }));
  
  const ROLE_OPTIONS = [
    { value: 'ketua', label: 'Ketua Umum' },
    { value: 'wakil', label: 'Wakil Ketua' },
    { value: 'sekre', label: 'Sekretaris' },
    { value: 'bendahara', label: 'Bendahara / Komisi Keuangan' }
  ];

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');

    if (!name || !nim || !ormawaId || !role || !username || !password) {
      setError('Mohon lengkapi semua data pendaftaran.');
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      const result = register(name, nim, ormawaId, role, username, password);
      setLoading(false);
      
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.message);
      }
    }, 600);
  };

  if (success) {
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

        <div className="relative z-10 w-full max-w-4xl lg:max-w-5xl h-[500px] sm:h-[540px] md:h-auto bg-white/95 md:bg-white backdrop-blur-md md:backdrop-blur-none rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border border-white/40 md:border-slate-100 overflow-hidden flex flex-col md:flex-row p-3 sm:p-4 gap-4 md:gap-8 items-center justify-center">
          
          {/* Left Side: UMB Image with Original 9:16 Ratio (No Crop) */}
          <div className="relative w-full md:w-[340px] lg:w-[365px] shrink-0 aspect-[9/16] rounded-[2rem] overflow-hidden hidden md:flex flex-col justify-between p-6 lg:p-8 text-white">
            <div className="absolute inset-0 z-0">
              <img 
                src="/umb-building.jpg" 
                alt="Universitas Mercu Buana" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-black/20 to-slate-950/40"></div>
            </div>

            <div className="relative z-10">
              <div className="w-9 h-9 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 6v12"/><path d="M17.196 9 6.804 15"/><path d="m6.804 9 10.392 6"/>
                </svg>
              </div>
            </div>

            <div className="relative z-10 mt-auto pt-16">
              <p className="text-white/80 text-xs sm:text-sm font-medium mb-2">Sistem Informasi Pengawasan</p>
              <h2 className="text-2xl lg:text-3xl font-extrabold leading-tight tracking-tight text-white">
                Pusat Kendali &<br />
                Pengawasan Ormawa<br />
                Fasilkom UMB
              </h2>
            </div>
          </div>

          <div className="w-full flex-1 flex flex-col justify-center items-center text-center px-6 sm:px-10 lg:px-12 py-8">
            <div className="w-20 h-20 mx-auto bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
              <BadgeCheck className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Pendaftaran Berhasil</h2>
            <p className="text-slate-600 text-sm mb-8 leading-relaxed max-w-sm">
              Akun Anda berhasil didaftarkan dan sedang <strong className="text-slate-900 font-bold">Menunggu Persetujuan (ACC)</strong> dari Ketua/Wakil DPM. Anda dapat login setelah akun Anda diverifikasi.
            </p>
            <Button 
              onClick={onSwitchToLogin}
              className="w-full max-w-xs h-12 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 text-sm transition-all"
            >
              Kembali ke Halaman Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

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

      <div className="relative z-10 w-full max-w-4xl lg:max-w-5xl h-[500px] sm:h-[540px] md:h-auto bg-white/95 md:bg-white backdrop-blur-md md:backdrop-blur-none rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border border-white/40 md:border-slate-100 overflow-hidden flex flex-col md:flex-row p-3 sm:p-4 gap-4 md:gap-8 items-center justify-center">
        
        {/* Left Side: UMB Image with Original 9:16 Ratio (No Crop) */}
        <div className="relative w-full md:w-[340px] lg:w-[365px] shrink-0 aspect-[9/16] rounded-[2rem] overflow-hidden hidden md:flex flex-col justify-between p-6 lg:p-8 text-white">
          <div className="absolute inset-0 z-0">
            <img 
              src="/umb-building.jpg" 
              alt="Universitas Mercu Buana" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-black/20 to-slate-950/40"></div>
          </div>

          <div className="relative z-10">
            <div className="w-9 h-9 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 6v12"/><path d="M17.196 9 6.804 15"/><path d="m6.804 9 10.392 6"/>
              </svg>
            </div>
          </div>

          <div className="relative z-10 mt-auto pt-16">
            <p className="text-white/80 text-xs sm:text-sm font-medium mb-2">Sistem Informasi Pengawasan</p>
            <h2 className="text-2xl lg:text-3xl font-extrabold leading-tight tracking-tight text-white">
              Pusat Kendali &<br />
              Pengawasan Ormawa<br />
              Fasilkom UMB
            </h2>
          </div>
        </div>

        {/* Right Side: Register Form with Smooth Top-Aligned Scrollbar */}
        <div className="w-full flex-1 flex flex-col h-full overflow-y-auto px-4 sm:px-8 lg:px-10 py-5 custom-scrollbar">
          
          {/* Top Asterisk Icon */}
          <div className="w-8 h-8 text-blue-600 mb-4 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 6v12"/><path d="M17.196 9 6.804 15"/><path d="m6.804 9 10.392 6"/>
            </svg>
          </div>

          <div className="mb-5 shrink-0">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1.5">Buat Akun Pengurus</h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              Daftarkan akun pengurus ormawa untuk mulai mengelola proker & administrasi.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl shrink-0">
              <p className="text-xs font-semibold text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-3.5 pb-2">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-800 block">Nama Lengkap</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 rounded-xl bg-white border-slate-200 focus-visible:ring-blue-600 focus-visible:border-blue-600 text-sm placeholder:text-slate-400 shadow-sm"
                placeholder="Contoh: Budi Santoso"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-800 block">NIM</label>
              <Input
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                className="h-11 rounded-xl bg-white border-slate-200 focus-visible:ring-blue-600 focus-visible:border-blue-600 text-sm placeholder:text-slate-400 shadow-sm"
                placeholder="Contoh: 41822010000"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-800 block">Ormawa</label>
                <DropdownSelect
                  value={ormawaId}
                  onChange={setOrmawaId}
                  options={[{ value: '', label: 'Pilih Ormawa...' }, ...ORMAWA_OPTIONS]}
                  triggerClassName="h-11 rounded-xl bg-white border-slate-200 w-full justify-between px-3 focus:ring-blue-600 shadow-sm text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-800 block">Jabatan</label>
                <DropdownSelect
                  value={role}
                  onChange={setRole}
                  options={[{ value: '', label: 'Pilih Jabatan...' }, ...ROLE_OPTIONS]}
                  triggerClassName="h-11 rounded-xl bg-white border-slate-200 w-full justify-between px-3 focus:ring-blue-600 shadow-sm text-sm"
                />
              </div>
            </div>

            <div className="h-px bg-slate-100 my-2"></div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-800 block">Username</label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-11 rounded-xl bg-white border-slate-200 focus-visible:ring-blue-600 focus-visible:border-blue-600 text-sm placeholder:text-slate-400 shadow-sm"
                placeholder="Contoh: budi.fasilkom"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-800 block">Kata Sandi</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 rounded-xl bg-white border-slate-200 focus-visible:ring-blue-600 focus-visible:border-blue-600 text-sm placeholder:text-slate-400 shadow-sm"
                placeholder="Buat kata sandi akun"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 transition-all mt-4"
            >
              {loading ? 'Memproses...' : 'Daftarkan Akun'}
            </Button>
          </form>

          <div className="mt-6 text-center flex flex-col gap-3 shrink-0">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-slate-400 font-medium">AUDITMAWA FASILKOM UMB</span>
              </div>
            </div>
            
            <p className="text-sm text-slate-500 font-medium">
              Sudah memiliki akun?{' '}
              <button 
                type="button" 
                onClick={onSwitchToLogin}
                className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-colors cursor-pointer"
              >
                Masuk di sini
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
