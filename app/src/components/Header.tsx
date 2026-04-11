import { Link } from 'react-router-dom';
import { Gavel, Heart } from 'lucide-react';

interface Props {
  watchlistCount: number;
}

export default function Header({ watchlistCount }: Props) {
  return (
    <header className="bg-slate-900 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition">
          <Gavel className="w-6 h-6 text-amber-400" />
          <span className="text-xl font-bold tracking-tight">The Block</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link to="/" className="hover:text-amber-400 transition">Browse</Link>
          <Link to="/?watchlist=true" className="flex items-center gap-1.5 hover:text-amber-400 transition">
            <Heart className="w-4 h-4" />
            <span className="hidden sm:inline">Watchlist</span>
            {watchlistCount > 0 && (
              <span className="bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                {watchlistCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
