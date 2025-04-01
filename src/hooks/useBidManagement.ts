import { useState, useEffect, useCallback } from 'react';

// Types for bid management
export interface BidDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  status: 'pending' | 'approved' | 'rejected';
  url: string;
}

export interface BidTaskItem {
  id: string;
  text: string;
  completed: boolean;
  category: string;
  dueDate?: string;
}

export interface Bid {
  id: string;
  tenderReference: string;
  title: string;
  status: 'draft' | 'in-progress' | 'submitted' | 'awarded' | 'rejected';
  deadline: string;
  value: number;
  department: string;
  documents: BidDocument[];
  tasks: BidTaskItem[];
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface BidStats {
  drafts: number;
  inProgress: number;
  submitted: number;
  awarded: number;
  rejected: number;
  documentsUploaded: number;
  tasksCompleted: number;
  totalValue: number;
}

// Mock data for development
const mockBids: Bid[] = [
  {
    id: 'bid-001',
    tenderReference: 'GOVT/IT/2023/001',
    title: 'Supply of IT Equipment for Government Offices',
    status: 'in-progress',
    deadline: '2023-12-15T00:00:00.000Z',
    value: 7500000,
    department: 'Ministry of Technology',
    documents: [
      {
        id: 'doc-001',
        name: 'Technical Proposal.pdf',
        type: 'application/pdf',
        size: 2500000,
        uploadDate: '2023-11-01T10:30:00.000Z',
        status: 'approved',
        url: '/mock-files/technical-proposal.pdf'
      },
      {
        id: 'doc-002',
        name: 'Financial Bid.xlsx',
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        size: 1200000,
        uploadDate: '2023-11-02T14:45:00.000Z',
        status: 'pending',
        url: '/mock-files/financial-bid.xlsx'
      }
    ],
    tasks: [
      {
        id: 'task-001',
        text: 'Complete technical specifications document',
        completed: true,
        category: 'Technical'
      },
      {
        id: 'task-002',
        text: 'Finalize equipment pricing',
        completed: true,
        category: 'Financial'
      },
      {
        id: 'task-003',
        text: 'Obtain quality certifications',
        completed: false,
        category: 'Compliance',
        dueDate: '2023-11-30T00:00:00.000Z'
      },
      {
        id: 'task-004',
        text: 'Arrange bid security/EMD',
        completed: false,
        category: 'Financial',
        dueDate: '2023-12-01T00:00:00.000Z'
      }
    ],
    progress: 65,
    createdAt: '2023-10-15T08:00:00.000Z',
    updatedAt: '2023-11-02T14:45:00.000Z'
  },
  {
    id: 'bid-002',
    tenderReference: 'TOUR/CON/2023/015',
    title: 'Construction of Luxury Hotel Complex',
    status: 'draft',
    deadline: '2023-11-30T00:00:00.000Z',
    value: 250000000,
    department: 'Department of Tourism',
    documents: [
      {
        id: 'doc-003',
        name: 'Preliminary Design.pdf',
        type: 'application/pdf',
        size: 5000000,
        uploadDate: '2023-10-20T09:15:00.000Z',
        status: 'pending',
        url: '/mock-files/preliminary-design.pdf'
      }
    ],
    tasks: [
      {
        id: 'task-005',
        text: 'Complete architectural drawings',
        completed: false,
        category: 'Technical',
        dueDate: '2023-11-15T00:00:00.000Z'
      },
      {
        id: 'task-006',
        text: 'Prepare cost estimation report',
        completed: false,
        category: 'Financial',
        dueDate: '2023-11-10T00:00:00.000Z'
      }
    ],
    progress: 25,
    createdAt: '2023-10-18T11:30:00.000Z',
    updatedAt: '2023-10-20T09:15:00.000Z'
  },
  {
    id: 'bid-003',
    tenderReference: 'HEALTH/MED/2023/022',
    title: 'Supply of Medical Equipment for Hospitals',
    status: 'submitted',
    deadline: '2023-10-30T00:00:00.000Z',
    value: 35000000,
    department: 'Ministry of Health',
    documents: [
      {
        id: 'doc-004',
        name: 'Technical Specifications.pdf',
        type: 'application/pdf',
        size: 3000000,
        uploadDate: '2023-10-15T08:20:00.000Z',
        status: 'approved',
        url: '/mock-files/tech-specs.pdf'
      },
      {
        id: 'doc-005',
        name: 'Price Schedule.xlsx',
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        size: 1000000,
        uploadDate: '2023-10-15T10:45:00.000Z',
        status: 'approved',
        url: '/mock-files/price-schedule.xlsx'
      },
      {
        id: 'doc-006',
        name: 'Quality Certificates.zip',
        type: 'application/zip',
        size: 8000000,
        uploadDate: '2023-10-16T14:30:00.000Z',
        status: 'approved',
        url: '/mock-files/quality-certs.zip'
      }
    ],
    tasks: [
      {
        id: 'task-007',
        text: 'Prepare detailed technical proposal',
        completed: true,
        category: 'Technical'
      },
      {
        id: 'task-008',
        text: 'Compile quality certificates',
        completed: true,
        category: 'Compliance'
      },
      {
        id: 'task-009',
        text: 'Finalize pricing strategy',
        completed: true,
        category: 'Financial'
      },
      {
        id: 'task-010',
        text: 'Submit bid electronically',
        completed: true,
        category: 'Submission'
      }
    ],
    progress: 100,
    createdAt: '2023-10-01T09:00:00.000Z',
    updatedAt: '2023-10-28T15:30:00.000Z'
  }
];

// Calculate mock stats
const calculateStats = (bids: Bid[]): BidStats => {
  const stats: BidStats = {
    drafts: 0,
    inProgress: 0,
    submitted: 0,
    awarded: 0,
    rejected: 0,
    documentsUploaded: 0,
    tasksCompleted: 0,
    totalValue: 0
  };
  
  bids.forEach(bid => {
    switch (bid.status) {
      case 'draft': stats.drafts++; break;
      case 'in-progress': stats.inProgress++; break;
      case 'submitted': stats.submitted++; break;
      case 'awarded': stats.awarded++; break;
      case 'rejected': stats.rejected++; break;
    }
    
    stats.documentsUploaded += bid.documents.length;
    stats.tasksCompleted += bid.tasks.filter(task => task.completed).length;
    stats.totalValue += bid.value;
  });
  
  return stats;
};

export function useBidManagement() {
  const [bids, setBids] = useState<Bid[]>([]);
  const [stats, setStats] = useState<BidStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeBidId, setActiveBidId] = useState<string | null>(null);
  
