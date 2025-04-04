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

// Group states by their first letter for the scrollbar index
const STATE_INDEX = Array.from(new Set(INDIAN_STATES.map(state => state[0]))).sort();

// Original mock tenders (updated with optimized deadlines)
const originalMockTenders: Tender[] = [
  // Andhra Pradesh tenders
  {
    id: '1',
    title: 'Construction of new bridge across Krishna River',
    organization: 'Andhra Pradesh Roads Development Corporation',
    submissionDeadline: '2024-10-15',
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
    submissionDeadline: '2024-07-28', // Closing soon
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
    submissionDeadline: '2024-11-10',
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
    submissionDeadline: '2024-07-25', // Closing very soon
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
    submissionDeadline: '2024-12-15',
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
    submissionDeadline: '2024-06-30', // Expired
    estimatedValue: '₹ 45,00,00,000',
    category: 'Energy',
    status: 'closed',
    location: 'Tumakuru',
    value: 45000000,
    description: 'Installation of 50 MW solar power plant in Tumakuru district',
    state: 'Karnataka',
    documentUrl: '/documents/tender6.pdf'
  }
];

// Make sure to have at least 12-17 tenders for each state by adding additional mock tenders
// Adding more mock tenders for various states
const additionalMockTenders: Tender[] = [
  // More Andhra Pradesh tenders (adding 10 more)
  {
    id: 'ap-1',
    title: 'Amaravati Capital Region Smart Roads Development',
    organization: 'Andhra Pradesh Capital Region Development Authority',
    submissionDeadline: '2024-09-18',
    estimatedValue: '₹ 120,00,00,000',
    category: 'Infrastructure',
    status: 'open',
    location: 'Amaravati',
    value: 1200000000,
    description: 'Development of 45 km of smart roads with integrated utility corridors in Amaravati Capital Region',
    state: 'Andhra Pradesh',
    documentUrl: '/documents/tender-ap-1.pdf'
  },
  {
    id: 'ap-2',
    title: 'Visakhapatnam Port Modernization',
    organization: 'Visakhapatnam Port Trust',
    submissionDeadline: '2024-11-05',
    estimatedValue: '₹ 85,00,00,000',
    category: 'Ports',
    status: 'open',
    location: 'Visakhapatnam',
    value: 850000000,
    description: 'Modernization of container handling facilities at Visakhapatnam Port',
    state: 'Andhra Pradesh',
    documentUrl: '/documents/tender-ap-2.pdf'
  },
  {
    id: 'ap-3',
    title: 'Integrated Coastal Zone Management Project',
    organization: 'Environment, Forests & Science and Technology Department',
    submissionDeadline: '2024-08-20',
    estimatedValue: '₹ 65,00,00,000',
    category: 'Environment',
    status: 'open',
    location: 'Coastal Regions',
    value: 650000000,
    description: 'Implementation of coastal zone protection and management systems across Andhra Pradesh coastline',
    state: 'Andhra Pradesh',
    documentUrl: '/documents/tender-ap-3.pdf'
  },
  {
    id: 'ap-4',
    title: 'Advanced Cancer Treatment Center Equipment',
    organization: 'Health Medical & Family Welfare Department',
    submissionDeadline: '2024-09-30',
    estimatedValue: '₹ 110,00,00,000',
    category: 'Healthcare',
    status: 'open',
    location: 'Guntur',
    value: 1100000000,
    description: 'Supply and installation of advanced cancer diagnosis and treatment equipment for new oncology center',
    state: 'Andhra Pradesh',
    documentUrl: '/documents/tender-ap-4.pdf'
  },
  {
    id: 'ap-5',
    title: 'Smart Classrooms for Government Schools',
    organization: 'School Education Department',
    submissionDeadline: '2024-12-10',
    estimatedValue: '₹ 45,00,00,000',
    category: 'Education',
    status: 'upcoming',
    location: 'Multiple Districts',
    value: 450000000,
    description: 'Installation of digital smart classrooms in 1500 government schools across Andhra Pradesh',
    state: 'Andhra Pradesh',
    documentUrl: '/documents/tender-ap-5.pdf'
  },
  {
    id: 'ap-6',
    title: 'Rural Road Connectivity Project',
    organization: 'Panchayati Raj & Rural Development Department',
    submissionDeadline: '2025-01-15',
    estimatedValue: '₹ 320,00,00,000',
    category: 'Infrastructure',
    status: 'upcoming',
    location: 'Rural Areas',
    value: 3200000000,
    description: 'Construction and upgrade of rural road network connecting 500+ villages to main highways',
    state: 'Andhra Pradesh',
    documentUrl: '/documents/tender-ap-6.pdf'
  },
  {
    id: 'ap-7',
    title: 'Drinking Water Supply Scheme',
    organization: 'Rural Water Supply Department',
    submissionDeadline: '2024-10-22',
    estimatedValue: '₹ 78,00,00,000',
    category: 'Water Management',
    status: 'open',
    location: 'Anantapur',
    value: 780000000,
    description: 'Implementation of comprehensive drinking water supply scheme for drought-prone regions',
    state: 'Andhra Pradesh',
    documentUrl: '/documents/tender-ap-7.pdf'
  },
  {
    id: 'ap-8',
    title: 'Tirupati Smart City Phase II',
    organization: 'Municipal Administration & Urban Development',
    submissionDeadline: '2025-02-28',
    estimatedValue: '₹ 175,00,00,000',
    category: 'Smart City',
    status: 'upcoming',
    location: 'Tirupati',
    value: 1750000000,
    description: 'Implementation of smart city initiatives including smart lighting, traffic management and waste management systems',
    state: 'Andhra Pradesh',
    documentUrl: '/documents/tender-ap-8.pdf'
  },
  {
    id: 'ap-9',
    title: 'Floodwater Management System',
    organization: 'Water Resources Department',
    submissionDeadline: '2024-11-30',
    estimatedValue: '₹ 92,00,00,000',
    category: 'Water Management',
    status: 'open',
    location: 'Godavari Basin',
    value: 920000000,
    description: 'Development of comprehensive floodwater management and early warning systems for Godavari river basin',
    state: 'Andhra Pradesh',
    documentUrl: '/documents/tender-ap-9.pdf'
  },
  {
    id: 'ap-10',
    title: 'Renewable Energy Projects',
    organization: 'Energy Department',
    submissionDeadline: '2025-03-15',
    estimatedValue: '₹ 220,00,00,000',
    category: 'Energy',
    status: 'upcoming',
    location: 'Multiple Locations',
    value: 2200000000,
    description: 'Development of solar and wind energy projects with total capacity of 500 MW across multiple locations',
    state: 'Andhra Pradesh',
    documentUrl: '/documents/tender-ap-10.pdf'
  },
  // Additional tenders for Karnataka (adding 10 more)
  {
    id: 'ka-1',
    title: 'Mangalore Smart City Water Supply Improvement',
    organization: 'Mangalore Smart City Limited',
    submissionDeadline: '2024-09-22',
    estimatedValue: '₹ 65,00,00,000',
    category: 'Water Supply',
    status: 'open',
    location: 'Mangalore',
    value: 650000000,
    description: 'Improvement of water supply system with SCADA integration in Mangalore city',
    state: 'Karnataka',
    documentUrl: '/documents/tender-ka-1.pdf'
  },
  {
    id: 'ka-2',
    title: 'Mysore Heritage Buildings Restoration',
    organization: 'Karnataka Tourism Department',
    submissionDeadline: '2024-11-15',
    estimatedValue: '₹ 28,00,00,000',
    category: 'Heritage',
    status: 'upcoming',
    location: 'Mysore',
    value: 280000000,
    description: 'Restoration and conservation of heritage buildings in Mysore city',
    state: 'Karnataka',
    documentUrl: '/documents/tender-ka-2.pdf'
  },
  // Add more tenders for Karnataka

  // Additional tenders for Uttar Pradesh (ensuring at least 12 tenders)
  {
    id: 'up-1',
    title: 'Kanpur Metro Rail Project Phase 2',
    organization: 'Uttar Pradesh Metro Rail Corporation',
    submissionDeadline: '2024-12-10',
    estimatedValue: '₹ 170,00,00,000',
    category: 'Transportation',
    status: 'upcoming',
    location: 'Kanpur',
    value: 1700000000,
    description: 'Construction of Phase 2 of Kanpur Metro Rail Project covering 32 km',
    state: 'Uttar Pradesh',
    documentUrl: '/documents/tender-up-1.pdf'
  },
  {
    id: 'up-2',
    title: 'Varanasi Riverfront Development',
    organization: 'National Mission for Clean Ganga, UP',
    submissionDeadline: '2024-08-28',
    estimatedValue: '₹ 95,00,00,000',
    category: 'Urban Development',
    status: 'open',
    location: 'Varanasi',
    value: 950000000,
    description: 'Development of Varanasi riverfront including ghats renovation and river cleaning',
    state: 'Uttar Pradesh',
    documentUrl: '/documents/tender-up-2.pdf'
  },
  // Add more tenders for Uttar Pradesh

  // Add similar blocks for other states to ensure each has 12-17 tenders
  
  // Gujarat tenders
  {
    id: 'gj-1',
    title: 'Ahmedabad Metro Phase 2 Construction',
    organization: 'Gujarat Metro Rail Corporation',
    submissionDeadline: '2024-12-15',
    estimatedValue: '₹ 175,00,00,000',
    category: 'Transportation',
    status: 'upcoming',
    location: 'Ahmedabad',
    value: 1750000000,
    description: 'Construction of Phase 2 of Ahmedabad Metro Rail covering 28.2 km with 23 stations',
    state: 'Gujarat',
    documentUrl: '/documents/tender-gj-1.pdf'
  },
  {
    id: 'gj-2',
    title: 'Surat Smart City Integrated Command Center',
    organization: 'Surat Smart City Development Limited',
    submissionDeadline: '2024-10-10',
    estimatedValue: '₹ 65,00,00,000',
    category: 'Smart City',
    status: 'open',
    location: 'Surat',
    value: 650000000,
    description: 'Establishment of integrated command and control center for Surat Smart City',
    state: 'Gujarat',
    documentUrl: '/documents/tender-gj-2.pdf'
  },
  {
    id: 'gj-3',
    title: 'Vadodara Smart Roads Development',
    organization: 'Vadodara Municipal Corporation',
    submissionDeadline: '2024-09-20',
    estimatedValue: '₹ 48,00,00,000',
    category: 'Infrastructure',
    status: 'open',
    location: 'Vadodara',
    value: 480000000,
    description: 'Development of smart roads with integrated utility ducts and smart traffic management',
    state: 'Gujarat',
    documentUrl: '/documents/tender-gj-3.pdf'
  },
  {
    id: 'gj-4',
    title: 'Rajkot Water Supply System Upgrade',
    organization: 'Gujarat Water Supply and Sewerage Board',
    submissionDeadline: '2024-08-30',
    estimatedValue: '₹ 55,00,00,000',
    category: 'Water Supply',
    status: 'open',
    location: 'Rajkot',
    value: 550000000,
    description: 'Upgrade of water supply system with 24x7 supply and smart metering in Rajkot city',
    state: 'Gujarat',
    documentUrl: '/documents/tender-gj-4.pdf'
  },
  {
    id: 'gj-5',
    title: 'Bhavnagar Solar Power Plant',
    organization: 'Gujarat Energy Development Agency',
    submissionDeadline: '2024-10-25',
    estimatedValue: '₹ 85,00,00,000',
    category: 'Energy',
    status: 'open',
    location: 'Bhavnagar',
    value: 850000000,
    description: 'Establishment of 70 MW solar power plant in Bhavnagar district',
    state: 'Gujarat',
    documentUrl: '/documents/tender-gj-5.pdf'
  },
  {
    id: 'gj-6',
    title: 'Jamnagar Coastal Highway Construction',
    organization: 'Gujarat State Road Development Corporation',
    submissionDeadline: '2024-11-30',
    estimatedValue: '₹ 125,00,00,000',
    category: 'Infrastructure',
    status: 'upcoming',
    location: 'Jamnagar',
    value: 1250000000,
    description: 'Construction of 45 km coastal highway connecting Jamnagar to Dwarka',
    state: 'Gujarat',
    documentUrl: '/documents/tender-gj-6.pdf'
  },
  {
    id: 'gj-7',
    title: 'Gandhinagar Smart City Digital Infrastructure',
    organization: 'Gandhinagar Smart City Development Corporation',
    submissionDeadline: '2024-09-15',
    estimatedValue: '₹ 38,00,00,000',
    category: 'IT Infrastructure',
    status: 'open',
    location: 'Gandhinagar',
    value: 380000000,
    description: 'Implementation of digital infrastructure including public Wi-Fi and digital kiosks',
    state: 'Gujarat',
    documentUrl: '/documents/tender-gj-7.pdf'
  },
  {
    id: 'gj-8',
    title: 'Kutch Renewable Energy Park Development',
    organization: 'Gujarat Power Corporation Limited',
    submissionDeadline: '2024-12-10',
    estimatedValue: '₹ 220,00,00,000',
    category: 'Energy',
    status: 'upcoming',
    location: 'Kutch',
    value: 2200000000,
    description: 'Development of renewable energy park with solar and wind capacity in Kutch district',
    state: 'Gujarat',
    documentUrl: '/documents/tender-gj-8.pdf'
  },
  {
    id: 'gj-9',
    title: 'Anand Agricultural University Infrastructure',
    organization: 'Gujarat State Agricultural Development Corporation',
    submissionDeadline: '2024-09-28',
    estimatedValue: '₹ 32,00,00,000',
    category: 'Education',
    status: 'open',
    location: 'Anand',
    value: 320000000,
    description: 'Development of research infrastructure for Anand Agricultural University',
    state: 'Gujarat',
    documentUrl: '/documents/tender-gj-9.pdf'
  },
  {
    id: 'gj-10',
    title: 'Porbandar Fishing Harbor Modernization',
    organization: 'Gujarat Maritime Board',
    submissionDeadline: '2024-10-15',
    estimatedValue: '₹ 45,00,00,000',
    category: 'Ports',
    status: 'open',
    location: 'Porbandar',
    value: 450000000,
    description: 'Modernization of fishing harbor with upgraded facilities and cold storage',
    state: 'Gujarat',
    documentUrl: '/documents/tender-gj-10.pdf'
  },
  {
    id: 'gj-11',
    title: 'Bharuch Industrial Area Development',
    organization: 'Gujarat Industrial Development Corporation',
    submissionDeadline: '2024-11-15',
    estimatedValue: '₹ 78,00,00,000',
    category: 'Industrial Development',
    status: 'upcoming',
    location: 'Bharuch',
    value: 780000000,
    description: 'Development of industrial area with common facilities and environmental safeguards',
    state: 'Gujarat',
    documentUrl: '/documents/tender-gj-11.pdf'
  },
  {
    id: 'gj-12',
    title: 'Dwarka Tourism Infrastructure Development',
    organization: 'Gujarat Tourism Development Corporation',
    submissionDeadline: '2024-10-20',
    estimatedValue: '₹ 52,00,00,000',
    category: 'Tourism',
    status: 'open',
    location: 'Dwarka',
    value: 520000000,
    description: 'Development of tourism infrastructure including waterfront promenade and tourist facilities',
    state: 'Gujarat',
    documentUrl: '/documents/tender-gj-12.pdf'
  },
  
  // Kerala tenders
  {
    id: 'kl-1',
    title: 'Kochi Metro Rail Extension',
    organization: 'Kochi Metro Rail Limited',
    submissionDeadline: '2024-11-30',
    estimatedValue: '₹ 145,00,00,000',
    category: 'Transportation',
    status: 'upcoming',
    location: 'Kochi',
    value: 1450000000,
    description: 'Extension of Kochi Metro Rail to Kakkanad covering 11.2 km with 11 stations',
    state: 'Kerala',
    documentUrl: '/documents/tender-kl-1.pdf'
  },
  {
    id: 'kl-2',
    title: 'Thiruvananthapuram Smart City Roads Development',
    organization: 'Thiruvananthapuram Smart City Limited',
    submissionDeadline: '2024-09-25',
    estimatedValue: '₹ 58,00,00,000',
    category: 'Infrastructure',
    status: 'open',
    location: 'Thiruvananthapuram',
    value: 580000000,
    description: 'Development of smart roads with underground utilities and smart traffic management',
    state: 'Kerala',
    documentUrl: '/documents/tender-kl-2.pdf'
  },
  {
    id: 'kl-3',
    title: 'Kozhikode Water Supply Project',
    organization: 'Kerala Water Authority',
    submissionDeadline: '2024-10-15',
    estimatedValue: '₹ 68,00,00,000',
    category: 'Water Supply',
    status: 'open',
    location: 'Kozhikode',
    value: 680000000,
    description: 'Implementation of comprehensive water supply scheme for Kozhikode city',
    state: 'Kerala',
    documentUrl: '/documents/tender-kl-3.pdf'
  },
  {
    id: 'kl-4',
    title: 'Kollam Port Development',
    organization: 'Kerala Maritime Board',
    submissionDeadline: '2024-11-15',
    estimatedValue: '₹ 95,00,00,000',
    category: 'Ports',
    status: 'upcoming',
    location: 'Kollam',
    value: 950000000,
    description: 'Development of Kollam Port with cargo handling facilities and passenger terminal',
    state: 'Kerala',
    documentUrl: '/documents/tender-kl-4.pdf'
  },
  {
    id: 'kl-5',
    title: 'Thrissur Smart City Integrated Command Center',
    organization: 'Thrissur Municipal Corporation',
    submissionDeadline: '2024-09-20',
    estimatedValue: '₹ 42,00,00,000',
    category: 'Smart City',
    status: 'open',
    location: 'Thrissur',
    value: 420000000,
    description: 'Establishment of integrated command and control center for smart city operations',
    state: 'Kerala',
    documentUrl: '/documents/tender-kl-5.pdf'
  },
  {
    id: 'kl-6',
    title: 'Alappuzha Tourism Infrastructure Development',
    organization: 'Kerala Tourism Development Corporation',
    submissionDeadline: '2024-10-10',
    estimatedValue: '₹ 38,00,00,000',
    category: 'Tourism',
    status: 'open',
    location: 'Alappuzha',
    value: 380000000,
    description: 'Development of tourism infrastructure along backwaters with eco-friendly facilities',
    state: 'Kerala',
    documentUrl: '/documents/tender-kl-6.pdf'
  },
  {
    id: 'kl-7',
    title: 'Kannur International Airport Cargo Complex',
    organization: 'Kannur International Airport Limited',
    submissionDeadline: '2024-11-10',
    estimatedValue: '₹ 65,00,00,000',
    category: 'Aviation',
    status: 'upcoming',
    location: 'Kannur',
    value: 650000000,
    description: 'Construction of cargo complex at Kannur International Airport',
    state: 'Kerala',
    documentUrl: '/documents/tender-kl-7.pdf'
  },
  {
    id: 'kl-8',
    title: 'Palakkad Solar Power Project',
    organization: 'Kerala State Electricity Board',
    submissionDeadline: '2024-09-30',
    estimatedValue: '₹ 48,00,00,000',
    category: 'Energy',
    status: 'open',
    location: 'Palakkad',
    value: 480000000,
    description: 'Implementation of 30 MW solar power project in Palakkad district',
    state: 'Kerala',
    documentUrl: '/documents/tender-kl-8.pdf'
  },
  {
    id: 'kl-9',
    title: 'Kottayam Medical College Expansion',
    organization: 'Kerala Health and Family Welfare Department',
    submissionDeadline: '2024-08-25',
    estimatedValue: '₹ 85,00,00,000',
    category: 'Healthcare',
    status: 'open',
    location: 'Kottayam',
    value: 850000000,
    description: 'Expansion of Kottayam Medical College with new super-specialty departments',
    state: 'Kerala',
    documentUrl: '/documents/tender-kl-9.pdf'
  },
  {
    id: 'kl-10',
    title: 'Kasaragod IT Park Development',
    organization: 'Kerala State Information Technology Infrastructure Limited',
    submissionDeadline: '2024-10-30',
    estimatedValue: '₹ 55,00,00,000',
    category: 'IT Infrastructure',
    status: 'open',
    location: 'Kasaragod',
    value: 550000000,
    description: 'Development of IT park with modern facilities in Kasaragod district',
    state: 'Kerala',
    documentUrl: '/documents/tender-kl-10.pdf'
  },
  {
    id: 'kl-11',
    title: 'Idukki Dam Rehabilitation Project',
    organization: 'Kerala State Electricity Board',
    submissionDeadline: '2024-11-25',
    estimatedValue: '₹ 72,00,00,000',
    category: 'Water Resources',
    status: 'upcoming',
    location: 'Idukki',
    value: 720000000,
    description: 'Rehabilitation and strengthening works for Idukki Dam',
    state: 'Kerala',
    documentUrl: '/documents/tender-kl-11.pdf'
  },
  {
    id: 'kl-12',
    title: 'Pathanamthitta Waste Management System',
    organization: 'Kerala Suchitwa Mission',
    submissionDeadline: '2024-09-15',
    estimatedValue: '₹ 28,00,00,000',
    category: 'Waste Management',
    status: 'open',
    location: 'Pathanamthitta',
    value: 280000000,
    description: 'Implementation of integrated solid waste management system in Pathanamthitta district',
    state: 'Kerala',
    documentUrl: '/documents/tender-kl-12.pdf'
  },

  // Delhi tenders
  {
    id: 'dl-1',
    title: 'Delhi Metro Phase 4 Construction',
    organization: 'Delhi Metro Rail Corporation',
    submissionDeadline: '2024-12-20',
    estimatedValue: '₹ 235,00,00,000',
    category: 'Transportation',
    status: 'upcoming',
    location: 'Delhi',
    value: 2350000000,
    description: 'Construction of Phase 4 of Delhi Metro covering 61.7 km',
    state: 'Delhi',
    documentUrl: '/documents/tender-dl-1.pdf'
  },
  {
    id: 'dl-2',
    title: 'Delhi Smart City Integrated Traffic Management System',
    organization: 'Delhi Smart City Limited',
    submissionDeadline: '2024-09-30',
    estimatedValue: '₹ 75,00,00,000',
    category: 'Smart City',
    status: 'open',
    location: 'Delhi',
    value: 750000000,
    description: 'Implementation of city-wide integrated traffic management system with AI capabilities',
    state: 'Delhi',
    documentUrl: '/documents/tender-dl-2.pdf'
  },
  {
    id: 'dl-3',
    title: 'Delhi Water Supply Network Rehabilitation',
    organization: 'Delhi Jal Board',
    submissionDeadline: '2024-10-15',
    estimatedValue: '₹ 95,00,00,000',
    category: 'Water Supply',
    status: 'open',
    location: 'Delhi',
    value: 950000000,
    description: 'Rehabilitation of water supply network in South and West Delhi',
    state: 'Delhi',
    documentUrl: '/documents/tender-dl-3.pdf'
  },
  {
    id: 'dl-4',
    title: 'Delhi Electric Bus Fleet Procurement',
    organization: 'Delhi Transport Corporation',
    submissionDeadline: '2024-11-10',
    estimatedValue: '₹ 185,00,00,000',
    category: 'Transportation',
    status: 'upcoming',
    location: 'Delhi',
    value: 1850000000,
    description: 'Procurement of 1000 electric buses for public transportation in Delhi',
    state: 'Delhi',
    documentUrl: '/documents/tender-dl-4.pdf'
  },
  {
    id: 'dl-5',
    title: 'Delhi Government Hospital Modernization',
    organization: 'Delhi Health Services',
    submissionDeadline: '2024-09-20',
    estimatedValue: '₹ 68,00,00,000',
    category: 'Healthcare',
    status: 'open',
    location: 'Delhi',
    value: 680000000,
    description: 'Modernization of government hospitals with advanced medical equipment and facilities',
    state: 'Delhi',
    documentUrl: '/documents/tender-dl-5.pdf'
  },
  {
    id: 'dl-6',
    title: 'Delhi Solar Rooftop Implementation',
    organization: 'Delhi Renewable Energy Development Agency',
    submissionDeadline: '2024-10-25',
    estimatedValue: '₹ 48,00,00,000',
    category: 'Energy',
    status: 'open',
    location: 'Delhi',
    value: 480000000,
    description: 'Implementation of solar rooftop systems on government buildings in Delhi',
    state: 'Delhi',
    documentUrl: '/documents/tender-dl-6.pdf'
  },
  {
    id: 'dl-7',
    title: 'Delhi Smart Waste Management System',
    organization: 'Delhi Municipal Corporation',
    submissionDeadline: '2024-09-15',
    estimatedValue: '₹ 55,00,00,000',
    category: 'Waste Management',
    status: 'open',
    location: 'Delhi',
    value: 550000000,
    description: 'Implementation of smart waste management system with IoT-enabled bins and route optimization',
    state: 'Delhi',
    documentUrl: '/documents/tender-dl-7.pdf'
  },
  {
    id: 'dl-8',
    title: 'Delhi Convention Center Development',
    organization: 'Delhi Development Authority',
    submissionDeadline: '2024-12-05',
    estimatedValue: '₹ 125,00,00,000',
    category: 'Infrastructure',
    status: 'upcoming',
    location: 'Delhi',
    value: 1250000000,
    description: 'Development of world-class convention center in Dwarka, Delhi',
    state: 'Delhi',
    documentUrl: '/documents/tender-dl-8.pdf'
  },
  {
    id: 'dl-9',
    title: 'Delhi CCTV Surveillance System Expansion',
    organization: 'Delhi Police',
    submissionDeadline: '2024-08-30',
    estimatedValue: '₹ 62,00,00,000',
    category: 'Security',
    status: 'open',
    location: 'Delhi',
    value: 620000000,
    description: 'Expansion of CCTV surveillance system with facial recognition capabilities',
    state: 'Delhi',
    documentUrl: '/documents/tender-dl-9.pdf'
  },
  {
    id: 'dl-10',
    title: 'Delhi Smart Grid Implementation',
    organization: 'Delhi Electricity Regulatory Commission',
    submissionDeadline: '2024-11-20',
    estimatedValue: '₹ 85,00,00,000',
    category: 'Energy',
    status: 'upcoming',
    location: 'Delhi',
    value: 850000000,
    description: 'Implementation of smart grid technology for power distribution in Delhi',
    state: 'Delhi',
    documentUrl: '/documents/tender-dl-10.pdf'
  },
  {
    id: 'dl-11',
    title: 'Delhi River Yamuna Cleaning Project',
    organization: 'Delhi Jal Board',
    submissionDeadline: '2024-10-10',
    estimatedValue: '₹ 120,00,00,000',
    category: 'Environment',
    status: 'open',
    location: 'Delhi',
    value: 1200000000,
    description: 'Implementation of comprehensive cleaning and rejuvenation project for River Yamuna',
    state: 'Delhi',
    documentUrl: '/documents/tender-dl-11.pdf'
  },
  {
    id: 'dl-12',
    title: 'Delhi Public Wi-Fi Network Implementation',
    organization: 'Delhi IT Department',
    submissionDeadline: '2024-09-25',
    estimatedValue: '₹ 38,00,00,000',
    category: 'IT Infrastructure',
    status: 'open',
    location: 'Delhi',
    value: 380000000,
    description: 'Implementation of public Wi-Fi network at 11,000 hotspots across Delhi',
    state: 'Delhi',
    documentUrl: '/documents/tender-dl-12.pdf'
  }
];

// Combine all mock tenders
const mockTenders: Tender[] = [...originalMockTenders, ...additionalMockTenders];

// Tenders component
const Tenders: React.FC<TendersProps> = ({ onSubmit, isAuthenticated, onLoginRequired }) => {
  const [tenders, setTenders] = useState<Tender[]>(mockTenders);
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
        </div>
      </div>
    </motion.div>
  );
};

export default Tenders;
