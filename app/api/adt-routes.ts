import { ResponseToolkit, ServerRoute } from "@hapi/hapi";
import { HTTPResponse } from "../interfaces/response";
import PatientService from "../services/patient";
export const adtRoutes: ServerRoute[] = [
  {
    method: "POST",
    path: "/api/prescription",
    handler: function (request, h: ResponseToolkit) {
      // Receive ADT request and Save in drug orders table
      const payload = request.payload;
      console.log("payload", payload);
      let responseMessage: HTTPResponse = {
        code: 200,
        message: "Dispense information received successfully.",
      };
      let response = h.response(responseMessage);
      response.header("Content-Type", "application/json");
      return response;
    },
  },
  {
    method: "GET",
    path: "/api/sync-prescription",
    handler: function (request, h: ResponseToolkit) {
      // Receive ADT request and Save in drug orders table
      const adt = new PatientService();
      //Test person id and test location mfl code.
      adt.searchADT("902630", "1235");
    },
  },
];
