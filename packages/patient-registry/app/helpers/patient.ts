import config from "@amrs-integrations/core";
export async function getPatientIdentifiers(patientUUID:string) {
    let httpClient = new config.HTTPInterceptor(config.amrsUrl || "", config.amrsUsername || "",config.amrsPassword || "","amrs");
    let identifiers = await httpClient.axios(
        "/ws/rest/v1/patient/"+patientUUID+"/identifier",
        {
          method: "get"
        }
      );
       
      return identifiers;
}