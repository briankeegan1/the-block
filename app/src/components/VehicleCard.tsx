import { Link } from 'react-router-dom';
import { MapPin, Gauge, Users, Heart } from 'lucide-react';
import type { Vehicle } from '../types/vehicle';
import { formatCurrency, formatKm, conditionLabel, conditionColor } from '../lib/format';
import AuctionBadge from './AuctionBadge';

interface Props {
  vehicle: Vehicle;
  currentBid: number;
  bidCount: number;
  isWatched: boolean;
  onToggleWatch: (id: string) => void;
}

export default function VehicleCard({ vehicle, currentBid, bidCount, isWatched, onToggleWatch }: Props) {
  const price = currentBid || vehicle.starting_bid;

  return (
    <div className="group bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all relative">
      <button
        onClick={e => { e.preventDefault(); onToggleWatch(vehicle.id); }}
        className={`absolute top-2 right-2 z-10 p-1.5 rounded-full transition-all ${
          isWatched
            ? 'bg-red-500 text-white shadow-md'
            : 'bg-white/80 text-slate-400 hover:text-red-500 hover:bg-white opacity-0 group-hover:opacity-100'
        }`}
        aria-label={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
      >
        <Heart className={`w-4 h-4 ${isWatched ? 'fill-current' : ''}`} />
      </button>

      <Link to={`/vehicle/${vehicle.id}`}>
        <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
          <img
            src={vehicle.images[0]}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            <AuctionBadge auctionStart={vehicle.auction_start} />
            <span className={`text-xs font-semibold px-2 py-0.5 rounded w-fit ${
              vehicle.title_status === 'clean' ? 'bg-emerald-100 text-emerald-800' :
              vehicle.title_status === 'rebuilt' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {vehicle.title_status.charAt(0).toUpperCase() + vehicle.title_status.slice(1)}
            </span>
          </div>
          {vehicle.buy_now_price && (
            <span className="absolute bottom-2 right-2 bg-amber-500 text-white text-xs font-semibold px-2 py-0.5 rounded shadow-sm">
              Buy Now Available
            </span>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 truncate">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h3>
              <p className="text-sm text-slate-500 truncate">{vehicle.trim}</p>
            </div>
            <span className="text-xs text-slate-400 whitespace-nowrap">Lot {vehicle.lot}</span>
          </div>

          <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5" />
              {formatKm(vehicle.odometer_km)}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {vehicle.city}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className={`font-medium ${conditionColor(vehicle.condition_grade)}`}>
              {vehicle.condition_grade} — {conditionLabel(vehicle.condition_grade)}
            </span>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-end justify-between">
            <div>
              <p className="text-xs text-slate-400">{bidCount > 0 ? 'Current Bid' : 'Starting Bid'}</p>
              <p className="text-lg font-bold text-slate-900">{formatCurrency(price)}</p>
            </div>
            {bidCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Users className="w-3.5 h-3.5" />
                {bidCount} bid{bidCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
