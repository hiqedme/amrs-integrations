import { ResponseToolkit, ServerRoute } from "@hapi/hapi";
import ExtractVLAndPostToETL from "../services/vl_extractor";
import ExtractCD4AndPostToETL from "../services/cd4_extractor";
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
    path: "/api/push/viral_load",
    // extract viral load and send to POC
    handler: async function (request, h: ResponseToolkit) {
      let convertionService = new ExtractVLAndPostToETL();
      await convertionService.readCSVAndPost();
      return "success";
    },
  },

  {
    method: "GET",
    path: "/api/push/cd4_count",
    // extract CD4 count and send to POC
    handler: async function (request, h: ResponseToolkit) {
      let convertionService = new ExtractCD4AndPostToETL();
      await convertionService.readCSVAndPost();
      return "success";
    },
  },
  {
    method: "POST",
    path: "/api/csv/uploads",
    options: payload1,
    // upload CSV load
    handler: async (request: any, h) => {
      // const file = request.payload.file;
      const {username, file_type, file} = request.payload;

      // validate file
      if(!username || !file_type || !file) {
        return {response: "Failed. Kindly re-upload. Required parameters are missing"};
      }

      let uploadService = new UploadSaveAndArchiveCSV();
      const res = await uploadService.uploadFile(file, username, file_type);
      return res;
    },
  },
];
