import { db } from "@/server/db";
import { NextResponse, type NextRequest } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = (await req.json()) as { status: boolean };

    await db.participant.update({
      where: {
        IdDataPelamar: id,
      },
      data: {
        IsActive: body.status,
      },
    });

    return NextResponse.json({
      id,
      status: body.status,
    });
  } catch (error) {
    console.error("Error in PATCH /api/employee-test:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// todo schedule test using PUT method