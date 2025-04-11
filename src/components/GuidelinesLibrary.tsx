import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface GuidelineDocument {
  id: string;
  title: string;
  description: string;
  pdfUrl: string;
  thumbnailUrl: string;
  publishedDate: string;
  ministry: string;
  size: string;
  pages: number;
  lastUpdated?: string;
  category: string;
  tags: string[];
}

const GUIDELINE_DOCUMENTS: GuidelineDocument[] = [
  {
    id: 'gfr2017',
    title: 'General Financial Rules 2017',
    description: 'Comprehensive guidelines issued by the Ministry of Finance for financial management and procurement procedures in government organizations.',
    thumbnailUrl: '/images/guidelines/gfr2017-thumb.jpg',
    pdfUrl: '/pdfs/GFR_2017_Complete.pdf',
    ministry: 'Ministry of Finance',
    publishedDate: '2017-03-07',
    lastUpdated: '2023-08-15',
    pages: 294,
    size: '4.2 MB',
    category: 'financial',
    tags: ['finance', 'procurement', 'rules']
  },
  {
    id: 'manual-procurement',
    title: 'Manual for Procurement of Goods 2017',
    description: 'Official procurement manual providing detailed processes and procedures for the procurement of goods by government departments and organizations.',
    thumbnailUrl: '/images/guidelines/procurement-manual-thumb.jpg',
    pdfUrl: '/pdfs/Manual_Procurement_Goods_2017.pdf',
    ministry: 'Ministry of Finance',
    publishedDate: '2017-04-28',
    lastUpdated: '2022-11-30',
    pages: 152,
    size: '3.8 MB',
    category: 'procurement',
    tags: ['procurement', 'goods', 'tender']
  },
  {
    id: 'cppp-bidders-manual',
    title: 'Central Public Procurement Portal - Bidders Manual',
    description: 'Step-by-step guide for bidders on how to use the Central Public Procurement Portal (CPPP) for e-procurement and bid submission.',
    thumbnailUrl: '/images/guidelines/cppp-thumb.jpg',
    pdfUrl: '/pdfs/CPPP_Bidders_Manual.pdf',
    ministry: 'Ministry of Electronics & Information Technology',
    publishedDate: '2021-06-12',
    lastUpdated: '2023-05-20',
    pages: 78,
    size: '5.1 MB',
    category: 'e-procurement',
    tags: ['cppp', 'portal', 'e-procurement']
  },
  {
    id: 'gem-user-manual',
    title: 'GeM Portal User Manual',
    description: 'Official user manual for the Government e-Marketplace (GeM) providing comprehensive guidance on registration, bidding, and tender management.',
    thumbnailUrl: '/images/guidelines/gem-thumb.jpg',
    pdfUrl: '/pdfs/GeM_Portal_User_Manual.pdf',
    ministry: 'Ministry of Commerce and Industry',
    publishedDate: '2022-04-15',
    lastUpdated: '2023-12-05',
    pages: 112,
    size: '7.3 MB',
    category: 'e-procurement',
    tags: ['gem', 'e-marketplace', 'bidding']
  },
  {
    id: 'public-procurement-act',
    title: 'Public Procurement Act 2012',
    description: 'Legislative framework establishing the rules and procedures governing public procurement in India, ensuring transparency and fairness.',
    thumbnailUrl: '/images/guidelines/ppa-thumb.jpg',
    pdfUrl: '/pdfs/Public_Procurement_Act_2012.pdf',
    ministry: 'Ministry of Law and Justice',
    publishedDate: '2012-05-21',
    lastUpdated: '2021-03-10',
    pages: 64,
    size: '2.4 MB',
    category: 'legislation',
    tags: ['legislation', 'legal', 'policy']
  },
  {
    id: 'mse-policy',
    title: 'MSE Procurement Policy',
    description: 'Policy document detailing special provisions and benefits for Micro and Small Enterprises (MSEs) in government procurement processes.',
    thumbnailUrl: '/images/guidelines/mse-thumb.jpg',
    pdfUrl: '/pdfs/MSE_Procurement_Policy.pdf',
    ministry: 'Ministry of Micro, Small and Medium Enterprises',
    publishedDate: '2018-11-09',
    lastUpdated: '2023-02-28',
    pages: 42,
    size: '1.8 MB',
    category: 'policy',
    tags: ['mse', 'small business', 'benefits']
  },
  {
    id: 'make-in-india',
    title: 'Public Procurement (Preference to Make in India) Order',
    description: 'Policy directive to promote manufacturing and production of goods and services in India to encourage "Make in India" initiative.',
    thumbnailUrl: '/images/guidelines/make-in-india-thumb.jpg',
    pdfUrl: '/pdfs/Make_In_India_Procurement_Order.pdf',
    ministry: 'Department for Promotion of Industry and Internal Trade',
    publishedDate: '2017-06-15',
    lastUpdated: '2022-09-16',
    pages: 28,
    size: '1.5 MB',
    category: 'policy',
    tags: ['make in india', 'local suppliers', 'preference']
  },
  {
    id: 'cvc-guidelines',
    title: 'CVC Guidelines on Tender Process',
    description: 'Guidelines issued by the Central Vigilance Commission to ensure integrity, fairness, and transparency in the tender processes of public organizations.',
    thumbnailUrl: '/images/guidelines/cvc-thumb.jpg',
    pdfUrl: '/pdfs/CVC_Tender_Guidelines.pdf',
    ministry: 'Central Vigilance Commission',
    publishedDate: '2021-08-03',
    lastUpdated: '2023-07-22',
    pages: 56,
    size: '2.3 MB',
    category: 'compliance',
    tags: ['vigilance', 'integrity', 'transparency']
  }
];

