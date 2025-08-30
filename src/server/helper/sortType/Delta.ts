type Delta = {
  Delta: {
    D: number;
    I: number;
    S: number;
    C: number;
  };
};

export const sortTypeDelta = (data: Delta) => {
  const deltaTable = {
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

  const result = deltaTable;

  if (
    // C
    data.Delta.D <= 0 &&
    data.Delta.I <= 0 &&
    data.Delta.S <= 0 &&
    data.Delta.C > 0
  ) {
    result.C = 1;
  } else if (
    // D
    data.Delta.D > 0 &&
    data.Delta.I <= 0 &&
    data.Delta.S <= 0 &&
    data.Delta.C <= 0
  ) {
    result.D = 1;
  } else if (
    // CD
    data.Delta.D > 0 &&
    data.Delta.I <= 0 &&
    data.Delta.S <= 0 &&
    data.Delta.C > 0 &&
    data.Delta.C >= data.Delta.D
  ) {
    result.CD = 1;
  } else if (
    // ID
    data.Delta.D > 0 &&
    data.Delta.I > 0 &&
    data.Delta.S <= 0 &&
    data.Delta.C <= 0 &&
    data.Delta.I >= data.Delta.D
  ) {
    result.ID = 1;
  } else if (
    // IDC
    data.Delta.D > 0 &&
    data.Delta.I > 0 &&
    data.Delta.S <= 0 &&
    data.Delta.C > 0 &&
    data.Delta.I >= data.Delta.D &&
    data.Delta.D >= data.Delta.C
  ) {
    result.IDC = 1;
  } else if (
    // IDS
    data.Delta.D > 0 &&
    data.Delta.I > 0 &&
    data.Delta.S > 0 &&
    data.Delta.C <= 0 &&
    data.Delta.I >= data.Delta.D &&
    data.Delta.D >= data.Delta.S
  ) {
    result.IDS = 1;
  } else if (
    // ISD
    data.Delta.D > 0 &&
    data.Delta.I > 0 &&
    data.Delta.S > 0 &&
    data.Delta.C <= 0 &&
    data.Delta.I >= data.Delta.S &&
    data.Delta.S >= data.Delta.D
  ) {
    result.ISD = 1;
  } else if (
    // SDC
    data.Delta.D > 0 &&
    data.Delta.I <= 0 &&
    data.Delta.S > 0 &&
    data.Delta.C > 0 &&
    data.Delta.S >= data.Delta.D &&
    data.Delta.D >= data.Delta.C
  ) {
    result.SDC = 1;
  } else if (
    // DI
    data.Delta.D > 0 &&
    data.Delta.I > 0 &&
    data.Delta.S <= 0 &&
    data.Delta.C <= 0 &&
    data.Delta.D >= data.Delta.I
  ) {
    result.DI = 1;
  } else if (
    // DIS
    data.Delta.D > 0 &&
    data.Delta.I > 0 &&
    data.Delta.S > 0 &&
    data.Delta.C <= 0 &&
    data.Delta.D >= data.Delta.I &&
    data.Delta.I >= data.Delta.S
  ) {
    result.DIS = 1;
  } else if (
    // DS
    data.Delta.D > 0 &&
    data.Delta.I <= 0 &&
    data.Delta.S > 0 &&
    data.Delta.C <= 0 &&
    data.Delta.D >= data.Delta.S
  ) {
    result.DS = 1;
  } else if (
    // CIS
    data.Delta.D <= 0 &&
    data.Delta.I > 0 &&
    data.Delta.S > 0 &&
    data.Delta.C > 0 &&
    data.Delta.C >= data.Delta.I &&
    data.Delta.I >= data.Delta.S
  ) {
    result.CIS = 1;
  } else if (
    // CSI
    data.Delta.D <= 0 &&
    data.Delta.I > 0 &&
    data.Delta.S > 0 &&
    data.Delta.C > 0 &&
    data.Delta.C >= data.Delta.S &&
    data.Delta.S >= data.Delta.I
  ) {
    result.CSI = 1;
  } else if (
    // ISC
    data.Delta.D <= 0 &&
    data.Delta.I > 0 &&
    data.Delta.S > 0 &&
    data.Delta.C > 0 &&
    data.Delta.I >= data.Delta.S &&
    data.Delta.S >= data.Delta.C
  ) {
    result.ISC = 1;
  } else if (
    // ICS
    data.Delta.D <= 0 &&
    data.Delta.I > 0 &&
    data.Delta.S > 0 &&
    data.Delta.C > 0 &&
    data.Delta.I >= data.Delta.C &&
    data.Delta.C >= data.Delta.S
  ) {
    result.ICS = 1;
  } else if (
    // S
    data.Delta.D <= 0 &&
    data.Delta.I <= 0 &&
    data.Delta.S > 0 &&
    data.Delta.C <= 0
  ) {
    result.S = 1;
  } else if (
    // CS
    data.Delta.D <= 0 &&
    data.Delta.I <= 0 &&
    data.Delta.S > 0 &&
    data.Delta.C > 0 &&
    data.Delta.C >= data.Delta.S
  ) {
    result.CS = 1;
  } else if (
    // SC
    data.Delta.D <= 0 &&
    data.Delta.I <= 0 &&
    data.Delta.S > 0 &&
    data.Delta.C > 0 &&
    data.Delta.S >= data.Delta.C
  ) {
    result.SC = 1;
  } else if (
    // DC
    data.Delta.D > 0 &&
    data.Delta.I <= 0 &&
    data.Delta.S <= 0 &&
    data.Delta.C > 0 &&
    data.Delta.D >= data.Delta.C
  ) {
    result.DC = 1;
  } else if (
    // DIC
    data.Delta.D > 0 &&
    data.Delta.I > 0 &&
    data.Delta.S <= 0 &&
    data.Delta.C > 0 &&
    data.Delta.D >= data.Delta.I &&
    data.Delta.I >= data.Delta.C
  ) {
    result.DIC = 1;
  } else if (
    // DSI
    data.Delta.D > 0 &&
    data.Delta.I > 0 &&
    data.Delta.S > 0 &&
    data.Delta.C <= 0 &&
    data.Delta.D >= data.Delta.S &&
    data.Delta.S >= data.Delta.I
  ) {
    result.DSI = 1;
  } else if (
    // DSC
    data.Delta.D > 0 &&
    data.Delta.I <= 0 &&
    data.Delta.S > 0 &&
    data.Delta.C > 0 &&
    data.Delta.D >= data.Delta.S &&
    data.Delta.S >= data.Delta.C
  ) {
    result.DSC = 1;
  } else if (
    // DCI
    data.Delta.D > 0 &&
    data.Delta.I > 0 &&
    data.Delta.S <= 0 &&
    data.Delta.C > 0 &&
    data.Delta.D >= data.Delta.C &&
    data.Delta.C >= data.Delta.I
  ) {
    result.DCI = 1;
  } else if (
    // DCS
    data.Delta.D > 0 &&
    data.Delta.I <= 0 &&
    data.Delta.S > 0 &&
    data.Delta.C > 0 &&
    data.Delta.D >= data.Delta.C &&
    data.Delta.C >= data.Delta.S
  ) {
    result.DCS = 1;
  } else if (
    // I
    data.Delta.D <= 0 &&
    data.Delta.I > 0 &&
    data.Delta.S <= 0 &&
    data.Delta.C <= 0
  ) {
    result.I = 1;
  } else if (
    // IS
    data.Delta.D <= 0 &&
    data.Delta.I > 0 &&
    data.Delta.S > 0 &&
    data.Delta.C <= 0 &&
    data.Delta.I >= data.Delta.S
  ) {
    result.IS = 1;
  } else if (
    // IC
    data.Delta.D <= 0 &&
    data.Delta.I > 0 &&
    data.Delta.S <= 0 &&
    data.Delta.C > 0 &&
    data.Delta.I >= data.Delta.C
  ) {
    result.IC = 1;
  } else if (
    // ICD
    data.Delta.D > 0 &&
    data.Delta.I > 0 &&
    data.Delta.S <= 0 &&
    data.Delta.C > 0 &&
    data.Delta.I >= data.Delta.C &&
    data.Delta.C >= data.Delta.D
  ) {
    result.ICD = 1;
  } else if (
    // ICS
    data.Delta.D <= 0 &&
    data.Delta.I > 0 &&
    data.Delta.S > 0 &&
    data.Delta.C > 0 &&
    data.Delta.I >= data.Delta.C &&
    data.Delta.C >= data.Delta.S
  ) {
    result.ICS = 1;
  } else if (
    // SD
    data.Delta.D > 0 &&
    data.Delta.I <= 0 &&
    data.Delta.S > 0 &&
    data.Delta.C <= 0 &&
    data.Delta.S >= data.Delta.D
  ) {
    result.SD = 1;
  } else if (
    // SI
    data.Delta.D <= 0 &&
    data.Delta.I > 0 &&
    data.Delta.S > 0 &&
    data.Delta.C <= 0 &&
    data.Delta.S >= data.Delta.I
  ) {
    result.SI = 1;
  } else if (
    // SDI
    data.Delta.D > 0 &&
    data.Delta.I > 0 &&
    data.Delta.S > 0 &&
    data.Delta.C <= 0 &&
    data.Delta.S >= data.Delta.D &&
    data.Delta.D >= data.Delta.I
  ) {
    result.SDI = 1;
  } else if (
    // SID
    data.Delta.D > 0 &&
    data.Delta.I > 0 &&
    data.Delta.S > 0 &&
    data.Delta.C <= 0 &&
    data.Delta.S >= data.Delta.I &&
    data.Delta.I >= data.Delta.D
  ) {
    result.SID = 1;
  } else if (
    // SIC
    data.Delta.D <= 0 &&
    data.Delta.I > 0 &&
    data.Delta.S > 0 &&
    data.Delta.C > 0 &&
    data.Delta.S >= data.Delta.I &&
    data.Delta.I >= data.Delta.C
  ) {
    result.SIC = 1;
  } else if (
    // SCD
    data.Delta.D > 0 &&
    data.Delta.I <= 0 &&
    data.Delta.S > 0 &&
    data.Delta.C > 0 &&
    data.Delta.S >= data.Delta.C &&
    data.Delta.C >= data.Delta.D
  ) {
    result.SCD = 1;
  } else if (
    // SCI
    data.Delta.D <= 0 &&
    data.Delta.I > 0 &&
    data.Delta.S > 0 &&
    data.Delta.C > 0 &&
    data.Delta.S >= data.Delta.C &&
    data.Delta.C >= data.Delta.I
  ) {
    result.SCI = 1;
  } else if (
    // CI
    data.Delta.D <= 0 &&
    data.Delta.I > 0 &&
    data.Delta.S <= 0 &&
    data.Delta.C > 0 &&
    data.Delta.C >= data.Delta.I
  ) {
    result.CI = 1;
  } else if (
    // CDI
    data.Delta.D > 0 &&
    data.Delta.I > 0 &&
    data.Delta.S <= 0 &&
    data.Delta.C > 0 &&
    data.Delta.C >= data.Delta.D &&
    data.Delta.D >= data.Delta.I
  ) {
    result.CDI = 1;
  } else if (
    // CDS
    data.Delta.D > 0 &&
    data.Delta.I <= 0 &&
    data.Delta.S > 0 &&
    data.Delta.C > 0 &&
    data.Delta.C >= data.Delta.D &&
    data.Delta.D >= data.Delta.S
  ) {
    result.CDS = 1;
  } else if (
    // CID
    data.Delta.D > 0 &&
    data.Delta.I > 0 &&
    data.Delta.S <= 0 &&
    data.Delta.C > 0 &&
    data.Delta.C >= data.Delta.I &&
    data.Delta.I >= data.Delta.D
  ) {
    result.CID = 1;
  } else if (
    // CSD
    data.Delta.D > 0 &&
    data.Delta.I <= 0 &&
    data.Delta.S > 0 &&
    data.Delta.C > 0 &&
    data.Delta.C >= data.Delta.S &&
    data.Delta.S >= data.Delta.D
  ) {
    result.CSD = 1;
  } else if (
    //IDC
    data.Delta.D > 0 &&
    data.Delta.I > 0 &&
    data.Delta.S > 0 &&
    data.Delta.C > 0 &&
    data.Delta.I >= data.Delta.D &&
    data.Delta.D >= data.Delta.C &&
    data.Delta.C >= data.Delta.S
  ) {
    result.IDC = 1;
  } else if (
    // IDS
    data.Delta.D > 0 &&
    data.Delta.I > 0 &&
    data.Delta.S > 0 &&
    data.Delta.C > 0 &&
    data.Delta.I >= data.Delta.D &&
    data.Delta.D >= data.Delta.S &&
    data.Delta.S >= data.Delta.C
  ) {
    result.IDS = 1;
  } else if (
    // ISD
    data.Delta.D > 0 &&
    data.Delta.I > 0 &&
    data.Delta.S > 0 &&
    data.Delta.C > 0 &&
    data.Delta.I >= data.Delta.S &&
    data.Delta.S >= data.Delta.D &&
    data.Delta.D >= data.Delta.C
  ) {
    result.ISD = 1;
  } else if (
    // SDC
    data.Delta.D > 0 &&
    data.Delta.I > 0 &&
    data.Delta.S > 0 &&
    data.Delta.C > 0 &&
    data.Delta.S >= data.Delta.D &&
    data.Delta.D >= data.Delta.C &&
    data.Delta.C >= data.Delta.I
  ) {
    result.SDC = 1;
  } else if (
    // DIS
    data.Delta.D > 0 &&
    data.Delta.I > 0 &&
    data.Delta.S > 0 &&
    data.Delta.C > 0 &&
    data.Delta.D >= data.Delta.I &&
    data.Delta.I >= data.Delta.S &&
    data.Delta.S >= data.Delta.C
  ) {
    result.DIS = 1;
  } else if (
    // CIS
    data.Delta.D > 0 &&
    data.Delta.I > 0 &&
    data.Delta.S > 0 &&
    data.Delta.C > 0 &&
    data.Delta.C >= data.Delta.I &&
    data.Delta.I >= data.Delta.S &&
    data.Delta.S >= data.Delta.D
  ) {
    result.CIS = 1;
  } else if (
    // CSI
    data.Delta.D > 0 &&
    data.Delta.I > 0 &&
    data.Delta.S > 0 &&
    data.Delta.C > 0 &&
    data.Delta.C >= data.Delta.S &&
    data.Delta.S >= data.Delta.I &&
    data.Delta.I >= data.Delta.D
  ) {
    result.CSI = 1;
  } else if (
    // ISC
    data.Delta.D > 0 &&
    data.Delta.I > 0 &&
    data.Delta.S > 0 &&
    data.Delta.C > 0 &&
    data.Delta.I >= data.Delta.S &&
    data.Delta.S >= data.Delta.C &&
    data.Delta.C >= data.Delta.D
  ) {
    result.ISC = 1;
  } else if (
    // DIC
    data.Delta.D > 0 &&
    data.Delta.I > 0 &&
    data.Delta.S > 0 &&
    data.Delta.C > 0 &&
    data.Delta.D >= data.Delta.I &&
    data.Delta.I >= data.Delta.C &&
    data.Delta.C >= data.Delta.S
  ) {
    result.DIC = 1;
  } else if (
    // DSI
    data.Delta.D > 0 &&
    data.Delta.I > 0 &&
    data.Delta.S > 0 &&
    data.Delta.C > 0 &&
    data.Delta.D >= data.Delta.S &&
    data.Delta.S >= data.Delta.I &&
    data.Delta.I &&
    data.Delta.C
  ) {
    result.DSI = 1;
  } else if (
    // DSC
    data.Delta.D > 0 &&
    data.Delta.I > 0 &&
    data.Delta.S > 0 &&
    data.Delta.C > 0 &&
    data.Delta.D >= data.Delta.S &&
    data.Delta.S >= data.Delta.C &&
    data.Delta.C >= data.Delta.I
  ) {
    result.DSC = 1;
  } else if (
    // DCI
    data.Delta.D > 0 &&
    data.Delta.I > 0 &&
    data.Delta.S > 0 &&
    data.Delta.C > 0 &&
    data.Delta.D >= data.Delta.C &&
    data.Delta.C >= data.Delta.I &&
    data.Delta.I >= data.Delta.S
  ) {
    result.DCI = 1;
  } else if (
    // DCS
    data.Delta.D > 0 &&
    data.Delta.I > 0 &&
    data.Delta.S > 0 &&
    data.Delta.C > 0 &&
    data.Delta.D >= data.Delta.C &&
    data.Delta.C >= data.Delta.S &&
    data.Delta.S >= data.Delta.I
  ) {
    result.DCS = 1;
  } else if (
    // ICD
    data.Delta.D > 0 &&
    data.Delta.I > 0 &&
    data.Delta.S > 0 &&
    data.Delta.C > 0 &&
    data.Delta.I >= data.Delta.C &&
    data.Delta.C >= data.Delta.D &&
    data.Delta.D >= data.Delta.S
  ) {
    result.ICD = 1;
  } else if (
    // ICS
    data.Delta.D > 0 &&
    data.Delta.I > 0 &&
    data.Delta.S > 0 &&
    data.Delta.C > 0 &&
    data.Delta.I >= data.Delta.C &&
    data.Delta.C >= data.Delta.S &&
    data.Delta.S >= data.Delta.D
  ) {
    result.ICS = 1;
  } else if (
    // SDI
    data.Delta.D > 0 &&
    data.Delta.I > 0 &&
    data.Delta.S > 0 &&
    data.Delta.C > 0 &&
    data.Delta.S >= data.Delta.D &&
    data.Delta.D >= data.Delta.I &&
    data.Delta.I >= data.Delta.C
  ) {
    result.SDI = 1;
  } else if (
    // SID
    data.Delta.D > 0 &&
    data.Delta.I > 0 &&
    data.Delta.S > 0 &&
    data.Delta.C > 0 &&
    data.Delta.S >= data.Delta.I &&
    data.Delta.I >= data.Delta.D &&
    data.Delta.D >= data.Delta.C
  ) {
    result.SID = 1;
  } else if (
    // SIC
    data.Delta.D > 0 &&
    data.Delta.I > 0 &&
    data.Delta.S > 0 &&
    data.Delta.C > 0 &&
    data.Delta.S >= data.Delta.I &&
    data.Delta.I >= data.Delta.C &&
    data.Delta.C >= data.Delta.D
  ) {
    result.SIC = 1;
  } else if (
    // SCD
    data.Delta.D > 0 &&
    data.Delta.I > 0 &&
    data.Delta.S > 0 &&
    data.Delta.C > 0 &&
    data.Delta.S >= data.Delta.C &&
    data.Delta.C >= data.Delta.D &&
    data.Delta.D >= data.Delta.I
  ) {
    result.SCD = 1;
  } else if (
    // SCI
    data.Delta.D > 0 &&
    data.Delta.I > 0 &&
    data.Delta.S > 0 &&
    data.Delta.C > 0 &&
    data.Delta.S >= data.Delta.C &&
    data.Delta.C >= data.Delta.I &&
    data.Delta.I >= data.Delta.D
  ) {
    result.SCI = 1;
  } else if (
    // CDI
    data.Delta.D > 0 &&
    data.Delta.I > 0 &&
    data.Delta.S > 0 &&
    data.Delta.C > 0 &&
    data.Delta.C >= data.Delta.D &&
    data.Delta.D >= data.Delta.I &&
    data.Delta.I >= data.Delta.S
  ) {
    result.CDI = 1;
  } else if (
    // CDS
    data.Delta.D > 0 &&
    data.Delta.I > 0 &&
    data.Delta.S > 0 &&
    data.Delta.C > 0 &&
    data.Delta.C >= data.Delta.D &&
    data.Delta.D >= data.Delta.S &&
    data.Delta.S >= data.Delta.I
  ) {
    result.CDS = 1;
  } else if (
    // CID
    data.Delta.D > 0 &&
    data.Delta.I > 0 &&
    data.Delta.S > 0 &&
    data.Delta.C > 0 &&
    data.Delta.C >= data.Delta.I &&
    data.Delta.I >= data.Delta.D &&
    data.Delta.D >= data.Delta.S
  ) {
    result.CID = 1;
  } else if (
    // CSD
    data.Delta.D > 0 &&
    data.Delta.I > 0 &&
    data.Delta.S > 0 &&
    data.Delta.C > 0 &&
    data.Delta.C >= data.Delta.S &&
    data.Delta.S >= data.Delta.D &&
    data.Delta.D >= data.Delta.I
  ) {
    result.CSD = 1;
  }
  return result;
};
