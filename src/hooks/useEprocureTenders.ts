import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { Tender, TenderFilters, TenderStats, SyncStatus } from '../types';

// Fallback data for development or when socket connection fails
const mockTenders: Tender[] = [
  {
    _id: "t1001",
    title: "Supply of IT Equipment for Government Offices",
    referenceNumber: "GOV/IT/2023/001",
    department: "Ministry of Technology",
    value: 7500000,
    deadline: "2023-12-15T00:00:00.000Z",
    status: "Open",
    description: "Supply and installation of high-end computers, servers, and networking equipment for government offices across major cities.",
    location: "Mumbai, Delhi, Chennai",
    category: "IT & Technology",
    createdAt: "2023-09-15T00:00:00.000Z",
    updatedAt: "2023-09-15T00:00:00.000Z"
  },
  {
    _id: "t1002",
    title: "Construction of Luxury Hotel Complex",
    referenceNumber: "TOUR/CON/2023/015",
    department: "Department of Tourism",
    value: 250000000,
    deadline: "2023-11-30T00:00:00.000Z",
    status: "Closing Soon",
    description: "Development of a 5-star luxury hotel complex with 200 rooms, conference facilities, and spa services in a prime beach location.",
    location: "Goa",
    category: "Construction",
    createdAt: "2023-09-01T00:00:00.000Z",
    updatedAt: "2023-09-01T00:00:00.000Z"
  },
  {
    _id: "t1003",
    title: "Smart City Infrastructure Development",
    referenceNumber: "URB/DEV/2023/078",
    department: "Ministry of Urban Development",
    value: 120000000,
    deadline: "2024-01-20T00:00:00.000Z",
    status: "Open",
    description: "Implementation of smart city solutions including IoT sensors, traffic management systems, and public Wi-Fi infrastructure.",
    location: "Pune",
    category: "Infrastructure",
    createdAt: "2023-08-20T00:00:00.000Z",
    updatedAt: "2023-08-20T00:00:00.000Z"
  },
  {
    _id: "t1004",
    title: "Supply of Medical Equipment for Hospitals",
    referenceNumber: "HEALTH/MED/2023/022",
    department: "Ministry of Health",
    value: 35000000,
    deadline: "2023-10-30T00:00:00.000Z",
    status: "Under Review",
    description: "Procurement of advanced medical diagnostic equipment, ICU facilities, and hospital furniture for government hospitals.",
    location: "Nationwide",
    category: "Healthcare",
    createdAt: "2023-07-15T00:00:00.000Z", 
    updatedAt: "2023-07-15T00:00:00.000Z"
  },
  {
    _id: "t1005",
    title: "Airport Terminal Expansion Project",
    referenceNumber: "AVN/EXP/2023/003",
    department: "Ministry of Civil Aviation",
    value: 450000000,
    deadline: "2023-12-05T00:00:00.000Z",
    status: "Open",
    description: "Expansion of existing airport terminal to increase passenger capacity, including new gates, lounges, and retail spaces.",
    location: "Hyderabad",
    category: "Aviation",
    createdAt: "2023-06-10T00:00:00.000Z",
    updatedAt: "2023-06-10T00:00:00.000Z"
  }
];

