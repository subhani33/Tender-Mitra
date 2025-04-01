import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, AlertCircle, Download, Upload } from 'lucide-react';

// Interface for the component props
interface TendersProps {
  onSubmit: () => void;
  isAuthenticated: boolean;
  onLoginRequired: () => void;
}

// Interface for a tender
interface Tender {
  id: string;
  title: string;
  organization: string;
  submissionDeadline: string;
  estimatedValue: string;
  category: string;
  status: 'open' | 'closed' | 'upcoming';
}

const mockTenders: Tender[] = [
  {
    id: '1',
    title: 'Construction of Government Office Building',
    organization: 'Ministry of Urban Development',
    submissionDeadline: '2023-12-15',
    estimatedValue: '₹ 15,00,00,000',
    category: 'Construction',
    status: 'open',
  },
  {
    id: '2',
    title: 'Supply of Computer Hardware',
    organization: 'Ministry of Electronics and IT',
    submissionDeadline: '2023-11-30',
    estimatedValue: '₹ 5,00,00,000',
    category: 'IT Equipment',
    status: 'open',
  },
  {
    id: '3',
    title: 'Healthcare Equipment Procurement',
    organization: 'Ministry of Health and Family Welfare',
    submissionDeadline: '2023-12-10',
    estimatedValue: '₹ 8,50,00,000',
    category: 'Healthcare',
    status: 'open',
  },
  {
    id: '4',
    title: 'Road Construction and Maintenance',
    organization: 'Ministry of Road Transport and Highways',
    submissionDeadline: '2024-01-15',
    estimatedValue: '₹ 25,00,00,000',
    category: 'Infrastructure',
    status: 'upcoming',
  },
  {
    id: '5',
    title: 'Solar Power Plant Installation',
    organization: 'Ministry of New and Renewable Energy',
    submissionDeadline: '2023-10-30',
    estimatedValue: '₹ 12,00,00,000',
    category: 'Energy',
    status: 'closed',
  },
];

// Tenders component
const Tenders: React.FC<TendersProps> = ({ onSubmit, isAuthenticated, onLoginRequired }) => {
  const [tenders, setTenders] = useState<Tender[]>(mockTenders);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Filter tenders based on search term, category, and status
  const filteredTenders = tenders.filter((tender) => {
    const matchesSearch = tender.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         tender.organization.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || tender.category === selectedCategory;
    
    const matchesStatus = selectedStatus === 'All' || tender.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Get unique categories for filter dropdown
  const categories = ['All', ...new Set(tenders.map((tender) => tender.category))];

  // Handle new tender submission
  const handleNewTenderSubmit = () => {
    if (isAuthenticated) {
      onSubmit();
    } else {
      onLoginRequired();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Tenders</h1>
          <p className="text-white/70">Browse and search for government tenders</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <button 
            className="flex items-center gap-2 bg-primary/20 hover:bg-primary/30 text-primary px-4 py-2 rounded-md transition-colors"
            onClick={() => window.open('/tenders.pdf', '_blank')}
          >
            <Download size={16} />
            <span>Export</span>
          </button>
          
          <button 
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-gray-900 px-4 py-2 rounded-md transition-colors"
            onClick={handleNewTenderSubmit}
          >
            <Upload size={16} />
            <span>Submit New Tender</span>
          </button>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-secondary-dark p-4 rounded-lg space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search tenders..."
            className="w-full bg-secondary border border-gray-700 rounded-md py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select
              className="bg-secondary border border-gray-700 rounded-md py-1.5 px-3 text-white"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Status:</span>
            <select
              className="bg-secondary border border-gray-700 rounded-md py-1.5 px-3 text-white"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="All">All</option>
              <option value="open">Open</option>
              <option value="upcoming">Upcoming</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Tenders List */}
      <div className="space-y-4">
        {filteredTenders.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-secondary-dark rounded-lg p-8 text-center">
            <AlertCircle size={48} className="text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-white">No tenders found</h3>
            <p className="text-white/70 mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredTenders.map((tender) => (
            <Link
              key={tender.id}
              to={`/tenders/${tender.id}`}
              className="block bg-secondary-dark border border-gray-800 hover:border-gray-700 rounded-lg overflow-hidden transition-colors"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block w-3 h-3 rounded-full ${
                          tender.status === 'open'
                            ? 'bg-green-500'
                            : tender.status === 'upcoming'
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                      ></span>
                      <span className="text-sm text-white/70 capitalize">{tender.status}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mt-2">{tender.title}</h3>
                    <p className="text-white/70 mt-1">{tender.organization}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div>
                      <p className="text-white/50">Submission Deadline</p>
                      <p className="text-white font-medium">{new Date(tender.submissionDeadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    
                    <div>
                      <p className="text-white/50">Estimated Value</p>
                      <p className="text-primary font-medium">{tender.estimatedValue}</p>
                    </div>
                    
                    <div>
                      <p className="text-white/50">Category</p>
                      <p className="text-white font-medium">{tender.category}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default Tenders;
