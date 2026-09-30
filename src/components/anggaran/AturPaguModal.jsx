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
      <DialogContent className="w-[95vw] sm:max-w-lg p-0 overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-2xl max-h-[92vh] flex flex-col">
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-5 pb-3 border-b border-slate-100 bg-slate-50/70 space-y-1 shrink-0">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-bold bg-white text-emerald-700 border-emerald-200">
              Alokasi Anggaran
            </Badge>
            <span className="text-xs text-slate-500 font-medium">Regulasi Anggaran DPM FASILKOM</span>
          </div>
          <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Atur Alokasi Anggaran Ormawa
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-600">
            Tentukan batas alokasi anggaran dana kemahasiswaan per ormawa untuk periode kepengurusan berjalan.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-4 sm:px-6 pt-3 pb-6 space-y-4 text-xs max-h-[calc(92vh-120px)] overflow-y-auto">
          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Coins className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">
                  Total Alokasi Anggaran Fasilkom
                </span>
                <span className="font-extrabold text-sm text-blue-950">
                  Rp {calculateTotal().toLocaleString('id-ID')}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {ormawas.length} Ormawa
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {ormawas.map(o => (
              <div key={o.id} className="p-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 p-0.5 shrink-0 flex items-center justify-center">
                      <img src={o.logo} alt={o.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-slate-900 truncate">{o.name}</h4>
                      <p className="text-[10px] text-slate-500">{o.type}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-md shrink-0">
                    Serapan: Rp {(o.serapanAnggaran || 0).toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                    Rp
                  </span>
                  <input
                    type="text"
                    value={paguValues[o.id] || ''}
                    onChange={(e) => handleInputChange(o.id, e.target.value)}
                    placeholder="0"
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>
            ))}
          </div>

          <DialogFooter className="pt-3 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition text-center cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto justify-center px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition flex items-center gap-1.5 text-center cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Simpan Alokasi Anggaran</span>
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
