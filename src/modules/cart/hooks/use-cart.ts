import { clear } from "console";
import { useCartStore } from "../store/use-cart-store";
export const useCart = (tennatSlug: string) => {
  const {
    getCartByTenant,
    addProduct,
    removeProduct,
    clearAllCarts,
    clearCart,
  } = useCartStore();
  const productIds = getCartByTenant(tennatSlug);
  const toggleProduct = (productId: string) => {
    if (productIds.includes(productId)) {
      removeProduct(tennatSlug, productId);
    } else {
      addProduct(tennatSlug, productId);
    }
  };
  const isProductInCart = (productId: string) => {
    return productIds.includes(productId);
  };
  const clearTenantCart = () => {
    clearCart(tennatSlug);
  };
  return {
    productIds,
    addProduct: (productId: string) => addProduct(tennatSlug, productId),
    removeProduct: (productId: string) => removeProduct(tennatSlug, productId),
    clearCart: clearTenantCart,
    clearAllCarts,
    toggleProduct,
    isProductInCart,
    totalItems: productIds.length,
  };
};
