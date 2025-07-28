"use client";

import { useTRPC } from "@/trpc/client";
import { useCart } from "../../hooks/use-cart";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import Router from "next/navigation";
import { generateTenantURL } from "@/app/(app)/lib/utils";
import { CheckOutItem } from "../components/checkout-item";
import { CheckoutSidebar } from "../components/checkout-sidebar";
import { InboxIcon, Loader } from "lucide-react";
import { useCheckoutStates } from "../../hooks/use-checkout-states";
import { useRouter } from "next/navigation";
//import { CheckoutItem } from "./CheckoutItem"; // Assuming this exists

interface CheckoutViewProps {
  tenantSlug: string;
}

export const CheckoutView = ({ tenantSlug }: CheckoutViewProps) => {
  const [states, setStates] = useCheckoutStates();
  const { productIds, clearAllCarts, removeProduct, clearCart } =
    useCart(tenantSlug);
  const trpc = useTRPC();
  const router = useRouter();
  const { data, error, isLoading } = useQuery(
    trpc.checkout.getProducts.queryOptions({
      ids: productIds,
    })
  );
  const purchase = useMutation(
    trpc.checkout.purchase.mutationOptions({
      onMutate: () => {
        setStates({ success: false, cancel: false });
      },
      onSuccess: (data) => {
        window.location.href = data.url;
      },
      onError: (error) => {
        if (error.data?.code === "UNAUTHORIZED") {
          // modify when subdomain enabled
          router.push("/sign-in");
        }
        toast.error(error?.message);
      },
    })
  );

  useEffect(() => {
    if (error?.data?.code === "NOT_FOUND") {
      clearAllCarts();
      toast.warning("Invalid products found. Cart cleared");
    }
  }, [error, clearAllCarts]);
  useEffect(() => {
    if (states.success) {
      setStates({ success: false, cancel: false });
      clearCart();
      router.push("/products");
    }
  }, [states.success, clearCart, router, setStates]);
  if (isLoading) {
    return (
      <div className="lg:pt-16 pt-4 px-4 lg:px-12">
        <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
          <Loader className="text-muted-foreground animate-spin" />
        </div>
      </div>
    );
  }
  if (!data || data.docs.length == 0)
    return (
      <div className="lg:pt-16 pt-4 px-4 lg:px-12">
        <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
          <InboxIcon />
          <p className="text-base font-medium">No products found</p>
        </div>
      </div>
    );

  return (
    <div className="lg:pt-16 pt-4 px-4 lg:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="border rounded-md overflow-hidden bg-white">
            {data?.docs.map((product, index) => (
              <CheckOutItem
                key={product.id}
                id={product.id}
                isLast={index === data.docs.length - 1}
                imageUrl={product.image?.url}
                name={product.name}
                productUrl={`${generateTenantURL(product.tenant.slug)}/products/${product.id}`}
                tenantUrl={generateTenantURL(product.tenant.slug)}
                tenantName={product.tenant.name}
                price={product.price}
                onRemove={() => removeProduct(product.id)}
              />
            ))}
          </div>
        </div>
        <div className="lg:col-span-3">
          <CheckoutSidebar
            total={data?.totalPrice ?? 0}
            onPurchase={() => purchase.mutate({ tenantSlug, productIds })}
            isCanceled={states.cancel}
            isPending={purchase.isPending}
          />
        </div>
      </div>
    </div>
  );
};
