"use client";
import { BookmarkCheckIcon, ListFilterIcon, SearchIcon } from "lucide-react";
import { Input } from "../../../../../app/(app)/components/ui/input";
import { CustomCategory } from "../../../../../app/(app)/(home)/types";
import { CategoriesSideBar } from "./categories-sidebar";
import { useState } from "react";
import { Button } from "../../../../../app/(app)/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";

interface Props {
  disabled?: boolean;
  //data: CustomCategory[];
}
export const SearchInput = ({ disabled }: Props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const trpc = useTRPC();
  const session = useQuery(trpc.auth.session.queryOptions());
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());
  return (
    <div className="flex items-center gap-2 w-full">
      <CategoriesSideBar
        data={data}
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
      />
      <div className="relative w-full">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
        <Input
          className="pl-8"
          placeholder="Search products"
          disabled={disabled}
        />
      </div>
      {/*tood: Add view button */}
      <Button
        variant="elevated"
        className="size-12 shrink-8 flex lg:hidden"
        onClick={() => setIsSidebarOpen(true)}
      >
        <ListFilterIcon />
      </Button>
      {session.data?.user && (
        <Button asChild variant="elevated">
          <Link href="/library">
            <BookmarkCheckIcon />
            Library
          </Link>
        </Button>
      )}
    </div>
  );
};
