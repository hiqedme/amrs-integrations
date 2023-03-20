import Validators from "../helpers/validators";
import path from "path";
import * as fs from "fs";
export default class UploadSaveAndArchiveCSV {
  public async uploadFile(file: any) {
    const uploadPath = path.join(
      path.dirname(__dirname),
      "../app/uploads/file_csv.csv"
    );
    
    const response = await this.handleFileUpload(file, uploadPath);

    if(response=="Upload Successful"){
      let validation = new Validators();
      const initval: any = validation.validateCsv(file);
  
      if (initval.error) {
        return "Failed. Kindly re-upload " + initval.error;
      }
      const colval: any = validation.validateColumns(uploadPath, [
        "Patient CCC No",
        "Collection Date",
        "Viral Load",
      ]);
  
      if (colval.error) {
        return "Failed. Kindly re-upload " + colval.error;
      }
     }
    return response;
   
  }
  handleFileUpload = async (file: any, uploadPath: string) => {
    const options = { headers: true, quoteColumns: true };
    const stream = fs.createWriteStream(uploadPath);
    file.pipe(stream);

    return new Promise((resolve, reject) => {
      stream
        .on("error", (err) => console.error(err))
        .on("finish", () => resolve({ message: "Upload Successful" }));
    });
  };
}
