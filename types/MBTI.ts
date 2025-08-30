export interface MBTIQuestion {
  _id: {
    $oid: string;
  };
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

export interface MBTIScores {
  E: number;
  I: number;
  S: number;
  N: number;
  T: number;
  F: number;
  J: number;
  P: number;
}

export interface MBTIResult {
  type: string;
  scores: MBTIScores;
}
