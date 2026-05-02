import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { toggleWishlist } from '../store/wishlistSlice';
import { useToast } from '../hooks/useToast';

const Stars = ({ rating }) => (
  <span className="stars">
    {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
  </span>
);

const ProductCard = memo(function ProductCard({ product: p }) {
  const dispatch = useDispatch();
  const showToast = useToast();
  const isInWish = useSelector(s => s.wishlist.ids.includes(p.id));

  const disc = p.oldPrice
    ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
    : 0;

  const getBadge = () => {
    if (disc > 0) return <span className="product-badge badge-sale">-{disc}%</span>;
    if (p.rating?.count > 400) return <span className="product-badge badge-hot">HOT</span>;
    if (p.rating?.count <= 80) return <span className="product-badge badge-new">NEW</span>;
    return null;
  };

  const handleAdd = (e) => {
    e.stopPropagation();
    dispatch(addToCart(p.id));
    showToast('Added to cart ✓');
  };

  const handleWish = (e) => {
    e.stopPropagation();
    dispatch(toggleWishlist(p.id));
    showToast(isInWish ? 'Removed from wishlist' : 'Saved to wishlist ♥');
  };

  return (
    <div className="product-card">
      <div className="product-img">
        <img src={p.image} alt={p.title} loading="lazy" />
        {getBadge()}
        <button
          className={`wish-btn${isInWish ? ' active' : ''}`}
          onClick={handleWish}
          title="Toggle wishlist"
        >
          {isInWish ? '♥' : '♡'}
        </button>
      </div>
      <div className="product-info">
        <div className="product-brand">{p.category}</div>
        <div className="product-name">{p.title}</div>
        <div style={{ marginBottom: 4 }}>
          <Stars rating={p.rating?.rate || 4} />
          <span className="rating-cnt">({p.rating?.count || 0})</span>
        </div>
        <div className="product-footer">
          <div>
            <span className="product-price">${p.price.toFixed(2)}</span>
            {p.oldPrice && (
              <span className="product-price-old">${p.oldPrice.toFixed(2)}</span>
            )}
          </div>
          <button className="add-btn" onClick={handleAdd}>+ Cart</button>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;
