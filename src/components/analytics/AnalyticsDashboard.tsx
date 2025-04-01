import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui';

// We'll use a simple canvas-based chart for demo purposes
// In a real app, you would use Chart.js, Recharts, or similar
const AnalyticsDashboard: React.FC = () => {
  const categoryChartRef = useRef<HTMLCanvasElement>(null);
  const valueChartRef = useRef<HTMLCanvasElement>(null);
  const statusChartRef = useRef<HTMLCanvasElement>(null);

  // Mock analytics data
  const analyticsData = {
    tendersByCategory: [
      { category: 'Infrastructure', count: 24 },
      { category: 'Healthcare', count: 18 },
      { category: 'Technology', count: 12 },
      { category: 'Education', count: 8 },
      { category: 'Transportation', count: 6 },
    ],
    tenderValueByMonth: [
      { month: 'Jan', value: 12000000 },
      { month: 'Feb', value: 15000000 },
      { month: 'Mar', value: 9000000 },
      { month: 'Apr', value: 18000000 },
      { month: 'May', value: 22000000 },
      { month: 'Jun', value: 16000000 },
    ],
    bidStatusDistribution: [
      { status: 'Pending', count: 12 },
      { status: 'Accepted', count: 5 },
      { status: 'Rejected', count: 3 },
    ],
    keyMetrics: [
      { label: 'Total Active Tenders', value: 68 },
      { label: 'Bids Submitted', value: 20 },
      { label: 'Success Rate', value: '25%' },
      { label: 'Avg. Bid Value', value: '₹4.2M' },
    ],
    recentActivity: [
      { type: 'Bid', description: 'Bid accepted for Hospital Equipment Supply', time: '2 days ago' },
      { type: 'Tender', description: 'New tender: Smart City Infrastructure', time: '3 days ago' },
      { type: 'Bid', description: 'Submitted bid for Road Construction Project', time: '1 week ago' },
    ]
  };

  // Draw the charts when component mounts
  useEffect(() => {
    // Simple bar chart for categories
    if (categoryChartRef.current) {
      const ctx = categoryChartRef.current.getContext('2d');
      if (ctx) {
        const data = analyticsData.tendersByCategory;
        const maxCount = Math.max(...data.map(d => d.count));
        const barWidth = categoryChartRef.current.width / (data.length * 2);
        
        ctx.clearRect(0, 0, categoryChartRef.current.width, categoryChartRef.current.height);
        
        // Draw bars
        data.forEach((item, index) => {
          const barHeight = (item.count / maxCount) * (categoryChartRef.current!.height - 60);
          const x = index * (barWidth * 2) + barWidth / 2;
          const y = categoryChartRef.current!.height - barHeight - 30;
          
          // Draw bar
          ctx.fillStyle = 'rgba(212, 175, 55, 0.8)';
          ctx.fillRect(x, y, barWidth, barHeight);
          
          // Draw label
          ctx.fillStyle = 'white';
          ctx.font = '10px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(item.category, x + barWidth / 2, categoryChartRef.current!.height - 10);
          
          // Draw value
          ctx.fillText(item.count.toString(), x + barWidth / 2, y - 5);
        });
      }
    }
    
    // Line chart for monthly values
    if (valueChartRef.current) {
      const ctx = valueChartRef.current.getContext('2d');
      if (ctx) {
        const data = analyticsData.tenderValueByMonth;
        const maxValue = Math.max(...data.map(d => d.value));
        const width = valueChartRef.current.width;
        const height = valueChartRef.current.height;
        
        ctx.clearRect(0, 0, width, height);
        
        // Draw axes
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.moveTo(30, 20);
        ctx.lineTo(30, height - 30);
        ctx.lineTo(width - 20, height - 30);
        ctx.stroke();
        
        // Draw line
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.8)';
        ctx.lineWidth = 2;
        
        data.forEach((point, index) => {
          const x = 30 + (index * (width - 50) / (data.length - 1));
          const y = height - 30 - ((point.value / maxValue) * (height - 50));
          
          if (index === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          
          // Draw point
          ctx.fillStyle = '#D4AF37';
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();
          
          // Draw label
          ctx.fillStyle = 'white';
          ctx.font = '10px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(point.month, x, height - 15);
          
          // Draw value (in millions)
          ctx.fillText(`₹${(point.value / 1000000).toFixed(1)}M`, x, y - 10);
        });
        
        ctx.stroke();
      }
    }
    
    // Pie chart for bid status
    if (statusChartRef.current) {
      const ctx = statusChartRef.current.getContext('2d');
      if (ctx) {
        const data = analyticsData.bidStatusDistribution;
        const total = data.reduce((sum, item) => sum + item.count, 0);
        const centerX = statusChartRef.current.width / 2;
        const centerY = statusChartRef.current.height / 2;
        const radius = Math.min(centerX, centerY) - 20;
        
        // Colors for each status
        const colors = {
          'Pending': 'rgba(79, 129, 189, 0.8)',
          'Accepted': 'rgba(155, 187, 89, 0.8)',
          'Rejected': 'rgba(192, 80, 77, 0.8)',
        };
        
        let startAngle = 0;
        
        data.forEach(item => {
          const sliceAngle = (item.count / total) * 2 * Math.PI;
          const endAngle = startAngle + sliceAngle;
          
          // Draw slice
          ctx.beginPath();
          ctx.fillStyle = colors[item.status as keyof typeof colors];
          ctx.moveTo(centerX, centerY);
          ctx.arc(centerX, centerY, radius, startAngle, endAngle);
          ctx.closePath();
          ctx.fill();
          
          // Draw label
          const labelAngle = startAngle + sliceAngle / 2;
          const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
          const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
          
          ctx.fillStyle = 'white';
          ctx.font = 'bold 12px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${item.status}: ${item.count}`, labelX, labelY);
          
          startAngle = endAngle;
        });
      }
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-cinzel text-[#D4AF37] mb-8 text-center">Analytics Dashboard</h1>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {analyticsData.keyMetrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-white/5 backdrop-blur-sm border border-[#D4AF37]/20">
              <div className="p-6 text-center">
                <h3 className="text-white/70 mb-2">{metric.label}</h3>
                <p className="text-3xl font-cinzel text-[#D4AF37]">{metric.value}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/5 backdrop-blur-sm border border-[#D4AF37]/20">
            <div className="p-6">
              <h2 className="text-xl font-cinzel text-[#D4AF37] mb-4">Tenders by Category</h2>
              <div className="w-full h-64">
                <canvas ref={categoryChartRef} width="400" height="250"></canvas>
              </div>
            </div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white/5 backdrop-blur-sm border border-[#D4AF37]/20">
            <div className="p-6">
              <h2 className="text-xl font-cinzel text-[#D4AF37] mb-4">Tender Value by Month</h2>
              <div className="w-full h-64">
                <canvas ref={valueChartRef} width="400" height="250"></canvas>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
      
      {/* Third Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-1"
        >
          <Card className="bg-white/5 backdrop-blur-sm border border-[#D4AF37]/20 h-full">
            <div className="p-6">
              <h2 className="text-xl font-cinzel text-[#D4AF37] mb-4">Bid Status Distribution</h2>
              <div className="w-full h-56">
                <canvas ref={statusChartRef} width="200" height="200"></canvas>
              </div>
            </div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="bg-white/5 backdrop-blur-sm border border-[#D4AF37]/20 h-full">
            <div className="p-6">
              <h2 className="text-xl font-cinzel text-[#D4AF37] mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {analyticsData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start border-b border-white/10 pb-3">
                    <div className={`w-2 h-2 mt-2 rounded-full mr-3 ${
                      activity.type === 'Bid' ? 'bg-blue-400' : 'bg-[#D4AF37]'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-white/80">{activity.description}</p>
                      <p className="text-white/40 text-sm">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 