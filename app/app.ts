import PatientService from "./services/patient";

//Consume person ids from queue and prepare payload
const adt = new PatientService();
adt.searchADT("35546", "1235");
