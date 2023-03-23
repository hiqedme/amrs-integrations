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
  {
    method: "DELETE",
    path: "/api/rde-sync/patient/{id}&purge=true",
    handler: async function (request, h) {
      const id = request.params.id;

      const patientService = new PatientService();
      await patientService.deletePatientRecord(id, h);

      return "deleted";
    },
  },
];
