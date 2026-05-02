import { useState, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import { useDebounce } from '../hooks/useDebounce';

const FILTERS = [
  { k: '',                 l: 'All'           },
  { k: 'electronics',     l: 'Electronics'   },
  { k: 'jewelery',        l: 'Jewellery'     },
  { k: "men's clothing",  l: "Men's"         },
  { k: "women's clothing",l: "Women's"       },
];

function Shop({ products, loading, initialFilter }) {
  const [activeFilter, setActiveFilter] = useState(initialFilter || '');
  const [sort, setSort]   = useState('default');
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebounce(search, 320);

  const filtered = useMemo(() => {
    let list = [...products];

    if (activeFilter) {
      list = list.filter(p => p.category === activeFilter);
    }

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (sort === 'price-asc')  list.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (sort === 'rating')     list.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
    if (sort === 'popular')    list.sort((a, b) => (b.rating?.count || 0) - (a.rating?.count || 0));

    return list;
  }, [products, activeFilter, debouncedSearch, sort]);

  return (
    <section className="section">
      <div className="section-hd" style={{ marginBottom: 20 }}>
        <h2 className="section-title">All Products</h2>
        <span className="results-count">{filtered.length} results</span>
      </div>

      {/* Controls */}
      <div className="shop-controls">
        <div className="filter-chips">
          {FILTERS.map(f => (
            <button
              key={f.k}
              className={`chip${activeFilter === f.k ? ' active' : ''}`}
              onClick={() => setActiveFilter(f.k)}
            >
              {f.l}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <input
            className="search-input"
            placeholder="🔍  Search…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="sort-select"
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="rating">Top Rated</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="product-grid">
        {loading
          ? Array(12).fill(0).map((_, i) => <SkeletonCard key={i} />)
          : filtered.length === 0
            ? (
              <div className="empty" style={{ gridColumn: '1 / -1' }}>
                <div className="empty-icon">🔍</div>
                <div className="empty-title">No products found</div>
              </div>
            )
            : filtered.map(p => <ProductCard key={p.id} product={p} />)
        }
      </div>
    </section>
  );
}

export default Shop;
