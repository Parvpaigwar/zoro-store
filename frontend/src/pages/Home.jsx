import { useRef } from 'react';
import { Link } from 'react-router-dom';
import Newsletter from '../components/Newsletter.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { ErrorState, Loading } from '../components/Status.jsx';
import {
  ArrowRight,
  CashIcon,
  ChevronLeft,
  ChevronRight,
  GridIcon,
  HandIcon,
  ShieldIcon,
  SparkleIcon,
  StarIcon,
} from '../components/Icons.jsx';
import { api, assetUrl } from '../lib/api.js';
import { categoryStyle } from '../lib/categories.js';
import useFetch from '../lib/useFetch.js';

// PLACEHOLDER — replace with real customer reviews before launch.
const REVIEWS = [
  { name: 'Aarav M.', text: 'The sword looks even better on the wall than in the photos. Packed really well too.' },
  { name: 'Ishita R.', text: 'Love that every piece feels hand-picked. Cash on delivery made it easy to try.' },
  { name: 'Kabir S.', text: 'Quick delivery and genuinely unique stuff — got so many compliments already.' },
];

const PROMO_TINTS = ['#e3ead6', '#f3e6d6', '#dde8f3'];

export default function Home() {
  const { data: products, loading, error } = useFetch(() => api.products(), []);
  const { data: categories } = useFetch(() => api.categories(), []);
  const rail = useRef(null);

  const scroll = (dir) => rail.current?.scrollBy({ left: dir * rail.current.clientWidth * 0.8, behavior: 'smooth' });

  // One promo tile per category, using that category's first product image.
  const promos = (categories || []).slice(0, 2).map((c, i) => ({
    eyebrow: categoryStyle(c, i).blurb,
    title: `Shop ${c}`,
    to: `/shop/${c.toLowerCase()}`,
    image: products?.find((p) => p.category === c)?.images?.[0],
    tint: PROMO_TINTS[i],
  }));
  promos.push({
    eyebrow: 'Our Story',
    title: 'Why We Stock Less',
    to: '/about',
    image: '/images/products/warrior-sword-3.jpg',
    tint: PROMO_TINTS[2],
  });

  return (
    <div className="home container">
      {/* Hero */}
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Edition 01 · New Collection</span>
          <h1 className="hero-title">Unusual Objects for Curious Spaces</h1>
          <p className="hero-sub">
            Hand-picked, genuinely unique pieces — things that start conversations and quietly make the day better.
          </p>
          <Link to="/shop" className="btn btn-solid">
            Shop Now <ArrowRight size={16} />
          </Link>
          <ul className="hero-trust">
            <li><HandIcon size={18} /> Hand-picked</li>
            <li><CashIcon size={18} /> Cash on Delivery</li>
            <li><ShieldIcon size={18} /> Quality Checked</li>
          </ul>
        </div>
        <Link to="/products/warrior-sword" className="hero-media">
          <img src={assetUrl('/images/products/warrior-sword-2.jpg')} alt="The Warrior Sword mounted on a wall" />
          <span className="hero-tag">
            <small>Featured</small>
            The Warrior
            <br />
            Sword
          </span>
        </Link>
      </section>

      {/* Categories */}
      {categories?.length > 0 && (
        <section className="cat-row" aria-label="Categories">
          {categories.map((c, i) => {
            const { Icon, tint } = categoryStyle(c, i);
            return (
              <Link key={c} to={`/shop/${c.toLowerCase()}`} className="cat-item">
                <span className="cat-circle" style={{ background: tint }}>
                  <Icon size={28} />
                </span>
                {c}
              </Link>
            );
          })}
          <Link to="/shop" className="cat-item">
            <span className="cat-circle cat-circle-plain">
              <GridIcon size={26} />
            </span>
            View All
          </Link>
        </section>
      )}

      {/* Top picks */}
      <section className="panel">
        <div className="panel-head">
          <h2 className="panel-title">
            Top Picks For You <SparkleIcon size={18} className="accent-icon" />
          </h2>
          <Link to="/shop" className="see-all">
            See All <ArrowRight size={16} />
          </Link>
        </div>
        {loading && <Loading />}
        {error && <ErrorState error={error} />}
        {products && (
          <div className="rail-wrap">
            <div className="rail" ref={rail}>
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
            {products.length > 4 && (
              <>
                <button className="rail-btn rail-prev" onClick={() => scroll(-1)} aria-label="Previous">
                  <ChevronLeft />
                </button>
                <button className="rail-btn rail-next" onClick={() => scroll(1)} aria-label="Next">
                  <ChevronRight />
                </button>
              </>
            )}
          </div>
        )}
      </section>

      {/* Promo tiles */}
      <section className="promos">
        {promos.map((p) => (
          <Link key={p.to} to={p.to} className="promo" style={{ background: p.tint }}>
            <div className="promo-copy">
              <span className="promo-eyebrow">{p.eyebrow}</span>
              <h3>{p.title}</h3>
              <span className="promo-cta">
                Shop Now <ArrowRight size={14} />
              </span>
            </div>
            {p.image && <img src={assetUrl(p.image)} alt="" loading="lazy" />}
          </Link>
        ))}
      </section>

      {/* Reviews */}
      <section className="panel">
        <div className="panel-head">
          <h2 className="panel-title">
            Loved By Our Customers <span className="heart">♥</span>
          </h2>
        </div>
        <div className="reviews">
          {REVIEWS.map((r) => (
            <figure key={r.name} className="review">
              <span className="avatar">{r.name[0]}</span>
              <div>
                <figcaption>{r.name}</figcaption>
                <span className="stars">
                  {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
                </span>
                <blockquote>“{r.text}”</blockquote>
              </div>
            </figure>
          ))}
        </div>
      </section>

      <Newsletter />
    </div>
  );
}
