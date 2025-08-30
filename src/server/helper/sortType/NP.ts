type NPData = {
  NP: {
    D: number;
    I: number;
    S: number;
    C: number;
  };
};

export const sortTypeNP = (data: NPData) => {
  const npTable = {
    C: 0,
    D: 0,
    CD: 0,
    ID: 0,
    IDC: 0,
    IDS: 0,
    ISD: 0,
    SDC: 0,
    DI: 0,
    DIS: 0,
    DS: 0,
    CIS: 0,
    CSI: 0,
    ISC: 0,
    S: 0,
    CS: 0,
    SC: 0,
    DC: 0,
    DIC: 0,
    DSI: 0,
    DSC: 0,
    DCI: 0,
    DCS: 0,
    I: 0,
    IS: 0,
    IC: 0,
    ICD: 0,
    ICS: 0,
    SD: 0,
    SI: 0,
    SDI: 0,
    SID: 0,
    SIC: 0,
    SCD: 0,
    SCI: 0,
    CI: 0,
    CDI: 0,
    CDS: 0,
    CID: 0,
    CSD: 0,
  };
  const result = npTable;
  if (
    // C
    data.NP.D <= 0 &&
    data.NP.I <= 0 &&
    data.NP.S <= 0 &&
    data.NP.C > 0
  ) {
    result.C = 1;
  } else if (
    // D
    data.NP.D > 0 &&
    data.NP.I <= 0 &&
    data.NP.S <= 0 &&
    data.NP.C <= 0
  ) {
    result.D = 1;
  } else if (
    // CD
    data.NP.D > 0 &&
    data.NP.I <= 0 &&
    data.NP.S <= 0 &&
    data.NP.C > 0 &&
    data.NP.C >= data.NP.D
  ) {
    result.CD = 1;
  } else if (
    // ID
    data.NP.D > 0 &&
    data.NP.I > 0 &&
    data.NP.S <= 0 &&
    data.NP.C <= 0 &&
    data.NP.I >= data.NP.D
  ) {
    result.ID = 1;
  } else if (
    // IDC
    data.NP.D > 0 &&
    data.NP.I > 0 &&
    data.NP.S <= 0 &&
    data.NP.C > 0 &&
    data.NP.I >= data.NP.D &&
    data.NP.D >= data.NP.C
  ) {
    result.IDC = 1;
  } else if (
    // IDS
    data.NP.D > 0 &&
    data.NP.I > 0 &&
    data.NP.S > 0 &&
    data.NP.C <= 0 &&
    data.NP.I >= data.NP.D &&
    data.NP.D >= data.NP.S
  ) {
    result.IDS = 1;
  } else if (
    // ISD
    data.NP.D > 0 &&
    data.NP.I > 0 &&
    data.NP.S > 0 &&
    data.NP.C <= 0 &&
    data.NP.I >= data.NP.S &&
    data.NP.S >= data.NP.D
  ) {
    result.ISD = 1;
  } else if (
    // SDC
    data.NP.D > 0 &&
    data.NP.I <= 0 &&
    data.NP.S > 0 &&
    data.NP.C > 0 &&
    data.NP.S >= data.NP.D &&
    data.NP.D >= data.NP.C
  ) {
    result.SDC = 1;
  } else if (
    // DI
    data.NP.D > 0 &&
    data.NP.I > 0 &&
    data.NP.S <= 0 &&
    data.NP.C <= 0 &&
    data.NP.D >= data.NP.I
  ) {
    result.DI = 1;
  } else if (
    // DIS
    data.NP.D > 0 &&
    data.NP.I > 0 &&
    data.NP.S > 0 &&
    data.NP.C <= 0 &&
    data.NP.D >= data.NP.I &&
    data.NP.I >= data.NP.S
  ) {
    result.DIS = 1;
  } else if (
    // DS
    data.NP.D > 0 &&
    data.NP.I <= 0 &&
    data.NP.S > 0 &&
    data.NP.C <= 0 &&
    data.NP.D >= data.NP.S
  ) {
    result.DS = 1;
  } else if (
    // CIS
    data.NP.D <= 0 &&
    data.NP.I > 0 &&
    data.NP.S > 0 &&
    data.NP.C > 0 &&
    data.NP.C >= data.NP.I &&
    data.NP.I >= data.NP.S
  ) {
    result.CIS = 1;
  } else if (
    // CSI
    data.NP.D <= 0 &&
    data.NP.I > 0 &&
    data.NP.S > 0 &&
    data.NP.C > 0 &&
    data.NP.C >= data.NP.S &&
    data.NP.S >= data.NP.I
  ) {
    result.CSI = 1;
  } else if (
    // ISC
    data.NP.D <= 0 &&
    data.NP.I > 0 &&
    data.NP.S > 0 &&
    data.NP.C > 0 &&
    data.NP.I >= data.NP.S &&
    data.NP.S >= data.NP.C
  ) {
    result.ISC = 1;
  } else if (
    // ICS
    data.NP.D <= 0 &&
    data.NP.I > 0 &&
    data.NP.S > 0 &&
    data.NP.C > 0 &&
    data.NP.I >= data.NP.C &&
    data.NP.C >= data.NP.S
  ) {
    result.ICS = 1;
  } else if (
    // S
    data.NP.D <= 0 &&
    data.NP.I <= 0 &&
    data.NP.S > 0 &&
    data.NP.C <= 0
  ) {
    result.S = 1;
  } else if (
    // CS
    data.NP.D <= 0 &&
    data.NP.I <= 0 &&
    data.NP.S > 0 &&
    data.NP.C > 0 &&
    data.NP.C >= data.NP.S
  ) {
    result.CS = 1;
  } else if (
    // SC
    data.NP.D <= 0 &&
    data.NP.I <= 0 &&
    data.NP.S > 0 &&
    data.NP.C > 0 &&
    data.NP.S >= data.NP.C
  ) {
    result.SC = 1;
  } else if (
    // DC
    data.NP.D > 0 &&
    data.NP.I <= 0 &&
    data.NP.S <= 0 &&
    data.NP.C > 0 &&
    data.NP.D >= data.NP.C
  ) {
    result.DC = 1;
  } else if (
    // DIC
    data.NP.D > 0 &&
    data.NP.I > 0 &&
    data.NP.S <= 0 &&
    data.NP.C > 0 &&
    data.NP.D >= data.NP.I &&
    data.NP.I >= data.NP.C
  ) {
    result.DIC = 1;
  } else if (
    // DSI
    data.NP.D > 0 &&
    data.NP.I > 0 &&
    data.NP.S > 0 &&
    data.NP.C <= 0 &&
    data.NP.D >= data.NP.S &&
    data.NP.S >= data.NP.I
  ) {
    result.DSI = 1;
  } else if (
    // DSC
    data.NP.D > 0 &&
    data.NP.I <= 0 &&
    data.NP.S > 0 &&
    data.NP.C > 0 &&
    data.NP.D >= data.NP.S &&
    data.NP.S >= data.NP.C
  ) {
    result.DSC = 1;
  } else if (
    // DCI
    data.NP.D > 0 &&
    data.NP.I > 0 &&
    data.NP.S <= 0 &&
    data.NP.C > 0 &&
    data.NP.D >= data.NP.C &&
    data.NP.C >= data.NP.I
  ) {
    result.DCI = 1;
  } else if (
    // DCS
    data.NP.D > 0 &&
    data.NP.I <= 0 &&
    data.NP.S > 0 &&
    data.NP.C > 0 &&
    data.NP.D >= data.NP.C &&
    data.NP.C >= data.NP.S
  ) {
    result.DCS = 1;
  } else if (
    // I
    data.NP.D <= 0 &&
    data.NP.I > 0 &&
    data.NP.S <= 0 &&
    data.NP.C <= 0
  ) {
    result.I = 1;
  } else if (
    // IS
    data.NP.D <= 0 &&
    data.NP.I > 0 &&
    data.NP.S > 0 &&
    data.NP.C <= 0 &&
    data.NP.I >= data.NP.S
  ) {
    result.IS = 1;
  } else if (
    // IC
    data.NP.D <= 0 &&
    data.NP.I > 0 &&
    data.NP.S <= 0 &&
    data.NP.C > 0 &&
    data.NP.I >= data.NP.C
  ) {
    result.IC = 1;
  } else if (
    // ICD
    data.NP.D > 0 &&
    data.NP.I > 0 &&
    data.NP.S <= 0 &&
    data.NP.C > 0 &&
    data.NP.I >= data.NP.C &&
    data.NP.C >= data.NP.D
  ) {
    result.ICD = 1;
  } else if (
    // ICS
    data.NP.D <= 0 &&
    data.NP.I > 0 &&
    data.NP.S > 0 &&
    data.NP.C > 0 &&
    data.NP.I >= data.NP.C &&
    data.NP.C >= data.NP.S
  ) {
    result.ICS = 1;
  } else if (
    // SD
    data.NP.D > 0 &&
    data.NP.I <= 0 &&
    data.NP.S > 0 &&
    data.NP.C <= 0 &&
    data.NP.S >= data.NP.D
  ) {
    result.SD = 1;
  } else if (
    // SI
    data.NP.D <= 0 &&
    data.NP.I > 0 &&
    data.NP.S > 0 &&
    data.NP.C <= 0 &&
    data.NP.S >= data.NP.I
  ) {
    result.SI = 1;
  } else if (
    // SDI
    data.NP.D > 0 &&
    data.NP.I > 0 &&
    data.NP.S > 0 &&
    data.NP.C <= 0 &&
    data.NP.S >= data.NP.D &&
    data.NP.D >= data.NP.I
  ) {
    result.SDI = 1;
  } else if (
    // SID
    data.NP.D > 0 &&
    data.NP.I > 0 &&
    data.NP.S > 0 &&
    data.NP.C <= 0 &&
    data.NP.S >= data.NP.I &&
    data.NP.I >= data.NP.D
  ) {
    result.SID = 1;
  } else if (
    // SIC
    data.NP.D <= 0 &&
    data.NP.I > 0 &&
    data.NP.S > 0 &&
    data.NP.C > 0 &&
    data.NP.S >= data.NP.I &&
    data.NP.I >= data.NP.C
  ) {
    result.SIC = 1;
  } else if (
    // SCD
    data.NP.D > 0 &&
    data.NP.I <= 0 &&
    data.NP.S > 0 &&
    data.NP.C > 0 &&
    data.NP.S >= data.NP.C &&
    data.NP.C >= data.NP.D
  ) {
    result.SCD = 1;
  } else if (
    // SCI
    data.NP.D <= 0 &&
    data.NP.I > 0 &&
    data.NP.S > 0 &&
    data.NP.C > 0 &&
    data.NP.S >= data.NP.C &&
    data.NP.C >= data.NP.I
  ) {
    result.SCI = 1;
  } else if (
    // CI
    data.NP.D <= 0 &&
    data.NP.I > 0 &&
    data.NP.S <= 0 &&
    data.NP.C > 0 &&
    data.NP.C >= data.NP.I
  ) {
    result.CI = 1;
  } else if (
    // CDI
    data.NP.D > 0 &&
    data.NP.I > 0 &&
    data.NP.S <= 0 &&
    data.NP.C > 0 &&
    data.NP.C >= data.NP.D &&
    data.NP.D >= data.NP.I
  ) {
    result.CDI = 1;
  } else if (
    // CDS
    data.NP.D > 0 &&
    data.NP.I <= 0 &&
    data.NP.S > 0 &&
    data.NP.C > 0 &&
    data.NP.C >= data.NP.D &&
    data.NP.D >= data.NP.S
  ) {
    result.CDS = 1;
  } else if (
    // CID
    data.NP.D > 0 &&
    data.NP.I > 0 &&
    data.NP.S <= 0 &&
    data.NP.C > 0 &&
    data.NP.C >= data.NP.I &&
    data.NP.I >= data.NP.D
  ) {
    result.CID = 1;
  } else if (
    // CSD
    data.NP.D > 0 &&
    data.NP.I <= 0 &&
    data.NP.S > 0 &&
    data.NP.C > 0 &&
    data.NP.C >= data.NP.S &&
    data.NP.S >= data.NP.D
  ) {
    result.CSD = 1;
  } else if (
    //IDC
    data.NP.D > 0 &&
    data.NP.I > 0 &&
    data.NP.S > 0 &&
    data.NP.C > 0 &&
    data.NP.I >= data.NP.D &&
    data.NP.D >= data.NP.C &&
    data.NP.C >= data.NP.S
  ) {
    result.IDC = 1;
  } else if (
    // IDS
    data.NP.D > 0 &&
    data.NP.I > 0 &&
    data.NP.S > 0 &&
    data.NP.C > 0 &&
    data.NP.I >= data.NP.D &&
    data.NP.D >= data.NP.S &&
    data.NP.S >= data.NP.C
  ) {
    result.IDS = 1;
  } else if (
    // ISD
    data.NP.D > 0 &&
    data.NP.I > 0 &&
    data.NP.S > 0 &&
    data.NP.C > 0 &&
    data.NP.I >= data.NP.S &&
    data.NP.S >= data.NP.D &&
    data.NP.D >= data.NP.C
  ) {
    result.ISD = 1;
  } else if (
    // SDC
    data.NP.D > 0 &&
    data.NP.I > 0 &&
    data.NP.S > 0 &&
    data.NP.C > 0 &&
    data.NP.S >= data.NP.D &&
    data.NP.D >= data.NP.C &&
    data.NP.C >= data.NP.I
  ) {
    result.SDC = 1;
  } else if (
    // DIS
    data.NP.D > 0 &&
    data.NP.I > 0 &&
    data.NP.S > 0 &&
    data.NP.C > 0 &&
    data.NP.D >= data.NP.I &&
    data.NP.I >= data.NP.S &&
    data.NP.S >= data.NP.C
  ) {
    result.DIS = 1;
  } else if (
    // CIS
    data.NP.D > 0 &&
    data.NP.I > 0 &&
    data.NP.S > 0 &&
    data.NP.C > 0 &&
    data.NP.C >= data.NP.I &&
    data.NP.I >= data.NP.S &&
    data.NP.S >= data.NP.D
  ) {
    result.CIS = 1;
  } else if (
    // CSI
    data.NP.D > 0 &&
    data.NP.I > 0 &&
    data.NP.S > 0 &&
    data.NP.C > 0 &&
    data.NP.C >= data.NP.S &&
    data.NP.S >= data.NP.I &&
    data.NP.I >= data.NP.D
  ) {
    result.CSI = 1;
  } else if (
    // ISC
    data.NP.D > 0 &&
    data.NP.I > 0 &&
    data.NP.S > 0 &&
    data.NP.C > 0 &&
    data.NP.I >= data.NP.S &&
    data.NP.S >= data.NP.C &&
    data.NP.C >= data.NP.D
  ) {
    result.ISC = 1;
  } else if (
    // DIC
    data.NP.D > 0 &&
    data.NP.I > 0 &&
    data.NP.S > 0 &&
    data.NP.C > 0 &&
    data.NP.D >= data.NP.I &&
    data.NP.I >= data.NP.C &&
    data.NP.C >= data.NP.S
  ) {
    result.DIC = 1;
  } else if (
    // DSI
    data.NP.D > 0 &&
    data.NP.I > 0 &&
    data.NP.S > 0 &&
    data.NP.C > 0 &&
    data.NP.D >= data.NP.S &&
    data.NP.S >= data.NP.I &&
    data.NP.I &&
    data.NP.C
  ) {
    result.DSI = 1;
  } else if (
    // DSC
    data.NP.D > 0 &&
    data.NP.I > 0 &&
    data.NP.S > 0 &&
    data.NP.C > 0 &&
    data.NP.D >= data.NP.S &&
    data.NP.S >= data.NP.C &&
    data.NP.C >= data.NP.I
  ) {
    result.DSC = 1;
  } else if (
    // DCI
    data.NP.D > 0 &&
    data.NP.I > 0 &&
    data.NP.S > 0 &&
    data.NP.C > 0 &&
    data.NP.D >= data.NP.C &&
    data.NP.C >= data.NP.I &&
    data.NP.I >= data.NP.S
  ) {
    result.DCI = 1;
  } else if (
    // DCS
    data.NP.D > 0 &&
    data.NP.I > 0 &&
    data.NP.S > 0 &&
    data.NP.C > 0 &&
    data.NP.D >= data.NP.C &&
    data.NP.C >= data.NP.S &&
    data.NP.S >= data.NP.I
  ) {
    result.DCS = 1;
  } else if (
    // ICD
    data.NP.D > 0 &&
    data.NP.I > 0 &&
    data.NP.S > 0 &&
    data.NP.C > 0 &&
    data.NP.I >= data.NP.C &&
    data.NP.C >= data.NP.D &&
    data.NP.D >= data.NP.S
  ) {
    result.ICD = 1;
  } else if (
    // ICS
    data.NP.D > 0 &&
    data.NP.I > 0 &&
    data.NP.S > 0 &&
    data.NP.C > 0 &&
    data.NP.I >= data.NP.C &&
    data.NP.C >= data.NP.S &&
    data.NP.S >= data.NP.D
  ) {
    result.ICS = 1;
  } else if (
    // SDI
    data.NP.D > 0 &&
    data.NP.I > 0 &&
    data.NP.S > 0 &&
    data.NP.C > 0 &&
    data.NP.S >= data.NP.D &&
    data.NP.D >= data.NP.I &&
    data.NP.I >= data.NP.C
  ) {
    result.SDI = 1;
  } else if (
    // SID
    data.NP.D > 0 &&
    data.NP.I > 0 &&
    data.NP.S > 0 &&
    data.NP.C > 0 &&
    data.NP.S >= data.NP.I &&
    data.NP.I >= data.NP.D &&
    data.NP.D >= data.NP.C
  ) {
    result.SID = 1;
  } else if (
    // SIC
    data.NP.D > 0 &&
    data.NP.I > 0 &&
    data.NP.S > 0 &&
    data.NP.C > 0 &&
    data.NP.S >= data.NP.I &&
    data.NP.I >= data.NP.C &&
    data.NP.C >= data.NP.D
  ) {
    result.SIC = 1;
  } else if (
    // SCD
    data.NP.D > 0 &&
    data.NP.I > 0 &&
    data.NP.S > 0 &&
    data.NP.C > 0 &&
    data.NP.S >= data.NP.C &&
    data.NP.C >= data.NP.D &&
    data.NP.D >= data.NP.I
  ) {
    result.SCD = 1;
  } else if (
    // SCI
    data.NP.D > 0 &&
    data.NP.I > 0 &&
    data.NP.S > 0 &&
    data.NP.C > 0 &&
    data.NP.S >= data.NP.C &&
    data.NP.C >= data.NP.I &&
    data.NP.I >= data.NP.D
  ) {
    result.SCI = 1;
  } else if (
    // CDI
    data.NP.D > 0 &&
    data.NP.I > 0 &&
    data.NP.S > 0 &&
    data.NP.C > 0 &&
    data.NP.C >= data.NP.D &&
    data.NP.D >= data.NP.I &&
    data.NP.I >= data.NP.S
  ) {
    result.CDI = 1;
  } else if (
    // CDS
    data.NP.D > 0 &&
    data.NP.I > 0 &&
    data.NP.S > 0 &&
    data.NP.C > 0 &&
    data.NP.C >= data.NP.D &&
    data.NP.D >= data.NP.S &&
    data.NP.S >= data.NP.I
  ) {
    result.CDS = 1;
  } else if (
    // CID
    data.NP.D > 0 &&
    data.NP.I > 0 &&
    data.NP.S > 0 &&
    data.NP.C > 0 &&
    data.NP.C >= data.NP.I &&
    data.NP.I >= data.NP.D &&
    data.NP.D >= data.NP.S
  ) {
    result.CID = 1;
  } else if (
    // CSD
    data.NP.D > 0 &&
    data.NP.I > 0 &&
    data.NP.S > 0 &&
    data.NP.C > 0 &&
    data.NP.C >= data.NP.S &&
    data.NP.S >= data.NP.D &&
    data.NP.D >= data.NP.I
  ) {
    result.CSD = 1;
  }
  return result;
};
