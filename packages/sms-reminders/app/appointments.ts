import moment from "moment";
import { Consumer, Message, Producer } from "redis-smq";
import { Patient } from "../models/patient";
import { dailyAppointmentsquery } from "../models/queries";
export async function RetrieveAppointments(
  daysBeforeRTC: string,
  location: string,
  messageType: string
) {
  let appointmentDate = moment()
    .add(daysBeforeRTC, "days")
    .format("YYYY-MM-DD");
  let appointments = await dailyAppointmentsquery(appointmentDate);
  let queueResponse = await QueueAppointments(appointments);

  return queueResponse;
}

export async function QueueAppointments(patients: Patient[]) {
  patients.forEach((element) => {
    const message = new Message();
    message
      .setBody(JSON.stringify(element))
      .setTTL(3600000) // in millis
      .setQueue("appointments_queue");
    const producer = new Producer();
    producer.produce(message, (err) => {
      if (err) console.log(err);
      else {
        const msgId = message.getId(); // string
        console.log("Successfully produced. Message ID is ", msgId);
      }
    });
  });
}

export async function SendNotifications() {
  const consumer = new Consumer();

const messageHandler = (msg: { getBody: () => any; }, cb: () => void) => {
   const payload = msg.getBody();
   console.log('Message payload', payload);
   cb(); // acknowledging the message
};

consumer.consume('appointments_queue', false, messageHandler, (err, isRunning) => {
   if (err) console.error(err);
   // the message handler will be started only if the consumer is running
   else console.log(`Message handler has been registered. Running status: ${isRunning}`); // isRunning === false
});

consumer.run();
}
