import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'zoro-cart-v1';

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(load);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable */
    }
  }, [items]);

  const value = useMemo(() => {
    const clamp = (q, stock) => Math.max(1, Math.min(q, stock || 99));

    const add = (product, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.productId === product._id);
        if (existing) {
          return prev.map((i) =>
            i.productId === product._id ? { ...i, quantity: clamp(i.quantity + quantity, product.stock) } : i
          );
        }
        return [
          ...prev,
          {
            productId: product._id,
            slug: product.slug,
            name: product.name,
            category: product.category,
            price: product.price,
            image: product.images?.[0],
            stock: product.stock,
            quantity: clamp(quantity, product.stock),
          },
        ];
      });
      setOpen(true);
    };

    const update = (productId, quantity) =>
      setItems((prev) =>
        prev.map((i) => (i.productId === productId ? { ...i, quantity: clamp(quantity, i.stock) } : i))
      );

    const remove = (productId) => setItems((prev) => prev.filter((i) => i.productId !== productId));
    const clear = () => setItems([]);

    const count = items.reduce((n, i) => n + i.quantity, 0);
    const subtotal = items.reduce((n, i) => n + i.price * i.quantity, 0);

    return { items, count, subtotal, add, update, remove, clear, open, setOpen };
  }, [items, open]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
