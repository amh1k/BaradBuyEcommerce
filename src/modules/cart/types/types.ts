import Stripe from "stripe";
import { metadata } from "../../../app/(app)/layout";

export type ProductMetaData = {
  stripeAccountId: string;
  id: string;
  name: string;
  price: number;
};

export type CheckoutMetaData = {
  userId: string;
};
export type ExpandedLineItem = Stripe.LineItem & {
  price: Stripe.Price & {
    product: Stripe.Product & {
      metadata: ProductMetaData;
    };
  };
};
