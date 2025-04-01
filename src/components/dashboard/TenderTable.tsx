import { useState } from 'react';
import { TenderStatus } from '../../store/tenderStore';
import { motion } from 'framer-motion';
import { FileText, Download, Bell, Calendar, ArrowUpDown, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { LiveIndicator } from '../LiveIndicator';
import { useTenderSocket } from '../../hooks/useTenderSocket';
import { Tender } from '../../types';

// Status badge component
const StatusBadge = ({ status }: { status: TenderStatus }) => {
  const statusStyles: Record<TenderStatus, string> = {
    'Open': 'bg-green-100 text-green-800',
    'Closed': 'bg-red-100 text-red-800',
    'Under Review': 'bg-amber-100 text-amber-800',
    'Awarded': 'bg-blue-100 text-blue-800',
    'Cancelled': 'bg-gray-100 text-gray-800'
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-sm ${statusStyles[status]}`}>
      {status}
    </span>
  );
};

export default function TenderTable() {
  const { tenders, loading, isConnected, lastUpdated, refreshTenders, updateFilters } = useTenderSocket();
  const [sortField, setSortField] = useState<keyof Tender>('deadline');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);
  const itemsPerPage = 10;
  
  // Sort tenders based on current sort parameters
  const sortedTenders = [...tenders].sort((a, b) => {
    if (sortField === 'value') {
      return sortDirection === 'asc' 
        ? a.value - b.value 
        : b.value - a.value;
    }
    
    if (sortField === 'deadline') {
      return sortDirection === 'asc'
        ? new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        : new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
    }
    
    const aValue = String(a[sortField]).toLowerCase();
    const bValue = String(b[sortField]).toLowerCase();
    return sortDirection === 'asc'
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });
  
  // Calculate pagination
  const totalPages = Math.ceil(sortedTenders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTenders = sortedTenders.slice(startIndex, startIndex + itemsPerPage);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };
  
  // Handle sorting
  const handleSort = (field: keyof Tender) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Check if deadline is approaching (within 7 days)
  const isDeadlineApproaching = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };
  
  // Format currency for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6 w-1/4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <div className="flex justify-between items-center p-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-800">Active Tenders</h3>
          <LiveIndicator isConnected={isConnected} lastUpdated={lastUpdated} />
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Showing {paginatedTenders.length} of {sortedTenders.length} tenders
          </div>
          <button 
            onClick={refreshTenders}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
            title="Refresh tenders"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>
      
      {/* Tender Details Modal */}
      {selectedTender && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold text-gray-800">{selectedTender.title}</h3>
                <button 
                  onClick={() => setSelectedTender(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <StatusBadge status={selectedTender.status} />
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Reference Number</p>
                  <p className="font-medium">{selectedTender.referenceNumber || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Department</p>
                  <p className="font-medium">{selectedTender.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Submission Deadline</p>
                  <p className="font-medium flex items-center">
                    <Calendar size={16} className="mr-1" />
                    {formatDate(selectedTender.deadline)}
                    {isDeadlineApproaching(selectedTender.deadline) && (
                      <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">Approaching</span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Tender Value</p>
                  <p className="font-medium">{formatCurrency(selectedTender.value)}</p>
                </div>
                
                {selectedTender.location && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Location</p>
                    <p className="font-medium">{selectedTender.location}</p>
                  </div>
                )}
                
                {selectedTender.category && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Category</p>
                    <p className="font-medium">{selectedTender.category}</p>
                  </div>
                )}
              </div>
              
              {selectedTender.description && (
                <div className="mt-6">
                  <p className="text-sm text-gray-500 mb-1">Description</p>
                  <p className="text-sm border border-gray-200 rounded-md p-3 bg-gray-50">
                    {selectedTender.description}
                  </p>
                </div>
              )}
              
              <div className="mt-8 flex flex-wrap gap-3">
                {selectedTender.documents && selectedTender.documents.length > 0 && (
                  <a 
                    href={selectedTender.documents[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <Download size={16} />
                    <span>Download Documents</span>
                  </a>
                )}
                
                <button className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50">
                  <Bell size={16} />
                  <span>Set Alert</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-4 px-4 font-semibold text-gray-600">
                <button 
                  onClick={() => handleSort('title')}
                  className="flex items-center gap-1 hover:text-blue-600"
                >
                  Title
                  {sortField === 'title' && <ArrowUpDown size={16} />}
                </button>
              </th>
              <th className="text-left py-4 px-4 font-semibold text-gray-600">
                <button 
                  onClick={() => handleSort('department')}
                  className="flex items-center gap-1 hover:text-blue-600"
                >
                  Department
                  {sortField === 'department' && <ArrowUpDown size={16} />}
                </button>
              </th>
              <th className="text-left py-4 px-4 font-semibold text-gray-600">
                <button 
                  onClick={() => handleSort('deadline')}
                  className="flex items-center gap-1 hover:text-blue-600"
                >
                  Deadline
                  {sortField === 'deadline' && <ArrowUpDown size={16} />}
                </button>
              </th>
              <th className="text-left py-4 px-4 font-semibold text-gray-600">
                <button 
                  onClick={() => handleSort('value')}
                  className="flex items-center gap-1 hover:text-blue-600"
                >
                  Value
                  {sortField === 'value' && <ArrowUpDown size={16} />}
                </button>
              </th>
              <th className="text-left py-4 px-4 font-semibold text-gray-600">
                <button 
                  onClick={() => handleSort('status')}
                  className="flex items-center gap-1 hover:text-blue-600"
                >
                  Status
                  {sortField === 'status' && <ArrowUpDown size={16} />}
                </button>
              </th>
              <th className="text-left py-4 px-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTenders.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500">
                  No tenders found matching your criteria
                </td>
              </tr>
            ) : (
              paginatedTenders.map((tender) => (
                <motion.tr
                  key={tender._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-4">{tender.title}</td>
                  <td className="py-4 px-4">{tender.department}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      {formatDate(tender.deadline)}
                      {isDeadlineApproaching(tender.deadline) && (
                        <span className="ml-2 h-2 w-2 bg-red-500 rounded-full"></span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">{formatCurrency(tender.value)}</td>
                  <td className="py-4 px-4">
                    <StatusBadge status={tender.status} />
                  </td>
                  <td className="py-4 px-4">
                    <button 
                      onClick={() => setSelectedTender(tender)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                    >
                      <FileText size={18} />
                      <span>View</span>
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedTenders.length)} of {sortedTenders.length} tenders
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-md ${
                  currentPage === i + 1
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            )).slice(
              Math.max(0, Math.min(currentPage - 3, totalPages - 5)),
              Math.max(5, Math.min(currentPage + 2, totalPages))
            )}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}