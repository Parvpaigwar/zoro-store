const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export const assetUrl = (path) => (!path || /^https?:/.test(path) ? path : `${API_BASE}${path}`);

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

export const api = {
  products: (params = {}) => request(`/products?${new URLSearchParams(params)}`),
  product: (slug) => request(`/products/${encodeURIComponent(slug)}`),
  categories: () => request('/products/categories'),
  createOrder: (body) => request('/orders', { method: 'POST', body: JSON.stringify(body) }),
  order: (orderNumber) => request(`/orders/${encodeURIComponent(orderNumber)}`),
};

export const FREE_SHIPPING_THRESHOLD = 999;
export const SHIPPING_FEE = 99;

export const formatPrice = (n) =>
  '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });
