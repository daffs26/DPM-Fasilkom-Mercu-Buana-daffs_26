import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { useShallow } from 'zustand/react/shallow';
import DropdownSelect from '@/components/ui/dropdown-select';
import { 
  X, 
  AlertOctagon, 
  ShieldAlert 
} from 'lucide-react';
import { canPrintSP } from '@/utils/permissions';

/**
 * TerbitkanSPModal (Wewenang Legislatif Khusus Pimpinan DPM: Ketua & Wakil)
 */
export function TerbitkanSPModal({ isOpen, onClose }) {
  const { ormawas, prokers, issueSP, currentUser } = useStore(useShallow(state => ({ 
    ormawas: state.ormawas, 
    prokers: state.prokers, 
    issueSP: state.issueSP,
    currentUser: state.currentUser
  })));

  const [ormawaId, setOrmawaId] = useState('bem');
  const [prokerId, setProkerId] = useState('');
  const [level, setLevel] = useState(1);
  const [reason, setReason] = useState(
    'Keterlambatan penyerahan Laporan Pertanggungjawaban (LPJ) yang telah melampaui tenggat waktu H+14 dan belum mengindahkan peringatan berkala DPM.'
  );

  if (!isOpen) return null;

  const canPrint = canPrintSP(currentUser?.role, currentUser?.ormawaId);
  if (!canPrint) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
        <div className="bg-white w-full max-w-md rounded-3xl p-6 text-center border border-slate-100 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Akses Khusus Pimpinan DPM</h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Wewenang mencetak dan menerbitkan Surat Peringatan (SP) secara resmi hanya dapat dilakukan oleh <strong>Ketua</strong> dan <strong>Wakil Ketua DPM FASILKOM</strong>.
          </p>
          <div className="mt-5">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Mengerti &amp; Tutup
            </button>
          </div>
        </div>
      </div>
    );
  }

  const availableProkers = prokers.filter(p => p.ormawaId === ormawaId);
  const selectedProker = prokers.find(p => p.id === prokerId) || availableProkers[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    const targetProker = selectedProker || { id: 'umum', title: 'Kedisiplinan Organisasi' };

    issueSP({
      ormawaId,
      prokerId: targetProker.id,
      prokerTitle: targetProker.title,
      level: Number(level),
      reason
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-rose-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 shadow-xs">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded">
                Pimpinan DPM (Ketua &amp; Wakil)
              </span>
              <h3 className="text-base font-bold text-slate-900 tracking-tight mt-0.5">
                Cetak &amp; Terbitkan Surat Peringatan (SP)
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">Ormawa Penerima SP:</label>
            <DropdownSelect
              value={ormawaId}
              onChange={(val) => {
                setOrmawaId(val);
                setProkerId('');
              }}
              options={ormawas.filter(o => o.id !== 'dpm').map(o => ({
                value: o.id,
                label: o.name
              }))}
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1.5">Terkait Program Kerja:</label>
            <DropdownSelect
              value={prokerId || (availableProkers[0]?.id || '')}
              onChange={(val) => setProkerId(val)}
              options={
                availableProkers.length > 0 
                  ? availableProkers.map(p => ({
                      value: p.id,
                      label: `${p.title} (${p.status})`
                    }))
                  : [{ value: '', label: 'Umum / Kedisiplinan Organisasi' }]
              }
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1.5">Tingkatan Sanksi SP:</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: 1, label: 'SP 1 (Peringatan Awal)', badge: 'bg-amber-100 text-amber-800' },
                { val: 2, label: 'SP 2 (Teguran Keras)', badge: 'bg-orange-100 text-orange-800' },
                { val: 3, label: 'SP 3 (Pembekuan Anggaran)', badge: 'bg-rose-100 text-rose-800' }
              ].map(item => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => setLevel(item.val)}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition cursor-pointer ${
                    level === item.val
                      ? 'border-rose-500 bg-rose-50/40 ring-2 ring-rose-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <span className="font-bold text-slate-800">{`Tingkat ${item.val}`}</span>
                  <span className="text-[10px] text-slate-500 mt-1">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1.5">Alasan Penerbitan &amp; Pertimbangan DPM:</label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-amber-800">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Surat Peringatan resmi ini akan tercatat dalam Rapor Kinerja Ormawa dan diteruskan ke pihak kemahasiswaan fakultas.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-700/20 transition active:scale-95 cursor-pointer"
            >
              Cetak &amp; Terbitkan Surat Peringatan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TerbitkanSPModal;
