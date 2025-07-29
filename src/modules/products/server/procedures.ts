import z from "zod";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { getPayload } from "payload";
import { headers as getHeaders } from "next/headers";
import type { Sort, Where } from "payload";
import { Category, Media, Tenant } from "@/payload-types";
import configPromise from "@payload-config";
import { InputOTP } from "@/app/(app)/components/ui/input-otp";
import { sortValues } from "../hooks/search-params";
import { DEFAULT_LIMIT } from "@/constants";
export const productsRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const headers = await getHeaders();
      const session = await ctx.payload.auth({ headers });

      const product = await ctx.payload.findByID({
        collection: "products",
        id: input.id,
        depth: 2,
      });
      let isPurchased = false;
      if (session.user) {
        const orderData = await ctx.payload.find({
          collection: "orders",
          pagination: false,
          limit: 1,
          where: {
            and: [
              {
                product: {
                  equals: input.id,
                },
              },
              {
                user: {
                  equals: session.user.id,
                },
              },
            ],
          },
        });
        isPurchased = !!orderData.docs[0];
      }
      return {
        ...product,
        isPurchased,
        image: product.image as Media | null,
        tenant: product.tenant as Tenant & { image: Media | null },
      };
    }),
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT),
        category: z.string().nullable().optional(),
        minPrice: z.string().nullable().optional(),
        maxPrice: z.string().nullable().optional(),
        tags: z.array(z.string()).nullable().optional(),
        sort: z.enum(sortValues).nullable().optional(),
        tenantSlug: z.string().nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {
        //price: {},
      };
      let sort: Sort = "-createdAt";
      if (input.sort === "curated") {
        sort = "-createdAt";
      }
      if (input.sort === "trending") {
        sort = "+createdAt";
      }
      if (input.sort === "hot_and_new") {
        sort = "name";
      }

      //where.price = {};
      if (input.minPrice && input.maxPrice) {
        where.price = {
          less_than_equal: input.maxPrice,
          greater_than_equal: input.minPrice,
        };
      } else if (input.minPrice) {
        where.price = {
          greater_than_equal: input.minPrice,
        };
      } else if (input.maxPrice) {
        where.price = {
          less_than_equal: input.maxPrice,
        };
      }
      if (input.tenantSlug) {
        where["tenant.slug"] = {
          equals: input.tenantSlug,
        };
      }

      if (input.category) {
        const categoriesData = await ctx.payload.find({
          collection: "categories",
          limit: 1,
          depth: 1,
          pagination: false,
          where: {
            slug: {
              equals: input.category,
            },
          },
        });
        const formattedData = categoriesData.docs.map((doc) => ({
          ...doc,
          subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
            ...(doc as Category),
            subcategories: undefined,
          })),
        }));
        const subCategoriesSlugs = [];

        const parentCategory = formattedData[0];
        if (parentCategory) {
          subCategoriesSlugs.push(
            ...parentCategory.subcategories.map(
              (subcategory) => subcategory.slug
            )
          );
          where["category.slug"] = {
            in: [parentCategory.slug, ...subCategoriesSlugs],
          };
        }
      }
      if (input.tags && input.tags.length > 0) {
        where["tags.name"] = {
          in: input.tags,
        };
      }
      const data = await ctx.payload.find({
        collection: "products",
        depth: 2,
        where,
        sort,
        page: input.cursor,
        limit: input.limit,
      });

      return {
        ...data,

        docs: data.docs.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          tenant: doc.tenant as Tenant & { image: Media | null },
        })),
      };
    }),
});
