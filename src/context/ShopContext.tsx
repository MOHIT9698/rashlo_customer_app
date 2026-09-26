import { createContext, ReactNode, useContext, useState } from 'react';

interface ShopContextType {
  trustedShopId: string | null;
  setTrustedShopId: (id: string | null) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [trustedShopId, setTrustedShopId] = useState<string | null>(null);

  return (
    <ShopContext.Provider value={{ trustedShopId, setTrustedShopId }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be used inside a ShopProvider');
  return ctx;
}