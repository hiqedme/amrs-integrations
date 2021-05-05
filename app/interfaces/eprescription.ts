declare module EPrescription {
  export interface OrderingPhysician {
    given_name: string;
    family_name: string;
    middle_name: string;
    prefix: string;
  }

  export interface OrderDetails {
    transaction_datetime: string;
    order_number: string;
    ordering_physician: any;
    notes: string;
  }

  export interface DrugDetail {
    prescription_number: string;
    drug_code: string;
    strength: string;
    dosage: string;
    units: string;
    frequency: string;
    duration: string;
    quantity: string;
    prescription_notes: string;
  }

  export interface PatientObservationDetails {
    current_weight: string;
    current_height: string;
    current_regimen: string;
  }

  export interface DrugOrder {
    mflcode: string;
    patient_number_ccc: string;
    order_details: OrderDetails;
    drug_details?: DrugDetail[];
    patient_observation_details: PatientObservationDetails;
  }
}
