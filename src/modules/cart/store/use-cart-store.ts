import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface TenantCart {
  productIds: string[];
}

interface CartState {
  tenantCarts: Record<string, TenantCart>;
  addProduct: (tenantSlug: string, productId: string) => void;
  removeProduct: (tenantSlug: string, productId: string) => void;
  clearCart: (tenantSlug: string) => void;
  clearAllCarts: () => void;
  //getCartByTenant: (tenantSlug: string) => string[];
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      tenantCarts: {},

      addProduct: (tenantSlug, productId) =>
        set((state) => {
          const current = state.tenantCarts[tenantSlug]?.productIds || [];
          return {
            tenantCarts: {
              ...state.tenantCarts,
              [tenantSlug]: {
                productIds: [...current, productId],
              },
            },
          };
        }),

      removeProduct: (tenantSlug, productId) =>
        set((state) => {
          const current = state.tenantCarts[tenantSlug]?.productIds || [];
          return {
            tenantCarts: {
              ...state.tenantCarts,
              [tenantSlug]: {
                productIds: current.filter((id) => id !== productId),
              },
            },
          };
        }),

      clearCart: (tenantSlug) =>
        set((state) => {
          const updated = { ...state.tenantCarts };
          delete updated[tenantSlug];
          return { tenantCarts: updated };
        }),

      clearAllCarts: () =>
        set({
          tenantCarts: {},
        }),
    }),
    {
      name: "Barudbuy-cart",
      storage: createJSONStorage(() => window.localStorage),
    }
  )
);
