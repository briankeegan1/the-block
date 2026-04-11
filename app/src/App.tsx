import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import InventoryPage from './pages/InventoryPage';
import VehicleDetailPage from './pages/VehicleDetailPage';
import { useWatchlist } from './hooks/useWatchlist';

export default function App() {
  const watchlist = useWatchlist();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">
        <Header watchlistCount={watchlist.count} />
        <Routes>
          <Route path="/" element={<InventoryPage watchlist={watchlist} />} />
          <Route path="/vehicle/:id" element={<VehicleDetailPage watchlist={watchlist} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
