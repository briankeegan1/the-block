import { useState } from 'react';
import { Gavel, Check, AlertCircle } from 'lucide-react';
import type { Vehicle } from '../types/vehicle';
import { formatCurrency } from '../lib/format';

interface Props {
  vehicle: Vehicle;
  currentBid: number;
  bidCount: number;
  onPlaceBid: (amount: number) => { success: boolean; message: string };
}

export default function BidPanel({ vehicle, currentBid, bidCount, onPlaceBid }: Props) {
  const price = currentBid || vehicle.starting_bid;
  const minBid = price + getMinIncrement(price);

  const [bidAmount, setBidAmount] = useState(minBid.toString());
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const quickBids = [
    minBid,
    price + getMinIncrement(price) * 2,
    price + getMinIncrement(price) * 5,
  ];

  const handleBid = () => {
    const amount = Number(bidAmount);
    if (isNaN(amount) || amount < minBid) {
      setFeedback({ type: 'error', message: `Minimum bid is ${formatCurrency(minBid)}` });
      return;
    }
    const result = onPlaceBid(amount);
    setFeedback({ type: result.success ? 'success' : 'error', message: result.message });

    if (result.success) {
      const newMin = amount + getMinIncrement(amount);
      setBidAmount(newMin.toString());
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5">
      <div className="mb-4">
        <p className="text-sm text-slate-500">{bidCount > 0 ? 'Current Bid' : 'Starting Bid'}</p>
        <p className="text-3xl font-bold text-slate-900">{formatCurrency(price)}</p>
        {bidCount > 0 && (
          <p className="text-sm text-slate-500 mt-1">{bidCount} bid{bidCount !== 1 ? 's' : ''}</p>
        )}
      </div>

      {vehicle.buy_now_price && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-700 font-medium">
            Buy Now: {formatCurrency(vehicle.buy_now_price)}
          </p>
        </div>
      )}

      {vehicle.reserve_price > price && (
        <p className="text-xs text-slate-400 mb-3">Reserve not yet met</p>
      )}

      {/* Quick bid buttons */}
      <div className="flex gap-2 mb-3">
        {quickBids.map(amount => (
          <button
            key={amount}
            onClick={() => setBidAmount(amount.toString())}
            className="flex-1 py-1.5 text-sm border border-slate-200 rounded-lg hover:border-amber-400 hover:bg-amber-50 transition"
          >
            {formatCurrency(amount)}
          </button>
        ))}
      </div>

      {/* Custom bid input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
          <input
            type="number"
            value={bidAmount}
            onChange={e => { setBidAmount(e.target.value); setFeedback(null); }}
            min={minBid}
            step={getMinIncrement(price)}
            className="w-full pl-7 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <button
          onClick={handleBid}
          className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition"
        >
          <Gavel className="w-4 h-4" />
          Place Bid
        </button>
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={`mt-3 flex items-center gap-2 text-sm p-2 rounded-lg ${
          feedback.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
        }`}>
          {feedback.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {feedback.message}
        </div>
      )}

      <p className="mt-3 text-xs text-slate-400 text-center">
        Min increment: {formatCurrency(getMinIncrement(price))}
      </p>
    </div>
  );
}

function getMinIncrement(currentPrice: number): number {
  if (currentPrice < 5000) return 100;
  if (currentPrice < 15000) return 250;
  if (currentPrice < 30000) return 500;
  return 1000;
}
