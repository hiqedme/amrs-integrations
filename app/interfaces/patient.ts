declare namespace Patient {
  export interface Prep {
    prep_reason: number;
    prep_test_answer: string;
    prep_test_date: string;
    prep_test_result: string;
  }

  export interface Pep {
    pep_reason: number;
  }

  export interface IPatient {
    mfl_code: string;
    patient_number: any;
    mflcode: string;
    source: string;
    medical_record_no: string;
    patient_ccc_number: string;
    patient_number_ccc: string;
    first_name: string;
    last_name: string;
    other_name: string;
    date_of_birth: string;
    place_of_birth: string;
    gender: string;
    pregnant: string;
    breastfeeding: string;
    weight: string;
    height: string;
    start_regimen: string;
    start_regimen_date: string;
    enrollment_date: string;
    phone: string;
    address: string;
    partner_status: string;
    family_planning: number;
    alcohol: string;
    smoke: string;
    current_status: number;
    service: number;
    prep: Prep;
    pep: Pep;
  }
}
