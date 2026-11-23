import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ConfirmButton, ErrorNote, Loading, PageHead, StatusBadge, Toast } from '../components/ui.jsx';
import { api, assetUrl, formatDate, formatPrice } from '../lib/api.js';
import useFetch from '../lib/useFetch.js';

const ACTION_LABEL = { confirmed: 'Confirm order', shipped: 'Mark as shipped', delivered: 'Mark as delivered' };

export default function OrderDetail() {
  const { orderNumber } = useParams();
  const { data, loading, error, setData } = useFetch(() => api.order(orderNumber), [orderNumber]);
  const [actionError, setActionError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState('');

  if (loading && !data) return <Loading />;
  if (error) return <ErrorNote error={error} />;

  const { order, nextStatuses } = data;
  const a = order.shippingAddress;

  const move = async (status) => {
    setBusy(true);
    setActionError(null);
    try {
      setData(await api.setOrderStatus(order.orderNumber, status));
      setToast(`Order ${status}`);
    } catch (err) {
      setActionError(err);
    } finally {
      setBusy(false);
    }
  };

  const forward = nextStatuses.filter((s) => s !== 'cancelled');

  return (
    <>
      <PageHead title={<span className="mono">{order.orderNumber}</span>}>
        <Link to="/orders" className="btn btn-ghost">Back</Link>
      </PageHead>
      <p className="muted subhead">Placed {formatDate(order.createdAt)} · <StatusBadge status={order.status} /></p>
      <ErrorNote error={actionError} />

      <div className="form-grid">
        <div className="form-main">
          <section className="card">
            <div className="card-head"><h2>Items</h2></div>
            <table className="table">
              <tbody>
                {order.items.map((i) => (
                  <tr key={i.slug}>
                    <td className="prod-cell">
                      <img src={assetUrl(i.image)} alt="" />
                      <span><strong>{i.name}</strong><span className="muted small block">{formatPrice(i.price)} × {i.quantity}</span></span>
                    </td>
                    <td className="num">{formatPrice(i.price * i.quantity)}</td>
                  </tr>
                ))}
                <tr><td className="muted">Subtotal</td><td className="num">{formatPrice(order.subtotal)}</td></tr>
                <tr><td className="muted">Shipping</td><td className="num">{order.shipping ? formatPrice(order.shipping) : 'Free'}</td></tr>
                <tr className="row-total"><td>Total · Cash on delivery</td><td className="num">{formatPrice(order.total)}</td></tr>
              </tbody>
            </table>
          </section>
        </div>

        <div className="form-side">
          <section className="card pad">
            <h2>Fulfilment</h2>
            {nextStatuses.length === 0 ? (
              <p className="muted small">This order is {order.status}. No further actions.</p>
            ) : (
              <div className="stack">
                {forward.map((s) => (
                  <button key={s} className="btn btn-primary btn-block" disabled={busy} onClick={() => move(s)}>{ACTION_LABEL[s]}</button>
                ))}
                {nextStatuses.includes('cancelled') && (
                  <>
                    <ConfirmButton className="btn btn-ghost btn-block" confirmLabel="Yes, cancel order" disabled={busy} onConfirm={() => move('cancelled')}>
                      Cancel order
                    </ConfirmButton>
                    <p className="muted small">Cancelling puts the items back in stock.</p>
                  </>
                )}
              </div>
            )}
          </section>

          <section className="card pad">
            <h2>Customer</h2>
            <p>
              <strong>{order.customer.name}</strong><br />
              <a href={`mailto:${order.customer.email}`}>{order.customer.email}</a><br />
              <a href={`tel:${order.customer.phone}`}>{order.customer.phone}</a>
            </p>
            <h2>Ship to</h2>
            <p>
              {a.line1}{a.line2 ? <><br />{a.line2}</> : null}<br />
              {a.city}, {a.state} {a.pincode}
            </p>
          </section>
        </div>
      </div>
      <Toast message={toast} onDone={() => setToast('')} />
    </>
  );
}
