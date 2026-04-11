import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import type { Filters } from '../hooks/useVehicles';
import { getFilterOptions } from '../hooks/useVehicles';

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
  resultCount: number;
}

export default function FilterBar({ filters, onChange, resultCount }: Props) {
  const [showFilters, setShowFilters] = useState(false);
  const options = getFilterOptions();

  const update = (key: keyof Filters, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const activeFilterCount = [
    filters.make, filters.bodyStyle, filters.transmission,
    filters.drivetrain, filters.fuelType, filters.province,
    filters.titleStatus, filters.minPrice, filters.maxPrice,
  ].filter(Boolean).length;

  const clearFilters = () => {
    onChange({
      ...filters,
      make: '', bodyStyle: '', transmission: '', drivetrain: '',
      fuelType: '', province: '', titleStatus: '', minPrice: '', maxPrice: '',
    });
  };

  return (
    <div className="bg-white border-b border-slate-200 sticky top-[52px] z-40">
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Search + filter toggle + sort */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by make, model, year, lot, VIN..."
              value={filters.search}
              onChange={e => update('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
          </div>

          <button
            onClick={() => setShowFilters(v => !v)}
            className={`flex items-center gap-2 px-3 py-2 text-sm border rounded-lg transition ${
              showFilters || activeFilterCount > 0
                ? 'border-amber-400 bg-amber-50 text-amber-700'
                : 'border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-amber-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          <select
            value={filters.sortBy}
            onChange={e => update('sortBy', e.target.value)}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
          >
            <option value="ending-soon">Ending Soon</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="year-new">Year: Newest</option>
            <option value="year-old">Year: Oldest</option>
            <option value="mileage-low">Mileage: Lowest</option>
            <option value="most-bids">Most Bids</option>
          </select>

          <span className="text-sm text-slate-500 hidden sm:block whitespace-nowrap">
            {resultCount} vehicle{resultCount !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <FilterSelect label="Make" value={filters.make} options={options.makes} onChange={v => update('make', v)} />
              <FilterSelect label="Body Style" value={filters.bodyStyle} options={options.bodyStyles} onChange={v => update('bodyStyle', v)} />
              <FilterSelect label="Transmission" value={filters.transmission} options={options.transmissions} onChange={v => update('transmission', v)} />
              <FilterSelect label="Drivetrain" value={filters.drivetrain} options={options.drivetrains} onChange={v => update('drivetrain', v)} />
              <FilterSelect label="Fuel Type" value={filters.fuelType} options={options.fuelTypes} onChange={v => update('fuelType', v)} />
              <FilterSelect label="Province" value={filters.province} options={options.provinces} onChange={v => update('province', v)} />
              <FilterSelect label="Title Status" value={filters.titleStatus} options={options.titleStatuses} onChange={v => update('titleStatus', v)} />
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Min Price</label>
                <input
                  type="number"
                  placeholder="$0"
                  value={filters.minPrice}
                  onChange={e => update('minPrice', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Max Price</label>
                <input
                  type="number"
                  placeholder="No max"
                  value={filters.maxPrice}
                  onChange={e => update('maxPrice', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="mt-3 flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition"
              >
                <X className="w-3.5 h-3.5" />
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }: {
  label: string; value: string; options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-xs text-slate-500 mb-1 block">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white capitalize"
      >
        <option value="">All</option>
        {options.map(o => (
          <option key={o} value={o} className="capitalize">{o}</option>
        ))}
      </select>
    </div>
  );
}
