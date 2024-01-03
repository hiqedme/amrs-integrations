import _ from "lodash";

// import * as fast_csv from "fast-csv";
import * as fs from "fs";
import * as Papa from "papaparse";
export default class Helpers {
  // log errors
  logError(Error: any, fileName: string) {
    const logMessage = `[${new Date().toISOString()}] ${Error}\n`;
    fs.appendFile(fileName, logMessage, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }

  // remove all the white spaces
  removeWhiteSpace(param: string) {
    var whiteSpaceVar;
    if (param === "" || param === null) {
      whiteSpaceVar = "";
    } else {
      whiteSpaceVar = param.replace(/\s+/g, "");
    }
    return whiteSpaceVar;
  }
  //split to CCC number
  splitToCCC(patient_no: string) {
    var newCCC;
    if ((patient_no.length != 10)||(patient_no.charAt(4) === "-")) {
      newCCC = patient_no;
      return newCCC;
    }
    const inputString = patient_no; // Your 10-character string
    const part1 = inputString.slice(0, 5);
    const part2 = inputString.slice(5, 10);
    newCCC = `${part1}-${part2}`;
    return newCCC;
  }
}
