import { ResponseToolkit, ServerRoute } from "@hapi/hapi";
import { HTTPResponse } from "../interfaces/response";
import ConnectionManager from "../loaders/mysql";
import { loadPatientQueue } from "../models/patient";
import { savePrescription } from "../models/prescription";
import PatientService from "../services/patient";
export const adtRoutes: ServerRoute[] = [
  {
    method: "POST",
    path: "/api/prescription",
    handler: async function (request, h: ResponseToolkit) {
      // Receive ADT request and Save in drug orders table
      const payload = request.payload as IADTDispense.ADTDispense;
      console.log(payload.drug_details);
      const CM = ConnectionManager.getInstance();
      const amrsCon = await CM.getConnectionAmrs();
      savePrescription(payload, amrsCon);
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
    handler: async function (request, h: ResponseToolkit) {
      // Receive ADT request and Save in drug orders table
      const adt = new PatientService();
      // Test person id and test location mfl code.
      const a = await adt.searchADT();
      let response = h.response(a);
      response.header("Content-Type", "application/json");
      return response;
    },
  },
];
