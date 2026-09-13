import React from 'react';
import { Card } from '@/components/ui/card';
import { Clock, ShieldCheck } from 'lucide-react';

export default function DashboardActivityFeed({ activityLogs, ormawas }) {
  // Helper untuk menentukan badge status dan styling warna yang harmonis
  const getLogMeta = (log) => {
    if (log.type === 'proker_deleted') {
      return {
        badgeText: 'Dihapus',
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-200'
      };
    }
    if (log.type === 'proker_added') {
      return {
        badgeText: 'Dibuat',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200'
      };
    }
    if (log.title?.toLowerCase().includes('audit')) {
      return {
        badgeText: 'Audit Selesai',
        badgeClass: 'bg-blue-50 text-blue-700 border-blue-200'
      };
    }
    if (log.title?.toLowerCase().includes('revisi') || log.type?.includes('revisi')) {
      return {
        badgeText: 'Revisi',
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-200'
      };
    }
    return {
      badgeText: 'Log Audit',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200'
    };
  };

  return (
    <Card className="rounded-3xl p-5 sm:p-6 border-slate-200/80 shadow-soft flex flex-col justify-between">
      <div>
        {/* Header Section */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-slate-900 text-sm tracking-normal">
              Aktivitas &amp; Log Audit
            </h3>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Log</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="mt-4 space-y-2.5">
          {activityLogs.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 ring-8 ring-blue-50/50 flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h4 className="text-sm font-extrabold text-slate-900">Belum Ada Aktivitas</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 font-normal">
                Seluruh pencatatan review proposal dan audit LPJ ormawa akan terekam secara otomatis di sini.
              </p>
            </div>
          ) : (
            activityLogs.slice(0, 5).map((log) => {
              const ormawa = ormawas.find(o => o.id === log.ormawaId);
              const meta = getLogMeta(log);

              return (
                <div 
                  key={log.id} 
                  className="p-3 rounded-2xl bg-slate-50/50 hover:bg-slate-50/90 border border-slate-200/70 hover:border-slate-300 transition-all duration-150 flex items-start gap-3"
                >
                  {/* Logo Ormawa dengan Fallback */}
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/90 p-1 shrink-0 flex items-center justify-center shadow-2xs mt-0.5 overflow-hidden">
                    {ormawa?.logo ? (
                      <img 
                        src={ormawa.logo} 
                        alt={ormawa.name || 'Ormawa'} 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="text-[10px] font-black text-slate-600 uppercase">
                        {ormawa?.shortName?.slice(0, 2) || 'OR'}
                      </span>
                    )}
                  </div>
                  
                  {/* Konten Log */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-slate-900 text-xs leading-snug break-words">
                        {log.title}
                      </h4>
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border shrink-0 tracking-wide uppercase ${meta.badgeClass}`}>
                        {meta.badgeText}
                      </span>
                    </div>
                    
                    <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2 mt-1 font-normal">
                      {log.description}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-2 pt-1.5 border-t border-slate-200/50 text-[10px] text-slate-400 font-medium">
                      <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{log.timestamp}</span>
                      {ormawa?.shortName && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="font-semibold text-slate-600">{ormawa.shortName}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-100 mt-4 text-center">
        <span className="text-[10px] text-slate-500 font-medium flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>Semua aksi DPM &amp; ormawa tercatat secara permanen</span>
        </span>
      </div>
    </Card>
  );
}
