import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEprocureTenders } from '../../hooks/useEprocureTenders';
import { LiveIndicator } from '../../components/LiveIndicator';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';

// Define Tender interface if it doesn't exist elsewhere in the project
interface Tender {
  _id?: string;
  id?: string;
  title: string;
  referenceNumber: string;
  department: string;
  value: number;
  deadline: string;
  status: string;
  description?: string;
  location?: string;
}

// Define Stats interface
interface TenderStats {
  counts: {
    total: number;
    open: number;
    closingSoon: number;
  };
  values: {
    total: number;
  };
}

// Define SyncStatus interface
interface SyncStatus {
  status: 'syncing' | 'completed' | 'failed' | 'ready';
  timestamp?: number;
}

export default function EprocureTenderDashboard() {
  const { 
    tenders, 
    stats, 
    loading, 
    error, 
    isConnected, 
    lastUpdated, 
    syncStatus, 
    refreshTenders, 
    updateFilters,
    filterTendersLocally
  } = useEprocureTenders();

  const [filters, setFilters] = useState<{
    status: string | null;
    department: string | null;
    minValue: number | null;
    maxValue: number | null;
    searchTerm: string;
  }>({
    status: null,
    department: null,
    minValue: null,
    maxValue: null,
    searchTerm: '',
  });

  const [filteredTenders, setFilteredTenders] = useState<Tender[]>([]);
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);

  // Apply filters locally
  useEffect(() => {
    if (tenders?.length) {
      setFilteredTenders(filterTendersLocally(filters));
    }
  }, [tenders, filters, filterTendersLocally]);

  // Send filters to server when needed
  const applyServerFilters = () => {
    updateFilters(filters);
  };

  // Handle filter changes
  const handleFilterChange = (key: string, value: string | number | null) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      status: null,
      department: null,
      minValue: null,
      maxValue: null,
      searchTerm: '',
    });
  };

  // Get unique departments for filter dropdown
  const departments = [...new Set(tenders?.map(tender => tender.department) || [])];
  
  // Get unique statuses for filter dropdown
  const statuses = [...new Set(tenders?.map(tender => tender.status) || [])];

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Open': return 'success';
      case 'Closing Soon': return 'warning';
      case 'Under Review': return 'info';
      case 'Awarded': return 'default';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A2A44] to-[#0A1A34] py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-cinzel text-3xl text-[#D4AF37] mb-2">Eprocure Tender Dashboard</h1>
            <div className="flex items-center">
              <LiveIndicator isConnected={isConnected} lastUpdated={lastUpdated} />
              
              {/* Sync status badge */}
              {syncStatus && (
                <div className="ml-4">
                  <Badge
                    variant={
                      syncStatus.status === 'completed' ? 'success' :
                      syncStatus.status === 'syncing' ? 'info' :
                      syncStatus.status === 'failed' ? 'error' : 'default'
                    }
                    className="font-montserrat"
                  >
                    {syncStatus.status === 'syncing' ? 'Syncing...' : 
                     syncStatus.status === 'completed' ? 'Synced' :
                     syncStatus.status === 'failed' ? 'Sync Failed' : 'Ready'}
                  </Badge>
                </div>
              )}
            </div>
          </div>
          
          {/* Refresh button */}
          <div>
            <Button
              onClick={refreshTenders}
              disabled={loading || syncStatus?.status === 'syncing'}
              className="bg-[#D4AF37] text-[#1A2A44] hover:bg-[#B79020] transition-colors"
            >
              {loading || syncStatus?.status === 'syncing' ? (
                <div className="flex items-center">
                  <Spinner size="sm" className="mr-2" />
                  <span>Syncing...</span>
                </div>
              ) : (
                <span>Refresh Data</span>
              )}
            </Button>
          </div>
        </div>
        
        {/* Stats summary */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-[#1A2A44] to-[#0D1522] border border-[#D4AF37]/20 p-4 text-white">
              <h3 className="text-[#D4AF37] font-montserrat text-sm mb-1">Total Tenders</h3>
              <p className="text-2xl font-bold">{stats.counts.total}</p>
            </Card>
            
            <Card className="bg-gradient-to-br from-[#1A2A44] to-[#0D1522] border border-[#D4AF37]/20 p-4 text-white">
              <h3 className="text-[#D4AF37] font-montserrat text-sm mb-1">Open Tenders</h3>
              <p className="text-2xl font-bold">{stats.counts.open}</p>
            </Card>
            
            <Card className="bg-gradient-to-br from-[#1A2A44] to-[#0D1522] border border-[#D4AF37]/20 p-4 text-white">
              <h3 className="text-[#D4AF37] font-montserrat text-sm mb-1">Closing Soon</h3>
              <p className="text-2xl font-bold">{stats.counts.closingSoon}</p>
            </Card>
            
            <Card className="bg-gradient-to-br from-[#1A2A44] to-[#0D1522] border border-[#D4AF37]/20 p-4 text-white">
              <h3 className="text-[#D4AF37] font-montserrat text-sm mb-1">Total Value</h3>
              <p className="text-2xl font-bold text-[#D4AF37]">
                {formatCurrency(stats.values.total)}
              </p>
            </Card>
          </div>
        )}
        
        {/* Filters */}
        <Card className="bg-gradient-to-br from-[#1A2A44] to-[#0D1522] border border-[#D4AF37]/20 p-6 mb-8">
          <h2 className="font-cinzel text-xl text-[#D4AF37] mb-4">Filter Tenders</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Status filter */}
            <div>
              <label className="block text-white text-sm mb-1 font-montserrat">Status</label>
              <select 
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value || null)}
                className="w-full bg-[#0A1A34] border border-[#D4AF37]/30 text-white rounded px-3 py-2 focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="">All Statuses</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            
            {/* Department filter */}
            <div>
              <label className="block text-white text-sm mb-1 font-montserrat">Department</label>
              <select 
                value={filters.department || ''}
                onChange={(e) => handleFilterChange('department', e.target.value || null)}
                className="w-full bg-[#0A1A34] border border-[#D4AF37]/30 text-white rounded px-3 py-2 focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            
            {/* Value range */}
            <div>
              <label className="block text-white text-sm mb-1 font-montserrat">Min Value (₹)</label>
              <input 
                type="number" 
                value={filters.minValue || ''}
                onChange={(e) => handleFilterChange('minValue', e.target.value ? Number(e.target.value) : null)}
                className="w-full bg-[#0A1A34] border border-[#D4AF37]/30 text-white rounded px-3 py-2 focus:outline-none focus:border-[#D4AF37]"
                placeholder="Minimum value"
              />
            </div>
            
            {/* Search */}
            <div>
              <label className="block text-white text-sm mb-1 font-montserrat">Search</label>
              <input 
                type="text" 
                value={filters.searchTerm || ''}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                className="w-full bg-[#0A1A34] border border-[#D4AF37]/30 text-white rounded px-3 py-2 focus:outline-none focus:border-[#D4AF37]"
                placeholder="Search tenders"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button
              onClick={clearFilters}
              variant="outline"
              className="border-[#D4AF37]/50 text-[#D4AF37]"
            >
              Clear Filters
            </Button>
            
            <Button
              onClick={applyServerFilters}
              className="bg-[#D4AF37] text-[#1A2A44] hover:bg-[#B79020]"
            >
              Apply Filters
            </Button>
          </div>
        </Card>
        
        {/* View toggle */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-white/60 font-montserrat">
            {filteredTenders.length} tenders displayed
          </div>
          
          <div className="inline-flex bg-[#0D1522]/50 backdrop-blur-sm p-1 rounded-lg">
            <button
              onClick={() => setView('grid')}
              className={`px-4 py-2 rounded-md transition-colors ${
                view === 'grid' 
                  ? 'bg-[#D4AF37] text-[#0D1522]' 
                  : 'text-[#D4AF37] hover:bg-[#D4AF37]/10'
              }`}
            >
              Grid View
            </button>
            <button
              onClick={() => setView('table')}
              className={`px-4 py-2 rounded-md transition-colors ${
                view === 'table' 
                  ? 'bg-[#D4AF37] text-[#0D1522]' 
                  : 'text-[#D4AF37] hover:bg-[#D4AF37]/10'
              }`}
            >
              Table View
            </button>
          </div>
        </div>
        
        {/* Error state */}
        {error && (
          <Card className="bg-red-900/30 border border-red-500/30 p-6 mb-8 text-white">
            <h3 className="text-red-400 font-bold mb-2">Error Loading Tenders</h3>
            <p>{error}</p>
          </Card>
        )}
        
        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* Tenders grid view */}
        {!loading && view === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {filteredTenders.map(tender => (
              <motion.div 
                key={tender._id || tender.id}
                layoutId={`tender-${tender._id || tender.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedTender(tender)}
                className="bg-gradient-to-br from-[#1A2A44] to-[#0D1522] border border-[#D4AF37]/20 rounded-lg p-6 cursor-pointer hover:border-[#D4AF37]/50 transition-all hover:shadow-lg"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-cinzel text-lg text-white flex-1 truncate">{tender.title}</h3>
                  <Badge variant={getStatusColor(tender.status)}>{tender.status}</Badge>
                </div>
                
                <div className="text-white/70 text-sm mb-1">
                  {tender.department}
                </div>
                
                <div className="text-[#D4AF37] font-bold mb-4">
                  {formatCurrency(tender.value)}
                </div>
                
                <div className="flex justify-between text-sm">
                  <div className="text-white/60">
                    Ref: {tender.referenceNumber}
                  </div>
                  <div className="text-white/60">
                    Deadline: {formatDate(tender.deadline)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {/* Tenders table view */}
        {!loading && view === 'table' && (
          <div className="overflow-x-auto mb-8">
            <table className="min-w-full divide-y divide-[#D4AF37]/20">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider">
                    Reference
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider">
                    Deadline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D4AF37]/10">
                {filteredTenders.map(tender => (
                  <motion.tr 
                    key={tender._id || tender.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="cursor-pointer hover:bg-[#D4AF37]/5 transition-colors"
                    onClick={() => setSelectedTender(tender)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">
                      {tender.referenceNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {tender.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">
                      {tender.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D4AF37] font-bold">
                      {formatCurrency(tender.value)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">
                      {formatDate(tender.deadline)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusColor(tender.status)}>
                        {tender.status}
                      </Badge>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Empty state */}
        {!loading && filteredTenders.length === 0 && (
          <div className="text-center py-20 bg-[#0A1A34]/30 rounded-lg border border-[#D4AF37]/10">
            <h3 className="font-cinzel text-xl text-[#D4AF37] mb-2">No Tenders Found</h3>
            <p className="text-white/60">Try adjusting your filters or refreshing the data.</p>
          </div>
        )}
        
        {/* Tender detail modal */}
        <AnimatePresence>
          {selectedTender && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
              onClick={() => setSelectedTender(null)}
            >
              <motion.div 
                layoutId={`tender-${selectedTender._id || selectedTender.id}`}
                className="bg-gradient-to-br from-[#1A2A44] to-[#0D1522] max-w-xl w-full rounded-lg p-6 border border-[#D4AF37]/30 shadow-2xl"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="font-cinzel text-2xl text-[#D4AF37]">{selectedTender.title}</h2>
                  <Badge variant={getStatusColor(selectedTender.status)}>
                    {selectedTender.status}
                  </Badge>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-white/60 text-sm">Reference Number</div>
                      <div className="text-white">{selectedTender.referenceNumber}</div>
                    </div>
                    
                    <div>
                      <div className="text-white/60 text-sm">Department</div>
                      <div className="text-white">{selectedTender.department}</div>
                    </div>
                    
                    <div>
                      <div className="text-white/60 text-sm">Value</div>
                      <div className="text-[#D4AF37] font-bold">{formatCurrency(selectedTender.value)}</div>
                    </div>
                    
                    <div>
                      <div className="text-white/60 text-sm">Deadline</div>
                      <div className="text-white">{formatDate(selectedTender.deadline)}</div>
                    </div>
                  </div>
                  
                  {selectedTender.description && (
                    <div>
                      <div className="text-white/60 text-sm mb-1">Description</div>
                      <div className="text-white text-sm">{selectedTender.description}</div>
                    </div>
                  )}
                  
                  {selectedTender.location && (
                    <div>
                      <div className="text-white/60 text-sm mb-1">Location</div>
                      <div className="text-white">{selectedTender.location}</div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-3">
                  <Button
                    onClick={() => setSelectedTender(null)}
                    variant="outline"
                    className="border-[#D4AF37]/50 text-[#D4AF37]"
                  >
                    Close
                  </Button>
                  
                  <Button
                    className="bg-[#D4AF37] text-[#1A2A44] hover:bg-[#B79020]"
                    onClick={() => {
                      // This would navigate to a dedicated tender page in a real app
                      alert(`View full details for: ${selectedTender.title}`);
                    }}
                  >
                    View Full Details
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 