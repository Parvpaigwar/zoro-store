import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ErrorNote, Loading, PageHead } from '../components/ui.jsx';
import { api, assetUrl, formatPrice } from '../lib/api.js';
import useFetch from '../lib/useFetch.js';

export default function Products() {
  const [params, setParams] = useSearchParams();
  const status = params.get('status') || '';
  const [q, setQ] = useState(params.get('q') || '');
  const { data: products, loading, error } = useFetch(
    () => api.products({ status, q: params.get('q') || '' }),
    [status, params.get('q')]
  );

  const update = (k, v) => {
    const next = new URLSearchParams(params);
    v ? next.set(k, v) : next.delete(k);
    setParams(next, { replace: true });
  };

  return (
    <>
      <PageHead title="Products">
        <Link to="/products/new" className="btn btn-primary">Add product</Link>
      </PageHead>

      <div className="toolbar">
        <form onSubmit={(e) => { e.preventDefault(); update('q', q.trim()); }}>
          <input className="input" placeholder="Search name, slug, category…" value={q} onChange={(e) => setQ(e.target.value)} />
        </form>
        <div className="tabs">
          {[['', 'All'], ['active', 'Live'], ['draft', 'Hidden'], ['low', 'Low stock']].map(([v, l]) => (
            <button key={v} className={status === v ? 'is-active' : ''} onClick={() => update('status', v)}>{l}</button>
          ))}
        </div>
      </div>

      <ErrorNote error={error} />
      {loading && !products && <Loading />}
      {products && (
        <div className="card">
          {products.length === 0 ? (
            <p className="empty">No products match.</p>
          ) : (
            <table className="table">
              <thead>
                <tr><th>Product</th><th className="hide-sm">Category</th><th className="num">Price</th><th className="num">Stock</th><th>Status</th></tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <Link to={`/products/${p._id}`} className="prod-cell">
                        <img src={assetUrl(p.images?.[0])} alt="" />
                        <span>
                          <strong>{p.name}</strong>
                          <span className="muted small block">/{p.slug}</span>
                        </span>
                      </Link>
                    </td>
                    <td className="hide-sm">{p.category}</td>
                    <td className="num">{formatPrice(p.price)}</td>
                    <td className={`num ${p.stock === 0 ? 'text-danger' : p.stock <= 5 ? 'text-warn' : ''}`}>{p.stock}</td>
                    <td>
                      <span className={`badge ${p.active ? 'badge-delivered' : 'badge-muted'}`}>{p.active ? 'Live' : 'Hidden'}</span>
                      {p.featured && <span className="badge badge-confirmed">Featured</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </>
  );
}
