import { Check, AlertTriangle, Info, BarChart3, RotateCw, Settings as SettingsIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DataSourceProps {
  name: string;
  status: 'online' | 'offline' | 'degraded';
  accuracy: number;
  lastUpdate: string;
  responseTime?: number; // in ms
  uptime?: number; // percentage
}

// Enhanced data source component with interactivity
const DataSource = ({ name, status, accuracy, lastUpdate, responseTime = 120, uptime = 99.8 }: DataSourceProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const statusColors = {
    online: 'bg-green-100 text-green-800 border-green-200',
    offline: 'bg-red-100 text-red-800 border-red-200',
    degraded: 'bg-amber-100 text-amber-800 border-amber-200'
  };
  
  const statusText = {
    online: 'Online',
    offline: 'Offline',
    degraded: 'Degraded'
  };
  
  const statusIcon = {
    online: <Check size={14} className="text-green-600" />,
    offline: <AlertTriangle size={14} className="text-red-600" />,
    degraded: <Info size={14} className="text-amber-600" />
  };
  
  // Get color based on accuracy
  const getAccuracyColor = (acc: number) => {
    if (acc >= 95) return 'text-green-600';
    if (acc >= 80) return 'text-amber-600';
    return 'text-red-600';
  };
  
  // Get color for response time
  const getResponseTimeColor = (time: number) => {
    if (time < 100) return 'text-green-600';
    if (time < 300) return 'text-amber-600';
    return 'text-red-600';
  };
  
  return (
    <motion.div 
      className={`border-b border-gray-100 overflow-hidden transition-all duration-300 ${isExpanded ? 'bg-blue-50/30' : ''}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div 
        className="flex items-center justify-between py-3 px-4 cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className={`p-1 rounded-full ${statusColors[status]}`}>
            {statusIcon[status]}
          </div>
          <span className="font-medium">{name}</span>
          {status === 'online' && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-6">
          <div>
            <span className="text-sm text-gray-500 mr-2">Accuracy:</span>
            <span className={`text-sm font-medium ${getAccuracyColor(accuracy)}`}>
              {accuracy}%
            </span>
          </div>
          <div className="text-sm text-gray-500">
            Updated: {lastUpdate}
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-gray-400"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </div>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-4 pb-4 pt-2 border-t border-gray-100"
          >
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Performance Metrics</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Response Time</span>
                      <span className={`text-sm font-medium ${getResponseTimeColor(responseTime)}`}>{responseTime}ms</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <motion.div 
                        className={`h-1.5 rounded-full ${responseTime < 100 ? 'bg-green-500' : responseTime < 300 ? 'bg-amber-500' : 'bg-red-500'}`} 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((responseTime / 500) * 100, 100)}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Uptime</span>
                      <span className="text-sm font-medium text-green-600">{uptime}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <motion.div 
                        className="h-1.5 rounded-full bg-green-500" 
                        initial={{ width: 0 }}
                        animate={{ width: `${uptime}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Data Accuracy</span>
                      <span className={`text-sm font-medium ${getAccuracyColor(accuracy)}`}>{accuracy}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <motion.div 
                        className={`h-1.5 rounded-full ${accuracy >= 95 ? 'bg-green-500' : accuracy >= 80 ? 'bg-amber-500' : 'bg-red-500'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${accuracy}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Activity</h4>
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-start">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 mr-2"></div>
                      <div>
                        <p className="text-sm text-gray-700">
                          {i === 0 ? 'Data synchronized successfully' : 
                           i === 1 ? 'API connection verified' : 
                           'Data validation completed'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {i === 0 ? '12 minutes ago' : 
                           i === 1 ? '45 minutes ago' : 
                           '2 hours ago'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 flex gap-2">
                  <button className="px-3 py-1.5 text-xs font-medium rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex items-center gap-1">
                    <RotateCw size={12} />
                    <span>Refresh</span>
                  </button>
                  <button className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors flex items-center gap-1">
                    <SettingsIcon size={12} />
                    <span>Configure</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Circular progress indicator component
interface CircularProgressProps {
  value: number;
  color: string;
  size?: number;
  strokeWidth?: number;
}

const CircularProgress = ({ 
  value, 
  color, 
  size = 100, 
  strokeWidth = 8 
}: CircularProgressProps) => {
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (value / 100) * circumference;
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          className="text-gray-200"
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <motion.circle
          className={color}
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: progress }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span 
          className={`text-xl font-bold ${color}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {value}%
        </motion.span>
      </div>
    </div>
  );
};

export default function DataQuality() {
  const [showDetails, setShowDetails] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'sources'>('overview');
  
  // Mock data sources
  const dataSources: DataSourceProps[] = [
    { 
      name: 'Central Procurement Portal', 
      status: 'online', 
      accuracy: 99.8, 
      lastUpdate: '10 min ago',
      responseTime: 85,
      uptime: 99.9
    },
    { 
      name: 'State Tender Database', 
      status: 'online', 
      accuracy: 97.5, 
      lastUpdate: '15 min ago',
      responseTime: 110,
      uptime: 99.5
    },
    { 
      name: 'Ministry Portal Scraper', 
      status: 'degraded', 
      accuracy: 85.2, 
      lastUpdate: '32 min ago',
      responseTime: 340,
      uptime: 96.8
    },
    { 
      name: 'Local Government API', 
      status: 'online', 
      accuracy: 96.1, 
      lastUpdate: '8 min ago',
      responseTime: 95,
      uptime: 99.2
    },
    { 
      name: 'Defence Procurement Feed', 
      status: 'offline', 
      accuracy: 0, 
      lastUpdate: '3 hours ago',
      responseTime: 0,
      uptime: 92.5
    }
  ];
  
  // Calculate overall data quality
  const onlineOrDegraded = dataSources.filter(source => source.status !== 'offline');
  const overallAccuracy = onlineOrDegraded.length 
    ? onlineOrDegraded.reduce((sum, source) => sum + source.accuracy, 0) / onlineOrDegraded.length 
    : 0;
    
  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };
  
  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg p-6 mb-8 overflow-hidden border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <BarChart3 className="text-blue-600" size={20} />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Data Quality Monitor</h2>
        </div>
        
        <div className="flex items-center gap-3">
          <motion.button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 disabled:opacity-50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: isRefreshing ? 360 : 0 }}
              transition={{ 
                duration: 1,
                repeat: isRefreshing ? Infinity : 0,
                ease: "linear"
              }}
            >
              <RotateCw size={14} />
            </motion.div>
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </motion.button>
          
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <BarChart3 size={14} />
            <span>{showDetails ? 'Hide Details' : 'Show Details'}</span>
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="bg-gray-50 p-1 rounded-lg flex mb-6">
          <button 
            className={`flex-1 py-2 text-sm font-medium rounded-md transition ${activeTab === 'overview' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`flex-1 py-2 text-sm font-medium rounded-md transition ${activeTab === 'sources' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('sources')}
          >
            Data Sources
          </button>
        </div>
        
        <AnimatePresence mode="wait">
          {activeTab === 'overview' ? (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
              <div className="md:col-span-1 flex flex-col items-center justify-center">
                <CircularProgress 
                  value={Math.round(overallAccuracy * 10) / 10} 
                  color="text-blue-500" 
                  size={150}
                  strokeWidth={10}
                />
                <p className="mt-3 font-bold text-gray-800 text-lg">Overall Accuracy</p>
              </div>
              
              <div className="md:col-span-3 grid grid-cols-3 gap-6">
                <motion.div 
                  className="rounded-xl p-6 border border-gray-100 shadow-sm bg-gradient-to-br from-green-50 to-green-100"
                  whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-5xl font-bold text-green-600">
                    {dataSources.filter(s => s.status === 'online').length}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Check size={16} className="text-green-600" />
                    <p className="text-green-800 font-medium">Online Sources</p>
                  </div>
                  <div className="mt-3 h-1.5 w-full bg-white rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-green-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(dataSources.filter(s => s.status === 'online').length / dataSources.length) * 100}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </motion.div>
                
                <motion.div 
                  className="rounded-xl p-6 border border-gray-100 shadow-sm bg-gradient-to-br from-amber-50 to-amber-100"
                  whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-5xl font-bold text-amber-600">
                    {dataSources.filter(s => s.status === 'degraded').length}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Info size={16} className="text-amber-600" />
                    <p className="text-amber-800 font-medium">Degraded Sources</p>
                  </div>
                  <div className="mt-3 h-1.5 w-full bg-white rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-amber-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(dataSources.filter(s => s.status === 'degraded').length / dataSources.length) * 100}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </motion.div>
                
                <motion.div 
                  className="rounded-xl p-6 border border-gray-100 shadow-sm bg-gradient-to-br from-red-50 to-red-100"
                  whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-5xl font-bold text-red-600">
                    {dataSources.filter(s => s.status === 'offline').length}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <AlertTriangle size={16} className="text-red-600" />
                    <p className="text-red-800 font-medium">Offline Sources</p>
                  </div>
                  <div className="mt-3 h-1.5 w-full bg-white rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-red-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(dataSources.filter(s => s.status === 'offline').length / dataSources.length) * 100}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="sources"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                {dataSources.map((source, index) => (
                  <DataSource key={index} {...source} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="mt-6 flex justify-between text-sm text-gray-500 p-2 bg-gray-50 rounded-lg">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Last system check: Today, 10:45 AM
        </span>
        <span className="flex items-center gap-2">
          <Check size={14} className="text-green-500" />
          Automated data validation: Enabled
        </span>
      </div>
    </motion.div>
  );
} 