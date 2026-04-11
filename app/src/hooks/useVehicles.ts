import { useMemo } from 'react';
import vehiclesData from '../data/vehicles.json';
import type { Vehicle } from '../types/vehicle';

const vehicles = vehiclesData as Vehicle[];

export interface Filters {
  search: string;
  make: string;
  bodyStyle: string;
  transmission: string;
  drivetrain: string;
  fuelType: string;
  province: string;
  titleStatus: string;
  minPrice: string;
  maxPrice: string;
  sortBy: string;
}

export const defaultFilters: Filters = {
  search: '',
  make: '',
  bodyStyle: '',
  transmission: '',
  drivetrain: '',
  fuelType: '',
  province: '',
  titleStatus: '',
  minPrice: '',
  maxPrice: '',
  sortBy: 'ending-soon',
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
  };
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
    if (filters.make) result = result.filter(v => v.make === filters.make);
    if (filters.bodyStyle) result = result.filter(v => v.body_style === filters.bodyStyle);
    if (filters.transmission) result = result.filter(v => v.transmission === filters.transmission);
    if (filters.drivetrain) result = result.filter(v => v.drivetrain === filters.drivetrain);
    if (filters.fuelType) result = result.filter(v => v.fuel_type === filters.fuelType);
    if (filters.province) result = result.filter(v => v.province === filters.province);
    if (filters.titleStatus) result = result.filter(v => v.title_status === filters.titleStatus);
    if (filters.minPrice) result = result.filter(v => (v.current_bid || v.starting_bid) >= Number(filters.minPrice));
    if (filters.maxPrice) result = result.filter(v => (v.current_bid || v.starting_bid) <= Number(filters.maxPrice));

    switch (filters.sortBy) {
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
      case 'ending-soon':
        result.sort((a, b) => new Date(a.auction_start).getTime() - new Date(b.auction_start).getTime());
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
