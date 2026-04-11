import { ShoppingCart, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../lib/format';

interface Props {
  amount: number;
  vehicleName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function BuyNowModal({ amount, vehicleName, onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-slide-up">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-lg font-bold text-navy">Buy Now</h3>
        </div>

        <p className="text-sm text-slate-600 mb-3">
          You are purchasing <span className="font-semibold text-navy">{vehicleName}</span> at the Buy Now price.
        </p>

        <div className="bg-surface rounded-xl p-4 mb-4">
          <p className="text-sm text-slate-500 font-medium">Purchase Price</p>
          <p className="text-2xl font-bold text-navy">{formatCurrency(amount)}</p>
        </div>

        <div className="flex items-start gap-2 mb-5 p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-700">
            This is a binding purchase at the listed price. The auction will end immediately and the vehicle will be marked as sold to you.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 text-sm font-semibold border border-slate-200 rounded-full hover:bg-surface transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition-all active:scale-95"
          >
            Confirm Purchase
          </button>
        </div>
      </div>
    </div>
  );
}