export const GuidelinesLibrary: React.FC = () => {
  const [selectedDocument, setSelectedDocument] = useState<GuidelineDocument | null>(null);
  
  return (
    <div className="py-16 relative">
      {/* Background texture */}
      <div className="absolute inset-0 bg-marble-dark opacity-20 mix-blend-overlay pointer-events-none"></div>
      
      {/* Velvet texture overlay */}
      <div 
        className="absolute inset-0 bg-[#1A2A44] opacity-95 mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: `url('/textures/velvet-texture.jpg')`,
          backgroundSize: '200px',
          backgroundRepeat: 'repeat'
        }}
      ></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-cinzel text-primary mb-4">Official Guidelines & Regulations</h2>
          <p className="text-xl font-montserrat text-white/80 max-w-3xl mx-auto">
            Access authoritative documents and manuals for navigating government tender processes with confidence.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {GUIDELINE_DOCUMENTS.map((doc, index) => (
            <DocumentCard 
              key={doc.id} 
              document={doc} 
              index={index}
              onClick={() => setSelectedDocument(doc)}
            />
          ))}
        </div>
      </div>
      
      {/* Document preview modal */}
      {selectedDocument && (
        <DocumentPreviewModal 
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </div>
  );
};

interface DocumentCardProps {
  document: GuidelineDocument;
  index: number;
  onClick: () => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, index, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div 
        className={`
          relative p-6 rounded-lg cursor-pointer transition-all duration-500
          bg-[#1A2A44]/90 hover:bg-[#1A2A44]/70
          border border-[#D4AF37]/30 hover:border-[#D4AF37]/60
          shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.2)]
          transform ${isHovered ? 'scale-[1.02]' : 'scale-1'}
        `}
      >
        {/* Gold corner decorations */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37] rounded-tl-lg"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#D4AF37] rounded-tr-lg"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#D4AF37] rounded-bl-lg"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#D4AF37] rounded-br-lg"></div>
        
        <div className="mb-4 flex justify-center">
          <div className="relative w-16 h-16 mb-2">
            {/* Scroll icon with gold effect */}
            <motion.div
              animate={{ rotateY: isHovered ? 180 : 0 }}
              transition={{ duration: 0.8 }}
              className="w-full h-full"
            >
              <svg className="w-full h-full text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 5V19H5V5H19ZM21 3H3V21H21V3ZM17 17H7V16H17V17ZM17 15H7V14H17V15ZM17 12H7V7H17V12Z" fill="currentColor"/>
                <path d="M7 7H17V12H7V7Z" fill="currentColor" fillOpacity="0.4"/>
              </svg>
              
