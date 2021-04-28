import { EventDispatcher } from "event-dispatch";
import ConnectionManager from "../loaders/mysql";
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
    console.log("Creating Order for patient on AMRS", amrsCCC, MFLCode);
    this.eventDispatcher.dispatch("createAMRSOrder", {
      patient,
    });
  }
  public async createPatientPrescriptionOnADT(
    patient: Patient.Patient,
    MFLCode: string,
    order: any,
    amrsCCC: string
  ) {
    const amrsCon = await CM.getConnectionAmrs();
    this.eventDispatcher.dispatch("createADTPrescription", {
      patient,
      MFLCode,
      amrsCon,
      order,
      amrsCCC,
    });
  }
}
