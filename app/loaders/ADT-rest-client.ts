import { AxiosResponse, AxiosRequestConfig } from "axios";
import btoa from "btoa";
import config from "../config";
import HttpClient from "./http-client";

const token = btoa(config.adt.username + ":" + config.adt.password);

const adtProtocol = config.adt.https ? "https" : "http";
const adtBaseUrl = adtProtocol + "://" + config.adt.host;

export default class ADTRESTClient extends HttpClient {
  axios: any;
  constructor() {
    super(adtBaseUrl);
    this.initializeResponseInterceptor();
    this.initializeRequestInterceptor();
  }

  private initializeResponseInterceptor = () => {
    this.axios.interceptors.response.use(this.handleResponse, this.handleError);
  };

  private initializeRequestInterceptor = () => {
    this.axios.interceptors.request.use(this.handleRequest, this.handleError);
  };

  private handleRequest = (config: AxiosRequestConfig) => {
    config.headers["Authorization"] = "Basic " + token;

    return config;
  };

  private handleResponse = ({ data }: AxiosResponse) => data;
}
