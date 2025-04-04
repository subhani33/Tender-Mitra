import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

// FAQ data
const FAQs: FAQ[] = [
  {
    id: "1",
    question: "What is a government tender?",
    answer: "A government tender is a formal invitation by a government entity inviting bids from potential suppliers or contractors for goods, services, or works required by the government. It's a transparent procurement process to ensure competitive pricing and fair selection of vendors.",
    category: "Basics"
  },
  {
    id: "2",
    question: "How do I find government tenders?",
    answer: "Government tenders can be found on official procurement portals like eProcure, Central Public Procurement Portal (CPPP), various state government procurement portals, and department-specific websites. You can also subscribe to tender alert services or check newspaper advertisements in the tender section.",
    category: "Getting Started"
  },
  {
    id: "3",
    question: "What documents are required to bid for a tender?",
    answer: "Common documents include: Company registration certificate, GST registration, PAN card, Income Tax returns, audited financial statements, work experience certificates, client testimonials, bank solvency certificate, EMD (Earnest Money Deposit), and technical specifications/compliance documents. The exact requirements vary by tender.",
    category: "Documentation"
  },
  {
    id: "4",
    question: "What is Earnest Money Deposit (EMD) and why is it required?",
    answer: "EMD is a security deposit submitted by bidders to demonstrate their seriousness in the bidding process. It protects the tender issuer against bidders who might withdraw or modify their bids during the bid validity period. EMD is typically returned to unsuccessful bidders after the tendering process is complete.",
    category: "Financial"
  },
  {
    id: "5",
    question: "How is a tender winner selected?",
    answer: "Tender selection typically follows either: 1) Lowest Bid (L1) method - where the qualified bidder with the lowest price wins, 2) Quality and Cost Based Selection (QCBS) - where both technical quality and price are weighted, or 3) Technical qualification followed by reverse auction. The specific selection method is mentioned in the tender document.",
    category: "Process"
  },
  {
    id: "6",
    question: "What is the difference between technical bid and financial bid?",
    answer: "A technical bid contains documents demonstrating the bidder's eligibility, qualifications, and technical capacity to execute the project as per specifications. A financial bid contains the price quotation or commercial terms. Most tenders use a two-envelope system where technical bids are evaluated first, and only technically qualified bidders' financial bids are opened.",
    category: "Process"
  },
  {
    id: "7",
    question: "Can tender specifications be challenged?",
    answer: "Yes, bidders can challenge tender specifications if they believe they are restrictive, biased, or ambiguous. Most procurement portals have a pre-bid query system where potential bidders can seek clarifications or suggest changes to specifications. For significant issues, bidders can file complaints with the procuring entity or relevant oversight authorities.",
    category: "Legal"
  },
  {
    id: "8",
    question: "What is performance security/bank guarantee?",
    answer: "Performance security is a financial guarantee that the winning bidder must provide to ensure they will fulfill all obligations under the contract. It's typically 5-10% of the contract value and remains valid throughout the contract period plus warranty period. If the supplier fails to perform, the government can encash this guarantee as compensation.",
    category: "Financial"
  },
  {
    id: "9",
    question: "How can startups participate in government tenders?",
    answer: "The Indian government has introduced several measures to support startups: 1) Exemption from prior experience and turnover requirements in certain tenders, 2) No EMD requirement for registered startups, 3) Relaxed norms for public procurement, and 4) Special startup-focused tenders. Startups should register under the Startup India initiative to avail these benefits.",
    category: "Startups"
  },
  {
    id: "10",
    question: "What are the common reasons for tender rejection?",
    answer: "Common reasons include: 1) Missing or incomplete documentation, 2) Not meeting eligibility criteria, 3) Submitting bids after the deadline, 4) Technical non-compliance with specifications, 5) Errors in financial calculations, 6) Not signing or stamping required documents, 7) Insufficient EMD amount, and 8) Conditional bids when not permitted.",
    category: "Mistakes to Avoid"
  },
  {
    id: "11",
    question: "How can I improve my chances of winning a government tender?",
    answer: "To improve your chances: 1) Ensure 100% compliance with eligibility criteria, 2) Provide comprehensive documentation, 3) Attend pre-bid meetings, 4) Form strategic partnerships if needed, 5) Price competitively based on market research, 6) Highlight unique strengths and USPs, 7) Ensure error-free submission, and 8) Build a track record with smaller contracts first.",
    category: "Strategy"
  },
  {
    id: "12",
    question: "What is GeM (Government e-Marketplace)?",
    answer: "GeM is an online platform for procurement of goods and services by government departments, organizations, and PSUs. It provides an end-to-end solution from listing of products/services to bidding, reverse auction, ordering, and payment processing. Suppliers must register on GeM to sell to government entities through this platform.",
    category: "Platforms"
  }
];

// Group FAQs by category
const groupedFAQs = FAQs.reduce((groups, faq) => {
  if (!groups[faq.category]) {
    groups[faq.category] = [];
  }
  groups[faq.category].push(faq);
  return groups;
}, {} as Record<string, FAQ[]>);

export const TenderFAQ: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(Object.keys(groupedFAQs)[0]);
  
  return (
    <div className="py-16 bg-[#1A2A44]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-cinzel text-primary mb-4">Frequently Asked Questions</h2>
          <p className="text-xl font-montserrat text-white/80 max-w-3xl mx-auto">
            Find answers to common questions about government tenders, bidding processes, and how to overcome challenges.
          </p>
        </motion.div>
        
        {/* Category navigation */}
        <div className="mb-12 flex justify-center">
          <div className="flex flex-wrap justify-center gap-3">
            {Object.keys(groupedFAQs).map((category) => (
              <motion.button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeCategory === category 
                    ? 'bg-primary text-[#1A2A44]' 
                    : 'bg-[#D4AF37]/10 text-[#D4AF37]/90 hover:bg-[#D4AF37]/20'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
        
        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {activeCategory && (
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {groupedFAQs[activeCategory].map((faq) => (
                  <AccordionItem key={faq.id} faq={faq} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

interface AccordionItemProps {
  faq: FAQ;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleOpen = () => setIsOpen(!isOpen);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="mb-4"
    >
      <div 
        onClick={toggleOpen}
        className={`
          p-5 rounded-t-lg cursor-pointer flex justify-between items-center transition-all
          ${isOpen 
            ? 'bg-[#D4AF37]/20 shadow-[0_0_15px_rgba(212,175,55,0.15)]' 
            : 'bg-[#1A2A44]/80 hover:bg-[#1A2A44]/60 border border-[#D4AF37]/10 rounded-b-lg'
          }
        `}
      >
        <h3 className="font-cinzel text-lg text-primary flex-1 pr-4">{faq.question}</h3>
        <div className={`text-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className={`
              p-5 rounded-b-lg font-montserrat bg-[#1A2A44]/40 border-b border-l border-r border-[#D4AF37]/10
              ${isOpen ? 'border-[#D4AF37]/20' : ''}
            `}>
              <p className="text-white/90 leading-relaxed">{faq.answer}</p>
              
              {/* Gold gradient divider at bottom */}
              <div className="h-0.5 w-full mt-4 bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}; 