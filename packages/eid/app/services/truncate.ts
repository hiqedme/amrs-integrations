import GetPatient from "../helpers/dbConnect";

export default class truncateTables {
  public async truncate() {
    let getPatient = new GetPatient();
    let truncate = await getPatient.truncateEidCsvMetaData();
    return truncate;
  }
}