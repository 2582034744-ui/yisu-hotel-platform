import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import HotelList from './pages/HotelList';
import HotelDetail from './pages/HotelDetail';
import Favorites from './pages/Favorites';
import MapView from './pages/MapView';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/list" element={<HotelList />} />
          <Route path="/detail/:id" element={<HotelDetail />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/map" element={<MapView />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