// Calculate mock stats
const mockStats: TenderStats = {
  counts: {
    total: mockTenders.length,
    open: mockTenders.filter(t => t.status === "Open").length,
    closingSoon: mockTenders.filter(t => t.status === "Closing Soon").length,
    closed: mockTenders.filter(t => t.status === "Closed").length
  },
  values: {
    total: mockTenders.reduce((sum, tender) => sum + tender.value, 0),
    average: mockTenders.reduce((sum, tender) => sum + tender.value, 0) / mockTenders.length
  },
  departments: [],
  categories: []
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const USE_MOCK_DATA = true; // Toggle for development when server unavailable

export function useEprocureTenders() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [stats, setStats] = useState<TenderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({ 
    status: 'idle', 
    message: 'Ready to sync' 
  });

  // Apply filters locally (for quick filtering without server roundtrip)
  const filterTendersLocally = useCallback((filters: TenderFilters) => {
    if (!tenders.length) return [];
    
    return tenders.filter(tender => {
      // Status filter
      if (filters.status && tender.status !== filters.status) {
        return false;
      }
      
      // Department filter
      if (filters.department && tender.department !== filters.department) {
        return false;
      }
      
      // Value range filter
      if (filters.minValue && tender.value < filters.minValue) {
        return false;
      }
      
      if (filters.maxValue && tender.value > filters.maxValue) {
        return false;
      }
      
      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const titleMatch = tender.title.toLowerCase().includes(searchLower);
        const deptMatch = tender.department.toLowerCase().includes(searchLower);
        const refMatch = tender.referenceNumber.toLowerCase().includes(searchLower);
        
        if (!titleMatch && !deptMatch && !refMatch) {
          return false;
        }
      }
      
      // Category filter
      if (filters.category && tender.category !== filters.category) {
        return false;
      }
      
      // Location filter
      if (filters.location && tender.location !== filters.location) {
        return false;
      }
      
      return true;
    });
  }, [tenders]);

  // Function to load mock data for development
  const loadMockData = useCallback(() => {
    setLoading(true);
    setSyncStatus({ status: 'syncing', message: 'Loading mock data...' });
    
    // Simulate network delay
    setTimeout(() => {
      setTenders(mockTenders);
      setStats(mockStats);
      setLastUpdated(new Date());
      setSyncStatus({ 
        status: 'completed', 
        message: 'Mock data loaded successfully',
        timestamp: new Date().toISOString()
      });
      setIsConnected(true);
      setLoading(false);
    }, 800);
  }, []);

  // Initialize socket connection or mock data
  useEffect(() => {
    if (USE_MOCK_DATA) {
      loadMockData();
      return;
    }
    
    const socketInstance = io(API_URL);
    
    socketInstance.on('connect', () => {
      setIsConnected(true);
      setError(null);
      console.log('Socket connected');
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      console.log('Socket disconnected');
    });

    socketInstance.on('connect_error', (err) => {
      setIsConnected(false);
      setError(`Connection error: ${err.message}`);
      console.error('Socket connection error:', err);
      // Fallback to mock data on connection error
      loadMockData();
    });

    socketInstance.on('tenders-data', (data) => {
      setTenders(data.tenders || []);
      if (data.stats) setStats(data.stats);
      if (data.lastUpdated) setLastUpdated(new Date(data.lastUpdated));
      setLoading(false);
      console.log('Received tenders data:', data.tenders?.length || 0, 'tenders');
    });

    socketInstance.on('sync-status', (status) => {
      setSyncStatus(status);
      console.log('Sync status update:', status);
      
      // If sync completed, update lastUpdated
      if (status.status === 'completed' && status.timestamp) {
        setLastUpdated(new Date(status.timestamp));
      }
    });

    socketInstance.on('error', (err) => {
      setError(err.message || 'An unknown error occurred');
      console.error('Socket error:', err);
    });

    setSocket(socketInstance);

    return () => {
      console.log('Cleaning up socket connection');
      socketInstance.disconnect();
    };
  }, [loadMockData]);

  // Join the tender dashboard with initial filters (only if using socket)
  useEffect(() => {
    if (!USE_MOCK_DATA && socket && isConnected) {
      console.log('Joining tender dashboard');
      socket.emit('join-tender-dashboard', {});
    }
  }, [socket, isConnected]);

  // Update filters function
  const updateFilters = useCallback((filters: TenderFilters) => {
    if (USE_MOCK_DATA) {
      // If using mock data, just filter locally
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 300);
      return;
    }
    
    if (socket && isConnected) {
      setLoading(true);
      console.log('Updating filters:', filters);
      socket.emit('update-filters', filters);
    } else {
      console.warn('Cannot update filters: socket not connected');
    }
  }, [socket, isConnected]);

  // Force refresh function
  const refreshTenders = useCallback(() => {
    if (USE_MOCK_DATA) {
      loadMockData();
      return;
    }
    
    if (socket && isConnected) {
      setLoading(true);
      console.log('Requesting tender refresh');
      socket.emit('refresh-tenders');
    } else {
      console.warn('Cannot refresh tenders: socket not connected');
      // Fallback to mock data if socket not connected
      loadMockData();
    }
  }, [socket, isConnected, loadMockData]);

  return {
    tenders,
    stats,
    loading,
    error,
    isConnected,
    lastUpdated,
    syncStatus,
    updateFilters,
    refreshTenders,
    filterTendersLocally
  };
} 