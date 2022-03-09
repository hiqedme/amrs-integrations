import config from "@amrs-integrations/core";
import { Patient } from "../models/patient";
export async function RetrieveAppointments(
  daysBeforeRTC: string,
  location: string,
  messageType: string
) {
  let appointmentsUrl =
    "/etl-latest/etl/daily-appointments/2022-03-09?startIndex=0&startDate=2022-03-09&locationUuids=" +
    location +
    "&limit=1&department=HIV";
  let data = new config.HTTPInterceptor(
    "",
    config.amrsUsername || "",
    config.amrsPassword || ""
  );
  data.axios
    .get(appointmentsUrl, {})
    .then(async (resp: any) => {
     
      let patient: Patient[] = resp.result;
      console.log(patient);
    })
    .catch(
      (error: {
        response: { data: any; status: any; headers: any };
        request: any;
        message: any;
        config: any;
      }) => {
        // Error 😨
        if (error.response) {
          /*
           * The request was made and the server responded with a
           * status code that falls out of the range of 2xx
           */
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          /*
           * The request was made but no response was received, `error.request`
           * is an instance of XMLHttpRequest in the browser and an instance
           * of http.ClientRequest in Node.js
           */
          console.log(error.request);
        } else {
          // Something happened in setting up the request and triggered an Error
          console.log("Error", error.message);
        }
        console.log(error.config);
      }
    );
  console.log(appointmentsUrl);
}
