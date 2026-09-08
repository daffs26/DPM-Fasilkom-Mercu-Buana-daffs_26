import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { ExternalLink } from 'lucide-react';
import { formatRupiah } from '../../../utils/formatters';

export default function AnggaranReceiptModal({ receiptPreviewData, onClose }) {
  if (!receiptPreviewData) return null;

  return (
    <Dialog open={!!receiptPreviewData} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] sm:max-w-lg p-0 overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-2xl max-h-[92vh] flex flex-col">
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-5 pb-3 border-b border-slate-100 bg-slate-50/70 space-y-1 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Bukti Kwitansi / Nota
            </span>
            <span className="text-xs font-mono font-bold text-slate-500">
              {receiptPreviewData?.receiptNumber}
            </span>
          </div>
          <DialogTitle className="text-base font-extrabold text-slate-900 tracking-tight">
            {receiptPreviewData?.title}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Bukti foto resmi yang diunggah untuk pencatatan transaksi kas ini.
          </DialogDescription>
        </DialogHeader>

        <div className="px-4 sm:px-6 py-4 space-y-4 max-h-[calc(85vh-140px)] overflow-y-auto">
          {/* Foto Kwitansi / Nota Display */}
          {receiptPreviewData?.receiptPhoto && (
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100/60 p-1 flex items-center justify-center">
              <img 
                src={receiptPreviewData.receiptPhoto} 
                alt="Foto Kwitansi / Nota" 
                className="w-full h-auto max-h-[50vh] object-contain rounded-xl shadow-xs" 
              />
            </div>
          )}

          {/* Rincian Transaksi */}
          <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/70 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">Jumlah Uang:</span>
              <span className="font-extrabold text-slate-900 text-sm">
                {formatRupiah(receiptPreviewData?.nominal)}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">Tanggal Transaksi:</span>
              <span className="font-bold text-slate-800 text-xs">
                {receiptPreviewData?.date}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">Penanggung Jawab:</span>
              <span className="font-semibold text-slate-800 text-xs">
                {receiptPreviewData?.pic}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">Asal Sumber Dana:</span>
              <span className="font-semibold text-slate-800 text-xs">
                {receiptPreviewData?.category}
              </span>
            </div>
            {receiptPreviewData?.notes && (
              <div className="col-span-1 sm:col-span-2 pt-2 border-t border-slate-200/70">
                <span className="text-[10px] text-slate-400 font-bold block">Catatan Tambahan:</span>
                <p className="text-slate-600 text-xs italic mt-0.5">{receiptPreviewData.notes}</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="px-4 sm:px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {receiptPreviewData?.receiptPhoto ? (
            <a
              href={receiptPreviewData.receiptPhoto}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center justify-center sm:justify-start gap-1.5 py-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka Gambar Ukuran Penuh</span>
            </a>
          ) : <div />}
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition shadow-xs cursor-pointer text-center"
          >
            Tutup
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
