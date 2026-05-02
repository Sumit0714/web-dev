import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import ProductCard from '../components/ProductCard';

function Wishlist({ products }) {
  const wishIds = useSelector(s => s.wishlist.ids);
  const wishItems = useMemo(
    () => products.filter(p => wishIds.includes(p.id)),
    [products, wishIds]
  );

  return (
    <>
      <div className="page-hd">
        <h1 className="page-title">Wishlist</h1>
        <p className="page-sub">
          {wishItems.length} saved item{wishItems.length !== 1 ? 's' : ''}
        </p>
      </div>

      <section className="section" style={{ paddingTop: 24 }}>
        {wishItems.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">♡</div>
            <div className="empty-title">No items saved yet</div>
          </div>
        ) : (
          <div className="product-grid">
            {wishItems.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </>
  );
}

export default Wishlist;
