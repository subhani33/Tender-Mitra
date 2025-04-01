import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Card } from '../../components/ui';
import { formatCurrency } from '../../utils/helpers';

// Define types
interface UploadFile extends File {
  name: string;
  size: number;
}

interface ChecklistItem {
  id: string;
  label: string;
  isCompleted: boolean;
}

interface BidAnalysis {
  points: number;
  competitiveness: number;
  completeness: number;
  compliance: number;
  valueProposition: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

interface Tender {
  id: string;
  title: string;
  department: string;
  value: number;
  deadline: string | Date;
  status: string;
}

// Icons
const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const WarningIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

// File Upload Dropzone component
interface UploadDropzoneProps {
  title: string;
  description: string;
  acceptedFiles: string;
  onFileUpload: (file: UploadFile) => void;
  icon: React.ReactNode;
}

const UploadDropzone: React.FC<UploadDropzoneProps> = ({ title, description, acceptedFiles, onFileUpload, icon }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<UploadFile | null>(null);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0] as UploadFile);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0] as UploadFile);
    }
  };
  
  const processFile = (file: UploadFile) => {
    // Check file type if needed
    setFile(file);
    setUploadStatus('uploading');
    
    // Simulate upload delay
    setTimeout(() => {
      onFileUpload(file);
      setUploadStatus('success');
    }, 1500);
  };
  
  return (
    <motion.div
      className={`relative bg-black bg-opacity-50 backdrop-blur-sm border-2 rounded-lg transition-all p-6
        ${isDragging ? 'border-[#D4AF37]' : 'border-[#D4AF37]/30'}
        ${uploadStatus === 'success' ? 'border-emerald-500' : ''}
        ${uploadStatus === 'error' ? 'border-red-500' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Glow effect */}
      <div className={`absolute inset-0 rounded-lg transition-opacity duration-1000
        bg-gradient-to-r from-[#D4AF37]/5 to-[#D4AF37]/20
        ${isDragging ? 'opacity-100' : 'opacity-50'}`}
      />
      
      <div className="flex flex-col items-center text-center relative z-10">
        <div className="mb-3">
          {uploadStatus === 'idle' && icon}
          {uploadStatus === 'uploading' && (
            <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          )}
          {uploadStatus === 'success' && <CheckIcon />}
          {uploadStatus === 'error' && <WarningIcon />}
        </div>
        
        <h3 className="text-xl font-cinzel text-[#D4AF37] mb-2">{title}</h3>
        
        {file ? (
          <div className="mb-3">
            <p className="text-white font-montserrat text-sm">{file.name}</p>
            <p className="text-gray-400 text-xs mt-1">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <p className="text-gray-400 text-sm font-montserrat mb-4">{description}</p>
        )}
        
        {(uploadStatus === 'idle' || uploadStatus === 'error') && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-[#D4AF37] hover:bg-[#B79020] text-[#1A2A44] rounded font-montserrat text-sm transition-colors"
          >
            Choose File
          </button>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFiles}
          onChange={handleFileChange}
          className="hidden"
        />
        
        {uploadStatus === 'success' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mt-4"
          >
            <div className="w-16 h-16 mx-auto relative">
              <div className="absolute inset-0 bg-[#D4AF37] rounded-full opacity-20 animate-ping" />
              <div className="absolute inset-2 bg-[#D4AF37] rounded-full opacity-40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-8 h-8 text-[#D4AF37]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <p className="text-emerald-400 mt-2 text-sm font-montserrat">Upload Complete</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// Bid Checklist Item Component
interface ChecklistItemProps {
  label: string;
  isCompleted: boolean;
  onClick: () => void;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({ label, isCompleted, onClick }) => {
  return (
    <motion.div
      className={`flex items-center p-3 border 
        ${isCompleted ? 'border-emerald-500/50 bg-emerald-900/20' : 'border-[#D4AF37]/30'} 
        rounded-lg mb-2`}
      whileHover={{ x: 5 }}
      onClick={onClick}
    >
      <div className={`w-6 h-6 flex items-center justify-center rounded-full mr-3
        ${isCompleted ? 'bg-emerald-500' : 'border-2 border-[#D4AF37]'}`}>
        {isCompleted && (
          <motion.svg
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-4 h-4 text-white"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </motion.svg>
        )}
      </div>
      <span className={`${isCompleted ? 'text-emerald-300' : 'text-white'} font-montserrat text-sm`}>
        {label}
      </span>
    </motion.div>
  );
};

// Bid Analysis Panel
interface BidAnalysisPanelProps {
  analysis: BidAnalysis;
}

const BidAnalysisPanel: React.FC<BidAnalysisPanelProps> = ({ analysis }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <motion.div
      className="bg-black bg-opacity-50 backdrop-blur-sm border border-[#D4AF37]/30 rounded-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h3 className="text-xl font-cinzel text-[#D4AF37] mb-4">Bid Analysis</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-white font-montserrat">Competitiveness Score</span>
          <div className="w-24 h-3 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${analysis.competitiveness}%` }}
              transition={{ delay: 0.5, duration: 1 }}
            />
          </div>
          <span className="text-[#D4AF37] font-bold ml-2">{analysis.competitiveness}%</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-white font-montserrat">Compliance Score</span>
          <div className="w-24 h-3 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${analysis.compliance}%` }}
              transition={{ delay: 0.6, duration: 1 }}
            />
          </div>
          <span className="text-[#D4AF37] font-bold ml-2">{analysis.compliance}%</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-white font-montserrat">Value Proposition</span>
          <div className="w-24 h-3 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${analysis.valueProposition}%` }}
              transition={{ delay: 0.7, duration: 1 }}
            />
          </div>
          <span className="text-[#D4AF37] font-bold ml-2">{analysis.valueProposition}%</span>
        </div>
      </div>
      
      <button
        className="mt-5 w-full text-center text-[#D4AF37] hover:text-[#D4AF37]/80 text-sm font-montserrat"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? 'Show Less' : 'View Detailed Analysis'}
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="pt-4 overflow-hidden"
          >
            <div className="border-t border-[#D4AF37]/20 pt-4 text-sm text-gray-300 font-montserrat space-y-4">
              <p><strong className="text-[#D4AF37]">Strengths:</strong> {analysis.strengths.join(', ')}</p>
              <p><strong className="text-[#D4AF37]">Weaknesses:</strong> {analysis.weaknesses.join(', ')}</p>
              <p><strong className="text-[#D4AF37]">Recommendations:</strong> {analysis.recommendations.join(', ')}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Submission Panel
