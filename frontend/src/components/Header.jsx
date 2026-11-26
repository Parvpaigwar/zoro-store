import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { FREE_SHIPPING_THRESHOLD, api, formatPrice } from '../lib/api.js';
import { categoryStyle } from '../lib/categories.js';
import useFetch from '../lib/useFetch.js';
import { CartIcon, CashIcon, ChevronDown, CloseIcon, MenuIcon, ReturnIcon, SearchIcon, TruckIcon } from './Icons.jsx';

export default function Header() {
  const { count, setOpen } = useCart();
  const { data: categories } = useFetch(() => api.categories(), []);
  const [menuOpen, setMenuOpen] = useState(false);
  const [catsOpen, setCatsOpen] = useState(false);
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') || '');
  const navigate = useNavigate();
  const catsRef = useRef(null);

  useEffect(() => {
    setMenuOpen(false);
    setCatsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!catsOpen) return;
    const close = (e) => !catsRef.current?.contains(e.target) && setCatsOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [catsOpen]);

  const submit = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop');
  };

  const nav = [
    { to: '/', label: 'Home', end: true },
    { to: '/shop', label: 'Shop', end: true },
    ...(categories || []).map((c) => ({ to: `/shop/${c.toLowerCase()}`, label: c })),
    { to: '/about', label: 'Our Story' },
  ];

  return (
    <header className="header">
      <div className="topbar">
        <span><TruckIcon size={15} /> Free Shipping on Orders Over {formatPrice(FREE_SHIPPING_THRESHOLD)}</span>
        <span className="hide-mobile"><ReturnIcon size={15} /> 7-Day Easy Returns</span>
        <span className="hide-mobile"><CashIcon size={15} /> Cash on Delivery</span>
      </div>

      <div className="header-main container">
        <button className="icon-btn nav-toggle" onClick={() => setMenuOpen((o) => !o)} aria-label="Menu" aria-expanded={menuOpen}>
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        <Link to="/" className="logo" aria-label="ZORO home">
          <span className="logo-mark">Z</span>
          <span className="logo-text">
            ZORO
            <small>Unique Objects</small>
          </span>
        </Link>

        <form className="search" onSubmit={submit} role="search">
          <input
            type="search"
            placeholder="Search products and categories…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search products"
          />
          <button type="submit" aria-label="Search">
            <SearchIcon size={18} />
          </button>
        </form>

        <button className="header-action" onClick={() => setOpen(true)} aria-label={`Cart, ${count} items`}>
          <span className="header-action-icon">
            <CartIcon size={22} />
            {count > 0 && <span className="count-badge">{count}</span>}
          </span>
          <span className="hide-mobile">Cart</span>
        </button>
      </div>

      <div className="header-nav container hide-mobile">
        <div className="cats" ref={catsRef}>
          <button className="cats-btn" onClick={() => setCatsOpen((o) => !o)} aria-expanded={catsOpen}>
            <MenuIcon size={18} /> All Categories <ChevronDown size={16} />
          </button>
          {catsOpen && (
            <div className="cats-menu">
              {(categories || []).map((c, i) => {
                const { Icon, tint } = categoryStyle(c, i);
                return (
                  <Link key={c} to={`/shop/${c.toLowerCase()}`}>
                    <span className="cats-icon" style={{ background: tint }}><Icon size={16} /></span>
                    {c}
                  </Link>
                );
              })}
              <Link to="/shop" className="cats-all">View everything</Link>
            </div>
          )}
        </div>
        <nav className="nav" aria-label="Primary">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className="nav-link">
              {n.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {menuOpen && (
        <nav className="mobile-menu">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end}>
              {n.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
