import { Link } from 'react-router-dom';
import { Gavel, Heart, BadgeDollarSign } from 'lucide-react';

interface Props {
  watchlistCount: number;
  myBidsCount: number;
}

export default function Header({ watchlistCount, myBidsCount }: Props) {
  return (
    <header className="bg-navy text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition group">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
            <Gavel className="w-4.5 h-4.5 text-white" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold tracking-tight">The Block</span>
            <span className="text-[10px] font-medium text-accent-light opacity-70 tracking-wider uppercase">by OPENLANE</span>
          </div>
        </Link>
        <nav className="flex items-center gap-1">
          <Link to="/" className="px-3 py-1.5 rounded-full text-sm font-medium hover:bg-navy-light transition">
            Browse
          </Link>
          <Link to="/?mybids=true" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-navy-light transition">
            <BadgeDollarSign className="w-4 h-4" />
            <span className="hidden sm:inline">My Bids</span>
            {myBidsCount > 0 && (
              <span className="bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                {myBidsCount}
              </span>
            )}
          </Link>
          <Link to="/?watchlist=true" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-navy-light transition">
            <Heart className="w-4 h-4" />
            <span className="hidden sm:inline">Watchlist</span>
            {watchlistCount > 0 && (
              <span className="bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                {watchlistCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
