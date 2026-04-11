import { useState } from 'react';
import { Gavel, Check, AlertCircle, ShieldCheck, ArrowUp } from 'lucide-react';
import type { Vehicle } from '../types/vehicle';
import { formatCurrency } from '../lib/format';

interface Props {
  vehicle: Vehicle;
  currentBid: number;
  bidCount: number;
  userMaxBid: number | null;
  onPlaceBid: (amount: number) => { success: boolean; message: string };
}

function getMinIncrement(price: number): number {
  if (price < 5000) return 100;
  if (price < 15000) return 250;
  if (price < 30000) return 500;
  return 1000;
}

export default function BidPanel({ vehicle, currentBid, bidCount, userMaxBid, onPlaceBid }: Props) {
  const price = currentBid || vehicle.starting_bid;
  const minBid = price + getMinIncrement(price);
  const minInput = userMaxBid ? userMaxBid + getMinIncrement(userMaxBid) : minBid;

  const [bidAmount, setBidAmount] = useState(minInput.toString());
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const quickBids = [
    minInput,
    minInput + getMinIncrement(minInput),
    minInput + getMinIncrement(minInput) * 3,
  ];

  const handleBid = () => {
    const amount = Number(bidAmount);
    if (isNaN(amount) || amount <= 0) {
      setFeedback({ type: 'error', message: 'Enter a valid bid amount' });
      return;
    }
    const result = onPlaceBid(amount);
    setFeedback({ type: result.success ? 'success' : 'error', message: result.message });

    if (result.success) {
      // Update the input to the next possible increase
      const newMin = amount + getMinIncrement(amount);
      setBidAmount(newMin.toString());
    }
  };

  const reserveMet = price >= vehicle.reserve_price || (userMaxBid !== null && userMaxBid >= vehicle.reserve_price);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      {/* Current bid display */}
      <div className="mb-4">
        <p className="text-sm text-muted font-medium">{bidCount > 0 ? 'Current Bid' : 'Starting Bid'}</p>
        <p className="text-3xl font-bold text-navy">{formatCurrency(price)}</p>
        {bidCount > 0 && (
          <p className="text-sm text-slate-500 mt-1">{bidCount} bid{bidCount !== 1 ? 's' : ''}</p>
        )}
      </div>

      {/* User's active bid status */}
      {userMaxBid !== null && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl animate-fade-in">
          <div className="flex items-center gap-2 text-emerald-700">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-sm font-semibold">You're the high bidder</span>
          </div>
          <p className="text-xs text-emerald-600 mt-1">
            Your max bid: {formatCurrency(userMaxBid)}
          </p>
          <p className="text-xs text-emerald-500 mt-0.5">
            Proxy bidding will auto-bid up to your max if others bid.
          </p>
        </div>
      )}

      {/* Reserve status */}
      {!reserveMet && (
        <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-700 font-medium">Reserve not yet met</p>
        </div>
      )}
      {reserveMet && bidCount > 0 && (
        <div className="mb-3 p-2 bg-emerald-50 border border-emerald-200 rounded-lg">
          <p className="text-xs text-emerald-700 font-medium">Reserve met</p>
        </div>
      )}

      {/* Buy Now option */}
      {vehicle.buy_now_price && (
        <div className="mb-4 p-3 bg-accent-bg border border-accent/20 rounded-xl">
          <p className="text-sm text-accent font-semibold">
            Buy Now: {formatCurrency(vehicle.buy_now_price)}
          </p>
          <p className="text-xs text-accent/70 mt-0.5">Skip bidding and purchase immediately</p>
        </div>
      )}

      {/* Bid input section */}
      <div className="border-t border-slate-100 pt-4">
        <label className="text-sm font-semibold text-navy block mb-2">
          {userMaxBid ? 'Increase Your Max Bid' : 'Your Max Bid'}
        </label>
        <p className="text-xs text-slate-500 mb-3">
          {userMaxBid
            ? 'Enter a higher maximum. The current bid will only rise if others bid against you.'
            : 'Enter the most you\'re willing to pay. We\'ll bid the minimum needed to keep you ahead.'
          }
        </p>

        {/* Quick bid buttons */}
        <div className="flex gap-2 mb-3">
          {quickBids.map(amount => (
            <button
              key={amount}
              onClick={() => { setBidAmount(amount.toString()); setFeedback(null); }}
              className="flex-1 py-1.5 text-sm border border-slate-200 rounded-full hover:border-accent hover:bg-accent-bg hover:text-accent transition font-medium"
            >
              {formatCurrency(amount)}
            </button>
          ))}
        </div>

        {/* Custom bid input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">$</span>
            <input
              type="number"
              value={bidAmount}
              onChange={e => { setBidAmount(e.target.value); setFeedback(null); }}
              min={minInput}
              step={getMinIncrement(price)}
              className="w-full pl-7 pr-3 py-2.5 text-sm border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
            />
          </div>
          <button
            onClick={handleBid}
            className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-white font-semibold rounded-full transition-all active:scale-95"
          >
            {userMaxBid ? (
              <>
                <ArrowUp className="w-4 h-4" />
                Increase
              </>
            ) : (
              <>
                <Gavel className="w-4 h-4" />
                Place Bid
              </>
            )}
          </button>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className={`mt-3 flex items-start gap-2 text-sm p-3 rounded-xl animate-fade-in ${
            feedback.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
          }`}>
            {feedback.type === 'success' ? <Check className="w-4 h-4 mt-0.5 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />}
            {feedback.message}
          </div>
        )}

        <p className="mt-3 text-xs text-muted text-center font-medium">
          Min increment: {formatCurrency(getMinIncrement(price))}
        </p>
      </div>
    </div>
  );
}
