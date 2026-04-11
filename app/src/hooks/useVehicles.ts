import { useMemo } from 'react';
import vehiclesData from '../data/vehicles.json';
import type { Vehicle } from '../types/vehicle';
import { getAuctionStatus, conditionLabel } from '../lib/format';

const vehicles = vehiclesData as Vehicle[];

export interface Filters {
  search: string;
  makes: string[];
  bodyStyles: string[];
  transmissions: string[];
  drivetrains: string[];
  fuelTypes: string[];
  provinces: string[];
  titleStatuses: string[];
  auctionStatuses: string[];
  conditions: string[];
  minPrice: string;
  maxPrice: string;
  sortBy: string;
}

export const defaultFilters: Filters = {
  search: '',
  makes: [],
  bodyStyles: [],
  transmissions: [],
  drivetrains: [],
  fuelTypes: [],
  provinces: [],
  titleStatuses: [],
  auctionStatuses: [],
  conditions: [],
  minPrice: '',
  maxPrice: '',
  sortBy: 'recommended',
};

export function getFilterOptions() {
  return {
    makes: [...new Set(vehicles.map(v => v.make))].sort(),
    bodyStyles: [...new Set(vehicles.map(v => v.body_style))].sort(),
    transmissions: [...new Set(vehicles.map(v => v.transmission))].sort(),
    drivetrains: [...new Set(vehicles.map(v => v.drivetrain))].sort(),
    fuelTypes: [...new Set(vehicles.map(v => v.fuel_type))].sort(),
    provinces: [...new Set(vehicles.map(v => v.province))].sort(),
    titleStatuses: [...new Set(vehicles.map(v => v.title_status))].sort(),
    auctionStatuses: ['live', 'upcoming', 'ended'] as string[],
    conditions: ['Excellent', 'Good', 'Fair', 'Below Average', 'Poor'] as string[],
  };
}

export function getActiveFilterCount(filters: Filters): number {
  return [
    filters.makes.length,
    filters.bodyStyles.length,
    filters.transmissions.length,
    filters.drivetrains.length,
    filters.fuelTypes.length,
    filters.provinces.length,
    filters.titleStatuses.length,
    filters.auctionStatuses.length,
    filters.conditions.length,
    filters.minPrice ? 1 : 0,
    filters.maxPrice ? 1 : 0,
  ].reduce((a, b) => a + b, 0);
}

// Priority: live=0, upcoming=1, ended=2
function statusPriority(auctionStart: string): number {
  const s = getAuctionStatus(auctionStart);
  if (s === 'live') return 0;
  if (s === 'upcoming') return 1;
  return 2;
}

export function useFilteredVehicles(filters: Filters) {
  return useMemo(() => {
    let result = [...vehicles];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(v =>
        `${v.year} ${v.make} ${v.model} ${v.trim} ${v.lot} ${v.vin}`.toLowerCase().includes(q)
      );
    }
    if (filters.makes.length) result = result.filter(v => filters.makes.includes(v.make));
    if (filters.bodyStyles.length) result = result.filter(v => filters.bodyStyles.includes(v.body_style));
    if (filters.transmissions.length) result = result.filter(v => filters.transmissions.includes(v.transmission));
    if (filters.drivetrains.length) result = result.filter(v => filters.drivetrains.includes(v.drivetrain));
    if (filters.fuelTypes.length) result = result.filter(v => filters.fuelTypes.includes(v.fuel_type));
    if (filters.provinces.length) result = result.filter(v => filters.provinces.includes(v.province));
    if (filters.titleStatuses.length) result = result.filter(v => filters.titleStatuses.includes(v.title_status));
    if (filters.auctionStatuses.length) result = result.filter(v => filters.auctionStatuses.includes(getAuctionStatus(v.auction_start)));
    if (filters.conditions.length) result = result.filter(v => filters.conditions.includes(conditionLabel(v.condition_grade)));
    if (filters.minPrice) result = result.filter(v => (v.current_bid || v.starting_bid) >= Number(filters.minPrice));
    if (filters.maxPrice) result = result.filter(v => (v.current_bid || v.starting_bid) <= Number(filters.maxPrice));

    switch (filters.sortBy) {
      case 'recommended':
        // Live first (ending soonest), then upcoming, then ended
        result.sort((a, b) => {
          const pa = statusPriority(a.auction_start);
          const pb = statusPriority(b.auction_start);
          if (pa !== pb) return pa - pb;
          // Within same status, sort by auction_start ascending (ending soonest first)
          return new Date(a.auction_start).getTime() - new Date(b.auction_start).getTime();
        });
        break;
      case 'ending-soon':
        // Only makes sense for live — still group by status first
        result.sort((a, b) => {
          const pa = statusPriority(a.auction_start);
          const pb = statusPriority(b.auction_start);
          if (pa !== pb) return pa - pb;
          return new Date(a.auction_start).getTime() - new Date(b.auction_start).getTime();
        });
        break;
      case 'newly-listed':
        result.sort((a, b) => {
          const pa = statusPriority(a.auction_start);
          const pb = statusPriority(b.auction_start);
          if (pa !== pb) return pa - pb;
          return new Date(b.auction_start).getTime() - new Date(a.auction_start).getTime();
        });
        break;
      case 'price-low':
        result.sort((a, b) => (a.current_bid || a.starting_bid) - (b.current_bid || b.starting_bid));
        break;
      case 'price-high':
        result.sort((a, b) => (b.current_bid || b.starting_bid) - (a.current_bid || a.starting_bid));
        break;
      case 'year-new':
        result.sort((a, b) => b.year - a.year);
        break;
      case 'year-old':
        result.sort((a, b) => a.year - b.year);
        break;
      case 'mileage-low':
        result.sort((a, b) => a.odometer_km - b.odometer_km);
        break;
      case 'most-bids':
        result.sort((a, b) => b.bid_count - a.bid_count);
        break;
    }

    return result;
  }, [filters]);
}

export function getVehicleById(id: string): Vehicle | undefined {
  return vehicles.find(v => v.id === id);
}
