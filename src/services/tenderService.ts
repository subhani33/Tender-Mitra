import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export interface Tender {
  id: number;
  title: string;
  department: string;
  deadline: string;
  value: number;
  status: string;
  description: string;
  issuer: string;
  category: string;
}

export const tenderService = {
  async getTenders(): Promise<Tender[]> {
    try {
      const response = await axios.get(`${API_URL}/tenders`);
      return response.data.data.tenders;
    } catch (error) {
      console.error('Error fetching tenders:', error);
      return [];
    }
  },

  async getTenderById(id: number): Promise<Tender | null> {
    try {
      const response = await axios.get(`${API_URL}/tenders/${id}`);
      return response.data.data.tender;
    } catch (error) {
      console.error('Error fetching tender:', error);
      return null;
    }
  }
}; 