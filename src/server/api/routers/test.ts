import { createTRPCRouter, tokenProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { type Participant } from "prisma-client";
import z from "zod";
import { convertScoreTkd } from "@/server/helper/genScoreTKD";
import { convertScoreKetelitian } from "@/server/helper/genScoreKetelitian";
import { convertMBTI, formatMBTIAnswers } from "@/server/helper/genMBTI";
import mbtiQuestions from "@/data/questions/mbti1.json";
import { sortDisc } from "@/server/helper/sortDisc";
import { convertScore } from "@/server/helper/convertScore";
import { convertToType } from "@/server/helper/convertToCharacter";
import discQuestions from "@/data/questions/disc.json";

interface DISCQuestion {
  _id: string;
  line1: string;
  line2: string;
  line3: string;
  line4: string;
  np1: string;
  np2: string;
  np3: string;
  np4: string;
  nk1: string;
  nk2: string;
  nk3: string;
  nk4: string;
}

interface DISCAnswer {
  np: string;
  nk: string;
}

interface FormattedJawaban {
  NP: string[];
  NK: string[];
}

// Function to process DISC answers from frontend format to helper function format
const processDISCAnswers = (
  rawAnswers: DISCAnswer[],
  questions: DISCQuestion[],
): FormattedJawaban => {
  const npResults: string[] = [];
  const nkResults: string[] = [];

  rawAnswers.forEach((answer, index) => {
    const question = questions[index];
    if (!answer?.np || !answer?.nk || !question) return;

    // Extract DISC values from question based on selection
    const npValue = question[answer.np as keyof DISCQuestion];
    const nkValue = question[answer.nk as keyof DISCQuestion];

    if (
      npValue &&
      nkValue &&
      typeof npValue === "string" &&
      typeof nkValue === "string"
    ) {
      npResults.push(npValue);
      nkResults.push(nkValue);
    }
  });

  return { NP: npResults, NK: nkResults };
};

// Function to calculate DISC profile using existing helper functions
const calculateDISCProfile = (formattedAnswers: FormattedJawaban) => {
  // console.log("Input to sortDisc:", formattedAnswers);

  // Step 1: Sort DISC responses - the sortDisc function expects arrays with forEach method
  const sortedData = sortDisc(formattedAnswers.NP, formattedAnswers.NK);
  // console.log("sortDisc result:", sortedData);

  // Step 2: Convert raw counts to standardized scores
  const convertedScores = convertScore(sortedData);
  // console.log("convertScore result:", convertedScores);

  // Step 3: Determine character types and descriptions
  const characterTypes = convertToType(convertedScores);
  // console.log("convertToType result:", characterTypes);

  return {
    sortedData,
    convertedScores,
    characterTypes,
  };
};

const TestTypeEnum = z.enum(["MBTI", "DISC", "TKD", "KETELITIAN"]);
type TestTypeEnumType = z.infer<typeof TestTypeEnum>;
const schemaCheck = z.object({
  typeTest: TestTypeEnum,
});

const schemaSubmitTest = z.object({
  typeTest: TestTypeEnum,
  answers: z.record(z.string()).optional(),
});

export const testRouter = createTRPCRouter({
  check: tokenProcedure.input(schemaCheck).query(async ({ input, ctx }) => {
    const participant = await ctx.db.participant.findUnique({
      where: {
        id: ctx.participant.participantId,
      },
      include: {
        disc: true,
        mbti: true,
      },
    });

    if (!participant) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }
    // Mapping durasi tes
    const durationTest: Record<TestTypeEnumType, number> = {
      MBTI: 30,
      DISC: 30,
      TKD: 60,
      KETELITIAN: 8,
    };
    const initialTime = durationTest[input.typeTest];
    const initialTimeBreak = 3; // 3 minutes break

    // Ambil waktu mulai sesuai jenis tes
    const participantTimeMap: Record<TestTypeEnumType, number | null> = {
      MBTI: participant.time_mbti,
      DISC: participant.time_disc,
      TKD: participant.time_tkd,
      KETELITIAN: participant.time_ketelitian,
    };
    const participantTime = participantTimeMap[input.typeTest] ?? 0;

    // Fungsi hitung sisa menit
    const diffMinutes = (startTime: number | null, totalMinutes: number) => {
      if (!startTime) return totalMinutes;
      const timeNow = Date.now() / 1000;
      const elapsed = Math.abs(Math.round((timeNow - startTime) / 60));
      return totalMinutes - elapsed;
    };

    // Fungsi hitung sisa waktu break dalam detik
    const getBreakTimeLeft = (breakEndTime: number) => {
      if (breakEndTime === 0) return 0;
      const currentTime = Math.floor(Date.now() / 1000);
      return Math.max(breakEndTime - currentTime, 0);
    };

    const getStatusTes = (date?: Date | null) => {
      if (!date) return "NO_AVAILABLE"; // fallback kalau null/undefined

      const iso = new Date(date).toISOString();
      const batasPelaksanaan = new Date(`${iso.split("T")[0]} 23:59:00`);
      const diffTime = batasPelaksanaan.getTime() - Date.now();

      if (batasPelaksanaan.toDateString() === new Date().toDateString()) {
        return diffTime < 0 ? "EXPIRED" : "AVAILABLE";
      }
      return diffTime > 0 ? "NO_AVAILABLE" : "EXPIRED";
    };

    // Check if participant is in break time
    const isInBreakTime =
      participant.jeda_waktu > Math.floor(Date.now() / 1000);

const status = participant.PelaksanaanTes
  ? getStatusTes(participant.PelaksanaanTes)
  : "NO_AVAILABLE";

    return {
      time: participantTime,
      timeJeda: participant.jeda_waktu,
      breakTimeLeft: getBreakTimeLeft(participant.jeda_waktu), // in seconds
      isInBreakTime,
      diffJeda:
        participant.jeda_waktu > 0
          ? Math.max(getBreakTimeLeft(participant.jeda_waktu) / 60, 0) // convert to minutes
          : initialTimeBreak,
      diffmin:
        participantTime > 0
          ? diffMinutes(participantTime, initialTime)
          : initialTime,
      status,
      NamaLengkap: participant.NamaLengkap,
      TanggalLahir: participant.TanggalLahir,
      JenisTes: participant.JenisTes,
      tkd: participant.tkd,
      ketelitian: participant.ketelitian,
      mbti: participant.mbti,
      disc: participant.disc,
      ProyeksiPenempatan: participant.ProyeksiPenempatan,
      Penempatan: participant.Penempatan,
      PelaksanaanTes: participant.PelaksanaanTes,
      IsActive: participant.IsActive,
    };
  }),

  updateTime: tokenProcedure
    .input(schemaCheck)
    .mutation(async ({ input, ctx }) => {
      const { typeTest } = input;

      // Mapping jenis tes ke field Prisma
      const fieldMap: Record<typeof typeTest, keyof Participant> = {
        MBTI: "time_mbti",
        DISC: "time_disc",
        TKD: "time_tkd",
        KETELITIAN: "time_ketelitian",
      };

      const fieldName = fieldMap[typeTest];

      // Ambil participant dari database
      const participant = await ctx.db.participant.findUnique({
        where: { id: ctx.participant.participantId },
      });

      if (!participant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Peserta tidak ditemukan",
        });
      }

      // Check if participant is in break time
      const currentTime = Math.floor(Date.now() / 1000);
      if (participant.jeda_waktu > currentTime) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Tidak dapat memulai tes saat sedang dalam masa istirahat",
        });
      }

      // Kalau belum pernah di-set, update
      if (participant[fieldName] === 0) {
        const time = Math.floor(Date.now() / 1000);

        await ctx.db.participant.update({
          where: { id: ctx.participant.participantId },
          data: { [fieldName]: time },
        });
      }

      return {
        message: `time participant ${typeTest}-${ctx.participant.participantId} updated`,
      };
    }),

  submitTest: tokenProcedure
    .input(schemaSubmitTest)
    .mutation(async ({ input, ctx }) => {
      const { typeTest, answers } = input;

      const participant = await ctx.db.participant.findUnique({
        where: { id: ctx.participant.participantId },
      });

      if (!participant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Peserta tidak ditemukan",
        });
      }

      const currentTime = Math.floor(Date.now() / 1000);
      const fieldMap: Record<typeof typeTest, keyof Participant> = {
        MBTI: "time_mbti",
        DISC: "time_disc",
        TKD: "time_tkd",
        KETELITIAN: "time_ketelitian",
      };

      const fieldName = fieldMap[typeTest];

      // Parse JenisTes to get available tests for this participant
      const availableTestTypes = participant.JenisTes
        ? participant.JenisTes.split(",").map((test) =>
            test.trim().toUpperCase(),
          )
        : [];
      console.log("Available test types for participant:", availableTestTypes);

      // Check if this is the last test based on participant's available tests
      const currentTestIndex = availableTestTypes.indexOf(typeTest);
      const isLastTest = currentTestIndex === availableTestTypes.length - 1;

      console.log(
        `Current test: ${typeTest}, Index: ${currentTestIndex}, Is last test: ${isLastTest}`,
      );

      // Prepare update data - always mark time field as completed
      const updateData = {
        [fieldName]: -1, // Set to -1 to indicate test is completed
      } as Partial<Participant>;

      // Handle MBTI processing
      if (typeTest === "MBTI" && answers) {
        console.log("Processing MBTI answers...");

        // Convert answers object to array format
        const answersArray: string[] = [];
        const questionsCount = Object.keys(answers).length;

        for (let i = 0; i < questionsCount; i++) {
          const answer = answers[i.toString()];
          answersArray.push(answer ?? "");
        }

        // console.log(`MBTI answers array length: ${answersArray.length}`);

        // Format answers according to MBTI structure
        const formattedAnswers = formatMBTIAnswers(answersArray, mbtiQuestions);
        // console.log("Formatted MBTI answers:", formattedAnswers);

        // Convert to final MBTI result
        const mbtiResult = convertMBTI(formattedAnswers);
        // console.log("MBTI result:", mbtiResult);

        // Upsert MBTI record untuk participant ini
        let mbtiRecord;

        if (participant.mbtiId) {
          // Sudah ada MBTI record, ambil saja tanpa update
          mbtiRecord = await ctx.db.mBTI.findUnique({
            where: { id: participant.mbtiId },
          });
        } else {
          // Kalau belum ada, create lalu hubungkan ke participant
          mbtiRecord = await ctx.db.mBTI.create({
            data: {
              bagian1: mbtiResult.bagian1,
              bagian2: mbtiResult.bagian2,
              bagian3: mbtiResult.bagian3,
              tipe: mbtiResult.tipe,
              deskripsi: mbtiResult.deskripsi,
            },
          });

          await ctx.db.participant.update({
            where: { id: ctx.participant.participantId },
            data: {
              mbtiId: mbtiRecord.id,
              statusEmail: 1,
            },
          });
        }

        // Update participant agar field `mbti` connect ke record MBTI
        // await ctx.db.participant.update({
        //   where: { id: ctx.participant.participantId },
        //   data: {
        //     mbti: {
        //       connect: { id: mbtiRecord.id },
        //     },
        //     statusEmail: 1, // tandai untuk notifikasi email
        //   },
        // });
      }

      if (typeTest === "DISC" && answers) {
        console.log("Processing DISC answers...");

        // Load DISC questions
        const discQuestionsData = discQuestions as DISCQuestion[];
        // console.log(`DISC questions loaded: ${discQuestionsData.length}`);

        // Convert answers object to DISCAnswer array
        const discAnswers: DISCAnswer[] = [];
        for (let i = 0; i < discQuestionsData.length; i++) {
          const answerKey = i.toString();
          if (answers[answerKey]) {
            const [np, nk] = answers[answerKey].split(",");
            discAnswers.push({ np: np ?? "", nk: nk ?? "" });
          } else {
            discAnswers.push({ np: "", nk: "" });
          }
        }

        // console.log(`DISC answers parsed: ${discAnswers.length}`);

        try {
          // Process answers through calculation pipeline
          const formattedAnswers = processDISCAnswers(
            discAnswers,
            discQuestionsData,
          );
          // console.log("Formatted DISC answers:", formattedAnswers);

          const discProfile = calculateDISCProfile(formattedAnswers);
          // console.log("DISC profile calculated:", {
          //   sortedData: discProfile.sortedData,
          //   convertedScores: discProfile.convertedScores,
          //   characterTypes: discProfile.characterTypes,
          // });

          // Create or update DISC record
          let discRecord;

          if (participant.discId) {
            // Sudah ada DISC record, ambil saja tanpa update
            discRecord = await ctx.db.dISC.findUnique({
              where: { id: participant.discId },
            });
            // console.log("DISC record already exists:", discRecord?.id);
          } else {
            // Belum ada DISC, create baru
            discRecord = await ctx.db.dISC.create({
              data: {
                NP: discProfile.sortedData.NP,
                NK: discProfile.sortedData.NK,
                Delta: discProfile.sortedData.Delta,
                Score: discProfile.convertedScores,
                JawabanNP: JSON.stringify(formattedAnswers.NP),
                JawabanNK: JSON.stringify(formattedAnswers.NK),
              },
            });

            await ctx.db.participant.update({
              where: { id: ctx.participant.participantId },
              data: {
                discId: discRecord.id,
                statusEmail: 1,
              },
            });

            // console.log("DISC record created:", discRecord.id);
          }
        } catch (error) {
          console.error("DISC calculation error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to calculate DISC profile",
          });
        }
      }

      // Handle TKD scoring - only update if current value is -1 or less
      if (typeTest === "TKD" && answers) {
        console.log("Processing TKD answers for scoring...");

        // Check current TKD value - only proceed if it's -1 or less
        if (participant.tkd <= -1) {
          // Convert answers object to array format expected by convertScoreTkd
          const answersArray: string[] = [];
          for (let i = 1; i <= 60; i++) {
            const answer = answers[i.toString()];
            answersArray.push(answer ?? ""); // Use empty string for unanswered questions
          }

          // Calculate TKD score
          const tkdScore = convertScoreTkd(answersArray);
          console.log(`TKD Score calculated: ${tkdScore}/60`);

          // Update the tkd field with the calculated score (separate from time field)
          updateData.tkd = tkdScore;
          // console.log(
          //   "TKD score will be saved to participant.tkd field:",
          //   tkdScore,
          // );
        } else {
          console.log(
            `TKD score already exists (${participant.tkd}), skipping update`,
          );
        }
      }

      // Handle KETELITIAN scoring - only update if current value is -1
      if (typeTest === "KETELITIAN" && answers) {
        console.log("Processing KETELITIAN answers for scoring...");

        // Check current KETELITIAN value - only proceed if it's -1
        if (participant.ketelitian <= -1) {
          // Convert answers object to array format expected by convertScoreKetelitian
          const answersArray: string[] = [];
          for (let i = 0; i < 100; i++) {
            const answer = answers[i.toString()];
            answersArray.push(answer ?? ""); // Use empty string for unanswered questions
          }

          // Calculate KETELITIAN score
          const ketelitianScore = convertScoreKetelitian(answersArray);
          console.log(`KETELITIAN Score calculated: ${ketelitianScore}/100`);

          // Update the ketelitian field with the calculated score (separate from time field)
          updateData.ketelitian = ketelitianScore;
          // console.log(
          //   "KETELITIAN score will be saved to participant.ketelitian field:",
          //   ketelitianScore,
          // );
        } else {
          console.log(
            `KETELITIAN score already exists (${participant.ketelitian}), skipping update`,
          );
        }
      }

      // Only set jeda_waktu for break time if:
      // 1. Not the last test in participant's available tests
      // 2. jeda_waktu is currently 0 or has expired
      if (
        !isLastTest &&
        (participant.jeda_waktu === 0 || participant.jeda_waktu <= currentTime)
      ) {
        const BREAK_DURATION = 3 * 60; // 3 minutes in seconds
        updateData.jeda_waktu = currentTime + BREAK_DURATION;
        console.log(`Setting break time: ${currentTime + BREAK_DURATION}`);
      }

      // Update database
      await ctx.db.participant.update({
        where: { id: ctx.participant.participantId },
        data: updateData,
      });

      const shouldStartBreak =
        !isLastTest &&
        (participant.jeda_waktu === 0 || participant.jeda_waktu <= currentTime);

      const result: {
        message: string;
        isLastTest: boolean;
        shouldStartBreak: boolean;
        availableTestTypes: string[];
        currentTestIndex: number;
        breakEndTime: number | null;
        nextAction: string;
        tkdScore?: number;
        ketelitianScore?: number;
        mbtiResult?: {
          bagian1: number;
          bagian2: number;
          bagian3: number;
          tipe: string;
          deskripsi: string;
        };
      } = {
        message: `Test ${typeTest} submitted successfully.`,
        isLastTest,
        shouldStartBreak,
        availableTestTypes,
        currentTestIndex,
        breakEndTime: shouldStartBreak ? currentTime + 3 * 60 : null,
        nextAction: isLastTest
          ? "FINISH"
          : shouldStartBreak
            ? "BREAK"
            : "NEXT_TEST",
      };

      return result;
    }),

  resetBreakTime: tokenProcedure.mutation(async ({ ctx }) => {
    const participant = await ctx.db.participant.findUnique({
      where: { id: ctx.participant.participantId },
    });

    if (!participant) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Peserta tidak ditemukan",
      });
    }

    const currentTime = Math.floor(Date.now() / 1000);

    // Cek apakah user sedang dalam masa jeda
    if (participant.jeda_waktu <= currentTime) {
      return {
        success: false,
        message: "Peserta tidak sedang dalam masa jeda",
        isInBreak: false,
        breakTime: 0,
      };
    }

    const previousBreakTime = participant.jeda_waktu;

    // Reset jeda_waktu ke 0
    await ctx.db.participant.update({
      where: { id: ctx.participant.participantId },
      data: { jeda_waktu: 0 },
    });

    return {
      success: true,
      message: `Break time reset successfully for participant ${ctx.participant.participantId}`,
      isInBreak: false,
      previousBreakTime,
    };
  }),

  // New procedure to get current participant data (used by BreakPage)
  getCurrentParticipant: tokenProcedure.query(async ({ ctx }) => {
    const participant = await ctx.db.participant.findUnique({
      where: { id: ctx.participant.participantId },
      select: {
        id: true,
        NamaLengkap: true,
        time_mbti: true,
        time_disc: true,
        time_tkd: true,
        time_ketelitian: true,
        jeda_waktu: true,
        JenisTes: true,
        IsActive: true,
      },
    });

    if (!participant) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Peserta tidak ditemukan",
      });
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const isInBreakTime = participant.jeda_waktu > currentTime;
    const breakTimeLeft = isInBreakTime
      ? participant.jeda_waktu - currentTime
      : 0;

    // Parse participant's available test types
    const participantTestTypes = participant.JenisTes
      ? participant.JenisTes.split(",").map((test) => test.trim().toUpperCase())
      : [];

    return {
      ...participant,
      participantTestTypes,
      isInBreakTime,
      breakTimeLeft, // in seconds
      currentTime,
    };
  }),

  // New procedure to check available tests
  getAvailableTests: tokenProcedure.query(async ({ ctx }) => {
    const participant = await ctx.db.participant.findUnique({
      where: { id: ctx.participant.participantId },
      select: {
        time_mbti: true,
        time_disc: true,
        time_tkd: true,
        time_ketelitian: true,
        jeda_waktu: true,
        IsActive: true,
        JenisTes: true,
      },
    });

    if (!participant) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Peserta tidak ditemukan",
      });
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const isInBreakTime = participant.jeda_waktu > currentTime;

    // Parse participant's available test types
    const participantTestTypes = participant.JenisTes
      ? participant.JenisTes.split(",").map((test) => test.trim().toUpperCase())
      : [];
    const testOrder = ["MBTI", "DISC", "TKD", "KETELITIAN"];

    const availableTests = [];

    if (!isInBreakTime) {
      for (const testType of testOrder) {
        if (participantTestTypes.includes(testType)) {
          const lowerTestType = testType.toLowerCase();

          switch (lowerTestType) {
            case "mbti":
              if (participant.time_mbti >= 0) {
                availableTests.push(lowerTestType);
              }
              break;
            case "disc":
              if (participant.time_mbti === -1 && participant.time_disc >= 0) {
                availableTests.push(lowerTestType);
              }
              break;
            case "tkd":
              if (participant.time_disc === -1 && participant.time_tkd >= 0) {
                availableTests.push(lowerTestType);
              }
              break;
            case "ketelitian":
              if (
                participant.time_tkd === -1 &&
                participant.time_ketelitian >= 0
              ) {
                availableTests.push(lowerTestType);
              }
              break;
          }

          // Only return the first available test (sequential access)
          if (availableTests.length > 0) break;
        }
      }
    }

    // Check if all participant's tests are completed
    const allTestsCompleted = participantTestTypes.every((testType) => {
      switch (testType) {
        case "MBTI":
          return participant.time_mbti === -1;
        case "DISC":
          return participant.time_disc === -1;
        case "TKD":
          return participant.time_tkd === -1;
        case "KETELITIAN":
          return participant.time_ketelitian === -1;
        default:
          return true;
      }
    });

    return {
      availableTests,
      participantTestTypes,
      isInBreakTime,
      breakTimeLeft: isInBreakTime ? participant.jeda_waktu - currentTime : 0,
      allTestsCompleted,
      nextTest: availableTests[0] ?? null,
    };
  }),
});
