import { Link, useParams } from 'react-router-dom';
import { ErrorState, Loading } from '../components/Status.jsx';
import { api, formatPrice } from '../lib/api.js';
import useFetch from '../lib/useFetch.js';

export default function OrderConfirmation() {
  const { orderNumber } = useParams();
  const { data: order, loading, error } = useFetch(() => api.order(orderNumber), [orderNumber]);

  if (loading) return <Loading />;
  if (error) return <ErrorState error={error} />;

  const a = order.shippingAddress;
  return (
    <section className="section narrow">
      <span className="label">Order {order.orderNumber}</span>
      <h1 className="display display-sm">Thank you, {order.customer.name.split(' ')[0]}.</h1>
      <p className="muted">
        Your order is placed. We'll send updates to {order.customer.email} and call {order.customer.phone} before
        delivery. Payment: cash on delivery.
      </p>

      <div className="confirm-box">
        {order.items.map((i) => (
          <div key={i.slug} className="row-between">
            <span>{i.name} × {i.quantity}</span>
            <span>{formatPrice(i.price * i.quantity)}</span>
          </div>
        ))}
        <div className="row-between muted"><span>Shipping</span><span>{order.shipping ? formatPrice(order.shipping) : 'Free'}</span></div>
        <div className="row-between total"><span>Total</span><span>{formatPrice(order.total)}</span></div>
      </div>

      <div className="confirm-box">
        <span className="label">Shipping to</span>
        <p>
          {order.customer.name}<br />
          {a.line1}{a.line2 ? `, ${a.line2}` : ''}<br />
          {a.city}, {a.state} {a.pincode}
        </p>
      </div>

      <Link to="/shop" className="btn btn-outline">Continue shopping</Link>
    </section>
  );
}
