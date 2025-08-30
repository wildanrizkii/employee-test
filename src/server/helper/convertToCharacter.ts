import { sortTypeNP } from "./sortType/NP";
import { sortTypeNK } from "./sortType/NK";
import { sortTypeDelta } from "./sortType/Delta";
import dataDisc from "@/data/questions/deskripsiDISC.json";

interface DataDiscElement {
  tipe: string;
  nama: string;
  sifat: string;
  deskripsi?: string;
  job_match?: string;
}

interface NPResult {
  karakter: string;
  sifat: string;
}

interface NKResult {
  karakter: string;
  sifat: string;
}

interface DeltaResult {
  karakter: string;
  sifat: string;
  deskripsi: string;
  job_match: string;
  tipe: string;
}

interface ConvertToTypeResult {
  NP: NPResult;
  NK: NKResult;
  Delta: DeltaResult;
}

type Data = {
  NP: {
    D: number;
    I: number;
    S: number;
    C: number;
  };
  NK: {
    D: number;
    I: number;
    S: number;
    C: number;
  };
  Delta: {
    D: number;
    I: number;
    S: number;
    C: number;
  };
};

export const convertToType = (data: Data): ConvertToTypeResult => {
  const NP = sortTypeNP(data);
  const NK = sortTypeNK(data);
  const Delta = sortTypeDelta(data);
  const tipeNP: string[] = [];
  const tipeNK: string[] = [];
  const tipeDelta: string[] = [];

  const result: ConvertToTypeResult = {
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
      tipe: "",
    },
  };

  for (const key in NP) {
    if (NP[key as keyof typeof NP] === 1) {
      tipeNP.push(key);
    }
  }
  for (const key in NK) {
    if (NK[key as keyof typeof NK] === 1) {
      tipeNK.push(key);
    }
  }
  for (const key in Delta) {
    if (Delta[key as keyof typeof Delta] === 1) {
      tipeDelta.push(key);
    }
  }

  (dataDisc as DataDiscElement[]).forEach((element) => {
    if (element.tipe === tipeNP[0]) {
      result.NP.karakter = element.nama;
      result.NP.sifat = element.sifat;
    }
  });
  (dataDisc as DataDiscElement[]).forEach((element) => {
    if (element.tipe === tipeNK[0]) {
      result.NK.karakter = element.nama;
      result.NK.sifat = element.sifat;
    }
  });
  (dataDisc as DataDiscElement[]).forEach((element) => {
    if (element.tipe === tipeDelta[0]) {
      result.Delta.karakter = element.nama;
      result.Delta.sifat = element.sifat;
      result.Delta.deskripsi = element.deskripsi ?? "";
      result.Delta.job_match = element.job_match ?? "";
      result.Delta.tipe = tipeDelta.join();
    }
  });
  return result;
};
