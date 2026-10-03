import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  Mail, 
  Sparkles,
  Building2,
  ShieldCheck,
  Briefcase
} from 'lucide-react';

function LinkedInIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
    </svg>
  );
}

function InstagramIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

export default function DetailAnggotaModal({ member, isOpen, onClose }) {
  if (!member) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl p-0 overflow-hidden rounded-3xl border border-slate-200/90 shadow-2xl bg-white">
        {/* Header Banner with Color Gradient */}
        <div className={`relative px-6 pt-7 pb-6 bg-gradient-to-r ${member.cardGradient} text-white overflow-hidden`}>
          {/* Subtle Watermark in Modal Header */}
          <span className="absolute -right-4 -bottom-6 text-white/10 font-extrabold text-5xl tracking-wider uppercase select-none pointer-events-none">
            {member.watermark}
          </span>

          <div className="relative z-10 flex items-start gap-4.5">
            <div className="relative shrink-0">
              <img
                src={member.image}
                alt={member.name}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover object-top border-2 border-white/40 shadow-lg"
              />
              <span className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-white rounded-full p-1 shadow-xs border-2 border-slate-900" title="Status Aktif">
                <CheckCircle2 className="w-3 h-3 stroke-[3]" />
              </span>
            </div>

            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${member.badgeColor}`}>
                  {member.unit}
                </span>
                {member.isLead && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-amber-950 border border-amber-300">
                    Pimpinan Unit
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <DialogTitle className="text-lg sm:text-xl font-extrabold text-white tracking-tight leading-snug">
                  {member.name}
                </DialogTitle>
                <DialogDescription className="text-xs text-white/80 font-medium">
                  {member.role}
                </DialogDescription>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 space-y-5.5 max-h-[70vh] overflow-y-auto">
          {/* Academic & Administrative Badges */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Lembaga</span>
              </div>
              <p className="text-xs font-bold text-slate-900 truncate">
                DPM FASILKOM UMB
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Program Studi</span>
              </div>
              <p className="text-xs font-semibold text-slate-900 truncate">
                {member.prodi}
              </p>
            </div>
          </div>

          {/* Deskripsi Resmi */}
          {member.deskripsi && (
            <div className="text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100 font-normal">
              {member.deskripsi}
            </div>
          )}

          {/* Fokus Inti / Inti Peran */}
          {member.fokusInti && (
            <div className="p-3.5 bg-blue-50/80 rounded-2xl border border-blue-100 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs text-blue-950 leading-relaxed font-medium">
                <span className="font-extrabold text-blue-700 uppercase tracking-wide block text-[10px] mb-0.5">
                  INTI TUPOKSI UNIT
                </span>
                {member.fokusInti}
              </div>
            </div>
          )}

          {/* Motto / Visi Kerja */}
          {member.motto && (
            <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs text-blue-900 leading-relaxed font-medium italic">
                "{member.motto}"
              </div>
            </div>
          )}

          {/* Tupoksi / Tugas Pokok & Fungsi */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-slate-700" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Tugas dan Tanggung Jawab
              </h4>
            </div>
            <div className="space-y-2">
              {member.tupoksi?.map((point, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed p-2.5 rounded-xl bg-slate-50/60 border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="flex-1 font-medium">{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Media Sosial & Kontak */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                  title="Kirim Email Mahasiswa"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-600" />
                  <span className="text-[11px]">Email</span>
                </a>
              )}
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition"
                  title="Profil LinkedIn"
                >
                  <LinkedInIcon className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-[11px]">LinkedIn</span>
                </a>
              )}
              {member.instagram && (
                <a
                  href={`https://instagram.com/${member.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition"
                  title="Akun Instagram"
                >
                  <InstagramIcon className="w-3.5 h-3.5 text-rose-600" />
                  <span className="text-[11px]">{member.instagram}</span>
                </a>
              )}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="rounded-xl text-xs font-semibold border-slate-200 hover:bg-slate-50"
            >
              Tutup
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
