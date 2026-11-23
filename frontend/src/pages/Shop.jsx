import { Link, NavLink, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { ErrorState, Loading } from '../components/Status.jsx';
import { api } from '../lib/api.js';
import useFetch from '../lib/useFetch.js';

export default function Shop() {
  const { category: slug } = useParams();
  const { data: categories } = useFetch(() => api.categories(), []);
  const category = slug && categories?.find((c) => c.toLowerCase() === slug.toLowerCase());

  const { data: products, loading, error } = useFetch(
    () => (slug && !categories ? new Promise(() => {}) : api.products(category ? { category } : {})),
    [slug, categories]
  );

  const title = slug ? category || slug : 'Shop All';

  return (
    <section className="section">
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
          <p className="muted small count">{products.length} {products.length === 1 ? 'object' : 'objects'}</p>
          <div className="grid">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
