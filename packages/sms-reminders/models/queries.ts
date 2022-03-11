import config from "@amrs-integrations/core";
import { Patient } from "./patient";

export async function dailyAppointmentsquery(appointmentDate: string) {
  let CM = config.ConnectionManager.getInstance();
  let amrsCON = await CM.getConnectionAmrs();
  let sql =
    "SELECT t2.person_id AS `person_id`, GROUP_CONCAT(DISTINCT contacts.value SEPARATOR ', ') AS `phone_number`, person_name.given_name AS `person_name` FROM etl.flat_appointment `t2` FORCE INDEX (location_med_pickup_rtc_date) LEFT JOIN ( SELECT fa.encounter_id AS `encounter_id`, MAX(fa.encounter_id) AS `max_encounter_id`, person_id AS `person_id` FROM etl.flat_appointment `fa` FORCE INDEX (location_med_pickup_rtc_date) WHERE (date(fa.scheduled_date) >= '" +
    appointmentDate +
    "') AND (date(fa.scheduled_date) <= '" +
    appointmentDate +
    "') AND (fa.is_clinical = 1 OR fa.encounter_type = 186) AND (fa.encounter_type NOT IN (21 , 99999)) GROUP BY person_id) `latest_encounter` ON (latest_encounter.person_id = t2.person_id) LEFT JOIN etl.flat_appointment `t3` ON (t3.person_id = t2.person_id AND t3.encounter_id = latest_encounter.max_encounter_id) LEFT JOIN etl.flat_appointment `death_reporting` ON (death_reporting.person_id = t2.person_id AND death_reporting.encounter_type IN (31) AND death_reporting.encounter_datetime >= t2.encounter_datetime) LEFT JOIN etl.flat_hiv_summary_v15b `fhs` ON (t2.encounter_id = fhs.encounter_id) INNER JOIN amrs.person `t1` ON (t2.person_id = t1.person_id) LEFT JOIN amrs.person_name `person_name` ON (t1.person_id = person_name.person_id AND (person_name.voided IS NULL || person_name.voided = 0) AND person_name.preferred = 1) LEFT JOIN amrs.person_attribute `contacts` ON (t1.person_id = contacts.person_id AND (contacts.voided IS NULL || contacts.voided = 0) AND contacts.person_attribute_type_id IN (10, 48)) LEFT JOIN amrs.person_address `pa` ON (t1.person_id = pa.person_id) WHERE contacts.value IS NOT NULL and (date(t2.scheduled_date) >= '" +
    appointmentDate +
    "') AND (date(t2.scheduled_date) <= '" +
    appointmentDate +
    "') AND (t3.program_id IN (1, 4, 2, 11, 10, 19, 30, 9, 8, 3, 20, 25, 27, 28, 29, 31) OR t3.program_id IS NULL) AND (t2.encounter_type NOT IN (21, 99999)) AND (((t2.next_encounter_type <> 116 OR t2.next_encounter_type IS NULL ) OR t2.scheduled_date >= t2.next_encounter_datetime)) AND (t2.is_clinical = 1) AND (t2.is_clinical = 1) AND (fhs.transfer_out_location_id IS NULL OR fhs.transfer_out_location_id <> 9999) AND ((death_reporting.encounter_datetime IS NULL) OR (DATE(t2.scheduled_date) < DATE(death_reporting.encounter_datetime))) AND (1 = (IF(DATE_FORMAT(t2.scheduled_date, '%Y-%m-%d') = '" +
    appointmentDate +
    "', 1, NULL))) GROUP BY t1.person_id";
    console.log("Query", sql)
  let result: Patient[] = await CM.query(sql, amrsCON);

  return result;
}
