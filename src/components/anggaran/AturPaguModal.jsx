import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Coins, CheckCircle2, Building2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useShallow } from 'zustand/react/shallow';

export default function SetPaguModal({ isOpen, onClose }) {
  const { ormawas, updateOrmawaPagu } = useStore(useShallow(state => ({ ormawas: state.ormawas, updateOrmawaPagu: state.updateOrmawaPagu })));

  // Local state for each ormawa pagu input
  const [paguValues, setPaguValues] = useState({});

  useEffect(() => {
    if (isOpen) {
      const initial = {};
      ormawas.forEach(o => {
        initial[o.id] = (o.paguAnggaran || 0).toLocaleString('id-ID');
      });
      setPaguValues(initial);
    }
  }, [isOpen, ormawas]);

  if (!isOpen) return null;

  const handleInputChange = (id, rawVal) => {
    const numeric = rawVal.replace(/\D/g, '');
    if (!numeric) {
      setPaguValues(prev => ({ ...prev, [id]: '' }));
    } else {
      setPaguValues(prev => ({
        ...prev,
        [id]: Number(numeric).toLocaleString('id-ID')
      }));
    }
  };

  const calculateTotal = () => {
    return Object.values(paguValues).reduce((acc, curr) => {
      const num = Number(String(curr).replace(/\D/g, '')) || 0;
      return acc + num;
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    ormawas.forEach(o => {
      const raw = paguValues[o.id] || '0';
      const num = Number(String(raw).replace(/\D/g, '')) || 0;
      updateOrmawaPagu(o.id, num);
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] sm:max-w-lg p-0 overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-2xl max-h-[92dvh] flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Header Sticky */}
          <DialogHeader className="px-5 sm:px-6 py-4 border-b border-slate-100 bg-white shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Atur Alokasi Anggaran
              </DialogTitle>
              <Badge variant="outline" className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border-emerald-200">
                Pagu Ormawa
              </Badge>
            </div>
            <DialogDescription className="sr-only">
              Form pengaturan alokasi anggaran ormawa
            </DialogDescription>
          </DialogHeader>

          {/* Body Scrollable */}
          <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-3.5 text-xs">
            <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Coins className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-medium block">
                    Total Anggaran Fasilkom
                  </span>
                  <span className="font-bold text-sm text-blue-950">
                    Rp {calculateTotal().toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100/70 text-blue-800">
                {ormawas.length} Ormawa
              </span>
            </div>

            <div className="space-y-2.5">
              {ormawas.map(o => (
                <div key={o.id} className="p-2.5 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <img src={o.logo} alt="" className="w-5 h-5 object-contain shrink-0" />
                      <span className="font-semibold text-xs text-slate-900 truncate">{o.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded shrink-0">
                      Serapan: Rp {(o.serapanAnggaran || 0).toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-xs">
                      Rp
                    </span>
                    <input
                      type="text"
                      value={paguValues[o.id] || ''}
                      onChange={(e) => handleInputChange(o.id, e.target.value)}
                      placeholder="0"
                      className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 h-9 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sticky Modal Footer */}
          <div className="px-5 sm:px-6 py-3 border-t border-slate-100 bg-white shrink-0 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl font-semibold h-9 px-4 bg-red-600 hover:bg-red-700 text-white shadow-none cursor-pointer active:scale-95 transition text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-xl font-semibold h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white shadow-none cursor-pointer active:scale-95 flex items-center gap-1.5 transition text-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Simpan Alokasi</span>
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
