import { Connection } from "mysql";
import ConnectionManager from "../loaders/mysql";
const CM = ConnectionManager.getInstance();
export async function loadPatientDataByID(
  personId: string,
  connection: Connection
) {
  const personCCC = await fetchPersonCCCByID(personId, connection);
  console.log("ccc");
  return await loadPatientData(personCCC[0].patient_ccc_number, connection);
}

export async function fetchPersonCCCByID(personId: any, connection: any) {
  //Return static cc for testing.
  const sql = `select patient_ccc_number from etl.flat_adt_patient where person_id='${personId}'`;
  let result: any = await CM.query(sql, connection);
  return result;
}
export async function loadPatientData(personCCC: string, connection: any) {
  const sql = `select * from etl.flat_adt_patient where patient_ccc_number='${personCCC}'`;
  let result: Patient.IPatient = await CM.query(sql, connection);
  return result;
}
