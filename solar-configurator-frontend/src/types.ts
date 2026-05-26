export interface FormData {
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  roofSpace: string;
  monthlyBill: string;
}

export interface SolarMetrics {
  systemSizeKw: number;
  panelCount: number;
  cost: number;
  subsidy: number;
  netCost: number;
  annualGeneration: number;
  co2Offset: number;
  roiYears: number;
  monthlyGeneration: number;
  savingsPerMonth: number;
}

export type InputFieldKey = keyof FormData;

export type FieldStatus = 'REQUESTING INPUT...' | 'TYPING...' | 'READY ✓';

export type TrackerStage = 'SITE FEASIBILITY' | 'TECH DESIGN' | 'FINANCIALS' | 'REGULATORY';

export interface TrackerStatus {
  stage: TrackerStage;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED';
}

export interface PipelineState {
  n8nWorkflow: 'IDLE' | 'RUNNING' | 'SUCCESS' | 'ERROR';
  clientUpdate: 'WAITING FOR LEAD' | 'SENDING UPDATE...' | 'COMPLETED';
  bossNotification: 'INACTIVE' | 'SENDING...' | 'SENT';
}

export const initialFormData: FormData = {
  name: '',
  email: '',
  phone: '',
  city: 'Navsari',
  state: 'Gujarat',
  roofSpace: '',
  monthlyBill: ''
};
