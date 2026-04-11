import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Heart, X } from 'lucide-react';
import VehicleCard from '../components/VehicleCard';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
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
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const displayVehicles = showWatchlist
    ? [...watchlist.watchlist]
        .map(id => getVehicleById(id))
        .filter((v): v is NonNullable<typeof v> => v != null)
    : vehicles;

  return (
    <div className="min-h-screen bg-surface">
      {!showWatchlist && (
        <SearchBar
          filters={filters}
          onChange={setFilters}
          resultCount={vehicles.length}
          onToggleMobileFilters={() => setMobileFiltersOpen(v => !v)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {showWatchlist ? (
          <>
            <div className="flex items-center justify-between mb-6 animate-fade-in">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                <h2 className="text-xl font-bold text-navy">Your Watchlist</h2>
                <span className="text-sm text-muted font-medium">
                  ({watchlist.count} vehicle{watchlist.count !== 1 ? 's' : ''})
                </span>
              </div>
              <button
                onClick={() => setSearchParams({})}
                className="text-sm text-accent hover:text-accent-hover font-semibold transition"
              >
                Back to all vehicles
              </button>
            </div>

            {displayVehicles.length === 0 ? (
              <div className="text-center py-16 animate-fade-in">
                <Heart className="w-12 h-12 text-muted mx-auto mb-3" />
                <p className="text-lg text-slate-500 font-medium">Your watchlist is empty.</p>
                <p className="text-sm text-muted mt-1">Click the heart icon on any vehicle to save it here.</p>
                <button
                  onClick={() => setSearchParams({})}
                  className="mt-4 px-6 py-2 bg-accent text-white rounded-full font-semibold hover:bg-accent-hover transition text-sm"
                >
                  Browse vehicles
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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
          </>
        ) : (
          <div className="flex gap-6">
            {/* Desktop sidebar */}
            <div className="hidden lg:block w-60 flex-shrink-0">
              <div className="sticky top-[120px] max-h-[calc(100vh-140px)] overflow-y-auto pr-2">
                <FilterSidebar filters={filters} onChange={setFilters} />
              </div>
            </div>

            {/* Mobile filter drawer */}
            {mobileFiltersOpen && (
              <>
                <div
                  className="fixed inset-0 bg-black/40 z-50 lg:hidden"
                  onClick={() => setMobileFiltersOpen(false)}
                />
                <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white z-50 lg:hidden shadow-xl overflow-y-auto animate-slide-in-left">
                  <div className="sticky top-0 bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between">
                    <h2 className="text-sm font-bold text-navy uppercase tracking-wide">Filters</h2>
                    <button
                      onClick={() => setMobileFiltersOpen(false)}
                      className="p-1 hover:bg-surface rounded-full transition"
                    >
                      <X className="w-5 h-5 text-slate-500" />
                    </button>
                  </div>
                  <div className="p-4">
                    <FilterSidebar filters={filters} onChange={setFilters} />
                  </div>
                </div>
              </>
            )}

            {/* Vehicle grid */}
            <div className="flex-1 min-w-0">
              {displayVehicles.length === 0 ? (
                <div className="text-center py-16 animate-fade-in">
                  <p className="text-lg text-slate-500 font-medium">No vehicles match your criteria.</p>
                  <button
                    onClick={() => setFilters(defaultFilters)}
                    className="mt-3 text-accent hover:text-accent-hover text-sm font-semibold transition"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
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
        )}
      </div>
    </div>
  );
}
