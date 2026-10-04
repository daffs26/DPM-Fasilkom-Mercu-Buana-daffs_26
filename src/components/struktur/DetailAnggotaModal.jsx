import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Mail, 
  Briefcase,
  User
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
      <DialogContent className="max-w-lg p-0 overflow-hidden rounded-3xl border border-slate-200/90 shadow-2xl bg-white">
        {/* Clean, Refined Header */}
        <div className="relative px-6 sm:px-7 py-6 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-start gap-4 pr-6">
            {/* Photo Border Placement Box */}
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl border-2 border-dashed border-slate-300 bg-white flex items-center justify-center text-slate-400 shrink-0 shadow-2xs">
              <User className="w-7 h-7 sm:w-8 sm:h-8 text-slate-400" />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100">
                  {member.unit}
                </span>
                {member.isLead && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-200/70 text-slate-700">
                    Pimpinan Unit
                  </span>
                )}
              </div>

              <DialogTitle className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug pt-0.5">
                {member.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-600 font-semibold">
                {member.role}
              </DialogDescription>
              <p className="text-[11px] text-slate-400 font-medium">
                {member.prodi} • DPM FASILKOM UMB
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 sm:p-7 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Deskripsi Resmi */}
          {member.deskripsi && (
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {member.deskripsi}
            </p>
          )}


          {/* Tugas Pokok & Fungsi (Tupoksi) */}
          {member.tupoksi && member.tupoksi.length > 0 && (
            <div className="space-y-3 pt-1">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                <span>Tugas &amp; Tanggung Jawab</span>
              </h4>
              <ol className="space-y-2.5">
                {member.tupoksi.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                    <span className="text-[11px] font-bold text-slate-400 tabular-nums shrink-0 mt-0.5 w-4">
                      {String(idx + 1).padStart(2, '0')}.
                    </span>
                    <span className="font-normal text-slate-700 flex-1">{point}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Media Sosial & Kontak */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition shadow-2xs"
                  title="Kirim Email"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-[11px]">Email</span>
                </a>
              )}
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition shadow-2xs"
                  title="Profil LinkedIn"
                >
                  <LinkedInIcon className="w-3.5 h-3.5 text-[#0A66C2]" />
                  <span className="text-[11px]">LinkedIn</span>
                </a>
              )}
              {member.instagram && (
                <a
                  href={`https://instagram.com/${member.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition shadow-2xs"
                  title="Akun Instagram"
                >
                  <InstagramIcon className="w-3.5 h-3.5 text-rose-500" />
                  <span className="text-[11px]">{member.instagram}</span>
                </a>
              )}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="rounded-xl text-xs font-semibold px-4 border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer"
            >
              Tutup
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
