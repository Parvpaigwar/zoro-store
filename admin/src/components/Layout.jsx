import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { STORE_URL } from '../lib/api.js';

export default function Layout() {
  const { admin, isSuper, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="shell">
      <aside className={`sidebar ${open ? 'is-open' : ''}`}>
        <div className="brand">
          ZORO <span>Admin</span>
        </div>
        <nav className="side-nav">
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/orders">Orders</NavLink>
          <NavLink to="/products">Products</NavLink>
          {isSuper && <NavLink to="/admins">Team</NavLink>}
          <NavLink to="/account">Account</NavLink>
        </nav>
        <div className="side-foot">
          <a href={STORE_URL} target="_blank" rel="noreferrer">View store ↗</a>
          <div className="who">
            <strong>{admin.name}</strong>
            <span>{admin.role === 'superadmin' ? 'Super admin' : 'Admin'}</span>
          </div>
          <button className="link" onClick={logout}>Sign out</button>
        </div>
      </aside>

      <div className="content">
        <header className="topbar">
          <button className="link menu-btn" onClick={() => setOpen((o) => !o)}>{open ? 'Close' : 'Menu'}</button>
          <span className="brand brand-sm">ZORO <span>Admin</span></span>
        </header>
        <main className="page">
          <Outlet />
        </main>
      </div>
      {open && <div className="scrim" onClick={() => setOpen(false)} />}
    </div>
  );
}
