import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Products from './pages/Products.jsx';
import ProductForm from './pages/ProductForm.jsx';
import Orders from './pages/Orders.jsx';
import OrderDetail from './pages/OrderDetail.jsx';
import Admins from './pages/Admins.jsx';
import Account from './pages/Account.jsx';

function RequireAuth({ children, superOnly }) {
  const { admin, checking, isSuper } = useAuth();
  const location = useLocation();
  if (checking) return <div className="boot">Loading…</div>;
  if (!admin) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (superOnly && !isSuper) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<RequireAuth><Layout /></RequireAuth>}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:id" element={<ProductForm />} />
        <Route path="orders" element={<Orders />} />
        <Route path="orders/:orderNumber" element={<OrderDetail />} />
        <Route path="admins" element={<RequireAuth superOnly><Admins /></RequireAuth>} />
        <Route path="account" element={<Account />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
