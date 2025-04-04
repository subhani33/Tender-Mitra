import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, AlertCircle, Download, Upload, MapPin, Building, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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
  location: string;
  value: number;
  description: string;
  state: string;
  documentUrl: string;
}

// List of Indian states and union territories
const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"
];

// Sample tenders with state information
const mockTenders: Tender[] = [
  // Andhra Pradesh tenders
  {
    id: '1',
    title: 'Construction of new bridge across Krishna River',
    organization: 'Andhra Pradesh Roads Development Corporation',
    submissionDeadline: '2024-08-15',
    estimatedValue: '₹ 25,00,00,000',
    category: 'Infrastructure',
    status: 'open',
    location: 'Vijayawada',
    value: 25000000,
    description: 'Construction of a 2km four-lane bridge across Krishna River connecting Vijayawada and Amaravati',
    state: 'Andhra Pradesh',
    documentUrl: '/documents/tender1.pdf'
  },
  {
    id: '2',
    title: 'Supply of medical equipment to district hospitals',
    organization: 'Andhra Pradesh Medical Services Corporation',
    submissionDeadline: '2024-07-30',
    estimatedValue: '₹ 15,00,00,000',
    category: 'Healthcare',
    status: 'open',
    location: 'Multiple Locations',
    value: 15000000,
    description: 'Supply and installation of advanced medical diagnostic equipment to 12 district hospitals',
    state: 'Andhra Pradesh',
    documentUrl: '/documents/tender2.pdf'
  },
  
  // Maharashtra tenders
  {
    id: '3',
    title: 'Mumbai Metro Line 5 extension project',
    organization: 'Mumbai Metropolitan Region Development Authority',
    submissionDeadline: '2024-09-10',
    estimatedValue: '₹ 12,00,00,000',
    category: 'Transportation',
    status: 'open',
    location: 'Mumbai',
    value: 120000000,
    description: 'Construction of 12 km extension to Mumbai Metro Line 5 with 8 new stations',
    state: 'Maharashtra',
    documentUrl: '/documents/tender3.pdf'
  },
  {
    id: '4',
    title: 'Smart City implementation in Pune',
    organization: 'Pune Municipal Corporation',
    submissionDeadline: '2024-08-05',
    estimatedValue: '₹ 75,00,00,000',
    category: 'Smart City',
    status: 'open',
    location: 'Pune',
    value: 75000000,
    description: 'Implementation of smart city solutions including traffic management, waste management and public WiFi',
    state: 'Maharashtra',
    documentUrl: '/documents/tender4.pdf'
  },
  
  // Karnataka tenders
  {
    id: '5',
    title: 'Bengaluru Suburban Rail Project Phase 1',
    organization: 'Rail Infrastructure Development Company (Karnataka) Ltd',
    submissionDeadline: '2024-10-15',
    estimatedValue: '₹ 23,00,00,000',
    category: 'Railways',
    status: 'upcoming',
    location: 'Bengaluru',
    value: 230000000,
    description: 'Development of suburban railway network connecting Bengaluru city with surrounding areas',
    state: 'Karnataka',
    documentUrl: '/documents/tender5.pdf'
  },
  {
    id: '6',
    title: 'Solar power plant installation',
    organization: 'Karnataka Renewable Energy Development Ltd',
    submissionDeadline: '2024-07-20',
    estimatedValue: '₹ 45,00,00,000',
    category: 'Energy',
    status: 'closed',
    location: 'Tumakuru',
    value: 45000000,
    description: 'Installation of 50 MW solar power plant in Tumakuru district',
    state: 'Karnataka',
    documentUrl: '/documents/tender6.pdf'
  },
  
  // Tamil Nadu tenders
  {
    id: '7',
    title: 'Chennai coastal road development',
    organization: 'Tamil Nadu Road Development Company',
    submissionDeadline: '2024-09-30',
    estimatedValue: '₹ 18,00,00,000',
    category: 'Infrastructure',
    status: 'open',
    location: 'Chennai',
    value: 180000000,
    description: 'Construction of 22 km coastal road connecting Chennai port to Mamallapuram',
    state: 'Tamil Nadu',
    documentUrl: '/documents/tender7.pdf'
  },
  {
    id: '8',
    title: 'Madurai airport expansion',
    organization: 'Airports Authority of India, Tamil Nadu Division',
    submissionDeadline: '2024-11-15',
    estimatedValue: '₹ 95,00,00,000',
    category: 'Aviation',
    status: 'upcoming',
    location: 'Madurai',
    value: 95000000,
    description: 'Expansion of terminal building and runway at Madurai International Airport',
    state: 'Tamil Nadu',
    documentUrl: '/documents/tender8.pdf'
  },
  
  // Delhi tenders
  {
    id: '9',
    title: 'Delhi CCTV surveillance project',
    organization: 'Delhi Police',
    submissionDeadline: '2024-08-20',
    estimatedValue: '₹ 65,00,00,000',
    category: 'Security',
    status: 'open',
    location: 'New Delhi',
    value: 65000000,
    description: 'Installation of advanced CCTV surveillance system across key locations in Delhi',
    state: 'Delhi',
    documentUrl: '/documents/tender9.pdf'
  },
  {
    id: '10',
    title: 'Delhi-Meerut RRTS corridor development',
    organization: 'National Capital Region Transport Corporation',
    submissionDeadline: '2024-12-05',
    estimatedValue: '₹ 32,00,00,000',
    category: 'Transportation',
    status: 'upcoming',
    location: 'Delhi NCR',
    value: 320000000,
    description: 'Development of Delhi-Meerut Regional Rapid Transit System corridor',
    state: 'Delhi',
    documentUrl: '/documents/tender10.pdf'
  },
  
  // Gujarat tenders
  {
    id: '11',
    title: 'Ahmedabad Metro Phase 2',
    organization: 'Gujarat Metro Rail Corporation',
    submissionDeadline: '2024-10-30',
    estimatedValue: '₹ 18,50,00,000',
    category: 'Transportation',
    status: 'open',
    location: 'Ahmedabad',
    value: 185000000,
    description: 'Construction of Phase 2 of Ahmedabad Metro covering 28.2 km with 23 stations',
    state: 'Gujarat',
    documentUrl: '/documents/tender11.pdf'
  },
  {
    id: '12',
    title: 'Surat Smart City development',
    organization: 'Surat Municipal Corporation',
    submissionDeadline: '2024-09-15',
    estimatedValue: '₹ 82,00,00,000',
    category: 'Smart City',
    status: 'open',
    location: 'Surat',
    value: 82000000,
    description: 'Implementation of smart city solutions in Surat including IoT infrastructure and digital services',
    state: 'Gujarat',
    documentUrl: '/documents/tender12.pdf'
  },
  
  // West Bengal tenders
  {
    id: '13',
    title: 'Kolkata drainage system upgrade',
    organization: 'Kolkata Municipal Corporation',
    submissionDeadline: '2024-08-25',
    estimatedValue: '₹ 56,00,00,000',
    category: 'Urban Development',
    status: 'open',
    location: 'Kolkata',
    value: 56000000,
    description: 'Upgrade of drainage and sewage system in flood-prone areas of Kolkata',
    state: 'West Bengal',
    documentUrl: '/documents/tender13.pdf'
  },
  {
    id: '14',
    title: 'Haldia port expansion',
    organization: 'Kolkata Port Trust',
    submissionDeadline: '2024-11-20',
    estimatedValue: '₹ 1,10,00,00,000',
    category: 'Maritime',
    status: 'upcoming',
    location: 'Haldia',
    value: 110000000,
    description: 'Expansion of cargo handling capacity at Haldia port with new berths and equipment',
    state: 'West Bengal',
    documentUrl: '/documents/tender14.pdf'
  },
  
  // Uttar Pradesh tenders
  {
    id: '15',
    title: 'Lucknow-Agra expressway extension',
    organization: 'Uttar Pradesh Expressways Industrial Development Authority',
    submissionDeadline: '2024-10-05',
    estimatedValue: '₹ 195,00,00,000',
    category: 'Infrastructure',
    status: 'open',
    location: 'Multiple locations',
    value: 195000000,
    description: 'Extension of Lucknow-Agra expressway to connect with Delhi-Mumbai expressway',
    state: 'Uttar Pradesh',
    documentUrl: '/documents/tender15.pdf'
  },
  {
    id: '16',
    title: 'Varanasi Smart City project',
    organization: 'Varanasi Smart City Limited',
    submissionDeadline: '2024-09-20',
    estimatedValue: '₹ 68,00,00,000',
    category: 'Smart City',
    status: 'open',
    location: 'Varanasi',
    value: 68000000,
    description: 'Implementation of smart city components including heritage preservation and tourism infrastructure',
    state: 'Uttar Pradesh',
    documentUrl: '/documents/tender16.pdf'
  },
  
  // Rajasthan tenders
  {
    id: '17',
    title: 'Jaipur Metro Phase 2',
    organization: 'Jaipur Metro Rail Corporation',
    submissionDeadline: '2024-11-10',
    estimatedValue: '₹ 14,00,00,000',
    category: 'Transportation',
    status: 'upcoming',
    location: 'Jaipur',
    value: 140000000,
    description: 'Construction of Phase 2 of Jaipur Metro covering east-west corridor of the city',
    state: 'Rajasthan',
    documentUrl: '/documents/tender17.pdf'
  },
  {
    id: '18',
    title: 'Solar park development in Jodhpur',
    organization: 'Rajasthan Renewable Energy Corporation',
    submissionDeadline: '2024-08-30',
    estimatedValue: '₹ 88,00,00,000',
    category: 'Energy',
    status: 'open',
    location: 'Jodhpur',
    value: 88000000,
    description: 'Development of 500 MW solar park in Jodhpur district with transmission infrastructure',
    state: 'Rajasthan',
    documentUrl: '/documents/tender18.pdf'
  }
];

