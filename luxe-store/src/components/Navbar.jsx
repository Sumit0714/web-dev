import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { toggleDark, openCart } from '../store/uiSlice';

function Navbar({ onSearch }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const darkMode = useSelector(s => s.ui.darkMode);
  const cartCount = useSelector(s => s.cart.items.reduce((acc, i) => acc + i.qty, 0));
  const wishCount = useSelector(s => s.wishlist.ids.length);

  return (
    <nav className="nav">
      <NavLink to="/" className="nav-logo">Luxe</NavLink>

      <ul className="nav-links">
        <li>
          <NavLink to="/" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            end>Home</NavLink>
        </li>
        <li>
          <NavLink to="/shop" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Shop
          </NavLink>
        </li>
        <li>
          <NavLink to="/wishlist" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Wishlist
          </NavLink>
        </li>
      </ul>

      <div className="nav-right">
        <div className="nav-search">
          <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>🔍</span>
          <input
            placeholder="Search products…"
            onChange={e => onSearch(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                navigate('/shop');
              }
            }}
          />
        </div>

        <button className="icon-btn" onClick={() => navigate('/wishlist')} title="Wishlist">
          ♡
          {wishCount > 0 && <span className="badge-dot">{wishCount}</span>}
        </button>

        <button className="icon-btn" onClick={() => dispatch(openCart())} title="Cart">
          🛍
          {cartCount > 0 && <span className="badge-dot">{cartCount}</span>}
        </button>

        <button className="icon-btn" onClick={() => dispatch(toggleDark())} title="Toggle dark mode">
          {darkMode ? '☀' : '☽'}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
