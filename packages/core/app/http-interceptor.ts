import { AxiosResponse, AxiosRequestConfig } from "axios";
import btoa from "btoa";
import configs from '../';
import HttpClient from "./http-client";



export default class HTTPInterceptor extends HttpClient {
  axios: any;
   username:string;
   password: string;
   requestType: string;
   token?:string;
  constructor(endpoint: string, username: string, password: string ,requestType:string, token?:string) {
    super(endpoint,requestType);
    this.username = username;
    this.password = password;
    this.requestType = requestType; 
    this.token=token;  
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
    if(this.requestType === "sms"){
      config.headers!['apiKey']=configs.sms.apiKey || ""
      config.headers!['Content-Type'] =  "application/x-www-form-urlencoded"
      config.headers!['Accept'] =  "application/json"
      config.responseType = "json";
    }else if(this.requestType === "oauth2"){
      config.headers!['Content-Type'] =  "application/x-www-form-urlencoded";
    }else if(this.requestType === "dhp"){
      config.headers!.Authorization = "Bearer "+this.token;
      config.headers!['Content-Type'] =  "application/json";
      config.responseType = "json";
    }
    else{
      const token = btoa(this.username + ":" + this.password);
      config.headers!.Authorization =  "Basic " + token;
      config.headers!['Content-Type'] =  "application/json";
      config.responseType = "json";
    }
   
    return config;
  };

  private handleResponse = ({ data }: AxiosResponse) => data;
}
