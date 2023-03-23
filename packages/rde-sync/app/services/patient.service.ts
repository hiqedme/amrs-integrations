import { AMRS_POOL, ETL_POOL } from "../db";
import { ResponseToolkit } from "@hapi/hapi";
import { RowDataPacket } from "mysql2";

export interface RequestParams {
  identifiers: string[];
  user_id: number;
  reporting_month: string;
}

class PatientService {
  async getPatientIds(identifiers: string[]) {
    let whereQuery = "";
    identifiers.forEach((identifier) => {
      whereQuery += `'${identifier}',`;
    });

    const query = `SELECT DISTINCT patient_id FROM patient_identifier WHERE identifier IN (${whereQuery.slice(
      0,
      -1
    )})`;

    const connection = await AMRS_POOL.getConnection();
    const result = await connection.execute(query);
    connection.release();

    return result;
  }

  async queueRDEPatients(request: RequestParams, h: ResponseToolkit) {
    const { identifiers, user_id, reporting_month } = request;

    const [rows] = await this.getPatientIds(identifiers);

    const handleRow = async (row: RowDataPacket) => {
      const patientId = row.patient_id;

      const moment = require("moment-timezone");
      let now = moment().tz("Africa/Nairobi");
      let formattedDateTime = now.format("YYYY-MM-DD HH:mm:ss");

      let query = `INSERT INTO rde_sync_queue (user_id, patient_id, date_created, reporting_month, status) VALUES (${user_id}, ${patientId}, '${formattedDateTime}', '${reporting_month}', 'QUEUED')`;

      const connection = await ETL_POOL.getConnection();
      const [rows] = await connection.execute(query);
      connection.release();
      h.response(rows).created;
    };

    if (Array.isArray(rows)) {
      rows.forEach((row: any) => {
        return handleRow(row as RowDataPacket);
      });
    }
  }
}

export default PatientService;
