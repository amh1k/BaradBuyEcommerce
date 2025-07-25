import z from "zod";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { getPayload } from "payload";
import type { Where } from "payload";
import { Category, Tenant } from "@/payload-types";
import configPromise from "@payload-config";
import { DEFAULT_LIMIT } from "@/constants";
import { TRPCError } from "@trpc/server";
import { Media } from "@/payload-types";
export const tenantsRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const tenantsData = await ctx.payload.find({
        collection: "tenants",
        where: {
          slug: {
            equals: input.slug,
          },
        },
        limit: 1,
        pagination: false,
        depth: 1,
      });
      const tenant = tenantsData.docs[0];
      if (!tenant) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Tenant not found" });
      }
      return tenant as Tenant & { image: Media | null };
    }),
});
