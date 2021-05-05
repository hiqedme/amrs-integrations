import axios, { AxiosInstance } from "axios";
import config from "../config";

export default abstract class HttpClient {
  protected readonly axios: AxiosInstance;

  constructor(baseURL: any) {
    const adtProtocol = config.adt.https ? "https" : "http";
    const adtBaseUrl = adtProtocol + "://" + config.adt.host;
    this.axios = axios.create({
      baseURL: baseURL === "" ? adtBaseUrl : "https://ngx.ampath.or.ke/amrs",
      responseType: "json",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  protected handleError = (error: any[]): Promise<string> =>
    Promise.reject(error);
}
