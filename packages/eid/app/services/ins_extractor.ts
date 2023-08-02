import Validators from "../helpers/validators";
import GetPatient from "../helpers/dbConnect";
import Helpers from "../helpers/helperFunctions";
import moment, { now } from "moment";
import config from "@amrs-integrations/core";
import { logToFile } from "../helpers/logger";

export default class ExtractINSAndPostToETL {
  public async readINSAndPost(request: any) {
    let response: any = {};
    try {
      let ResultData: any = [];
      const getPatient = new GetPatient();
      const helper = new Helpers();
      const filename = "logs.log";
      const validator = new Validators();

      let alreadySynced: number = 0;
      let successfulSync: number = 0;
      let failed: number = 0;
      let total: number = 0;
      let uuid: any = "";

      // Determine if the file is a CD4 or viral load file

      // Replace spaces in headers with underscore
     
      let data: any = request; //JSON.parse(request);
      

      let patientCCCNo = data.patient;
      let external_id = data.id;
      let value = data.result;
      let collectionDate = data.date_collected;
      let order = data.order_number ? data.order_number : "";
      // Check if the patient CCC number is valid

      const isValidCCC = validator.checkIdentifierIsCCC(patientCCCNo);

      // get the patient uuid from db
      const patientID = await getPatient.getPatientUUIDUsingIdentifier(
        patientCCCNo,
        isValidCCC
      );
      if (patientID.length == 0) {
        failed++;
        logToFile(
          filename,
          "error",
          `${patientCCCNo}': No record for this patient'`
        );
        response = JSON.stringify({
          id: external_id,
          timestamp: now(),
          status: "failed",
        });

        return response;
      }
      uuid = patientID[0].uuid;
      // check if viral load value is valid
      let valid: any = validator.checkStatusOfViralLoad(value);
      if (valid === 2) {
        failed++;
        logToFile(
          filename,
          "error",
          `${patientCCCNo}': Record has erroneous viral load value: ' ${value}`
        );
        response = JSON.stringify({
          id: external_id,
          timestamp: now(),
          status: "failed",
        });

        return response;
      }
      let viralValue = valid == 1 ? value : 0;
      let collection_date = moment
        .utc(collectionDate, "YYYY-MM-DD")
        .add(3, "hours")
        .format("YYYY-MM-DD 00:00:00");

      // check if data is already synced
      const isDataSynced = await getPatient.checkPatientVLSync(
        collection_date,
        viralValue,
        uuid
      );
      if (isDataSynced[0].count > 0) {
        alreadySynced++;
        logToFile(filename, "info", `${patientCCCNo}': Record already exists'`);
        response = JSON.stringify({
          id: external_id,
          timestamp: now(),
          status: "synced",
        });
      } else {
        let obs: EIDPayloads.Observation = {
          person: uuid,
          concept: "a8982474-1350-11df-a1f1-0026b9348838",
          obsDatetime: collection_date,
          value: valid == 1 ? value : 0,
          order: order,
        };

        ResultData.push(obs);
        let httpClient = new config.HTTPInterceptor(
          config.dhp.url || "http://10.50.80.56:5001/eid/csv",
          // "http://10.50.80.56:5001/staging/eid/csv",
          "",
          "",
          "dhp",
          ""
        );

        httpClient.axios
          .post("", obs)
          .then(async (openHIMResp: any) => {
            successfulSync++;
            console.log("VL saved successfully", openHIMResp.identifier);
            response = JSON.stringify({
              id: external_id,
              timestamp: now(),
              status: "success",
            });
          })
          .catch(async (err: any) => {
            console.log("Error syncing:", err);
            failed++;
            logToFile(
              filename,
              "error",
              `${patientCCCNo}': Error syncing VL '`
            );
            response = JSON.stringify({
              id: external_id,
              timestamp: now(),
              status: "failed",
            });
          });
      }
    } catch (err) {
      console.log(err);
      response = JSON.stringify({
        id: null,
        timestamp: now(),
        status: "failed",
      });

      return response;
    }
    return response;
  }
}
