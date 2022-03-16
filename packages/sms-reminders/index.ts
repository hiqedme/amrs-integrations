import { RetrieveAppointments, SendNotifications } from "./app/appointments";
import config from "@amrs-integrations/core"
import {setConfiguration} from "redis-smq"
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
    default:
        console.log("please specify the command to run e.g node index.js produce 4")
        break;
}