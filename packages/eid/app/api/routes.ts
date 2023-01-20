import { ResponseToolkit, ServerRoute } from "@hapi/hapi";
import ExtractVLAndPostToETL from "../services/vl_extractor";

export const apiRoutes: ServerRoute[] = [
  {
    method: "GET",
    path: "/api/push",
    handler: async function (request, h: ResponseToolkit) {
      let convertionService = new ExtractVLAndPostToETL();
      await convertionService.readCSVAndPost();
      return "success";
    },
  },
];
