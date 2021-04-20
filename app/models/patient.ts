import { Connection } from "mysql";
import ConnectionManager from "../loaders/mysql";
const CM = ConnectionManager.getInstance();
export async function loadPatientDataByID(
  personId: string,
  connection: Connection
) {
  const personCCC = await fetchPersonCCCByID(personId, connection);
  console.log("ccc", personCCC);
  return await loadPatientData(personCCC, connection);
}

export async function fetchPersonCCCByID(patientCCC: any, connection: any) {
  //Return static cc for testing.

  return "25478-55561";
}
export async function loadPatientData(personCCC: string, connection: any) {
  const sql = `select * from etl.flat_adt_patient where patient_ccc_number='${personCCC}'`;
  console.log("Here is the result", sql);
  let result: Patient.IPatient = await CM.query(sql, connection);
  return result;
}