interface SubmissionPanelProps {
  checklist: ChecklistItem[];
  onSubmit: () => void;
}

const SubmissionPanel: React.FC<SubmissionPanelProps> = ({ checklist, onSubmit }) => {
  const allCompleted = checklist.every(item => item.isCompleted);
  
  const getCompletionPercentage = () => {
    const completed = checklist.filter(item => item.isCompleted).length;
    return Math.round((completed / checklist.length) * 100);
  };
  
  return (
    <motion.div
      className="mt-6 bg-black bg-opacity-50 backdrop-blur-sm border border-[#D4AF37]/30 rounded-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h3 className="text-xl font-cinzel text-[#D4AF37] mb-4">Final Submission</h3>
      
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-white font-montserrat text-sm">Completion Status</span>
          <span className="text-[#D4AF37] font-montserrat text-sm">{getCompletionPercentage()}%</span>
        </div>
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${allCompleted ? 'bg-emerald-500' : 'bg-[#D4AF37]'}`}
            initial={{ width: 0 }}
            animate={{ width: `${getCompletionPercentage()}%` }}
            transition={{ delay: 0.5, duration: 1 }}
          />
        </div>
      </div>
      
      <button
        className={`w-full py-3 rounded-lg font-cinzel font-bold text-center transition-all ${
          allCompleted 
            ? 'bg-gradient-to-r from-[#D4AF37] to-[#B79020] text-[#1A2A44] shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/30' 
            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
        }`}
        disabled={!allCompleted}
        onClick={allCompleted ? onSubmit : undefined}
      >
        {allCompleted ? 'Submit Bid' : 'Complete All Requirements'}
      </button>
      
      {!allCompleted && (
        <p className="mt-3 text-center text-amber-500 text-sm font-montserrat">
          Please complete all requirements before submission
        </p>
      )}
    </motion.div>
  );
};

// Main Component
export default function CommandThrone() {
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: '1', label: 'Technical Proposal Uploaded', isCompleted: false },
    { id: '2', label: 'Financial Offer Uploaded', isCompleted: false },
    { id: '3', label: 'Company Information Verified', isCompleted: false },
    { id: '4', label: 'Required Certifications Uploaded', isCompleted: false },
    { id: '5', label: 'Final Review Completed', isCompleted: false },
  ]);
  
  const [analysis, setAnalysis] = useState<BidAnalysis>({
    points: 78,
    competitiveness: 85,
    completeness: 90,
    compliance: 92,
    valueProposition: 83,
    strengths: [
      'Competitive pricing structure',
      'Strong technical approach',
      'Clear implementation timeline',
    ],
    weaknesses: [
      'Limited case studies provided',
      'Some certifications might need updating',
    ],
    recommendations: [
      'Add more prior experience examples',
      'Review pricing for optimization',
      'Include testimonials from similar projects',
    ]
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Handle file upload
  const handleFileUpload = (file: UploadFile, type: string) => {
    console.log(`Uploaded ${type} file:`, file);
    
    // Update checklist based on file type
    const newChecklist = [...checklist];
    
    if (type === 'technical') {
      newChecklist[0].isCompleted = true;
    } else if (type === 'financial') {
      newChecklist[1].isCompleted = true;
    }
    
    setChecklist(newChecklist);
  };
  
  // Toggle checklist item
  const toggleChecklistItem = (id: string) => {
    const newChecklist = checklist.map(item => 
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    );
    setChecklist(newChecklist);
  };
  
  // Handle submission
  const handleSubmit = () => {
    setIsSubmitted(true);
  };
  
  // Mock tender data
  useEffect(() => {
    // Simulate fetching tender data
    setTimeout(() => {
      setSelectedTender({
        id: 'T-2023-05-1249',
        title: 'National Infrastructure Development Project',
        department: 'Ministry of Urban Development',
        value: 250000000,
        deadline: '2024-09-30T23:59:59',
        status: 'Open',
      });
    }, 1000);
  }, []);
  
  // Calculate time remaining until deadline
  const getTimeRemaining = () => {
    if (!selectedTender) return null;
    
    const deadline = new Date(selectedTender.deadline);
    const now = new Date();
    
    const diff = deadline.getTime() - now.getTime();
    
    if (diff <= 0) return 'Deadline passed';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return `${days} days, ${hours} hours remaining`;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A2A44] to-[#0A1A34] p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-10">
        <h1 className="font-cinzel text-4xl md:text-5xl text-[#D4AF37] font-bold">Command Throne</h1>
        <p className="text-white/70 mt-2 font-montserrat max-w-2xl">
          Prepare and submit your bid with precision and elegance. Our advanced tools analyze your submission for optimal competitiveness.
        </p>
      </div>
      
      {isSubmitted ? (
        // Success view
        <motion.div 
          className="max-w-2xl mx-auto text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div 
            className="w-32 h-32 mx-auto relative mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <div className="absolute inset-0 rounded-full bg-[#D4AF37]/20 animate-ping" />
            <div className="absolute inset-4 rounded-full bg-[#D4AF37]/30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-16 h-16 text-[#D4AF37]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </motion.div>
          
          <h2 className="font-cinzel text-3xl text-[#D4AF37] mb-4">Bid Successfully Submitted</h2>
          <p className="text-white font-montserrat mb-8">
            Your bid for <span className="text-[#D4AF37]">{selectedTender?.title}</span> has been received and is now being processed.
          </p>
          
          <div className="bg-black bg-opacity-50 backdrop-blur-sm border border-[#D4AF37]/30 rounded-lg p-6 inline-block">
            <div className="text-left">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Submission ID</span>
                <span className="text-white">BID-{Math.floor(Math.random() * 10000)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Submission Date</span>
                <span className="text-white">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Confirmation</span>
                <span className="text-emerald-400">Email Sent</span>
              </div>
            </div>
          </div>
          
          <button 
            className="mt-8 px-6 py-3 bg-[#D4AF37] hover:bg-[#B79020] text-[#1A2A44] rounded-lg font-montserrat font-bold"
            onClick={() => setIsSubmitted(false)}
          >
            Prepare Another Bid
          </button>
        </motion.div>
      ) : (
        // Main bid tool interface
        <div className="max-w-6xl mx-auto">
          {/* Selected tender info */}
          {selectedTender ? (
            <div className="bg-black bg-opacity-60 backdrop-blur-md border border-[#D4AF37] rounded-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h2 className="font-cinzel text-2xl text-[#D4AF37] mb-2">{selectedTender.title}</h2>
                  <div className="flex flex-col sm:flex-row sm:items-center text-sm">
                    <span className="text-white font-montserrat mr-4">{selectedTender.department}</span>
                    <span className="text-[#D4AF37] font-bold">
                      {formatCurrency(selectedTender.value, 'INR')}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end mt-4 md:mt-0">
                  <div className="px-3 py-1 bg-emerald-900/50 text-emerald-400 text-sm rounded-full mb-1">
                    {selectedTender.status}
                  </div>
                  <div className="text-amber-400 text-sm font-montserrat">
                    {getTimeRemaining()}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-black bg-opacity-60 backdrop-blur-md border border-[#D4AF37]/50 rounded-lg p-6 mb-8 animate-pulse">
              <div className="h-7 w-2/3 bg-[#D4AF37]/20 rounded mb-3"></div>
              <div className="h-5 w-1/3 bg-[#D4AF37]/10 rounded"></div>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Uploads */}
            <div className="space-y-6">
              <UploadDropzone 
                title="Technical Proposal"
                description="Upload your detailed technical approach document (PDF, DOCX)"
                acceptedFiles=".pdf,.docx"
                onFileUpload={(file) => handleFileUpload(file, 'technical')}
                icon={<UploadIcon />}
              />
              
              <UploadDropzone 
                title="Financial Bid"
                description="Upload your pricing details and financial offer (PDF, XLSX)"
                acceptedFiles=".pdf,.xlsx"
                onFileUpload={(file) => handleFileUpload(file, 'financial')}
                icon={<UploadIcon />}
              />
            </div>
            
            {/* Middle Column - Checklist */}
            <div className="bg-black bg-opacity-50 backdrop-blur-sm border border-[#D4AF37]/30 rounded-lg p-6">
              <h3 className="text-xl font-cinzel text-[#D4AF37] mb-4">Bid Checklist</h3>
              
              {checklist.map(item => (
                <ChecklistItem 
                  key={item.id}
                  label={item.label}
                  isCompleted={item.isCompleted}
                  onClick={() => toggleChecklistItem(item.id)}
                />
              ))}
              
              <SubmissionPanel 
                checklist={checklist} 
                onSubmit={handleSubmit} 
              />
            </div>
            
            {/* Right Column - Analysis */}
            <div>
              <BidAnalysisPanel analysis={analysis} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 