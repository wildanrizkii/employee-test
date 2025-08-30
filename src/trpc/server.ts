import "server-only";

import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { cookies, headers } from "next/headers";
import { cache } from "react";

import { createCaller, type AppRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { createQueryClient } from "./query-client";
import { constant } from "@/constant";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */

let directToken: string;
export async function setToken(newToken: string) {
  /**
   * You can also save the token to cookies, and initialize from
   * cookies above.
   */
  directToken = newToken;
}

const createContext = cache(async () => {
  const heads = new Headers(await headers());
  const cookieStore = (await cookies()).get(constant.token);

  const token = cookieStore ? cookieStore.value : directToken;
  // console.log("token", token);
  heads.set("x-trpc-source", "rsc");
  heads.set("Authorization", token);
  return createTRPCContext({
    headers: heads,
  });
});

const getQueryClient = cache(createQueryClient);
const caller = createCaller(createContext);

export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient,
);
