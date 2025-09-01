import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { constant } from "@/constant";

interface TokenPayload {
  participantId: string;
  listTest: string;
  fullName: string;
  nik: string;
  startTest: string;
  iat: number;
}

interface Participant {
  id: string;
  IsActive: boolean;
  time_mbti: number;
  time_disc: number;
  time_tkd: number;
  time_ketelitian: number;
  jeda_waktu: number;
  JenisTes: string;
  PelaksanaanTes: string | Date;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes to avoid infinite loop
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Skip middleware for non-test routes
  if (!pathname.startsWith("/test/")) return NextResponse.next();

  // Allow access to expired and completed pages
  if (pathname === "/test/expired" || pathname === "/finishtest")
    return NextResponse.next();

  const token = request.cookies.get(constant.token)?.value;
  console.log("Token: ", token);
  if (!token) return NextResponse.redirect(new URL("/", request.url));

  try {
    const jwtSecret = process.env.JWT_SECRET ?? "";
    const secret = new TextEncoder().encode(jwtSecret);
    const { payload } = await jwtVerify(token, secret);
    const decoded = payload as unknown as TokenPayload;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? request.nextUrl.origin;
    console.log({ baseUrl });

    console.log(
      "Fetch URL:",
      `${baseUrl}/api/participants/${decoded.participantId}`,
    );

    const res = await fetch(
      `${baseUrl}/api/participants/${decoded.participantId}`,
      {
        headers: {
          Cookie: request.headers.get("cookie") ?? "",
          "Content-Type": "application/json",
        },
      },
    );

    if (!res.ok) {
      console.error("Failed to fetch participant:", res.status, res.statusText);
      return NextResponse.redirect(new URL("/", request.url));
    }

    const participant = (await res.json()) as Participant;

    // Check if participant exists
    if (!participant) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // console.log("Participant Data: ", participant);

    // Check if participant is in break time
    const currentTime = Math.floor(Date.now() / 1000);
    const isInBreakTime = participant.jeda_waktu > currentTime;

    console.log("Current time:", currentTime);
    console.log("Break end time:", participant.jeda_waktu);
    console.log("Is in break time:", isInBreakTime);

    // If accessing break page
    if (pathname === "/test/break") {
      // Allow access to break page only if in break time
      if (isInBreakTime) {
        console.log("Access granted to break page");
        return NextResponse.next();
      } else {
        // Break time is over, redirect to available test
        const availableTest = getAvailableTest(participant);
        console.log("Break time over, available test:", availableTest);

        if (availableTest) {
          return NextResponse.redirect(
            new URL(`/test/${availableTest}`, request.url),
          );
        } else {
          // Check if all participant's tests are completed
          const allTestsCompleted = areAllTestsCompleted(participant);

          if (allTestsCompleted) {
            console.log(
              "All participant tests completed, redirecting to finish",
            );
            return NextResponse.redirect(new URL("/finishtest", request.url));
          } else {
            console.log("Break time over, redirecting to finish (fallback)");
            return NextResponse.redirect(new URL("/finishtest", request.url));
          }
        }
      }
    }

    // If in break time but not accessing break page, redirect to break
    if (isInBreakTime) {
      console.log("In break time, redirecting to break page");
      return NextResponse.redirect(new URL("/test/break", request.url));
    }

    // Extract test type from pathname
    const testType = getTestTypeFromPath(pathname);
    console.log("Type Test: ", testType);

    // Check access based on test type and time values
    const hasAccess = hasTestAccess(participant, testType);
    console.log("Has Access: ", hasAccess);

    function isSameDay(epoch1: number, epoch2: number): boolean {
      const d1 = new Date(epoch1 * 1000);
      const d2 = new Date(epoch2 * 1000);

      return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
      );
    }

    const pelaksanaanTesEpoch = Math.floor(
      new Date(participant.PelaksanaanTes).getTime() / 1000,
    );

    if (!isSameDay(currentTime, pelaksanaanTesEpoch)) {
      console.log("PelaksanaanTes tidak di hari yang sama, redirect expired");
      return NextResponse.redirect(new URL("/test/expired", request.url));
    }

