import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Category } from "@/payload-types";
import z from "zod";
export const categoriesRouter = createTRPCRouter({
  getMany: baseProcedure.input(z.void()).query(async ({ ctx }) => {
    const data = await ctx.payload.find({
      collection: "categories",
      depth: 1,
      pagination: false,
      where: {
        parent: {
          exists: false,
        },
      },
      sort: "name",
    });

    const formattedData = data.docs.map((doc) => ({
      ...doc,
      subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
        ...(doc as Category),
        //subcategories: undefined,
      })),
    }));
    //console.log(formattedData);
    return formattedData;
  }),
});
