import React from 'react';
import { X, Printer } from 'lucide-react';
import PrintRekapAnggaran from './print-templates/PrintRekapAnggaran';
import PrintSuratPeringatan from './print-templates/PrintSuratPeringatan';
import PrintRundown from './print-templates/PrintRundown';
import PrintBeritaAcaraAudit from './print-templates/PrintBeritaAcaraAudit';

export default function PrintDocModal({ isOpen, onClose, documentData }) {
  if (!isOpen || !documentData) return null;

  const handlePrint = () => {
    window.print();
  };

  const isSP = documentData.type === 'sp';
  const isRundown = documentData.type === 'rundown';
  const isRekapAnggaran = documentData.type === 'rekap_anggaran';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
      <div className={`bg-white w-[96vw] rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[95vh] flex flex-col ${
        isRekapAnggaran ? 'sm:max-w-4xl' : 'sm:max-w-3xl'
      }`}>
        {/* Modal Top Bar (Hidden on print) */}
        <div className="p-3 sm:p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 no-print gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-bold text-slate-700 truncate">
              {isRundown 
                ? 'Pratinjau Dokumen Rundown Acara Resmi' 
                : isRekapAnggaran
                ? 'Pratinjau Laporan Rekapitulasi Anggaran & LPJ Semester (DPM FASILKOM)'
                : 'Pratinjau Dokumen Resmi DPM Fasilkom'}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-800 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Paper */}
        <div className="p-4 sm:p-8 md:p-12 overflow-y-auto bg-white text-slate-900 font-sans print-page">
          {/* Official Kop Surat DPM FASILKOM UMB */}
          <div className="flex items-center justify-between pb-3 sm:pb-4 border-b-2 sm:border-b-4 border-double border-slate-900 gap-2 sm:gap-4">
            <div className="w-14 h-14 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center">
              <img 
                src="/logos/logo-dpm.png" 
                alt="Logo DPM Fasilkom UMB" 
                className="w-full h-full object-contain" 
              />
            </div>
            <div className="text-center flex-1 px-1 sm:px-4">
              <h2 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-red-700">
                UNIVERSITAS MERCU BUANA
              </h2>
              <h1 className="text-xs sm:text-base font-extrabold tracking-tight uppercase text-slate-900 mt-0.5 leading-snug">
                DEWAN PERWAKILAN MAHASISWA FAKULTAS ILMU KOMPUTER
              </h1>
              <p className="text-[9px] sm:text-[10px] text-slate-600 font-medium mt-0.5 hidden sm:block">
                Gedung Kuliah Terpadu Lantai 3, Jl. Meruya Selatan No. 1, Kembangan, Jakarta Barat 11650
              </p>
              <p className="text-[8px] sm:text-[10px] text-slate-600">
                Email: dpm.fasilkom@mercubuana.ac.id • Laman: dpm-fasilkom.mercubuana.ac.id
              </p>
            </div>
          </div>

          {/* Isi Dokumen Berdasarkan Tipe */}
          {isRekapAnggaran ? (
            <PrintRekapAnggaran documentData={documentData} />
          ) : isSP ? (
            <PrintSuratPeringatan documentData={documentData} />
          ) : isRundown ? (
            <PrintRundown documentData={documentData} />
          ) : (
            <PrintBeritaAcaraAudit documentData={documentData} />
          )}
        </div>
      </div>
    </div>
  );
}
