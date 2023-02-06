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
}
