import { Link } from 'react-router-dom';
import { ErrorNote, Loading, PageHead, StatusBadge } from '../components/ui.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { ORDER_STATUSES, api, assetUrl, formatDate, formatPrice } from '../lib/api.js';
import useFetch from '../lib/useFetch.js';

export default function Dashboard() {
  const { admin } = useAuth();
  const { data: s, loading, error } = useFetch(() => api.stats(), []);

  return (
    <>
      <PageHead title={`Hello, ${admin.name.split(' ')[0]}`}>
        <Link to="/products/new" className="btn btn-primary">Add product</Link>
      </PageHead>
      <ErrorNote error={error} />
      {loading && !s && <Loading />}
      {s && (
        <>
          <div className="stats">
            <Stat label="Revenue (30 days)" value={formatPrice(s.revenue30d)} sub={`${s.orders30d} orders`} />
            <Stat label="Revenue (all time)" value={formatPrice(s.revenue)} sub={`${s.orders} orders, excl. cancelled`} />
            <Stat label="To fulfil" value={(s.byStatus.placed || 0) + (s.byStatus.confirmed || 0)} sub="placed + confirmed" />
            <Stat label="Products" value={s.products} sub={`${s.lowStock.length} low on stock`} />
          </div>

          <div className="pipeline card">
            {ORDER_STATUSES.map((st) => (
              <Link key={st} to={`/orders?status=${st}`} className="pipe">
                <span className="pipe-n">{s.byStatus[st] || 0}</span>
                <StatusBadge status={st} />
              </Link>
            ))}
          </div>

          <div className="two-col">
            <section className="card">
              <div className="card-head">
                <h2>Recent orders</h2>
                <Link to="/orders" className="link">View all</Link>
              </div>
              {s.recent.length === 0 ? (
                <p className="muted pad">No orders yet.</p>
              ) : (
                <table className="table">
                  <tbody>
                    {s.recent.map((o) => (
                      <tr key={o.orderNumber}>
                        <td><Link to={`/orders/${o.orderNumber}`} className="mono">{o.orderNumber}</Link><div className="muted small">{formatDate(o.createdAt)}</div></td>
                        <td>{o.customer.name}</td>
                        <td><StatusBadge status={o.status} /></td>
                        <td className="num">{formatPrice(o.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>

            <section className="card">
              <div className="card-head">
                <h2>Low stock</h2>
                <Link to="/products?status=low" className="link">View</Link>
              </div>
              {s.lowStock.length === 0 ? (
                <p className="muted pad">Everything is well stocked.</p>
              ) : (
                <ul className="mini-list">
                  {s.lowStock.map((p) => (
                    <li key={p._id}>
                      <img src={assetUrl(p.images?.[0])} alt="" />
                      <Link to={`/products/${p._id}`}>{p.name}</Link>
                      <span className={p.stock === 0 ? 'text-danger' : 'text-warn'}>{p.stock} left</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </>
      )}
    </>
  );
}

function Stat({ label, value, sub }) {
  return (
    <div className="stat card">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
      <span className="muted small">{sub}</span>
    </div>
  );
}
