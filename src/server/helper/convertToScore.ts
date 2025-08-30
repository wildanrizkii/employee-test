import { scoreD1, scoreI1, scoreS1, scoreC1 } from "./scooringDISC/Scoring1";

import { scoreD2, scoreI2, scoreS2, scoreC2 } from "./scooringDISC/Scoring2";

import {
  scoringD3,
  scoringI3,
  scoringS3,
  scoringC3,
} from "./scooringDISC/Scoring3";

import dataDisc from "@/data/questions/deskripsiDISC.json";

interface DiscData {
  NP: { D: number; I: number; S: number; C: number };
  NK: { D: number; I: number; S: number; C: number };
  Delta: { D: number; I: number; S: number; C: number };
}

interface ConvertedScore {
  0: number | string;
  1: "D" | "I" | "S" | "C";
}

export const convertToScore = (data: DiscData) => {
  const convertNP: ConvertedScore[] = [];
  const convertNK: ConvertedScore[] = [];
  const convertDelta: ConvertedScore[] = [];
  const positiveNP: ConvertedScore[] = [];
  const positiveNK: ConvertedScore[] = [];
  const positiveDelta: ConvertedScore[] = [];
  const tipeNP: Array<"D" | "I" | "S" | "C"> = [];
  const tipeNK: Array<"D" | "I" | "S" | "C"> = [];
  const tipeDelta: Array<"D" | "I" | "S" | "C"> = [];
  const result = {
    NP: {
      karakter: "",
      sifat: "",
    },
    NK: {
      karakter: "",
      sifat: "",
    },
    Delta: {
      karakter: "",
      sifat: "",
      deskripsi: "",
      job_match: "",
    },
  };

  //   SCORING 1

  scoreD1.forEach((element) => {
    if (element[0] === data.NP.D && element[1] === "D") {
      convertNP.push([element[2]!, "D"]);
    }
  });

  scoreI1.forEach((element) => {
    if (element[0] === data.NP.I && element[1] === "I") {
      convertNP.push([element[2]!, "I"]);
    }
  });
  scoreS1.forEach((element) => {
    if (element[0] === data.NP.S && element[1] === "S") {
      convertNP.push([element[2]!, "S"]);
    }
  });
  scoreC1.forEach((element) => {
    if (element[0] === data.NP.C && element[1] === "C") {
      convertNP.push([element[2]!, "C"]);
    }
  });
  //Scoring 2
  scoreD2.forEach((element) => {
    if (element[0] === data.NK.D && element[1] === "D") {
      convertNK.push([element[2]!, "D"]);
    }
  });

  scoreI2.forEach((element) => {
    if (element[0] === data.NK.I && element[1] === "I") {
      convertNK.push([element[2]!, "I"]);
    }
  });
  scoreS2.forEach((element) => {
    if (element[0] === data.NK.S && element[1] === "S") {
      convertNK.push([element[2]!, "S"]);
    }
  });
  scoreC2.forEach((element) => {
    if (element[0] === data.NK.C && element[1] === "C") {
      convertNK.push([element[2]!, "C"]);
    }
  });
  //Scoring 3
  scoringD3.forEach((element) => {
    if (element[0] === data.Delta.D && element[1] === "D") {
      convertDelta.push([element[2]!, "D"]);
    }
  });

  scoringI3.forEach((element) => {
    if (element[0] === data.Delta.I && element[1] === "I") {
      convertDelta.push([element[2]!, "I"]);
    }
  });
  scoringS3.forEach((element) => {
    if (element[0] === data.Delta.S && element[1] === "S") {
      convertDelta.push([element[2]!, "S"]);
    }
  });
  scoringC3.forEach((element) => {
    if (element[0] === data.Delta.C && element[1] === "C") {
      convertDelta.push([element[2]!, "C"]);
    }
  });

  //POSITIVE1
  convertNP.forEach((element) => {
    if (typeof element[0] === "number" && element[0] > 0) {
      positiveNP.push(element);
    }
  });
  //   Positive 2
  convertNK.forEach((element) => {
    if (typeof element[0] === "number" && element[0] > 0) {
      positiveNK.push(element);
    }
  });
  //   Positive 3
  convertDelta.forEach((element) => {
    if (typeof element[0] === "number" && element[0] > 0) {
      positiveDelta.push(element);
    }
  });

  for (let i = 1; i < positiveNP.length; i++) {
    for (let j = 0; j < i; j++) {
      if (positiveNP[i]![0] > positiveNP[j]![0]) {
        const x0 = positiveNP[i]![0];
        const x1 = positiveNP[i]![1];
        positiveNP[i]![0] = positiveNP[j]![0];
        positiveNP[i]![1] = positiveNP[j]![1];
        positiveNP[j]![0] = x0;
        positiveNP[j]![1] = x1;
      }
    }
  }

  for (let i = 1; i < positiveNK.length; i++) {
    for (let j = 0; j < i; j++) {
      if (positiveNK[i]![0] > positiveNK[j]![0]) {
        const x0 = positiveNK[i]![0];
        const x1 = positiveNK[i]![1];
        positiveNK[i]![0] = positiveNK[j]![0];
        positiveNK[i]![1] = positiveNK[j]![1];
        positiveNK[j]![0] = x0;
        positiveNK[j]![1] = x1;
      }
    }
  }
  for (let i = 1; i < positiveDelta.length; i++) {
    for (let j = 0; j < i; j++) {
      if (positiveDelta[i]![0] > positiveDelta[j]![0]) {
        const x0 = positiveDelta[i]![0];
        const x1 = positiveDelta[i]![1];
        positiveDelta[i]![0] = positiveDelta[j]![0];
        positiveDelta[i]![1] = positiveDelta[j]![1];
        positiveDelta[j]![0] = x0;
        positiveDelta[j]![1] = x1;
      }
    }
  }

  positiveNP.forEach((element) => {
    tipeNP.push(element[1]);
  });
  positiveNK.forEach((element) => {
    tipeNK.push(element[1]);
  });
  positiveDelta.forEach((element) => {
    tipeDelta.push(element[1]);
  });

  dataDisc.forEach((element) => {
    if (element.tipe === tipeNP.join("")) {
      result.NP.karakter = element.nama;
      result.NP.sifat = element.sifat;
    }
  });
  dataDisc.forEach((element) => {
    if (element.tipe === tipeNK.join("")) {
      result.NK.karakter = element.nama;
      result.NK.sifat = element.sifat;
    }
  });
  dataDisc.forEach((element) => {
    if (element.tipe === tipeDelta.join("")) {
      result.Delta.karakter = element.nama;
      result.Delta.sifat = element.sifat;
      result.Delta.deskripsi = element.deskripsi;
      result.Delta.job_match = element.job_match;
    }
  });
  //SCORING 2

  return result;
};
