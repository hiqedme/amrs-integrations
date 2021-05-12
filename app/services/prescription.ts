import { EventDispatcher } from "event-dispatch";
import ConnectionManager from "../loaders/mysql";
import { fetchEncounterUUID } from "../models/patient";
const CM = ConnectionManager.getInstance();

export default class PrescriptionService {
  eventDispatcher: EventDispatcher;
  constructor() {
    this.eventDispatcher = new EventDispatcher();
  }
  public async createAMRSOrder(
    patient: Patient.Patient,
    MFLCode: string,
    amrsCCC: string
  ) {
    patient.mfl_code = MFLCode;
    patient.patient_ccc_number = amrsCCC;
    const amrsCon = await CM.getConnectionAmrs();
    const encounter = await fetchEncounterUUID(amrsCCC, amrsCon);
    console.log("Creating Order for patient on AMRS", amrsCCC, MFLCode);
    this.eventDispatcher.dispatch("createAMRSOrder", {
      patient,
      encounter,
    });
  }
  public async createPatientPrescriptionOnADT(
    patient: Patient.Patient,
    MFLCode: string,
    order: any,
    amrsCCC: string,
    orderUUID: string
  ) {
    const amrsCon = await CM.getConnectionAmrs();
    this.eventDispatcher.dispatch("createADTPrescription", {
      patient,
      MFLCode,
      amrsCon,
      order,
      amrsCCC,
      orderUUID,
    });
  }
}
