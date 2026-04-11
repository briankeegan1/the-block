import { useState, useCallback } from 'react';
import { Gavel, ShieldCheck, ArrowUp, Ban, Clock, ShoppingCart, CheckCircle, Trophy } from 'lucide-react';
import type { Vehicle } from '../types/vehicle';
import { formatCurrency, getAuctionStatus } from '../lib/format';
import ConfirmBidModal from './ConfirmBidModal';
import BuyNowModal from './BuyNowModal';
import Toast from './Toast';

interface Props {
  vehicle: Vehicle;
  currentBid: number;
  bidCount: number;
  userMaxBid: number | null;
  purchased: boolean;
  onPlaceBid: (amount: number) => { success: boolean; message: string };
  onBuyNow: () => void;
}

function getMinIncrement(price: number): number {
  if (price < 5000) return 100;
  if (price < 15000) return 250;
  if (price < 30000) return 500;
  return 1000;
}

export default function BidPanel({ vehicle, currentBid, bidCount, userMaxBid, purchased, onPlaceBid, onBuyNow }: Props) {
  const price = currentBid || vehicle.starting_bid;
  const auctionStatus = getAuctionStatus(vehicle.auction_start);
  const minBid = currentBid > 0
    ? price + getMinIncrement(price)
    : vehicle.starting_bid;
  const minInput = userMaxBid ? userMaxBid + getMinIncrement(userMaxBid) : minBid;

  const [bidAmount, setBidAmount] = useState(minInput.toString());
  const [showConfirm, setShowConfirm] = useState(false);
  const [showBuyNow, setShowBuyNow] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const quickBids = [
    minInput,
    minInput + getMinIncrement(minInput),
    minInput + getMinIncrement(minInput) * 3,
  ];

  const handleBidClick = () => {
    const amount = Number(bidAmount);
    if (isNaN(amount) || amount <= 0) {
      setToast({ type: 'error', message: 'Please enter a valid bid amount.' });
      return;
    }
    if (amount < minInput) {
      setToast({ type: 'error', message: `Minimum bid is ${formatCurrency(minInput)}.` });
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirm = useCallback(() => {
    const amount = Number(bidAmount);
    setShowConfirm(false);
    const result = onPlaceBid(amount);
    setToast({ type: result.success ? 'success' : 'error', message: result.message });

    if (result.success) {
      const newMin = amount + getMinIncrement(amount);
      setBidAmount(newMin.toString());
    }
  }, [bidAmount, onPlaceBid]);

  const reserveMet = price >= vehicle.reserve_price || (userMaxBid !== null && userMaxBid >= vehicle.reserve_price);

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {showConfirm && (
        <ConfirmBidModal
          amount={Number(bidAmount)}
          isIncrease={userMaxBid !== null}
          currentMaxBid={userMaxBid}
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {showBuyNow && vehicle.buy_now_price && (
        <BuyNowModal
          amount={vehicle.buy_now_price}
          vehicleName={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          onConfirm={() => {
            setShowBuyNow(false);
            onBuyNow();
            setToast({ type: 'success', message: `Purchased for ${formatCurrency(vehicle.buy_now_price!)}! This vehicle is now yours.` });
          }}
          onCancel={() => setShowBuyNow(false)}
        />
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        {/* Purchased state */}
        {purchased && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-emerald-800">Vehicle Purchased</p>
            <p className="text-xs text-emerald-600 mt-1">
              You bought this vehicle for {formatCurrency(price)}.
            </p>
          </div>
        )}

        {/* Current bid display */}
        {!purchased && (
          <div className="mb-4">
            <p className="text-sm text-muted font-medium">
              {auctionStatus === 'ended'
                ? 'Final Bid'
                : bidCount > 0 ? 'Current Bid' : 'Starting Bid'
              }
            </p>
            <p className="text-3xl font-bold text-navy">{formatCurrency(price)}</p>
            {bidCount > 0 && (
              <p className="text-sm text-slate-500 mt-1">{bidCount} bid{bidCount !== 1 ? 's' : ''}</p>
            )}
          </div>
        )}

        {/* Ended auction — won */}
        {auctionStatus === 'ended' && !purchased && userMaxBid !== null && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
            <Trophy className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-emerald-800">You Won This Auction!</p>
            <p className="text-xs text-emerald-600 mt-1">
              Winning bid: {formatCurrency(userMaxBid)}
            </p>
          </div>
        )}

        {/* Ended auction — no bid placed */}
        {auctionStatus === 'ended' && !purchased && userMaxBid === null && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <Ban className="w-6 h-6 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">Auction Ended</p>
            <p className="text-xs text-slate-500 mt-1">Bidding is closed for this vehicle.</p>
          </div>
        )}

        {/* Upcoming auction state */}
        {auctionStatus === 'upcoming' && !purchased && (
          <div className="p-4 bg-accent-bg border border-accent/20 rounded-xl text-center">
            <Clock className="w-6 h-6 text-accent mx-auto mb-2" />
            <p className="text-sm font-semibold text-navy">Auction Not Started</p>
            <p className="text-xs text-slate-500 mt-1">Bidding will open when the auction goes live.</p>
          </div>
        )}

        {/* Live auction — full bid UI */}
        {auctionStatus === 'live' && !purchased && (
          <>
            {/* User's active bid status */}
            {userMaxBid !== null && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="flex items-center gap-2 text-emerald-700">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-sm font-semibold">You're the high bidder</span>
                </div>
                <p className="text-xs text-emerald-600 mt-1">
                  Your max bid: {formatCurrency(userMaxBid)}
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
              <div className="mb-4">
                <button
                  onClick={() => setShowBuyNow(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full transition-all active:scale-[0.98]"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Buy Now — {formatCurrency(vehicle.buy_now_price)}
                </button>
                <p className="text-xs text-muted text-center mt-1.5">Skip bidding and purchase immediately</p>
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
                    onClick={() => setBidAmount(amount.toString())}
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
                    onChange={e => setBidAmount(e.target.value)}
                    min={minInput}
                    step={getMinIncrement(price)}
                    className="w-full pl-7 pr-3 py-2.5 text-sm border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
                  />
                </div>
                <button
                  onClick={handleBidClick}
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

              <p className="mt-3 text-xs text-muted text-center font-medium">
                Min increment: {formatCurrency(getMinIncrement(price))}
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
