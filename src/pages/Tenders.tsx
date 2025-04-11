import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, AlertCircle, Download, Upload, MapPin, Building, Calendar, DollarSign, SortDesc, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import IndiaStatesTenderList from '../components/common/IndiaStatesTenderList';

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

// Group states by their first letter for the scrollbar index
const STATE_INDEX = Array.from(new Set(INDIAN_STATES.map(state => state[0]))).sort();

// Original mock tenders (updated with optimized deadlines)
const originalMockTenders: Tender[] = [
  // Andhra Pradesh tenders
  {
    id: '1',
    title: 'Construction of new bridge across Krishna River',
    organization: 'Andhra Pradesh Roads Development Corporation',
    submissionDeadline: '2025-10-15',
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
    submissionDeadline: '2025-07-28',
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
    submissionDeadline: '2025-11-10',
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
    submissionDeadline: '2025-07-25',
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
    submissionDeadline: '2025-12-15',
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
    submissionDeadline: '2025-06-30',
    estimatedValue: '₹ 45,00,00,000',
    category: 'Energy',
    status: 'open',
    location: 'Tumakuru',
    value: 45000000,
    description: 'Installation of 50 MW solar power plant in Tumakuru district',
    state: 'Karnataka',
    documentUrl: '/documents/tender6.pdf'
  }
];

// Updated tenders for May 2025
const mayTenders: Tender[] = [
  {
    id: 'may-2025-1',
    title: 'Road Construction Project',
    organization: 'Ministry of Road Transport and Highways',
    submissionDeadline: '2025-05-15',
    estimatedValue: '₹ 75,00,00,000',
    category: 'Infrastructure',
    status: 'open',
    location: 'Chennai',
    value: 750000000,
    description: 'Construction of 45km highway connecting Chennai suburbs with enhanced safety features and smart traffic management systems.',
    state: 'Tamil Nadu',
    documentUrl: '/documents/road-construction-project.pdf'
  },
  {
    id: 'may-2025-2',
    title: 'Hospital Equipment Supply',
    organization: 'Ministry of Health and Family Welfare',
    submissionDeadline: '2025-05-20',
    estimatedValue: '₹ 35,00,00,000',
    category: 'Healthcare',
    status: 'open',
    location: 'Mumbai',
    value: 350000000,
    description: 'Supply of advanced diagnostic and surgical equipment to 15 government hospitals across Maharashtra.',
    state: 'Maharashtra',
    documentUrl: '/documents/hospital-equipment-supply.pdf'
  },
  {
    id: 'may-2025-3',
    title: 'Water Supply Infrastructure',
    organization: 'Ministry of Jal Shakti',
    submissionDeadline: '2025-05-25',
    estimatedValue: '₹ 120,00,00,000',
    category: 'Utilities',
    status: 'open',
    location: 'Jaipur',
    value: 1200000000,
    description: 'Development of integrated water supply network for Jaipur and surrounding areas with water treatment facilities.',
    state: 'Rajasthan',
    documentUrl: '/documents/water-supply-infrastructure.pdf'
  },
  {
    id: 'may-2025-4',
    title: 'Smart City Surveillance System',
    organization: 'Ministry of Housing and Urban Affairs',
    submissionDeadline: '2025-05-10',
    estimatedValue: '₹ 28,00,00,000',
    category: 'Smart City',
    status: 'open',
    location: 'Bhubaneswar',
    value: 280000000,
    description: 'Implementation of AI-powered surveillance system with facial recognition for enhanced urban security.',
    state: 'Odisha',
    documentUrl: '/documents/smart-city-surveillance.pdf'
  },
  {
    id: 'may-2025-5',
    title: 'Solar Power Plant Installation',
    organization: 'Ministry of New and Renewable Energy',
    submissionDeadline: '2025-05-30',
    estimatedValue: '₹ 65,00,00,000',
    category: 'Energy',
    status: 'upcoming',
    location: 'Ahmedabad',
    value: 650000000,
    description: 'Installation of 100MW solar power plant with grid connectivity and distribution infrastructure.',
    state: 'Gujarat',
    documentUrl: '/documents/solar-power-installation.pdf'
  }
];

