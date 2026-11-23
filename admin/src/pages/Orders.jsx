import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ErrorNote, Loading, PageHead, StatusBadge } from '../components/ui.jsx';
import { ORDER_STATUSES, api, formatDate, formatPrice } from '../lib/api.js';
import useFetch from '../lib/useFetch.js';

export default function Orders() {
  const [params, setParams] = useSearchParams();
  const status = params.get('status') || '';
  const page = Number(params.get('page')) || 1;
  const query = params.get('q') || '';
  const [q, setQ] = useState(query);
  const { data, loading, error } = useFetch(() => api.orders({ status, page, q: query }), [status, page, query]);

  const update = (changes) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    setParams(next, { replace: true });
  };

  return (
    <>
      <PageHead title="Orders" />
      <div className="toolbar">
        <form onSubmit={(e) => { e.preventDefault(); update({ q: q.trim(), page: '' }); }}>
          <input className="input" placeholder="Order #, name, email, phone…" value={q} onChange={(e) => setQ(e.target.value)} />
        </form>
        <div className="tabs">
          <button className={!status ? 'is-active' : ''} onClick={() => update({ status: '', page: '' })}>All</button>
          {ORDER_STATUSES.map((s) => (
            <button key={s} className={status === s ? 'is-active' : ''} onClick={() => update({ status: s, page: '' })}>{s}</button>
          ))}
        </div>
      </div>

      <ErrorNote error={error} />
      {loading && !data && <Loading />}
      {data && (
        <div className="card">
          {data.orders.length === 0 ? (
            <p className="empty">No orders{status ? ` with status “${status}”` : ''}.</p>
          ) : (
            <table className="table">
              <thead>
                <tr><th>Order</th><th>Customer</th><th className="hide-sm">Items</th><th>Status</th><th className="num">Total</th></tr>
              </thead>
              <tbody>
                {data.orders.map((o) => (
                  <tr key={o.orderNumber}>
                    <td><Link to={`/orders/${o.orderNumber}`} className="mono">{o.orderNumber}</Link><div className="muted small">{formatDate(o.createdAt)}</div></td>
                    <td>{o.customer.name}<div className="muted small">{o.customer.phone}</div></td>
                    <td className="hide-sm">{o.items.reduce((n, i) => n + i.quantity, 0)}</td>
                    <td><StatusBadge status={o.status} /></td>
                    <td className="num">{formatPrice(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      {data && data.pages > 1 && (
        <div className="pager">
          <button className="btn btn-ghost" disabled={page <= 1} onClick={() => update({ page: String(page - 1) })}>← Prev</button>
          <span className="muted small">Page {data.page} of {data.pages} · {data.total} orders</span>
          <button className="btn btn-ghost" disabled={page >= data.pages} onClick={() => update({ page: String(page + 1) })}>Next →</button>
        </div>
      )}
    </>
  );
}
