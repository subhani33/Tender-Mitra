import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import socketService from '../services/socketService';
import tenderApi from '../services/api';

export type TenderStatus = 'Open' | 'Closed' | 'Under Review' | 'Awarded' | 'Cancelled';

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
  search?: string;
  minValue?: number | null;
  maxValue?: number | null;
  category?: string | null;
  location?: string | null;
}

interface TenderState {
  tenders: Tender[];
  isLoading: boolean;
  error: string | null;
  filters: {
    status: TenderStatus | null;
    department: string | null;
    minValue: number | null;
    maxValue: number | null;
    search: string;
  };
  lastUpdated: Date | null;
  
  fetchTenders: () => Promise<void>;
  setFilter: (key: string, value: unknown) => void;
  clearFilters: () => void;
  searchTenders: (query: string) => void;
  getFilteredTenders: () => Tender[];
  refreshData: () => Promise<void>;
  setupRealTimeUpdates: () => void;
  cleanupRealTimeUpdates: () => void;
}

export const useTenderStore = create<TenderState>((set, get) => ({
  tenders: [],
  isLoading: false,
  error: null,
  filters: {
    status: null,
    department: null,
    minValue: null,
    maxValue: null,
    search: '',
  },
  lastUpdated: null,
  
  fetchTenders: async () => {
    set({ isLoading: true, error: null });
    try {
      // Create a new object with undefined instead of null values
      const currentFilters: TenderFilters = {};
      
      // Manually copy each property, converting null to undefined
      const filters = get().filters;
      if (filters.status !== null) currentFilters.status = filters.status;
      if (filters.department !== null) currentFilters.department = filters.department;
      if (filters.minValue !== null) currentFilters.minValue = filters.minValue;
      if (filters.maxValue !== null) currentFilters.maxValue = filters.maxValue;
      currentFilters.search = filters.search;
      
      // Fetch initial data from API
      const data = await tenderApi.getTenders(currentFilters);
      
      set({ 
        tenders: data, 
        isLoading: false,
        lastUpdated: new Date()
      });

      // Initialize real-time updates after loading initial data
      get().setupRealTimeUpdates();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error fetching tenders', 
        isLoading: false 
      });
    }
  },

  setupRealTimeUpdates: () => {
    socketService.init();
    
    socketService.onTendersUpdate((tenders) => {
      set({ 
        tenders,
        lastUpdated: new Date(),
        isLoading: false
      });
    });
    
    socketService.onError((error) => {
      set({ 
        error: error.message || 'Error receiving tender updates',
        isLoading: false 
      });
    });
    
    // Send initial filters
    socketService.joinTenderDashboard(get().filters);
  },
  
  cleanupRealTimeUpdates: () => {
    socketService.disconnect();
  },
  
  setFilter: (key: string, value: unknown) => {
    const newFilters = {
      ...get().filters,
      [key]: value
    };
    
    set({ filters: newFilters });
    
    // Update real-time data with new filters
    socketService.updateFilters(newFilters);
  },
  
  clearFilters: () => {
    const emptyFilters = {
      status: null,
      department: null,
      minValue: null,
      maxValue: null,
      search: '',
    };
    
    set({ filters: emptyFilters });
    
    // Update real-time data with cleared filters
    socketService.updateFilters(emptyFilters);
  },
  
  searchTenders: (query: string) => {
    const newFilters = {
      ...get().filters,
      search: query
    };
    
    set({ filters: newFilters });
    
    // Update real-time data with search query
    socketService.updateFilters(newFilters);
  },
  
  getFilteredTenders: () => {
    // Local filtering is still useful for immediate UI response
    // before the socket delivers new data
    const { tenders, filters } = get();
    return tenders.filter((tender: Tender) => {
      // Apply status filter
      if (filters.status && tender.status !== filters.status) return false;
      
      // Apply department filter
      if (filters.department && tender.department !== filters.department) return false;
      
      // Apply value range filters
      if (filters.minValue && tender.value < filters.minValue) return false;
      if (filters.maxValue && tender.value > filters.maxValue) return false;
      
      // Apply search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          tender.title.toLowerCase().includes(searchLower) ||
          tender.department.toLowerCase().includes(searchLower) ||
          tender.reference_number?.toLowerCase().includes(searchLower) ||
          tender.organization?.toLowerCase().includes(searchLower) ||
          tender.location?.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });
  },

  refreshData: async () => {
    set({ isLoading: true });
    
    try {
      // Force sync with external API
      await tenderApi.syncTenders();
      
      // Request fresh data from the socket server
      socketService.joinTenderDashboard(get().filters);
      
      set({ lastUpdated: new Date() });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error refreshing data',
        isLoading: false 
      });
    }
  },
}));

// Set up auto-refresh every 15 minutes (900000 ms)
if (typeof window !== 'undefined') {
  setInterval(() => {
    useTenderStore.getState().refreshData();
  }, 900000);
} 