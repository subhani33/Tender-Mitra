import React, { useState } from 'react';
import LearningHub from '../components/learning/LearningHub';
import ResourceDetails from '../components/learning/ResourceDetails';
import { useLearningResources } from '../hooks/useLearningResources';
import { Spinner } from '../components/ui/Spinner';

const Learning: React.FC = () => {
  const {
    resources,
    loading,
    error,
    updateProgress,
    completeLesson
  } = useLearningResources();
  
  const [selectedResourceId, setSelectedResourceId] = useState<number | null>(null);
  
  const selectedResource = selectedResourceId 
    ? resources.find(r => r.id === selectedResourceId) 
    : null;
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6 text-red-500 bg-red-50 rounded-lg m-8">
        <h3 className="text-lg font-semibold mb-2">Error Loading Learning Resources</h3>
        <p>{error}</p>
      </div>
    );
  }
  
  const handleResourceSelect = (resourceId: number) => {
    setSelectedResourceId(resourceId);
    // You could track that the user viewed this resource
    console.log(`Viewing resource ${resourceId}`);
  };
  
  const handleBackToHub = () => {
    setSelectedResourceId(null);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {selectedResource ? (
        <ResourceDetails 
          resource={selectedResource}
          onBack={handleBackToHub}
          onCompleteLesson={completeLesson}
        />
      ) : (
        <LearningHubWithResourceSelection 
          onSelectResource={handleResourceSelect}
        />
      )}
    </div>
  );
};

// Extends the LearningHub with resource selection functionality
interface LearningHubWithSelectionProps {
  onSelectResource: (resourceId: number) => void;
}

const LearningHubWithResourceSelection: React.FC<LearningHubWithSelectionProps> = ({ 
  onSelectResource 
}) => {
  // Wrapping the LearningHub to add click handlers
  return (
    <div className="learning-hub-wrapper" onClick={(e) => {
      // Find the closest resource card by data attribute
      const target = e.target as HTMLElement;
      const resourceCard = target.closest('[data-resource-id]');
      
      if (resourceCard) {
        const resourceId = parseInt(resourceCard.getAttribute('data-resource-id') || '0', 10);
        if (resourceId) {
          onSelectResource(resourceId);
        }
      }
    }}>
      {/* 
        This is a simple implementation. In a real app, you would modify 
        the ResourceCard component in LearningHub to accept an onClick prop 
        instead of using this event delegation approach.
      */}
      <LearningHub />
    </div>
  );
};

export default Learning; 