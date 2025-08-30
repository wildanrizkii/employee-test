import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

// interface TokenPayload {
//   participantId: string;
// }

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    let token: string | null = null;

    // 1. Coba ambil dari Authorization header (untuk fetch/axios requests)
    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1]!;
      console.log("Token from header:", token);
    }

    // 2. Jika tidak ada di header, coba ambil dari cookie (untuk browser requests)
    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get("token")?.value ?? null;
      console.log("Token from cookie:", token);
    }

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - No token found" },
        { status: 401 },
      );
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const decoded = payload;

    console.log({ decoded });

    if (decoded.participantId !== id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

    return NextResponse.json(participant);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
