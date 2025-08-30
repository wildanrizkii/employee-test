import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { jwtVerify } from "jose";

interface TokenPayload {
  participantId: string;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    console.log("params:", params);
    console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);

    const { id } = await params;

    let isAuthorized = false;
    const authHeader = req.headers.get("Authorization");

    if (authHeader?.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        if (!process.env.JWT_SECRET) {
          throw new Error("JWT_SECRET is not defined");
        }

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
      // kalau token valid → return full data
      return NextResponse.json(participant);
    } else {
      // kalau nggak ada token / token invalid → return data minimal
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
