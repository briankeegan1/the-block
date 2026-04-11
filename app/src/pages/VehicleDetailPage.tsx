import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, Gauge, Fuel, Settings, Car, Calendar, AlertTriangle, Store, Shield, Heart } from 'lucide-react';
import { getVehicleById } from '../hooks/useVehicles';
import type { useBids } from '../hooks/useBids';
import BidPanel from '../components/BidPanel';
import AuctionBadge from '../components/AuctionBadge';
import { formatCurrency, formatKm, conditionLabel, conditionColor } from '../lib/format';
import { useState } from 'react';

interface Props {
  watchlist: {
    toggle: (id: string) => void;
    isWatched: (id: string) => boolean;
    count: number;
    watchlist: Set<string>;
  };
  bids: ReturnType<typeof useBids>;
}

export default function VehicleDetailPage({ watchlist, bids }: Props) {
  const { id } = useParams<{ id: string }>();
  const vehicle = getVehicleById(id!);
  const { placeBid, getCurrentBid, getBidCount, getUserMaxBid, buyNow, isPurchased } = bids;
  const location = useLocation();
  const backTo = (location.state as { from?: string })?.from || '/';
  const [activeImage, setActiveImage] = useState(0);

  if (!vehicle) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-lg text-slate-500 font-medium">Vehicle not found.</p>
        <Link to="/" className="text-accent hover:text-accent-hover text-sm font-semibold mt-3 inline-block transition">
          Back to inventory
        </Link>
      </div>
    );
  }

  const currentBid = getCurrentBid(vehicle.id, vehicle.current_bid);
  const bidCount = getBidCount(vehicle.id, vehicle.bid_count);
  const userMaxBid = getUserMaxBid(vehicle.id);
  const purchased = isPurchased(vehicle.id);
  const isWatched = watchlist.isWatched(vehicle.id);

  const handleBid = (amount: number) => {
    return placeBid(vehicle.id, amount, vehicle.current_bid, vehicle.bid_count, vehicle.starting_bid);
  };

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Link to={backTo} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-accent mb-4 transition font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back to inventory
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up">
          {/* Left: Images + Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image gallery */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="aspect-[16/10] bg-surface relative">
                <img
                  src={vehicle.images[activeImage]}
                  alt={`${vehicle.year} ${vehicle.make} ${vehicle.model} photo ${activeImage + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  {purchased ? (
                    <span className="inline-flex items-center gap-1 bg-emerald-600 text-white font-semibold rounded-full text-sm px-3 py-1">
                      Sold
                    </span>
                  ) : (
                    <AuctionBadge auctionStart={vehicle.auction_start} size="md" />
                  )}
                </div>
              </div>
              {vehicle.images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {vehicle.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`w-20 h-15 rounded-lg overflow-hidden flex-shrink-0 border-2 transition ${
                        i === activeImage ? 'border-accent' : 'border-transparent hover:border-slate-300'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title + overview */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-navy">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h1>
                  <p className="text-slate-500">{vehicle.trim}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => watchlist.toggle(vehicle.id)}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-sm font-semibold transition ${
                      isWatched
                        ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
                        : 'border-slate-200 text-slate-500 hover:border-red-200 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWatched ? 'fill-current' : ''}`} />
                    {isWatched ? 'Watching' : 'Watch'}
                  </button>
                  <span className="text-sm text-muted font-medium">Lot {vehicle.lot}</span>
                </div>
              </div>
              <p className="text-xs text-muted mt-1 font-medium">VIN: {vehicle.vin}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
                <Spec icon={Gauge} label="Odometer" value={formatKm(vehicle.odometer_km)} />
                <Spec icon={Settings} label="Transmission" value={vehicle.transmission} />
                <Spec icon={Car} label="Drivetrain" value={vehicle.drivetrain} />
                <Spec icon={Fuel} label="Fuel" value={vehicle.fuel_type} />
                <Spec icon={Calendar} label="Year" value={vehicle.year.toString()} />
                <Spec icon={MapPin} label="Location" value={`${vehicle.city}, ${vehicle.province}`} />
                <Spec icon={Store} label="Dealership" value={vehicle.selling_dealership} />
                <Spec icon={Shield} label="Title" value={vehicle.title_status} />
              </div>
            </div>

            {/* Vehicle details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <h2 className="font-semibold text-navy mb-3">Specs</h2>
                <dl className="space-y-2 text-sm">
                  <Row label="Body Style" value={vehicle.body_style} />
                  <Row label="Engine" value={vehicle.engine} />
                  <Row label="Exterior" value={vehicle.exterior_color} />
                  <Row label="Interior" value={vehicle.interior_color} />
                </dl>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <h2 className="font-semibold text-navy mb-3">Condition</h2>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-2xl font-bold ${conditionColor(vehicle.condition_grade)}`}>
                    {vehicle.condition_grade}
                  </span>
                  <span className={`text-sm font-medium ${conditionColor(vehicle.condition_grade)}`}>
                    {conditionLabel(vehicle.condition_grade)}
                  </span>
                  <span className="text-xs text-muted font-medium">/ 5.0</span>
                </div>
                <p className="text-sm text-slate-600">{vehicle.condition_report}</p>

                {vehicle.damage_notes.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      Damage Notes
                    </h3>
                    <ul className="space-y-1">
                      {vehicle.damage_notes.map((note, i) => (
                        <li key={i} className="text-sm text-slate-600 pl-4 relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-accent before:rounded-full">
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Pricing summary */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <h2 className="font-semibold text-navy mb-3">Pricing</h2>
              <dl className="space-y-2 text-sm">
                <Row label="Starting Bid" value={formatCurrency(vehicle.starting_bid)} />
                {vehicle.buy_now_price && <Row label="Buy Now Price" value={formatCurrency(vehicle.buy_now_price)} />}
              </dl>
            </div>
          </div>

          {/* Right: Bid panel (sticky on desktop) */}
          <div className="lg:sticky lg:top-[68px] lg:self-start space-y-4">
            <BidPanel
              vehicle={vehicle}
              currentBid={currentBid}
              bidCount={bidCount}
              userMaxBid={userMaxBid}
              purchased={purchased}
              onPlaceBid={handleBid}
              onBuyNow={() => buyNow(vehicle.id, vehicle.buy_now_price!, vehicle.bid_count)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Spec({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-accent/60 flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-muted font-medium">{label}</p>
        <p className="text-sm text-slate-700 font-medium capitalize truncate" title={value}>{value}</p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-navy font-medium capitalize">{value}</dd>
    </div>
  );
}
