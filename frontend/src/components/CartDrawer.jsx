import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { FREE_SHIPPING_THRESHOLD, assetUrl, formatPrice } from '../lib/api.js';
import QuantityInput from './QuantityInput.jsx';

export default function CartDrawer() {
  const { items, subtotal, update, remove, open, setOpen } = useCart();
  const navigate = useNavigate();
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, setOpen]);

  return (
    <>
      <div className={`overlay ${open ? 'is-open' : ''}`} onClick={() => setOpen(false)} />
      <aside className={`drawer ${open ? 'is-open' : ''}`} aria-hidden={!open} aria-label="Cart">
        <div className="drawer-head">
          <span className="label">Cart</span>
          <button className="link-btn" onClick={() => setOpen(false)}>
            Close
          </button>
        </div>

        {items.length === 0 ? (
          <div className="drawer-empty">
            <p>Your cart is empty.</p>
            <Link to="/shop" className="btn btn-outline" onClick={() => setOpen(false)}>
              Continue shopping
            </Link>
          </div>
        ) : (
          <>
            <p className="drawer-note">
              {remaining > 0
                ? `You're ${formatPrice(remaining)} away from free shipping.`
                : 'Your order ships free.'}
            </p>
            <ul className="drawer-items">
              {items.map((item) => (
                <li key={item.productId} className="line">
                  <Link to={`/products/${item.slug}`} onClick={() => setOpen(false)} className="line-media">
                    <img src={assetUrl(item.image)} alt={item.name} />
                  </Link>
                  <div className="line-info">
                    <div className="line-top">
                      <Link to={`/products/${item.slug}`} onClick={() => setOpen(false)} className="line-name">
                        {item.name}
                      </Link>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                    <span className="muted small">{item.category}</span>
                    <div className="line-actions">
                      <QuantityInput
                        small
                        value={item.quantity}
                        max={item.stock}
                        onChange={(q) => update(item.productId, q)}
                      />
                      <button className="link-btn muted" onClick={() => remove(item.productId)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="drawer-foot">
              <div className="row-between">
                <span className="label">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <p className="muted small">Shipping calculated at checkout.</p>
              <button
                className="btn btn-solid btn-block"
                onClick={() => {
                  setOpen(false);
                  navigate('/checkout');
                }}
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
