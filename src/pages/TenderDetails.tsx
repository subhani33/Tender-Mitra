import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Building, FileText, User, Clock, DollarSign, Tag, Download, Upload, ChevronLeft } from 'lucide-react';

// Interface for component props
interface TenderDetailsProps {
  onBidSubmit: () => void;
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
  description: string;
  requirements: string[];
  location: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  documents: {
    name: string;
    size: string;
    type: string;
  }[];
}

const mockTenders: Record<string, Tender> = {
  '1': {
    id: '1',
    title: 'Construction of Government Office Building',
    organization: 'Ministry of Urban Development',
    submissionDeadline: '2025-12-15',
    estimatedValue: '₹ 15,00,00,000',
    category: 'Construction',
    status: 'open',
    description: 'This tender is for the construction of a new government office building in New Delhi. The building will be a 10-story structure with modern amenities, energy-efficient design, and smart building features. The project includes all aspects of construction from foundation to finishing, including electrical, plumbing, HVAC, and landscaping.',
    requirements: [
      'Minimum 10 years of experience in constructing government buildings',
      'Completion of at least 3 similar projects in the last 5 years',
      'Financial capability to handle projects of this scale',
      'Adherence to environmental and safety standards',
      'Ability to complete the project within 24 months',
    ],
    location: 'New Delhi, India',
    contactPerson: 'Rajesh Kumar',
    contactEmail: 'rajesh.kumar@urban.gov.in',
    contactPhone: '+91 11 2345 6789',
    documents: [
      {
        name: 'Tender_Document_1.pdf',
        size: '2.5 MB',
        type: 'PDF',
      },
      {
        name: 'Building_Specifications.pdf',
        size: '4.8 MB',
        type: 'PDF',
      },
      {
        name: 'Site_Maps.dwg',
        size: '8.2 MB',
        type: 'CAD',
      },
      {
        name: 'Environmental_Requirements.pdf',
        size: '1.2 MB',
        type: 'PDF',
      },
    ],
  },
  '2': {
    id: '2',
    title: 'Supply of Computer Hardware',
    organization: 'Ministry of Electronics and IT',
    submissionDeadline: '2025-11-30',
    estimatedValue: '₹ 5,00,00,000',
    category: 'IT Equipment',
    status: 'open',
    description: 'This tender invites bids for the supply of computer hardware for various government departments. The equipment includes desktop computers, laptops, servers, networking equipment, and peripherals. All equipment must meet the specified technical requirements and include a 3-year comprehensive warranty.',
    requirements: [
      'Authorized dealer/distributor of original equipment manufacturers',
      'Prior experience in supplying to government organizations',
      'Ability to provide after-sales service and support',
      'Compliance with quality standards and certifications',
      'Capability to deliver within 60 days of order',
    ],
    location: 'Pan India',
    contactPerson: 'Priya Singh',
    contactEmail: 'priya.singh@electronics.gov.in',
    contactPhone: '+91 11 8765 4321',
    documents: [
      {
        name: 'Technical_Specifications.pdf',
        size: '3.1 MB',
        type: 'PDF',
      },
      {
        name: 'Compliance_Requirements.docx',
        size: '1.7 MB',
        type: 'DOCX',
      },
      {
        name: 'Warranty_Terms.pdf',
        size: '0.8 MB',
        type: 'PDF',
      },
    ],
  },
  '3': {
    id: '3',
    title: 'Healthcare Equipment Procurement',
    organization: 'Ministry of Health and Family Welfare',
    submissionDeadline: '2026-01-10',
    estimatedValue: '₹ 8,50,00,000',
    category: 'Healthcare',
    status: 'open',
    description: 'Procurement of advanced medical equipment for government hospitals across the country. This includes diagnostic equipment, surgical instruments, patient monitoring systems, and specialized medical devices. All equipment must comply with international healthcare standards and include installation, training, and maintenance services.',
    requirements: [
      'Certified medical equipment supplier',
      'Experience in setting up hospital equipment',
      'Availability of trained technicians for installation and maintenance',
      'Compliance with international medical device standards',
      'Ability to provide training to hospital staff',
    ],
    location: 'Multiple locations across India',
    contactPerson: 'Dr. Sanjay Mehta',
    contactEmail: 'sanjay.mehta@health.gov.in',
    contactPhone: '+91 11 5567 8901',
    documents: [
      {
        name: 'Medical_Equipment_List.pdf',
        size: '5.3 MB',
        type: 'PDF',
      },
      {
        name: 'Technical_Requirements.pdf',
        size: '4.2 MB',
        type: 'PDF',
      },
      {
        name: 'Compliance_Standards.pdf',
        size: '2.1 MB',
        type: 'PDF',
      },
      {
        name: 'Service_Requirements.docx',
        size: '1.5 MB',
        type: 'DOCX',
      },
    ],
  },
  '4': {
    id: '4',
    title: 'Road Construction and Maintenance',
    organization: 'Ministry of Road Transport and Highways',
    submissionDeadline: '2026-02-15',
    estimatedValue: '₹ 25,00,00,000',
    category: 'Infrastructure',
    status: 'upcoming',
    description: 'Construction and maintenance of a 50-kilometer stretch of national highway, including bridges, underpasses, and service roads. The project focuses on developing high-quality, durable road infrastructure with modern safety features and environmental considerations.',
    requirements: [
      'Proven track record in highway construction',
      'Experience with similar large-scale infrastructure projects',
      'Specialized equipment and technical expertise',
      'Compliance with national highway standards',
      'Strong project management capabilities',
    ],
    location: 'Karnataka-Maharashtra Border',
    contactPerson: 'Anil Sharma',
    contactEmail: 'anil.sharma@highways.gov.in',
    contactPhone: '+91 11 4456 7890',
    documents: [
      {
        name: 'Project_Specifications.pdf',
        size: '7.8 MB',
        type: 'PDF',
      },
      {
        name: 'Route_Maps.pdf',
        size: '12.4 MB',
        type: 'PDF',
      },
      {
        name: 'Environmental_Impact_Assessment.pdf',
        size: '5.6 MB',
        type: 'PDF',
      },
      {
        name: 'Safety_Requirements.pdf',
        size: '2.3 MB',
        type: 'PDF',
      },
    ],
  },
  '5': {
    id: '5',
    title: 'Solar Power Plant Installation',
    organization: 'Ministry of New and Renewable Energy',
    submissionDeadline: '2025-10-30',
    estimatedValue: '₹ 12,00,00,000',
    category: 'Energy',
    status: 'closed',
    description: 'Installation of a 50 MW grid-connected solar power plant in Rajasthan. The project includes design, supply, construction, commissioning, and maintenance of the solar power plant with all associated infrastructure including transmission lines and grid connection equipment.',
    requirements: [
      'Expertise in large-scale solar installations',
      'Successful completion of at least 2 similar projects',
      'Financial stability to undertake the project',
      'Technical capability for grid integration',
      'Compliance with renewable energy regulations',
    ],
    location: 'Jodhpur, Rajasthan',
    contactPerson: 'Dr. Vikram Singh',
    contactEmail: 'vikram.singh@renewable.gov.in',
    contactPhone: '+91 11 2233 4455',
    documents: [
      {
        name: 'Solar_Plant_Specifications.pdf',
        size: '6.2 MB',
        type: 'PDF',
      },
      {
        name: 'Site_Survey_Report.pdf',
        size: '4.7 MB',
        type: 'PDF',
      },
      {
        name: 'Grid_Connection_Requirements.pdf',
        size: '3.1 MB',
        type: 'PDF',
      },
      {
        name: 'Maintenance_Guidelines.pdf',
        size: '1.8 MB',
        type: 'PDF',
      },
    ],
  },
};

