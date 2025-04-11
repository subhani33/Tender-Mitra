import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, BookOpen, Shield, AlertTriangle } from 'lucide-react';

const Guidelines: React.FC = () => {
  const documents = [
    {
      id: 1,
      title: 'GFR 2017 - Tender Guidelines',
      description: 'Official General Financial Rules (GFR) 2017 guidelines from the Ministry of Finance for government tender processes, including eligibility criteria, submission procedures, and evaluation methodologies.',
      filename: 'GFR_2017_Tender_Guidelines.pdf',
      icon: <BookOpen className="w-6 h-6 text-primary" />,
      category: 'Guidelines'
    },
    {
      id: 2,
      title: 'Public Procurement Act 2012',
      description: 'Official legal regulations governing tender submissions, contractual obligations, and compliance requirements for government procurement in accordance with the Public Procurement Act 2012.',
      filename: 'Public_Procurement_Act_2012.pdf',
      icon: <Shield className="w-6 h-6 text-primary" />,
      category: 'Regulations'
    },
    {
      id: 3,
      title: 'CVC Compliance Checklist',
      description: 'A comprehensive checklist issued by the Central Vigilance Commission to ensure all regulatory requirements are met before submitting your tender application.',
      filename: 'CVC_Compliance_Checklist.pdf',
      icon: <AlertTriangle className="w-6 h-6 text-primary" />,
      category: 'Guidelines'
    },
    {
      id: 4,
      title: 'GeM Portal User Manual',
      description: 'Official user manual for the Government e-Marketplace (GeM) portal, providing detailed instructions on registration, bid submission, and tender tracking.',
      filename: 'GeM_Portal_User_Manual.pdf',
      icon: <BookOpen className="w-6 h-6 text-primary" />,
      category: 'Guidelines'
    },
    {
      id: 5,
      title: 'MSE Procurement Policy',
      description: 'Official policy document outlining special provisions and benefits for Micro and Small Enterprises (MSEs) participating in government tenders.',
      filename: 'MSE_Procurement_Policy.pdf',
      icon: <Shield className="w-6 h-6 text-primary" />,
      category: 'Regulations'
    },
    {
      id: 6,
      title: 'e-Tendering Security Guidelines',
      description: 'Security guidelines and best practices issued by the National Informatics Centre (NIC) for participating in electronic tendering processes securely.',
      filename: 'e-Tendering_Security_Guidelines.pdf',
      icon: <AlertTriangle className="w-6 h-6 text-primary" />,
      category: 'Guidelines'
    }
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-12"
    >
      <h1 className="text-3xl font-cinzel text-primary mb-10 text-center">Guidelines & Documentation</h1>
      
      <p className="text-white/80 max-w-4xl mx-auto mb-10 text-center">
        Access official government guidelines, regulatory documents, and compliance checklists to ensure 
        your tender submissions meet all necessary requirements. All documents are regularly updated to 
        reflect the latest standards and regulations.
      </p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <motion.div
            key={doc.id}
            whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(212, 175, 55, 0.1)' }}
            className="bg-blue-900/20 backdrop-blur-sm rounded-lg overflow-hidden border border-primary/10 transition-all"
          >
            <div className="px-6 py-8">
              <div className="flex items-center mb-4">
                {doc.icon}
                <span className="ml-2 text-xs uppercase tracking-wider text-primary/70">{doc.category}</span>
              </div>
              
              <h3 className="text-xl font-cinzel text-primary mb-3">{doc.title}</h3>
              <p className="text-gray-400 mb-6 text-sm h-24">{doc.description}</p>
              
              <a
                href={`/pdfs/${doc.filename}`}
                download
                className="flex items-center justify-center py-3 px-6 bg-blue-900/30 hover:bg-blue-800/50 text-primary border border-primary/30 rounded transition-all group"
              >
                <FileText className="w-5 h-5 mr-2" />
                <span>Download</span>
                <Download className="w-4 h-4 ml-2 group-hover:translate-y-1 transition-transform" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Guidelines; 