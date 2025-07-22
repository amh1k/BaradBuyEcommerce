import z from "zod";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { getPayload } from "payload";
import type { Where } from "payload";
import { Category } from "@/payload-types";
import configPromise from "@payload-config";
import { DEFAULT_LIMIT } from "@/constants";
export const tagsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT),
      })
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.payload.find({
        collection: "tags",
        page: input.cursor,
        limit: input.limit,
      });
      return data;
    }),
});
