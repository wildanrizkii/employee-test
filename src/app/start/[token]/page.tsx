import React from "react";
import StartPage from "@/components/pages/Start";
import { api, HydrateClient, setToken } from "@/trpc/server";
import { notFound } from "next/navigation";
import { jwtVerify } from "jose";
import InvalidToken from "@/components/pages/Start/InvalidToken";
import Expired from "@/app/test/expired/page";

function isValidJWTFormat(token: string): boolean {
  const parts = token.split(".");
  return parts.length === 3 && parts.every(Boolean);
}

interface TokenPayload {
  participantId: string;
  listTest: string;
  fullName: string;
  nik: string;
  startTest: string;
  iat: number;
}

async function verifyTokenWithJose(token: string): Promise<TokenPayload | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    if (
      payload &&
      typeof payload.participantId === 'string' &&
      typeof payload.listTest === 'string' &&
      typeof payload.fullName === 'string' &&
      typeof payload.nik === 'string' &&
      typeof payload.iat === 'number'
    ) {
      return {
        participantId: payload.participantId,
        listTest: payload.listTest,
        fullName: payload.fullName,
        nik: payload.nik,
        startTest: payload.startTest as string,
        iat: payload.iat,
      };
    }

    return null;
  } catch (error) {
    console.log("JWT verification failed:", error instanceof Error ? error.message : String(error));
    return null;
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  // Basic token format validation
  if (!token || typeof token !== "string" || !isValidJWTFormat(token)) {
    console.log("Invalid token format");
    return <InvalidToken />;
  }

  // Verify token signature and decode payload
  const payload = await verifyTokenWithJose(token);
  if (!payload) {
    console.log("Token verification failed or missing required fields");
    return <InvalidToken />;
  }

  try {
    // Set token for API calls
    await setToken(token);

    // Validate token against database with detailed status
    const validation = await api.participant.validateToken({
      participantId: payload.participantId,
      token: token
    });

    // Handle different validation scenarios
    if (!validation.participantExists) {
      console.log("Participant not found");
      return <InvalidToken />;
    }

    if (!validation.isActive) {
      console.log("Participant is not active");
      return <InvalidToken />;
    }

    if (!validation.tokenMatches) {
      console.log("Token doesn't match database record");
      return <InvalidToken />;
    }

    if (!validation.isTestToday && !validation.isTestExpired) {
      console.log("Test is not scheduled for today");
      return <InvalidToken />;
    }

    if (validation.isTestExpired) {
      console.log("Test period has expired");
      return <Expired />;
    }

    if (!validation.isValidToken) {
      console.log(`Token validation failed: ${validation.error} - ${validation.message}`);
      return <InvalidToken />;
    }

    await api.test.check.prefetch({ typeTest: "MBTI" });
  } catch (error) {
    console.error("Validation failed:", error instanceof Error ? error.message : String(error));
    return notFound();
  }

  return (
    <HydrateClient>
      <StartPage token={token} />
    </HydrateClient>
  );
}