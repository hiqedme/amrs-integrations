import Validators from "../helpers/validators";
import path from "path";
import * as fs from "fs";
import GetPatient from "../helpers/dbConnect";
import config from "@amrs-integrations/core";
export default class UploadSaveAndArchiveCSV {
  public async uploadFile(file: any, username: string, file_type: string) {
    let validation = new Validators();
    const fileBeingUploaded: any = validation.validateCsv(file);

    if (fileBeingUploaded.error) {
      return "Failed. Kindly re-upload " + fileBeingUploaded.error;
    }
    const uploadPath = path.join(
      path.dirname(__dirname),
      `../app/uploads/${file.hapi.filename}`
    );

    // create a payload to be saved in the database
    let uploadPayload = {
      file_name: file.hapi.filename,
      file_type: file_type,
      path_to_file: uploadPath,
      logged_user: username,
      status: "uploaded",
      voided: 0,
    };

    let eidMetaData = new GetPatient();
    // check if the file already exists
    const fileExists = await eidMetaData.checkIfFileExists(uploadPayload);

    if (fileExists.length > 0) {
      return "File already exists";
    }

    // check if file path exists
    try {
      // save the payload in the database
      await eidMetaData.postToEidFileUploadMetadata(
        uploadPayload
      );
      if (!fs.existsSync(path.dirname(uploadPath))) {
        fs.mkdirSync(path.dirname(uploadPath), {
          recursive: true,
          mode: 0o755,
        });
      }

      // upload the file
      await this.handleFileUpload(file, uploadPath);

      return "File uploaded successfully";
    } catch (error) {
      console.log(error);
    }
    return "Failed to upload file";
  }

  handleFileUpload = async (file: any, uploadPath: string) => {
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
