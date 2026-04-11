import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { defaultFilters } from './useVehicles';
import type { Filters } from './useVehicles';

// Maps filter keys to short URL param names
const PARAM_MAP: Record<string, string> = {
  search: 'q',
  makes: 'make',
  bodyStyles: 'body',
  transmissions: 'trans',
  drivetrains: 'drive',
  fuelTypes: 'fuel',
  provinces: 'prov',
  titleStatuses: 'title',
  auctionStatuses: 'status',
  conditions: 'cond',
  buyNowOnly: 'buynow',
  minPrice: 'min',
  maxPrice: 'max',
  sortBy: 'sort',
};

const ARRAY_KEYS = new Set([
  'makes', 'bodyStyles', 'transmissions', 'drivetrains',
  'fuelTypes', 'provinces', 'titleStatuses', 'auctionStatuses', 'conditions',
]);

function filtersFromParams(params: URLSearchParams): Filters {
  const filters = { ...defaultFilters };

  for (const [key, param] of Object.entries(PARAM_MAP)) {
    const value = params.get(param);
    if (!value) continue;

    if (ARRAY_KEYS.has(key)) {
      (filters as unknown as Record<string, unknown>)[key] = value.split(',');
    } else if (key === 'buyNowOnly') {
      (filters as unknown as Record<string, unknown>)[key] = value === '1';
    } else {
      (filters as unknown as Record<string, unknown>)[key] = value;
    }
  }

  return filters;
}

function filtersToParams(filters: Filters): URLSearchParams {
  const params = new URLSearchParams();

  for (const [key, param] of Object.entries(PARAM_MAP)) {
    const value = (filters as unknown as Record<string, unknown>)[key];
    const defaultValue = (defaultFilters as unknown as Record<string, unknown>)[key];

    if (Array.isArray(value)) {
      if (value.length > 0) params.set(param, value.join(','));
    } else if (typeof value === 'boolean') {
      if (value) params.set(param, '1');
    } else if (typeof value === 'string' && value && value !== defaultValue) {
      params.set(param, value);
    }
  }

  return params;
}

export function useFilterParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const isWatchlist = searchParams.get('watchlist') === 'true';
  const isMyBids = searchParams.get('mybids') === 'true';
  const page = Number(searchParams.get('page') || '1');

  const filters = useMemo(() => {
    if (isWatchlist || isMyBids) return defaultFilters;
    return filtersFromParams(searchParams);
  }, [searchParams, isWatchlist, isMyBids]);

  const setFilters = useCallback((newFilters: Filters, newPage = 1) => {
    const params = filtersToParams(newFilters);
    if (newPage > 1) params.set('page', newPage.toString());
    setSearchParams(params, { replace: true });
  }, [setSearchParams]);

  const setPage = useCallback((p: number) => {
    const params = filtersToParams(filters);
    if (p > 1) params.set('page', p.toString());
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const setWatchlist = useCallback((show: boolean) => {
    if (show) {
      setSearchParams({ watchlist: 'true' }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [setSearchParams]);

  const setMyBids = useCallback((show: boolean) => {
    if (show) {
      setSearchParams({ mybids: 'true' }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [setSearchParams]);

  return { filters, setFilters, page, setPage, isWatchlist, setWatchlist, isMyBids, setMyBids };
}
