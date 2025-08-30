type NKData = {
  NK: {
    D: number;
    I: number;
    S: number;
    C: number;
  };
};

export const sortTypeNK = (data: NKData) => {
  const nkTable = {
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
  const result = nkTable;
  if (
    // C
    data.NK.D <= 0 &&
    data.NK.I <= 0 &&
    data.NK.S <= 0 &&
    data.NK.C > 0
  ) {
    result.C = 1;
  } else if (
    // D
    data.NK.D > 0 &&
    data.NK.I <= 0 &&
    data.NK.S <= 0 &&
    data.NK.C <= 0
  ) {
    result.D = 1;
  } else if (
    // CD
    data.NK.D > 0 &&
    data.NK.I <= 0 &&
    data.NK.S <= 0 &&
    data.NK.C > 0 &&
    data.NK.C >= data.NK.D
  ) {
    result.CD = 1;
  } else if (
    // ID
    data.NK.D > 0 &&
    data.NK.I > 0 &&
    data.NK.S <= 0 &&
    data.NK.C <= 0 &&
    data.NK.I >= data.NK.D
  ) {
    result.ID = 1;
  } else if (
    // IDC
    data.NK.D > 0 &&
    data.NK.I > 0 &&
    data.NK.S <= 0 &&
    data.NK.C > 0 &&
    data.NK.I >= data.NK.D &&
    data.NK.D >= data.NK.C
  ) {
    result.IDC = 1;
  } else if (
    // IDS
    data.NK.D > 0 &&
    data.NK.I > 0 &&
    data.NK.S > 0 &&
    data.NK.C <= 0 &&
    data.NK.I >= data.NK.D &&
    data.NK.D >= data.NK.S
  ) {
    result.IDS = 1;
  } else if (
    // ISD
    data.NK.D > 0 &&
    data.NK.I > 0 &&
    data.NK.S > 0 &&
    data.NK.C <= 0 &&
    data.NK.I >= data.NK.S &&
    data.NK.S >= data.NK.D
  ) {
    result.ISD = 1;
  } else if (
    // SDC
    data.NK.D > 0 &&
    data.NK.I <= 0 &&
    data.NK.S > 0 &&
    data.NK.C > 0 &&
    data.NK.S >= data.NK.D &&
    data.NK.D >= data.NK.C
  ) {
    result.SDC = 1;
  } else if (
    // DI
    data.NK.D > 0 &&
    data.NK.I > 0 &&
    data.NK.S <= 0 &&
    data.NK.C <= 0 &&
    data.NK.D >= data.NK.I
  ) {
    result.DI = 1;
  } else if (
    // DIS
    data.NK.D > 0 &&
    data.NK.I > 0 &&
    data.NK.S > 0 &&
    data.NK.C <= 0 &&
    data.NK.D >= data.NK.I &&
    data.NK.I >= data.NK.S
  ) {
    result.DIS = 1;
  } else if (
    // DS
    data.NK.D > 0 &&
    data.NK.I <= 0 &&
    data.NK.S > 0 &&
    data.NK.C <= 0 &&
    data.NK.D >= data.NK.S
  ) {
    result.DS = 1;
  } else if (
    // CIS
    data.NK.D <= 0 &&
    data.NK.I > 0 &&
    data.NK.S > 0 &&
    data.NK.C > 0 &&
    data.NK.C >= data.NK.I &&
    data.NK.I >= data.NK.S
  ) {
    result.CIS = 1;
  } else if (
    // CSI
    data.NK.D <= 0 &&
    data.NK.I > 0 &&
    data.NK.S > 0 &&
    data.NK.C > 0 &&
    data.NK.C >= data.NK.S &&
    data.NK.S >= data.NK.I
  ) {
    result.CSI = 1;
  } else if (
    // ISC
    data.NK.D <= 0 &&
    data.NK.I > 0 &&
    data.NK.S > 0 &&
    data.NK.C > 0 &&
    data.NK.I >= data.NK.S &&
    data.NK.S >= data.NK.C
  ) {
    result.ISC = 1;
  } else if (
    // ICS
    data.NK.D <= 0 &&
    data.NK.I > 0 &&
    data.NK.S > 0 &&
    data.NK.C > 0 &&
    data.NK.I >= data.NK.C &&
    data.NK.C >= data.NK.S
  ) {
    result.ICS = 1;
  } else if (
    // S
    data.NK.D <= 0 &&
    data.NK.I <= 0 &&
    data.NK.S > 0 &&
    data.NK.C <= 0
  ) {
    result.S = 1;
  } else if (
    // CS
    data.NK.D <= 0 &&
    data.NK.I <= 0 &&
    data.NK.S > 0 &&
    data.NK.C > 0 &&
    data.NK.C >= data.NK.S
  ) {
    result.CS = 1;
  } else if (
    // SC
    data.NK.D <= 0 &&
    data.NK.I <= 0 &&
    data.NK.S > 0 &&
    data.NK.C > 0 &&
    data.NK.S >= data.NK.C
  ) {
    result.SC = 1;
  } else if (
    // DC
    data.NK.D > 0 &&
    data.NK.I <= 0 &&
    data.NK.S <= 0 &&
    data.NK.C > 0 &&
    data.NK.D >= data.NK.C
  ) {
    result.DC = 1;
  } else if (
    // DIC
    data.NK.D > 0 &&
    data.NK.I > 0 &&
    data.NK.S <= 0 &&
    data.NK.C > 0 &&
    data.NK.D >= data.NK.I &&
    data.NK.I >= data.NK.C
  ) {
    result.DIC = 1;
  } else if (
    // DSI
    data.NK.D > 0 &&
    data.NK.I > 0 &&
    data.NK.S > 0 &&
    data.NK.C <= 0 &&
    data.NK.D >= data.NK.S &&
    data.NK.S >= data.NK.I
  ) {
    result.DSI = 1;
  } else if (
    // DSC
    data.NK.D > 0 &&
    data.NK.I <= 0 &&
    data.NK.S > 0 &&
    data.NK.C > 0 &&
    data.NK.D >= data.NK.S &&
    data.NK.S >= data.NK.C
  ) {
    result.DSC = 1;
  } else if (
    // DCI
    data.NK.D > 0 &&
    data.NK.I > 0 &&
    data.NK.S <= 0 &&
    data.NK.C > 0 &&
    data.NK.D >= data.NK.C &&
    data.NK.C >= data.NK.I
  ) {
    result.DCI = 1;
  } else if (
    // DCS
    data.NK.D > 0 &&
    data.NK.I <= 0 &&
    data.NK.S > 0 &&
    data.NK.C > 0 &&
    data.NK.D >= data.NK.C &&
    data.NK.C >= data.NK.S
  ) {
    result.DCS = 1;
  } else if (
    // I
    data.NK.D <= 0 &&
    data.NK.I > 0 &&
    data.NK.S <= 0 &&
    data.NK.C <= 0
  ) {
    result.I = 1;
  } else if (
    // IS
    data.NK.D <= 0 &&
    data.NK.I > 0 &&
    data.NK.S > 0 &&
    data.NK.C <= 0 &&
    data.NK.I >= data.NK.S
  ) {
    result.IS = 1;
  } else if (
    // IC
    data.NK.D <= 0 &&
    data.NK.I > 0 &&
    data.NK.S <= 0 &&
    data.NK.C > 0 &&
    data.NK.I >= data.NK.C
  ) {
    result.IC = 1;
  } else if (
    // ICD
    data.NK.D > 0 &&
    data.NK.I > 0 &&
    data.NK.S <= 0 &&
    data.NK.C > 0 &&
    data.NK.I >= data.NK.C &&
    data.NK.C >= data.NK.D
  ) {
    result.ICD = 1;
  } else if (
    // ICS
    data.NK.D <= 0 &&
    data.NK.I > 0 &&
    data.NK.S > 0 &&
    data.NK.C > 0 &&
    data.NK.I >= data.NK.C &&
    data.NK.C >= data.NK.S
  ) {
    result.ICS = 1;
  } else if (
    // SD
    data.NK.D > 0 &&
    data.NK.I <= 0 &&
    data.NK.S > 0 &&
    data.NK.C <= 0 &&
    data.NK.S >= data.NK.D
  ) {
    result.SD = 1;
  } else if (
    // SI
    data.NK.D <= 0 &&
    data.NK.I > 0 &&
    data.NK.S > 0 &&
    data.NK.C <= 0 &&
    data.NK.S >= data.NK.I
  ) {
    result.SI = 1;
  } else if (
    // SDI
    data.NK.D > 0 &&
    data.NK.I > 0 &&
    data.NK.S > 0 &&
    data.NK.C <= 0 &&
    data.NK.S >= data.NK.D &&
    data.NK.D >= data.NK.I
  ) {
    result.SDI = 1;
  } else if (
    // SID
    data.NK.D > 0 &&
    data.NK.I > 0 &&
    data.NK.S > 0 &&
    data.NK.C <= 0 &&
    data.NK.S >= data.NK.I &&
    data.NK.I >= data.NK.D
  ) {
    result.SID = 1;
  } else if (
    // SIC
    data.NK.D <= 0 &&
    data.NK.I > 0 &&
    data.NK.S > 0 &&
    data.NK.C > 0 &&
    data.NK.S >= data.NK.I &&
    data.NK.I >= data.NK.C
  ) {
    result.SIC = 1;
  } else if (
    // SCD
    data.NK.D > 0 &&
    data.NK.I <= 0 &&
    data.NK.S > 0 &&
    data.NK.C > 0 &&
    data.NK.S >= data.NK.C &&
    data.NK.C >= data.NK.D
  ) {
    result.SCD = 1;
  } else if (
    // SCI
    data.NK.D <= 0 &&
    data.NK.I > 0 &&
    data.NK.S > 0 &&
    data.NK.C > 0 &&
    data.NK.S >= data.NK.C &&
    data.NK.C >= data.NK.I
  ) {
    result.SCI = 1;
  } else if (
    // CI
    data.NK.D <= 0 &&
    data.NK.I > 0 &&
    data.NK.S <= 0 &&
    data.NK.C > 0 &&
    data.NK.C >= data.NK.I
  ) {
    result.CI = 1;
  } else if (
    // CDI
    data.NK.D > 0 &&
    data.NK.I > 0 &&
    data.NK.S <= 0 &&
    data.NK.C > 0 &&
    data.NK.C >= data.NK.D &&
    data.NK.D >= data.NK.I
  ) {
    result.CDI = 1;
  } else if (
    // CDS
    data.NK.D > 0 &&
    data.NK.I <= 0 &&
    data.NK.S > 0 &&
    data.NK.C > 0 &&
    data.NK.C >= data.NK.D &&
    data.NK.D >= data.NK.S
  ) {
    result.CDS = 1;
  } else if (
    // CID
    data.NK.D > 0 &&
    data.NK.I > 0 &&
    data.NK.S <= 0 &&
    data.NK.C > 0 &&
    data.NK.C >= data.NK.I &&
    data.NK.I >= data.NK.D
  ) {
    result.CID = 1;
  } else if (
    // CSD
    data.NK.D > 0 &&
    data.NK.I <= 0 &&
    data.NK.S > 0 &&
    data.NK.C > 0 &&
    data.NK.C >= data.NK.S &&
    data.NK.S >= data.NK.D
  ) {
    result.CSD = 1;
  } else if (
    //IDC
    data.NK.D > 0 &&
    data.NK.I > 0 &&
    data.NK.S > 0 &&
    data.NK.C > 0 &&
    data.NK.I >= data.NK.D &&
    data.NK.D >= data.NK.C &&
    data.NK.C >= data.NK.S
  ) {
    result.IDC = 1;
  } else if (
    // IDS
    data.NK.D > 0 &&
    data.NK.I > 0 &&
    data.NK.S > 0 &&
    data.NK.C > 0 &&
    data.NK.I >= data.NK.D &&
    data.NK.D >= data.NK.S &&
    data.NK.S >= data.NK.C
  ) {
    result.IDS = 1;
  } else if (
    // ISD
    data.NK.D > 0 &&
    data.NK.I > 0 &&
    data.NK.S > 0 &&
    data.NK.C > 0 &&
    data.NK.I >= data.NK.S &&
    data.NK.S >= data.NK.D &&
    data.NK.D >= data.NK.C
  ) {
    result.ISD = 1;
  } else if (
    // SDC
    data.NK.D > 0 &&
    data.NK.I > 0 &&
    data.NK.S > 0 &&
    data.NK.C > 0 &&
    data.NK.S >= data.NK.D &&
    data.NK.D >= data.NK.C &&
    data.NK.C >= data.NK.I
  ) {
    result.SDC = 1;
  } else if (
    // DIS
    data.NK.D > 0 &&
    data.NK.I > 0 &&
    data.NK.S > 0 &&
    data.NK.C > 0 &&
    data.NK.D >= data.NK.I &&
    data.NK.I >= data.NK.S &&
    data.NK.S >= data.NK.C
  ) {
    result.DIS = 1;
  } else if (
    // CIS
    data.NK.D > 0 &&
    data.NK.I > 0 &&
    data.NK.S > 0 &&
    data.NK.C > 0 &&
    data.NK.C >= data.NK.I &&
    data.NK.I >= data.NK.S &&
    data.NK.S >= data.NK.D
  ) {
    result.CIS = 1;
  } else if (
    // CSI
    data.NK.D > 0 &&
    data.NK.I > 0 &&
    data.NK.S > 0 &&
    data.NK.C > 0 &&
    data.NK.C >= data.NK.S &&
    data.NK.S >= data.NK.I &&
    data.NK.I >= data.NK.D
  ) {
    result.CSI = 1;
  } else if (
    // ISC
    data.NK.D > 0 &&
    data.NK.I > 0 &&
    data.NK.S > 0 &&
    data.NK.C > 0 &&
    data.NK.I >= data.NK.S &&
    data.NK.S >= data.NK.C &&
    data.NK.C >= data.NK.D
  ) {
    result.ISC = 1;
  } else if (
    // DIC
    data.NK.D > 0 &&
    data.NK.I > 0 &&
    data.NK.S > 0 &&
    data.NK.C > 0 &&
    data.NK.D >= data.NK.I &&
    data.NK.I >= data.NK.C &&
    data.NK.C >= data.NK.S
  ) {
    result.DIC = 1;
  } else if (
    // DSI
    data.NK.D > 0 &&
    data.NK.I > 0 &&
    data.NK.S > 0 &&
    data.NK.C > 0 &&
    data.NK.D >= data.NK.S &&
    data.NK.S >= data.NK.I &&
    data.NK.I &&
    data.NK.C
  ) {
    result.DSI = 1;
  } else if (
    // DSC
    data.NK.D > 0 &&
    data.NK.I > 0 &&
    data.NK.S > 0 &&
    data.NK.C > 0 &&
    data.NK.D >= data.NK.S &&
    data.NK.S >= data.NK.C &&
    data.NK.C >= data.NK.I
  ) {
    result.DSC = 1;
  } else if (
    // DCI
    data.NK.D > 0 &&
    data.NK.I > 0 &&
    data.NK.S > 0 &&
    data.NK.C > 0 &&
    data.NK.D >= data.NK.C &&
    data.NK.C >= data.NK.I &&
    data.NK.I >= data.NK.S
  ) {
    result.DCI = 1;
  } else if (
    // DCS
    data.NK.D > 0 &&
    data.NK.I > 0 &&
    data.NK.S > 0 &&
    data.NK.C > 0 &&
    data.NK.D >= data.NK.C &&
    data.NK.C >= data.NK.S &&
    data.NK.S >= data.NK.I
  ) {
    result.DCS = 1;
  } else if (
    // ICD
    data.NK.D > 0 &&
    data.NK.I > 0 &&
    data.NK.S > 0 &&
    data.NK.C > 0 &&
    data.NK.I >= data.NK.C &&
    data.NK.C >= data.NK.D &&
    data.NK.D >= data.NK.S
  ) {
    result.ICD = 1;
  } else if (
    // ICS
    data.NK.D > 0 &&
    data.NK.I > 0 &&
    data.NK.S > 0 &&
    data.NK.C > 0 &&
    data.NK.I >= data.NK.C &&
    data.NK.C >= data.NK.S &&
    data.NK.S >= data.NK.D
  ) {
    result.ICS = 1;
  } else if (
    // SDI
    data.NK.D > 0 &&
    data.NK.I > 0 &&
    data.NK.S > 0 &&
    data.NK.C > 0 &&
    data.NK.S >= data.NK.D &&
    data.NK.D >= data.NK.I &&
    data.NK.I >= data.NK.C
  ) {
    result.SDI = 1;
  } else if (
    // SID
    data.NK.D > 0 &&
    data.NK.I > 0 &&
    data.NK.S > 0 &&
    data.NK.C > 0 &&
    data.NK.S >= data.NK.I &&
    data.NK.I >= data.NK.D &&
    data.NK.D >= data.NK.C
  ) {
    result.SID = 1;
  } else if (
    // SIC
    data.NK.D > 0 &&
    data.NK.I > 0 &&
    data.NK.S > 0 &&
    data.NK.C > 0 &&
    data.NK.S >= data.NK.I &&
    data.NK.I >= data.NK.C &&
    data.NK.C >= data.NK.D
  ) {
    result.SIC = 1;
  } else if (
    // SCD
    data.NK.D > 0 &&
    data.NK.I > 0 &&
    data.NK.S > 0 &&
    data.NK.C > 0 &&
    data.NK.S >= data.NK.C &&
    data.NK.C >= data.NK.D &&
    data.NK.D >= data.NK.I
  ) {
    result.SCD = 1;
  } else if (
    // SCI
    data.NK.D > 0 &&
    data.NK.I > 0 &&
    data.NK.S > 0 &&
    data.NK.C > 0 &&
    data.NK.S >= data.NK.C &&
    data.NK.C >= data.NK.I &&
    data.NK.I >= data.NK.D
  ) {
    result.SCI = 1;
  } else if (
    // CDI
    data.NK.D > 0 &&
    data.NK.I > 0 &&
    data.NK.S > 0 &&
    data.NK.C > 0 &&
    data.NK.C >= data.NK.D &&
    data.NK.D >= data.NK.I &&
    data.NK.I >= data.NK.S
  ) {
    result.CDI = 1;
  } else if (
    // CDS
    data.NK.D > 0 &&
    data.NK.I > 0 &&
    data.NK.S > 0 &&
    data.NK.C > 0 &&
    data.NK.C >= data.NK.D &&
    data.NK.D >= data.NK.S &&
    data.NK.S >= data.NK.I
  ) {
    result.CDS = 1;
  } else if (
    // CID
    data.NK.D > 0 &&
    data.NK.I > 0 &&
    data.NK.S > 0 &&
    data.NK.C > 0 &&
    data.NK.C >= data.NK.I &&
    data.NK.I >= data.NK.D &&
    data.NK.D >= data.NK.S
  ) {
    result.CID = 1;
  } else if (
    // CSD
    data.NK.D > 0 &&
    data.NK.I > 0 &&
    data.NK.S > 0 &&
    data.NK.C > 0 &&
    data.NK.C >= data.NK.S &&
    data.NK.S >= data.NK.D &&
    data.NK.D >= data.NK.I
  ) {
    result.CSD = 1;
  }
  return result;
};
