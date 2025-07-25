"use client";
import { generateTenantURL } from "@/app/(app)/lib/utils";
//import { CheckoutButton } from "@/modules/cart/ui/components/checkout-button";

import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/app/(app)/components/ui/button";
import { ShoppingCartIcon } from "lucide-react";
interface Props {
  slug: string;
}
export const Navbar = ({ slug }: Props) => {
  return (
    <nav className="h-20 border-b font-medium bg-white">
      <div className="max-w-[--breakpoint-xl] mx-auto flex justify-between items-center h-full px-4 lg:px-12">
        <p className="text-xl">Checkout</p>

        <Button variant="elevated" asChild>
          <Link href={generateTenantURL(slug)}>Continue Shipping</Link>
        </Button>
      </div>
    </nav>
  );
};
