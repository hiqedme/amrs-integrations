import { Connection } from "mysql";
import ConnectionManager from "../loaders/mysql";
const CM = ConnectionManager.getInstance();
export async function loadPatientDataByID(
  personId: string,
  connection: Connection
) {
  const personCCC = await fetchPersonCCCByID(personId, connection);

  return await loadPatientData(personCCC.patient_ccc_number, connection);
}

export async function fetchPersonCCCByID(personId: any, connection: any) {
  //Return static cc for testing.
  const sql = `select patient_ccc_number from etl.flat_adt_patient where person_id='${personId}'`;
  let result: any = await CM.query(sql, connection);
  return result[0];
}
export async function loadPatientData(personCCC: string, connection: any) {
  const sql = `select * from etl.flat_adt_patient where patient_ccc_number='${personCCC}'`;
  let result: Patient.Patient = await CM.query(sql, connection);
  return result;
}
export async function loadProviderData(personCCC: string, connection: any) {
  const sql = `select d.given_name, d.family_name,d.middle_name,d.prefix from etl.flat_adt_patient a
  inner join amrs.encounter b on a.encounter_id=b.encounter_id
  inner join amrs.users c on c.user_id = b.creator
  inner join amrs.person_name d on c.person_id =  d.person_id
  where patient_ccc_number='${personCCC}'`;
  let result = await CM.query(sql, connection);
  return result[0];
}
