import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import InventoryPage from './pages/InventoryPage';
import VehicleDetailPage from './pages/VehicleDetailPage';
import { useWatchlist } from './hooks/useWatchlist';
import { useBids } from './hooks/useBids';

export default function App() {
  const watchlist = useWatchlist();
  const bids = useBids();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">
        <Header watchlistCount={watchlist.count} myBidsCount={bids.activeBidCount} />
        <Routes>
          <Route path="/" element={<InventoryPage watchlist={watchlist} bids={bids} />} />
          <Route path="/vehicle/:id" element={<VehicleDetailPage watchlist={watchlist} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
