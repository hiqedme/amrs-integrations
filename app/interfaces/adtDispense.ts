declare module IADTDispense {
  export interface OrderDetails {
    transaction_datetime: string;
    order_number: string;
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

  export interface ADTDispense {
    mflcode: string;
    patient_number_ccc: string;
    order_details: OrderDetails;
    drug_details: DrugDetail[];
  }
}