const TenderDetails: React.FC<TenderDetailsProps> = ({ onBidSubmit, isAuthenticated, onLoginRequired }) => {
  const { id } = useParams<{ id: string }>();
  const [tender, setTender] = useState<Tender | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'contacts'>('overview');

  useEffect(() => {
    const fetchTenderDetails = async () => {
      try {
        setLoading(true);
        
        // In a real application, this would be an API call
        // For demonstration, we're using mock data
        if (id && mockTenders[id]) {
          setTender(mockTenders[id]);
        }
        
        // Simulate API delay
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching tender details:', error);
        setLoading(false);
      }
    };
    
    fetchTenderDetails();
  }, [id]);

  const handleSubmitBid = () => {
    if (isAuthenticated) {
      onBidSubmit();
    } else {
      onLoginRequired();
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!tender) {
    return (
      <div className="text-center py-16 bg-secondary-dark rounded-lg">
        <h2 className="text-2xl font-bold text-white mb-4">Tender Not Found</h2>
        <p className="text-white/70 mb-6">The tender you are looking for does not exist or has been removed.</p>
        <Link 
          to="/tenders" 
          className="inline-flex items-center text-primary hover:underline"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to Tenders
        </Link>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Back Navigation */}
      <div>
        <Link 
          to="/tenders" 
          className="inline-flex items-center text-white/70 hover:text-primary transition-colors"
        >
          <ChevronLeft size={18} className="mr-1" />
          Back to Tenders
        </Link>
      </div>
      
      {/* Header */}
      <div className="bg-secondary-dark rounded-lg p-6 border border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
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
            <h1 className="text-2xl md:text-3xl font-bold text-white">{tender.title}</h1>
            <p className="text-white/70 mt-1 flex items-center">
              <Building size={16} className="mr-2" />
              {tender.organization}
            </p>
          </div>
          
          <div className="flex gap-3 self-end md:self-center">
            <button 
              className="flex items-center gap-2 bg-primary/20 hover:bg-primary/30 text-primary px-4 py-2 rounded-md transition-colors"
              onClick={() => window.open(`/tenders/${id}/download`, '_blank')}
            >
              <Download size={18} />
              <span>Download</span>
            </button>
            
            <button 
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                tender.status === 'open'
                  ? 'bg-primary hover:bg-primary/90 text-gray-900'
                  : 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
              }`}
              onClick={tender.status === 'open' ? handleSubmitBid : undefined}
              disabled={tender.status !== 'open'}
            >
              <Upload size={18} />
              <span>Submit Bid</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Tender Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Key Details */}
        <div className="space-y-6">
          <div className="bg-secondary-dark rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-4">Key Details</h2>
            
            <ul className="space-y-4">
              <li className="flex items-start">
                <Calendar size={18} className="text-primary mr-3 mt-0.5" />
                <div>
                  <p className="text-white/50 text-sm">Submission Deadline</p>
                  <p className="text-white">{new Date(tender.submissionDeadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              </li>
              
              <li className="flex items-start">
                <DollarSign size={18} className="text-primary mr-3 mt-0.5" />
                <div>
                  <p className="text-white/50 text-sm">Estimated Value</p>
                  <p className="text-white">{tender.estimatedValue}</p>
                </div>
              </li>
              
              <li className="flex items-start">
                <Tag size={18} className="text-primary mr-3 mt-0.5" />
                <div>
                  <p className="text-white/50 text-sm">Category</p>
                  <p className="text-white">{tender.category}</p>
                </div>
              </li>
              
              <li className="flex items-start">
                <MapPin size={18} className="text-primary mr-3 mt-0.5" />
                <div>
                  <p className="text-white/50 text-sm">Location</p>
                  <p className="text-white">{tender.location}</p>
                </div>
              </li>
              
              <li className="flex items-start">
                <Clock size={18} className="text-primary mr-3 mt-0.5" />
                <div>
                  <p className="text-white/50 text-sm">Status</p>
                  <p className="text-white capitalize">{tender.status}</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="bg-secondary-dark rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-4">Contact Information</h2>
            
            <ul className="space-y-4">
              <li className="flex items-start">
                <User size={18} className="text-primary mr-3 mt-0.5" />
                <div>
                  <p className="text-white/50 text-sm">Contact Person</p>
                  <p className="text-white">{tender.contactPerson}</p>
                </div>
              </li>
              
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mr-3 mt-0.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                <div>
                  <p className="text-white/50 text-sm">Email</p>
                  <a href={`mailto:${tender.contactEmail}`} className="text-white hover:text-primary transition-colors">
                    {tender.contactEmail}
                  </a>
                </div>
              </li>
              
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mr-3 mt-0.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                <div>
                  <p className="text-white/50 text-sm">Phone</p>
                  <a href={`tel:${tender.contactPhone}`} className="text-white hover:text-primary transition-colors">
                    {tender.contactPhone}
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Right Column - Tabs Content */}
        <div className="md:col-span-2">
          {/* Tabs Navigation */}
          <div className="flex border-b border-gray-800 mb-6">
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'overview'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-white/70 hover:text-white'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'documents'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-white/70 hover:text-white'
              }`}
              onClick={() => setActiveTab('documents')}
            >
              Documents
            </button>
            
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'contacts'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-white/70 hover:text-white'
              }`}
              onClick={() => setActiveTab('contacts')}
            >
              Contact
            </button>
          </div>
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-secondary-dark rounded-lg p-6 border border-gray-800">
                <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
                <p className="text-white/80 leading-relaxed">{tender.description}</p>
              </div>
              
              <div className="bg-secondary-dark rounded-lg p-6 border border-gray-800">
                <h2 className="text-xl font-semibold text-white mb-4">Requirements</h2>
                <ul className="list-disc pl-5 space-y-2">
                  {tender.requirements.map((requirement, index) => (
                    <li key={index} className="text-white/80">{requirement}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="bg-secondary-dark rounded-lg p-6 border border-gray-800">
              <h2 className="text-xl font-semibold text-white mb-4">Tender Documents</h2>
              
              <div className="space-y-4">
                {tender.documents.map((document, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 bg-secondary rounded-md border border-gray-700 hover:border-gray-600 transition-colors"
                  >
                    <div className="flex items-center">
                      <FileText size={20} className="text-primary mr-3" />
                      <div>
                        <p className="text-white font-medium">{document.name}</p>
                        <p className="text-white/50 text-sm">{document.size} • {document.type}</p>
                      </div>
                    </div>
                    
                    <button 
                      className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                      onClick={() => window.open(`/documents/${document.name}`, '_blank')}
                    >
                      <Download size={16} />
                      <span>Download</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Contacts Tab */}
          {activeTab === 'contacts' && (
            <div className="bg-secondary-dark rounded-lg p-6 border border-gray-800">
              <h2 className="text-xl font-semibold text-white mb-4">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 p-4 bg-secondary rounded-md border border-gray-700">
                    <h3 className="text-lg font-medium text-white mb-3">Primary Contact</h3>
                    
                    <ul className="space-y-3">
                      <li className="flex items-center">
                        <User size={16} className="text-primary mr-2" />
                        <span className="text-white">{tender.contactPerson}</span>
                      </li>
                      
                      <li className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mr-2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                        <a href={`mailto:${tender.contactEmail}`} className="text-white hover:text-primary transition-colors">
                          {tender.contactEmail}
                        </a>
                      </li>
                      
                      <li className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mr-2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                        <a href={`tel:${tender.contactPhone}`} className="text-white hover:text-primary transition-colors">
                          {tender.contactPhone}
                        </a>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="flex-1 p-4 bg-secondary rounded-md border border-gray-700">
                    <h3 className="text-lg font-medium text-white mb-3">Organization</h3>
                    
                    <ul className="space-y-3">
                      <li className="flex items-center">
                        <Building size={16} className="text-primary mr-2" />
                        <span className="text-white">{tender.organization}</span>
                      </li>
                      
                      <li className="flex items-center">
                        <MapPin size={16} className="text-primary mr-2" />
                        <span className="text-white">{tender.location}</span>
                      </li>
                      
                      <li className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mr-2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                        <a href="#" className="text-white hover:text-primary transition-colors">
                          Visit Website
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="p-4 bg-secondary rounded-md border border-gray-700">
                  <h3 className="text-lg font-medium text-white mb-3">Send Inquiry</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full bg-secondary-dark border border-gray-700 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                    />
                    
                    <input
                      type="email"
                      placeholder="Your Email"
                      className="w-full bg-secondary-dark border border-gray-700 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                    />
                  </div>
                  
                  <textarea
                    placeholder="Your Message"
                    rows={4}
                    className="w-full bg-secondary-dark border border-gray-700 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-transparent mb-4"
                  ></textarea>
                  
                  <button 
                    className="bg-primary hover:bg-primary/90 text-gray-900 font-medium py-2 px-4 rounded-md transition-colors"
                    onClick={() => {
                      // In a real app, this would submit the form
                      alert('Your inquiry has been sent!');
                    }}
                  >
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TenderDetails;
