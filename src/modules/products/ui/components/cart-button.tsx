import { Button } from "@/app/(app)/components/ui/button";
import { cn } from "@/app/(app)/lib/utils";
import { useCart } from "@/modules/cart/hooks/use-cart";

interface Props {
  tenantSlug: string;
  productId: string;
}
export const CartButton = ({ tenantSlug, productId }: Props) => {
  const cart = useCart(tenantSlug);
  return (
    <Button
      variant="elevated"
      className={cn(
        "flex-1 bg-pink-400",
        cart.isProductInCart(productId) && "bg-white"
      )}
      onClick={() => cart.toggleProduct(productId)}
    >
      {cart.isProductInCart(productId) ? "Remove from cart" : "Add to cart"}
    </Button>
  );
};
