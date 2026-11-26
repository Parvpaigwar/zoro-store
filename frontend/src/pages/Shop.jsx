import { Link, NavLink, useParams, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { ErrorState, Loading } from '../components/Status.jsx';
import { api } from '../lib/api.js';
import useFetch from '../lib/useFetch.js';

export default function Shop() {
  const { category: slug } = useParams();
  const [params] = useSearchParams();
  const q = (params.get('q') || '').trim().toLowerCase();
  const { data: categories } = useFetch(() => api.categories(), []);
  const category = slug && categories?.find((c) => c.toLowerCase() === slug.toLowerCase());

  const { data: products, loading, error } = useFetch(
    () => (slug && !categories ? new Promise(() => {}) : api.products(category ? { category } : {})),
    [slug, categories]
  );

  const title = q ? `Results for “${params.get('q').trim()}”` : slug ? category || slug : 'Shop All';
  const shown = products?.filter(
    (p) => !q || [p.name, p.tagline, p.category].some((f) => f?.toLowerCase().includes(q))
  );

  return (
    <section className="section container">
      <div className="page-head">
        <h1 className="page-title">{title}</h1>
        <nav className="filters">
          <NavLink to="/shop" end>
            All
          </NavLink>
          {categories?.map((c) => (
            <NavLink key={c} to={`/shop/${c.toLowerCase()}`}>
              {c}
            </NavLink>
          ))}
        </nav>
      </div>

      {loading && <Loading />}
      {error && <ErrorState error={error} />}
      {products && slug && categories && !category && (
        <div className="status">
          Nothing here yet. <Link to="/shop" className="link-underline">See everything</Link>
        </div>
      )}
      {products && (!slug || category) && (
        <>
          <p className="muted small count">{shown.length} {shown.length === 1 ? 'object' : 'objects'}</p>
          {shown.length === 0 && (
            <div className="status">
              No matches. <Link to="/shop" className="link-underline">See everything</Link>
            </div>
          )}
          <div className="grid">
            {shown.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
