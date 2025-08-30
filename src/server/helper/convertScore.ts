import { scoreD1, scoreI1, scoreS1, scoreC1 } from "./scooringDISC/Scoring1";

import { scoreD2, scoreI2, scoreS2, scoreC2 } from "./scooringDISC/Scoring2";

import {
  scoringD3,
  scoringI3,
  scoringS3,
  scoringC3,
} from "./scooringDISC/Scoring3";

type DISCScore = {
  D: number;
  I: number;
  S: number;
  C: number;
};

type Convert = {
  NP: DISCScore;
  NK: DISCScore;
  Delta: DISCScore;
};

export const convertScore = (data: Convert) => {
  const result = {
    NP: { D: 0, I: 0, S: 0, C: 0 },
    NK: { D: 0, I: 0, S: 0, C: 0 },
    Delta: { D: 0, I: 0, S: 0, C: 0 },
  };
  //SCORING !
  scoreD1.forEach((element) => {
    if (element[0] === data.NP.D && element[1] === "D") {
      //   convertNP.push([element[2], 'D']);
      result.NP.D = Number(element[2]);
    }
  });

  scoreI1.forEach((element) => {
    if (element[0] === data.NP.I && element[1] === "I") {
      //   convertNP.push([element[2], 'I']);
      result.NP.I = Number(element[2]);
    }
  });
  scoreS1.forEach((element) => {
    if (element[0] === data.NP.S && element[1] === "S") {
      //   convertNP.push([element[2], 'S']);
      result.NP.S = Number(element[2]);
    }
  });
  scoreC1.forEach((element) => {
    if (element[0] === data.NP.C && element[1] === "C") {
      //   convertNP.push([element[2], 'C']);
      result.NP.C = Number(element[2]);
    }
  });
  //SCORING 2
  scoreD2.forEach((element) => {
    if (element[0] === data.NK.D && element[1] === "D") {
      //   convertNK.push([element[2], 'D']);
      result.NK.D = Number(element[2]);
    }
  });

  scoreI2.forEach((element) => {
    if (element[0] === data.NK.I && element[1] === "I") {
      //   convertNK.push([element[2], 'I']);
      result.NK.I = Number(element[2]);
    }
  });
  scoreS2.forEach((element) => {
    if (element[0] === data.NK.S && element[1] === "S") {
      //   convertNK.push([element[2], 'S']);
      result.NK.S = Number(element[2]);
    }
  });
  scoreC2.forEach((element) => {
    if (element[0] === data.NK.C && element[1] === "C") {
      //   convertNK.push([element[2], 'C']);
      result.NK.C = Number(element[2]);
    }
  });

  scoringD3.forEach((element) => {
    if (element[0] === data.Delta.D && element[1] === "D") {
      //   convertDelta.push([element[2], 'D']);
      result.Delta.D = Number(element[2]);
    }
  });

  scoringI3.forEach((element) => {
    if (element[0] === data.Delta.I && element[1] === "I") {
      //   convertDelta.push([element[2], 'I']);
      result.Delta.I = Number(element[2]);
    }
  });
  scoringS3.forEach((element) => {
    if (element[0] === data.Delta.S && element[1] === "S") {
      //   convertDelta.push([element[2], 'S']);
      result.Delta.S = Number(element[2]);
    }
  });
  scoringC3.forEach((element) => {
    if (element[0] === data.Delta.C && element[1] === "C") {
      //   convertDelta.push([element[2], 'C']);
      result.Delta.C = Number(element[2]);
    }
  });
  return result;
};
