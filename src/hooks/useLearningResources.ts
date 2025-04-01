import { useState, useEffect, useCallback } from 'react';
import { Book, Video, Award, FileText, Code, Download } from 'lucide-react';

// Define types
export interface Resource {
  id: number;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  duration: number; // in minutes
  imageUrl: string;
  progress: number; // percentage
  isComplete: boolean;
  lessons: {
    id: number;
    title: string;
    isComplete: boolean;
  }[];
}

export interface LearningStats {
  resourcesCompleted: number;
  totalResources: number;
  hoursSpent: number;
  learningStreak: number; // consecutive days
  certificates: number;
}

export interface LearningPath {
  id: number;
  title: string;
  description: string;
  resources: number[]; // resource IDs
  progress: number; // percentage
}

// Mock data for learning resources
const mockResources: Resource[] = [
  {
    id: 1,
    title: 'Introduction to Government Tenders',
    description: 'Learn the basics of government procurement and tender participation',
    level: 'beginner',
    category: 'Fundamentals',
    duration: 60,
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    progress: 100,
    isComplete: true,
    lessons: [
      { id: 101, title: 'Understanding the Tender Lifecycle', isComplete: true },
      { id: 102, title: 'Types of Public Procurement', isComplete: true },
      { id: 103, title: 'Key Terminology in Tenders', isComplete: true }
    ]
  },
  {
    id: 2,
    title: 'Bid Document Preparation',
    description: 'Master the art of preparing winning bid proposals and documentation',
    level: 'intermediate',
    category: 'Documentation',
    duration: 120,
    imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    progress: 60,
    isComplete: false,
    lessons: [
      { id: 201, title: 'Crafting Executive Summaries', isComplete: true },
      { id: 202, title: 'Technical Proposal Writing', isComplete: true },
      { id: 203, title: 'Financial Bid Strategies', isComplete: false },
      { id: 204, title: 'Compliance Checklists', isComplete: false }
    ]
  },
  {
    id: 3,
    title: 'Financial Planning for Tenders',
    description: 'Strategic pricing and financial considerations for competitive bids',
    level: 'advanced',
    category: 'Financial',
    duration: 90,
    imageUrl: 'https://images.unsplash.com/photo-1554224154-22dec7ec8818?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    progress: 30,
    isComplete: false,
    lessons: [
      { id: 301, title: 'Cost Estimation Techniques', isComplete: true },
      { id: 302, title: 'Pricing Strategies for Tenders', isComplete: false },
      { id: 303, title: 'Financial Risk Assessment', isComplete: false }
    ]
  },
  {
    id: 4,
    title: 'Legal Aspects of Procurement',
    description: 'Navigate the legal requirements and compliance issues in tender submission',
    level: 'intermediate',
    category: 'Legal',
    duration: 75,
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    progress: 0,
    isComplete: false,
    lessons: [
      { id: 401, title: 'Procurement Legislation Overview', isComplete: false },
      { id: 402, title: 'Contract Terms and Conditions', isComplete: false },
      { id: 403, title: 'Dispute Resolution Mechanisms', isComplete: false }
    ]
  },
  {
    id: 5,
    title: 'Advanced Bid Strategy',
    description: 'Strategic approaches to win high-value and complex tenders',
    level: 'advanced',
    category: 'Strategy',
    duration: 150,
    imageUrl: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    progress: 10,
    isComplete: false,
    lessons: [
      { id: 501, title: 'Competitive Analysis', isComplete: true },
      { id: 502, title: 'Consortium Building', isComplete: false },
      { id: 503, title: 'Risk Mitigation Strategies', isComplete: false },
      { id: 504, title: 'Innovation in Tender Responses', isComplete: false }
    ]
  }
];

// Mock learning paths
const mockLearningPaths: LearningPath[] = [
  {
    id: 1,
    title: 'Tender Essentials',
    description: 'Master the fundamental skills needed for successful tender participation',
    resources: [1, 2, 4],
    progress: 50
  },
  {
    id: 2,
    title: 'Advanced Procurement Specialist',
    description: 'Specialized track for experienced professionals seeking to enhance their strategic bid capabilities',
    resources: [3, 5, 2],
    progress: 25
  }
];

// Mock learning stats
const mockStats: LearningStats = {
  resourcesCompleted: 1,
  totalResources: 5,
  hoursSpent: 12,
  learningStreak: 5,
  certificates: 1
};

export function useLearningResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [stats, setStats] = useState<LearningStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all resources
  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/learning/resources');
      // const data = await response.json();
      
      // Using mock data instead
      setTimeout(() => {
        setResources(mockResources);
        setLearningPaths(mockLearningPaths);
        setStats(mockStats);
        setLoading(false);
      }, 800);
    } catch (err) {
      setError('Failed to fetch learning resources');
      setLoading(false);
    }
  }, []);

  // Initialize data on component mount
  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  // Update resource progress
  const updateProgress = useCallback(async (resourceId: number, progress: number) => {
    try {
      // In a real app, this would be an API call
      // await fetch(`/api/learning/resources/${resourceId}/progress`, {
      //   method: 'PUT',
      //   body: JSON.stringify({ progress }),
      //   headers: { 'Content-Type': 'application/json' }
      // });
      
      // Update local state
      setResources(prevResources => 
        prevResources.map(resource => 
          resource.id === resourceId 
            ? { 
                ...resource, 
                progress, 
                isComplete: progress === 100 
              } 
            : resource
        )
      );
      
      // Update stats if resource is completed
      if (progress === 100) {
        setStats(prevStats => {
          if (!prevStats) return prevStats;
          return {
            ...prevStats,
            resourcesCompleted: prevStats.resourcesCompleted + 1
          };
        });
      }
    } catch (err) {
      setError('Failed to update progress');
    }
  }, []);

  // Complete a lesson
  const completeLesson = useCallback(async (resourceId: number, lessonId: number) => {
    try {
      // In a real app, this would be an API call
      // await fetch(`/api/learning/resources/${resourceId}/lessons/${lessonId}`, {
      //   method: 'PUT',
      //   body: JSON.stringify({ isComplete: true }),
      //   headers: { 'Content-Type': 'application/json' }
      // });
      
      // Update local state
      setResources(prevResources => 
        prevResources.map(resource => {
          if (resource.id !== resourceId) return resource;
          
          // Mark the lesson as complete
          const updatedLessons = resource.lessons.map(lesson => 
            lesson.id === lessonId ? { ...lesson, isComplete: true } : lesson
          );
          
          // Calculate new progress
          const completedLessons = updatedLessons.filter(l => l.isComplete).length;
          const totalLessons = updatedLessons.length;
          const newProgress = Math.round((completedLessons / totalLessons) * 100);
          
          return {
            ...resource,
            lessons: updatedLessons,
            progress: newProgress,
            isComplete: newProgress === 100
          };
        })
      );
    } catch (err) {
      setError('Failed to complete lesson');
    }
  }, []);

  // Filter resources by search query
  const filteredResources = resources.filter(resource => 
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    resources: filteredResources,
    learningPaths,
    stats,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    updateProgress,
    completeLesson,
    refreshResources: fetchResources
  };
} 