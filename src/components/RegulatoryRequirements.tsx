import React, { useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';

interface Requirement {
  id: string;
  title: string;
  description: string;
  relevance: string;
  example: string;
  icon: string;
  details?: string[];
}

const REGULATORY_REQUIREMENTS: Requirement[] = [
  {
    id: "eligibility",
    title: "Eligibility Criteria",
    description: "Minimum standards that bidders must meet to qualify for consideration in the tender process.",
    relevance: "Ensures only capable and qualified entities participate, reducing risk of non-performance.",
    example: "Annual turnover of ₹5 crore, 3 years of experience in similar projects, valid trade license.",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    details: [
      "Financial capacity (turnover, net worth, profitability)",
      "Technical expertise (previous experience, qualified personnel)",
      "Tax compliance (GST, income tax clearance)",
      "Registration requirements (company registration, industry-specific licenses)",
      "Absence of blacklisting from government entities"
    ]
  },
  {
    id: "emd",
    title: "Earnest Money Deposit (EMD)",
    description: "A security deposit submitted along with the bid to ensure the bidder doesn't withdraw or modify their bid during its validity period.",
    relevance: "Protects against non-serious bidders and ensures commitment to the bidding process.",
    example: "2-5% of the estimated contract value, submitted as bank guarantee, demand draft, or through online payment.",
    icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z",
    details: [
      "Typically 2-5% of the estimated contract value",
      "Can be submitted as bank guarantee, demand draft, or online payment",
      "Returned to unsuccessful bidders after tender finalization",
      "May be forfeit if bidder withdraws during bid validity period",
      "Exemptions available for MSMEs, startups, and certain PSUs"
    ]
  },
  {
    id: "performance",
    title: "Performance Security",
    description: "A financial guarantee provided by the successful bidder to ensure proper execution of the contract.",
    relevance: "Protects the government against non-performance or breach of contract by the selected vendor.",
    example: "5-10% of the contract value, valid through the contract period plus warranty/maintenance period.",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    details: [
      "Usually 5-10% of the contract value",
      "Must be submitted within specified time after contract award (typically 14-28 days)",
      "Can be in form of bank guarantee, fixed deposit, or online payment",
      "Valid through contract period plus warranty/defect liability period",
      "May be invoked in case of contract violations or non-performance"
    ]
  },
  {
    id: "technical",
    title: "Technical Specifications",
    description: "Detailed requirements for goods, services, or works being procured, including quality standards, performance parameters, and compliance certifications.",
    relevance: "Ensures the procured items or services meet the required functional, quality, and safety standards.",
    example: "Material specifications, performance metrics, testing standards, compliance with BIS/ISO standards.",
    icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z",
    details: [
      "Detailed specifications of goods/services/works required",
      "Quality standards and testing requirements",
      "Performance parameters and benchmarks",
      "Compliance with national/international standards (BIS/ISO)",
      "Warranty and after-sales service requirements"
    ]
  },
  {
    id: "deadlines",
    title: "Tender Submission Deadlines",
    description: "The final date and time by which bids must be submitted. Late submissions are typically rejected automatically.",
    relevance: "Ensures a fair and transparent process with equal opportunity for all bidders.",
    example: "Technical and financial bids submission by May 15, 2023, 15:00 hours IST.",
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    details: [
      "Clear date and time for bid submission (often in IST for Indian tenders)",
      "Separate deadlines for technical and financial bids in some cases",
      "Pre-bid meeting schedule and query submission deadline",
      "Document purchase/download period",
      "Bid validity period (typically 90-180 days)"
    ]
  },
  {
    id: "integrity",
    title: "Integrity Pact",
    description: "A formal agreement between the procuring entity and bidders that neither party will engage in corrupt practices.",
    relevance: "Promotes ethical conduct and reduces corruption in public procurement.",
    example: "Signed agreement not to offer or accept bribes, collusion with other bidders, or use unfair influence.",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    details: [
      "Commitment to transparency and anti-corruption practices",
      "Oversight by independent external monitors (IEMs)",
      "Sanctions for violations including blacklisting",
      "Reporting mechanisms for corrupt practices",
      "Required for high-value tenders (typically above ₹10 crore)"
    ]
  }
];

export const RegulatoryRequirements: React.FC = () => {
  const [expandedRequirement, setExpandedRequirement] = useState<string | null>(null);
  
  const handleToggle = useCallback((id: string) => {
    setExpandedRequirement(prevId => prevId === id ? null : id);
  }, []);
  
  return (
    <div className="py-16 bg-gradient-to-b from-[#1A2A44] to-[#1A2A44]/90">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-cinzel text-primary mb-4">Key Regulatory Requirements</h2>
          <p className="text-xl font-montserrat text-white/80 max-w-3xl mx-auto">
            Essential compliance elements for government tender participation. Understanding these requirements is crucial for successful bidding.
          </p>
        </motion.div>
        
        {/* Luxurious Table */}
        <div className="overflow-hidden rounded-lg shadow-[0_0_25px_rgba(0,0,0,0.3)] border border-[#D4AF37]/30">
          {/* Table header */}
          <div className="bg-[#1A2A44] border-b border-[#D4AF37]/50 p-6 grid grid-cols-12 text-white font-cinzel">
            <div className="col-span-3 text-primary font-medium">Requirement</div>
            <div className="col-span-9 text-primary font-medium">Description</div>
          </div>
          
          {/* Table body */}
          <div className="divide-y divide-[#D4AF37]/20">
            {REGULATORY_REQUIREMENTS.map((req) => (
              <RequirementRow 
                key={req.id}
                requirement={req} 
                isExpanded={expandedRequirement === req.id}
                onToggle={() => handleToggle(req.id)}
              />
            ))}
          </div>
        </div>
        
        {/* Note about variability */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-10 p-6 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg"
        >
          <h3 className="text-lg font-cinzel text-primary mb-2">Important Note:</h3>
          <p className="text-white/80 text-sm">
            Requirements vary significantly between tenders based on the procuring entity, contract value, and nature of procurement. 
            Always consult the specific tender document for detailed requirements tailored to each opportunity. 
            Government procurement policies and procedures are subject to periodic updates.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

interface RequirementRowProps {
  requirement: Requirement;
  isExpanded: boolean;
  onToggle: () => void;
}

// Memoize the row component to prevent unnecessary re-renders
const RequirementRow: React.FC<RequirementRowProps> = memo(({ requirement, isExpanded, onToggle }) => {
  return (
    <motion.div
      initial={{ backgroundColor: "rgba(26, 42, 68, 0.95)" }}
      animate={{ 
        backgroundColor: isExpanded ? "rgba(26, 42, 68, 0.85)" : "rgba(26, 42, 68, 0.95)" 
      }}
      transition={{ duration: 0.3 }}
      className="transition-colors duration-300"
      layout="position"
    >
      {/* Main row */}
      <div 
        className={`
          grid grid-cols-12 p-6 cursor-pointer hover:bg-[#D4AF37]/5
          ${isExpanded ? 'bg-[#D4AF37]/5 border-b border-[#D4AF37]/20' : ''}
        `}
        onClick={onToggle}
      >
        {/* Requirement Title Column */}
        <div className="col-span-3 flex items-start">
          <div className="flex-shrink-0 w-8 h-8 mr-3 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={requirement.icon} />
            </svg>
          </div>
          <h3 className="font-cinzel text-primary text-lg">{requirement.title}</h3>
        </div>
        
        {/* Description and toggle Column */}
        <div className="col-span-9 flex flex-col">
          <p className="text-white/90 mb-2">
            {requirement.description}
          </p>
          
          <div className="text-[#D4AF37]/80 text-sm flex justify-between items-center mt-1">
            <span>
              {isExpanded ? 'Click to collapse' : 'Click to see details'}
            </span>
            <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Expanded content */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="p-6 pt-0 grid grid-cols-12 gap-6 bg-[#1A2A44]/80">
          {/* Spacer for alignment with title */}
          <div className="col-span-3"></div>
          
          <div className="col-span-9">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#1A2A44] p-4 rounded-lg border border-[#D4AF37]/20">
                <h4 className="text-primary font-cinzel text-sm mb-2">Why It Matters</h4>
                <p className="text-white/80 text-sm">{requirement.relevance}</p>
              </div>
              
              <div className="bg-[#1A2A44] p-4 rounded-lg border border-[#D4AF37]/20">
                <h4 className="text-primary font-cinzel text-sm mb-2">Example</h4>
                <p className="text-white/80 text-sm">{requirement.example}</p>
              </div>
            </div>
            
            {requirement.details && (
              <div className="mt-6">
                <h4 className="text-primary font-cinzel text-sm mb-3">Key Points to Consider:</h4>
                <ul className="space-y-2">
                  {requirement.details.map((detail, index) => (
                    <li key={index} className="flex items-center text-white/80 text-sm">
                      <span className="text-primary mr-2">•</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Gold gradient line at bottom */}
            <div className="h-px w-full mt-6 bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent"></div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}); 