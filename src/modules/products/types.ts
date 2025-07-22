import { inferRouterOutputs } from "@trpc/server";

import { AppRouter } from "@/trpc/routers/_app";

export type productsGetManyOutput =
  inferRouterOutputs<AppRouter>["products"]["getMany"];
//export type productsGetManyOutputSingle = productsGetManyOutput[0];
