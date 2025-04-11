import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MapPin, Calendar, FileText, Clock, Tag, Filter } from 'lucide-react';

// Define types
interface TenderItem {
  id: string;
  title: string;
  state: string;
  department: string;
  deadline: string;
  valueRange: string;
  category: string;
  refNumber: string;
}

interface IndiaStatesTenderListProps {
  className?: string;
  limit?: number;
  filterByState?: string;
  onTenderClick?: (tender: TenderItem) => void;
}

// List of Indian states
const INDIA_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
  'Andaman and Nicobar Islands', 'Dadra and Nagar Haveli and Daman and Diu',
  'Lakshadweep'
];

// Categories
const CATEGORIES = [
  'Construction', 'IT Services', 'Healthcare', 'Education', 'Transportation',
  'Agriculture', 'Defense', 'Energy', 'Water Supply', 'Telecommunications',
  'Mining', 'Manufacturing', 'Research', 'Security', 'Tourism', 'Environment'
];

// Departments
const DEPARTMENTS = [
  'Public Works Department', 'Health Department', 'Education Department',
  'Finance Department', 'Rural Development', 'Urban Development',
  'Agriculture Department', 'Water Resources', 'Electricity Board',
  'Transport Department', 'Forest Department', 'Social Welfare',
  'IT Department', 'Police Department', 'Tourism Department',
  'Industries Department', 'Revenue Department', 'Municipal Corporation'
];

// Generate random tender data
const generateTenders = (count: number): TenderItem[] => {
  const tenders: TenderItem[] = [];
  
  for (let i = 0; i < count; i++) {
    const state = INDIA_STATES[Math.floor(Math.random() * INDIA_STATES.length)];
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const department = DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)];
    const valueRanges = [
      '₹10-50 Lakhs', '₹50-100 Lakhs', '₹1-5 Crore', '₹5-10 Crore', 
      '₹10-50 Crore', '₹50-100 Crore', '₹100+ Crore'
    ];
    
    // Generate a deadline between today and 30 days from now
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + Math.floor(Math.random() * 30));
    const deadline = futureDate.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
    
    // Generate a random tender ID
    const tenderIdPrefix = state.substring(0, 2).toUpperCase();
    const tenderId = `${tenderIdPrefix}-TND-${new Date().getFullYear()}-${100000 + Math.floor(Math.random() * 900000)}`;
    
    tenders.push({
      id: `tender-${i}`,
      title: `${state} ${department} ${category} Project`,
      state,
      department,
      deadline,
      valueRange: valueRanges[Math.floor(Math.random() * valueRanges.length)],
      category,
      refNumber: tenderId
    });
  }
  
  return tenders;
};

// Main component
const IndiaStatesTenderList: React.FC<IndiaStatesTenderListProps> = ({
  className = '',
  limit = 10,
  filterByState,
  onTenderClick
}) => {
  // Generate a lot of tenders initially
  const [allTenders] = useState<TenderItem[]>(generateTenders(50));
  const [expandedStates, setExpandedStates] = useState<Record<string, boolean>>({});
  const [selectedState, setSelectedState] = useState<string | null>(filterByState || null);
  
  // Handle expanding/collapsing a state
  const toggleState = (state: string) => {
    setExpandedStates(prev => ({
      ...prev,
      [state]: !prev[state]
    }));
  };
  
  // Handle state filter change
  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedState(e.target.value || null);
  };
  
  // Filter and group tenders by state
  const getFilteredTenders = () => {
    const filtered = selectedState 
      ? allTenders.filter(tender => tender.state === selectedState)
      : allTenders;
      
    return filtered.slice(0, limit);
  };
  
  // Group tenders by state
  const groupByState = (tenders: TenderItem[]) => {
    const grouped: Record<string, TenderItem[]> = {};
    
    tenders.forEach(tender => {
      if (!grouped[tender.state]) {
        grouped[tender.state] = [];
      }
      grouped[tender.state].push(tender);
    });
    
    return grouped;
  };
  
  const filteredTenders = getFilteredTenders();
  const groupedTenders = groupByState(filteredTenders);
  
  return (
    <div className={`bg-secondary/30 backdrop-blur-sm rounded-lg border border-primary/10 ${className}`}>
      <div className="p-4 border-b border-primary/10">
        <h3 className="text-xl font-cinzel text-primary mb-4">Tenders Across India</h3>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/70 w-4 h-4" />
            <select
              value={selectedState || ''}
              onChange={handleStateChange}
              className="w-full py-2 pl-9 pr-3 bg-black/20 text-white rounded-md border border-primary/20 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 focus:outline-none appearance-none"
            >
              <option value="">All States</option>
              {INDIA_STATES.sort().map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary/70 w-4 h-4 pointer-events-none" />
          </div>
        </div>
      </div>
      
      {Object.keys(groupedTenders).length === 0 ? (
        <div className="p-8 text-center text-white/60">
          <p>No tenders found for the selected filters.</p>
        </div>
      ) : (
        <div>
          {Object.entries(groupedTenders).map(([state, stateTenders]) => (
            <div key={state} className="border-b border-primary/10 last:border-b-0">
              <div 
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5"
                onClick={() => toggleState(state)}
              >
                <h4 className="font-semibold text-white flex items-center">
                  <MapPin className="w-4 h-4 text-primary mr-2" />
                  {state}
                  <span className="ml-2 text-white/50 text-sm">
                    ({stateTenders.length} tender{stateTenders.length !== 1 ? 's' : ''})
                  </span>
                </h4>
                <ChevronDown 
                  className={`w-5 h-5 text-primary/70 transition-transform ${expandedStates[state] ? 'transform rotate-180' : ''}`} 
                />
              </div>
              
              <AnimatePresence>
                {expandedStates[state] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    {stateTenders.map(tender => (
                      <div 
                        key={tender.id}
                        className="p-4 border-t border-primary/5 hover:bg-white/5 transition-colors cursor-pointer"
                        onClick={() => onTenderClick?.(tender)}
                      >
                        <h5 className="font-medium text-white mb-2">{tender.title}</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="flex items-center text-sm text-white/70">
                            <FileText className="w-3 h-3 text-primary/70 mr-1" />
                            Ref: {tender.refNumber}
                          </div>
                          <div className="flex items-center text-sm text-white/70">
                            <Calendar className="w-3 h-3 text-primary/70 mr-1" />
                            Deadline: {tender.deadline}
                          </div>
                          <div className="flex items-center text-sm text-white/70">
                            <Tag className="w-3 h-3 text-primary/70 mr-1" />
                            {tender.category}
                          </div>
                          <div className="flex items-center text-sm text-white/70">
                            <Clock className="w-3 h-3 text-primary/70 mr-1" />
                            Value: {tender.valueRange}
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IndiaStatesTenderList; 