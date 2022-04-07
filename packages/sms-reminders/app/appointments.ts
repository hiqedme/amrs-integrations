import moment from "moment";
import { Consumer, Message, Producer } from "redis-smq";
import { Patient } from "../models/patient";
import { dailyAppointmentsquery } from "../models/queries";
import { SendSMS } from "./sms";
import config from "@amrs-integrations/core";
import qs from "qs";
export async function RetrieveAppointments(
  daysBeforeRTC: string,
  location: string,
  messageType: string
) {
  let appointmentDate = moment()
    .add(daysBeforeRTC, "days")
    .format("YYYY-MM-DD");
  let appointments = await dailyAppointmentsquery(appointmentDate);
  await QueueAppointments(appointments);
}

export async function QueueAppointments(patients: Patient[]) {
  let count = 0;
  const producer = new Producer();
  patients.forEach(async (element) => {
    const message = new Message();
    // get consent
    let consentTime = await GetPatientConsent(
     element.uuid
    );
    if (consentTime !== "") {
      element.timeToSend =
        moment().format("YYYY-MM-DD") +
        " " +
        moment(consentTime).format("HH:mm");
      message
        .setBody(JSON.stringify(element))
        .setTTL(3600000) // in millis
        .setQueue("appointments_queue");

      producer.produce(message, (err) => {
        if (err) console.log(err);
        else {
          const msgId = message.getId(); // string
          console.log("Successfully produced. Message ID is ", msgId);
          count++;
        }
      });
    }
  });
  // if all appointments were queued successfuly, shutdown producer and exit with code 0
  if (count === patients.length) {
    producer.shutdown();
    process.exit(0);
  }
}

export async function SendNotifications() {
  const consumer = new Consumer();

  const messageHandler = async (
    msg: { getBody: () => any },
    cb: () => void
  ) => {
    const payload: Patient = msg.getBody();
    console.log("Message payload", payload);
    // send sms
    // let response = await SendSMS(payload);

    // console.log(response);
    //check response for success or error. if error
    cb(); // acknowledging the message
  };

  consumer.consume(
    "appointments_queue",
    false,
    messageHandler,
    (err, isRunning) => {
      if (err) console.error(err);
      // the message handler will be started only if the consumer is running
      else
        console.log(
          `Message handler has been registered. Running status: ${isRunning}`
        ); // isRunning === false
    }
  );

  consumer.run();
}
export async function GetPatientConsent(patientUUID: string) {
  let httpClient = new config.HTTPInterceptor(
    config.sms.url || "",
    config.amrsUsername || "",
    config.amrsPassword || "",
    "amrs"
  );
  let consentedTime = "";
  let consent: any = await httpClient.axios(
    "/ws/rest/v1/obs?" +
      qs.stringify({
        patient: patientUUID,
        concept: "8873d881-6ad3-46e6-a558-b97d51d15e01",
        v: "custom:(value,concept:(uuid,uuid,name:(display)))",
        limit: 1,
      }),
    {
      method: "get",
    }
  );
  if (
    consent.results.length > 0 &&
    consent.results[0].value.display === "YES"
  ) {
    let smsTime = await httpClient.axios(
      "/ws/rest/v1/obs?" +
        qs.stringify({
          patient: patientUUID,
          concept: "4e1a9d59-3d06-47eb-82a7-30410db249e4",
          v: "custom:(value,concept:(uuid,uuid,name:(display)))",
          limit: 1,
        }),
      {
        method: "get",
      }
    );
    consentedTime = smsTime.results[0].value;
  }
  return consentedTime;
}
