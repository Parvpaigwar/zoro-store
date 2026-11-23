import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { ErrorState, Loading } from '../components/Status.jsx';
import { api, assetUrl } from '../lib/api.js';
import useFetch from '../lib/useFetch.js';

export default function Home() {
  const { data: products, loading, error } = useFetch(() => api.products(), []);

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="label">Edition 01</span>
          <h1 className="display">
            Unusual objects
            <br />
            <em>for curious spaces.</em>
          </h1>
          <p className="hero-sub">
            A small, slowly growing collection of things that are genuinely unique — pieces that start
            conversations, earn a spot on your wall, or quietly make the day better.
          </p>
          <Link to="/shop" className="btn btn-solid">
            Shop the collection
          </Link>
        </div>
        <Link to="/products/warrior-sword" className="hero-media">
          <img src={assetUrl('/images/products/warrior-sword-2.jpg')} alt="The Warrior Sword mounted on a wall" />
          <span className="hero-caption">
            <span>The Warrior Sword</span>
            <span>View →</span>
          </span>
        </Link>
      </section>

      <section className="section">
        <div className="section-head">
          <h2 className="label">New In</h2>
          <Link to="/shop" className="label link-underline">
            View all
          </Link>
        </div>
        {loading && <Loading />}
        {error && <ErrorState error={error} />}
        {products && (
          <div className="grid">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      <section className="manifesto">
        <p className="display display-sm">
          We don't stock everything. <em>We stock the one thing</em> you didn't know you were looking for.
        </p>
        <div className="pillars">
          <div>
            <span className="label">01 — Rare</span>
            <p className="muted">Objects you won't find on every shelf.</p>
          </div>
          <div>
            <span className="label">02 — Considered</span>
            <p className="muted">Each piece is hand-picked and checked before it ships.</p>
          </div>
          <div>
            <span className="label">03 — Aesthetic</span>
            <p className="muted">If it doesn't look good in a room, it doesn't make the cut.</p>
          </div>
        </div>
      </section>

      <section className="split">
        <div className="split-media">
          <img src={assetUrl('/images/products/warrior-sword-3.jpg')} alt="Detail of the sword guard" loading="lazy" />
        </div>
        <div className="split-copy">
          <span className="label">In focus</span>
          <h2 className="display display-sm">The detail is the point.</h2>
          <p className="muted">
            Etched blade, cast dragon guard, copper-coiled grip, walnut-tone plaque. A wall piece built to be
            looked at up close.
          </p>
          <Link to="/products/warrior-sword" className="label link-underline">
            Discover the Warrior Sword
          </Link>
        </div>
      </section>
    </>
  );
}
