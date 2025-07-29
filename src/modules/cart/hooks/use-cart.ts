import { clear } from "console";
import { useCartStore } from "../store/use-cart-store";
import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
export const useCart = (tennatSlug: string) => {
  //const getCartByTenant = useCartStore((state) => state.getCartByTenant);
  const addProduct = useCartStore((state) => state.addProduct);
  const removeProduct = useCartStore((state) => state.removeProduct);
  const clearAllCarts = useCartStore((state) => state.clearAllCarts);
  const clearCart = useCartStore((state) => state.clearCart);
  const productIds = useCartStore(
    useShallow((state) => state.tenantCarts[tennatSlug]?.productIds || [])
  );
  const toggleProduct = useCallback(
    (productId: string) => {
      if (productIds.includes(productId)) {
        removeProduct(tennatSlug, productId);
      } else {
        addProduct(tennatSlug, productId);
      }
    },
    [addProduct, removeProduct, productIds, tennatSlug]
  );
  const isProductInCart = useCallback(
    (productId: string) => {
      return productIds.includes(productId);
    },
    [productIds]
  );
  const clearTenantCart = useCallback(() => {
    clearCart(tennatSlug);
  }, [tennatSlug, clearCart]);
  const handleAddProduct = useCallback(
    (productId: string) => {
      addProduct(tennatSlug, productId);
    },
    [addProduct, tennatSlug]
  );
  const handleRemoveProduct = useCallback(
    (productId: string) => {
      removeProduct(tennatSlug, productId);
    },
    [removeProduct, tennatSlug]
  );
  return {
    productIds,
    addProduct: handleAddProduct,
    removeProduct: handleRemoveProduct,
    clearCart: clearTenantCart,
    clearAllCarts,
    toggleProduct,
    isProductInCart,
    totalItems: productIds.length,
  };
};
