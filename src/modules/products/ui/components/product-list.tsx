"use client";
import { useTRPC } from "@/trpc/client";
import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useProductFilters } from "../../hooks/use-product-filters";
import { ProductCard, ProductCardSkeleton } from "./product-card";
import { DEFAULT_LIMIT } from "@/constants";
import { Button } from "@/app/(app)/components/ui/button";
import { InboxIcon } from "lucide-react";
import { cn } from "@/app/(app)/lib/utils";
interface Props {
  category?: string;
  tenantSlug?: string;
  narrowView?: boolean;
}
export const ProductList = ({ category, tenantSlug, narrowView }: Props) => {
  const [filters] = useProductFilters();
  const trpc = useTRPC();
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useSuspenseInfiniteQuery(
      trpc.products.getMany.infiniteQueryOptions(
        {
          ...filters,
          category,
          tenantSlug,
          limit: DEFAULT_LIMIT,
        },
        {
          getNextPageParam: (lastPage) => {
            // Only return nextPage if docs exist
            return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
          },
        }
      )
    );
  if (data.pages?.[0]?.docs.length === 0) {
    return (
      <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
        <InboxIcon />
        <p className="text-base font-medium">No products found</p>
      </div>
    );
  }
  return (
    <>
      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4",
          narrowView && "lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3"
        )}
      >
        {data?.pages
          .flatMap((page) => page.docs)
          .map((product) => (
            // <div key={product.id} className="border rounded-md bg-white p-4">
            //   <h2 className="text-xl font-medium">{product.name}</h2>
            //   <p>Rs{product.price}</p>
            // </div>
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              imageUrl={product.image?.url}
              tenantSlug={product.tenant?.slug}
              tenantImageUrl={product.tenant?.image?.url}
              reviewRating={3}
              reviewCount={5}
              price={product.price}
            />
          ))}
      </div>
      <div className="flex justify-center pt-6">
        {hasNextPage && (
          <Button
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
            className="font-medium disabled:opacity-50 text-base bg-white "
            variant="elevated"
          >
            Load more
          </Button>
        )}
      </div>
    </>
  );
};

export const ProductListSkeleton = ({ narrowView }: Props) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4",
        narrowView && "lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3"
      )}
    >
      {Array.from({ length: DEFAULT_LIMIT }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};