              {/* Gold shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
            </motion.div>
          </div>
        </div>
        
        <h3 className="text-xl font-cinzel text-primary text-center mb-3">{document.title}</h3>
        
        <p className="text-white/80 mb-4 text-center text-sm">{document.description}</p>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-5">
          <div className="flex items-center">
            <svg className="w-4 h-4 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-white/70 text-xs">{formatDate(document.publishedDate)}</span>
          </div>
          
          <div className="flex items-center">
            <svg className="w-4 h-4 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-white/70 text-xs">{document.pages} pages</span>
          </div>
          
          <div className="flex items-center">
            <svg className="w-4 h-4 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="text-white/70 text-xs">{document.ministry}</span>
          </div>
          
          <div className="flex items-center">
            <svg className="w-4 h-4 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            <span className="text-white/70 text-xs">{document.size}</span>
          </div>
        </div>
        
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-[#D4AF37]/20 text-primary border border-[#D4AF37]/30 rounded font-medium hover:bg-[#D4AF37]/30 transition-colors"
          >
            View Document
          </motion.button>
        </div>
        
        {/* Download indicator that appears on hover */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute -top-2 -right-2 bg-primary text-[#1A2A44] w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
};

interface DocumentPreviewModalProps {
  document: GuidelineDocument;
  onClose: () => void;
}

const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({ document, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', damping: 25 }}
        className="bg-[#1A2A44] border-2 border-[#D4AF37]/40 rounded-lg shadow-[0_0_30px_rgba(212,175,55,0.3)] p-6 max-w-4xl w-full max-h-[90vh] overflow-auto"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-cinzel text-primary">{document.title}</h3>
          
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="md:w-1/3">
            <div className="bg-[#D4AF37]/10 rounded-lg overflow-hidden border border-[#D4AF37]/20">
              <img 
                src={document.thumbnailUrl || "/images/guidelines/placeholder.jpg"} 
                alt={document.title} 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
          
          <div className="md:w-2/3">
            <div className="mb-4">
              <h4 className="text-lg font-cinzel text-primary/90 mb-2">About this document</h4>
              <p className="text-white/90">{document.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-white/60 text-sm">Published Date</p>
                <p className="text-white font-medium">
                  {new Date(document.publishedDate).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              
              <div>
                <p className="text-white/60 text-sm">Ministry</p>
                <p className="text-white font-medium">{document.ministry}</p>
              </div>
              
              <div>
                <p className="text-white/60 text-sm">Pages</p>
                <p className="text-white font-medium">{document.pages}</p>
              </div>
              
              <div>
                <p className="text-white/60 text-sm">Size</p>
                <p className="text-white font-medium">{document.size}</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <motion.a
                href={document.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-primary text-[#1A2A44] rounded font-medium hover:bg-[#e5c152] transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
              </motion.a>
              
              <motion.a
                href={document.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-[#1A2A44] text-primary border border-[#D4AF37]/50 rounded font-medium hover:bg-[#1A2A44]/80 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Online
              </motion.a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-[#D4AF37]/20 pt-6">
          <h4 className="text-lg font-cinzel text-primary/90 mb-4">Related Documents</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {GUIDELINE_DOCUMENTS.filter(doc => doc.id !== document.id).slice(0, 4).map(relatedDoc => (
              <div 
                key={relatedDoc.id} 
                className="p-3 bg-[#1A2A44]/60 rounded border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 cursor-pointer transition-colors"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  // You could set the selected document to this related document
                  // setSelectedDocument(relatedDoc);
                }}
              >
                <div className="text-sm font-cinzel text-primary truncate mb-1">{relatedDoc.title}</div>
                <div className="text-white/60 text-xs">{relatedDoc.ministry}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}; 