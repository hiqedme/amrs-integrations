declare module PatientPayload {

    export interface PatientIdentifier {
        identifier: string;
        identifierType: string;
        location: string;
        preferred: boolean;
    }
    export interface Residence {
        county: string;
        subCounty: string;
        ward: string;
        village: string;
        landMark: string;
        address: string;
    }

    export interface Identification {
        identificationType: string;
        identificationNumber: string;
    }

    export interface Contact {
        primaryPhone: string;
        secondaryPhone: string;
        emailAddress: string;
    }
    export interface NextOfKin {
        name: string;
        relationship: string;
        residence: string;
        contact: Contact;
    }

    export interface Patient {
        uuid: string;
        clientNumber: string;
        firstName: string;
        middleName: string;
        lastName: string;
        dateOfBirth: string;
        maritalStatus: string;
        gender: string;
        occupation: string;
        religion: string;
        educationLevel: string;
        country: string;
        countyOfBirth: string;
        residence: Residence;
        identifications: Identification[];
        contact: Contact;
        nextOfKins: NextOfKin[];
        originFacilityKmflCode: string;
        isAlive : boolean;

    }
    export interface ClientObject {
        clientExists: boolean;
        client: Patient;
    }
}