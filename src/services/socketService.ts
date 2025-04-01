import { io, Socket } from 'socket.io-client';
import { Tender, TenderFilters } from '../types/tender';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class SocketService {
  private socket: Socket | null = null;
  private tendersCallback: ((tenders: Tender[]) => void) | null = null;
  private errorCallback: ((error: any) => void) | null = null;
  
  init() {
    if (this.socket) return;
    
    this.socket = io(API_URL);
    
    this.socket.on('connect', () => {
      console.log('Connected to tender data socket');
      this.joinTenderDashboard();
    });
    
    this.socket.on('tenders-data', (data: { tenders: Tender[] }) => {
      if (this.tendersCallback) {
        this.tendersCallback(data.tenders);
      }
    });
    
    this.socket.on('error', (error: any) => {
      console.error('Socket error:', error);
      if (this.errorCallback) {
        this.errorCallback(error);
      }
    });
    
    this.socket.on('disconnect', () => {
      console.log('Disconnected from tender data socket');
    });
  }
  
  joinTenderDashboard(filters: TenderFilters = {}) {
    if (!this.socket) {
      this.init();
      return;
    }
    
    this.socket.emit('join-tender-dashboard', filters);
  }
  
  updateFilters(filters: TenderFilters) {
    if (!this.socket) return;
    this.socket.emit('update-filters', filters);
  }
  
  onTendersUpdate(callback: (tenders: Tender[]) => void) {
    this.tendersCallback = callback;
  }
  
  onError(callback: (error: any) => void) {
    this.errorCallback = callback;
  }
  
  disconnect() {
    if (!this.socket) return;
    this.socket.disconnect();
    this.socket = null;
    this.tendersCallback = null;
    this.errorCallback = null;
  }
}

export default new SocketService(); 