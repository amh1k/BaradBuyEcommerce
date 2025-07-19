import { authRouter } from "@/modules/auth/server/proceudre";
import { baseProcedure, createTRPCRouter } from "../init";
import { categoriesRouter } from "@/modules/categories/server/procedures";
export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
  auth: authRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
