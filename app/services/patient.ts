import ADTRESTClient from "../loaders/ADT-rest-client";
import ConnectionManager from "../loaders/mysql";
import { loadPatientData, loadPatientDataByID } from "../models/patient";
const CM = ConnectionManager.getInstance();

export default class PatientService {
  constructor() {}

  public async searchADT(personId: string, MFLCode: string) {
    const data = new ADTRESTClient();
    const patient = await this.retrievePatientCCCUsingID(personId);
    data.axios
      .get("/patients/" + patient.patient_number_ccc, {
        params: {
          mflcode: MFLCode,
          identifier: "ccc",
          ccc: patient,
        },
      })
      .then(async (resp: any) => {
        let result: Patient.IPatient[] = resp;
        if (result[0]?.patient_number_ccc) {
          await this.createPatientPrescriptionOnADT(result[0]);
        } else {
          await this.createPatientOnADT(patient);
        }
      });
  }
  public async createPatientOnADT(patient: Patient.IPatient) {
    // Prepare patient ADT payload
    console.log("Creating Patient payload for adt", patient);
  }
  public async createPatientPrescriptionOnADT(patient: Patient.IPatient) {
    console.log("Creating Prescription for patient", patient);
  }

  public async retrievePatientCCCUsingID(personId: string) {
    const amrsCon = await CM.getConnectionAmrs();
    let amrsPatient = await loadPatientDataByID(personId, amrsCon);
    amrsCon.destroy();
    return amrsPatient;
  }
}
