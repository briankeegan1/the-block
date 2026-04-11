import { Clock, Radio } from 'lucide-react';
import { getAuctionStatus, getTimeRemaining } from '../lib/format';

interface Props {
  auctionStart: string;
  size?: 'sm' | 'md';
}

export default function AuctionBadge({ auctionStart, size = 'sm' }: Props) {
  const status = getAuctionStatus(auctionStart);
  const timeLeft = getTimeRemaining(auctionStart);

  if (status === 'live') {
    return (
      <span className={`inline-flex items-center gap-1 bg-emerald-500 text-white font-semibold rounded ${
        size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1'
      }`}>
        <Radio className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
        Live &middot; {timeLeft}
      </span>
    );
  }

  if (status === 'upcoming') {
    return (
      <span className={`inline-flex items-center gap-1 bg-blue-500 text-white font-semibold rounded ${
        size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1'
      }`}>
        <Clock className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
        Upcoming
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 bg-slate-400 text-white font-semibold rounded ${
      size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1'
    }`}>
      Ended
    </span>
  );
}
