import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { FREE_SHIPPING_THRESHOLD, formatPrice } from '../lib/api.js';

const NAV = [
  { to: '/shop', label: 'Shop All', end: true },
  { to: '/shop/decor', label: 'Decor' },
  { to: '/shop/gadgets', label: 'Gadgets' },
];

export default function Header() {
  const { count, setOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="header">
      <div className="announcement">
        Free shipping above {formatPrice(FREE_SHIPPING_THRESHOLD)} · Cash on delivery
      </div>
      <div className="header-bar">
        <nav className="nav nav-left" aria-label="Primary">
          <button className="nav-toggle" onClick={() => setMenuOpen((o) => !o)} aria-expanded={menuOpen}>
            {menuOpen ? 'Close' : 'Menu'}
          </button>
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className="nav-link hide-mobile">
              {n.label}
            </NavLink>
          ))}
        </nav>

        <Link to="/" className="logo" aria-label="ZORO home">
          ZORO
        </Link>

        <nav className="nav nav-right">
          <NavLink to="/about" className="nav-link hide-mobile">
            About
          </NavLink>
          <button className="nav-link cart-btn" onClick={() => setOpen(true)}>
            Cart ({count})
          </button>
        </nav>
      </div>

      {menuOpen && (
        <nav className="mobile-menu">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end}>
              {n.label}
            </NavLink>
          ))}
          <NavLink to="/about">About</NavLink>
        </nav>
      )}
    </header>
  );
}
