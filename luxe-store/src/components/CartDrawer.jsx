import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart, changeQty } from '../store/cartSlice';
import { closeCart } from '../store/uiSlice';
import { useToast } from '../hooks/useToast';

function CartDrawer({ products }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const showToast = useToast();
  const isOpen = useSelector(s => s.ui.cartOpen);
  const cartItems = useSelector(s => s.cart.items);

  const enriched = cartItems
    .map(i => ({ ...i, product: products.find(p => p.id === i.id) }))
    .filter(i => i.product);

  const total = enriched.reduce((s, i) => s + i.product.price * i.qty, 0);
  const totalCount = cartItems.reduce((s, i) => s + i.qty, 0);

  const handleClose = () => dispatch(closeCart());

  const handleCheckout = () => {
    handleClose();
    navigate('/checkout');
  };

  return (
    <>
      <div
        className={`drawer-overlay${isOpen ? ' open' : ''}`}
        onClick={handleClose}
      />
      <div className={`cart-drawer${isOpen ? ' open' : ''}`}>
        <div className="drawer-hd">
          <div className="drawer-title">
            Cart{' '}
            <span className="tag" style={{ marginLeft: 8, fontSize: '0.6rem' }}>
              {totalCount} items
            </span>
          </div>
          <button className="close-btn" onClick={handleClose}>✕</button>
        </div>

        <div className="drawer-body">
          {!enriched.length ? (
            <div className="empty">
              <div className="empty-icon">🛍</div>
              <div className="empty-title">Your cart is empty</div>
            </div>
          ) : enriched.map(({ id, qty, product: p }) => (
            <div key={id} className="cart-item">
              <div className="cart-img">
                <img src={p.image} alt={p.title} />
              </div>
              <div className="cart-item-info">
                <div className="cart-item-name">
                  {p.title.length > 38 ? p.title.slice(0, 38) + '…' : p.title}
                </div>
                <div className="cart-item-price">
                  ${(p.price * qty).toFixed(2)}
                </div>
                <div className="qty-ctrl">
                  <button
                    className="qty-btn"
                    onClick={() => dispatch(changeQty({ id, delta: -1 }))}
                  >−</button>
                  <span className="qty-num">{qty}</span>
                  <button
                    className="qty-btn"
                    onClick={() => dispatch(changeQty({ id, delta: 1 }))}
                  >+</button>
                  <button
                    className="rm-btn"
                    onClick={() => {
                      dispatch(removeFromCart(id));
                      showToast('Removed from cart');
                    }}
                  >✕ Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {enriched.length > 0 && (
          <div className="drawer-ft">
            <div className="subtotal-row">
              <span className="subtotal-label">Subtotal</span>
              <span className="subtotal-val">${total.toFixed(2)}</span>
            </div>
            <div className="subtotal-row" style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
              <span>Shipping</span>
              <span style={{ color: 'var(--success)' }}>Free</span>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout →
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default CartDrawer;
