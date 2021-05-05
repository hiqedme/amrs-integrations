const regimentMap: regimenMapper = {
  ["3TC + NVP + AZT"]: ["AF1A", "AZT + 3TC + NVP"],
  ["3TC + EFV + AZT"]: ["AF1B", "AZT + 3TC + EFV"],
  ["3TC + NVP + TDF"]: ["AF2A", "TDF + 3TC + NVP"],
  ["3TC + EFV + TDF"]: ["AF2B ", "TDF + 3TC + EFV"],
  ["d4T + 3TC + NVP"]: ["AF3A", "d4T + 3TC + NVP"],
  ["d4T + 3TC + EFV"]: ["AF3B", "d4T + 3TC + EFV"],
  ["3TC + NVP + AZT" + 2]: ["CF1A", "AZT + 3TC + NVP"],
  ["3TC + EFV + AZT" + 2]: ["CF1B", "AZT + 3TC + EFV"],
  ["3TC + NVP + ABC"]: ["CF2A", "ABC + 3TC + NVP"],
  ["3TC + EFV + ABC"]: ["CF2B", "ABC + 3TC + EFV"],
  ["3TC + AZT + ABC"]: ["CF2C", "ABC + 3TC + AZT"],
  ["3TC + NVP + ABC" + 2]: ["AF4A", "ABC + 3TC + NVP"],
  ["3TC +TDF"]: ["PA3A", "TDF + 3TC"],
  //["3TC + EFV + AZT"]: ["PM4", "PMTCT HAART: AZT + 3TC + EFV"],
  ["NVP"]: ["PM8", "Nevirapine (NVP) Single Dose (SD) 200mg stat"],
  ["3TC + EFV + ABC" + 2]: ["AF4B", "ABC + 3TC + EFV"],
  ["3TC + NVP + TDF" + 2]: ["CF4A", "TDF + 3TC + NVP"],
  ["3TC + EFV + TDF" + 2]: ["CF4B", "TDF + 3TC + EFV"],
  ["NVP" + 2]: ["PC6", "NVP Liquid OD for 12 weeks"],
  ["3TC + AZT + DTG"]: ["AF2E", "TDF + 3TC + DTG"],
  ["3TC + ABC + DTG"]: ["AF4C", "ABC + 3TC + DTG"],
  ["3TC + TDF"]: ["PRP1B", "TDF + 3TC (PrEP)"],
  ["TDF"]: ["PRP1C", "TDF (PrEP)"],
  ["3TC + TDF" + 2]: ["HPB1A", "TDF + 3TC (HIV-ve HepB patients)"],
  ["3TC + AZT + DTG" + 2]: ["AS1C", "AZT + 3TC + DTG"],
  ["3TC + ABC + DTG" + 2]: ["AS5C", "ABC + 3TC + DTG"],
  ["3TC + ABC + RAL"]: ["CF2F", "ABC + 3TC + RAL"],
  ["3TC + TDF + DTG"]: ["PA3D", "TDF + 3TC + DTG (Adult PEP)"],
  ["3TC + ABC + RAL" + 2]: ["PC3B", "ABC + 3TC + RAL (Paed PEP)"],
  ["3TC + TDF + DTG" + 2]: ["PM12", "PMTCT HAART: TDF + 3TC + DTG"],
  ["3TC + AZT + DTG" + 2]: ["PM13", "PMTCT HAART: AZT + 3TC + DTG"],
  ["3TC + ABC + DTG" + 2]: ["PM14", "PMTCT HAART: ABC + 3TC + DTG"],
  ["3TC + EFV + ABC" + 2]: ["PM15", "PMTCT HAART: ABC + 3TC + EFV"],
  ["3TC + TDF + DTG" + 2]: ["CF4E", "TDF + 3TC + DTG"],
};

export default class RegimenLoader {
  getRegimenCode(regimen: string) {
    console.log("REturned Regimen", regimentMap[regimen]);
    return regimentMap[regimen];
  }
}
export type regimenMapper = {
  [key: string]: Array<String>;
};
