export const sortDisc = (NP: string[], NK: string[]) => {
  const npSort: {
    D: string[];
    I: string[];
    S: string[];
    C: string[];
    "*": string[];
  } = {
    D: [],
    I: [],
    S: [],
    C: [],
    "*": [],
  };
  const nkSort: {
    D: string[];
    I: string[];
    S: string[];
    C: string[];
    "*": string[];
  } = {
    D: [],
    I: [],
    S: [],
    C: [],
    "*": [],
  };

  NP.forEach((element) => {
    if (typeof element === "string") {
      if (element === "D") {
        npSort.D.push(element);
      } else if (element === "I") {
        npSort.I.push(element);
      } else if (element === "S") {
        npSort.S.push(element);
      } else if (element === "C") {
        npSort.C.push(element);
      } else if (element === "*") {
        npSort["*"].push(element);
      }
    }
  });

  NK.forEach((element) => {
    if (typeof element === "string") {
      if (element === "D") {
        nkSort.D.push(element);
      } else if (element === "I") {
        nkSort.I.push(element);
      } else if (element === "S") {
        nkSort.S.push(element);
      } else if (element === "C") {
        nkSort.C.push(element);
      } else if (element === "*") {
        nkSort["*"].push(element);
      }
    }
  });

  const result = {
    NP: {
      D: npSort.D.length,
      I: npSort.I.length,
      S: npSort.S.length,
      C: npSort.C.length,
      "*": npSort["*"].length,
    },
    NK: {
      D: nkSort.D.length,
      I: nkSort.I.length,
      S: nkSort.S.length,
      C: nkSort.C.length,
      "*": nkSort["*"].length,
    },
    Delta: {
      D: npSort.D.length - nkSort.D.length,
      I: npSort.I.length - nkSort.I.length,
      S: npSort.S.length - nkSort.S.length,
      C: npSort.C.length - nkSort.C.length,
    },
  };

  return result;
};
