import { Search, SlidersHorizontal } from 'lucide-react';
import type { Filters } from '../hooks/useVehicles';
import { getActiveFilterCount } from '../hooks/useVehicles';

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
  resultCount: number;
  onToggleMobileFilters: () => void;
}

export default function SearchBar({ filters, onChange, resultCount, onToggleMobileFilters }: Props) {
  const activeCount = getActiveFilterCount(filters);

  return (
    <div className="bg-white border-b border-slate-200 sticky top-[52px] z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search by make, model, year, lot, VIN..."
              value={filters.search}
              onChange={e => onChange({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
            />
          </div>

          {/* Mobile filter toggle */}
          <button
            onClick={onToggleMobileFilters}
            className={`lg:hidden flex items-center gap-2 px-4 py-2 text-sm border rounded-full transition font-medium ${
              activeCount > 0
                ? 'border-accent bg-accent-bg text-accent'
                : 'border-slate-200 text-slate-600 hover:border-accent/40 hover:text-accent'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeCount > 0 && (
              <span className="bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </button>

          <select
            value={filters.sortBy}
            onChange={e => onChange({ ...filters, sortBy: e.target.value })}
            className="px-4 py-2 text-sm border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-accent/40 bg-white font-medium"
          >
            <option value="ending-soon">Ending Soon</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="year-new">Year: Newest</option>
            <option value="year-old">Year: Oldest</option>
            <option value="mileage-low">Mileage: Lowest</option>
            <option value="most-bids">Most Bids</option>
          </select>

          <span className="text-sm text-muted hidden sm:block whitespace-nowrap font-medium">
            {resultCount} vehicle{resultCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
}
