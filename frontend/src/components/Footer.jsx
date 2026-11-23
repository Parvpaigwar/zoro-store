import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="footer-logo">ZORO</div>
          <p className="muted small">
            Unique, aesthetic objects —
            <br />
            found, tested and shipped from India.
          </p>
        </div>
        <div>
          <h4 className="label">Shop</h4>
          <Link to="/shop">Shop All</Link>
          <Link to="/shop/decor">Decor</Link>
          <Link to="/shop/gadgets">Gadgets</Link>
        </div>
        <div>
          <h4 className="label">Info</h4>
          <Link to="/about">About</Link>
          <a href="mailto:hello@zoro.store">Contact</a>
          <span className="muted">Shipping & Returns — 7 days</span>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} ZORO</span>
        <span>Made for curious spaces</span>
      </div>
    </footer>
  );
}
