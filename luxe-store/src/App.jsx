import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import CartDrawer from './components/CartDrawer';
import ErrorBoundary from './components/ErrorBoundary';

import Home from './pages/Home';
import Shop from './pages/Shop';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';

import { useProducts } from './hooks/useProducts';
import './styles/global.css';

function App() {
  const darkMode = useSelector(s => s.ui.darkMode);
  const { products, loading, error } = useProducts();

  // For passing initial filter from Home → Shop via nav
  const [shopFilter, setShopFilter] = useState('');

  // Apply dark class to root
  useEffect(() => {
    document.documentElement.className = darkMode ? 'dark' : '';
  }, [darkMode]);

  const [navSearch, setNavSearch] = useState('');

  return (
    <div>
      <Navbar onSearch={setNavSearch} />

      <ErrorBoundary>
        {error && (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--danger)' }}>
            Failed to load products: {error}
          </div>
        )}

        <Routes>
          <Route
            path="/"
            element={
              <Home
                products={products}
                loading={loading}
                onFilterNav={setShopFilter}
              />
            }
          />
          <Route
            path="/shop"
            element={
              <Shop
                products={products}
                loading={loading}
                initialFilter={shopFilter}
                navSearch={navSearch}
              />
            }
          />
          <Route
            path="/wishlist"
            element={<Wishlist products={products} />}
          />
          <Route
            path="/checkout"
            element={<Checkout products={products} />}
          />
        </Routes>
      </ErrorBoundary>

      <Footer />
      <CartDrawer products={products} />
      <Toast />
    </div>
  );
}

export default App;
