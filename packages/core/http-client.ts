import axios, { AxiosInstance } from "axios";
import config from "@amrs-integrations/core";

export default abstract class HttpClient {
  protected readonly axios: AxiosInstance;

  constructor(baseURL: any) {
    const adtProtocol = config.adt.https ? "https" : "http";
    const adtBaseUrl = adtProtocol + "://" + config.adt.host;
    const amrsUrl = config.amrsUrl;
    this.axios = axios.create({
      baseURL: baseURL === "" ? adtBaseUrl : amrsUrl,
      responseType: "json",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  protected handleError = (error: any[]): Promise<string> =>
    Promise.reject(error);
}
