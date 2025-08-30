import { env } from "@/env";
import { db } from "@/server/db";
import jwt from "jsonwebtoken";

export type JwtPayload = {
  participantId: string;
  listTest: Array<string>;
  fullName: string;
  nik: string;
  startTest: string;
};

async function generateToken(participantId: string) {
  const data = await db.participant.findUnique({
    where: {
      id: participantId,
    },
  });
  if (!data) {
    throw new Error("Participant not found");
  }

  const tokenPeserta = jwt.sign(
    {
      participantId: data.id,
      listTest: data.JenisTes,
      fullName: data.NamaLengkap,
      nik: data.NIK,
      startTest: data.PelaksanaanTes,
    },
    env.JWT_SECRET,
  );
  return tokenPeserta;
}

export async function verifyToken(token: string): Promise<JwtPayload> {
  const verified = jwt.verify(token, env.JWT_SECRET, {
    ignoreExpiration: true,
  });

  if (!verified || typeof verified !== "object") {
    throw new Error("Invalid token");
  }

  return verified as JwtPayload;
}

export const serverUtils = { generateToken, verifyToken };
