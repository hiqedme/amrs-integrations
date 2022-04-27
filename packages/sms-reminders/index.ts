import { RetrieveAppointments, SendNotifications } from "./app/appointments";
import config from "@amrs-integrations/core"
import {setConfiguration} from "redis-smq"
import { SendSMS } from "./app/sms";
let redisConfig:any =config.redis
setConfiguration(redisConfig)
//Run producer and consumer
let args = process.argv;
switch (args[2]) {
    case 'produce':
        RetrieveAppointments(args[3],"","")
        break;
    case 'consume':
        SendNotifications();
        break;
    case 'test':
        SendSMS('{"rtc_date":"2022-09-10","phone_number":"'+args[3]+'","timeToSend":"2022-04-27 15:15:00"}');
        break;
    default:
        console.log("please specify the command to run e.g node index.js produce 4")
        break;
}