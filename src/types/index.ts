// Tender status enum
export type TenderStatus = 'Open' | 'Closing Soon' | 'Under Review' | 'Awarded' | 'Cancelled' | 'Closed';

// Tender interface representing a government tender
export interface Tender {
  _id: string;
  title: string;
  referenceNumber: string;
  department: string;
  organization?: string;
  value: number;
  emdAmount?: number;
  deadline: string;
  submissionDeadline?: string;
  openingDate?: string;
  status: TenderStatus;
  category?: string;
  location?: string;
  description?: string;
  eligibilityCriteria?: string;
  documents?: TenderDocument[];
  createdAt: string;
  updatedAt: string;
  lat?: number;
  long?: number;
}

// Tender document for attachments
export interface TenderDocument {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
}

// Filter options for tenders
export interface TenderFilters {
  status?: TenderStatus | null;
  department?: string | null;
  searchTerm?: string;
  search?: string;
  minValue?: number | null;
  maxValue?: number | null;
  category?: string | null;
  location?: string | null;
  startDate?: string;
  endDate?: string;
}

// Tender statistics
export interface TenderStats {
  total: number;
  openCount: number;
  closingCount: number;
  closedCount: number;
  awardedCount: number;
  averageValue: number;
  byDepartment: {
    department: string;
    count: number;
  }[];
  byCategory: {
    category: string;
    count: number;
  }[];
  byValue: {
    range: string;
    count: number;
  }[];
  lastUpdated: string;
}

// Tender bid interface
export interface TenderBid {
  id: string;
  tenderId: string;
  tenderTitle: string;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Won' | 'Lost';
  submissionDate?: string;
  documents: BidDocument[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Bid document
export interface BidDocument {
  id: string;
  name: string;
  type: 'Technical' | 'Financial' | 'Compliance' | 'Supporting';
  url: string;
  uploadedAt: string;
}

// User profile
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  company?: string;
  role: 'Admin' | 'User' | 'Viewer';
  preferences: {
    notifications: boolean;
    emailAlerts: boolean;
    defaultFilters?: TenderFilters;
  };
}

// Notification
export interface Notification {
  id: string;
  type: 'NewTender' | 'DeadlineApproaching' | 'StatusChange' | 'BidUpdate';
  title: string;
  message: string;
  tenderId?: string;
  read: boolean;
  createdAt: string;
}

// Sync status for data source
export interface SyncStatus {
  lastSync: string;
  status: 'Success' | 'Failed' | 'In Progress';
  message?: string;
  nextScheduledSync: string;
  source: 'API' | 'Scraper' | 'Fallback';
  recordsProcessed?: number;
}

// API response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  metadata?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Socket events
export interface SocketEvents {
  // Client to server events
  JOIN_DASHBOARD: 'join_dashboard';
  LEAVE_DASHBOARD: 'leave_dashboard';
  UPDATE_FILTERS: 'update_filters';
  REQUEST_SYNC: 'request_sync';
  
  // Server to client events
  TENDERS_UPDATED: 'tenders_updated';
  SYNC_STATUS: 'sync_status';
  ERROR: 'error';
}

// Socket events data types
export interface JoinDashboardData {
  filters?: TenderFilters;
}

export interface TendersUpdatedData {
  tenders: Tender[];
  stats?: TenderStats;
  lastUpdated: string;
}

export interface SyncStatusData {
  status: SyncStatus;
}

export interface ErrorData {
  message: string;
  code?: string;
} 