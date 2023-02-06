import config from "@amrs-integrations/core";
let CM = config.ConnectionManager.getInstance();

export default class GetPatient {
  async getPatientUUIDUsingIdentifier(params: string, isCCC: boolean) {
    let extraParams = "";
    if (isCCC) {
      extraParams = `and pi.identifier_type=28`;
    }
    let amrsCON = await CM.getConnectionAmrs();
    let sql = `select p.uuid from amrs.patient_identifier pi left join amrs.person p on p.person_id=pi.patient_id where pi.identifier='${params}' and pi.voided=0 ${extraParams}`;
    let result: any = await CM.query(sql, amrsCON);
    await CM.releaseConnections(amrsCON);
    return result;
  }

  async getPatientOrderNumber(params: string) {
    let amrsCON = await CM.getConnectionAmrs();
    let sql = `select order_id,encounter_id from amrs.orders where order_number='${params}' and voided=0`;
    let result: any = await CM.query(sql, amrsCON);
    await CM.releaseConnections(amrsCON);
    return result;
  }
  async checkPatientDataSync(params: any, uuid: string) {
    let amrsCON = await CM.getConnectionAmrs();
    let sql = `select count(encounter_id)  as count from etl.flat_labs_and_imaging where test_datetime='${params.collection_date}' and uuid='${uuid}' and hiv_viral_load = '${params.viral_load}'`;
    let result: any = await CM.query(sql, amrsCON);
    await CM.releaseConnections(amrsCON);
    return result;
  }
}
