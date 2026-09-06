import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { X, AlertOctagon, ShieldAlert, CheckCircle2 } from 'lucide-react';
import DropdownSelect from '@/components/ui/dropdown-select';

export default function IssueSPModal({ isOpen, onClose }) {
  const { ormawas, prokers, issueSP } = useStore();

  const [ormawaId, setOrmawaId] = useState('bem');
  const [prokerId, setProkerId] = useState('');
  const [level, setLevel] = useState(1);
  const [reason, setReason] = useState(
    'Keterlambatan penyerahan Laporan Pertanggungjawaban (LPJ) yang telah melampaui tenggat waktu H+14 dan belum mengindahkan peringatan berkala DPM.'
  );

  if (!isOpen) return null;

  // Filter proker berdasarkan ormawa yang dipilih
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
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-rose-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 shadow-xs">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded">
                Wewenang Eksekutif DPM
              </span>
              <h3 className="text-base font-bold text-slate-900 tracking-tight mt-0.5">
                Terbitkan Surat Peringatan (SP)
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Pilih Ormawa Tujuan */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">
              Ormawa yang Diberi Peringatan:
            </label>
            <DropdownSelect
              value={ormawaId}
              onChange={(val) => {
                setOrmawaId(val);
                setProkerId('');
              }}
              options={ormawas.filter(o => o.id !== 'dpm').map(o => ({
                value: o.id,
                label: `${o.name} (${o.shortName})`
              }))}
              triggerClassName="py-2.5 px-3.5 font-bold text-xs"
            />
          </div>

          {/* Pilih Proker Terkait */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">
              Program Kerja Terkait:
            </label>
            <DropdownSelect
              value={prokerId || (availableProkers[0]?.id || 'umum')}
              onChange={(val) => setProkerId(val)}
              options={[
                ...availableProkers.map(p => ({
                  value: p.id,
                  label: `${p.title} (${p.status === 'lpj_overdue' ? '🔴 KETERLAMBATAN LPJ' : p.startDate})`
                })),
                { value: 'umum', label: 'Pelanggaran Tupoksi Umum Organisasi' }
              ]}
              triggerClassName="py-2.5 px-3.5 text-xs font-medium"
            />
          </div>

          {/* Tingkat SP */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">
              Tingkat Surat Peringatan:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { lvl: 1, label: 'Teguran I (SP 1)', desc: 'Peringatan Awal' },
                { lvl: 2, label: 'SP 2', desc: 'Peringatan Keras' },
                { lvl: 3, label: 'SP 3', desc: 'Sanksi Anggaran' }
              ].map(item => (
                <button
                  key={item.lvl}
                  type="button"
                  onClick={() => setLevel(item.lvl)}
                  className={`p-2.5 rounded-xl border text-center transition ${
                    level === item.lvl
                      ? 'border-red-600 bg-red-50 text-red-700 font-bold shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="block font-bold text-xs">{item.label}</span>
                  <span className="block text-[10px] text-slate-600 mt-0.5">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Alasan & Dasar Pertimbangan */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">
              Alasan & Dasar Pertimbangan Hukum DPM:
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder=""
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Alert Konsekuensi */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-amber-800">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Surat Peringatan resmi ini akan tercatat dalam Rapor Kinerja Ormawa dan ditembuskan kepada <strong>Wakil Dekan Bidang Kemahasiswaan Fasilkom UMB</strong>.
            </p>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-700/20 transition active:scale-95"
            >
              Terbitkan Surat Resmi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
