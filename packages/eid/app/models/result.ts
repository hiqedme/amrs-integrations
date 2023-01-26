declare module EIDPayloads {
  export interface VLResult {
    id: number;
    order_number: string;
    provider_identifier?: any;
    facility_code: number;
    AMRs_location: number;
    full_names?: any;
    date_collected: string;
    date_received: string;
    date_tested: string;
    interpretation: string;
    result: string;
    date_dispatched: string;
    sample_status: string;
    result_log?: any;
    patient: string;
  }
  export interface Observation {
    person: string;
    concept: string;
    obsDatetime: any;
    value: number;

    order: string;
  }
}




