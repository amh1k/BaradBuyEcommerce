"use client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useProductFilters } from "../../hooks/use-product-filters";
import { ProductCard } from "./product-card";
interface Props {
  category?: string;
}
export const ProductList = ({ category }: Props) => {
  const [filters] = useProductFilters();
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.products.getMany.queryOptions({
      category,
      ...filters,
    })
  );
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {data?.docs.map((product) => (
        // <div key={product.id} className="border rounded-md bg-white p-4">
        //   <h2 className="text-xl font-medium">{product.name}</h2>
        //   <p>Rs{product.price}</p>
        // </div>
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          imageUrl={product.image?.url}
          authorUsername="Tolkein"
          authorImageUrl={undefined}
          reviewRating={3}
          reviewCount={5}
          price={product.price}
        />
      ))}
    </div>
  );
};

export const ProductListSkeleton = () => {
  return <div>...Loading</div>;
};
