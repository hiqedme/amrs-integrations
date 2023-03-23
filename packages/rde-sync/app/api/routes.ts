import { ServerRoute } from "@hapi/hapi";
import PatientService, { RequestParams } from "../services/patient.service";

export const apiRoutes: ServerRoute[] = [
  {
    method: "POST",
    path: "/api/rde-sync/queue",
    handler: async function (request, h) {
      const patientService = new PatientService();

      await patientService.queueRDEPatients(
        request.payload as RequestParams,
        h
      );
      return "success";
    },
  },
];
