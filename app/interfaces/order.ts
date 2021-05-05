declare namespace IOrder {
  export interface Link {
    rel: string;
    uri: string;
  }

  export interface PreferredName {
    uuid: string;
    display: string;
    links: Link[];
  }

  export interface PreferredAddress {
    uuid: string;
    display: string;
    links: Link[];
  }

  export interface Attribute {
    uuid: string;
    display: string;
    links: Link[];
  }
  export interface Person {
    uuid: string;
    display: string;
    gender: string;
    age: number;
    birthdate: Date;
    birthdateEstimated: boolean;
    dead: boolean;
    deathDate?: any;
    causeOfDeath?: any;
    preferredName: PreferredName;
    preferredAddress: PreferredAddress;
    attributes: Attribute[];
    voided: boolean;
    deathdateEstimated: boolean;
    birthtime?: any;
    links: Link[];
    resourceVersion: string;
  }

  export interface IdentifierType {
    uuid: string;
    display: string;
    name: string;
    description: string;
    format: string;
    formatDescription: string;
    required: boolean;
    validator: string;
    locationBehavior?: any;
    uniquenessBehavior: string;
    retired: boolean;
    links: Link[];
    resourceVersion: string;
  }

  export interface Location {
    uuid: string;
    display: string;
    name: string;
    description: string;
    address1: string;
    address2?: any;
    cityVillage?: any;
    stateProvince: string;
    country: string;
    postalCode?: any;
    latitude?: any;
    longitude?: any;
    countyDistrict: string;
    address3?: any;
    address4: string;
    address5?: any;
    address6?: any;
    tags: any[];
    parentLocation?: any;
    childLocations: any[];
    retired: boolean;
    attributes: any[];
    address7?: any;
    address8?: any;
    address9?: any;
    address10?: any;
    address11?: any;
    address12?: any;
    address13?: any;
    address14?: any;
    address15?: any;
    links: Link[];
    resourceVersion: string;
  }

  export interface Creator {
    uuid: string;
    display: string;
    links: Link[];
  }

  export interface AuditInfo {
    creator: Creator;
    dateCreated: Date;
    changedBy?: any;
    dateChanged?: any;
  }

  export interface Identifier {
    display: string;
    uuid: string;
    identifier: string;
    identifierType: IdentifierType;
    location: Location;
    preferred: boolean;
    voided: boolean;
    auditInfo: AuditInfo;
    links: Link[];
    resourceVersion: string;
  }

  export interface Patient {
    uuid: string;
    person: Person;
    identifiers: Identifier[];
  }

  export interface Form {
    uuid: string;
    name: string;
  }

  export interface EncounterType {
    uuid: string;
    display: string;
    links: Link[];
  }

  export interface Provider {
    uuid: string;
    display: string;
  }

  export interface EncounterProvider {
    uuid: string;
    display: string;
    provider: Provider;
  }

  export interface Concept {
    uuid: string;
    display: string;
    links: Link[];
  }

  export interface CareSetting {
    uuid: string;
    name: string;
    description: string;
    retired: boolean;
    careSettingType: string;
    display: string;
    links: Link[];
    resourceVersion: string;
  }

  export interface Encounter {
    uuid: string;
    display: string;
    links: Link[];
  }

  export interface Orderer {
    uuid: string;
    display: string;
    links: Link[];
  }

  export interface ConceptClass {
    uuid: string;
    display: string;
    links: Link[];
  }

  export interface OrderType {
    uuid: string;
    display: string;
    name: string;
    javaClassName: string;
    retired: boolean;
    description: string;
    conceptClasses: ConceptClass[];
    parent?: any;
    links: Link[];
    resourceVersion: string;
  }

  export interface Order {
    uuid: string;
    orderNumber: string;
    accessionNumber?: any;
    patient: Patient;
    concept: Concept;
    action: string;
    careSetting: CareSetting;
    previousOrder?: any;
    dateActivated: Date;
    scheduledDate?: any;
    dateStopped?: any;
    autoExpireDate?: any;
    encounter: Encounter;
    orderer: Orderer;
    orderReason?: any;
    orderReasonNonCoded?: any;
    orderType: OrderType;
    urgency: string;
    instructions?: any;
    commentToFulfiller?: any;
    display: string;
    auditInfo: AuditInfo;
    specimenSource?: any;
    laterality?: any;
    clinicalHistory?: any;
    frequency?: any;
    numberOfRepeats?: any;
    links: Link[];
    type: string;
    resourceVersion: string;
  }

  export interface Orders {
    uuid: string;
    encounterDatetime: Date;
    patient: Patient;
    form: Form;
    visit?: any;
    location: Location;
    encounterType: EncounterType;
    encounterProviders: EncounterProvider[];
    orders: Order[];
    obs: any[];
  }
}
