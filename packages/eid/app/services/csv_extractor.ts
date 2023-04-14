import path from "path";
import fs from "fs";
import csv from "csv-parser";
import Validators from "../helpers/validators";
import GetPatient from "../helpers/dbConnect";
import Helpers from "../helpers/helperFunctions";
import moment from "moment";
import axios from "axios";
import { ResponseToolkit } from "@hapi/hapi";

export default class ExtractCSVAndPostToETL {
  public async readCSVAndPost(fileName: string) {
    try {
      const filePath = path.join(__dirname, `../uploads${fileName}`);
      const fileContents = fs.readFileSync(filePath, "utf-8");

      // Determine if the file is a CD4 or viral load file
      const isViralLoadFile = fileContents.includes("Lab Viral Load");
      const isCD4File = fileContents.includes("CD4 abs");
      const getPatient = new GetPatient();
      const helper = new Helpers();

      let alreadySynced = 0;
      let successfulSync = 0;
      let failed = 0;

      const rows: any = await new Promise(async (resolve, reject) => {
        if (isViralLoadFile) {
          // File is a viral load file, extract columns accordingly
          const results: any = [];
          fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", async (row) => {
              let {
                "Lab Viral Load": value,
                "Collection Date": collectionDate,
                "Patient CCC No": patientCCCNo,
                "Lab ID": order,
              } = row;
              // Check if any of the extracted columns are empty
              if (!value || !collectionDate || !patientCCCNo || !order) {
                throw new Error("One or more extracted columns are empty");
              }
              // Check if the patient CCC number is valid
              // const validator = new Validators();
              // const isValidCCC = validator.checkIdentifierIsCCC(patientCCCNo);
              let patientUUID: any = "";

              // // get the patient uuid from db
              // const getPatientUUID = await getPatient.getPatientUUIDUsingIdentifier(
              //   patientCCCNo,
              //   isValidCCC
              // );
              // use axios to get patient uuid
              async function getPatientUUID(ccc: any) {
                try {
                  const response = await axios.get(
                    "http://localhost:7777/get-patient-uuid",
                    {
                      params: {
                        ccc_number: ccc,
                      },
                    }
                  );
                  return response.data;
                } catch (error) {
                  console.error("Error:", error);
                }
              }

              // Call the getPatientUUID function
              const response = await getPatientUUID(patientCCCNo);

              if (response.length > 0) {
                patientUUID = response[0].patient_uuid;
                // console.log('patientUUID', patientUUID)
                // check if data is already synced
                const isDataSynced = await axios
                  .get("http://localhost:7777/checkPatientHivViralLoad", {
                    params: {
                      hiv_viral_load: value,
                    },
                  })
                  .then((response) => {
                    return response.data;
                  })
                  .catch((error) => {
                    console.error("Error: data not synced");
                  });

                if (isDataSynced[0].count > 0) {
                  alreadySynced++;
                  // update the sync status in db
                  // create a param object
                  const filename = fileName.split("/").pop();
                  const params = {
                    file_name: filename,
                    existing_records: alreadySynced,
                    status: "Error",
                  };
                  const updateSyncStatus = await getPatient.updateExistingData(
                    params
                  );
                  if (updateSyncStatus.affectedRows > 0) {
                    console.log("sync status updated");
                  }
                  // log the synced rows
                  let logMessage =
                    "Patient: " + patientCCCNo + " already synced.";
                  helper.logError(logMessage, "syncErroLog.log");
                  return;
                }
                // proceed to sync
                let collection_date = moment
                  .utc(collectionDate, "DD/MM/YYYY")
                  .add(3, "hours")
                  .format();
                let obs: EIDPayloads.Observation = {
                  person: patientUUID,
                  concept: "a8982474-1350-11df-a1f1-0026b9348838",
                  obsDatetime: collection_date,
                  value: value,
                  order: order,
                };

                async function postToMockServer(obj: any) {
                  try {
                    const response = await axios.post(
                      "http://localhost:7777/mock-server",
                      {
                        obj,
                      }
                    );
                    return response.data;
                  } catch (error) {
                    console.log("error posting to mock server");
                  }
                }
                const res = await postToMockServer(obs);
                console.log(res);
                if (res.status === 200) {
                  successfulSync++;
                  // update the sync status in db
                  // create a param object
                  const filename = fileName.split("/").pop();

                  const params = {
                    file_name: filename,
                    successful: successfulSync,
                    status: "synced",
                  };
                  const updateSyncStatus = await getPatient.updateEidCsvMetaData(
                    params
                  );

                  if (updateSyncStatus.affectedRows > 0) {
                    // console.log('sync status updated')
                    console.log(res.message);
                  }
                }
              } else {
                failed++;
                // update the sync status in db
                // create a param object
                const filename = fileName.split("/").pop();
                const params = {
                  file_name: filename,
                  failed_records: failed,
                  status: "Error",
                };
                const updateSyncStatus = await getPatient.updateFailedData(
                  params
                );
                if (updateSyncStatus.affectedRows > 0) {
                  // console.log('failed sync status updated')
                  return { message: `failed to sync ${failed} rows` };
                }
              }
              // check if data is already synced
              // const isDataSynced = await getPatient.checkPatientVLSync(
              //   row,
              //   patientUUID
              // );
            })
            .on("end", () => {
              resolve(results);
            });
        } else if (isCD4File) {
          // File is a CD4 file, extract columns accordingly
          const results: any = [];
          fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", async (row) => {
              let {
                "CD4 abs": value,
                "Date Collected/Drawn": collectionDate,
                "Ampath #": patientCCCNo,
                "Provider ID": order,
              } = row;
              // Check if any of the extracted columns are empty
              if (!value || !collectionDate || !patientCCCNo || !order) {
                throw new Error("One or more extracted columns are empty");
              }
              // Check if the patient CCC number is valid
              // const validator = new Validators();
              // const isValidCCC = validator.checkIdentifierIsCCC(patientCCCNo);
              let patientUUID: any = "";
              // get the patient uuid from db
              // const patientOtherIdentifier = await getPatient.getPatientUUIDUsingIdentifier(
              //   patientCCCNo,
              //   isValidCCC
              // );
              // use axios to get patient uuid
              async function getPatientUUID(ccc: any) {
                try {
                  const response = await axios.get(
                    "http://localhost:7777/get-patient-uuid",
                    {
                      params: {
                        ccc_number: ccc,
                      },
                    }
                  );
                  return response.data;
                } catch (error) {
                  console.error("Error:", error);
                }
              }

              // Call the getPatientUUID function
              const response = await getPatientUUID(patientCCCNo);
              if (response.length > 0) {
                patientUUID = response[0].patient_uuid;
                // console.log('patientUUID', patientUUID)
                // check if data is already synced
                const isDataSynced = await axios
                  .get("http://localhost:7777/checkPatientCd4Count", {
                    params: {
                      cd4_count: value,
                    },
                  })
                  .then((response) => {
                    return response.data;
                  })
                  .catch((error) => {
                    console.error("Error:", error);
                  });

                if (isDataSynced[0].count > 0) {
                  alreadySynced++;
                  // update the sync status in db
                  // create a param object
                  const filename = fileName.split("/").pop();
                  const params = {
                    file_name: filename,
                    existing_records: alreadySynced,
                    status: "Error",
                  };
                  const updateSyncStatus = await getPatient.updateExistingData(
                    params
                  );
                  if (updateSyncStatus.affectedRows > 0) {
                    console.log("sync status updated");
                  }
                  // log the synced rows
                  let logMessage =
                    "Patient: " + patientCCCNo + " already synced.";
                  helper.logError(logMessage, "syncErroLog.log");
                  return;
                }
                // proceed to sync
                let obs: EIDPayloads.Observation = {
                  person: patientUUID,
                  concept: "a8982474-1350-11df-a1f1-0026b9348838",
                  obsDatetime: collectionDate,
                  value: value,
                  order: order,
                };

                async function postToMockServer(obj: any) {
                  try {
                    const response = await axios.post(
                      "http://localhost:7777/mock-server",
                      {
                        obj,
                      }
                    );
                    return response.data;
                  } catch (error) {
                    console.log("error posting to mock server");
                  }
                }
                const res = await postToMockServer(obs);
                if (res?.status === 200) {
                  successfulSync++;
                  // update the sync status in db
                  // create a param object
                  const filename = fileName.split("/").pop();

                  const params = {
                    file_name: filename,
                    successful: successfulSync,
                    status: "synced",
                  };
                  const updateSyncStatus = await getPatient.updateEidCsvMetaData(
                    params
                  );

                  if (updateSyncStatus.affectedRows > 0) {
                    // console.log('sync status updated')
                    console.log(res.message);
                  }
                }
              } else {
                failed++;
                // update the sync status in db
                // create a param object
                const filename = fileName.split("/").pop();
                const params = {
                  file_name: filename,
                  failed_records: failed,
                  status: "Error",
                };
                const updateSyncStatus = await getPatient.updateFailedData(
                  params
                );
                if (updateSyncStatus.affectedRows > 0) {
                  // console.log('failed sync status updated')
                  return { message: `failed to sync ${failed} rows` };
                }
              }
            })
            .on("end", () => {
              // if (results.length === 0) {
              //   throw new Error("No data extracted from the CSV file");
              // }
              resolve(results);
            });
        } else {
          // File is neither a CD4 nor a viral load file
          return reject("File is neither a CD4 nor a viral load file");
        }
      });

      return {
        message: "CSV file successfully processed",
        syncedRows: rows,
      };
    } catch (error) {
      console.log("Error:", error);
        // throw new Error("Failed to process CSV file");
      return {
        message: "Failed to process CSV file",
      };
    }
  }
}
