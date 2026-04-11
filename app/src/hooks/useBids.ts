import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'the-block-bids';

interface BidState {
  maxBid: number;       // User's secret maximum bid
  currentBid: number;   // The visible "current bid" (proxy-elevated)
  bidCount: number;     // Total bid count including proxy bids
}

function loadBids(): Map<string, BidState> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return new Map(JSON.parse(stored));
  } catch { /* ignore */ }
  return new Map();
}

function saveBids(bids: Map<string, BidState>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...bids]));
}

function getMinIncrement(price: number): number {
  if (price < 5000) return 100;
  if (price < 15000) return 250;
  if (price < 30000) return 500;
  return 1000;
}

export function useBids() {
  const [bidStore, setBidStore] = useState<Map<string, BidState>>(loadBids);

  useEffect(() => {
    saveBids(bidStore);
  }, [bidStore]);

  const placeBid = useCallback((
    vehicleId: string,
    maxBidAmount: number,
    originalBid: number,
    originalCount: number
  ) => {
    const existing = bidStore.get(vehicleId);
    const currentBid = existing?.currentBid ?? originalBid;
    const currentCount = existing?.bidCount ?? originalCount;
    const existingMax = existing?.maxBid ?? 0;

    const minBid = currentBid + getMinIncrement(currentBid);

    // Can't bid below the minimum
    if (maxBidAmount < minBid) {
      return { success: false, message: `Minimum bid is $${minBid.toLocaleString()}` };
    }

    // If user already has a max bid, they can only increase it
    if (existingMax > 0 && maxBidAmount <= existingMax) {
      return {
        success: false,
        message: `Your current max bid is $${existingMax.toLocaleString()}. Enter a higher amount to increase it.`
      };
    }

    // Proxy bidding logic:
    // The "current bid" shown publicly is the minimum needed to be winning.
    // If there were other bidders, the price would be driven up to just above
    // the second-highest bid. Since we're single-user, the current bid advances
    // by one increment above the previous bid.
    const newCurrentBid = currentBid === 0
      ? Math.min(maxBidAmount, originalBid + getMinIncrement(originalBid))
      : currentBid + getMinIncrement(currentBid);

    // Current bid can't exceed the user's max
    const clampedCurrentBid = Math.min(newCurrentBid, maxBidAmount);

    setBidStore(prev => {
      const next = new Map(prev);
      next.set(vehicleId, {
        maxBid: maxBidAmount,
        currentBid: clampedCurrentBid,
        bidCount: (currentCount ?? originalCount) + 1,
      });
      return next;
    });

    const isExactBid = maxBidAmount === clampedCurrentBid;

    return {
      success: true,
      message: isExactBid
        ? `Bid of $${maxBidAmount.toLocaleString()} placed. You're the high bidder!`
        : `Max bid of $${maxBidAmount.toLocaleString()} set. Current bid is $${clampedCurrentBid.toLocaleString()} — your proxy will bid up to your max if others bid.`
    };
  }, [bidStore]);

  const getCurrentBid = useCallback((vehicleId: string, originalBid: number): number => {
    return bidStore.get(vehicleId)?.currentBid ?? originalBid;
  }, [bidStore]);

  const getBidCount = useCallback((vehicleId: string, originalCount: number): number => {
    return bidStore.get(vehicleId)?.bidCount ?? originalCount;
  }, [bidStore]);

  const getUserMaxBid = useCallback((vehicleId: string): number | null => {
    return bidStore.get(vehicleId)?.maxBid ?? null;
  }, [bidStore]);

  return { placeBid, getCurrentBid, getBidCount, getUserMaxBid };
}
