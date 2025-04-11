import React from 'react';
import { motion } from 'framer-motion';
import { Info, CheckCircle, Star, Clock, Filter, Search, AlertTriangle, Zap } from 'lucide-react';

const TaskManagerGuide: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-secondary/80 backdrop-blur-sm border border-primary/20 rounded-xl p-6 shadow-lg h-full"
    >
      <h2 className="text-2xl font-cinzel text-primary mb-6 flex items-center">
        <Info className="w-6 h-6 mr-2" />
        Task Manager Guide
      </h2>

      {/* Why Use Section */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-primary/90 mb-3 flex items-center">
          <Star className="w-5 h-5 mr-2" /> 
          Why Use Task Manager
        </h3>
        <ul className="space-y-2 text-white/80">
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Track tender-related tasks efficiently</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Never miss important submission deadlines</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Improve workflow organization across team members</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Maintain visibility of priorities and progress</span>
          </li>
        </ul>
      </section>

      {/* What It Offers Section */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-primary/90 mb-3 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" /> 
          What It Offers
        </h3>
        <ul className="space-y-2 text-white/80">
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Simple task creation with priority settings</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Status tracking (pending, in-progress, completed)</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Category-based organization for different tender types</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Due date tracking with visual alerts</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Advanced search and filtering capabilities</span>
          </li>
        </ul>
      </section>

      {/* How To Use Section */}
      <section>
        <h3 className="text-lg font-semibold text-primary/90 mb-3 flex items-center">
          <Zap className="w-5 h-5 mr-2" /> 
          How To Use
        </h3>
        <div className="space-y-4 text-white/80">
          <div className="border-l-2 border-primary/30 pl-4">
            <h4 className="text-white font-medium flex items-center">
              <span className="bg-primary/20 text-primary rounded-full w-5 h-5 inline-flex items-center justify-center mr-2 text-xs">1</span> 
              Adding Tasks
            </h4>
            <p className="text-sm mt-1">
              Enter task details in the input field and click the plus icon. Use the dropdown to set priority levels and due dates.
            </p>
          </div>
          
          <div className="border-l-2 border-primary/30 pl-4">
            <h4 className="text-white font-medium flex items-center">
              <span className="bg-primary/20 text-primary rounded-full w-5 h-5 inline-flex items-center justify-center mr-2 text-xs">2</span> 
              Setting Priorities
            </h4>
            <p className="text-sm mt-1 flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-blue-400 mr-1"></span> Low
              <span className="inline-block w-3 h-3 rounded-full bg-yellow-400 mx-1 ml-2"></span> Medium
              <span className="inline-block w-3 h-3 rounded-full bg-red-400 mx-1 ml-2"></span> High
            </p>
          </div>
          
          <div className="border-l-2 border-primary/30 pl-4">
            <h4 className="text-white font-medium flex items-center">
              <span className="bg-primary/20 text-primary rounded-full w-5 h-5 inline-flex items-center justify-center mr-2 text-xs">3</span> 
              Tracking Progress
            </h4>
            <p className="text-sm mt-1">
              Click on the circle to mark a task as complete. The task will be visually indicated as finished.
            </p>
          </div>
          
          <div className="border-l-2 border-primary/30 pl-4">
            <h4 className="text-white font-medium flex items-center">
              <span className="bg-primary/20 text-primary rounded-full w-5 h-5 inline-flex items-center justify-center mr-2 text-xs">4</span>
              <Search className="w-4 h-4 mr-1" /> 
              Searching
            </h4>
            <p className="text-sm mt-1">
              Use the search bar to quickly find specific tasks by keywords.
            </p>
          </div>
          
          <div className="border-l-2 border-primary/30 pl-4">
            <h4 className="text-white font-medium flex items-center">
              <span className="bg-primary/20 text-primary rounded-full w-5 h-5 inline-flex items-center justify-center mr-2 text-xs">5</span>
              <Filter className="w-4 h-4 mr-1" /> 
              Filtering
            </h4>
            <p className="text-sm mt-1">
              Filter tasks by category, priority, or completion status using the filter buttons.
            </p>
          </div>
        </div>
      </section>
      
      {/* Important Note */}
      <div className="mt-8 bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start">
        <AlertTriangle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-red-200">
          <span className="font-medium">Important:</span> Tasks are saved locally in your browser. Clearing browser data will remove your task list.
        </p>
      </div>
    </motion.div>
  );
};

export default TaskManagerGuide; 