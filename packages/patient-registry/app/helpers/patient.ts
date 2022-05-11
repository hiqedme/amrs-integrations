import config from "@amrs-integrations/core";

export async function getPatientIdentifiers(patientUUID: string) {
  let httpClient = new config.HTTPInterceptor(
    config.amrsUrl || "",
    config.amrsUsername || "",
    config.amrsPassword || "",
    "amrs"
  );
  let identifiers = await httpClient.axios(
    "/ws/rest/v1/patient/" + patientUUID + "/identifier",
    {
      method: "get",
    }
  );

  return identifiers;
}

export async function saveUpiIdentifier(
  upi: string,
  patientUuid: string,
  locationUuid: string
) {
  console.log("saving", patientUuid,locationUuid)
  const payload = {
    identifier: upi,
    identifierType: "8939786b-414b-4dc3-ab3e-74131a1f805d",
    location: locationUuid,
    preferred: false,
  };

  let httpClient = new config.HTTPInterceptor(
    config.amrsUrl || "",
    config.amrsUsername || "",
    config.amrsPassword || "",
    "amrs"
  );
  return await httpClient.axios.post(
    "/ws/rest/v1/patient/" + patientUuid + "/identifier",
    payload
  )
}
