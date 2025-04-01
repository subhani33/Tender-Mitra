import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui';
import { useNavigate } from 'react-router-dom';

interface Tender {
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

interface TenderDashboardProps {
  onNotify?: (message: string) => void;
}

const TenderDashboard: React.FC<TenderDashboardProps> = ({ onNotify }) => {
  const navigate = useNavigate();
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [filteredTenders, setFilteredTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [sortBy, setSortBy] = useState<'value' | 'deadline' | 'title'>('deadline');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [showRealTimeIndicator, setShowRealTimeIndicator] = useState(false);
  const [savedTenders, setSavedTenders] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Refs for animations
  const pulseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Categories and departments derived from tender data
  const [categories, setCategories] = useState<string[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);

  // Mock data for fallback
  const mockTenders = [
    {
      id: 1,
      title: 'Road Construction Project',
      department: 'Public Works',
      deadline: '2025-05-01',
      value: 1000000,
      status: 'active',
      description: 'Construction of 5km road with modern infrastructure',
      issuer: 'Government of India',
      category: 'Infrastructure'
    },
    {
      id: 2,
      title: 'Hospital Equipment Supply',
      department: 'Healthcare',
      deadline: '2025-06-15',
      value: 500000,
      status: 'active',
      description: 'Supply of medical equipment for new hospital wing',
      issuer: 'Ministry of Health',
      category: 'Healthcare'
    },
    {
      id: 3,
      title: 'Education Software Development',
      department: 'Education',
      deadline: '2025-07-10',
      value: 750000,
      status: 'active',
      description: 'Development of educational software for public schools',
      issuer: 'Ministry of Education',
      category: 'Technology'
    },
    {
      id: 4,
      title: 'Smart City Infrastructure',
      department: 'Urban Development',
      deadline: '2025-08-20',
      value: 1500000,
      status: 'active',
      description: 'Implementation of IoT solutions for urban management',
      issuer: 'Smart Cities Mission',
      category: 'Technology'
    },
    {
      id: 5,
      title: 'Agricultural Research Program',
      department: 'Agriculture',
      deadline: '2025-04-30',
      value: 300000,
      status: 'active',
      description: 'Research on crop yield improvement in drought conditions',
      issuer: 'Ministry of Agriculture',
      category: 'Research'
    },
    {
      id: 6,
      title: 'Defense Equipment Procurement',
      department: 'Defense',
      deadline: '2025-09-15',
      value: 2000000,
      status: 'active',
      description: 'Procurement of advanced surveillance equipment',
      issuer: 'Ministry of Defense',
      category: 'Defense'
    }
  ];

  // Simulate WebSocket connection for real-time updates
  useEffect(() => {
    console.log('Setting up simulated WebSocket connection...');
    
    // Function to trigger real-time indicator animation
    const pulseRealTimeIndicator = () => {
      setShowRealTimeIndicator(true);
      
      if (pulseTimeoutRef.current) {
        clearTimeout(pulseTimeoutRef.current);
      }
      
      pulseTimeoutRef.current = setTimeout(() => {
        setShowRealTimeIndicator(false);
      }, 2000);
    };
    
    // Simulate receiving a new tender every 20-40 seconds
    const updateInterval = setInterval(() => {
      const randomChance = Math.random();
      
      if (randomChance > 0.7) {
        pulseRealTimeIndicator();
        
        // Add a new mock tender
        const newTender = {
          id: tenders.length + 100, // Ensure unique ID
          title: `New Tender Opportunity ${Math.floor(Math.random() * 1000)}`,
          department: departments[Math.floor(Math.random() * departments.length)] || 'New Department',
          deadline: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: Math.floor(Math.random() * 1000000) + 100000,
          status: 'active',
          description: 'New tender opportunity just added to the platform.',
          issuer: 'Government of India',
          category: categories[Math.floor(Math.random() * categories.length)] || 'General'
        };
        
        setTenders(prev => [newTender, ...prev]);
        
        if (onNotify) {
          onNotify(`New tender added: ${newTender.title}`);
        }
      }
    }, Math.floor(Math.random() * 20000) + 20000); // Random interval between 20-40 seconds
    
    return () => {
      clearInterval(updateInterval);
      if (pulseTimeoutRef.current) {
        clearTimeout(pulseTimeoutRef.current);
      }
    };
  }, [onNotify, tenders.length, categories, departments]);

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        console.log('Fetching tenders from API...');
        const response = await fetch('/api/tenders');
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received data:', data);
        
        if (data.status === 'success' && data.data.tenders) {
          setTenders(data.data.tenders);
          setFilteredTenders(data.data.tenders);
          
          // Extract unique categories and departments
          const uniqueCategories = Array.from(
            new Set(data.data.tenders.map((tender: Tender) => tender.category))
          );
          setCategories(uniqueCategories as string[]);
          
          const uniqueDepartments = Array.from(
            new Set(data.data.tenders.map((tender: Tender) => tender.department))
          );
          setDepartments(uniqueDepartments as string[]);
          
          if (onNotify) {
            onNotify('Tenders loaded successfully!');
          }
        } else {
          throw new Error('Invalid data format received from API');
        }
      } catch (err) {
        console.error('Error fetching tenders:', err);
        setError(`Failed to load tenders. Using mock data instead.`);
        
        // Fallback to mock data
        setTenders(mockTenders);
        setFilteredTenders(mockTenders);
        
        // Extract unique categories and departments from mock data
        const uniqueCategories = Array.from(
          new Set(mockTenders.map(tender => tender.category))
        );
        setCategories(uniqueCategories as string[]);
        
        const uniqueDepartments = Array.from(
          new Set(mockTenders.map(tender => tender.department))
        );
        setDepartments(uniqueDepartments as string[]);
      } finally {
        setLoading(false);
      }
    };

