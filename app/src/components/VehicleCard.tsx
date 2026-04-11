import { Link, useLocation } from 'react-router-dom';
import { MapPin, Gauge, Users, Heart, Trophy } from 'lucide-react';
import type { Vehicle } from '../types/vehicle';
import { formatCurrency, formatKm, conditionLabel, conditionColor, getAuctionStatus } from '../lib/format';
import AuctionBadge from './AuctionBadge';

interface Props {
  vehicle: Vehicle;
  currentBid: number;
  bidCount: number;
  isWatched: boolean;
  onToggleWatch: (id: string) => void;
  userMaxBid?: number | null;
  purchased?: boolean;
}

export default function VehicleCard({ vehicle, currentBid, bidCount, isWatched, onToggleWatch, purchased }: Props) {
  const price = currentBid || vehicle.starting_bid;
  const auctionStatus = getAuctionStatus(vehicle.auction_start);
  const location = useLocation();

  return (
    <div className="group bg-white rounded-xl border border-slate-200 overflow-hidden card-hover relative animate-fade-in">
      <button
        onClick={e => { e.preventDefault(); onToggleWatch(vehicle.id); }}
        className={`absolute top-2 right-2 z-10 p-1.5 rounded-full transition-all ${
          isWatched
            ? 'bg-red-500 text-white shadow-md scale-100'
            : 'bg-white/80 text-slate-400 hover:text-red-500 hover:bg-white opacity-0 group-hover:opacity-100'
        }`}
        aria-label={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
      >
        <Heart className={`w-4 h-4 ${isWatched ? 'fill-current' : ''}`} />
      </button>

      <Link to={`/vehicle/${vehicle.id}`} state={{ from: location.pathname + location.search }}>
        <div className="aspect-[4/3] bg-surface overflow-hidden relative">
          <img
            src={vehicle.images[0]}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            <AuctionBadge auctionStart={vehicle.auction_start} purchased={purchased} />
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full w-fit ${
              vehicle.title_status === 'clean' ? 'bg-emerald-100 text-emerald-800' :
              vehicle.title_status === 'rebuilt' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {vehicle.title_status.charAt(0).toUpperCase() + vehicle.title_status.slice(1)}
            </span>
          </div>
          {purchased ? (
            <span className="absolute bottom-2 right-2 bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              Purchased
            </span>
          ) : vehicle.buy_now_price && auctionStatus === 'live' ? (
            <span className="absolute bottom-2 right-2 bg-accent text-white text-xs font-semibold px-2.5 py-0.5 rounded-full shadow-sm">
              Buy Now Available
            </span>
          ) : null}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-navy truncate" title={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}>
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h3>
              <p className="text-sm text-slate-500 truncate" title={vehicle.trim}>{vehicle.trim}</p>
            </div>
            <span className="text-xs text-muted whitespace-nowrap font-medium">Lot {vehicle.lot}</span>
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
              <p className="text-xs text-muted">
                {auctionStatus === 'ended'
                  ? 'Final Bid'
                  : bidCount > 0 ? 'Current Bid' : 'Starting Bid'
                }
              </p>
              <p className="text-lg font-bold text-navy">{formatCurrency(price)}</p>
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
