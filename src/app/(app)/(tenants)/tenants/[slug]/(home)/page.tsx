import type { SearchParams } from "nuqs/server";
import { getQueryClient, trpc } from "@/trpc/server";
import { loadProductFilters } from "@/modules/products/hooks/search-params";
import { ProductListView } from "@/modules/products/views/product-list-view";
import { DEFAULT_LIMIT } from "@/constants";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
interface Props {
  searchParams: Promise<SearchParams>;
  params: Promise<{ slug: string }>;
}
const Page = async ({ params, searchParams }: Props) => {
  const { slug } = await params;
  const filters = await loadProductFilters(searchParams);
  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      ...filters,
      tenantSlug: slug,
      limit: DEFAULT_LIMIT,
    })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView tenantSlug={slug} narrowView />
    </HydrationBoundary>
  );
};
export default Page;
