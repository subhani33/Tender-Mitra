import axios from 'axios';
import { Tender, TenderFilters } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for CSRF to work with cookies
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // For non-GET requests, get CSRF token if making requests to protected endpoints
  const protectedEndpoints = [
    '/api/auth/change-password',
    '/api/auth/update-profile',
    '/api/bids/submit'
  ];
  
  if (
    ['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '') &&
    protectedEndpoints.some(endpoint => config.url?.includes(endpoint))
  ) {
    try {
      // Get CSRF token
      const csrfResponse = await axios.get(`${API_URL}/api/csrf-token`, { withCredentials: true });
      const csrfToken = csrfResponse.data.data.csrfToken;
      config.headers['x-csrf-token'] = csrfToken;
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error);
    }
  }
  
  return config;
});

export const tenderApi = {
  // Get all tenders with optional filters
  getTenders: async (filters?: TenderFilters) => {
    const response = await api.get('/api/tenders', { params: filters });
    return response.data;
  },

  // Get a single tender by ID
  getTenderById: async (id: string) => {
    const response = await api.get(`/api/tenders/${id}`);
    return response.data;
  },

  // Force sync with external API
  syncTenders: async () => {
    const response = await api.post('/api/tenders/sync');
    return response.data;
  },
};

export default tenderApi; 