import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import type { Filters } from '../hooks/useVehicles';
import { getFilterOptions, getActiveFilterCount } from '../hooks/useVehicles';

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function FilterSidebar({ filters, onChange }: Props) {
  const options = getFilterOptions();
  const activeCount = getActiveFilterCount(filters);

  const toggleArrayFilter = (key: keyof Filters, value: string) => {
    const current = filters[key] as string[];
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    onChange({ ...filters, [key]: next });
  };

  const clearAll = () => {
    onChange({
      ...filters,
      makes: [], bodyStyles: [], transmissions: [], drivetrains: [],
      fuelTypes: [], provinces: [], titleStatuses: [], auctionStatuses: [], conditions: [], minPrice: '', maxPrice: '',
    });
  };

  const removeFilter = (key: keyof Filters, value?: string) => {
    if (value && Array.isArray(filters[key])) {
      onChange({ ...filters, [key]: (filters[key] as string[]).filter(v => v !== value) });
    } else {
      onChange({ ...filters, [key]: typeof filters[key] === 'string' ? '' : [] });
    }
  };

  // Collect active filter chips
  const chips: { key: keyof Filters; value: string; label: string }[] = [];
  for (const v of filters.makes) chips.push({ key: 'makes', value: v, label: v });
  for (const v of filters.bodyStyles) chips.push({ key: 'bodyStyles', value: v, label: capitalize(v) });
  for (const v of filters.transmissions) chips.push({ key: 'transmissions', value: v, label: capitalize(v) });
  for (const v of filters.drivetrains) chips.push({ key: 'drivetrains', value: v, label: v });
  for (const v of filters.fuelTypes) chips.push({ key: 'fuelTypes', value: v, label: capitalize(v) });
  for (const v of filters.provinces) chips.push({ key: 'provinces', value: v, label: v });
  for (const v of filters.titleStatuses) chips.push({ key: 'titleStatuses', value: v, label: capitalize(v) });
  for (const v of filters.auctionStatuses) chips.push({ key: 'auctionStatuses', value: v, label: capitalize(v) });
  for (const v of filters.conditions) chips.push({ key: 'conditions', value: v, label: v });
  if (filters.minPrice) chips.push({ key: 'minPrice', value: '', label: `Min: $${filters.minPrice}` });
  if (filters.maxPrice) chips.push({ key: 'maxPrice', value: '', label: `Max: $${filters.maxPrice}` });

  return (
    <aside className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-navy uppercase tracking-wide">Filters</h2>
        {activeCount > 0 && (
          <button onClick={clearAll} className="text-xs text-accent hover:text-accent-hover font-semibold transition">
            Clear All ({activeCount})
          </button>
        )}
      </div>

      {/* Active filter chips */}
      {chips.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {chips.map((chip, i) => (
            <span
              key={`${chip.key}-${chip.value}-${i}`}
              className="inline-flex items-center gap-1 bg-accent-bg text-accent text-xs font-medium px-2 py-1 rounded-full"
            >
              {chip.label}
              <button
                onClick={() => removeFilter(chip.key, chip.value || undefined)}
                className="hover:text-accent-hover transition"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="space-y-1">
        <CheckboxGroup
          label="Auction Status"
          options={options.auctionStatuses}
          selected={filters.auctionStatuses}
          onToggle={v => toggleArrayFilter('auctionStatuses', v)}
        />
        <CheckboxGroup
          label="Condition"
          options={options.conditions}
          selected={filters.conditions}
          onToggle={v => toggleArrayFilter('conditions', v)}
        />
        <CheckboxGroup
          label="Make"
          options={options.makes}
          selected={filters.makes}
          onToggle={v => toggleArrayFilter('makes', v)}
        />
        <CheckboxGroup
          label="Body Style"
          options={options.bodyStyles}
          selected={filters.bodyStyles}
          onToggle={v => toggleArrayFilter('bodyStyles', v)}
        />
        <CheckboxGroup
          label="Transmission"
          options={options.transmissions}
          selected={filters.transmissions}
          onToggle={v => toggleArrayFilter('transmissions', v)}
        />
        <CheckboxGroup
          label="Drivetrain"
          options={options.drivetrains}
          selected={filters.drivetrains}
          onToggle={v => toggleArrayFilter('drivetrains', v)}
        />
        <CheckboxGroup
          label="Fuel Type"
          options={options.fuelTypes}
          selected={filters.fuelTypes}
          onToggle={v => toggleArrayFilter('fuelTypes', v)}
        />
        <CheckboxGroup
          label="Province"
          options={options.provinces}
          selected={filters.provinces}
          onToggle={v => toggleArrayFilter('provinces', v)}
        />
        <CheckboxGroup
          label="Title Status"
          options={options.titleStatuses}
          selected={filters.titleStatuses}
          onToggle={v => toggleArrayFilter('titleStatuses', v)}
        />

        {/* Price range */}
        <PriceRange
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onMinChange={v => onChange({ ...filters, minPrice: v })}
          onMaxChange={v => onChange({ ...filters, maxPrice: v })}
        />
      </div>
    </aside>
  );
}

function CheckboxGroup({ label, options, selected, onToggle }: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const VISIBLE_COUNT = 5;
  const hasMore = options.length > VISIBLE_COUNT;
  const displayed = showAll ? options : options.slice(0, VISIBLE_COUNT);

  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <button
        onClick={() => setExpanded(v => !v)}
        className="flex items-center justify-between w-full py-3 text-sm font-semibold text-navy hover:text-accent transition"
      >
        <span className="flex items-center gap-1.5">
          {label}
          {selected.length > 0 && (
            <span className="bg-accent text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
              {selected.length}
            </span>
          )}
        </span>
        <ChevronDown className={`w-4 h-4 text-muted transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {expanded && (
        <div className="pb-3 space-y-1 animate-fade-in">
          {displayed.map(option => (
            <label
              key={option}
              className="flex items-center gap-2.5 py-1 px-1 rounded-md cursor-pointer hover:bg-surface transition group"
            >
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => onToggle(option)}
                className="w-4 h-4 rounded border-slate-300 text-accent focus:ring-accent/40 cursor-pointer"
              />
              <span className="text-sm text-slate-700 group-hover:text-navy capitalize">{option}</span>
            </label>
          ))}
          {hasMore && (
            <button
              onClick={() => setShowAll(v => !v)}
              className="text-xs text-accent hover:text-accent-hover font-semibold mt-1 ml-1 transition"
            >
              {showAll ? 'Show less' : `Show all ${options.length}`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function PriceRange({ minPrice, maxPrice, onMinChange, onMaxChange }: {
  minPrice: string;
  maxPrice: string;
  onMinChange: (v: string) => void;
  onMaxChange: (v: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <button
        onClick={() => setExpanded(v => !v)}
        className="flex items-center justify-between w-full py-3 text-sm font-semibold text-navy hover:text-accent transition"
      >
        <span className="flex items-center gap-1.5">
          Price Range
          {(minPrice || maxPrice) && (
            <span className="bg-accent text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
              !
            </span>
          )}
        </span>
        <ChevronDown className={`w-4 h-4 text-muted transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {expanded && (
        <div className="pb-3 flex gap-2 animate-fade-in">
          <div className="flex-1">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={e => onMinChange(e.target.value)}
              className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
            />
          </div>
          <span className="text-muted self-center text-sm">—</span>
          <div className="flex-1">
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={e => onMaxChange(e.target.value)}
              className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
            />
          </div>
        </div>
      )}
    </div>
  );
}
