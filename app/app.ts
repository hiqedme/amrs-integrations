import PatientService from "./services/patient";
import "./loaders/events";

//Consume person ids from queue and prepare payload

//publish an search event for all persons in the queue
const adt = new PatientService();
adt.searchADT("902630", "1235");
