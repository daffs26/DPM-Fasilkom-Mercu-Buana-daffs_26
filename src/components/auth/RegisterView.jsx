import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  User, 
  Lock, 
  Building2, 
  BadgeCheck, 
  ArrowLeft, 
  Send, 
  Check, 
  Loader2,
  ShieldAlert,
  Copy,
  CheckCircle2,
  Clock,
  Ticket,
  Download,
  KeyRound,
  RefreshCw,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import DropdownSelect from '@/components/ui/dropdown-select';
import { cn } from '@/lib/utils';
import { authService } from '@/services/authService';
import { downloadReceiptAsPng } from '@/utils/generateReceiptImage';

// Helper generator kode tiket registrasi acak
const generateRandomTicket = (chosenOrmawa) => {
  const code = (chosenOrmawa || 'ORMAWA').toUpperCase();
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `REG-${code}-${dateStr}-${rand}`;
};

export default function RegisterView({ onSwitchToLogin }) {
  const navigate = useNavigate();
  const { ormawas, register } = useStore(useShallow(state => ({ ormawas: state.ormawas, register: state.register })));

  const handleGoToLogin = () => {
    if (typeof onSwitchToLogin === 'function') {
      onSwitchToLogin();
    } else {
      navigate('/login');
    }
  };
  
  const [name, setName] = useState('');
  const [nim, setNim] = useState('');
  const [ormawaId, setOrmawaId] = useState('');
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityToken, setSecurityToken] = useState('');
  
  // State untuk Fitur Tiket Registrasi Mandiri
  const [ticketNumber, setTicketNumber] = useState(() => generateRandomTicket(''));
  const [isTicketDownloaded, setIsTicketDownloaded] = useState(false);
  const [ticketError, setTicketError] = useState('');
  const [ticketNotice, setTicketNotice] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameTaken, setIsUsernameTaken] = useState(false);
  const [isCheckingNim, setIsCheckingNim] = useState(false);
  const [isNimTaken, setIsNimTaken] = useState(false);

  const ORMAWA_OPTIONS = ormawas.map(o => ({ value: o.id, label: o.shortName }));
  
  const ROLE_OPTIONS = [
    { value: 'ketua', label: 'Ketua Umum' },
    { value: 'wakil', label: 'Wakil Ketua' },
    { value: 'sekre', label: 'Sekretaris' },
    { value: 'bendahara', label: 'Bendahara / Komisi Keuangan' }
  ];

  // Aturan Validasi Username ala Instagram
  const getUsernameFormatError = (val) => {
    if (!val) return '';
    if (/\s/.test(val)) return 'Nama pengguna tidak boleh mengandung spasi';
    if (/[^a-z0-9_.]/.test(val)) return 'Hanya boleh huruf kecil (a-z), angka (0-9), garis bawah (_), dan titik (.)';
    if (/^\./.test(val)) return 'Nama pengguna tidak boleh diawali tanda titik (.)';
    if (/\.$/.test(val)) return 'Nama pengguna tidak boleh diakhiri tanda titik (.)';
    if (/\.{2,}/.test(val)) return 'Nama pengguna tidak boleh berisi titik secara berturutan';
    if (val.length < 3) return 'Nama pengguna minimal 3 karakter';
    if (val.length > 30) return 'Nama pengguna maksimal 30 karakter';
    return '';
  };

  // Cek ketersediaan username di database (Debounce 350ms ala Instagram)
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

  // Cek ketersediaan NIM di database (Debounce 350ms - 1 NIM hanya 1 akun)
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

  // Validasi real-time tiap field
  const getNameError = (val) => {
    if (!val) return submitted ? 'Mohon masukkan nama lengkap Anda' : '';
    if (/[0-9]/.test(val)) return 'Mohon masukkan nama yang valid menggunakan huruf saja (tanpa angka)';
    if (/[^a-zA-Z\s'.,]/.test(val)) return 'Mohon masukkan nama yang valid menggunakan huruf dan spasi';
    if (val.trim().length < 2) return 'Nama lengkap minimal 2 karakter';
    return '';
  };

  const getNimError = (val) => {
    if (!val) return submitted ? 'Mohon masukkan NIM Anda' : '';
    if (/[^0-9]/.test(val)) return 'Mohon masukkan NIM yang valid menggunakan angka saja';
    if (val.length < 8) return 'NIM minimal 8 digit angka';
    if (isNimTaken) return 'NIM ini sudah terdaftar pada akun lain. 1 NIM hanya untuk 1 akun pengurus.';
    return '';
  };

  const getOrmawaError = (val) => {
    if (!val && submitted) return 'Silakan pilih Ormawa Anda';
    return '';
  };

  const getRoleError = (val) => {
    if (!val && submitted) return 'Silakan pilih Jabatan kepengurusan';
    return '';
  };

  const getSecurityTokenError = (val) => {
    if (ormawaId === 'dpm' && !val && submitted) {
      return 'Kode Otorisasi Keamanan DPM wajib diisi untuk pendaftaran lembaga DPM';
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
    if (val.length < 6) return 'Kata sandi minimal 6 karakter demi keamanan akun';
    return '';
  };

  const getConfirmPasswordError = (val, pwd) => {
    if (!val) return submitted ? 'Mohon konfirmasi kata sandi Anda' : '';
    if (val !== pwd) return 'Konfirmasi kata sandi tidak cocok';
    return '';
  };

  const nameError = getNameError(name);
  const nimError = getNimError(nim);
  const ormawaError = getOrmawaError(ormawaId);
  const roleError = getRoleError(role);
  const securityTokenError = getSecurityTokenError(securityToken);
  const usernameError = getUsernameError(username);
  const passwordError = getPasswordError(password);
  const confirmPasswordError = getConfirmPasswordError(confirmPassword, password);

  const showNameError = (name.length > 0 && Boolean(nameError)) || (submitted && Boolean(nameError));
  const showNimError = (nim.length > 0 && Boolean(nimError)) || (submitted && Boolean(nimError));
  const showOrmawaError = submitted && Boolean(ormawaError);
  const showRoleError = submitted && Boolean(roleError);
  const showSecurityTokenError = submitted && Boolean(securityTokenError);
  const showUsernameError = (username.length > 0 && Boolean(usernameError)) || (submitted && Boolean(usernameError));
  const showPasswordError = (password.length > 0 && Boolean(passwordError)) || (submitted && Boolean(passwordError));
  const showConfirmPasswordError = (confirmPassword.length > 0 && Boolean(confirmPasswordError)) || (submitted && Boolean(confirmPasswordError));

  const isUsernameValid = username.length >= 3 && !usernameError && !isCheckingUsername && !isUsernameTaken;
  const isNimValid = nim.length >= 8 && !nimError && !isCheckingNim && !isNimTaken;
  const isConfirmPasswordMatch = Boolean(confirmPassword && password && confirmPassword === password && !passwordError);
  const hasValidationError = Boolean(nameError || nimError || ormawaError || roleError || securityTokenError || usernameError || passwordError || confirmPasswordError || isCheckingNim || isCheckingUsername);

  // Kesiapan form pendaftaran: seluruh field wajib terisi valid
  const isFormFilled = Boolean(
    name.trim().length >= 2 &&
    !nameError &&
    isNimValid &&
    ormawaId &&
    role &&
    isUsernameValid &&
    password.length >= 6 &&
    !passwordError &&
    confirmPassword &&
    isConfirmPasswordMatch &&
    (ormawaId !== 'dpm' || securityToken.trim()) &&
    !hasValidationError
  );

  // Tombol Buat Akun hanya aktif jika data lengkap DAN tiket sudah diunduh sah
  const isReadyToRegister = isFormFilled && isTicketDownloaded;

  // Sinkronisasi prefix ormawa pada nomor tiket jika belum di-download
  useEffect(() => {
    if (!isTicketDownloaded) {
      setTicketNumber(generateRandomTicket(ormawaId));
      setTicketError('');
      setTicketNotice('');
    }
  }, [ormawaId]);

  // Handler acak nomor tiket (hanya aktif selagi belum di-download)
  const handleRandomizeTicket = () => {
    if (isTicketDownloaded) return;
    const nextTicket = generateRandomTicket(ormawaId);
    setTicketNumber(nextTicket);
    setTicketError('');
    setTicketNotice('Nomor tiket berhasil diacak! Silakan klik "Unduh Bukti (PNG)" agar tiket & kunci reset sandi ini sah.');
  };

  // Handler reset / acak ulang jika user ingin mengganti tiket setelah download
  const handleResetTicket = () => {
    setIsTicketDownloaded(false);
    const nextTicket = generateRandomTicket(ormawaId);
    setTicketNumber(nextTicket);
    setTicketNotice('Nomor tiket diacak ulang. Status kembali Belum Sah — Anda wajib mengunduh bukti PNG tiket baru ini sebagai kunci reset sandi.');
    setTicketError('');
  };

  // Handler unduh bukti PNG sebelum pendaftaran (syarat mutlak validasi tiket)
  const handleDownloadPreRegisterReceipt = () => {
    if (!name.trim()) {
      setTicketError('Isi Nama Lengkap terlebih dahulu agar tercetak rapi di kartu bukti tiket.');
      return;
    }
    if (nameError) {
      setTicketError(nameError);
      return;
    }
    if (!nim.trim()) {
      setTicketError('Isi NIM terlebih dahulu agar tercetak rapi di kartu bukti tiket.');
      return;
    }
    if (nimError || isNimTaken) {
      setTicketError(nimError || 'NIM ini sudah terdaftar pada akun lain.');
      return;
    }
    if (!ormawaId) {
      setTicketError('Pilih Lembaga Ormawa terlebih dahulu.');
      return;
    }
    if (!role) {
      setTicketError('Pilih Jabatan Kepengurusan terlebih dahulu.');
      return;
    }
    if (!username.trim()) {
      setTicketError('Buat Username Akun terlebih dahulu agar tercantum di kartu bukti tiket.');
      return;
    }
    if (usernameError || isUsernameTaken) {
      setTicketError(usernameError || 'Username sudah digunakan oleh akun lain.');
      return;
    }
    if (!password) {
      setTicketError('Buat Kata Sandi akun terlebih dahulu.');
      return;
    }
    if (passwordError) {
      setTicketError(passwordError);
      return;
    }
    if (!confirmPassword) {
      setTicketError('Konfirmasi kata sandi Anda terlebih dahulu.');
      return;
    }
    if (confirmPassword !== password) {
      setTicketError('Konfirmasi kata sandi tidak cocok.');
      return;
    }
    if (ormawaId === 'dpm' && !securityToken.trim()) {
      setTicketError('Kode Otorisasi Keamanan DPM wajib diisi untuk pendaftaran lembaga DPM.');
      return;
    }

    setTicketError('');
    const ormawaObj = ormawas.find(o => o.id === ormawaId);
    const roleObj = ROLE_OPTIONS.find(r => r.value === role);

    const receiptData = {
      ticketNumber,
      name: name.trim(),
      nim: nim.trim(),
      ormawaId,
      ormawaName: ormawaObj?.shortName || ormawaId.toUpperCase(),
      roleName: roleObj?.label || role,
      username: username.toLowerCase().trim() || 'pengurus',
      status: ormawaId === 'dpm' ? 'approved' : 'pending',
      createdAt: new Date().toLocaleString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    downloadReceiptAsPng(receiptData);
    setIsTicketDownloaded(true);
    setTicketNotice('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setTicketError('');
    setSubmitted(true);

    if (!name || !nim || !ormawaId || !role || !username || !password || !confirmPassword) {
      setError('Mohon lengkapi semua data pendaftaran yang masih kosong atau belum sesuai.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    if (ormawaId === 'dpm' && !securityToken) {
      setError('Pendaftaran pengurus DPM wajib menyertakan Kode Otorisasi Keamanan Pimpinan.');
      return;
    }

    if (hasValidationError) {
      setError('Mohon perbaiki data yang belum sesuai petunjuk di bawah kolom.');
      return;
    }

    if (!isTicketDownloaded) {
      setTicketError('Wajib mengunduh kartu bukti tanda terima tiket (PNG) terlebih dahulu untuk mengesahkan nomor tiket & kunci reset sandi Anda.');
      return;
    }

    setLoading(true);
    try {
      const result = await register(name, nim, ormawaId, role, username, password, securityToken, ticketNumber);
      if (result.success) {
        setReceipt({
          ticketNumber: result.ticketNumber || ticketNumber,
          name: name.trim(),
          nim: nim.trim(),
          ormawaId,
          ormawaName: ormawas.find(o => o.id === ormawaId)?.shortName || ormawaId.toUpperCase(),
          roleName: ROLE_OPTIONS.find(r => r.value === role)?.label || role,
          username: username.toLowerCase().trim(),
          status: result.status || (ormawaId === 'dpm' ? 'approved' : 'pending'),
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
        setError(result.message);
      }
    } catch (err) {
      console.error('[RegisterView] Error:', err);
      setError('Terjadi kendala saat pendaftaran. Silakan periksa koneksi Anda dan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReceipt = () => {
    if (!receipt) return;
    const text = `=== BUKTI PENDAFTARAN AKUN AUDITMAWA ===\nNo. Tiket: ${receipt.ticketNumber}\nNama: ${receipt.name}\nNIM: ${receipt.nim}\nLembaga: ${receipt.ormawaName}\nJabatan: ${receipt.roleName}\nUsername: @${receipt.username}\nStatus: ${receipt.status === 'approved' ? 'Disetujui (Approved)' : 'Menunggu ACC Pimpinan DPM'}\nWaktu: ${receipt.createdAt} WIB\n======================================`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Tampilan Lembar Tanda Terima Registrasi Resmi (Digital Receipt Card)
  if (success && receipt) {
    const isApproved = receipt.status === 'approved';

    return (
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 via-slate-100/50 to-blue-50/20 p-4 sm:p-6 lg:p-8 selection:bg-blue-100 selection:text-blue-900 overflow-hidden">
        {/* Ambient soft glow elements for elegance */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-100/35 rounded-full blur-3xl pointer-events-none -z-0"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-100/30 rounded-full blur-3xl pointer-events-none -z-0"></div>

        <div className="relative z-10 w-full max-w-xl bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(15,23,42,0.08)] border border-slate-200/80 overflow-hidden p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
          {/* Header Bukti Registrasi */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 p-2 flex items-center justify-center shrink-0 shadow-sm">
                <img src="/logos/logo-dpm.png" alt="DPM FASILKOM UMB" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">AUDITMAWA FASILKOM UMB</h3>
                <p className="text-[11px] text-slate-500 font-medium">Tanda Terima Registrasi Akun Pengurus</p>
              </div>
            </div>
            <span className={cn(
              "px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wide uppercase flex items-center gap-1.5",
              isApproved 
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                : "bg-amber-100 text-amber-800 border border-amber-300"
            )}>
              {isApproved ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Aktif (Approved)
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                  Menunggu ACC
                </>
              )}
            </span>
          </div>

          {/* Deskripsi Tiket Tentang Apa */}
          <div className="p-3.5 bg-blue-50/90 border border-blue-200/90 rounded-2xl mb-3">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-xs mb-1">
              <KeyRound className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Tentang Nomor Tiket &amp; Kunci Pemulihan Ini</span>
            </div>
            <p className="text-[11px] text-blue-800 leading-relaxed">
              Nomor Tiket ini merupakan bukti registrasi sah kepengurusan ormawa di FASILKOM UMB, sekaligus berfungsi sebagai <strong>Kunci Pemulihan Rahasia</strong> untuk memulihkan atau mereset kata sandi akun jika Anda lupa kata sandi di kemudian hari.
            </p>
          </div>

          {/* Bawahnya: Kotak Kode Tiket & Aksi Unduh */}
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Kode Tiket &amp; Kunci Pemulihan</p>
              <p className="text-base sm:text-lg font-mono font-extrabold text-blue-400 tracking-wider mt-0.5">{receipt.ticketNumber}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => downloadReceiptAsPng(receipt)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm cursor-pointer active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh PNG</span>
              </button>
              <button
                type="button"
                onClick={handleCopyReceipt}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition shadow-2xs cursor-pointer active:scale-95"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copied ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
          </div>

          {/* Rincian Identitas Akun */}
          <div className="space-y-3 mb-5 bg-white border border-slate-100 rounded-2xl p-4 shadow-2xs divide-y divide-slate-100 text-xs">
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Nama Lengkap</span>
              <span className="font-bold text-slate-900">{receipt.name}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">NIM</span>
              <span className="font-mono font-semibold text-slate-800">{receipt.nim}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Lembaga Ormawa</span>
              <span className="font-bold text-blue-600">{receipt.ormawaName}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Jabatan</span>
              <span className="font-semibold text-slate-800">{receipt.roleName}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Username Akun</span>
              <span className="font-mono font-bold text-slate-900">@{receipt.username}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Waktu Pengajuan</span>
              <span className="text-slate-700">{receipt.createdAt} WIB</span>
            </div>
          </div>

          {/* Petunjuk Alur */}
          <div className={cn(
            "p-3.5 rounded-2xl text-xs mb-6 leading-relaxed border",
            isApproved 
              ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
              : "bg-blue-50/70 border-blue-200 text-blue-900"
          )}>
            {isApproved ? (
              <p>
                <strong>Selamat!</strong> Akun pimpinan DPM FASILKOM Anda telah terverifikasi dengan Kode Otorisasi yang sah dan berstatus aktif. Silakan masuk melalui halaman login untuk mengakses sistem pengawasan.
              </p>
            ) : (
              <p>
                <strong>Catatan Penting:</strong> Berkas pendaftaran Anda telah diteruskan ke pimpinan DPM FASILKOM untuk divalidasi keabsahannya. Anda dapat mengecek status persetujuan secara mandiri di halaman login melalui menu <strong>"Cek Status Pendaftaran"</strong> menggunakan Username atau NIM.
              </p>
            )}
          </div>

          {/* Tombol Aksi */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={() => downloadReceiptAsPng(receipt)}
              className="flex-1 h-12 rounded-xl font-bold text-blue-700 border-blue-200 hover:bg-blue-50 text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Download className="w-4 h-4 text-blue-600" />
              <span>Unduh Bukti (PNG)</span>
            </Button>
            <Button
              type="button"
              onClick={handleGoToLogin}
              className="flex-1 h-12 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-lg shadow-blue-500/25 text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Menuju Halaman Login</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 via-slate-100/50 to-blue-50/20 p-4 sm:p-6 lg:p-8 selection:bg-blue-100 selection:text-blue-900 overflow-hidden">
      {/* Ambient soft glow elements for elegance */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-blue-100/35 rounded-full blur-3xl pointer-events-none -z-0"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-100/30 rounded-full blur-3xl pointer-events-none -z-0"></div>

      <div className="relative z-10 w-full max-w-xl sm:max-w-2xl bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(15,23,42,0.08)] border border-slate-200/80 p-6 sm:p-9 transition-all">
        {/* Header */}
        <div className="text-center mb-7">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Buat Akun Pengurus
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-2 max-w-md mx-auto leading-relaxed">
            Daftarkan akun ormawa untuk mulai mengelola program kerja &amp; administrasi sistem pengawasan FASILKOM UMB.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <p className="text-xs font-semibold text-red-800 leading-tight">{error}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Nama Lengkap */}
            <div className="space-y-1">
              <label className={cn(
                "text-xs font-semibold block transition-colors",
                showNameError ? "text-rose-500" : "text-slate-700"
              )}>
                Nama Lengkap
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={cn(
                  "h-10 rounded-xl bg-white text-xs placeholder:text-slate-400 transition-all",
                  showNameError
                    ? "border-rose-400 ring-2 ring-rose-100 text-rose-950 focus-visible:ring-rose-200 focus-visible:border-rose-500 bg-rose-50/15"
                    : "border-slate-200 focus-visible:ring-blue-600 focus-visible:border-blue-600 shadow-2xs"
                )}
                placeholder="Masukkan nama lengkap Anda"
              />
              {showNameError && (
                <p className="text-[11px] text-rose-500 font-medium mt-1 leading-tight animate-in fade-in duration-150">
                  {nameError}
                </p>
              )}
            </div>

            {/* NIM */}
            <div className="space-y-1">
              <label className={cn(
                "text-xs font-semibold block transition-colors",
                showNimError ? "text-rose-500" : isNimValid ? "text-emerald-700" : "text-slate-700"
              )}>
                NIM
              </label>
              <div className="relative flex items-center">
                <Input
                  value={nim}
                  onChange={(e) => setNim(e.target.value.replace(/\D/g, ''))}
                  className={cn(
                    "h-10 rounded-xl bg-white text-xs placeholder:text-slate-400 transition-all",
                    isNimValid || isCheckingNim ? "pr-9" : "",
                    showNimError
                      ? "border-rose-400 ring-2 ring-rose-100 text-rose-950 focus-visible:ring-rose-200 focus-visible:border-rose-500 bg-rose-50/15"
                      : isNimValid
                        ? "border-emerald-400 ring-2 ring-emerald-50 text-slate-900 focus-visible:ring-emerald-200 focus-visible:border-emerald-500"
                        : "border-slate-200 focus-visible:ring-blue-600 focus-visible:border-blue-600 shadow-2xs"
                  )}
                  placeholder="Masukkan NIM Anda"
                  maxLength={15}
                />
                {isCheckingNim && (
                  <span className="absolute right-3 text-slate-400 flex items-center">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />
                  </span>
                )}
                {!isCheckingNim && isNimValid && (
                  <span className="absolute right-3 text-emerald-500 flex items-center animate-in zoom-in-75 duration-150">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                )}
              </div>
              {showNimError ? (
                <p className="text-[11px] text-rose-500 font-medium mt-1 leading-tight animate-in fade-in duration-150">
                  {nimError}
                </p>
              ) : isNimValid ? (
                <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1 animate-in fade-in duration-150">
                  <Check className="w-3 h-3 stroke-[2.5]" /> NIM valid &amp; belum terdaftar
                </p>
              ) : null}
            </div>

            {/* Ormawa */}
            <div className="space-y-1">
              <label className={cn(
                "text-xs font-semibold block transition-colors",
                showOrmawaError ? "text-rose-500" : "text-slate-700"
              )}>
                Lembaga Ormawa
              </label>
              <DropdownSelect
                value={ormawaId}
                onChange={setOrmawaId}
                options={[{ value: '', label: 'Pilih Ormawa...' }, ...ORMAWA_OPTIONS]}
                triggerClassName={cn(
                  "h-10 rounded-xl bg-white w-full justify-between px-3 shadow-2xs text-xs transition-all",
                  showOrmawaError
                    ? "border-rose-400 ring-2 ring-rose-100 bg-rose-50/15 text-rose-950"
                    : "border-slate-200 focus:ring-blue-600"
                )}
              />
              {showOrmawaError && (
                <p className="text-[11px] text-rose-500 font-medium mt-1 leading-tight animate-in fade-in duration-150">
                  {ormawaError}
                </p>
              )}
            </div>

            {/* Jabatan */}
            <div className="space-y-1">
              <label className={cn(
                "text-xs font-semibold block transition-colors",
                showRoleError ? "text-rose-500" : "text-slate-700"
              )}>
                Jabatan Kepengurusan
              </label>
              <DropdownSelect
                value={role}
                onChange={setRole}
                options={[{ value: '', label: 'Pilih Jabatan...' }, ...ROLE_OPTIONS]}
                triggerClassName={cn(
                  "h-10 rounded-xl bg-white w-full justify-between px-3 shadow-2xs text-xs transition-all",
                  showRoleError
                    ? "border-rose-400 ring-2 ring-rose-100 bg-rose-50/15 text-rose-950"
                    : "border-slate-200 focus:ring-blue-600"
                )}
              />
              {showRoleError && (
                <p className="text-[11px] text-rose-500 font-medium mt-1 leading-tight animate-in fade-in duration-150">
                  {roleError}
                </p>
              )}
            </div>

            {/* Otorisasi Khusus DPM */}
            {ormawaId === 'dpm' && (
              <div className="sm:col-span-2 p-3 bg-amber-50/80 border border-amber-200/90 rounded-2xl space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-1.5 text-amber-900">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="text-xs font-bold">Otorisasi Keamanan Pimpinan DPM</span>
                </div>
                <p className="text-[11px] text-amber-700 leading-tight">
                  Pendaftaran akun DPM membutuhkan Kode Akses Rahasia Pimpinan untuk mencegah eskalasi hak akses ilegal.
                </p>
                <div className="relative">
                  <Input
                    type="password"
                    value={securityToken}
                    onChange={(e) => setSecurityToken(e.target.value)}
                    placeholder="Masukkan Kode Otorisasi DPM"
                    className={cn(
                      "h-9 text-xs bg-white rounded-xl transition-all",
                      showSecurityTokenError
                        ? "border-rose-400 ring-2 ring-rose-100 text-rose-950 bg-rose-50/20"
                        : "border-amber-300 focus-visible:ring-amber-500 shadow-2xs"
                    )}
                  />
                </div>
                {showSecurityTokenError && (
                  <p className="text-[11px] text-rose-500 font-medium">
                    {securityTokenError}
                  </p>
                )}
              </div>
            )}

            {/* Username */}
            <div className="space-y-1 sm:col-span-2">
              <div className="flex items-center justify-between">
                <label className={cn(
                  "text-xs font-semibold block transition-colors",
                  showUsernameError ? "text-rose-500" : isUsernameValid ? "text-emerald-700" : "text-slate-700"
                )}>
                  Username Akun
                </label>
                {username.length > 0 && (
                  <span className={cn(
                    "text-[10px] font-mono",
                    username.length > 30 ? "text-rose-500 font-bold" : "text-slate-400"
                  )}>
                    {username.length}/30
                  </span>
                )}
              </div>

              <div className="relative flex items-center">
                <span className={cn(
                  "absolute left-3 font-bold text-xs select-none transition-colors",
                  showUsernameError ? "text-rose-400" : isUsernameValid ? "text-emerald-500" : "text-slate-400"
                )}>
                  @
                </span>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  className={cn(
                    "h-10 rounded-xl bg-white text-xs placeholder:text-slate-400 pl-7 pr-9 transition-all",
                    showUsernameError
                      ? "border-rose-400 ring-2 ring-rose-100 text-rose-950 focus-visible:ring-rose-200 focus-visible:border-rose-500 bg-rose-50/15"
                      : isUsernameValid
                        ? "border-emerald-400 ring-2 ring-emerald-50 text-slate-900 focus-visible:ring-emerald-200 focus-visible:border-emerald-500"
                        : "border-slate-200 focus-visible:ring-blue-600 focus-visible:border-blue-600 shadow-2xs"
                  )}
                  placeholder="nama_pengguna"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                />
                {isCheckingUsername && (
                  <span className="absolute right-3 text-slate-400 flex items-center">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />
                  </span>
                )}
                {!isCheckingUsername && isUsernameValid && (
                  <span className="absolute right-3 text-emerald-500 flex items-center animate-in zoom-in-75 duration-150">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                )}
              </div>

              {showUsernameError ? (
                <p className="text-[11px] text-rose-500 font-medium mt-1 leading-tight animate-in fade-in duration-150">
                  {usernameError}
                </p>
              ) : isUsernameValid ? (
                <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1 animate-in fade-in duration-150">
                  <Check className="w-3 h-3 stroke-[2.5]" /> @{username} tersedia
                </p>
              ) : (
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Kecil (a-z), angka (0-9), titik (.), garis bawah (_).
                </p>
              )}
            </div>

            {/* Kata Sandi */}
            <div className="space-y-1">
              <label className={cn(
                "text-xs font-semibold block transition-colors",
                showPasswordError ? "text-rose-500" : "text-slate-700"
              )}>
                Kata Sandi
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={cn(
                  "h-10 rounded-xl bg-white text-xs placeholder:text-slate-400 transition-all",
                  showPasswordError
                    ? "border-rose-400 ring-2 ring-rose-100 text-rose-950 focus-visible:ring-rose-200 focus-visible:border-rose-500 bg-rose-50/15"
                    : "border-slate-200 focus-visible:ring-blue-600 focus-visible:border-blue-600 shadow-2xs"
                )}
                placeholder="kata sandi"
              />
              {showPasswordError ? (
                <p className="text-[11px] text-rose-500 font-medium mt-1 leading-tight animate-in fade-in duration-150">
                  {passwordError}
                </p>
              ) : (
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Minimal 6 karakter demi keamanan akun.
                </p>
              )}
            </div>

            {/* Konfirmasi Kata Sandi */}
            <div className="space-y-1">
              <label className={cn(
                "text-xs font-semibold block transition-colors",
                showConfirmPasswordError ? "text-rose-500" : isConfirmPasswordMatch ? "text-emerald-700" : "text-slate-700"
              )}>
                Konfirmasi Kata Sandi
              </label>
              <div className="relative flex items-center">
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={cn(
                    "h-10 rounded-xl bg-white text-xs placeholder:text-slate-400 transition-all",
                    isConfirmPasswordMatch && "pr-9",
                    showConfirmPasswordError
                      ? "border-rose-400 ring-2 ring-rose-100 text-rose-950 focus-visible:ring-rose-200 focus-visible:border-rose-500 bg-rose-50/15"
                      : isConfirmPasswordMatch
                        ? "border-emerald-400 ring-2 ring-emerald-50 text-slate-900 focus-visible:ring-emerald-200 focus-visible:border-emerald-500"
                        : "border-slate-200 focus-visible:ring-blue-600 focus-visible:border-blue-600 shadow-2xs"
                  )}
                  placeholder="konfirmasi kata sandi"
                />
                {isConfirmPasswordMatch && (
                  <span className="absolute right-3 text-emerald-500 flex items-center animate-in zoom-in-75 duration-150">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                )}
              </div>
              {showConfirmPasswordError ? (
                <p className="text-[11px] text-rose-500 font-medium mt-1 leading-tight animate-in fade-in duration-150">
                  {confirmPasswordError}
                </p>
              ) : isConfirmPasswordMatch ? (
                <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1 animate-in fade-in duration-150">
                  <Check className="w-3 h-3 stroke-[2.5]" /> Kata sandi cocok
                </p>
              ) : (
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Ulangi kata sandi yang sama persis.
                </p>
              )}
            </div>

            {/* Card Khusus Nomor Tiket Registrasi & Kunci Reset Sandi */}
            <div className="sm:col-span-2">
              <div className={cn(
                "rounded-2xl p-3 sm:p-3.5 border transition-all space-y-2.5",
                isTicketDownloaded 
                  ? "bg-emerald-50/40 border-emerald-200" 
                  : "bg-slate-50/80 border-slate-200/90"
              )}>
                {/* Header Card: Label & Status Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Ticket className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="text-xs font-bold text-slate-800">Nomor Tiket &amp; Kunci Reset Sandi</span>
                    </div>
                    <p className="text-[10.5px] text-slate-500 font-normal mt-0.5 leading-tight">
                      Tiket ini adalah bukti sah registrasi sekaligus <span className="font-semibold text-slate-700">kunci utama untuk mereset kata sandi</span> jika Anda lupa.
                    </p>
                  </div>
                  <div className="shrink-0 self-start sm:self-center">
                    {isTicketDownloaded ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Tiket Sah (Valid)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100/80 text-amber-800 border border-amber-200/70">
                        <Clock className="w-3 h-3 text-amber-600" />
                        Belum Diunduh
                      </span>
                    )}
                  </div>
                </div>

                {/* Baris Input & Tombol Aksi */}
                <div className="flex items-center gap-1.5">
                  <Input
                    type="text"
                    readOnly
                    value={ticketNumber}
                    className={cn(
                      "h-9 flex-1 rounded-xl text-xs font-mono font-bold tracking-wider select-all transition-all cursor-default bg-white",
                      isTicketDownloaded
                        ? "border-emerald-300 text-emerald-950 focus-visible:ring-emerald-400"
                        : "border-slate-200 text-slate-800 focus-visible:ring-blue-500"
                    )}
                    placeholder="Nomor Tiket & Kunci Reset Sandi"
                  />

                  {/* Tombol Acak */}
                  {!isTicketDownloaded ? (
                    <button
                      type="button"
                      onClick={handleRandomizeTicket}
                      className="h-9 px-2.5 sm:px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-95 text-slate-700 font-semibold text-xs flex items-center gap-1 shrink-0 shadow-2xs transition-all cursor-pointer"
                      title="Acak nomor tiket baru"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                      <span className="hidden sm:inline">Acak</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResetTicket}
                      className="h-9 px-2.5 rounded-xl border border-dashed border-slate-300 bg-white hover:bg-slate-100 active:scale-95 text-slate-600 font-medium text-xs flex items-center gap-1 shrink-0 transition-all cursor-pointer"
                      title="Acak ulang nomor tiket"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                      <span>Ubah</span>
                    </button>
                  )}

                  {/* Tombol Unduh Bukti PNG */}
                  <button
                    type="button"
                    onClick={handleDownloadPreRegisterReceipt}
                    className={cn(
                      "h-9 px-3 sm:px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-2xs transition-all cursor-pointer active:scale-95",
                      isTicketDownloaded
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"
                    )}
                    title="Unduh berkas bukti digital PNG tanda terima pendaftaran"
                  >
                    {isTicketDownloaded ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Unduh Ulang</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Unduh PNG</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Status / Single-line Hint (Bebas dari Information Fatigue) */}
                {ticketError ? (
                  <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1 pt-0.5 animate-in fade-in duration-150">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                    <span>{ticketError}</span>
                  </p>
                ) : isTicketDownloaded ? (
                  <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1.5 pt-0.5 animate-in fade-in duration-150">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                    <span>Bukti PNG tersimpan. Tiket ini resmi menjadi kunci sah akun &amp; pemulihan kata sandi Anda.</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                    <span>Unduh bukti (PNG) untuk mengesahkan tiket &amp; menyimpan kunci reset kata sandi Anda.</span>
                  </p>
                )}
              </div>
            </div>

            {/* Tombol Buat Akun */}
            <div className="sm:col-span-2 pt-2">
              <Button
                type="submit"
                disabled={loading || !isReadyToRegister}
                className={cn(
                  "w-full h-11 sm:h-12 rounded-xl font-bold text-xs sm:text-sm text-white shadow-md transition-all",
                  !isReadyToRegister
                    ? "bg-slate-200 text-slate-400 shadow-none cursor-not-allowed hover:bg-slate-200"
                    : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/25 active:scale-[0.99] cursor-pointer"
                )}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Membuat Akun...</span>
                  </span>
                ) : (
                  'Buat Akun'
                )}
              </Button>
              <div className="text-[11px] text-center mt-2.5 leading-relaxed">
                {!isFormFilled ? (
                  <p className="text-slate-400">
                    *Isi seluruh data pendaftaran di atas dan unduh bukti tiket (PNG) untuk mengaktifkan tombol <strong>Buat Akun</strong>.
                  </p>
                ) : !isTicketDownloaded ? (
                  <p className="text-amber-700 font-medium inline-flex items-center justify-center gap-1.5 bg-amber-50/80 border border-amber-200/80 px-3 py-1 rounded-full animate-in fade-in duration-150">
                    <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Data lengkap! Silakan klik <strong>"Unduh PNG"</strong> pada kartu tiket di atas agar tombol <strong>Buat Akun</strong> aktif.</span>
                  </p>
                ) : (
                  <p className="text-emerald-700 font-medium inline-flex items-center justify-center gap-1.5 bg-emerald-50/80 border border-emerald-200/80 px-3 py-1 rounded-full animate-in fade-in duration-150">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Data dan tiket sah! Silakan klik <strong>Buat Akun</strong> untuk menyelesaikan pendaftaran.</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center flex flex-col gap-2.5 border-t border-slate-100 pt-4">
          <p className="text-xs text-slate-500 font-medium">
            Sudah memiliki akun?{' '}
            <button 
              type="button" 
              onClick={handleGoToLogin}
              className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-colors cursor-pointer"
            >
              Masuk di sini
            </button>
          </p>
          <p className="text-[10px] text-slate-400 font-medium tracking-wider">
            AUDITMAWA FASILKOM UMB
          </p>
        </div>
      </div>
    </div>
  );
}
