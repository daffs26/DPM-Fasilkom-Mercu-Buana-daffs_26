import React from 'react';
import { Card } from '@/components/ui/card';
import { Clock } from 'lucide-react';

export default function DashboardActivityFeed({ activityLogs, ormawas }) {
  return (
    <Card className="rounded-3xl p-5 sm:p-6 border-slate-200/80 shadow-soft flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <h3 className="font-extrabold text-slate-900 text-sm">Aktivitas &amp; Log Audit</h3>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        </div>

        <div className="mt-4 space-y-3.5">
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
              const isDeleted = log.type === 'proker_deleted';
              const isAdded = log.type === 'proker_added';
              return (
                <div key={log.id} className="flex items-start gap-2.5 text-xs">
                  <div className="w-7 h-7 rounded-xl bg-slate-50 border border-slate-200 p-0.5 shrink-0 flex items-center justify-center mt-0.5">
                    <img src={ormawa?.logo} alt={ormawa?.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="overflow-hidden flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="font-bold text-slate-900 text-xs line-clamp-1">{log.title}</p>
                      {isDeleted && (
                        <span className="text-[9px] font-extrabold px-1.5 py-0.2 bg-rose-50 text-rose-600 border border-rose-200 rounded-md">
                          Dihapus
                        </span>
                      )}
                      {isAdded && (
                        <span className="text-[9px] font-extrabold px-1.5 py-0.2 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-md">
                          Dibuat
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{log.description}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">{log.timestamp}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 mt-4 text-center">
        <span className="text-[10px] text-slate-500 font-medium">
          Semua aksi DPM &amp; ormawa tercatat secara permanen.
        </span>
      </div>
    </Card>
  );
}
