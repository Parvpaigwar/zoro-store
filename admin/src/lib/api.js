const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
export const STORE_URL = (import.meta.env.VITE_STORE_URL || 'http://localhost:5173').replace(/\/$/, '');
const TOKEN_KEY = 'zoro-admin-token';

export const assetUrl = (p) => (!p || /^https?:/.test(p) ? p : `${API_BASE}${p}`);

export const token = {
  get: () => {
    try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
  },
  set: (t) => {
    try { t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ }
  },
};

let onUnauthorized = () => {};
export const setUnauthorizedHandler = (fn) => { onUnauthorized = fn; };

async function request(path, { body, method = 'GET', form } = {}) {
  const headers = {};
  const t = token.get();
  if (t) headers.Authorization = `Bearer ${t}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${API_BASE}/api/admin${path}`, {
    method,
    headers,
    body: form ?? (body !== undefined ? JSON.stringify(body) : undefined),
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && !path.startsWith('/auth/login')) onUnauthorized();
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

const qs = (params) => {
  const s = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== '' && v != null)).toString();
  return s ? `?${s}` : '';
};

export const api = {
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  me: () => request('/auth/me'),
  changePassword: (currentPassword, newPassword) =>
    request('/auth/password', { method: 'POST', body: { currentPassword, newPassword } }),

  stats: () => request('/stats'),

  products: (params = {}) => request(`/products${qs(params)}`),
  product: (id) => request(`/products/${id}`),
  createProduct: (body) => request('/products', { method: 'POST', body }),
  updateProduct: (id, body) => request(`/products/${id}`, { method: 'PUT', body }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),
  uploadImages: (files) => {
    const form = new FormData();
    [...files].forEach((f) => form.append('images', f));
    return request('/products/upload', { method: 'POST', form });
  },

  orders: (params = {}) => request(`/orders${qs(params)}`),
  order: (orderNumber) => request(`/orders/${encodeURIComponent(orderNumber)}`),
  setOrderStatus: (orderNumber, status) =>
    request(`/orders/${encodeURIComponent(orderNumber)}`, { method: 'PATCH', body: { status } }),

  admins: () => request('/admins'),
  createAdmin: (body) => request('/admins', { method: 'POST', body }),
  updateAdmin: (id, body) => request(`/admins/${id}`, { method: 'PATCH', body }),
  deleteAdmin: (id) => request(`/admins/${id}`, { method: 'DELETE' }),
};

export const formatPrice = (n) => '₹' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });
export const formatDate = (d) =>
  new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
export const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

export const ORDER_STATUSES = ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'];
