import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';

const CATEGORIES = [
  { key: 'electronics',     label: 'Electronics',    icon: '💻', count: '14 products' },
  { key: 'jewelery',        label: 'Jewellery',       icon: '💍', count: '4 products'  },
  { key: "men's clothing",  label: "Men's Fashion",   icon: '👔', count: '4 products'  },
  { key: "women's clothing",label: "Women's Fashion", icon: '👗', count: '6 products'  },
];

function Home({ products, loading, onFilterNav }) {
  const navigate = useNavigate();
  const featured = useMemo(() => products.slice(0, 8), [products]);

  const goShop = (filter) => {
    onFilterNav(filter);
    navigate('/shop');
  };

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg-pattern" />
        <div className="hero-glow" />
        <div className="hero-content">
          <div className="hero-eyebrow">New Season Collection</div>
          <h1 className="hero-title">
            Discover<br /><em>Timeless</em><br />Style
          </h1>
          <p className="hero-sub">
            Curated collections from global brands — quality you feel, style you trust.
          </p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => goShop('')}>Shop Now</button>
            <button className="btn-outline" onClick={() => goShop('')}>View All</button>
          </div>
        </div>
        <div className="hero-floats">
          <div className="hero-stat">
            <span className="hero-stat-n">20+</span>
            <span className="hero-stat-l">Products</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-n">4.8★</span>
            <span className="hero-stat-l">Avg Rating</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-n">Free</span>
            <span className="hero-stat-l">Shipping</span>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section">
        <div className="section-hd">
          <h2 className="section-title">Shop by Category</h2>
          <span className="section-link" onClick={() => goShop('')}>Explore All →</span>
        </div>
        <div className="cats">
          {CATEGORIES.map(c => (
            <div key={c.key} className="cat-card" onClick={() => goShop(c.key)}>
              <div className="cat-icon">{c.icon}</div>
              <div className="cat-name">{c.label}</div>
              <div className="cat-count">{c.count}</div>
              <div className="cat-cta">Browse →</div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* FEATURED PRODUCTS */}
      <section className="section">
        <div className="section-hd">
          <h2 className="section-title">Featured Products</h2>
          <span className="section-link" onClick={() => goShop('')}>View All →</span>
        </div>
        <div className="product-grid">
          {loading
            ? Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : featured.map(p => <ProductCard key={p.id} product={p} />)
          }
        </div>
      </section>
    </>
  );
}

export default Home;