  // Fetch bids (mock implementation)
  const fetchBids = useCallback(async () => {
    try {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Set mock data
      setBids(mockBids);
      setStats(calculateStats(mockBids));
      
      return mockBids;
    } catch (err) {
      setError(`Failed to fetch bids: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Initialize data on component mount
  useEffect(() => {
    fetchBids();
  }, [fetchBids]);
  
  // Get a bid by ID
  const getBidById = useCallback((id: string) => {
    return bids.find(bid => bid.id === id) || null;
  }, [bids]);
  
  // Set active bid
  const setActiveBid = useCallback((id: string | null) => {
    setActiveBidId(id);
  }, []);
  
  // Update bid progress
  const updateBidProgress = useCallback((id: string, newProgress: number) => {
    setBids(prevBids => 
      prevBids.map(bid => 
        bid.id === id ? { ...bid, progress: newProgress, updatedAt: new Date().toISOString() } : bid
      )
    );
  }, []);
  
  // Update bid status
  const updateBidStatus = useCallback((id: string, newStatus: Bid['status']) => {
    setBids(prevBids => 
      prevBids.map(bid => 
        bid.id === id ? { ...bid, status: newStatus, updatedAt: new Date().toISOString() } : bid
      )
    );
    
    // Recalculate stats
    setBids(currentBids => {
      setStats(calculateStats(currentBids));
      return currentBids;
    });
  }, []);
  
  // Add document to bid
  const addDocument = useCallback((bidId: string, document: Omit<BidDocument, 'id'>) => {
    const newDocument: BidDocument = {
      ...document,
      id: `doc-${Date.now()}`
    };
    
    setBids(prevBids => 
      prevBids.map(bid => 
        bid.id === bidId 
          ? { 
              ...bid, 
              documents: [...bid.documents, newDocument],
              updatedAt: new Date().toISOString()
            } 
          : bid
      )
    );
    
    // Recalculate stats
    setBids(currentBids => {
      setStats(calculateStats(currentBids));
      return currentBids;
    });
    
    return newDocument;
  }, []);
  
  // Update document status
  const updateDocumentStatus = useCallback((bidId: string, documentId: string, newStatus: BidDocument['status']) => {
    setBids(prevBids => 
      prevBids.map(bid => 
        bid.id === bidId 
          ? { 
              ...bid, 
              documents: bid.documents.map(doc => 
                doc.id === documentId ? { ...doc, status: newStatus } : doc
              ),
              updatedAt: new Date().toISOString()
            } 
          : bid
      )
    );
  }, []);
  
  // Add task to bid
  const addTask = useCallback((bidId: string, task: Omit<BidTaskItem, 'id'>) => {
    const newTask: BidTaskItem = {
      ...task,
      id: `task-${Date.now()}`
    };
    
    setBids(prevBids => 
      prevBids.map(bid => 
        bid.id === bidId 
          ? { 
              ...bid, 
              tasks: [...bid.tasks, newTask],
              updatedAt: new Date().toISOString()
            } 
          : bid
      )
    );
    
    return newTask;
  }, []);
  
  // Toggle task completion
  const toggleTaskCompletion = useCallback((bidId: string, taskId: string) => {
    setBids(prevBids => 
      prevBids.map(bid => 
        bid.id === bidId 
          ? { 
              ...bid, 
              tasks: bid.tasks.map(task => 
                task.id === taskId ? { ...task, completed: !task.completed } : task
              ),
              updatedAt: new Date().toISOString()
            } 
          : bid
      )
    );
    
    // Recalculate stats and update bid progress
    setBids(currentBids => {
      const updatedBid = currentBids.find(b => b.id === bidId);
      if (updatedBid) {
        const completedTasks = updatedBid.tasks.filter(t => t.completed).length;
        const totalTasks = updatedBid.tasks.length;
        const newProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        
        return currentBids.map(bid => 
          bid.id === bidId ? { ...bid, progress: newProgress } : bid
        );
      }
      return currentBids;
    });
    
    // Update stats
    setBids(currentBids => {
      setStats(calculateStats(currentBids));
      return currentBids;
    });
  }, []);
  
  // Create new bid
  const createBid = useCallback((bidData: Omit<Bid, 'id' | 'documents' | 'tasks' | 'progress' | 'createdAt' | 'updatedAt'>) => {
    const newBid: Bid = {
      ...bidData,
      id: `bid-${Date.now()}`,
      documents: [],
      tasks: [],
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setBids(prevBids => [...prevBids, newBid]);
    
    // Update stats
    setBids(currentBids => {
      setStats(calculateStats(currentBids));
      return currentBids;
    });
    
    return newBid;
  }, []);
  
  // Filter bids by status
  const filterBidsByStatus = useCallback((status?: Bid['status']) => {
    if (!status) return bids;
    return bids.filter(bid => bid.status === status);
  }, [bids]);
  
  // Search bids
  const searchBids = useCallback((query: string) => {
    if (!query.trim()) return bids;
    
    const searchLower = query.toLowerCase();
    return bids.filter(bid => 
      bid.title.toLowerCase().includes(searchLower) || 
      bid.tenderReference.toLowerCase().includes(searchLower) ||
      bid.department.toLowerCase().includes(searchLower)
    );
  }, [bids]);
  
  return {
    bids,
    stats,
    loading,
    error,
    activeBidId,
    getBidById,
    setActiveBid,
    updateBidProgress,
    updateBidStatus,
    addDocument,
    updateDocumentStatus,
    addTask,
    toggleTaskCompletion,
    createBid,
    filterBidsByStatus,
    searchBids,
    refreshBids: fetchBids
  };
} 