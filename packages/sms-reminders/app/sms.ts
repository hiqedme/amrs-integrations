import config from "@amrs-integrations/core";
import dictionary from "../templates/sms_dictionary.json";
import qs from "qs";
import { Patient } from "../models/patient";
import moment from "moment";
import { AfricasTalkingResponse } from "../models/sms";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import { checkNumber, saveNumber } from "../models/queries";

export async function SendSMS(params: any) {
  let smsParams: Patient = JSON.parse(params);
  // TODO: Check the telco used for the provider then pick approapriate shortcode
  if (isValidPhoneNumber(smsParams.phone_number, "KE")) {
    const phoneNumber = parsePhoneNumber(smsParams.phone_number, "KE");
    let numberExist: any[] = await checkNumber(phoneNumber.number);
    if (
      (smsParams.messageType === "welcome" &&
        numberExist.length > 0 &&
        numberExist[0].status === "active") ||
      (smsParams.messageType === "optout" &&
        numberExist.length > 0 &&
        numberExist[0].status === "optedout") ||(smsParams.messageType === "optout" &&
        numberExist.length !> 0)
    ) {
      return;
    } else if (
      (smsParams.messageType === "optout" &&
        numberExist.length > 0 &&
        numberExist[0].status === "active") ||
      (smsParams.messageType === "welcome" && !numberExist) ||
      (smsParams.messageType === "welcome" &&
        numberExist.length > 0 &&
        numberExist[0].status === "optedout")
    ) {
      let status = smsParams.messageType === "optout" ? "optedout" : "active";
      saveNumber(phoneNumber.number, status,numberExist.length > 0);
    }
    let appointmentDate = moment(smsParams.rtc_date).format("YYYY-MM-DD");
    let sms = "";
    let personName = smsParams.person_name;
    if (smsParams.language === "english") {
      sms =
        dictionary.templates.find(
          (x: { type: string }) => x.type === smsParams.messageType
        )?.english || "";
    } else {
      sms =
        dictionary.templates.find(
          (x: { type: string }) => x.type === smsParams.messageType
        )?.kiswahili || "";
    }
    let httpClient = new config.HTTPInterceptor(
      config.sms.url || "",
      "",
      "",
      "sms"
    );

    if (sms !== "") {
      let smsContent = sms
        .replace("$personName$", personName)
        .replace("$rtc_date$", appointmentDate);
      let sendSMSResponse: AfricasTalkingResponse = await httpClient.axios(
        "/services/sendsms/",
        {
          method: "post",
          data: qs.stringify({
            shortcode: config.sms.shortCode,
            partnerID: config.sms.partnerID,
            apikey: config.sms.apiKey,
            mobile: phoneNumber.number,
            timeToSend: smsParams.timeToSend,
            message: smsContent,
          }),
        }
      );
      return sendSMSResponse;
    } else {
      console.log("Invalid phone number");
    }
  }
}
