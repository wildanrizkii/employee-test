'use server'

import { constant } from "@/constant";
import { cookies } from "next/headers";

export async function setToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(constant.token, token);
}
