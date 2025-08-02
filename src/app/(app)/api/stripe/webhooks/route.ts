import type Stripe from "stripe";
import { getPayload } from "payload";
import payloadconfig from "@payload-config";
import { NextResponse } from "next/server";
import { stripe } from "@/app/(app)/lib/stripe";
import { ExpandedLineItem } from "@/modules/cart/types/types";
export const runtime = "nodejs";
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  // Get raw request body as a Buffer
  const rawBody = await req.arrayBuffer();
  const bodyBuffer = Buffer.from(rawBody);

  // Get Stripe signature from headers
  const sig = req.headers.get("stripe-signature") as string;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      bodyBuffer,
      sig,

      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    if (error instanceof Error) {
      console.log(error);
    }
    console.log(errorMessage);
    return NextResponse.json(
      {
        message: `Webhook error: ${errorMessage}`,
      },
      {
        status: 400,
      }
    );
  }
  console.log("Sucess: ", event.id);
  const permittedEvents: string[] = [
    "checkout.session.completed",
    "account.updated",
  ];
  const payload = getPayload({ config: payloadconfig });
  if (permittedEvents.includes(event.type)) {
    let data;
    try {
      switch (event.type) {
        case "checkout.session.completed":
          data = event.data.object as Stripe.Checkout.Session;
          if (!data.metadata?.userId) {
            throw new Error("User Id is required");
          }
          const user = await (
            await payload
          ).findByID({
            collection: "users",
            id: data.metadata.userId,
          });
          if (!user) {
            throw new Error("user not found");
          }
          const expandedSession = await stripe.checkout.sessions.retrieve(
            data.id,
            {
              expand: ["line_items.data.price.product"],
            },
            {
              stripeAccount: event.account,
            }
          );
          if (
            !expandedSession.line_items?.data ||
            !expandedSession.line_items.data.length
          ) {
            throw new Error("No line items found");
          }
          const lineItems = expandedSession.line_items
            .data as ExpandedLineItem[];
          for (const item of lineItems) {
            (await payload).create({
              collection: "orders",
              data: {
                stripeCheckedSessionId: data.id,
                stripeAccountId: event.account,
                user: user.id,
                product: item.price.product.metadata.id,
                name: item.price.product.name,
              },
            });
          }
          break;
        case "account.updated":
          data = event.data.object as Stripe.Account;
          (await payload).update({
            collection: "tenants",
            where: {
              stripeAccountId: {
                equals: data.id,
              },
            },
            data: {
              stripeDetailsSubmitted: data.details_submitted,
            },
          });
          break;
        default:
          throw new Error(`Unhandled event: ${event.type}`);
      }
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { message: "Webhook handler failed" },
        {
          status: 500,
        }
      );
    }
  }
  return NextResponse.json(
    {
      message: "Received",
    },
    {
      status: 200,
    }
  );
}
