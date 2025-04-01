import React, { useState } from 'react';
import { ArrowLeft, Clock, CheckCircle, BookOpen, Download, Share2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Resource } from '../../hooks/useLearningResources';

interface ResourceDetailsProps {
  resource: Resource;
  onBack: () => void;
  onCompleteLesson: (resourceId: number, lessonId: number) => void;
}

const ResourceDetails: React.FC<ResourceDetailsProps> = ({ 
  resource, 
  onBack, 
  onCompleteLesson 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'lessons'>('overview');
  const [expandedLessonId, setExpandedLessonId] = useState<number | null>(null);

  const completedLessons = resource.lessons.filter(lesson => lesson.isComplete).length;
  const totalLessons = resource.lessons.length;
  
  // Mock content for lessons
  const lessonContent = {
    text: `
      <p class="mb-4">This lesson covers the core concepts and best practices related to this topic. Understanding these fundamentals is essential for success in tender processes.</p>
      
      <h4 class="font-semibold mb-2 mt-6">Key Points:</h4>
      <ul class="list-disc pl-6 space-y-2 mb-6">
        <li>Understanding the regulatory framework and compliance requirements</li>
        <li>Identifying evaluation criteria and scoring methodologies</li>
        <li>Developing effective response strategies tailored to requirements</li>
        <li>Implementing quality assurance processes for submission documents</li>
      </ul>
      
      <blockquote class="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-6">
        "Successful tender responses are built on thorough understanding of requirements and clear demonstration of capability."
      </blockquote>
      
      <p class="mb-4">By following these principles and applying the techniques described in this lesson, you'll be able to significantly improve your tender submission quality and success rate.</p>
    `,
    downloadables: [
      { name: 'Templates Package', size: '2.4 MB', type: 'ZIP' },
      { name: 'Quick Reference Guide', size: '450 KB', type: 'PDF' }
    ],
    videoUrl: 'https://example.com/video-lesson'
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-6 pl-0 flex items-center text-gray-600 hover:text-gray-900"
        onClick={onBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Learning Hub
      </Button>
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={resource.level === 'beginner' ? 'default' : resource.level === 'intermediate' ? 'warning' : 'info'}>
                {resource.level}
              </Badge>
              <span className="text-sm text-gray-500 flex items-center">
                <Clock className="mr-1 h-4 w-4" /> {resource.duration} min
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-2">{resource.title}</h1>
            <p className="text-gray-600">{resource.description}</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex items-center">
              <Share2 className="mr-1 h-4 w-4" /> Share
            </Button>
            <Button variant="primary" size="sm" className="flex items-center">
              <Download className="mr-1 h-4 w-4" /> Download
            </Button>
          </div>
        </div>
        
        {/* Progress */}
        <Card className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div>
              <p className="text-sm text-gray-600 mb-1">Your progress</p>
              <div className="flex items-center">
                <p className="font-semibold mr-2">{resource.progress}% complete</p>
                <span className="text-sm text-gray-500">
                  {completedLessons} of {totalLessons} lessons completed
                </span>
              </div>
            </div>
            <Button variant="outline" className="flex items-center" disabled={resource.isComplete}>
              <BookOpen className="mr-1 h-4 w-4" />
              {resource.isComplete ? "Completed" : "Continue Learning"}
            </Button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${resource.progress}%` }}
            />
          </div>
        </Card>
      </div>
      
      {/* Tabs */}
      <div className="border-b mb-6">
        <div className="flex space-x-8">
          <button
            className={`py-3 font-medium text-sm relative ${
              activeTab === 'overview' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`py-3 font-medium text-sm relative ${
              activeTab === 'lessons' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('lessons')}
          >
            Lessons ({completedLessons}/{totalLessons})
          </button>
        </div>
      </div>
      
      {/* Content */}
      {activeTab === 'overview' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="prose max-w-none">
              <h2>About this resource</h2>
              <p>
                This comprehensive resource provides you with all the knowledge and tools needed to excel in tender preparation, submission, and evaluation. Whether you're new to tendering or looking to enhance your existing skills, this resource offers valuable insights and practical techniques.
              </p>
              
              <h3>What you'll learn</h3>
              <ul>
                <li>Understanding the complete tender lifecycle from announcement to award</li>
                <li>Developing effective strategies for competitive tender responses</li>
                <li>Mastering documentation preparation and compliance requirements</li>
                <li>Implementing quality assurance processes for your submissions</li>
                <li>Tracking and analyzing bid performance for continuous improvement</li>
              </ul>
              
              <h3>Who this is for</h3>
              <p>
                This resource is ideal for bid managers, proposal writers, business development professionals, and anyone involved in government or corporate procurement processes. The content is structured to benefit both beginners and experienced professionals looking to refine their approach.
              </p>
            </div>
          </div>
          
          <div>
            <Card className="p-5 mb-6">
              <h3 className="font-semibold mb-4">Resource includes:</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <BookOpen className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">{totalLessons} lessons</p>
                    <p className="text-sm text-gray-500">Structured learning content</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Clock className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">{resource.duration} minutes</p>
                    <p className="text-sm text-gray-500">Estimated completion time</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Download className="h-5 w-5 text-purple-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Downloadable resources</p>
                    <p className="text-sm text-gray-500">Templates and guides</p>
                  </div>
                </li>
              </ul>
            </Card>
            
            <Card className="p-5">
              <h3 className="font-semibold mb-4">Related resources</h3>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-blue-600 hover:underline font-medium">Financial Bid Strategies</a>
                  <p className="text-sm text-gray-500">Advanced techniques for pricing</p>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:underline font-medium">Legal Compliance for Tenders</a>
                  <p className="text-sm text-gray-500">Regulatory requirements</p>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:underline font-medium">Effective Team Structure</a>
                  <p className="text-sm text-gray-500">Building your tender response team</p>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {resource.lessons.map(lesson => (
            <Card key={lesson.id} className="overflow-hidden">
              <div 
                className="p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedLessonId(expandedLessonId === lesson.id ? null : lesson.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {lesson.isComplete ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    ) : (
                      <div className="h-5 w-5 border rounded-full mr-3"></div>
                    )}
                    <h3 className="font-medium">{lesson.title}</h3>
                  </div>
                  <Button 
                    variant={lesson.isComplete ? "outline" : "primary"} 
                    size="sm"
                    onClick={(e) => {
                      if (e) e.stopPropagation();
                      if (!lesson.isComplete) {
                        onCompleteLesson(resource.id, lesson.id);
                      }
                    }}
                    disabled={lesson.isComplete}
                  >
                    {lesson.isComplete ? "Completed" : "Mark Complete"}
                  </Button>
                </div>
              </div>
              
              {expandedLessonId === lesson.id && (
                <div className="p-4 pt-0 border-t">
                  <div 
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: lessonContent.text }}
                  />
                  
                  {/* Downloadables */}
                  {lessonContent.downloadables.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-medium mb-3">Downloads</h4>
                      <div className="space-y-2">
                        {lessonContent.downloadables.map((item, idx) => (
                          <div key={idx} className="p-3 border rounded-lg flex items-center justify-between">
                            <div className="flex items-center">
                              <Download className="h-4 w-4 text-blue-500 mr-3" />
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-xs text-gray-500">{item.size} • {item.type}</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">Download</Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResourceDetails; 