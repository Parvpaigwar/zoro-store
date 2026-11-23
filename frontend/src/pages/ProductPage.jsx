import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Accordion from '../components/Accordion.jsx';
import ProductCard from '../components/ProductCard.jsx';
import QuantityInput from '../components/QuantityInput.jsx';
import { ErrorState, Loading } from '../components/Status.jsx';
import { useCart } from '../context/CartContext.jsx';
import { api, assetUrl, formatPrice } from '../lib/api.js';
import useFetch from '../lib/useFetch.js';

export default function ProductPage() {
  const { slug } = useParams();
  const { data: product, loading, error } = useFetch(() => api.product(slug), [slug]);
  const { data: all } = useFetch(() => api.products(), []);

  if (loading) return <Loading />;
  if (error) return <ErrorState error={error} />;

  const more = (all || []).filter((p) => p._id !== product._id).slice(0, 4);
  return <ProductView key={product._id} product={product} more={more} />;
}

function ProductView({ product, more }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const onSale = product.compareAtPrice > product.price;

  return (
    <>
      <section className="pdp">
        <div className="pdp-gallery">
          {/* Desktop: stacked images. Mobile: swipe carousel. */}
          <div
            className="pdp-images"
            onScroll={(e) => {
              const el = e.currentTarget;
              if (el.scrollWidth > el.clientWidth) setActive(Math.round(el.scrollLeft / el.clientWidth));
            }}
          >
            {product.images.map((src, i) => (
              <div className="pdp-image" key={src}>
                <img
                  src={assetUrl(src)}
                  alt={`${product.name} — view ${i + 1}`}
                  loading={i < 2 ? 'eager' : 'lazy'}
                />
              </div>
            ))}
          </div>
          {product.images.length > 1 && (
            <div className="pdp-dots">
              {product.images.map((src, i) => (
                <span key={src} className={i === active ? 'is-active' : ''} />
              ))}
            </div>
          )}
        </div>

        <div className="pdp-info">
          <div className="pdp-sticky">
            <nav className="crumbs muted small">
              <Link to="/shop">Shop</Link> / <Link to={`/shop/${product.category.toLowerCase()}`}>{product.category}</Link>
            </nav>
            <h1 className="pdp-title">{product.name}</h1>
            <div className="pdp-price">
              {onSale && <s className="muted">{formatPrice(product.compareAtPrice)}</s>}
              <span>{formatPrice(product.price)}</span>
              {onSale && (
                <span className="tag">
                  Save {Math.round((1 - product.price / product.compareAtPrice) * 100)}%
                </span>
              )}
            </div>
            <p className="muted small">Tax included. Shipping calculated at checkout.</p>

            <p className="pdp-tagline">{product.tagline}</p>

            <div className="pdp-buy">
              <span className="label">Quantity</span>
              <QuantityInput value={qty} onChange={setQty} max={product.stock} />
              <button className="btn btn-solid btn-block" disabled={!product.inStock} onClick={() => add(product, qty)}>
                {product.inStock ? `Add to cart — ${formatPrice(product.price * qty)}` : 'Sold out'}
              </button>
              {product.inStock && product.stock <= 5 && (
                <p className="small low-stock">Only {product.stock} left</p>
              )}
            </div>

            <p className="pdp-desc">{product.description}</p>

            {product.highlights?.length > 0 && (
              <ul className="pdp-highlights">
                {product.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            )}

            <div className="accordions">
              {product.details?.map((d, i) => (
                <Accordion key={d.title} title={d.title} defaultOpen={i === 0}>
                  <p>{d.body}</p>
                </Accordion>
              ))}
            </div>
          </div>
        </div>
      </section>

      {more.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2 className="label">You may also like</h2>
          </div>
          <div className="grid">
            {more.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
