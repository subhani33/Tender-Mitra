import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui';

interface Resource {
  id: number;
  title: string;
  description: string;
  type: 'video' | 'article' | 'course' | 'webinar';
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  author: string;
  thumbnail: string;
  link?: string;
  comingSoon?: boolean;
}

const LearningHub: React.FC = () => {
  const [filterType, setFilterType] = useState<string>('');
  const [filterLevel, setFilterLevel] = useState<string>('');
  
  // Mock learning resources
  const resources: Resource[] = [
    {
      id: 1,
      title: 'Bid Writing 101',
      description: 'Learn the fundamentals of writing compelling bid proposals that win contracts.',
      type: 'course',
      level: 'beginner',
      duration: '3 hours',
      author: 'Tender Academy',
      thumbnail: 'https://placehold.co/600x400/1A2A44/D4AF37?text=Bid+Writing+101',
      link: '#'
    },
    {
      id: 2,
      title: 'Understanding Tender Evaluation',
      description: 'Discover how government bodies evaluate tenders and what they look for in winning bids.',
      type: 'video',
      level: 'intermediate',
      duration: '45 minutes',
      author: 'Government Procurement Experts',
      thumbnail: 'https://placehold.co/600x400/1A2A44/D4AF37?text=Tender+Evaluation'
    },
    {
      id: 3,
      title: 'Financial Aspects of Bid Preparation',
      description: 'Master the financial calculations and pricing strategies for competitive bids.',
      type: 'webinar',
      level: 'advanced',
      duration: '1.5 hours',
      author: 'Finance Professionals Association',
      thumbnail: 'https://placehold.co/600x400/1A2A44/D4AF37?text=Financial+Aspects',
      comingSoon: true
    },
    {
      id: 4,
      title: 'Legal Compliance in Government Tenders',
      description: 'Navigate the complex legal requirements for government tender submissions.',
      type: 'article',
      level: 'intermediate',
      duration: '20 minutes read',
      author: 'Legal Affairs Institute',
      thumbnail: 'https://placehold.co/600x400/1A2A44/D4AF37?text=Legal+Compliance',
      link: '#'
    },
    {
      id: 5,
      title: 'Building Strong Technical Proposals',
      description: 'Learn how to create technical proposals that demonstrate capability and innovation.',
      type: 'course',
      level: 'intermediate',
      duration: '4 hours',
      author: 'Engineering Excellence Center',
      thumbnail: 'https://placehold.co/600x400/1A2A44/D4AF37?text=Technical+Proposals',
      link: '#'
    },
    {
      id: 6,
      title: 'Navigating International Tenders',
      description: 'Expand your business by learning how to successfully bid for international projects.',
      type: 'webinar',
      level: 'advanced',
      duration: '2 hours',
      author: 'Global Tender Experts',
      thumbnail: 'https://placehold.co/600x400/1A2A44/D4AF37?text=International+Tenders',
      comingSoon: true
    }
  ];
  
  // Filter resources based on selected filters
  const filteredResources = resources.filter(resource => {
    const matchesType = filterType ? resource.type === filterType : true;
    const matchesLevel = filterLevel ? resource.level === filterLevel : true;
    return matchesType && matchesLevel;
  });
  
  // Function to get type badge color
  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-blue-900/30 text-blue-400';
      case 'article':
        return 'bg-green-900/30 text-green-400';
      case 'course':
        return 'bg-purple-900/30 text-purple-400';
      case 'webinar':
        return 'bg-orange-900/30 text-orange-400';
      default:
        return 'bg-gray-900/30 text-gray-400';
    }
  };
  
  // Function to get level badge color
  const getLevelBadgeClass = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-900/30 text-green-400';
      case 'intermediate':
        return 'bg-yellow-900/30 text-yellow-400';
      case 'advanced':
        return 'bg-red-900/30 text-red-400';
      default:
        return 'bg-gray-900/30 text-gray-400';
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-cinzel text-[#D4AF37] mb-8 text-center">Learning Hub</h1>
      
      {/* Filters */}
      <div className="max-w-4xl mx-auto mb-8 bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-[#D4AF37]/20">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-[#D4AF37] mb-2 font-medium">Resource Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-[#1A2A44] border border-[#D4AF37]/30 rounded p-2 text-white focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="">All Types</option>
              <option value="video">Video</option>
              <option value="article">Article</option>
              <option value="course">Course</option>
              <option value="webinar">Webinar</option>
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-[#D4AF37] mb-2 font-medium">Experience Level</label>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="w-full bg-[#1A2A44] border border-[#D4AF37]/30 rounded p-2 text-white focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {filteredResources.length > 0 ? (
          filteredResources.map((resource) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-white/5 backdrop-blur-sm border border-[#D4AF37]/20 h-full overflow-hidden">
                <div className="relative">
                  {/* Thumbnail */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={resource.thumbnail}
                      alt={resource.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Coming soon overlay */}
                    {resource.comingSoon && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <span className="font-cinzel text-[#D4AF37] text-xl">Coming Soon</span>
                      </div>
                    )}
                    
                    {/* Type badge */}
                    <span className={`absolute top-3 left-3 text-xs px-2 py-1 rounded-full ${getTypeBadgeClass(resource.type)}`}>
                      {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                    </span>
                    
                    {/* Level badge */}
                    <span className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full ${getLevelBadgeClass(resource.level)}`}>
                      {resource.level.charAt(0).toUpperCase() + resource.level.slice(1)}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-cinzel text-[#D4AF37] mb-2">{resource.title}</h3>
                    <p className="text-white/70 mb-4">{resource.description}</p>
                    
                    <div className="flex justify-between items-center text-white/60 text-sm mb-4">
                      <span>{resource.author}</span>
                      <span>{resource.duration}</span>
                    </div>
                    
                    {resource.comingSoon ? (
                      <button
                        disabled
                        className="w-full px-4 py-2 bg-[#D4AF37]/20 text-[#D4AF37]/50 rounded-md font-medium cursor-not-allowed"
                      >
                        Notify Me When Available
                      </button>
                    ) : (
                      <a
                        href={resource.link || '#'}
                        className="block w-full text-center px-4 py-2 bg-[#D4AF37] hover:bg-[#D4AF37]/80 text-[#1A2A44] rounded-md font-medium transition-colors"
                      >
                        Access Resource
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-white/60">No resources found matching your criteria.</p>
            <button
              onClick={() => { setFilterType(''); setFilterLevel(''); }}
              className="mt-4 px-4 py-2 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] rounded-md transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
      
      {/* Newsletter Signup */}
      <div className="max-w-2xl mx-auto mt-16 bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-[#D4AF37]/20">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-cinzel text-[#D4AF37] mb-2">Stay Updated</h2>
          <p className="text-white/70">Subscribe to receive updates on new learning resources and tender opportunities.</p>
        </div>
        
        <form className="flex flex-col md:flex-row gap-4">
          <input
            type="email"
            placeholder="Your email address"
            className="flex-1 bg-[#1A2A44] border border-[#D4AF37]/30 rounded p-2 text-white focus:outline-none focus:border-[#D4AF37]"
          />
          <button
            type="button"
            className="px-6 py-2 bg-[#D4AF37] hover:bg-[#D4AF37]/80 text-[#1A2A44] rounded-md font-medium transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
};

export default LearningHub;