import { Server } from "@hapi/hapi";

import Validators from "../helpers/validators";
import path from "path";
import * as fs from "fs";
import { Stream } from "stream";
export default class UploadSaveAndArchiveCSV {
  public async uploadFile(file: any) {
    // console.log(file);
    const uploadPath = path.join(
      path.dirname(__dirname),
      "../app/uploads/file_csv.csv"
    );
    const response = this.handleFileUpload(file, uploadPath);
    //return response;
    let validation = new Validators();
    const initval: any = validation.validateCsv(file);
    // console.log(initval);
    if (initval.error) {
      return "Failed. Kindly re-upload " + initval.error;
    }
    const colval: any = validation.validateColumns(uploadPath, [
      "Patient CCC No",
      "Collection Date",
      "Viral Load",
    ]);
    //console.log(colval);
    if (colval.error) {
      return "Failed. Kindly re-upload " + colval.error;
    }
  }
  handleFileUpload = (file: any, uploadPath: string) => {
    const options = { headers: true, quoteColumns: true };
    const stream = fs.createWriteStream(uploadPath);
    file.pipe(stream);
    console.log(uploadPath);
    return new Promise((resolve, reject) => {
      stream
        .on("error", (err) => console.error(err))
        .on("error", (err) => console.log("couldn't upload"))
        .on("finish", () => resolve({ message: "Upload successfully!" }));
    });
  };
}