// Tenders component
const Tenders: React.FC<TendersProps> = ({ onSubmit, isAuthenticated, onLoginRequired }) => {
  const [tenders, setTenders] = useState<Tender[]>(mockTenders);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const stateListRef = useRef<HTMLDivElement>(null);

  // Filter tenders based on search term, category, status and state
  const filteredTenders = tenders.filter((tender) => {
    const matchesSearch = 
      searchTerm === '' || 
      tender.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      tender.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || tender.category === selectedCategory;
    
    const matchesStatus = selectedStatus === 'All' || tender.status === selectedStatus;
    
    const matchesState = selectedState === null || tender.state === selectedState;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesState;
  });

  // Get unique categories for filter dropdown
  const categories = ['All', ...new Set(tenders.map((tender) => tender.category))];
  
  // Handle scrolling to a state in the state list
  const scrollToState = (stateInitial: string) => {
    if (stateListRef.current) {
      const stateElements = stateListRef.current.querySelectorAll('[data-state]');
      for (let i = 0; i < stateElements.length; i++) {
        const element = stateElements[i] as HTMLElement;
        if (element.dataset.state && element.dataset.state[0] === stateInitial) {
          element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          break;
        }
      }
    }
  };

  // Handle new tender submission
  const handleNewTenderSubmit = () => {
    if (isAuthenticated) {
      onSubmit();
    } else {
      onLoginRequired();
    }
  };

  // Function to get category icon
  const getCategoryIcon = (category: string) => {
    const iconPath = `/images/tenders/icons/${category.toLowerCase().replace(/\s+/g, '-')}.png`;
    return (
      <img 
        src={iconPath} 
        alt={category}
        className="w-8 h-8 object-contain mr-2"
        onError={(e) => {
          // Fallback to a default icon if the category icon doesn't exist
          (e.target as HTMLImageElement).src = '/images/tenders/icons/default.png';
        }}
      />
    );
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 relative bg-secondary py-12"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Government Tenders</h1>
            <p className="text-gray-400">Explore and apply for government tender opportunities across India</p>
          </div>
          
          <button
            onClick={handleNewTenderSubmit}
            className="px-6 py-3 bg-primary hover:bg-primary/90 text-black font-bold rounded-md transition-colors"
          >
            Submit a Tender
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar with state filters */}
          <div className="bg-secondary-dark rounded-lg p-4">
            <h2 className="text-white font-bold text-lg mb-4">Filter by State</h2>
            
            {/* State search and alphabet quick navigation */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search states..."
                  className="w-full bg-secondary border border-gray-700 rounded-md py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-transparent mb-2"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length > 0) {
                      const matchingState = INDIAN_STATES.find(state => 
                        state.toLowerCase().startsWith(value.toLowerCase())
                      );
                      if (matchingState) {
                        scrollToState(matchingState[0]);
                      }
                    }
                  }}
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
              
              <div className="flex flex-wrap mb-2">
                {/* Alphabet quick navigation */}
                {Array.from(new Set(INDIAN_STATES.map(state => state[0]))).sort().map(letter => (
                  <button 
                    key={letter}
                    className="w-7 h-7 flex items-center justify-center text-white border border-gray-700 rounded-md hover:bg-primary hover:text-black mr-1 mb-1"
                    onClick={() => scrollToState(letter)}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Scrollable state list */}
            <div 
              ref={stateListRef}
              className="max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary scrollbar-track-gray-800" 
            >
              <button
                className={`w-full text-left px-3 py-2 rounded-md mb-1 transition-colors ${
                  selectedState === null ? 'bg-primary text-black' : 'hover:bg-gray-800 text-white'
                }`}
                onClick={() => setSelectedState(null)}
              >
                All States
              </button>
              
              {INDIAN_STATES.map(state => {
                // Count tenders for this state
                const stateCount = tenders.filter(t => t.state === state).length;
                
                if (stateCount === 0) return null;
                
                return (
                  <button
                    key={state}
                    data-state={state}
                    className={`w-full text-left px-3 py-2 rounded-md mb-1 transition-colors flex justify-between items-center ${
                      selectedState === state ? 'bg-primary text-black' : 'hover:bg-gray-800 text-white'
                    }`}
                    onClick={() => setSelectedState(state === selectedState ? null : state)}
                  >
                    <span>{state}</span>
                    <span className="bg-gray-700 text-xs px-2 py-1 rounded-full">{stateCount}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Main content */}
          <div className="lg:col-span-3">
            {/* Filters */}
            <div className="bg-secondary-dark p-4 rounded-lg space-y-4 mb-6">
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
                
                {selectedState && (
                  <div className="flex items-center gap-2 ml-auto">
                    <MapPin size={18} className="text-primary" />
                    <span className="text-white font-medium">{selectedState}</span>
                    <button 
                      onClick={() => setSelectedState(null)}
                      className="ml-2 text-gray-400 hover:text-white"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* State information banner when state is selected */}
            {selectedState && (
              <div className="bg-secondary-dark rounded-lg p-4 mb-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <img 
                    src={`/images/tenders/by-state/${selectedState.toLowerCase().replace(/\s+/g, '-')}.jpg`} 
                    alt={selectedState}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/tenders/by-state/india.jpg';
                    }}
                  />
                </div>
                <div className="relative z-10">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">{selectedState} Tenders</h3>
                    <span className="bg-primary text-black px-3 py-1 rounded-full text-sm font-medium">
                      {filteredTenders.length} tender{filteredTenders.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="text-gray-300 mt-2">
                    Browse the latest government tenders from {selectedState}
                  </p>
                </div>
              </div>
            )}
            
            {/* Tenders List */}
            {filteredTenders.length === 0 ? (
              <div className="bg-secondary-dark rounded-lg p-6 text-center">
                <AlertCircle className="mx-auto mb-4 text-yellow-500" size={48} />
                <h3 className="text-xl font-bold text-white mb-2">No tenders found</h3>
                <p className="text-gray-400">
                  {selectedState 
                    ? `No tenders found for ${selectedState} with the current filters.`
                    : 'No tenders match your current search criteria.'}
                </p>
                <button
                  className="mt-4 px-4 py-2 bg-primary text-black font-medium rounded-md"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                    setSelectedStatus('All');
                    setSelectedState(null);
                  }}
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTenders.map((tender) => (
                  <Link
                    key={tender.id}
                    to={`/tenders/${tender.id}`}
                    className="bg-secondary-dark border border-gray-800 rounded-lg overflow-hidden hover:border-primary transition-all duration-300"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          tender.status === 'open' ? 'bg-green-900/50 text-green-400' :
                          tender.status === 'upcoming' ? 'bg-blue-900/50 text-blue-400' :
                          'bg-red-900/50 text-red-400'
                        }`}>
                          {tender.status.charAt(0).toUpperCase() + tender.status.slice(1)}
                        </span>
                        <span className="text-primary font-bold">{formatCurrency(tender.value)}</span>
                      </div>
                      
                      <h3 className="text-white text-xl font-bold mb-2">{tender.title}</h3>
                      
                      <div className="mb-4 flex items-center text-gray-400 text-sm">
                        <Building size={16} className="mr-1" />
                        <span>{tender.organization}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                        <div className="flex items-center text-gray-400">
                          <Calendar size={16} className="mr-2 text-gray-500" />
                          <span>
                            {new Date(tender.submissionDeadline) > new Date() ? 
                              `Closes in ${formatDistanceToNow(new Date(tender.submissionDeadline))}` : 
                              'Closed'}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-gray-400">
                          <MapPin size={16} className="mr-2 text-gray-500" />
                          <span>{tender.location}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center mt-4">
                        <div className="mr-2">
                          {getCategoryIcon(tender.category)}
                        </div>
                        <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs">
                          {tender.category}
                        </span>
                        <span className="ml-auto text-primary text-sm">View details →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Tenders;
