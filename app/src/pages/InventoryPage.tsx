import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Heart } from 'lucide-react';
import VehicleCard from '../components/VehicleCard';
import FilterBar from '../components/FilterBar';
import { useFilteredVehicles, defaultFilters, getVehicleById } from '../hooks/useVehicles';
import { useBids } from '../hooks/useBids';
import type { Filters } from '../hooks/useVehicles';

interface Props {
  watchlist: {
    toggle: (id: string) => void;
    isWatched: (id: string) => boolean;
    count: number;
    watchlist: Set<string>;
  };
}

export default function InventoryPage({ watchlist }: Props) {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const vehicles = useFilteredVehicles(filters);
  const { getCurrentBid, getBidCount } = useBids();
  const [searchParams, setSearchParams] = useSearchParams();
  const showWatchlist = searchParams.get('watchlist') === 'true';

  const displayVehicles = showWatchlist
    ? [...watchlist.watchlist]
        .map(id => getVehicleById(id))
        .filter((v): v is NonNullable<typeof v> => v != null)
    : vehicles;

  return (
    <div className="min-h-screen bg-slate-50">
      {!showWatchlist && (
        <FilterBar filters={filters} onChange={setFilters} resultCount={vehicles.length} />
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {showWatchlist && (
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              <h2 className="text-xl font-bold text-slate-900">Your Watchlist</h2>
              <span className="text-sm text-slate-500">({watchlist.count} vehicle{watchlist.count !== 1 ? 's' : ''})</span>
            </div>
            <button
              onClick={() => setSearchParams({})}
              className="text-sm text-amber-600 hover:text-amber-700 font-medium"
            >
              Back to all vehicles
            </button>
          </div>
        )}

        {displayVehicles.length === 0 ? (
          <div className="text-center py-16">
            {showWatchlist ? (
              <>
                <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-lg text-slate-500">Your watchlist is empty.</p>
                <p className="text-sm text-slate-400 mt-1">Click the heart icon on any vehicle to save it here.</p>
                <button
                  onClick={() => setSearchParams({})}
                  className="mt-4 text-amber-600 hover:text-amber-700 text-sm font-medium"
                >
                  Browse vehicles
                </button>
              </>
            ) : (
              <>
                <p className="text-lg text-slate-500">No vehicles match your criteria.</p>
                <button
                  onClick={() => setFilters(defaultFilters)}
                  className="mt-3 text-amber-600 hover:text-amber-700 text-sm font-medium"
                >
                  Clear all filters
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayVehicles.map(v => (
              <VehicleCard
                key={v.id}
                vehicle={v}
                currentBid={getCurrentBid(v.id, v.current_bid)}
                bidCount={getBidCount(v.id, v.bid_count)}
                isWatched={watchlist.isWatched(v.id)}
                onToggleWatch={watchlist.toggle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
