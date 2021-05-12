import { Connection } from "mysql";
import ConnectionManager from "../loaders/mysql";
const CM = ConnectionManager.getInstance();
export async function loadPatientDataByID(
  personId: string,
  connection: Connection
) {
  const personCCC = await fetchPersonCCCByID(personId, connection);
  console.log(personCCC, personId);
  return await loadPatientData(
    personCCC.patient_ccc_number
      ? personCCC.patient_ccc_number
      : personCCC.medical_record_no,
    connection
  );
}

export async function fetchPersonCCCByID(personId: any, connection: any) {
  //Return static cc for testing.
  const sql = `select patient_ccc_number, medical_record_no from etl.flat_adt_patient where person_id='${personId}'`;
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
export async function fetchEncounterUUID(personCCC: string, connection: any) {
  const sql = `SELECT 
                loc.uuid AS location_uuid,
                enc_type.uuid AS encounter_type_uuid,
                person.uuid AS patient_uuid,
                provider.uuid AS provider_uuid,
                'a0b03050-c99b-11e0-9572-0800200c9a66' AS encounter_role,
                enc.uuid AS encounter_uuid
              FROM
                etl.flat_adt_patient a
                    INNER JOIN
                amrs.location loc ON loc.location_id = a.location_id
                    INNER JOIN
                amrs.encounter_type enc_type ON enc_type.encounter_type_id = a.encounter_type
                    INNER JOIN
                amrs.person person ON person.person_id = a.person_id
                    INNER JOIN
                amrs.encounter enc ON enc.encounter_id = a.encounter_id
                    INNER JOIN
                amrs.encounter_provider enc_prov ON enc_prov.encounter_id = enc.encounter_id
                    INNER JOIN
                amrs.provider provider ON provider.provider_id = enc_prov.provider_id
              WHERE
                a.patient_ccc_number =  '${personCCC}'`;
  let result: any = await CM.query(sql, connection);
  CM.releaseConnections(connection);
  return result;
}
export async function loadPatientQueue(connection: Connection) {
  // Only fetch patients from location test.
  const sql = `select * from etl.adt_poc_integration_queue order by date_created desc limit 1`;
  let result: any[] = await CM.query(sql, connection);
  if (result.length > 0) {
    const dequeue = `delete from etl.adt_poc_integration_queue where person_id='${result[0].person_id}'`;
    await CM.query(dequeue, connection);
  }
  return result;
}
