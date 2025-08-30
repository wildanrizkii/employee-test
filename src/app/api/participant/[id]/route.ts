import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { jwtVerify } from "jose";

interface TokenPayload {
  participantId: string;
}

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    console.log("=== DEBUG START ===");

    // Debug: Check if context exists
    console.log("Context:", context);

    // Await the params since they're now a Promise
    const params = await context.params;
    console.log("Params:", params);

    const { id } = params;
    console.log("ID extracted:", id);

    // Debug: Check environment variables
    console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);
    console.log("Database URL exists:", !!process.env.DATABASE_URL);

    let isAuthorized = false;
    const authHeader = req.headers.get("Authorization");
    console.log("Auth header:", authHeader ? "EXISTS" : "NOT_FOUND");

    if (authHeader?.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        console.log("Token extracted:", token ? "EXISTS" : "NOT_FOUND");

        if (!process.env.JWT_SECRET) {
          throw new Error("JWT_SECRET is not defined");
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        const decoded = payload as unknown as TokenPayload;
        console.log("Token decoded successfully:", decoded);

        if (decoded.participantId === id) {
          isAuthorized = true;
          console.log("Authorization: GRANTED");
        } else {
          console.log("Authorization: DENIED (ID mismatch)");
        }
      } catch (err) {
        console.warn("Invalid or expired token:", err);
      }
    }

    console.log("Querying database for ID:", id);

    // Debug: Check if db is accessible
    if (!db) {
      throw new Error("Database connection not available");
    }

    const participant = await db.participant.findUnique({
      where: { id },
      include: {
        disc: true,
        mbti: true,
      },
    });

    console.log("Participant found:", participant ? "YES" : "NO");

    if (!participant) {
      console.log("Returning 404");
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (isAuthorized) {
      console.log("Returning full participant data");
      return NextResponse.json(participant);
    } else {
      console.log("Returning limited participant data");
      return NextResponse.json({
        id: participant.id,
        fullName: participant.NamaLengkap,
        nik: participant.NIK,
      });
    }
  } catch (error) {
    console.error("=== API ERROR ===");
    console.error("Error name:", (error as Error)?.constructor?.name);
    console.error("Error message:", (error as Error)?.message);
    console.error("Error stack:", (error as Error)?.stack);
    console.error("Full error object:", error);
    console.error("=== END ERROR ===");

    return NextResponse.json(
      {
        error: "Internal Server Error",
        debug:
          process.env.NODE_ENV === "development"
            ? {
                message: (error as Error)?.message,
                name: (error as Error)?.constructor?.name,
              }
            : undefined,
      },
      { status: 500 },
    );
  }
}
