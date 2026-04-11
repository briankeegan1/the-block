import { Clock } from 'lucide-react';
import { getAuctionStatus, getTimeRemaining } from '../lib/format';

interface Props {
  auctionStart: string;
  size?: 'sm' | 'md';
  purchased?: boolean;
}

export default function AuctionBadge({ auctionStart, size = 'sm', purchased }: Props) {
  const status = purchased ? 'ended' : getAuctionStatus(auctionStart);
  const timeLeft = getTimeRemaining(auctionStart);

  if (status === 'live') {
    return (
      <span className={`inline-flex items-center gap-1 bg-emerald-500 text-white font-semibold rounded-full ${
        size === 'sm' ? 'text-xs px-2.5 py-0.5' : 'text-sm px-3 py-1'
      }`}>
        <span className="relative flex h-2 w-2">
          <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
        Live &middot; {timeLeft}
      </span>
    );
  }

  if (status === 'upcoming') {
    return (
      <span className={`inline-flex items-center gap-1 bg-accent text-white font-semibold rounded-full ${
        size === 'sm' ? 'text-xs px-2.5 py-0.5' : 'text-sm px-3 py-1'
      }`}>
        <Clock className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
        Upcoming
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 bg-slate-400 text-white font-semibold rounded-full ${
      size === 'sm' ? 'text-xs px-2.5 py-0.5' : 'text-sm px-3 py-1'
    }`}>
      Ended
    </span>
  );
}
