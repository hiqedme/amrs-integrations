import config from "@amrs-integrations/core";
let CM = config.ConnectionManager.getInstance();

export default class GetPatient {
  async getPatientUUIDUsingIdentifier(params: string) {
    let amrsCON = await CM.getConnectionAmrs();
    let sql = `select p.uuid from amrs.patient_identifier pi left join amrs.person p on p.person_id=pi.patient_id where pi.identifier='${params}' and pi.voided=0`;
    let result: string = await CM.query(sql, amrsCON);
    await CM.releaseConnections(amrsCON);
    return result;
  }
  async getPatientUUIDUsingCCCNo(params: string) {
    let amrsCON = await CM.getConnectionAmrs();
    console.log("get specific identifier id!!");
    let sql = `select p.uuid from amrs.patient_identifier pi left join amrs.person p on p.person_id=pi.patient_id where pi.identifier='${params}'and pi.patient_identifier_id=2 and pi.voided=0;`;
    let result: string = await CM.query(sql, amrsCON);
    await CM.releaseConnections(amrsCON);
    return result;
  }
  async getPatientOrderNumber(params: string) {
    let amrsCON = await CM.getConnectionAmrs();
    let sql = `select order_id,encounter_id from amrs.orders where order_number='${params}' and voided=0`;
    let result: string = await CM.query(sql, amrsCON);
    await CM.releaseConnections(amrsCON);
    return result;
  }
  async checkPatientDataSync(params: any) {
    let amrsCON = await CM.getConnectionAmrs();
    let sql = `select count(obs_id) from amrs.obs where concept_id='${params.concept_id}' and obs_datetime >='${params.collection_date}' and patient_id='${params.patient_id}' and 
    value_numeric='${params.viral_load}'   and voided=0;`;
    let result: string = await CM.query(sql, amrsCON);
    await CM.releaseConnections(amrsCON);
    return result;
  }
}
