import Validators from "../helpers/validators";
import path from "path";
import * as fs from "fs";
export default class UploadSaveAndArchiveCSV {
  public async uploadFile(file: any) {

    let validation = new Validators();
    const fileBeingUploaded: any = validation.validateCsv(file);

    if (fileBeingUploaded.error) {
      return "Failed. Kindly re-upload " + fileBeingUploaded.error;
    }
    const uploadPath = path.join(
      path.dirname(__dirname),
      `../app/uploads/${file.hapi.filename}`
    );
    const response = await this.handleFileUpload(file, uploadPath);
    return response

  }


  handleFileUpload =  async (file: any, uploadPath: string) => {
    // const options = { headers: true, quoteColumns: true };
    const stream = fs.createWriteStream(uploadPath);
    file.pipe(stream);


    return new Promise((resolve, reject) => {
      stream
        .on("error", (err) => console.error(err))
        .on("finish", () => resolve({ message: "Upload successfully!" }));
    });
  };
}