// Add more tenders for additional states
const additionalStateTenders: Tender[] = [
  // Tamil Nadu
  {
    id: 'tn-2025-1',
    title: 'Chennai Port Modernization Project',
    organization: 'Tamil Nadu Maritime Board',
    submissionDeadline: '2025-06-15',
    estimatedValue: '₹ 180,00,00,000',
    category: 'Ports & Shipping',
    status: 'upcoming',
    location: 'Chennai',
    value: 1800000000,
    description: 'Comprehensive modernization of Chennai Port with upgraded container terminals, automation systems, and environmental safeguards.',
    state: 'Tamil Nadu',
    documentUrl: '/documents/tn-port-project.pdf'
  },
  {
    id: 'tn-2025-2',
    title: 'Smart Traffic Management System',
    organization: 'Tamil Nadu Highways Department',
    submissionDeadline: '2025-05-18',
    estimatedValue: '₹ 45,00,00,000',
    category: 'Smart City',
    status: 'open',
    location: 'Coimbatore',
    value: 450000000,
    description: 'Implementation of AI-powered traffic management system for Coimbatore city with real-time monitoring and analytics.',
    state: 'Tamil Nadu',
    documentUrl: '/documents/tn-traffic-system.pdf'
  },
  
  // Kerala
  {
    id: 'kl-2025-1',
    title: 'Coastal Highway Development',
    organization: 'Kerala State Highway Authority',
    submissionDeadline: '2025-07-10',
    estimatedValue: '₹ 210,00,00,000',
    category: 'Infrastructure',
    status: 'upcoming',
    location: 'Multiple Districts',
    value: 2100000000,
    description: 'Construction of 120 km coastal highway connecting major tourist destinations with eco-friendly design principles.',
    state: 'Kerala',
    documentUrl: '/documents/kl-coastal-highway.pdf'
  },
  {
    id: 'kl-2025-2',
    title: 'Medical College Equipment Supply',
    organization: 'Kerala Health Services',
    submissionDeadline: '2025-05-28',
    estimatedValue: '₹ 68,00,00,000',
    category: 'Healthcare',
    status: 'open',
    location: 'Trivandrum',
    value: 680000000,
    description: 'Supply and installation of advanced medical equipment for teaching and specialty care at Government Medical College.',
    state: 'Kerala',
    documentUrl: '/documents/kl-medical-equipment.pdf'
  },
  
  // West Bengal
  {
    id: 'wb-2025-1',
    title: 'Kolkata Metro Extension',
    organization: 'West Bengal Transport Corporation',
    submissionDeadline: '2025-08-20',
    estimatedValue: '₹ 320,00,00,000',
    category: 'Transportation',
    status: 'upcoming',
    location: 'Kolkata',
    value: 3200000000,
    description: 'Extension of Kolkata Metro line to southern suburbs including construction of 8 new stations.',
    state: 'West Bengal',
    documentUrl: '/documents/wb-metro-extension.pdf'
  },
  {
    id: 'wb-2025-2',
    title: 'Sundarbans Eco-Tourism Development',
    organization: 'West Bengal Tourism Department',
    submissionDeadline: '2025-06-05',
    estimatedValue: '₹ 45,00,00,000',
    category: 'Tourism',
    status: 'open',
    location: 'Sundarbans',
    value: 450000000,
    description: 'Development of eco-friendly tourism infrastructure in Sundarbans with minimal environmental impact.',
    state: 'West Bengal',
    documentUrl: '/documents/wb-eco-tourism.pdf'
  },
  
  // Bihar
  {
    id: 'br-2025-1',
    title: 'Ganga River Bridge Construction',
    organization: 'Bihar Bridge Construction Corporation',
    submissionDeadline: '2025-07-15',
    estimatedValue: '₹ 240,00,00,000',
    category: 'Infrastructure',
    status: 'upcoming',
    location: 'Patna',
    value: 2400000000,
    description: 'Construction of 6-lane bridge across Ganga River with approach roads and flood protection measures.',
    state: 'Bihar',
    documentUrl: '/documents/br-bridge-construction.pdf'
  },
  {
    id: 'br-2025-2',
    title: 'Healthcare Facilities Upgrade',
    organization: 'Bihar Health Department',
    submissionDeadline: '2025-05-12',
    estimatedValue: '₹ 85,00,00,000',
    category: 'Healthcare',
    status: 'open',
    location: 'Multiple Districts',
    value: 850000000,
    description: 'Upgrade of 15 district hospitals with advanced medical equipment and expanded capacity.',
    state: 'Bihar',
    documentUrl: '/documents/br-healthcare-upgrade.pdf'
  },
  
  // Punjab
  {
    id: 'pb-2025-1',
    title: 'Smart Agricultural System',
    organization: 'Punjab Agricultural Department',
    submissionDeadline: '2025-06-18',
    estimatedValue: '₹ 75,00,00,000',
    category: 'Agriculture',
    status: 'open',
    location: 'Ludhiana',
    value: 750000000,
    description: 'Implementation of IoT-based agricultural monitoring and management systems for efficient farming.',
    state: 'Punjab',
    documentUrl: '/documents/pb-smart-agriculture.pdf'
  },
  {
    id: 'pb-2025-2',
    title: 'Industrial Zone Development',
    organization: 'Punjab Industrial Development Corporation',
    submissionDeadline: '2025-08-10',
    estimatedValue: '₹ 280,00,00,000',
    category: 'Industrial',
    status: 'upcoming',
    location: 'Amritsar',
    value: 2800000000,
    description: 'Development of integrated industrial zone with common effluent treatment plant and logistics hub.',
    state: 'Punjab',
    documentUrl: '/documents/pb-industrial-zone.pdf'
  },
  
  // Assam
  {
    id: 'as-2025-1',
    title: 'Brahmaputra River Management',
    organization: 'Assam Water Resources Department',
    submissionDeadline: '2025-07-25',
    estimatedValue: '₹ 160,00,00,000',
    category: 'Water Resources',
    status: 'upcoming',
    location: 'Multiple Districts',
    value: 1600000000,
    description: 'Comprehensive river management including flood protection, erosion control, and navigation improvement.',
    state: 'Assam',
    documentUrl: '/documents/as-river-management.pdf'
  },
  {
    id: 'as-2025-2',
    title: 'Tea Industry Modernization',
    organization: 'Assam Tea Development Corporation',
    submissionDeadline: '2025-05-30',
    estimatedValue: '₹ 55,00,00,000',
    category: 'Agriculture',
    status: 'open',
    location: 'Dibrugarh',
    value: 550000000,
    description: 'Modernization of tea processing facilities with energy-efficient equipment and quality control systems.',
    state: 'Assam',
    documentUrl: '/documents/as-tea-modernization.pdf'
  }
];

