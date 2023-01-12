import * as Papa from "papaparse";
import * as Fs from "fs";
import GetPatient from "../helpers/getPatientUUID";
import config from "@amrs-integrations/core";
import Validators from "../helpers/validators";
import moment from "moment";
import path from "path";
export default class ExtractVLAndPostToETL {
  public async readCSVAndPost() {
    try {
      const file = Fs.readFileSync(path.join(path.dirname(__dirname), '../app/uploads/file.csv'),
        "utf-8"
      );
      // Replace spaces in headers with underscores

      const options = {
        header: true,
        transformHeader: (header: string) =>
          header.replace(/\s+/g, "_").toLowerCase(),
      };
      const rows = Papa.parse(file, options).data;
      let ResultData: any = [];
      // Iterate through rows and make POST request
      for (let row of rows) {
        // Get patient UUID using identifier
        let data: any = row;
        let getPatient = new GetPatient();
        let patientUUID: any = await getPatient.getPatientUUIDUsingIdentifier(
          data.patient_ccc_no
        );
        if (patientUUID.length > 0) {
          let validator = new Validators();
          let valid = validator.checkStatusOfViralLoad(data.lab_viral_load);
          if (valid === 0 || valid === 1) {
            data.viral_load = 0;
            let collection_date=moment.utc(data.collection_date,"DD/MM/YYYY").add(3, 'hours').format();
            let obs: EIDPayloads.Observation = {
              person: patientUUID[0].uuid,
              concept: "a8982474-1350-11df-a1f1-0026b9348838",
              obsDatetime: collection_date,
              value: valid = 1 ? data.viral_load : 0,
            };
            ResultData.push(obs);
            let httpClient = new config.HTTPInterceptor(
              config.dhp.url || "http://10.50.80.56:5001/eid/csv",
              "",
              "",
              "dhp",
              ""
            );

            httpClient.axios
              .post("", obs)
              .then(async (openHIMResp: any) => {
                console.log(
                  "VL saved successfully",
                  openHIMResp.identifier
                );
              })
              .catch((err: any) => {
                console.log("Error", err);
              });
          } else {
            console.log(data.lab_viral_load);
          }
        }
      }

      console.log(ResultData);
      return ResultData;
    } catch (err) {
      console.log(err);
    }
  }
}
