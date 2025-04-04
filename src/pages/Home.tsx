import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Mock tender data for display
const featuredTenders = [
  {
    id: 'T001',
    title: 'Railway Infrastructure Development',
    department: 'Ministry of Railways',
    deadline: '2025-07-15',
    value: '₹ 120 Crores'
  },
  {
    id: 'T002',
    title: 'Smart City IoT Solution',
    department: 'Urban Development Authority',
    deadline: '2025-08-10',
    value: '₹ 45 Crores'
  },
  {
    id: 'T003',
    title: 'Solar Power Plant Installation',
    department: 'Ministry of New & Renewable Energy',
    deadline: '2025-06-22',
    value: '₹ 75 Crores'
  }
];

const Home = () => {
  // Log component render for debugging
  console.log('Home component rendering');

  return (
    <div className="space-y-12">
      {/* Hero Section with Government Buildings and Tender Theme */}
      <section className="relative rounded-xl overflow-hidden mb-12">
        <div 
          className="w-full h-80 bg-cover bg-center" 
          style={{ 
            backgroundImage: "url('/images/hero/govt-tender-hero.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 to-secondary/30 flex items-center">
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-lg"
              >
                <h1 className="text-4xl font-bold text-white mb-4 font-cinzel">
                  Government Tender Management Platform
                </h1>
                <p className="text-white/80 mb-6">
                  Simplify your journey through the tender process with specialized tools and insights
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link 
                    to="/register" 
                    className="px-6 py-3 bg-primary hover:bg-primary/90 text-gray-900 font-medium rounded-md transition-colors"
                  >
                    Register Now
                  </Link>
                  <Link 
                    to="/tenders" 
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors"
                  >
                    Explore Tenders
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="mb-10">
        <h2 className="text-3xl font-bold text-white mb-4 font-cinzel">Welcome to Tender Mitra</h2>
        <p className="text-white/70 mb-6 max-w-3xl">
          Your comprehensive platform for government tender management and bidding excellence. We provide tools and insights to simplify the tender process from discovery to submission.
        </p>
        <div className="flex flex-wrap gap-4 mt-6">
          <Link to="/services" className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors">
            Explore Our Services
          </Link>
          <Link to="/dashboard" className="px-5 py-2.5 bg-primary hover:bg-primary/80 text-gray-900 font-medium rounded-md transition-colors">
            Go to Dashboard
          </Link>
        </div>
      </section>

      {/* Featured Tenders Section */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary font-cinzel">Featured Tenders</h2>
          <Link to="/tenders" className="text-primary hover:text-primary/80 font-medium">
            View All →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredTenders.map(tender => (
            <div key={tender.id} className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:border-primary/30 transition-all">
              <div className="flex justify-between items-start mb-3">
                <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded">
                  {tender.department}
                </span>
                <span className="text-white/50 text-sm">{tender.id}</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {tender.title}
              </h3>
              <div className="flex justify-between text-sm text-white/70 mb-4">
                <span>Deadline: {tender.deadline}</span>
                <span className="font-medium text-primary">{tender.value}</span>
              </div>
              <Link 
                to={`/tenders/${tender.id}`}
                className="block w-full text-center py-2 border border-primary/50 text-primary hover:bg-primary/10 rounded-md transition-colors mt-4"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-6 font-cinzel">Platform Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 text-center">
            <span className="block text-3xl font-bold text-primary mb-2">5000+</span>
            <span className="text-white/70">Active Tenders</span>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 text-center">
            <span className="block text-3xl font-bold text-primary mb-2">₹1200Cr</span>
            <span className="text-white/70">Tender Value</span>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 text-center">
            <span className="block text-3xl font-bold text-primary mb-2">98%</span>
            <span className="text-white/70">Success Rate</span>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 text-center">
            <span className="block text-3xl font-bold text-primary mb-2">24/7</span>
            <span className="text-white/70">Support</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
