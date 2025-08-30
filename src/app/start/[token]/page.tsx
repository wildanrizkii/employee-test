import React from "react";
import StartPage from "@/components/pages/Start";
import { api, HydrateClient, setToken } from "@/trpc/server";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params

  console.log("ENV CHECK", {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST,
    AUTH_SECRET: process.env.AUTH_SECRET ? "OK" : "MISSING",
    JWT_SECRET: process.env.JWT_SECRET ? "OK" : "MISSING",
    DATABASE_URL: process.env.DATABASE_URL ? "OK" : "MISSING",
  });

  try {
    await setToken(token);
    await api.test.check.prefetch({ typeTest: "MBTI" });
  } catch {
    notFound();
  }
  return (
    <HydrateClient>
      <StartPage token={token} />
    </HydrateClient>
  );
}
