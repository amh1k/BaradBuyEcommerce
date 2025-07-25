import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Footer } from "../../../modules/home/ui/components/footer";
import { Category } from "@/payload-types";
import { Navbar } from "../../../modules/home/ui/components/navbar";
import {
  SearchFilters,
  SearchFiltersLoading,
} from "../../../modules/home/ui/components/search-filters";
import { getQueryClient, trpc } from "@/trpc/server";
import { Suspense } from "react";
interface Props {
  children: React.ReactNode;
}

export default async function Layout({ children }: Props) {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions());

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <HydrationBoundary>
        <Suspense fallback={<SearchFiltersLoading />}>
          <SearchFilters />
        </Suspense>
      </HydrationBoundary>

      <div className="flex-1 bg-[#F4F4F0]">{children}</div>
      <Footer />
    </div>
  );
}
