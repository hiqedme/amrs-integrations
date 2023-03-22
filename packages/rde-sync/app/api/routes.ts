import { ServerRoute } from "@hapi/hapi";
import PatientService from "../services/patient.service";

export const apiRoutes: ServerRoute[] = [
  {
    method: "GET",
    path: "/api/rde-sync/queue",
    handler: async function (request, h) {
      const patientService = new PatientService();

      return "";
    },
  },
];