// Combine all mock tenders
// const mockTenders: Tender[] = [...mayTenders, ...additionalStateTenders, ...originalMockTenders.filter(t => !mayTenders.some(mt => mt.category === t.category))];

// Tenders component
const Tenders: React.FC<TendersProps> = ({ onSubmit, isAuthenticated, onLoginRequired }) => {
  // Initialize with May 2025 tenders
  const [tenders, setTenders] = useState<Tender[]>([...mayTenders, ...additionalStateTenders, ...originalMockTenders.filter(t => !mayTenders.some(mt => mt.category === t.category))]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedState, setSelectedState] = useState<string | null>(null);
  
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
  
  // Get unique states with tender counts
  const statesWithCounts = INDIAN_STATES.map(state => {
    const count = tenders.filter(tender => tender.state === state).length;
    return { state, count };
  }).filter(item => item.count > 0)
    .sort((a, b) => b.count - a.count); // Sort by count in descending order
  
  // Format dates as per online tender sources
  const formatDeadline = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    
    // Calculate days remaining
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Format the date
    const formattedDate = date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    
    // Return formatted date with days remaining indicator
    if (diffDays < 0) {
      return <span className="text-red-500">{formattedDate} (Expired)</span>;
    } else if (diffDays <= 7) {
      return <span className="text-amber-500">{formattedDate} ({diffDays} days left)</span>;
    } else {
      return <span className="text-green-500">{formattedDate} ({diffDays} days left)</span>;
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
        
        <div className="grid grid-cols-1 gap-8">
          {/* Main content */}
          <div>
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
                
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-gray-400" />
                  <select
                    className="bg-secondary border border-gray-700 rounded-md py-1.5 px-3 text-white"
                    value={selectedState || 'All'}
                    onChange={(e) => setSelectedState(e.target.value === 'All' ? null : e.target.value)}
                  >
                    <option value="All">All States</option>
                    {statesWithCounts.map(({state, count}) => (
                      <option key={state} value={state}>
                        {state} ({count})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Selected state info panel */}
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
            <div>
              {filteredTenders.length === 0 ? (
                <div className="bg-secondary-dark rounded-lg p-8 text-center">
                  <p className="text-xl text-white font-medium mb-4">No tenders found matching your criteria</p>
                  <p className="text-gray-400">Try adjusting your filters or search term</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTenders.map((tender) => (
                    <motion.div
                      key={tender.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-secondary-dark rounded-lg overflow-hidden shadow-lg border border-gray-800 hover:border-primary transition-all"
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            tender.status === 'open' ? 'bg-green-600/20 text-green-400' : 
                            tender.status === 'upcoming' ? 'bg-blue-600/20 text-blue-400' : 
                            'bg-gray-600/20 text-gray-400'
                          }`}>
                            {tender.status.charAt(0).toUpperCase() + tender.status.slice(1)}
                          </span>
                          <span className="text-sm text-gray-400">{getCategoryIcon(tender.category)} {tender.category}</span>
                        </div>
                        
                        <h3 className="text-white font-medium text-lg mb-1">{tender.title}</h3>
                        <p className="text-gray-400 text-sm mb-3">{tender.organization}</p>
                        
                        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                          <div>
                            <p className="text-gray-500">Value</p>
                            <p className="text-primary font-medium">{tender.estimatedValue}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Deadline</p>
                            <p>{formatDeadline(tender.submissionDeadline)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Location</p>
                            <p className="text-white">{tender.location}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">State</p>
                            <p className="text-white">{tender.state}</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center mt-4">
                          <a 
                            href={tender.documentUrl}
                            className="flex items-center text-sm text-primary hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download size={16} className="mr-1" /> Tender Document
                          </a>
                          
                          <button
                            onClick={() => {
                              if (isAuthenticated) {
                                // Route to bid submission page
                                onSubmit();
                              } else {
                                // Prompt user to log in
                                onLoginRequired();
                              }
                            }}
                            className="px-3 py-1.5 bg-primary text-black rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center"
                          >
                            <Upload size={16} className="mr-1" /> Submit Bid
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            
            {/* State-wise Tender Listings */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-white mb-6">Browse Tenders by State</h2>
              <p className="text-gray-400 mb-8">Explore government tenders from all states and union territories across India</p>
              
              <IndiaStatesTenderList 
                limit={100}
                filterByState={selectedState}
                onTenderClick={(tender) => {
                  // Here you would typically navigate to the tender details
                  // For now, just show a notification or log
                  console.log('Selected tender:', tender);
                  // You could also update the selected state filter:
                  setSelectedState(tender.state);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Tenders;
