"use client";
import { generateTenantURL } from "@/app/(app)/lib/utils";
//import { CheckoutButton } from "@/modules/cart/ui/components/checkout-button";
import { useTRPC } from "@/trpc/client";
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
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.tenants.getOne.queryOptions({
      slug,
    })
  );
  const CheckoutButton = dynamic(
    () =>
      import("@/modules/cart/ui/components/checkout-button").then(
        (mod) => mod.CheckoutButton
      ),
    {
      ssr: false,
      loading: () => (
        <Button className="flex bg-white" disabled>
          <ShoppingCartIcon className="text-black" />
        </Button>
      ),
    }
  );
  return (
    <nav className="h-20 border-b font-medium bg-white">
      <div className="max-w-[--breakpoint-xl] mx-auto flex justify-between items-center h-full px-4 lg:px-12">
        <Link
          href={generateTenantURL(slug)}
          className="flex items-center gap-2"
        >
          {data.image?.url && (
            <Image
              src={data.image.url}
              width={32}
              height={32}
              className="rounded-full border shrink-0 size-[32px]"
              alt={slug}
            />
          )}

          <p className="text-xl">{data.name}</p>
        </Link>
        <CheckoutButton tenantSlug={slug} />
      </div>
    </nav>
  );
};
export const NavbarSkeletion = () => {
  return (
    <nav className="h-20 border-b font-medium bg-white">
      <div className="max-w-[--breakpoint-xl] mx-auto flex justify-between items-center h-full px-4 lg:px-12">
        <div />
        <Button className="flex bg-white" disabled>
          <ShoppingCartIcon className="text-black" />
        </Button>
      </div>
    </nav>
  );
};
