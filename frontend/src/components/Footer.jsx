import { Link } from 'react-router-dom';
import { FREE_SHIPPING_THRESHOLD, api, formatPrice } from '../lib/api.js';
import useFetch from '../lib/useFetch.js';
import { CashIcon, HeadsetIcon, ReturnIcon, TruckIcon } from './Icons.jsx';

export default function Footer() {
  const { data: categories } = useFetch(() => api.categories(), []);

  return (
    <>
      <section className="container">
        <div className="trust">
          <div><TruckIcon size={30} /><span><b>Free Shipping</b>On orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}</span></div>
          <div><ReturnIcon size={30} /><span><b>Easy Returns</b>7-day return policy</span></div>
          <div><CashIcon size={30} /><span><b>Cash on Delivery</b>Pay when it arrives</span></div>
          <div><HeadsetIcon size={30} /><span><b>Here to Help</b>hello@zoro.store</span></div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-grid container">
          <div className="footer-brand">
            <Link to="/" className="logo logo-light">
              <span className="logo-mark">Z</span>
              <span className="logo-text">
                ZORO
                <small>Unique Objects</small>
              </span>
            </Link>
            <p>Unique, aesthetic objects — found, tested and shipped from India.</p>
          </div>
          <div>
            <h4>Shop</h4>
            <Link to="/shop">All Products</Link>
            {(categories || []).map((c) => (
              <Link key={c} to={`/shop/${c.toLowerCase()}`}>{c}</Link>
            ))}
          </div>
          <div>
            <h4>Customer Service</h4>
            <span>Shipping in 2–4 days</span>
            <span>7-day returns</span>
            <a href="mailto:hello@zoro.store">Contact Us</a>
          </div>
          <div>
            <h4>Company</h4>
            <Link to="/about">Our Story</Link>
            <a href="mailto:hello@zoro.store">Partner With Us</a>
          </div>
        </div>
        <div className="footer-bottom container">
          <span>© {new Date().getFullYear()} ZORO. All rights reserved.</span>
          <span>Made for curious spaces</span>
        </div>
      </footer>
    </>
  );
}
