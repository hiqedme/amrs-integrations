import config from "@amrs-integrations/core";
import qs from "qs";
import { Patient } from "../models/patient";
import moment from "moment";
import { AfricasTalkingResponse } from "../models/sms";

export async function SendSMS(params: any) {
  let smsParams:Patient = JSON.parse(params)
  let msisdn = parseInt(smsParams.phone_number, 10);
  // TODO: Check the telco used for the provider then pick approapriate shortcode
  let from = '';
  let appointmentDate = moment(smsParams.rtc_date).format("YYYY-MM-DD");
  let sms =
    "Booked: Please come for your next appointment on " + appointmentDate;
  let httpClient = new config.HTTPInterceptor(
    config.sms.url || "",
    "",
    "",
    "sms"
  );
  console.log(config.sms.url)
  //validate and format phone numbers appropriately

  let sendSMSResponse: AfricasTalkingResponse = await httpClient.axios(
    "/services/sendsms/",
    {
      method: "post",
      data: qs.stringify({
        shortcode: "JuaMobile",
        partnerID: config.sms.partnerID,
        apikey: config.sms.apiKey,
        mobile: "254" + msisdn,
        timeToSend:smsParams.timeToSend,
        message: sms
      }),
    }
  );
  return sendSMSResponse;
}
