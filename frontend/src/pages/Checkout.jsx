import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, api, assetUrl, formatPrice } from '../lib/api.js';

const EMPTY = {
  name: '', email: '', phone: '',
  line1: '', line2: '', city: '', state: '', pincode: '',
};

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  if (items.length === 0) {
    return (
      <section className="section narrow center">
        <h1 className="page-title">Checkout</h1>
        <p className="muted">Your cart is empty.</p>
        <Link to="/shop" className="btn btn-outline">Continue shopping</Link>
      </section>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const order = await api.createOrder({
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        customer: { name: form.name, email: form.email, phone: form.phone },
        shippingAddress: {
          line1: form.line1, line2: form.line2, city: form.city, state: form.state, pincode: form.pincode,
        },
      });
      clear();
      navigate(`/order/${order.orderNumber}`, { replace: true });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <section className="checkout">
      <form className="checkout-form" onSubmit={submit}>
        <h1 className="page-title">Checkout</h1>

        <fieldset>
          <legend className="label">Contact</legend>
          <Field label="Full name" value={form.name} onChange={set('name')} autoComplete="name" required />
          <div className="field-row">
            <Field label="Email" type="email" value={form.email} onChange={set('email')} autoComplete="email" required />
            <Field
              label="Phone" type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel"
              pattern="[0-9+\s\-]{10,15}" title="Enter a valid phone number" required
            />
          </div>
        </fieldset>

        <fieldset>
          <legend className="label">Shipping address</legend>
          <Field label="Address" value={form.line1} onChange={set('line1')} autoComplete="address-line1" required />
          <Field label="Apartment, landmark (optional)" value={form.line2} onChange={set('line2')} autoComplete="address-line2" />
          <div className="field-row field-row-3">
            <Field label="City" value={form.city} onChange={set('city')} autoComplete="address-level2" required />
            <Field label="State" value={form.state} onChange={set('state')} autoComplete="address-level1" required />
            <Field
              label="PIN code" value={form.pincode} onChange={set('pincode')} autoComplete="postal-code"
              inputMode="numeric" pattern="[0-9]{6}" title="6-digit PIN code" required
            />
          </div>
        </fieldset>

        <fieldset>
          <legend className="label">Payment</legend>
          <label className="radio-card">
            <input type="radio" checked readOnly />
            <span>
              Cash on delivery
              <span className="muted small block">Pay when your order arrives.</span>
            </span>
          </label>
        </fieldset>

        {error && <p className="form-error">{error}</p>}

        <button className="btn btn-solid btn-block" disabled={submitting}>
          {submitting ? 'Placing order…' : `Place order — ${formatPrice(subtotal + shipping)}`}
        </button>
      </form>

      <aside className="summary">
        <ul>
          {items.map((i) => (
            <li key={i.productId} className="summary-line">
              <div className="summary-thumb">
                <img src={assetUrl(i.image)} alt={i.name} />
                <span className="summary-qty">{i.quantity}</span>
              </div>
              <span className="summary-name">{i.name}</span>
              <span>{formatPrice(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="summary-totals">
          <div className="row-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
          <div className="row-between"><span>Shipping</span><span>{shipping ? formatPrice(shipping) : 'Free'}</span></div>
          <div className="row-between total"><span>Total</span><span>{formatPrice(subtotal + shipping)}</span></div>
        </div>
      </aside>
    </section>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input {...props} />
    </label>
  );
}
