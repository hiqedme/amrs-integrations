import config from "../config";

import mysql, { Connection, MysqlError, Pool } from "mysql";
export default class ConnectionManager {
  private static instance: ConnectionManager;
  private amrsPool: Pool;

  private constructor() {
    this.amrsPool = this.createPool(config);
  }
  static getInstance(): ConnectionManager {
    if (!ConnectionManager.instance) {
      ConnectionManager.instance = new ConnectionManager();
    }
    return ConnectionManager.instance;
  }

  createPool(conf: any): Pool {
    return mysql.createPool({
      host: conf.databaseURL,
      user: conf.user,
      password: conf.password,
      database: conf.database,
      port: conf.port,
      connectionLimit: conf.connectionLimit,
    });
  }
  async getConnectionAmrs(): Promise<Connection> {
    return this.getConnection(this.amrsPool);
  }
  private async getConnection(pool: Pool): Promise<Connection> {
    return new Promise<Connection>((success, error) => {
      pool.getConnection((err, conn) => {
        if (err) {
          error(err);
          return; // not connected!
        }
        success(conn);
      });
    });
  }
  async query(query: string, connection: Connection): Promise<any> {
    return new Promise((resolve, reject) => {
      connection.query(query, (error, results, fields) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }
  private async closeAmrsPool() {
    await this.closePool(this.amrsPool);
  }
  private async closePool(pool: Pool): Promise<any> {
    return new Promise<void>((success, error) => {
      pool.end((err) => {
        // all connections in the pool have ended
        if (err) {
          error(err);
        } else {
          success();
        }
      });
    });
  }
}