    fetchTenders();
  }, [onNotify]);

  // Filter and sort tenders based on search query, category, and department
  useEffect(() => {
    let results = [...tenders];
    
    // Apply filtering
    if (searchQuery || filterCategory || filterDepartment) {
      results = results.filter(tender => {
        const matchesSearch = searchQuery 
          ? (
              tender.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              tender.description.toLowerCase().includes(searchQuery.toLowerCase())
            )
          : true;
          
        const matchesCategory = filterCategory 
          ? tender.category === filterCategory 
          : true;
          
        const matchesDepartment = filterDepartment
          ? tender.department === filterDepartment
          : true;
          
        return matchesSearch && matchesCategory && matchesDepartment;
      });
    }
    
    // Apply sorting
    results.sort((a, b) => {
      if (sortBy === 'value') {
        return sortOrder === 'asc' ? a.value - b.value : b.value - a.value;
      } else if (sortBy === 'deadline') {
        return sortOrder === 'asc' 
          ? new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
          : new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
      } else {
        return sortOrder === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
    });
    
    setFilteredTenders(results);
  }, [searchQuery, filterCategory, filterDepartment, tenders, sortBy, sortOrder]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleCategoryFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterCategory(e.target.value);
  };
  
  const handleDepartmentFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterDepartment(e.target.value);
  };
  
  const handleSort = (field: 'value' | 'deadline' | 'title') => {
    if (sortBy === field) {
      // Toggle between ascending and descending
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };
  
  const handleSaveTender = (tenderId: number, tenderTitle: string) => {
    if (savedTenders.includes(tenderId)) {
      // Remove from saved
      setSavedTenders(savedTenders.filter(id => id !== tenderId));
      if (onNotify) onNotify(`Tender "${tenderTitle}" removed from saved items`);
    } else {
      // Add to saved
      setSavedTenders([...savedTenders, tenderId]);
      if (onNotify) onNotify(`Tender "${tenderTitle}" saved successfully!`);
    }
  };
  
  const handleSubmitBid = (tenderId: number, tenderTitle: string) => {
    navigate(`/bids?tenderId=${tenderId}&tenderTitle=${encodeURIComponent(tenderTitle)}`);
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    setFilterCategory('');
    setFilterDepartment('');
    setSortBy('deadline');
    setSortOrder('asc');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[#D4AF37] ml-4 text-xl">Loading tenders...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative">
        <h1 className="text-3xl font-cinzel text-[#D4AF37] mb-8 text-center">Available Tenders</h1>
        
        {/* Real-time indicator */}
        <div className="absolute top-0 right-0 flex items-center">
          <span className="mr-2 text-white/60 text-sm">Live Updates</span>
          <span className={`inline-block w-3 h-3 rounded-full ${
            showRealTimeIndicator ? 'bg-green-500 animate-pulse' : 'bg-green-500/50'
          }`}></span>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-900/20 border border-red-500/50 text-white p-4 mb-6 rounded">
          {error}
        </div>
      )}
      
      {/* Search and filter section */}
      <div className="max-w-5xl mx-auto mb-8 bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-[#D4AF37]/20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-cinzel text-[#D4AF37]">Search & Filter</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-[#D4AF37] hover:text-[#D4AF37]/80 flex items-center"
          >
            {showFilters ? 'Hide Filters' : 'Show All Filters'}
            <svg 
              className={`ml-1 h-5 w-5 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        
        {/* Basic search */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by title or description..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full bg-[#1A2A44] border border-[#D4AF37]/30 rounded-md p-3 pl-10 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
            />
            <svg 
              className="absolute left-3 top-3.5 h-5 w-5 text-white/40" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-white/40 hover:text-white"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
        
        {/* Extended filters section */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-[#D4AF37] mb-2 font-medium">Filter by Category</label>
                  <select
                    value={filterCategory}
                    onChange={handleCategoryFilter}
                    className="w-full bg-[#1A2A44] border border-[#D4AF37]/30 rounded p-2 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-[#D4AF37] mb-2 font-medium">Filter by Department</label>
                  <select
                    value={filterDepartment}
                    onChange={handleDepartmentFilter}
                    className="w-full bg-[#1A2A44] border border-[#D4AF37]/30 rounded p-2 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                  >
                    <option value="">All Departments</option>
                    {departments.map(department => (
                      <option key={department} value={department}>{department}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-[#D4AF37] mb-2 font-medium">Sort By</label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSort('deadline')}
                      className={`px-3 py-2 rounded ${
                        sortBy === 'deadline' 
                          ? 'bg-[#D4AF37] text-[#1A2A44]' 
                          : 'bg-[#1A2A44] text-white/70 hover:text-white'
                      } flex items-center`}
                    >
                      Deadline
                      {sortBy === 'deadline' && (
                        <svg
                          className={`ml-1 h-4 w-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => handleSort('value')}
                      className={`px-3 py-2 rounded ${
                        sortBy === 'value' 
                          ? 'bg-[#D4AF37] text-[#1A2A44]' 
                          : 'bg-[#1A2A44] text-white/70 hover:text-white'
                      } flex items-center`}
                    >
                      Value
                      {sortBy === 'value' && (
                        <svg
                          className={`ml-1 h-4 w-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => handleSort('title')}
                      className={`px-3 py-2 rounded ${
                        sortBy === 'title' 
                          ? 'bg-[#D4AF37] text-[#1A2A44]' 
                          : 'bg-[#1A2A44] text-white/70 hover:text-white'
                      } flex items-center`}
                    >
                      Title
                      {sortBy === 'title' && (
                        <svg
                          className={`ml-1 h-4 w-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Clear filters button */}
              <div className="flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-[#D4AF37] hover:text-[#D4AF37]/80"
                >
                  Clear All Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Results count */}
      <p className="text-white/60 mb-4 text-center">
        Showing {filteredTenders.length} of {tenders.length} tenders
      </p>
      
      {/* Tender cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredTenders.map((tender) => (
            <motion.div
              key={tender.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              whileHover={{ 
                y: -10, 
                boxShadow: '0 10px 25px rgba(212, 175, 55, 0.2)',
                transition: { duration: 0.2 }
              }}
              onHoverStart={() => setHoveredId(tender.id)}
              onHoverEnd={() => setHoveredId(null)}
            >
              <Card className={`bg-white/5 backdrop-blur-sm border ${
                hoveredId === tender.id
                  ? 'border-[#D4AF37]'
                  : 'border-[#D4AF37]/20'
              } h-full transition-colors duration-200`}>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-cinzel text-[#D4AF37]">{tender.title}</h2>
                    <span className="text-xs px-2 py-1 bg-[#D4AF37]/20 text-[#D4AF37] rounded-full">
                      {tender.category}
                    </span>
                  </div>
                  <p className="text-white/80 mb-4">{tender.description}</p>
                  <div className="space-y-2">
                    <p className="text-white/60">Department: {tender.department}</p>
                    <p className="text-white/60">Value: ₹{tender.value.toLocaleString()}</p>
                    
                    <div className="flex items-center">
                      <p className="text-white/60 mr-2">Deadline: {tender.deadline}</p>
                      
                      {/* Show urgency indicator based on deadline */}
                      {(() => {
                        const today = new Date();
                        const deadline = new Date(tender.deadline);
                        const daysUntilDeadline = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                        
                        if (daysUntilDeadline < 30) {
                          return (
                            <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-500 rounded-full whitespace-nowrap">
                              {daysUntilDeadline <= 0 ? 'Expired' : `${daysUntilDeadline} days left`}
                            </span>
                          );
                        }
                        return null;
                      })()}
                    </div>
                    
                    <p className="text-white/60">Issuer: {tender.issuer}</p>
                  </div>
                  
                  {/* Action buttons that animate on hover */}
                  <div className="mt-4 pt-4 border-t border-white/10 flex justify-between">
                    <motion.button 
                      className={`px-3 py-1 ${
                        savedTenders.includes(tender.id)
                          ? 'bg-[#D4AF37]/30 text-[#D4AF37]'
                          : 'bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37]'
                      } rounded-md transition-colors flex items-center`}
                      onClick={() => handleSaveTender(tender.id, tender.title)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {savedTenders.includes(tender.id) ? (
                        <>
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z" clipRule="evenodd" />
                          </svg>
                          Saved
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                          Save
                        </>
                      )}
                    </motion.button>
                    
                    <motion.button 
                      className="px-3 py-1 bg-[#D4AF37] hover:bg-[#D4AF37]/80 text-[#1A2A44] rounded-md font-medium transition-colors flex items-center"
                      onClick={() => handleSubmitBid(tender.id, tender.title)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                      </svg>
                      Submit Bid
                    </motion.button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {/* No results message */}
      {filteredTenders.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-10 bg-white/5 backdrop-blur-sm rounded-lg border border-[#D4AF37]/20 max-w-lg mx-auto"
        >
          <svg className="w-16 h-16 text-[#D4AF37]/40 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-white/60 mb-4">No tenders match your search criteria.</p>
          <motion.button
            onClick={clearFilters}
            className="px-4 py-2 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] rounded-md transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Clear All Filters
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default TenderDashboard;