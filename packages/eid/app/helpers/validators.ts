import _ from "lodash";

// import * as fast_csv from "fast-csv";
import * as fs from "fs";
import * as Papa from "papaparse";

export default class Validators {
  checkStatusOfViralLoad(viralLoadPayload: string) {
    var status = 0;
    var hasNumbersOnly = /^[0-9]*(?:\.\d{1,2})?$/;
    var hasLessThanSymbol = /</g;



export default class Validators {
  checkStatusOfViralLoad(viralLoadPayload: string) {
    let status = 0;
    const hasNumbersOnly = /^[0-9]*(?:\.\d{1,2})?$/;
    const hasLessThanSymbol = /</g;


    if (_.isEmpty(viralLoadPayload)) return -1;
    var viralLoadResult = this.removeWhiteSpace(viralLoadPayload);

    if (_.isEmpty(viralLoadResult)) {
      return -1;
    }

    if (hasNumbersOnly.test(viralLoadResult)) {
      status = 1;
    } else if (
      hasLessThanSymbol.test(viralLoadResult) ||
      viralLoadPayload.trim() === "Target Not Detected"
    ) {
      status = 0;
    } else {
      status = 2;
    }
    return status;
  }
  removeWhiteSpace(param: string) {
    var whitePaceVar;
    if (param === "" || param === null) {
      whitePaceVar = "";
    } else {
      whitePaceVar = param.replace(/\s+/g, "");
    }
    return whitePaceVar;

  }

  validateCsv(file: any) {
    // console.log(file.mimetype, file.hapi.headers['content-type']);
    if (file.hapi.headers["content-type"] !== "text/csv") {
      return { error: "Invalid file type. Only CSV files are allowed" };
    }
    if (file.size > 10000) {
      //10MB
      return { error: "File size too large" };
    }
    // const validatecols = this.validateColumns(file,['Worksheet'])

    return true;
  }
  validateColumns(filePath: fs.PathLike, expectedColumns: any) {
   // console.log(expectedColumns);
    const file = fs.readFileSync(filePath, "utf-8");

    return new Promise<void>((resolve, reject) => {
      //let headers: string | any[];
      const headers = Papa.parse(file, {
        header: true,
      }).meta.fields;
      //console.log(headers);
      let missingColumns = _.difference(expectedColumns, headers || []);
      if (missingColumns.length > 0) {
        reject(
          `The following columns are missing: ${missingColumns.join(", ")}`
        );
      } else {
       // console.log("all columns present");
        resolve();
      }

      // .on('error', reject);
    });
  }

}
