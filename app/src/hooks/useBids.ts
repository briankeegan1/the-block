import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'the-block-bids';

interface BidState {
  maxBid: number;       // User's private maximum bid
  currentBid: number;   // Visible current bid (one increment above prior second-highest)
  bidCount: number;     // Only increments once when user first places a bid
  purchased?: boolean;  // True if user used Buy Now
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
    originalCount: number,
    startingBid: number
  ) => {
    const existing = bidStore.get(vehicleId);
    const existingMax = existing?.maxBid ?? 0;

    // Floor is whichever is higher: starting bid, or current bid + increment
    const floor = originalBid > 0
      ? originalBid + getMinIncrement(originalBid)
      : startingBid;
    if (maxBidAmount < floor) {
      return { success: false, message: `Minimum bid is $${floor.toLocaleString()}` };
    }

    // If user already has a max bid, they can only increase it
    if (existingMax > 0 && maxBidAmount <= existingMax) {
      return {
        success: false,
        message: `Your current max bid is $${existingMax.toLocaleString()}. Enter a higher amount to increase it.`
      };
    }

    const isFirstBid = !existing;

    // eBay model: current bid = one increment above the second-highest bidder.
    // The "second-highest bidder" is the original dataset bid (the last real bid
    // before we showed up). This never changes — no other users are bidding.
    // For vehicles with no bids, current bid starts at the starting bid.
    const currentBid = existing?.currentBid
      ?? (originalBid > 0 ? originalBid + getMinIncrement(originalBid) : startingBid);

    setBidStore(prev => {
      const next = new Map(prev);
      next.set(vehicleId, {
        maxBid: maxBidAmount,
        currentBid,
        bidCount: isFirstBid ? originalCount + 1 : (existing?.bidCount ?? originalCount),
      });
      return next;
    });

    if (isFirstBid) {
      return {
        success: true,
        message: `Bid placed! Current bid is $${currentBid.toLocaleString()}. Your max bid of $${maxBidAmount.toLocaleString()} will protect you if others bid.`
      };
    }

    return {
      success: true,
      message: `Max bid increased to $${maxBidAmount.toLocaleString()}. Current bid unchanged at $${currentBid.toLocaleString()}.`
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

  const buyNow = useCallback((vehicleId: string, buyNowPrice: number, originalCount: number) => {
    setBidStore(prev => {
      const next = new Map(prev);
      next.set(vehicleId, {
        maxBid: buyNowPrice,
        currentBid: buyNowPrice,
        bidCount: originalCount + 1,
        purchased: true,
      });
      return next;
    });
  }, []);

  const isPurchased = useCallback((vehicleId: string): boolean => {
    return bidStore.get(vehicleId)?.purchased === true;
  }, [bidStore]);

  return { placeBid, getCurrentBid, getBidCount, getUserMaxBid, buyNow, isPurchased };
}
