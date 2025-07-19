"use client";
import { useTRPC } from "@/trpc/client";
import { CustomCategory } from "../types";
import { Categories } from "./categories";
import { SearchInput } from "./search-input";
import { useSuspenseQueries, useSuspenseQuery } from "@tanstack/react-query";

// interface Props {
//   data: CustomCategory[];
// }

export const SearchFilters = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());
  console.log(data);
  return (
    <div
      className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full"
      style={{
        backgroundColor: "#F5F5F5",
      }}
    >
      <SearchInput />
      <div className="hidden lg:block">
        <Categories data={data} />
      </div>
    </div>
  );
};
export const SearchFiltersLoading = () => {
  return (
    <div
      className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full"
      style={{
        backgroundColor: "#F5F5F5",
      }}
    >
      <SearchInput disabled />
      <div className="hidden lg:block">
        <div className="h-11" />
      </div>
    </div>
  );
};
