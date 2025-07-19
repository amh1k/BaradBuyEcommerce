import { inferRouterOutputs } from "@trpc/server";

import { AppRouter } from "@/trpc/routers/_app";
import { Categories } from "../../app/(app)/(home)/search-filters/categories";

export type CategoriesGetManyOutput =
  inferRouterOutputs<AppRouter>["categories"]["getMany"];
export type CategoriesGetManyOutputSingle = CategoriesGetManyOutput[0];
