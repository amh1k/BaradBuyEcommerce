import z from "zod";

import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { getPayload } from "payload";
import { headers as getHeaders } from "next/headers";
import type { Sort, Where } from "payload";
import { Category, Media, Tenant } from "@/payload-types";
import configPromise from "@payload-config";
import { InputOTP } from "@/app/(app)/components/ui/input-otp";

import { DEFAULT_LIMIT } from "@/constants";
export const libraryRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT),
      })
    )
    .query(async ({ ctx, input }) => {
      const ordersData = await ctx.payload.find({
        collection: "orders",
        depth: 0,
        where: {
          user: {
            equals: ctx.session.user.id,
          },
        },
      });

      const productIds = ordersData.docs.map((order) => order.product);
      const productsData = await ctx.payload.find({
        collection: "products",
        pagination: false,
        where: {
          id: {
            in: productIds,
          },
        },
      });
      return {
        ...productsData,
        docs: productsData.docs.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          tenant: doc.tenant as Tenant & { image: Media | null },
        })),
      };
    }),
});
