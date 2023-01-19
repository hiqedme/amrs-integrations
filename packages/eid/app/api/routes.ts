import { ResponseToolkit, ServerRoute } from "@hapi/hapi";
import ExtractVLAndPostToETL from "../services/vl_extractor";
import UploadSaveAndArchiveCSV from "../services/csv_upload";

let payload1: any = {
  payload: {
    output: "stream",
    parse: true,
    multipart: true,
    allow: "multipart/form-data",
  },
};
export const apiRoutes: ServerRoute[] = [
  {
    method: "GET",
    path: "/api/push",
    handler: async function (request, h: ResponseToolkit) {
      let convertionService= new ExtractVLAndPostToETL();
      await convertionService.readCSVAndPost();
     return "success"
    },
  },
  {
   
    method: "POST",
    path: "/uploads",
    options: payload1,
    handler: async (request: any, h) => {
     // console.log("sisi ndio tuko");
        // const { payload } = request;
        // return payload;
      const file = request.payload.file;
      //  console.log(file);
      let uploadService= new UploadSaveAndArchiveCSV();
      await uploadService.uploadFile(file);

      // You can now process the CSV file
      return "CSV Uploaded";
    },
  }
];