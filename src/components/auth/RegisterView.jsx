import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  Loader2,
  CheckCircle2, 
  KeyRound, 
  AlertCircle, 
  ArrowRight,
  Eye,
  EyeOff,
  Check
} from 'lucide-react';
import DropdownSelect from '@/components/ui/dropdown-select';
import { cn } from '@/lib/utils';
import { authService } from '@/services/authService';

const DPM_ROLE_OPTIONS = [
  { value: 'ketua', label: 'Ketua DPM (Pimpinan Parlemen)' },
  { value: 'wakil', label: 'Wakil Ketua DPM (Pimpinan Parlemen)' },
  { value: 'sekretaris', label: 'Sekretaris DPM (Kesekretariatan)' },
  { value: 'bendahara', label: 'Bendahara DPM (Kebendaharaan)' },
  { value: 'komisi_pengawasan', label: 'Komisi I (Pengawasan Proker)' },
  { value: 'komisi_keuangan', label: 'Komisi II (Legislasi Anggaran)' },
  { value: 'komisi_kominfo', label: 'Komisi III (Kominfo & Media)' },
  { value: 'komisi_advokasi', label: 'Komisi IV (Aspirasi & Advokasi)' }
];

export default function RegisterView({ onSwitchToLogin }) {
  const navigate = useNavigate();
  const { register } = useStore(useShallow(state => ({ register: state.register })));

  const handleGoToLogin = () => {
    if (typeof onSwitchToLogin === 'function') {
      onSwitchToLogin();
    } else {
      navigate('/login');
    }
  };
  
  const [name, setName] = useState('');
  const [nim, setNim] = useState('');
  const [role, setRole] = useState('komisi_pengawasan');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityToken, setSecurityToken] = useState('DPM-FASILKOM-2026');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [registeredData, setRegisteredData] = useState(null);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameTaken, setIsUsernameTaken] = useState(false);
  const [isCheckingNim, setIsCheckingNim] = useState(false);
  const [isNimTaken, setIsNimTaken] = useState(false);

  // Aturan Validasi Username
  const getUsernameFormatError = (val) => {
    if (!val) return '';
    if (/\s/.test(val)) return 'Username tidak boleh mengandung spasi';
    if (/[^a-z0-9_.]/.test(val)) return 'Hanya boleh huruf kecil (a-z), angka (0-9), garis bawah (_), dan titik (.)';
    if (/^\./.test(val)) return 'Username tidak boleh diawali titik (.)';
    if (/\.$/.test(val)) return 'Username tidak boleh diakhiri titik (.)';
    if (/\.{2,}/.test(val)) return 'Username tidak boleh berisi titik berurutan';
    if (val.length < 3) return 'Username minimal 3 karakter';
    if (val.length > 30) return 'Username maksimal 30 karakter';
    return '';
  };

  // Cek ketersediaan username di database (Debounce 350ms)
  useEffect(() => {
    const clean = username.trim().toLowerCase();
    const formatErr = getUsernameFormatError(clean);
    
    if (!clean || clean.length < 3 || formatErr) {
      setIsUsernameTaken(false);
      setIsCheckingUsername(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsCheckingUsername(true);
      try {
        const { available } = await authService.checkUsernameAvailability(clean);
        setIsUsernameTaken(!available);
      } catch {
        setIsUsernameTaken(false);
      } finally {
        setIsCheckingUsername(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [username]);

  // Cek ketersediaan NIM di database (Debounce 350ms)
  useEffect(() => {
    const clean = nim.trim();
    if (!clean || clean.length < 8 || /[^0-9]/.test(clean)) {
      setIsNimTaken(false);
      setIsCheckingNim(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsCheckingNim(true);
      try {
        const { available } = await authService.checkNimAvailability(clean);
        setIsNimTaken(!available);
      } catch {
        setIsNimTaken(false);
      } finally {
        setIsCheckingNim(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [nim]);

  // Validasi tiap field
  const getNameError = (val) => {
    if (!val) return submitted ? 'Mohon masukkan nama lengkap Anda' : '';
    if (/[0-9]/.test(val)) return 'Nama harus berupa huruf saja (tanpa angka)';
    if (/[^a-zA-Z\s'.,]/.test(val)) return 'Nama hanya boleh mengandung huruf dan spasi';
    if (val.trim().length < 2) return 'Nama lengkap minimal 2 karakter';
    return '';
  };

  const getNimError = (val) => {
    if (!val) return submitted ? 'Mohon masukkan NIM Anda' : '';
    if (/[^0-9]/.test(val)) return 'NIM harus berupa angka saja';
    if (val.length < 8) return 'NIM minimal 8 digit angka';
    if (isNimTaken) return 'NIM ini sudah terdaftar pada akun lain';
    return '';
  };

  const getRoleError = (val) => {
    if (!val && submitted) return 'Silakan pilih Komisi / Jabatan DPM Anda';
    return '';
  };

  const getSecurityTokenError = (val) => {
    if (!val && submitted) {
      return 'Kode Otorisasi Keamanan DPM wajib diisi';
    }
    return '';
  };

  const getUsernameError = (val) => {
    if (!val) return submitted ? 'Mohon buat username akun Anda' : '';
    const formatError = getUsernameFormatError(val);
    if (formatError) return formatError;
    if (isUsernameTaken) return 'Username ini sudah digunakan oleh akun lain';
    return '';
  };

  const getPasswordError = (val) => {
    if (!val) return submitted ? 'Mohon buat kata sandi akun' : '';
    if (val.length < 6) return 'Kata sandi minimal 6 karakter';
    return '';
  };

  const getConfirmPasswordError = (val, pwd) => {
    if (!val) return submitted ? 'Mohon konfirmasi kata sandi Anda' : '';
    if (val !== pwd) return 'Konfirmasi kata sandi tidak cocok';
    return '';
  };

  const nameError = getNameError(name);
  const nimError = getNimError(nim);
  const roleError = getRoleError(role);
  const securityTokenError = getSecurityTokenError(securityToken);
  const usernameError = getUsernameError(username);
  const passwordError = getPasswordError(password);
  const confirmPasswordError = getConfirmPasswordError(confirmPassword, password);

  const showNameError = (name.length > 0 && Boolean(nameError)) || (submitted && Boolean(nameError));
  const showNimError = (nim.length > 0 && Boolean(nimError)) || (submitted && Boolean(nimError));
  const showRoleError = submitted && Boolean(roleError);
  const showSecurityTokenError = submitted && Boolean(securityTokenError);
  const showUsernameError = (username.length > 0 && Boolean(usernameError)) || (submitted && Boolean(usernameError));
  const showPasswordError = (password.length > 0 && Boolean(passwordError)) || (submitted && Boolean(passwordError));
  const showConfirmPasswordError = (confirmPassword.length > 0 && Boolean(confirmPasswordError)) || (submitted && Boolean(confirmPasswordError));

  const isUsernameValid = username.length >= 3 && !usernameError && !isCheckingUsername && !isUsernameTaken;
  const isNimValid = nim.length >= 8 && !nimError && !isCheckingNim && !isNimTaken;
  const hasValidationError = Boolean(nameError || nimError || roleError || securityTokenError || usernameError || passwordError || confirmPasswordError || isCheckingNim || isCheckingUsername);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitted(true);

    if (!name || !nim || !role || !username || !password || !confirmPassword || !securityToken) {
      setError('Mohon lengkapi semua data pendaftaran yang masih kosong.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    if (hasValidationError) {
      setError('Mohon perbaiki data yang belum sesuai petunjuk.');
      return;
    }

    setLoading(true);
    try {
      const result = await register(
        name.trim(), 
        nim.trim(), 
        'dpm', 
        role, 
        username.trim().toLowerCase(), 
        password, 
        securityToken.trim()
      );

      if (result.success) {
        setRegisteredData({
          name: name.trim(),
          nim: nim.trim(),
          roleName: DPM_ROLE_OPTIONS.find(r => r.value === role)?.label || role,
          username: username.toLowerCase().trim(),
          createdAt: new Date().toLocaleString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        });
        setSuccess(true);
      } else {
        setError(result.message || 'Pendaftaran gagal.');
      }
    } catch (err) {
      console.error('[RegisterView] Error:', err);
      setError('Terjadi kendala saat memproses pendaftaran. Silakan periksa koneksi Anda.');
    } finally {
      setLoading(false);
    }
  };

  if (success && registeredData) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 via-slate-100/50 to-blue-50/20 p-4 sm:p-6 lg:p-8 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-blue-100/35 rounded-full blur-3xl pointer-events-none -z-0"></div>

        <div className="relative z-10 w-full max-w-lg bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border border-slate-200/80 p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-sm ring-8 ring-emerald-50">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Akun Berhasil Didaftarkan!</h2>
            <p className="text-xs text-slate-500 mt-1">
              Akun pengurus DPM FASILKOM Anda telah terverifikasi dengan Kode Otorisasi yang sah dan berstatus aktif.
            </p>
          </div>

          <div className="space-y-3 mb-6 bg-slate-50 border border-slate-100 rounded-2xl p-4 divide-y divide-slate-100 text-xs">
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Nama Lengkap</span>
              <span className="font-bold text-slate-900">{registeredData.name}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">NIM</span>
              <span className="font-mono font-semibold text-slate-800">{registeredData.nim}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Lembaga</span>
              <span className="font-bold text-blue-600">DPM FASILKOM UMB</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Komisi / Jabatan</span>
              <span className="font-semibold text-slate-800">{registeredData.roleName}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Username Akun</span>
              <span className="font-mono font-bold text-slate-900">@{registeredData.username}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Waktu Pendaftaran</span>
              <span className="text-slate-700">{registeredData.createdAt} WIB</span>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleGoToLogin}
            className="w-full h-12 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-lg shadow-blue-500/25 text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Masuk ke Halaman Login</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 via-slate-100/50 to-blue-50/20 p-4 sm:p-6 lg:p-8 selection:bg-blue-100 selection:text-blue-900 overflow-hidden">
      {/* Ambient soft glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-blue-100/35 rounded-full blur-3xl pointer-events-none -z-0"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-100/30 rounded-full blur-3xl pointer-events-none -z-0"></div>

      <div className="relative z-10 w-full max-w-xl sm:max-w-2xl bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(15,23,42,0.08)] border border-slate-200/80 p-6 sm:p-9 transition-all">
        {/* Tombol Kembali */}
        <button
          type="button"
          onClick={handleGoToLogin}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition mb-4 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Halaman Masuk</span>
        </button>

        {/* Header */}
        <div className="text-center mb-7">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Buat Akun Pengurus DPM
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-2 max-w-md mx-auto leading-relaxed">
            Daftarkan akun pengurus DPM untuk mulai mengelola program kerja &amp; administrasi sistem pengawasan FASILKOM UMB.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <p className="text-xs font-semibold text-red-800 leading-tight">{error}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Baris 1: Nama Lengkap & NIM */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className={cn("text-xs font-semibold block", showNameError ? "text-rose-500" : "text-slate-700")}>
                Nama Lengkap
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Muhammad Daffa"
                className={cn("h-11 rounded-xl text-xs", showNameError && "border-rose-400 ring-2 ring-rose-100")}
              />
              {showNameError && <p className="text-[11px] text-rose-500">{nameError}</p>}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className={cn("text-xs font-semibold block", showNimError ? "text-rose-500" : "text-slate-700")}>
                  NIM
                </label>
                {isCheckingNim && (
                  <span className="text-[10px] text-blue-600 flex items-center gap-1 font-medium">
                    <Loader2 className="w-2.5 h-2.5 animate-spin" /> Memeriksa...
                  </span>
                )}
                {isNimValid && (
                  <span className="text-[10px] text-emerald-600 flex items-center gap-0.5 font-bold">
                    <Check className="w-3 h-3" /> Tersedia
                  </span>
                )}
              </div>
              <Input
                type="text"
                value={nim}
                onChange={(e) => setNim(e.target.value.replace(/\D/g, ''))}
                placeholder="Contoh: 41522010045"
                className={cn("h-11 rounded-xl text-xs", showNimError && "border-rose-400 ring-2 ring-rose-100")}
              />
              {showNimError && <p className="text-[11px] text-rose-500">{nimError}</p>}
            </div>
          </div>

          {/* Baris 2: Komisi / Jabatan DPM */}
          <div className="space-y-1">
            <label className={cn("text-xs font-semibold block", showRoleError ? "text-rose-500" : "text-slate-700")}>
              Komisi / Jabatan DPM FASILKOM
            </label>
            <DropdownSelect
              value={role}
              onChange={setRole}
              options={DPM_ROLE_OPTIONS}
              placeholder="Pilih Komisi / Jabatan DPM"
              triggerClassName="h-11 rounded-xl text-xs bg-white border-slate-200"
            />
            {showRoleError && <p className="text-[11px] text-rose-500">{roleError}</p>}
          </div>

          {/* Baris 3: Kode Otorisasi DPM */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className={cn("text-xs font-semibold block", showSecurityTokenError ? "text-rose-500" : "text-slate-700")}>
                Kode Otorisasi Keamanan DPM
              </label>
              <span className="text-[10px] text-slate-400 font-mono">Default: DPM-FASILKOM-2026</span>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                type="text"
                value={securityToken}
                onChange={(e) => setSecurityToken(e.target.value)}
                placeholder="Ketik kode otorisasi DPM..."
                className={cn("h-11 rounded-xl text-xs pl-10 font-mono", showSecurityTokenError && "border-rose-400 ring-2 ring-rose-100")}
              />
            </div>
            {showSecurityTokenError && <p className="text-[11px] text-rose-500">{securityTokenError}</p>}
          </div>

          {/* Baris 4: Username Akun */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className={cn("text-xs font-semibold block", showUsernameError ? "text-rose-500" : "text-slate-700")}>
                Username Akun
              </label>
              {isCheckingUsername && (
                <span className="text-[10px] text-blue-600 flex items-center gap-1 font-medium">
                  <Loader2 className="w-2.5 h-2.5 animate-spin" /> Memeriksa...
                </span>
              )}
              {isUsernameValid && (
                <span className="text-[10px] text-emerald-600 flex items-center gap-0.5 font-bold">
                  <Check className="w-3 h-3" /> Tersedia
                </span>
              )}
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">@</span>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                placeholder="nama.pengguna"
                className={cn("h-11 rounded-xl text-xs pl-8", showUsernameError && "border-rose-400 ring-2 ring-rose-100")}
                autoCapitalize="none"
              />
            </div>
            {showUsernameError && <p className="text-[11px] text-rose-500">{usernameError}</p>}
          </div>

          {/* Baris 5: Kata Sandi & Konfirmasi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className={cn("text-xs font-semibold block", showPasswordError ? "text-rose-500" : "text-slate-700")}>
                Kata Sandi
              </label>
              <div className="relative flex items-center">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className={cn("h-11 rounded-xl text-xs pr-10", showPasswordError && "border-rose-400 ring-2 ring-rose-100")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {showPasswordError && <p className="text-[11px] text-rose-500">{passwordError}</p>}
            </div>

            <div className="space-y-1">
              <label className={cn("text-xs font-semibold block", showConfirmPasswordError ? "text-rose-500" : "text-slate-700")}>
                Konfirmasi Kata Sandi
              </label>
              <div className="relative flex items-center">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi"
                  className={cn("h-11 rounded-xl text-xs pr-10", showConfirmPasswordError && "border-rose-400 ring-2 ring-rose-100")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {showConfirmPasswordError && <p className="text-[11px] text-rose-500">{confirmPasswordError}</p>}
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 transition-all mt-3 cursor-pointer"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Memproses Pendaftaran...</span>
              </div>
            ) : (
              <span>Daftarkan Akun Pengurus DPM</span>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500 font-medium">
            Sudah memiliki akun pengurus?{' '}
            <button
              type="button"
              onClick={handleGoToLogin}
              className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-colors cursor-pointer"
            >
              Masuk sekarang
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
