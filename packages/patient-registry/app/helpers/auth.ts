import qs from "qs";
import config from "@amrs-integrations/core"
export default async function getAccessToken() {
    // TODO: Remove in production
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    var data = qs.stringify({
        'client_id': config.dhp.clientId,
        'client_secret':config.dhp.clientSecret,
        'grant_type': config.dhp.grantType,
        'scope': config.dhp.scope 
      });
      console.log(data)
      let httpClient = new config.HTTPInterceptor(config.dhp.authUrl || "","","","oauth2")
      let response = await httpClient.axios("/connect/token",{method:"post",data:data})
      return response;
}