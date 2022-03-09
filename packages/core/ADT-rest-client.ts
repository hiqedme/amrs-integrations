import { AxiosResponse, AxiosRequestConfig } from "axios";
import btoa from "btoa";
import config from './';
import HttpClient from "./http-client";



export default class ADTRESTClient extends HttpClient {
  axios: any;
   username:string;
   password: string;
  constructor(endpoint: string, username: string, password: string) {
    super(endpoint);
    this.username = username;
    this.password = password;

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
    const token = btoa(this.username + ":" + this.password);
    config.headers!.Authorization =  "Basic " + token;
    return config;
  };

  private handleResponse = ({ data }: AxiosResponse) => data;
}
