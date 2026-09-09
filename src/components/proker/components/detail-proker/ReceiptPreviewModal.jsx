import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Receipt } from 'lucide-react';
import { formatRupiah } from '@/utils/formatters';

export default function ReceiptPreviewModal({ previewRabReceipt, onClose }) {
  if (!previewRabReceipt) return null;

  return (
    <Dialog open={!!previewRabReceipt} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[92vw] sm:max-w-md p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-2xl">
        <DialogHeader className="pb-2 border-b border-slate-100">
          <DialogTitle className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-600" />
            <span>Bukti Pembayaran: {previewRabReceipt.pos}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Nominal Biaya: {formatRupiah(previewRabReceipt.subtotal)}
          </DialogDescription>
        </DialogHeader>

        <div className="py-3 flex items-center justify-center">
          {previewRabReceipt.photo && String(previewRabReceipt.photo).startsWith('data:image') ? (
            <img 
              src={previewRabReceipt.photo} 
              alt={previewRabReceipt.name} 
              className="max-h-80 w-auto rounded-xl object-contain border border-slate-200 shadow-xs"
            />
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 w-full">
              <Receipt className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-800">{previewRabReceipt.name}</p>
              <p className="text-[11px] text-slate-500 mt-1">Dokumen bukti pembayaran terlampir sah</p>
            </div>
          )}
        </div>

        <DialogFooter className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition cursor-pointer text-center"
          >
            Tutup Pratinjau
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
