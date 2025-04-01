import { TenderStatus } from '../store/tenderStore';

export interface Tender {
  id: string;
  title: string;
  department: string;
  deadline: string;
  value: number;
  status: TenderStatus;
  created_at: string;
  reference_number?: string;
  organization?: string;
  emd_amount?: number;
  classification?: string;
  category?: string;
  eligibility_criteria?: string;
  document_url?: string;
  location?: string;
  user_id: string;
}

export interface TenderFilters {
  status?: TenderStatus | null;
  department?: string | null;
  searchTerm?: string;
  minValue?: number | null;
  maxValue?: number | null;
  category?: string | null;
  location?: string | null;
}

export interface TenderDocument {
  name: string;
  url: string;
  type: string;
  size: number;
} 