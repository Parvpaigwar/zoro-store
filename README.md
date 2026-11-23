# ZORO — unique objects

A minimal, light-theme e-commerce store built on the MERN stack (MongoDB, Express, React, Node).

```
zoro-store/
├── backend/            Express + Mongoose API
│   ├── public/images/  product images (served at /images)
│   └── src/
│       ├── config/db.js        Mongo connection (in-memory fallback for dev)
│       ├── models/             Product, Order
│       ├── routes/             /api/products, /api/orders
│       └── data/products.js    catalogue seed: add new products here
├── admin/              React + Vite admin panel (super admin)
│   └── src/pages/      Dashboard, Orders, OrderDetail, Products, ProductForm, Team, Account
├── frontend/           React + Vite storefront
│   └── src/
│       ├── pages/      Home, Shop, ProductPage, Checkout, OrderConfirmation, About
│       ├── components/ Header, Footer, CartDrawer, ProductCard, …
│       └── styles.css  the whole design system
└── assets-src/         original product photos
```

## Run it

```bash
npm install
nvm use            # Node 20 (see .nvmrc)
npm run dev        # API :5000 · storefront http://localhost:5173 · admin http://localhost:5174
```

Copy `backend/.env.example` to `backend/.env` first and set `JWT_SECRET`, `ADMIN_EMAIL` and `ADMIN_PASSWORD`.

With no `MONGO_URI` in `backend/.env`, the API starts an **in-memory MongoDB** and seeds it automatically. That is handy for development, but orders are lost on restart.

For persistent data, put a real MongoDB/Atlas URI in `backend/.env` and seed it:

```bash
MONGO_URI=mongodb+srv://...   # in backend/.env
npm run seed                   # upserts products by slug; never touches orders
```

## Adding a product

1. Drop images into `backend/public/images/products/` (JPG around 1600px works well).
2. Add an entry to `backend/src/data/products.js`. A new `category` shows up in the shop filters on its own; add it to the header nav in `frontend/src/components/Header.jsx` if you want it there.
3. `npm run seed` (or restart the dev server when running in-memory).

## Admin panel

Open http://localhost:5174 and sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `backend/.env`. If no super admin exists when the API starts, it creates one from those values. Change the password from **Account** after you first sign in.

- **Dashboard:** revenue, orders at each stage, recent orders, low stock.
- **Orders:** search and filter, then move each order placed → confirmed → shipped → delivered. Cancelling puts the items back in stock.
- **Products:** create, edit, hide or delete products; upload and reorder images; edit highlights and info sections; set price, stock and category. A new category appears in the store on its own.
- **Team** (super admin only): add admins, change roles, disable or remove accounts.

Roles: a **superadmin** can do everything. An **admin** manages products and orders but not the team.

## API

| Method | Path | |
|---|---|---|
| GET | `/api/products?category=&featured=` | list active products |
| GET | `/api/products/categories` | distinct categories |
| GET | `/api/products/:slug` | single product |
| POST | `/api/orders` | place a cash-on-delivery order; prices and stock are checked on the server |
| GET | `/api/orders/:orderNumber` | order confirmation |
| POST | `/api/admin/auth/login` | admin sign-in, returns a JWT |
| * | `/api/admin/{stats,products,orders}` | admin only (Bearer token) |
| * | `/api/admin/admins` | super admin only |

## Production

- `npm run build` builds `frontend/dist` and `admin/dist`.
- Set `VITE_API_URL` in both the frontend and the admin app. In the backend, set `CLIENT_URL`, `ADMIN_URL`, `MONGO_URI`, `JWT_SECRET` and `NODE_ENV=production`.
- Uploaded images are saved to `backend/public/images/products/` on disk. On hosts with temporary disks, move uploads to S3 or Cloudinary.
