import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { jwtVerify } from "jose";

interface TokenPayload {
  participantId: string;
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    // Following Next.js 15+ pattern
    const { id } = await context.params;

    let isAuthorized = false;

    // Get token from cookie
    const cookieHeader = req.headers.get("Cookie");
    let token: string | null = null;

    if (cookieHeader?.includes("token=")) {
      const tokenRegex = /token=([^;]+)/;
      const tokenMatch = tokenRegex.exec(cookieHeader);
      if (tokenMatch) {
        token = tokenMatch[1];
      }
    }

    // Also check Authorization header as fallback
    const authHeader = req.headers.get("Authorization");
    if (!token && authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (token && process.env.JWT_SECRET) {
      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        const decoded = payload as unknown as TokenPayload;

        if (decoded.participantId === id) {
          isAuthorized = true;
        }
      } catch (err) {
        console.warn("Invalid or expired token:", err);
      }
    }

    const participant = await db.participant.findUnique({
      where: { id },
      include: {
        disc: true,
        mbti: true,
      },
    });

    if (!participant) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (isAuthorized) {
      return NextResponse.json(participant);
    } else {
      return NextResponse.json({
        id: participant.id,
        fullName: participant.NamaLengkap,
        nik: participant.NIK,
      });
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
