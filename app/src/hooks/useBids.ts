import { useState, useCallback } from 'react';
import type { Bid } from '../types/vehicle';

// In-memory bid store persisted across components via module scope
const bidStore = new Map<string, { amount: number; count: number }>();

export function useBids() {
  const [bids, setBids] = useState<Bid[]>([]);
  const [, setTick] = useState(0);

  const placeBid = useCallback((vehicleId: string, amount: number, originalBid: number, originalCount: number) => {
    const existing = bidStore.get(vehicleId);
    const currentBid = existing?.amount ?? originalBid;
    const currentCount = existing?.count ?? originalCount;

    if (amount <= currentBid) {
      return { success: false, message: 'Bid must be higher than the current bid' };
    }

    const newBid: Bid = { vehicleId, amount, timestamp: Date.now() };
    bidStore.set(vehicleId, { amount, count: currentCount + 1 });
    setBids(prev => [...prev, newBid]);
    setTick(t => t + 1);

    return { success: true, message: 'Bid placed successfully!' };
  }, []);

  const getCurrentBid = useCallback((vehicleId: string, originalBid: number): number => {
    return bidStore.get(vehicleId)?.amount ?? originalBid;
  }, []);

  const getBidCount = useCallback((vehicleId: string, originalCount: number): number => {
    return bidStore.get(vehicleId)?.count ?? originalCount;
  }, []);

  return { bids, placeBid, getCurrentBid, getBidCount };
}
