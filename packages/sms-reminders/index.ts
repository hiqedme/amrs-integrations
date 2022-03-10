import { RetrieveAppointments, SendNotifications } from "./app/appointments";
import config from "@amrs-integrations/core"
import {setConfiguration} from "redis-smq"
let redisConfig:any =config.redis
setConfiguration(redisConfig)

RetrieveAppointments("","","")
SendNotifications();