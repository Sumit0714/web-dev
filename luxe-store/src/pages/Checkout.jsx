import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../store/cartSlice';
import { useToast } from '../hooks/useToast';

const STEPS = [
  { n: 1, label: 'Delivery'  },
  { n: 2, label: 'Payment'   },
  { n: 3, label: 'Review'    },
];

function StepIndicator({ current }) {
  return (
    <div className="form-step">
      {STEPS.map((s, i) => (
        <div key={s.n}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              className={`step ${current === s.n ? 'active' : ''} ${current > s.n ? 'done' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <div className="step-num">{current > s.n ? '✓' : s.n}</div>
              <div className="step-label">{s.label}</div>
            </div>
            {i < STEPS.length - 1 && <div className="step-sep" style={{ width: 40 }} />}
          </div>
        </div>
      ))}
    </div>
  );
}

function Checkout({ products }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const showToast = useToast();
  const cartItems = useSelector(s => s.cart.items);

  const [step, setStep] = useState(1);
  const [placed, setPlaced] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', address: '', city: '', zip: '',
    card: '', expiry: '', cvv: '',
  });

  const fi = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const enriched = useMemo(
    () => cartItems.map(i => ({ ...i, p: products.find(x => x.id === i.id) })).filter(i => i.p),
    [cartItems, products]
  );

  const total = useMemo(
    () => enriched.reduce((s, i) => s + i.p.price * i.qty, 0),
    [enriched]
  );

  const clamp = s => s.length > 36 ? s.slice(0, 36) + '…' : s;

  if (placed) return (
    <div className="success-box">
      <div className="success-icon">🎉</div>
      <div className="success-title">Order Confirmed!</div>
      <p className="success-sub">
        Thank you for your purchase.<br />
        Your items will arrive in 3–5 business days.
      </p>
      <button className="btn-primary" onClick={() => navigate('/')}>
        Back to Home
      </button>
    </div>
  );

  if (cartItems.length === 0) return (
    <div className="empty" style={{ padding: '80px 20px' }}>
      <div className="empty-icon">🛒</div>
      <div className="empty-title">Nothing to checkout</div>
      <button className="btn-primary" style={{ marginTop: 20 }} onClick={() => navigate('/shop')}>
        Go Shopping
      </button>
    </div>
  );

  const handlePlace = () => {
    dispatch(clearCart());
    setPlaced(true);
    showToast('🎉 Order placed successfully!');
  };

  return (
    <div className="checkout-wrap">
      {/* LEFT — Form */}
      <div>
        <StepIndicator current={step} />

        {step === 1 && (
          <div className="form-section">
            <div className="form-section-title">Delivery Information</div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" placeholder="John Doe"
                  value={form.name} onChange={e => fi('name', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" placeholder="john@email.com"
                  value={form.email} onChange={e => fi('email', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Address</label>
              <input className="form-input" placeholder="123 Main Street"
                value={form.address} onChange={e => fi('address', e.target.value)} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">City</label>
                <input className="form-input" placeholder="New Delhi"
                  value={form.city} onChange={e => fi('city', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">PIN Code</label>
                <input className="form-input" placeholder="110001"
                  value={form.zip} onChange={e => fi('zip', e.target.value)} />
              </div>
            </div>
            <button className="btn-primary" onClick={() => setStep(2)}>
              Continue to Payment →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="form-section">
            <div className="form-section-title">Payment Details</div>
            <div className="form-group">
              <label className="form-label">Card Number</label>
              <input className="form-input" placeholder="4242 4242 4242 4242" maxLength={19}
                value={form.card} onChange={e => fi('card', e.target.value)} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Expiry</label>
                <input className="form-input" placeholder="MM / YY" maxLength={7}
                  value={form.expiry} onChange={e => fi('expiry', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">CVV</label>
                <input className="form-input" placeholder="•••" maxLength={4}
                  value={form.cvv} onChange={e => fi('cvv', e.target.value)} />
              </div>
            </div>
            <div className="form-btns">
              <button className="btn-outline" onClick={() => setStep(1)}>← Back</button>
              <button className="btn-primary" onClick={() => setStep(3)}>Review Order →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-section">
            <div className="form-section-title">Review & Confirm</div>
            <div style={{ marginBottom: 14, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.68rem', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 5 }}>
                Delivering to
              </div>
              <div style={{ fontSize: '0.9rem' }}>
                {form.name || '—'} · {form.city || '—'}, {form.zip || '—'}
              </div>
            </div>
            {enriched.map(({ id, qty, p }) => (
              <div key={id} className="summary-item">
                <span>{clamp(p.title)} × {qty}</span>
                <span>${(p.price * qty).toFixed(2)}</span>
              </div>
            ))}
            <div className="summary-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="form-btns" style={{ marginTop: 20 }}>
              <button className="btn-outline" onClick={() => setStep(2)}>← Back</button>
              <button className="btn-primary" onClick={handlePlace}>Place Order 🎉</button>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT — Order Summary */}
      <div className="order-summary">
        <div className="summary-title">Order Summary</div>
        {enriched.map(({ id, qty, p }) => (
          <div key={id} className="summary-item">
            <span style={{ fontSize: '0.8rem' }}>{clamp(p.title)} × {qty}</span>
            <span>${(p.price * qty).toFixed(2)}</span>
          </div>
        ))}
        <div className="summary-item">
          <span>Shipping</span>
          <span style={{ color: 'var(--success)' }}>Free</span>
        </div>
        <div className="summary-total">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button className="place-btn" onClick={step === 3 ? handlePlace : () => setStep(3)}>
          {step === 3 ? 'Confirm Order 🎉' : 'Skip to Confirm →'}
        </button>
      </div>
    </div>
  );
}

export default Checkout;
