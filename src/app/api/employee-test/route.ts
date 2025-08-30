import { testSchema } from "@/schema/test-schema";
import { serverUtils } from "@/server/api/utils";
import { db } from "@/server/db";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { status: boolean };
    const result = testSchema.schedule.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: result.error.message },
        { status: 400 },
      );
    }
    const isExist = await db.participant.findFirst({
      where: {
        IdDataPelamar: result.data.IdDataPelamar,
      },
    });
    if (isExist) {
      return NextResponse.json(
        { message: "Participant already exist" },
        { status: 409 },
      );
    }

    function sortTraits(traits: Array<string>) {
      const traitOrder: Record<string, number> = {
        MBTI: 0,
        DISC: 1,
        TKD: 2,
        KETELITIAN: 3,
      };

      traits.sort((a, b) => {
        return traitOrder[a]! - traitOrder[b]!;
      });

      const data = traits.join(", ");

      return data;
    }

    const testDate = new Date(result.data.PelaksanaanTes);
    testDate.setHours(testDate.getHours() + 7);

    const participant = db.participant.create({
      data: {
        ...result.data,
        PelaksanaanTes: testDate,
        JenisTes: sortTraits(result.data.JenisTes),
      },
    });
    const token = await serverUtils.generateToken((await participant).id);
    await db.participant.update({
      where: {
        id: (await participant).id,
      },
      data: {
        Token: token,
      },
    });
    return NextResponse.json(
      { id: (await participant).id, token },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in POST /api/employee-test:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
