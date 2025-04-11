import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui';
import { Lightbulb, CheckCircle2, Clock, Calendar, Link2, BarChart3, Users, AlertTriangle } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  related?: {
    type: 'tender' | 'bid';
    id: number;
    title: string;
  };
}

interface TaskManagementProps {
  onNotify?: (message: string) => void;
}

const TaskManagement: React.FC<TaskManagementProps> = ({ onNotify }) => {
  // State for tasks and form
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [taskRelatedType, setTaskRelatedType] = useState<'tender' | 'bid' | ''>('');
  const [taskRelatedId, setTaskRelatedId] = useState<string>('');
  const [taskRelatedTitle, setTaskRelatedTitle] = useState<string>('');
  
  // Mock data for related items
  const mockTenders = [
    { id: 1, title: 'Road Construction Project' },
    { id: 2, title: 'Hospital Equipment Supply' },
    { id: 3, title: 'Education Software Development' }
  ];
  
  const mockBids = [
    { id: 1, title: 'Bid for Road Construction Project' },
    { id: 2, title: 'Bid for Hospital Equipment Supply' }
  ];
  
  // Mock initial tasks
  const initialTasks: Task[] = [
    {
      id: 1,
      title: 'Submit bid for Road Construction Project',
      description: 'Complete the financial proposal and technical documentation for road construction bid.',
      dueDate: '2024-04-25',
      priority: 'high',
      status: 'todo',
      related: {
        type: 'tender',
        id: 1,
        title: 'Road Construction Project'
      }
    },
    {
      id: 2,
      title: 'Review Hospital Equipment Supply specifications',
      description: 'Go through the detailed specifications and prepare clarification questions if needed.',
      dueDate: '2024-04-15',
      priority: 'medium',
      status: 'in-progress',
      related: {
        type: 'tender',
        id: 2,
        title: 'Hospital Equipment Supply'
      }
    },
    {
      id: 3,
      title: 'Update company profile in tender portal',
      description: 'Add recent projects and update certifications on the tender portal profile.',
      dueDate: '2024-04-10',
      priority: 'low',
      status: 'completed'
    }
  ];
  
  // Initialize tasks from localStorage or use mock data
  useEffect(() => {
    const savedTasks = localStorage.getItem('tenderOpulenceTasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        setTasks(parsedTasks);
      } catch (error) {
        console.error('Error parsing saved tasks', error);
        setTasks(initialTasks);
      }
    } else {
      setTasks(initialTasks);
    }
  }, []);
  
  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('tenderOpulenceTasks', JSON.stringify(tasks));
    }
  }, [tasks]);
  
  // Filter tasks based on status and priority
  useEffect(() => {
    let filtered = [...tasks];
    
    if (statusFilter) {
      filtered = filtered.filter(task => task.status === statusFilter);
    }
    
    if (priorityFilter) {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }
    
    setFilteredTasks(filtered);
  }, [tasks, statusFilter, priorityFilter]);
  
  // Handle task creation
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!taskTitle.trim()) {
      if (onNotify) onNotify('Task title is required');
      return;
    }
    
    const newTask: Task = {
      id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
      title: taskTitle,
      description: taskDescription || undefined,
      dueDate: taskDueDate || undefined,
      priority: taskPriority,
      status: 'todo'
    };
    
    // Add related item if selected
    if (taskRelatedType && taskRelatedId) {
      newTask.related = {
        type: taskRelatedType as 'tender' | 'bid',
        id: parseInt(taskRelatedId),
        title: taskRelatedTitle
      };
    }
    
    setTasks([...tasks, newTask]);
    
    // Reset form
    setTaskTitle('');
    setTaskDescription('');
    setTaskDueDate('');
    setTaskPriority('medium');
    setTaskRelatedType('');
    setTaskRelatedId('');
    setTaskRelatedTitle('');
    setShowForm(false);
    
    if (onNotify) onNotify('Task created successfully!');
  };
  
  // Handle task status update
  const handleStatusChange = (taskId: number, newStatus: 'todo' | 'in-progress' | 'completed') => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    
    setTasks(updatedTasks);
    
    if (onNotify) {
      const statusMessages = {
        'todo': 'Task moved to To Do',
        'in-progress': 'Task moved to In Progress',
        'completed': 'Task marked as Complete'
      };
      onNotify(statusMessages[newStatus]);
    }
  };
  
  // Handle task deletion
  const handleDeleteTask = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    setTasks(tasks.filter(task => task.id !== taskId));
    
    if (onNotify) onNotify(`Task "${task?.title}" deleted`);
  };
  
  // Handle related item selection
  const handleRelatedItemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setTaskRelatedId(id);
    
    if (id && taskRelatedType) {
      const items = taskRelatedType === 'tender' ? mockTenders : mockBids;
      const selectedItem = items.find(item => item.id === parseInt(id));
      if (selectedItem) {
        setTaskRelatedTitle(selectedItem.title);
      }
    } else {
      setTaskRelatedTitle('');
    }
  };
  
  // Get priority class for styling
  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-900/30 text-red-400';
      case 'medium':
        return 'bg-yellow-900/30 text-yellow-400';
      case 'low':
        return 'bg-green-900/30 text-green-400';
      default:
        return 'bg-blue-900/30 text-blue-400';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-cinzel text-[#D4AF37] mb-8 text-center">Task Management</h1>
      
      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
        {/* Task Manager Guide - Left Side Panel */}
        <div className="lg:w-1/3">
          <div className="bg-blue-900/30 backdrop-blur-sm rounded-lg border border-[#D4AF37]/20 p-6 sticky top-24">
            <h2 className="text-xl font-cinzel text-[#D4AF37] mb-4 flex items-center">
              <Lightbulb className="w-5 h-5 mr-2" />
              Task Manager Guide
            </h2>
            
            <div className="space-y-6 text-gray-300">
              <div>
                <h3 className="font-medium text-white mb-2 flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] mr-2" />
                  Why Use the Task Manager?
                </h3>
                <p className="text-sm mb-2">
                  The Task Manager helps you organize your tender-related activities systematically and ensures nothing falls through the cracks during the critical tender process.
                </p>
                <ul className="text-sm list-disc pl-5 space-y-1 text-gray-400">
                  <li>Never miss tender submission deadlines</li>
                  <li>Track progress of all tender-related activities</li>
                  <li>Prioritize tasks based on urgency and importance</li>
                  <li>Delegate responsibilities to team members</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-white mb-2 flex items-center">
                  <BarChart3 className="w-4 h-4 text-[#D4AF37] mr-2" />
                  Key Features
                </h3>
                <ul className="text-sm list-disc pl-5 space-y-1 text-gray-400">
                  <li><span className="text-white">Due Date Tracking:</span> Set and track deadlines aligned with tender submission dates</li>
                  <li><span className="text-white">Priority System:</span> Mark tasks as high, medium, or low priority</li>
                  <li><span className="text-white">Tender Linking:</span> Associate tasks with specific tenders or bids</li>
                  <li><span className="text-white">Status Updates:</span> Move tasks through to-do, in-progress, and completed stages</li>
                  <li><span className="text-white">Task Filtering:</span> Focus on what's most important at any given time</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-white mb-2 flex items-center">
                  <Users className="w-4 h-4 text-[#D4AF37] mr-2" />
                  How to Use Effectively
                </h3>
                <ol className="text-sm list-decimal pl-5 space-y-1 text-gray-400">
                  <li>Start by creating tasks for all tender requirements</li>
                  <li>Set realistic due dates with buffer time before actual deadlines</li>
                  <li>Link tasks to specific tenders for better organization</li>
                  <li>Update task status regularly as you progress</li>
                  <li>Filter tasks to focus on current priorities</li>
                </ol>
              </div>
              
              <div className="bg-yellow-900/20 p-3 rounded border border-yellow-700/30">
                <h3 className="font-medium text-white mb-1 flex items-center">
                  <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2" />
                  Pro Tips
                </h3>
                <ul className="text-sm list-disc pl-5 space-y-1 text-gray-300">
                  <li>Create a task template for recurring tender types</li>
                  <li>Schedule 15 minutes daily to update task statuses</li>
                  <li>Set earlier internal deadlines than actual submission dates</li>
                  <li>Use the description field for detailed requirements</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Task Manager Main Content - Right Side */}
        <div className="lg:w-2/3">
          {/* Task Manager Explanation */}
          <div className="mb-8 bg-blue-800/20 backdrop-blur-sm rounded-lg p-6 border border-[#D4AF37]/20">
            <h2 className="text-xl font-cinzel text-[#D4AF37] mb-4">About the Task Manager</h2>
            <p className="text-gray-300 mb-4">
              The Task Manager helps you organize and track tender-related tasks to ensure timely completion and improve productivity. It's designed to streamline workflows for bid preparation, deadline tracking, and team coordination in the tender process.
            </p>
            <p className="text-gray-300">
              Create tasks for different stages of the tender process—from initial document review to bid submission. Set priorities, due dates, and link tasks to specific tenders or bids for better organization. Check off completed tasks to stay on track and ensure nothing is missed in your tender submissions.
            </p>
          </div>
          
          {/* Controls */}
          <div className="mb-8 bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-[#D4AF37]/20">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-1 gap-4">
                <div className="flex-1">
                  <label className="block text-[#D4AF37] mb-2 font-medium">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full bg-[#1A2A44] border border-[#D4AF37]/30 rounded p-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="">All Statuses</option>
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                
                <div className="flex-1">
                  <label className="block text-[#D4AF37] mb-2 font-medium">Priority</label>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="w-full bg-[#1A2A44] border border-[#D4AF37]/30 rounded p-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
              
              <div>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="w-full md:w-auto px-4 py-2 bg-[#D4AF37] hover:bg-[#D4AF37]/80 text-[#1A2A44] rounded-md font-medium transition-colors"
                >
                  {showForm ? 'Cancel' : 'Create Task'}
                </button>
              </div>
            </div>
          </div>
          
          {/* Task Creation Form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="max-w-4xl mx-auto mb-8 overflow-hidden"
              >
                <Card className="bg-white/5 backdrop-blur-sm border border-[#D4AF37]/20">
                  <div className="p-6">
                    <h2 className="text-xl font-cinzel text-[#D4AF37] mb-4">Create New Task</h2>
                    
                    <form onSubmit={handleCreateTask}>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[#D4AF37] mb-2 font-medium">Task Title*</label>
                          <input
                            type="text"
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                            placeholder="Enter task title"
                            required
                            className="w-full bg-[#1A2A44] border border-[#D4AF37]/30 rounded p-2 text-white focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-[#D4AF37] mb-2 font-medium">Description</label>
                          <textarea
                            value={taskDescription}
                            onChange={(e) => setTaskDescription(e.target.value)}
                            placeholder="Describe the task"
                            rows={3}
                            className="w-full bg-[#1A2A44] border border-[#D4AF37]/30 rounded p-2 text-white focus:outline-none focus:border-[#D4AF37]"
                          ></textarea>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[#D4AF37] mb-2 font-medium">Due Date</label>
                            <input
                              type="date"
                              value={taskDueDate}
                              onChange={(e) => setTaskDueDate(e.target.value)}
                              className="w-full bg-[#1A2A44] border border-[#D4AF37]/30 rounded p-2 text-white focus:outline-none focus:border-[#D4AF37]"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-[#D4AF37] mb-2 font-medium">Priority</label>
                            <select
                              value={taskPriority}
                              onChange={(e) => setTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
                              className="w-full bg-[#1A2A44] border border-[#D4AF37]/30 rounded p-2 text-white focus:outline-none focus:border-[#D4AF37]"
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[#D4AF37] mb-2 font-medium">Related To</label>
                            <select
                              value={taskRelatedType}
                              onChange={(e) => setTaskRelatedType(e.target.value as 'tender' | 'bid' | '')}
                              className="w-full bg-[#1A2A44] border border-[#D4AF37]/30 rounded p-2 text-white focus:outline-none focus:border-[#D4AF37]"
                            >
                              <option value="">None</option>
                              <option value="tender">Tender</option>
                              <option value="bid">Bid</option>
                            </select>
                          </div>
                          
                          {taskRelatedType && (
                            <div>
                              <label className="block text-[#D4AF37] mb-2 font-medium">Select {taskRelatedType === 'tender' ? 'Tender' : 'Bid'}</label>
                              <select
                                value={taskRelatedId}
                                onChange={handleRelatedItemChange}
                                className="w-full bg-[#1A2A44] border border-[#D4AF37]/30 rounded p-2 text-white focus:outline-none focus:border-[#D4AF37]"
                              >
                                <option value="">Select {taskRelatedType === 'tender' ? 'a tender' : 'a bid'}</option>
                                {(taskRelatedType === 'tender' ? mockTenders : mockBids).map(item => (
                                  <option key={item.id} value={item.id}>{item.title}</option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-end pt-2">
                          <button
                            type="submit"
                            className="px-6 py-2 bg-[#D4AF37] hover:bg-[#D4AF37]/80 text-[#1A2A44] rounded-md font-medium transition-colors"
                          >
                            Create Task
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Tasks List */}
          <div className="max-w-5xl mx-auto">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-10 bg-white/5 backdrop-blur-sm rounded-lg border border-[#D4AF37]/20">
                <p className="text-white/60 mb-4">No tasks found matching your criteria.</p>
                <button
                  onClick={() => { setStatusFilter(''); setPriorityFilter(''); }}
                  className="px-4 py-2 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] rounded-md transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {filteredTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="bg-white/5 backdrop-blur-sm border border-[#D4AF37]/20">
                        <div className="p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={task.status === 'completed'}
                                onChange={(e) => {
                                  handleStatusChange(task.id, e.target.checked ? 'completed' : 'todo');
                                }}
                                className="w-5 h-5 rounded border-[#D4AF37]/30 bg-[#1A2A44] checked:bg-[#D4AF37] focus:ring-0 focus:ring-offset-0"
                              />
                              <h3 className={`ml-3 text-xl font-cinzel text-[#D4AF37] ${task.status === 'completed' ? 'line-through opacity-60' : ''}`}>
                                {task.title}
                              </h3>
                            </div>
                            
                            <div className="flex space-x-2 items-center">
                              <span className={`text-xs px-2 py-1 rounded-full ${getPriorityClass(task.priority)}`}>
                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                              </span>
                              
                              <button
                                onClick={() => handleDeleteTask(task.id)}
                                className="text-red-400 hover:text-red-300 ml-2"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          
                          {task.description && (
                            <p className={`mt-2 text-white/70 ${task.status === 'completed' ? 'line-through opacity-60' : ''}`}>
                              {task.description}
                            </p>
                          )}
                          
                          <div className="mt-4 flex flex-wrap justify-between items-center text-sm">
                            <div className="flex items-center space-x-4">
                              {task.status !== 'completed' && (
                                <select
                                  value={task.status}
                                  onChange={(e) => handleStatusChange(task.id, e.target.value as 'todo' | 'in-progress' | 'completed')}
                                  className="bg-[#1A2A44] border border-[#D4AF37]/30 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                                >
                                  <option value="todo">To Do</option>
                                  <option value="in-progress">In Progress</option>
                                  <option value="completed">Completed</option>
                                </select>
                              )}
                              
                              {task.dueDate && (
                                <span className={`text-white/60 ${new Date(task.dueDate) < new Date() && task.status !== 'completed' ? 'text-red-400' : ''}`}>
                                  Due: {new Date(task.dueDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            
                            {task.related && (
                              <span className="mt-2 md:mt-0 text-white/60">
                                Related to: {task.related.title}
                              </span>
                            )}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManagement; 