    if (!hasAccess) {
      // Find available test instead of redirecting to expired immediately
      const availableTest = getAvailableTest(participant);
      console.log("Available test: ", availableTest);

      if (availableTest) {
        // Only redirect if the available test is different from current requested test
        if (availableTest !== testType) {
          console.log(
            `Redirecting from ${testType} to available test: ${availableTest}`,
          );
          return NextResponse.redirect(
            new URL(`/test/${availableTest}`, request.url),
          );
        }
      } else {
        // No available test at all, check if all tests are completed
        const allTestsCompleted =
          participant.time_mbti === -1 &&
          participant.time_disc === -1 &&
          participant.time_tkd === -1 &&
          participant.time_ketelitian === -1;

        if (allTestsCompleted) {
          console.log("All tests completed, redirecting to finish");
          return NextResponse.redirect(new URL("/finishtest", request.url));
        } else {
          console.log("No available test found, redirecting to expired");
          return NextResponse.redirect(new URL("/test/expired", request.url));
        }
      }
    }

    console.log("Access granted, proceeding...");
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}

function getTestTypeFromPath(pathname: string): string | null {
  console.log("Full pathname:", pathname);
  const pathParts = pathname.split("/");
  console.log("Path parts:", pathParts);

  if (pathParts.length >= 3) {
    const testType = pathParts[2]?.toLowerCase();
    console.log("Extracted test type:", testType);
    return testType!;
  }

  console.log("No test type found");
  return null;
}

function hasTestAccess(
  participant: Participant,
  testType: string | null,
): boolean {
  if (!testType) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  const isInBreakTime = participant.jeda_waktu > currentTime;

  if (isInBreakTime) return false;

  const availableTestTypes = getParticipantTestTypes(participant);

  if (!availableTestTypes.includes(testType.toUpperCase())) {
    console.log(`Test ${testType} not available for this participant`);
    return false;
  }

  switch (testType) {
    case "mbti":
      return participant.time_mbti >= 0;
    case "disc":
      return participant.time_mbti === -1 && participant.time_disc >= 0;
    case "tkd":
      return participant.time_disc === -1 && participant.time_tkd >= 0;
    case "ketelitian":
      return participant.time_tkd === -1 && participant.time_ketelitian >= 0;
    default:
      return participant.IsActive;
  }
}

function getAvailableTest(participant: Participant): string | null {
  const currentTime = Math.floor(Date.now() / 1000);
  const isInBreakTime = participant.jeda_waktu > currentTime;

  if (isInBreakTime) return null;

  const participantTestTypes = getParticipantTestTypes(participant);
  const testOrder = ["MBTI", "DISC", "TKD", "KETELITIAN"];

  console.log("Participant test types:", participantTestTypes);

  for (const testType of testOrder) {
    if (participantTestTypes.includes(testType)) {
      const lowerTestType = testType.toLowerCase();
      if (hasTestAccess(participant, lowerTestType)) {
        console.log(`Test ${lowerTestType} is available`);
        return lowerTestType;
      }
      console.log(`Test ${lowerTestType} is not available`);
    }
  }

  console.log("No tests available");
  return null;
}

function getParticipantTestTypes(participant: Participant): string[] {
  if (!participant.JenisTes) return [];

  return participant.JenisTes.split(",").map((test) =>
    test.trim().toUpperCase(),
  );
}

function areAllTestsCompleted(participant: Participant): boolean {
  const participantTestTypes = getParticipantTestTypes(participant);

  for (const testType of participantTestTypes) {
    switch (testType) {
      case "MBTI":
        if (participant.time_mbti !== -1) return false;
        break;
      case "DISC":
        if (participant.time_disc !== -1) return false;
        break;
      case "TKD":
        if (participant.time_tkd !== -1) return false;
        break;
      case "KETELITIAN":
        if (participant.time_ketelitian !== -1) return false;
        break;
    }
  }

  return true;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/|_next/static|_next/image|favicon.ico).*)",
  ],
};
