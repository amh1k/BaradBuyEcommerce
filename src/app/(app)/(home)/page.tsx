"use client";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

import { getPayload } from "payload";
import configPromise from "@payload-config";
import { getQueryClient, trpc } from "@/trpc/server";
export default function Home() {
  const trpc = useTRPC();
  //const queryClient = getQueryClient();
  const { data } = useQuery(trpc.auth.session.queryOptions());
  return (
    <div>
      Home Page
      {JSON.stringify(data?.user, null, 2)}
    </div>
  );
}
