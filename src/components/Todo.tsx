import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Card, Button, Input, Badge } from './ui';
import { CheckCircle, Circle, Plus, Trash2, Calendar, Clock, Tag, Filter, Search, ArrowUp, ArrowDown, PlusCircle, X, Edit2, ChevronDown, SortAsc, SortDesc, Star, StarOff } from 'lucide-react';
import TaskManagerGuide from './tasks/TaskManagerGuide';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  dueDate?: Date;
  category?: string;
}

const Todo: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        // Parse the JSON and convert date strings back to Date objects
        return JSON.parse(savedTodos, (key, value) => {
          if (key === 'createdAt' || key === 'dueDate') {
            return value ? new Date(value) : undefined;
          }
          return value;
        });
      } catch (error) {
        console.error('Error parsing saved todos:', error);
        return [];
      }
    }
    return [];
  });
  
  const [newTodoText, setNewTodoText] = useState('');
  const [newTodoPriority, setNewTodoPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTodoDueDate, setNewTodoDueDate] = useState<string>('');
  const [newTodoCategory, setNewTodoCategory] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<'low' | 'medium' | 'high' | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'dueDate'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  
  const categories = Array.from(new Set(todos.filter(todo => todo.category).map(todo => todo.category as string)));
  
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);
  
  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim() === '') return;
    
    const newTodo: TodoItem = {
      id: Date.now().toString(),
      text: newTodoText.trim(),
      completed: false,
      priority: newTodoPriority,
      createdAt: new Date(),
      dueDate: newTodoDueDate ? new Date(newTodoDueDate) : undefined,
      category: newTodoCategory.trim() || undefined
    };
    
    setTodos([...todos, newTodo]);
    setNewTodoText('');
    setNewTodoPriority('medium');
    setNewTodoDueDate('');
    setNewTodoCategory('');
    setIsExpanded(false);
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  const toggleTodo = (id: string) => {
    setTodos(
      todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };
  
  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };
  
  const updateTodoPriority = (id: string, priority: 'low' | 'medium' | 'high') => {
    setTodos(
      todos.map(todo => 
        todo.id === id ? { ...todo, priority } : todo
      )
    );
  };
  
  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };
  
  const resetFilters = () => {
    setSearchQuery('');
    setCategoryFilter(null);
    setPriorityFilter(null);
    setSortBy('date');
    setSortDirection('desc');
  };
  
  const filterAndSortTodos = () => {
    let filtered = todos.filter(todo => {
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      
      if (searchQuery && !todo.text.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      if (categoryFilter && todo.category !== categoryFilter) {
        return false;
      }
      
      if (priorityFilter && todo.priority !== priorityFilter) {
        return false;
      }
      
      return true;
    });
    
    return filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return sortDirection === 'asc' 
          ? a.createdAt.getTime() - b.createdAt.getTime()
          : b.createdAt.getTime() - a.createdAt.getTime();
      } 
      else if (sortBy === 'dueDate') {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return sortDirection === 'asc' ? 1 : -1;
        if (!b.dueDate) return sortDirection === 'asc' ? -1 : 1;
        
        return sortDirection === 'asc'
          ? a.dueDate.getTime() - b.dueDate.getTime()
          : b.dueDate.getTime() - a.dueDate.getTime();
      }
      else if (sortBy === 'priority') {
        const priorityValues = { high: 3, medium: 2, low: 1 };
        return sortDirection === 'asc'
          ? priorityValues[a.priority] - priorityValues[b.priority]
          : priorityValues[b.priority] - priorityValues[a.priority];
      }
      return 0;
    });
  };
  
  const filteredTodos = filterAndSortTodos();
  
  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-400/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30';
      case 'high': return 'bg-red-500/20 text-red-400 border-red-400/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-400/30';
    }
  };
  
  const formatDueDate = (date?: Date) => {
    if (!date) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dueDate = new Date(date);
    dueDate.setHours(0, 0, 0, 0);
    
    const timeDiff = dueDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff < 0) {
      return (
        <span className="text-xs text-red-400 font-medium">
          Overdue by {Math.abs(daysDiff)} {Math.abs(daysDiff) === 1 ? 'day' : 'days'}
        </span>
      );
    } else if (daysDiff === 0) {
      return <span className="text-xs text-yellow-400 font-medium">Due today</span>;
    } else if (daysDiff === 1) {
      return <span className="text-xs text-yellow-400 font-medium">Due tomorrow</span>;
    } else if (daysDiff <= 7) {
      return <span className="text-xs text-blue-400 font-medium">Due in {daysDiff} days</span>;
    } else {
      return <span className="text-xs text-gray-400 font-medium">Due on {date.toLocaleDateString()}</span>;
    }
  };
  
  return (
    <div className="w-full flex flex-col lg:flex-row gap-8 p-4">
      {/* Task Manager Guide */}
      <div className="w-full lg:w-1/3 xl:w-1/4 lg:sticky top-4 h-fit">
        <TaskManagerGuide />
      </div>
      
      {/* Task Manager */}
      <div className="w-full lg:w-2/3 xl:w-3/4">
        <div className="max-w-full mx-auto p-6 bg-white/5 backdrop-blur-lg rounded-xl shadow-xl border border-white/10">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">Task Manager</h1>
          
          <form onSubmit={addTodo} className="mb-6">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={newTodoText}
                onChange={e => setNewTodoText(e.target.value)}
                onFocus={() => setIsExpanded(true)}
                placeholder="Add a new task..."
                className="w-full py-3 px-4 bg-black/20 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
              />
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="absolute right-3 top-3 text-white/60 hover:text-white"
              >
                <svg 
                  className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-3 bg-black/20 border border-white/10 rounded-lg p-4 overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-white/60 mb-1 text-sm">Priority</label>
                      <div className="flex space-x-2">
                        {(['low', 'medium', 'high'] as const).map(priority => (
                          <button
                            key={priority}
                            type="button"
                            onClick={() => setNewTodoPriority(priority)}
                            className={`px-3 py-1 rounded-full border text-xs capitalize ${
                              newTodoPriority === priority 
                                ? getPriorityColor(priority) + ' font-medium' 
                                : 'border-white/10 text-white/40 hover:text-white/60'
                            }`}
                          >
                            {priority}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-white/60 mb-1 text-sm">Due Date</label>
                      <input
                        type="date"
                        value={newTodoDueDate}
                        onChange={e => setNewTodoDueDate(e.target.value)}
                        className="w-full py-1 px-3 bg-black/20 border border-white/10 rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-white/60 mb-1 text-sm">Category</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={newTodoCategory}
                          onChange={e => setNewTodoCategory(e.target.value)}
                          placeholder="Enter a category"
                          className="w-full py-1 px-3 bg-black/20 border border-white/10 rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50"
                          list="task-categories"
                        />
                        <datalist id="task-categories">
                          {categories.map(category => (
                            <option key={category} value={category} />
                          ))}
                        </datalist>
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-[#D4AF37] hover:bg-[#D4AF37]/80 text-[#1A2A44] rounded-md font-medium transition-colors"
                  >
                    Add Task
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
          
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search tasks..."
                  className="w-full py-2 pl-9 pr-3 bg-black/20 border border-white/10 rounded-md text-white text-sm placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-md border ${showFilters ? 'bg-[#D4AF37]/20 border-[#D4AF37]/50 text-[#D4AF37]' : 'bg-black/20 border-white/10 text-white/60 hover:text-white'}`}
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>
            
            <AnimatePresence>
              {showFilters && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-3 bg-black/20 border border-white/10 rounded-lg p-4 overflow-hidden"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
                    <div>
                      <label className="block text-white/60 mb-1 text-sm">Category</label>
                      <select
                        value={categoryFilter || ''}
                        onChange={e => setCategoryFilter(e.target.value || null)}
                        className="w-full py-1 px-3 bg-black/20 border border-white/10 rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50"
                      >
                        <option value="">All Categories</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-white/60 mb-1 text-sm">Priority</label>
                      <select
                        value={priorityFilter || ''}
                        onChange={e => setPriorityFilter(e.target.value as any || null)}
                        className="w-full py-1 px-3 bg-black/20 border border-white/10 rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50"
                      >
                        <option value="">All Priorities</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-white/60 mb-1 text-sm">Sort By</label>
                      <div className="flex">
                        <select
                          value={sortBy}
                          onChange={e => setSortBy(e.target.value as any)}
                          className="flex-1 py-1 px-3 bg-black/20 border border-white/10 rounded-l-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50"
                        >
                          <option value="date">Created Date</option>
                          <option value="priority">Priority</option>
                          <option value="dueDate">Due Date</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                          className="px-2 bg-black/20 border border-white/10 rounded-r-md text-white/60 hover:text-white"
                        >
                          {sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="text-white/60 hover:text-white text-xs underline"
                    >
                      Reset Filters
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="flex justify-between mb-6">
            <div className="flex space-x-2">
              {(['all', 'active', 'completed'] as const).map(filterType => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-3 py-1 rounded-md text-sm capitalize ${
                    filter === filterType 
                      ? 'bg-[#D4AF37]/20 text-[#D4AF37] font-medium' 
                      : 'bg-black/20 text-white/60 hover:text-white'
                  }`}
                >
                  {filterType}
                </button>
              ))}
            </div>
            
            {todos.some(todo => todo.completed) && (
              <motion.button
                onClick={clearCompleted}
                className="text-white/60 hover:text-white text-sm underline"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Clear completed
              </motion.button>
            )}
          </div>
          
          {filteredTodos.length > 0 ? (
            <Reorder.Group 
              values={filteredTodos} 
              onReorder={setTodos}
              className="space-y-3"
            >
              <AnimatePresence initial={false}>
                {filteredTodos.map(todo => (
                  <Reorder.Item
                    key={todo.id}
                    value={todo}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`group relative bg-white/5 backdrop-blur-sm border ${
                      todo.completed ? 'border-white/5' : 'border-white/10'
                    } rounded-lg overflow-hidden`}
                    dragListener={false}
                  >
                    <div className={`flex items-center p-3 ${
                      todo.completed ? 'opacity-60' : ''
                    }`}>
                      <div className="pr-2 cursor-grab active:cursor-grabbing touch-none">
                        <svg className="w-5 h-5 text-white/20 group-hover:text-white/40" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M7 2a1 1 0 011 1v1h4V3a1 1 0 112 0v1h1a2 2 0 012 2v1a1 1 0 01-2 0V6H5v9h4a1 1 0 010 2H5a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1zm10 9a1 1 0 01-1 1h-2a1 1 0 010-2h2a1 1 0 011 1zm-6 0a1 1 0 01-1 1H8a1 1 0 010-2h2a1 1 0 011 1zm-6 0a1 1 0 01-1 1H4a1 1 0 010-2h1a1 1 0 011 1z" />
                        </svg>
                      </div>
                      
                      <button 
                        onClick={() => toggleTodo(todo.id)}
                        className="mr-3 flex-shrink-0"
                      >
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          todo.completed 
                            ? 'bg-[#D4AF37] border-[#D4AF37]' 
                            : 'border-white/30 hover:border-white/60'
                        }`}>
                          {todo.completed && (
                            <svg className="w-3 h-3 text-[#1A2A44]" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <p className={`text-white truncate ${
                          todo.completed ? 'line-through text-white/50' : ''
                        }`}>
                          {todo.text}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`inline-block px-2 py-0.5 text-xs rounded-full border ${
                            getPriorityColor(todo.priority)
                          }`}>
                            {todo.priority}
                          </span>
                          
                          {todo.category && (
                            <span className="inline-flex items-center px-2 py-0.5 text-xs bg-purple-500/20 text-purple-400 border border-purple-400/30 rounded-full">
                              <Tag className="w-3 h-3 mr-1" />
                              {todo.category}
                            </span>
                          )}
                          
                          {todo.dueDate && formatDueDate(todo.dueDate)}
                        </div>
                      </div>
                      
                      <div className="relative ml-2 group-hover:opacity-100 opacity-0 transition-opacity">
                        <div className="dropdown dropdown-end">
                          <label tabIndex={0} className="text-white/40 hover:text-white/70 cursor-pointer">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </label>
                          <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-[#1A2A44]/90 backdrop-blur-sm rounded-md w-40">
                            <li className="menu-title text-xs text-white/40 px-2 py-1">Set Priority</li>
                            {(['high', 'medium', 'low'] as const).map(priority => (
                              <li key={priority}>
                                <button 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    updateTodoPriority(todo.id, priority);
                                  }}
                                  className={`text-sm py-1 flex items-center ${
                                    todo.priority === priority ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-white/70'
                                  }`}
                                >
                                  <span className={`w-2 h-2 rounded-full mr-2 ${
                                    priority === 'high' ? 'bg-red-400' : 
                                    priority === 'medium' ? 'bg-yellow-400' : 'bg-blue-400'
                                  }`}></span>
                                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                                </button>
                              </li>
                            ))}
                            <li className="divider my-1 bg-white/10 h-px"></li>
                            <li>
                              <button 
                                onClick={(e) => {
                                  e.preventDefault();
                                  deleteTodo(todo.id);
                                }}
                                className="text-sm py-1 text-red-400 hover:bg-red-400/10"
                              >
                                Delete
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="ml-2 text-white/40 hover:text-white/70 group-hover:opacity-100 opacity-0 transition-opacity"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </Reorder.Item>
                ))}
              </AnimatePresence>
            </Reorder.Group>
          ) : (
            <div className="text-center py-10">
              <svg className="w-16 h-16 text-white/10 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <p className="text-white/40 text-lg">
                {searchQuery || categoryFilter || priorityFilter 
                  ? 'No tasks match your search or filters'
                  : filter === 'all' 
                    ? 'No tasks yet. Add a new task above!' 
                    : filter === 'active' 
                      ? 'No active tasks. Everything is completed!' 
                      : 'No completed tasks yet. Keep going!'}
              </p>
              {(searchQuery || categoryFilter || priorityFilter) && (
                <button 
                  onClick={resetFilters}
                  className="mt-3 text-[#D4AF37] hover:underline text-sm"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
          
          {todos.length > 0 && (
            <div className="mt-6 text-center text-white/40 text-sm">
              <p>
                {filter === 'all' 
                  ? `${todos.filter(t => !t.completed).length} of ${todos.length} tasks remaining` 
                  : filter === 'active' 
                    ? `${filteredTodos.length} active tasks` 
                    : `${filteredTodos.length} completed tasks`}
                {(searchQuery || categoryFilter || priorityFilter) && ' (filtered)'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Todo; 