import { EventSubscriber, On } from "event-dispatch";
import { HTTPResponse } from "../interfaces/response";
import ADTRESTClient from "../loaders/ADT-rest-client";
import RegimenLoader from "../loaders/regimen-mapper";
import { loadProviderData } from "../models/patient";
import PrescriptionService from "../services/prescription";

@EventSubscriber()
export default class PrescriptionSubscriber {
  @On("createADTPrescription")
  public async onPrescriptionCreate({ patient, amrsCon, order, amrsCCC }: any) {
    let patients: Patient.Patient = patient[0];
    let provider: EPrescription.OrderingPhysician = await loadProviderData(
      amrsCCC,
      amrsCon
    );
    const data = new ADTRESTClient();
    const regimenLoader = new RegimenLoader();
    const regimen = regimenLoader.getRegimenCode(patients.start_regimen)[0];
    let transTime = new Date();
    let payload: EPrescription.DrugOrder = {
      mflcode: patient.mfl_code,
      patient_number_ccc: patients.patient_ccc_number.replace("-", ""),
      order_details: {
        transaction_datetime: transTime.toLocaleDateString(),
        order_number: order,
        ordering_physician: {
          first_name: provider.given_name,
          last_name: provider.family_name,
          other_name: provider.middle_name,
          prefix: provider.prefix,
        },
        notes: "",
      },
      drug_details: [],
      patient_observation_details: {
        current_weight: patients.weight,
        current_height: patients.height,
        // Add the regimen mapping

        current_regimen: regimen.toString(),
      },
    };
    console.log(payload);
    data.axios
      .post("/prescription", payload)
      .then(async (resp: HTTPResponse) => {
        console.log(resp.message);
        if (resp.code !== 200) {
          //Publish event with payload and error that occurred
        } else {
        }
      })
      .catch(
        (error: {
          response: { data: any; status: any; headers: any };
          request: any;
          message: any;
          config: any;
        }) => {
          // Error 😨
          if (error.response) {
            /*
             * The request was made and the server responded with a
             * status code that falls out of the range of 2xx
             */
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else if (error.request) {
            /*
             * The request was made but no response was received, `error.request`
             * is an instance of XMLHttpRequest in the browser and an instance
             * of http.ClientRequest in Node.js
             */
            console.log(error.request);
          } else {
            // Something happened in setting up the request and triggered an Error
            console.log("Error", error.message);
          }
          console.log(error.config);
        }
      );
  }
  @On("createAMRSOrder")
  public async onCreateAMRSOrder({ patient }: any) {
    const prescriptionService = new PrescriptionService();
    // Call AMRS orders/Encounter endpoint to create the order
    const order = "ORD-TEST";
    await prescriptionService.createPatientPrescriptionOnADT(
      patient,
      patient.mfl_code,
      order,
      patient.patient_ccc_number
    );
  }
}
