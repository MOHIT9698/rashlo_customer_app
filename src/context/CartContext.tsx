import { createContext, ReactNode, useContext, useState } from 'react';

export interface CartEntry {
  id: string;            // unique line id in the cart
  itemId: string;        // references CategoryItem.id from the catalog
  itemName: string;      // copied at add-time so it's editable independently later
  categoryId: string;
  brand?: string;        // undefined for items with no brand options
  quantity: string;      // e.g. "1kg", "500ml"
  count: number;    
  isCustom?:boolean;     // number of packs of this exact item+brand+quantity
}

interface CartContextType {
  cart: CartEntry[];
  addToCart: (entry: Omit<CartEntry, 'id' | 'count'>) => void;
  updateCartItem: (id: string, updates: Partial<CartEntry>) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartEntry[]>([]);

  function addToCart(entry: Omit<CartEntry, 'id' | 'count'>) {
    setCart((prev) => {
      // Real-world case: user adds the exact same item+brand+quantity twice
      // (e.g. adds "Wheat Atta / Aashirvaad / 5kg" again later) — bump the
      // pack count instead of creating a confusing duplicate line.
      const existingIndex = prev.findIndex(
        (c) =>
          c.itemId === entry.itemId &&
          c.brand === entry.brand &&
          c.quantity === entry.quantity
      );

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          count: updated[existingIndex].count + 1,
        };
        return updated;
      }

      return [
        ...prev,
        {
          ...entry,
          id: `${entry.itemId}-${Date.now()}`,
          count: 1,
        },
      ];
    });
  }

  function updateCartItem(id: string, updates: Partial<CartEntry>) {
    setCart((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  }

  function removeFromCart(id: string) {
    setCart((prev) => prev.filter((c) => c.id !== id));
  }

  function clearCart() {
    setCart([]);
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, updateCartItem, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside a CartProvider');
  return ctx;
}