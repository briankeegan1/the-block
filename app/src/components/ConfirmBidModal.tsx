import { AlertTriangle, Gavel, ArrowUp } from 'lucide-react';
import { formatCurrency } from '../lib/format';

interface Props {
  amount: number;
  isIncrease: boolean;
  currentMaxBid: number | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmBidModal({ amount, isIncrease, currentMaxBid, onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-slide-up">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-accent-bg flex items-center justify-center">
            {isIncrease
              ? <ArrowUp className="w-5 h-5 text-accent" />
              : <Gavel className="w-5 h-5 text-accent" />
            }
          </div>
          <h3 className="text-lg font-bold text-navy">
            {isIncrease ? 'Increase Max Bid' : 'Confirm Your Bid'}
          </h3>
        </div>

        <div className="bg-surface rounded-xl p-4 mb-4">
          <p className="text-sm text-slate-500 font-medium">
            {isIncrease ? 'New max bid' : 'Your max bid'}
          </p>
          <p className="text-2xl font-bold text-navy">{formatCurrency(amount)}</p>
          {isIncrease && currentMaxBid && (
            <p className="text-xs text-muted mt-1">
              Previously: {formatCurrency(currentMaxBid)}
            </p>
          )}
        </div>

        <div className="flex items-start gap-2 mb-5 p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-700">
            Once placed, this bid cannot be retracted or reduced. You are committing to purchase this vehicle at up to this amount if you win the auction.
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
            className="flex-1 py-2.5 text-sm font-semibold bg-accent hover:bg-accent-hover text-white rounded-full transition-all active:scale-95"
          >
            {isIncrease ? 'Confirm Increase' : 'Place Bid'}
          </button>
        </div>
      </div>
    </div>
  );
}
