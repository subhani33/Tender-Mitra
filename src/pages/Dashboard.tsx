import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TenderDashboard from '../components/dashboard/TenderDashboard';
import BidManagement from '../components/bids/BidManagement';
import AnalyticsDashboard from '../components/analytics/AnalyticsDashboard';
import KnowledgeBase from '../components/knowledge/KnowledgeBase';
import TaskManagement from '../components/tasks/TaskManagement';
import LearningHub from '../components/learning/LearningHub';
import { ChartBar, FileText, BriefcaseBusiness, Book, CheckSquare, GraduationCap } from 'lucide-react';

type DashboardTab = 'tenders' | 'bids' | 'analytics' | 'knowledge' | 'tasks' | 'learning';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('tenders');
  
  const tabs = [
    { id: 'tenders', label: 'Tenders', icon: <FileText size={20} /> },
    { id: 'bids', label: 'Bids', icon: <BriefcaseBusiness size={20} /> },
    { id: 'analytics', label: 'Analytics', icon: <ChartBar size={20} /> },
    { id: 'knowledge', label: 'Knowledge Base', icon: <Book size={20} /> },
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare size={20} /> },
    { id: 'learning', label: 'Learning Hub', icon: <GraduationCap size={20} /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-white/70 mt-1">Manage your tenders, bids, and more</p>
      </div>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-800">
        <nav className="flex flex-wrap -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as DashboardTab)}
              className={`inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap mx-4 first:ml-0 ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-white/70 hover:text-white hover:border-gray-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="pt-4">
        {activeTab === 'tenders' && <TenderDashboard />}
        {activeTab === 'bids' && <BidManagement />}
        {activeTab === 'analytics' && <AnalyticsDashboard />}
        {activeTab === 'knowledge' && <KnowledgeBase />}
        {activeTab === 'tasks' && <TaskManagement />}
        {activeTab === 'learning' && <LearningHub />}
      </div>
    </motion.div>
  );
};

export default Dashboard;
