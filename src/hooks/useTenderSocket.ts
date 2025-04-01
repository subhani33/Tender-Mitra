import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { Tender, TenderFilters } from '../types';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function useTenderSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Initialize socket connection
  useEffect(() => {
    const socketInstance = io(SOCKET_URL);
    
    socketInstance.on('connect', () => {
      setIsConnected(true);
      setError(null);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (err) => {
      setIsConnected(false);
      setError(`Connection error: ${err.message}`);
    });

    socketInstance.on('tenders-data', (data) => {
      setTenders(data.tenders);
      setLoading(false);
      setLastUpdated(new Date());
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Join the tender dashboard with initial filters
  useEffect(() => {
    if (socket && isConnected) {
      socket.emit('join-tender-dashboard', {});
    }
  }, [socket, isConnected]);

  // Update filters function
  const updateFilters = useCallback((filters: TenderFilters) => {
    if (socket && isConnected) {
      setLoading(true);
      socket.emit('update-filters', filters);
    }
  }, [socket, isConnected]);

  // Force refresh function
  const refreshTenders = useCallback(() => {
    if (socket && isConnected) {
      setLoading(true);
      socket.emit('refresh-tenders');
    }
  }, [socket, isConnected]);

  return {
    tenders,
    loading,
    error,
    isConnected,
    lastUpdated,
    updateFilters,
    refreshTenders
  };
} 