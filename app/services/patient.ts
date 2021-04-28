import { EventDispatcher } from "event-dispatch/EventDispatcher";
import ADTRESTClient from "../loaders/ADT-rest-client";
import ConnectionManager from "../loaders/mysql";
import { loadPatientData, loadPatientDataByID } from "../models/patient";
const CM = ConnectionManager.getInstance();

export default class PatientService {
  eventDispatcher: EventDispatcher;
  constructor() {
    this.eventDispatcher = new EventDispatcher();
  }
  public async searchADT(personId: string, MFLCode: string) {
    const patient = await this.retrievePatientCCCUsingID(personId);
    // dispatch event
    this.eventDispatcher.dispatch("search", { patient, MFLCode });
  }
  public async createPatientOnADT(patient: Patient.Patient, MFLCode: string) {
    // Dispatch create patient
    const mflcode = MFLCode;
    this.eventDispatcher.dispatch("createPatient", { patient, mflcode });
  }
  public async retrievePatientCCCUsingID(personId: string) {
    const amrsCon = await CM.getConnectionAmrs();
    let amrsPatient = await loadPatientDataByID(personId, amrsCon);
    amrsCon.destroy();
    return amrsPatient;
  }
}
