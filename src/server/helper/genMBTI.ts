import deskripsiMbti from "@/data/questions/deskripsiMbti.json";

interface MBTIQuestion {
  _id: { $oid: string };
  soal?: string;
  soalA?: string;
  soalB?: string;
  jawabanA: string;
  jawabanB: string;
  tipe: string;
  valueA: string;
  valueB: string;
  bagian: string;
}

type Kolom = "kolom1" | "kolom2" | "kolom3" | "kolom4";

interface Bagian {
  kolom1: string[];
  kolom2: string[];
  kolom3: string[];
  kolom4: string[];
}

interface FormattedJawaban {
  bagian1: Bagian;
  bagian2: Bagian;
  bagian3: Bagian;
}

interface MBTIResult {
  bagian1: string;
  bagian2: string;
  bagian3: string;
  tipe: string;
  deskripsi: object | string;
}

// Mode function to find the most frequent value
export function Mode(array: string[]): string {
  if (array.length === 0) return "";

  const modeMap: Record<string, number> = {};
  let modeValue = "";
  let modeCount = 1;

  for (const el of array) {
    if (modeMap[el] == null) {
      modeMap[el] = 1;
    } else {
      modeMap[el]++;
    }

    if (modeMap[el] > modeCount) {
      modeValue = el;
      modeCount = modeMap[el];
    } else if (modeMap[el] === modeCount) {
      modeValue = "0";
    }
  }

  return modeValue;
}

// Convert MBTI type to description
export function ConvertToDeskripsi(tipeString: string) {
  const result = {
    tipe: "",
    arti: "",
    karakter: [] as string[],
    saran_profesi: [] as string[],
  };

  let karakter = "";
  let saran_profesi = "";

  deskripsiMbti.forEach((element) => {
    if (element.tipe === tipeString) {
      result.tipe = element.tipe;
      result.arti = element.arti;
      karakter = element.karakter;
      saran_profesi = element.saran_profesi;
    }
  });

  result.karakter = karakter.split(".");
  result.saran_profesi = saran_profesi.split(",");

  return result;
}

// Convert raw answers to formatted MBTI structure
export function formatMBTIAnswers(
  rawAnswers: string[],
  questions: MBTIQuestion[],
): FormattedJawaban {
  const result: FormattedJawaban = {
    bagian1: { kolom1: [], kolom2: [], kolom3: [], kolom4: [] },
    bagian2: { kolom1: [], kolom2: [], kolom3: [], kolom4: [] },
    bagian3: { kolom1: [], kolom2: [], kolom3: [], kolom4: [] },
  };

  questions.forEach((question, index) => {
    const answer = rawAnswers[index];
    if (!answer) return;

    const bagianRegex = /bagian(\d)/i;
    const bagianMatch = bagianRegex.exec(question.bagian);
    if (!bagianMatch) return;

    const bagianNumber = bagianMatch[1];
    const bagianKey = `bagian${bagianNumber}` as keyof FormattedJawaban;
    const tipeNumber = question.tipe;
    const kolomKey = `kolom${tipeNumber}` as Kolom;
    const value = answer === "A" ? question.valueA : question.valueB;

    if (result[bagianKey]?.[kolomKey]) {
      result[bagianKey][kolomKey].push(value);
    }
  });

  return result;
}

// Process MBTI results similar to the original convertMbti function
export function convertMBTI(formattedAnswers: FormattedJawaban): MBTIResult {
  const sortTipe = {
    bagian1: [] as string[],
    bagian2: [] as string[],
    bagian3: [] as string[],
  };

  const tipe = {
    kolom1: [] as string[],
    kolom2: [] as string[],
    kolom3: [] as string[],
    kolom4: [] as string[],
  };

  // Process bagian1 and bagian2 using Mode function
  for (const key of ["kolom1", "kolom2", "kolom3", "kolom4"] as Kolom[]) {
    sortTipe.bagian1.push(Mode(formattedAnswers.bagian1[key]));
    sortTipe.bagian2.push(Mode(formattedAnswers.bagian2[key]));
  }

  // Process bagian3 - take first element of each column
  for (const key of ["kolom1", "kolom2", "kolom3", "kolom4"] as Kolom[]) {
    sortTipe.bagian3.push(formattedAnswers.bagian3[key][0] || "");
  }

  // Group by columns across all bagian
  for (let i = 0; i < 4; i++) {
    const kolomKey = `kolom${i + 1}` as keyof typeof tipe;
    tipe[kolomKey] = [
      sortTipe.bagian1[i],
      sortTipe.bagian2[i],
      sortTipe.bagian3[i],
    ];
  }

  // Determine final MBTI type
  const finalTipe: string[] = [];
  for (const key of [
    "kolom1",
    "kolom2",
    "kolom3",
    "kolom4",
  ] as (keyof typeof tipe)[]) {
    const mode = Mode(tipe[key]);
    if (mode === "0") {
      // If there's a tie, use the third element (bagian3)
      finalTipe.push(tipe[key][2]);
    } else {
      finalTipe.push(mode);
    }
  }

  const tipeString = finalTipe.join("");

  return {
    bagian1: sortTipe.bagian1.join(""),
    bagian2: sortTipe.bagian2.join(""),
    bagian3: sortTipe.bagian3.join(""),
    tipe: tipeString,
    deskripsi: ConvertToDeskripsi(tipeString),
  };
}
