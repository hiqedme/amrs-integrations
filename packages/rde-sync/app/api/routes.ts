import { ResponseToolkit, ServerRoute } from "@hapi/hapi";
import PatientService from "../services/patient.service";

export const apiRoutes: ServerRoute[] = [
  {
    method: "GET",
    path: "/api/rde-sync/hello",
    handler: async function (request, h: ResponseToolkit) {
      const patientService = new PatientService();
      return await patientService.sayHello();
    },
  },
];
