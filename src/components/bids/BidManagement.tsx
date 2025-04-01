import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui';
import { useLocation } from 'react-router-dom';

interface Bid {
  id: number;
  tenderId: number;
  tenderTitle: string;
  amount: number;
  proposal: string;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  submittedAt: string;
}

type BidTab = 'active' | 'past' | 'analytics';

interface BidManagementProps {
  onNotify?: (message: string) => void;
}

const BidManagement: React.FC<BidManagementProps> = ({ onNotify }) => {
  const location = useLocation();
  const [bids, setBids] = useState<Bid[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<BidTab>('active');
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  
  // Charts refs
  const statusChartRef = useRef<HTMLCanvasElement>(null);
  const valueChartRef = useRef<HTMLCanvasElement>(null);
  
  // Form state
  const [tenderId, setTenderId] = useState<string>('');
  const [tenderTitle, setTenderTitle] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [proposal, setProposal] = useState<string>('');
  
  // Mock tenders data for dropdown
  const mockTenders = [
    { id: 1, title: 'Road Construction Project' },
    { id: 2, title: 'Hospital Equipment Supply' },
    { id: 3, title: 'Education Software Development' },
    { id: 4, title: 'Municipal Waste Management System' },
    { id: 5, title: 'Smart City Infrastructure Project' }
  ];
  
  // Mock bids data
  const mockBids: Bid[] = [
    {
      id: 1,
      tenderId: 1,
      tenderTitle: 'Road Construction Project',
      amount: 980000,
      proposal: 'Our company has 15 years of experience in road construction. We propose to complete the project in 10 months with the highest quality materials.',
      status: 'pending',
      submittedAt: '2024-04-01T10:30:00'
    },
    {
      id: 2,
      tenderId: 2,
      tenderTitle: 'Hospital Equipment Supply',
      amount: 495000,
      proposal: 'We are an authorized distributor of medical equipment and can supply all items within 45 days of order confirmation.',
      status: 'accepted',
      submittedAt: '2024-03-15T14:20:00'
    },
    {
      id: 3,
      tenderId: 3,
      tenderTitle: 'Education Software Development',
      amount: 350000,
      proposal: 'Our team specializes in educational software with personalized learning paths and analytics dashboards.',
      status: 'rejected',
      submittedAt: '2024-02-20T09:15:00'
    },
    {
      id: 4,
      tenderId: 4,
      tenderTitle: 'Municipal Waste Management System',
      amount: 1250000,
      proposal: 'We offer a comprehensive waste management solution including collection, segregation, and recycling.',
      status: 'withdrawn',
      submittedAt: '2024-03-05T16:45:00'
    },
    {
      id: 5,
      tenderId: 5,
      tenderTitle: 'Smart City Infrastructure Project',
      amount: 2300000,
      proposal: 'Our proposal includes IoT sensors, data analytics platform, and mobile applications for smart city management.',
      status: 'pending',
      submittedAt: '2024-04-10T11:20:00'
    }
  ];
  
  // Parse query parameters if any
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryTenderId = params.get('tenderId');
    const queryTenderTitle = params.get('tenderTitle');
    
    if (queryTenderId) {
      setTenderId(queryTenderId);
    }
    
    if (queryTenderTitle) {
      setTenderTitle(queryTenderTitle);
    }
    
    // Load bids (mock implementation)
    setBids(mockBids);
  }, [location]);
  
  // Draw analytics charts when tab changes to analytics
  useEffect(() => {
    if (activeTab === 'analytics' && statusChartRef.current && valueChartRef.current) {
      drawStatusChart();
      drawValueChart();
    }
  }, [activeTab, bids]);
  
  // Draw bid status distribution chart
  const drawStatusChart = () => {
    if (!statusChartRef.current) return;
    
    const ctx = statusChartRef.current.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, statusChartRef.current.width, statusChartRef.current.height);
    
    // Count bids by status
    const statusCounts = {
      pending: bids.filter(bid => bid.status === 'pending').length,
      accepted: bids.filter(bid => bid.status === 'accepted').length,
      rejected: bids.filter(bid => bid.status === 'rejected').length,
      withdrawn: bids.filter(bid => bid.status === 'withdrawn').length
    };
    
    // Define colors
    const colors = {
      pending: '#3b82f6',    // Blue
      accepted: '#10b981',   // Green
      rejected: '#ef4444',   // Red
      withdrawn: '#9ca3af'   // Gray
    };
    
    // Set up pie chart
    const centerX = statusChartRef.current.width / 2;
    const centerY = statusChartRef.current.height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    
    // Calculate total for percentages
    const total = Object.values(statusCounts).reduce((acc, val) => acc + val, 0);
    
    // Draw pie slices
    let startAngle = 0;
    Object.entries(statusCounts).forEach(([status, count]) => {
      if (count === 0) return;
      
      const sliceAngle = (count / total) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;
      
      // Draw slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      
      // Fill with color
      ctx.fillStyle = colors[status as keyof typeof colors];
      ctx.fill();
      
      // Draw label
      const midAngle = startAngle + sliceAngle / 2;
      const labelRadius = radius * 0.7;
      const labelX = centerX + Math.cos(midAngle) * labelRadius;
      const labelY = centerY + Math.sin(midAngle) * labelRadius;
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${Math.round((count / total) * 100)}%`, labelX, labelY);
      
      startAngle = endAngle;
    });
    
    // Draw legend
    const legendY = statusChartRef.current.height - 20;
    let legendX = 20;
    const legendSpacing = 120;
    
    Object.entries(colors).forEach(([status, color]) => {
      // Draw color box
      ctx.fillStyle = color;
      ctx.fillRect(legendX, legendY, 12, 12);
      
      // Draw label
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        `${status.charAt(0).toUpperCase() + status.slice(1)} (${statusCounts[status as keyof typeof statusCounts]})`, 
        legendX + 18, 
        legendY + 6
      );
      
      legendX += legendSpacing;
    });
  };
  
  // Draw bid value chart
  const drawValueChart = () => {
    if (!valueChartRef.current) return;
    
    const ctx = valueChartRef.current.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, valueChartRef.current.width, valueChartRef.current.height);
    
    // Get bid values
    const sortedBids = [...bids].sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());
    
    // Set up bar chart
    const barWidth = valueChartRef.current.width / (sortedBids.length + 2);
    const maxAmount = Math.max(...sortedBids.map(bid => bid.amount));
    const maxHeight = valueChartRef.current.height - 60;
    
    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = '#555555';
    ctx.lineWidth = 2;
    ctx.moveTo(40, 20);
    ctx.lineTo(40, valueChartRef.current.height - 40);
    ctx.lineTo(valueChartRef.current.width - 20, valueChartRef.current.height - 40);
    ctx.stroke();
    
    // Draw y-axis labels
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    
    // Draw y-axis ticks
    for (let i = 0; i <= 5; i++) {
      const y = valueChartRef.current.height - 40 - (i * maxHeight / 5);
      const value = Math.round(maxAmount * i / 5);
      
      ctx.beginPath();
      ctx.moveTo(35, y);
      ctx.lineTo(40, y);
      ctx.stroke();
      
      ctx.fillText(`₹${(value / 1000)}K`, 30, y);
    }
    
    // Draw bars
    sortedBids.forEach((bid, index) => {
      const x = 60 + index * barWidth;
      const barHeight = (bid.amount / maxAmount) * maxHeight;
      const y = valueChartRef.current.height - 40 - barHeight;
      
      // Get color based on status
      let color;
      switch (bid.status) {
        case 'accepted': color = '#10b981'; break;
        case 'rejected': color = '#ef4444'; break;
        case 'withdrawn': color = '#9ca3af'; break;
        default: color = '#3b82f6'; break;
      }
      
      // Draw bar
      ctx.fillStyle = color;
      ctx.fillRect(x, y, barWidth - 10, barHeight);
      
      // Draw amount at top
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(`₹${(bid.amount / 1000)}K`, x + (barWidth - 10) / 2, y - 5);
      
      // Draw x-axis label (date)
      const date = new Date(bid.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(date, x + (barWidth - 10) / 2, valueChartRef.current.height - 35);
    });
    
    // Draw title
    ctx.fillStyle = '#D4AF37';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('Bid Amounts Over Time', valueChartRef.current.width / 2, 5);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    // Validate form
    if (!tenderId || !amount || !proposal) {
      if (onNotify) {
        onNotify('Please fill all required fields');
      }
      setIsSubmitting(false);
      return;
    }
    
    // Create new bid
    setTimeout(() => {
      const newBid: Bid = {
        id: bids.length + 1,
        tenderId: parseInt(tenderId),
        tenderTitle: tenderTitle || mockTenders.find(t => t.id === parseInt(tenderId))?.title || 'Unknown Tender',
        amount: parseFloat(amount),
        proposal,
        status: 'pending',
        submittedAt: new Date().toISOString()
      };
      
      setBids([newBid, ...bids]);
      
      // Reset form
      setTenderId('');
      setTenderTitle('');
      setAmount('');
      setProposal('');
      
      // Show success animation
      setShowSuccessAnimation(true);
      setTimeout(() => setShowSuccessAnimation(false), 2000);
      
      if (onNotify) {
        onNotify('Bid submitted successfully!');
      }
      
      setIsSubmitting(false);
    }, 1000);
  };
  
  // Handle tender selection
  const handleTenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setTenderId(id);
    
    if (id) {
      const tender = mockTenders.find(t => t.id === parseInt(id));
      if (tender) {
        setTenderTitle(tender.title);
      }
    } else {
      setTenderTitle('');
    }
  };
  
  // Filter active bids (pending)
  const activeBids = bids.filter(bid => bid.status === 'pending');
  
  // Filter past bids (accepted, rejected, withdrawn)
  const pastBids = bids.filter(bid => ['accepted', 'rejected', 'withdrawn'].includes(bid.status));
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-cinzel text-[#D4AF37] mb-8 text-center">Bid Management</h1>
      
      {/* Success Animation */}
      <AnimatePresence>
        {showSuccessAnimation && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div className="bg-[#D4AF37]/20 backdrop-blur-md p-8 rounded-full border-4 border-[#D4AF37]">
              <svg className="w-20 h-20 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Bid Submission Form */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto mb-12 bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-[#D4AF37]/20"
      >
        <h2 className="text-2xl font-cinzel text-[#D4AF37] mb-6">Submit a New Bid</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-[#D4AF37] mb-2 font-medium">Tender</label>
              <select
                value={tenderId}
                onChange={handleTenderChange}
                className="w-full bg-[#1A2A44] border border-[#D4AF37]/30 rounded p-2 text-white focus:outline-none focus:border-[#D4AF37]"
                disabled={!!tenderTitle} // Disable if specific tender was passed via URL
              >
                <option value="">Select a Tender</option>
                {mockTenders.map(tender => (
                  <option key={tender.id} value={tender.id}>{tender.title}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-[#D4AF37] mb-2 font-medium">Bid Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter bid amount"
                className="w-full bg-[#1A2A44] border border-[#D4AF37]/30 rounded p-2 text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-[#D4AF37] mb-2 font-medium">Proposal</label>
            <textarea
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              placeholder="Describe your bid proposal, qualifications, and delivery timeline"
              rows={5}
              className="w-full bg-[#1A2A44] border border-[#D4AF37]/30 rounded p-2 text-white focus:outline-none focus:border-[#D4AF37]"
            ></textarea>
          </div>
          
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 bg-[#D4AF37] hover:bg-[#D4AF37]/80 text-[#1A2A44] rounded-md font-medium transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#1A2A44]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : 'Submit Bid'}
            </button>
          </div>
        </form>
      </motion.div>
      
      {/* Tabs */}
      <div className="max-w-5xl mx-auto">
        <div className="flex border-b border-[#D4AF37]/20 mb-6">
          <button
            className={`py-2 px-4 font-medium transition-colors ${
              activeTab === 'active'
              ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]'
              : 'text-white/60 hover:text-white'
            }`}
            onClick={() => setActiveTab('active')}
          >
            Active Bids ({activeBids.length})
          </button>
          <button
            className={`py-2 px-4 font-medium transition-colors ${
              activeTab === 'past'
              ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]'
              : 'text-white/60 hover:text-white'
            }`}
            onClick={() => setActiveTab('past')}
          >
            Past Bids ({pastBids.length})
          </button>
          <button
            className={`py-2 px-4 font-medium transition-colors ${
              activeTab === 'analytics'
              ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]'
              : 'text-white/60 hover:text-white'
            }`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
        </div>
        
        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'active' && (
            <motion.div
              key="active"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeBids.length === 0 ? (
                <div className="text-center py-10 bg-white/5 backdrop-blur-sm rounded-lg border border-[#D4AF37]/20">
                  <p className="text-white/60">You don't have any active bids at the moment.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {activeBids.map((bid) => (
                    <motion.div 
                      key={bid.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
                    >
                      <Card className="bg-white/5 backdrop-blur-sm border border-[#D4AF37]/20">
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-xl font-cinzel text-[#D4AF37]">{bid.tenderTitle}</h3>
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-900/30 text-blue-400">
                              Pending
                            </span>
                          </div>
                          
                          <div className="mb-4 text-lg font-medium text-[#D4AF37]">
                            ₹{bid.amount.toLocaleString()}
                          </div>
                          
                          <div className="bg-[#1A2A44]/50 p-4 rounded mb-4">
                            <h4 className="text-[#D4AF37] text-sm mb-2">Your Proposal:</h4>
                            <p className="text-white/80">{bid.proposal}</p>
                          </div>
                          
                          <div className="flex justify-between items-center text-sm text-white/60">
                            <span>Submitted: {new Date(bid.submittedAt).toLocaleDateString()}</span>
                            <div className="flex space-x-2">
                              <button 
                                className="px-3 py-1 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] rounded-md transition-colors"
                                onClick={() => {
                                  if (onNotify) onNotify(`Bid for "${bid.tenderTitle}" updated!`);
                                }}
                              >
                                Edit
                              </button>
                              <button 
                                className="px-3 py-1 bg-red-900/20 hover:bg-red-900/30 text-red-400 rounded-md transition-colors"
                                onClick={() => {
                                  const updatedBids = bids.map(b => 
                                    b.id === bid.id ? {...b, status: 'withdrawn' as const} : b
                                  );
                                  setBids(updatedBids);
                                  if (onNotify) onNotify(`Bid for "${bid.tenderTitle}" withdrawn.`);
                                }}
                              >
                                Withdraw
                              </button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
          
          {activeTab === 'past' && (
            <motion.div
              key="past"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {pastBids.length === 0 ? (
                <div className="text-center py-10 bg-white/5 backdrop-blur-sm rounded-lg border border-[#D4AF37]/20">
                  <p className="text-white/60">You don't have any past bids yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {pastBids.map((bid) => (
                    <motion.div 
                      key={bid.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      whileHover={{ y: -5 }}
                    >
                      <Card className="bg-white/5 backdrop-blur-sm border border-[#D4AF37]/20">
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-xl font-cinzel text-[#D4AF37]">{bid.tenderTitle}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              bid.status === 'accepted' ? 'bg-emerald-900/30 text-emerald-400' :
                              bid.status === 'rejected' ? 'bg-red-900/30 text-red-400' :
                              'bg-gray-900/30 text-gray-400'
                            }`}>
                              {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                            </span>
                          </div>
                          
                          <div className="mb-4 text-lg font-medium text-[#D4AF37]">
                            ₹{bid.amount.toLocaleString()}
                          </div>
                          
                          <div className="bg-[#1A2A44]/50 p-4 rounded mb-4">
                            <h4 className="text-[#D4AF37] text-sm mb-2">Your Proposal:</h4>
                            <p className="text-white/80">{bid.proposal}</p>
                          </div>
                          
                          <div className="text-sm text-white/60">
                            <span>Submitted: {new Date(bid.submittedAt).toLocaleDateString()}</span>
                            {bid.status === 'accepted' && (
                              <div className="mt-3 p-2 bg-emerald-900/20 rounded text-emerald-400">
                                <p className="font-medium">This bid was accepted! Check your email for further instructions.</p>
                              </div>
                            )}
                            {bid.status === 'rejected' && (
                              <div className="mt-3 p-2 bg-red-900/20 rounded text-red-400">
                                <p className="font-medium">This bid was not selected. Better luck next time!</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
          
          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white/5 backdrop-blur-sm border border-[#D4AF37]/20 p-6">
                  <h3 className="text-xl font-cinzel text-[#D4AF37] mb-4">Bid Status Distribution</h3>
                  <div className="w-full h-64 relative">
                    <canvas ref={statusChartRef} width="400" height="260"></canvas>
                  </div>
                </Card>
                
                <Card className="bg-white/5 backdrop-blur-sm border border-[#D4AF37]/20 p-6">
                  <h3 className="text-xl font-cinzel text-[#D4AF37] mb-4">Bid Value Analysis</h3>
                  <div className="w-full h-64 relative">
                    <canvas ref={valueChartRef} width="400" height="260"></canvas>
                  </div>
                </Card>
              </div>
              
              <Card className="bg-white/5 backdrop-blur-sm border border-[#D4AF37]/20 p-6">
                <h3 className="text-xl font-cinzel text-[#D4AF37] mb-4">Bid Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#1A2A44]/50 p-4 rounded text-center">
                    <p className="text-white/60 text-sm">Total Bids</p>
                    <p className="text-[#D4AF37] text-2xl font-bold">{bids.length}</p>
                  </div>
                  <div className="bg-[#1A2A44]/50 p-4 rounded text-center">
                    <p className="text-white/60 text-sm">Success Rate</p>
                    <p className="text-[#D4AF37] text-2xl font-bold">
                      {bids.length > 0 
                        ? `${Math.round((bids.filter(b => b.status === 'accepted').length / bids.length) * 100)}%` 
                        : '0%'}
                    </p>
                  </div>
                  <div className="bg-[#1A2A44]/50 p-4 rounded text-center">
                    <p className="text-white/60 text-sm">Average Bid</p>
                    <p className="text-[#D4AF37] text-2xl font-bold">
                      {bids.length > 0 
                        ? `₹${Math.round(bids.reduce((acc, bid) => acc + bid.amount, 0) / bids.length).toLocaleString()}` 
                        : '₹0'}
                    </p>
                  </div>
                  <div className="bg-[#1A2A44]/50 p-4 rounded text-center">
                    <p className="text-white/60 text-sm">Total Value</p>
                    <p className="text-[#D4AF37] text-2xl font-bold">
                      ₹{bids.reduce((acc, bid) => acc + bid.amount, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BidManagement; 