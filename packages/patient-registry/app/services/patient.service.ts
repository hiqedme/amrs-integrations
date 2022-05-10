import  config  from "@amrs-integrations/core";
import getAccessToken from "../helpers/auth";
import { saveUpiIdentifier, getPatientIdentifiers } from "../helpers/patient";
import { getPatient, getFacilityMfl } from "../models/queries";

export default class PatientService {
  public async searchPatient(params: any) {
    /** TODO: search patient in registry */
    let accessToken = await getAccessToken();
    let httpClient = new config.HTTPInterceptor(config.dhp.url || "","","","dhp",accessToken.access_token)
    let identifiers = getPatientIdentifiers(params.patientUuid)
    // TODO: Retrieve ID from identifiers

    let dhpResponse:PatientPayload.ClientObject= await httpClient.axios("/search/identification-number/2345678", {method:"get"})
    console.log("DHP", dhpResponse.client.clientNumber)
  

    /** If patient found, saveUpiNumber to amrs */
    if (dhpResponse.clientExists) {
      let savedUpi = await this.saveUpiNumber(
        dhpResponse.client.clientNumber,
        params.patientUuid, params.locationUuid
      );
      console.log("Saved UPI ", savedUpi.identifier);
      return savedUpi;
      
    }

    /** Patient not found: Construct payload */
    let res = await this.constructPayload(
      params.patientUuid,
      params.locationUuid
    );

    /** TODO: Post to registry */

    /** TODO: Call saveUpiNumber to save the UPI */

    /** TODO: Incase of error queue patient in Redis */

    return res;
  }

  private async constructPayload(patientUuid: string, locationUuid: string) {
    let res: PatientPayload.Patient = await getPatient(patientUuid);
    let mflCode = await getFacilityMfl(locationUuid);
    let identifiers: PatientPayload.PatientIdentifier[] = await getPatientIdentifiers(
      patientUuid
    );
    console.log("Fetched patient ", res.firstName, "Facility mfl ", mflCode);
    return identifiers;
  }

  private async saveUpiNumber(upi: string, patientUuid: string, locationUuid: string) {
    const result = await saveUpiIdentifier(upi, patientUuid, locationUuid);
    return result;
  }
}
