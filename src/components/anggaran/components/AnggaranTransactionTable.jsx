import React from 'react';
import { 
  Receipt, 
  ArrowDownRight, 
  ArrowUpRight, 
  FileImage, 
  Eye, 
  Trash2 
} from 'lucide-react';
import { formatRupiah, getTransactionTypeBadge } from '../../../utils/formatters';

export default function AnggaranTransactionTable({
  filteredTransactions,
  ormawas,
  deleteBudgetTransaction,
  setReceiptPreviewData
}) {
  if (filteredTransactions.length === 0) {
    return (
      <div className="py-10 text-center bg-slate-50/50 rounded-2xl border border-slate-200/80 p-6">
        <Receipt className="w-10 h-10 text-slate-400 mx-auto mb-2" />
        <h4 className="text-xs font-bold text-slate-800">Belum Ada Riwayat Transaksi Anggaran</h4>
        <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
          Klik tombol <strong>"Input Kas"</strong> di atas untuk mencatat pencairan termin proker atau dana operasional kas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {filteredTransactions.map((tx) => {
        const ormawa = ormawas.find(o => o.id === tx.ormawaId);
        const isExpense = ['termin1', 'termin2', 'operasional', 'lainnya'].includes(tx.type);
        const typeBadge = getTransactionTypeBadge(tx.type);

        return (
          <div 
            key={`tx-item-${tx.id}`}
            className="p-3 sm:p-3.5 rounded-2xl border border-slate-200/80 bg-white hover:bg-slate-50/60 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
          >
            <div className="flex items-start sm:items-center gap-3 min-w-0">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 ${
                isExpense ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
              }`}>
                {isExpense ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bold text-xs text-slate-900 leading-tight">{tx.title}</h4>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${typeBadge.color}`}>
                    {typeBadge.label}
                  </span>
                  <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                    {tx.receiptNumber}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  <strong>{ormawa?.shortName}</strong> • {tx.date} • PJ: {tx.pic} • Sumber: {tx.category}
                </p>
                {tx.notes && (
                  <p className="text-[10px] text-slate-400 italic mt-0.5">{tx.notes}</p>
                )}

                {/* Tombol Lihat Foto Kwitansi / Nota */}
                <div className="pt-1.5 flex items-center gap-2">
                  {tx.receiptPhoto ? (
                    <button
                      type="button"
                      onClick={() => setReceiptPreviewData(tx)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[10px] border border-blue-200/80 transition shadow-2xs cursor-pointer"
                    >
                      <FileImage className="w-3.5 h-3.5" />
                      <span>Lihat Foto Kwitansi / Nota</span>
                      <Eye className="w-3 h-3 ml-0.5 text-blue-500" />
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Receipt className="w-3 h-3 text-slate-300" />
                      <span>Tanpa Bukti Foto</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <div className="text-left sm:text-right">
                <span className={`font-black text-xs sm:text-sm block ${
                  isExpense ? 'text-slate-900' : 'text-emerald-700'
                }`}>
                  {isExpense ? '- ' : '+ '}{formatRupiah(tx.nominal)}
                </span>
                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                  Tercatat di Kas
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Hapus pencatatan transaksi "${tx.title}"?`)) {
                    deleteBudgetTransaction(tx.id);
                  }
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                title="Hapus Transaksi"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
