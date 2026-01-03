import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import InventoryOverview from './pages/InventoryOverview';
import ProductDetails from './pages/ProductDetails';
import CatalogueOverview from './pages/CatalogueOverview';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/inventory" element={<InventoryOverview />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/catalogue" element={<CatalogueOverview />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
