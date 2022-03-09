import dotenv from "dotenv";
import "./ADT-rest-client"
import "mysql"
import ADTRESTClient from "./ADT-rest-client";
import ConnectionManager from "./mysql";
const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}
export default {
  databaseURL: process.env.mysqlHost,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
  port: process.env.port,
  amrsUrl: process.env.amrsUrl,
  connectionLimit: process.env.connectionLimit,
  server: process.env.server,
  adt: {
    username: process.env.amrsUsername,
    password: process.env.amrsPassword,
    https: false,
    host: process.env.adtHost,
    port: process.env.adtPort,
  },
  prodDbURL: process.env.prodDbURL,
  prodDbPort: process.env.prodDbPort,
  prodDb: process.env.prodDb,
  ADTRESTClient:ADTRESTClient,
  ConnectionManager:ConnectionManager
};

