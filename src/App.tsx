import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink, useLocation } from 'react-router-dom';
import TenderDashboard from './components/dashboard/TenderDashboard';
import Todo from './components/Todo';
import BidManagement from './components/bids/BidManagement';
import AnalyticsDashboard from './components/analytics/AnalyticsDashboard';
import KnowledgeBase from './components/knowledge/KnowledgeBase';
import TaskManagement from './components/tasks/TaskManagement';
import LearningHub from './components/learning/LearningHub';
import Notification from './components/ui/Notification';
import CityAnimation from './components/animations/CityAnimation';
import GovtLogo from './components/ui/GovtLogo';
import LoginForm from './components/auth/LoginForm';
import { Bell, User, ChevronDown, Menu, X } from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy load route components for better performance
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Tenders = lazy(() => import('./pages/Tenders'));
const TenderDetails = lazy(() => import('./pages/TenderDetails'));
const Contact = lazy(() => import('./pages/Contact'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

// Lazy load components
const TenderStories = lazy(() => import('./components/TenderStories').then(module => ({ default: module.TenderStories })));
const GuidelinesLibrary = lazy(() => import('./components/GuidelinesLibrary').then(module => ({ default: module.GuidelinesLibrary })));
const TenderFAQ = lazy(() => import('./components/TenderFAQ').then(module => ({ default: module.TenderFAQ })));
const GovtWebsites = lazy(() => import('./components/GovtWebsites').then(module => ({ default: module.GovtWebsites })));
const RegulatoryRequirements = lazy(() => import('./components/RegulatoryRequirements').then(module => ({ default: module.RegulatoryRequirements })));

// Simple loading component
const LoadingFallback = () => (
  <div className="w-full h-64 flex items-center justify-center">
    <div className="relative">
      <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-primary animate-spin"></div>
      <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-r-4 border-l-4 border-primary/30"></div>
    </div>
  </div>
);

// Navigation component with luxurious styling
const Navigation = () => {
  const location = useLocation();
  
  const navLinks = [
    { to: '/tenders', label: 'Tenders', icon: 'document' },
    { to: '/bids', label: 'Bids', icon: 'bidding' },
    { to: '/analytics', label: 'Analytics', icon: 'chart' },
    { to: '/knowledge', label: 'Knowledge Base', icon: 'book' },
    { to: '/tasks', label: 'Tasks', icon: 'task' },
    { to: '/learning', label: 'Learning Hub', icon: 'graduation' }
  ];
  
  return (
    <nav className="bg-[#1A2A44]/90 backdrop-blur-sm border-b border-[#D4AF37]/20 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <GovtLogo />
          </Link>
          
          <div className="hidden md:block">
            <ul className="flex space-x-1">
              {navLinks.map(link => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive 
                          ? 'bg-[#D4AF37]/20 text-[#D4AF37]' 
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex items-center">
            <Link 
              to="/login" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/login'
                  ? 'bg-[#D4AF37]/20 text-[#D4AF37]'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Page transition component for smooth page changes 
const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  return (
    <div
      key={location.pathname}
      className="w-full"
    >
      {children}
    </div>
  );
};

function App() {
  console.log('App component rendering');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to handle user login
  const handleLogin = () => {
    setIsAuthenticated(true);
    showNotification("Login successful! Welcome to Tender Mitra.");
  };

  // Function to handle user logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    showNotification("You have been logged out.");
  };

  // Function to handle tender submission
  const handleTenderSubmit = () => {
    showNotification("Tender submitted successfully! Your reference ID: TM-" + Math.floor(Math.random() * 10000));
  };
  
  // Function to handle bid submission
  const handleBidSubmit = () => {
    showNotification("Bid submitted successfully! You will receive updates on your dashboard.");
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 5000);
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/tenders', label: 'Tenders' },
    { path: '/services', label: 'Services' },
    { path: '/about', label: 'About Us' },
    { path: '/contact', label: 'Contact' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/todo', label: 'Task Manager' },
  ];

  useEffect(() => {
    // Simulate initial load time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    // Example notification after page load
    const notifTimer = setTimeout(() => {
      setNotification('Welcome to Tender Mitra - Your comprehensive tender management platform');
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(notifTimer);
    };
  }, []);

  const closeNotification = () => setNotification(null);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-secondary">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-primary border-solid rounded-full border-t-transparent animate-spin"></div>
          <p className="mt-4 text-white text-lg">Loading Tender Mitra Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-secondary flex flex-col">
        {/* Header/Navigation */}
        <header className="bg-secondary shadow-md relative z-20">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Logo area */}
              <div className="flex items-center">
                <GovtLogo className="h-12 w-auto mr-4" />
                <div>
                  <h1 className="text-2xl font-bold text-primary font-cinzel">Tender Mitra</h1>
                  <p className="text-xs text-white/70">EdtoDo Technovations</p>
                </div>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="text-white hover:text-primary transition-colors py-2"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-white p-2"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              {/* User Actions - Desktop */}
              <div className="hidden md:flex items-center space-x-4">
                <button 
                  className="p-2 text-white hover:text-primary transition-colors"
                  onClick={() => showNotification("You have 3 new tender notifications")}
                  aria-label="Notifications"
                >
                  <Bell size={20} />
                </button>
                <button 
                  className="p-2 text-white hover:text-primary transition-colors"
                  onClick={isAuthenticated ? handleLogout : () => {}}
                  aria-label="User account"
                >
                  <User size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-secondary border-t border-gray-700">
              <nav className="container mx-auto px-4 py-3 flex flex-col">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="text-white hover:text-primary py-3 border-b border-gray-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex justify-between py-4">
                  <button 
                    className="p-2 text-white hover:text-primary"
                    onClick={() => {
                      showNotification("You have 3 new tender notifications");
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Bell size={20} />
                  </button>
                  <button 
                    className="p-2 text-white hover:text-primary"
                    onClick={() => {
                      if (isAuthenticated) handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <User size={20} />
                  </button>
                </div>
              </nav>
            </div>
          )}
        </header>

        {/* Hero Animation - Only show on homepage */}
        <Routes>
          <Route
            path="/"
            element={
              <div className="w-full h-[400px] md:h-[500px] relative">
                <CityAnimation className="w-full h-full" quality="medium" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="text-center px-4">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white font-cinzel">
                      Tender Management Platform
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl mx-auto">
                      Simplify your tender management process with comprehensive tools and real-time insights
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <Link
                        to="/tenders"
                        className="bg-primary hover:bg-[#C49620] text-gray-900 font-medium py-3 px-6 rounded-md shadow-gold transition-all duration-300"
                        onClick={() => showNotification("Browsing latest tenders. We have 145+ active tenders.")}
                      >
                        Explore Tenders
                      </Link>
                      <Link
                        to="/services"
                        className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-medium py-3 px-6 rounded-md transition-all duration-300"
                        onClick={() => showNotification("Discover our comprehensive services for tender management.")}
                      >
                        Our Services
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            }
          />
        </Routes>

        {/* Main Content */}
        <main className="flex-grow container mx-auto px-4 py-8">
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={
                    <PageTransition>
                      <div>
                        {/* Main content sections wrapped with individual Suspense */}
                        <Suspense fallback={<LoadingFallback />}>
                          <TenderStories />
                        </Suspense>
                        
                        <Suspense fallback={<LoadingFallback />}>
                          <GuidelinesLibrary />
                        </Suspense>
                        
                        <Suspense fallback={<LoadingFallback />}>
                          <TenderFAQ />
                        </Suspense>
                        
                        <Suspense fallback={<LoadingFallback />}>
                          <GovtWebsites />
                        </Suspense>
                        
                        <Suspense fallback={<LoadingFallback />}>
                          <RegulatoryRequirements />
                        </Suspense>
                      </div>
                    </PageTransition>
                  } />
                  <Route path="/about" element={<About />} />
                  <Route path="/services" element={<Services />} />
                  <Route 
                    path="/tenders" 
                    element={
                      <Tenders 
                        onSubmit={handleTenderSubmit}
                        isAuthenticated={isAuthenticated}
                        onLoginRequired={() => showNotification("Please login to access all tender features")} 
                      />
                    } 
                  />
                  <Route 
                    path="/tenders/:id" 
                    element={
                      <TenderDetails 
                        onBidSubmit={handleBidSubmit}
                        isAuthenticated={isAuthenticated}
                        onLoginRequired={() => showNotification("Please login to submit bids")}
                      />
                    } 
                  />
                  <Route path="/contact" element={<Contact onSubmit={() => showNotification("Thank you for your message. We'll get back to you soon!")} />} />
                  <Route 
                    path="/dashboard" 
                    element={
                      isAuthenticated ? 
                      <Dashboard /> : 
                      <LoginForm onLogin={handleLogin} redirectTo="/dashboard" />
                    } 
                  />
                  <Route path="/todo" element={<Todo />} />
                  <Route path="/login" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <Login />
                    </Suspense>
                  } />
                  <Route path="/register" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <Register />
                    </Suspense>
                  } />
                </Routes>
              </AnimatePresence>
            </Suspense>
          </ErrorBoundary>
        </main>

        {/* Footer */}
        <footer className="bg-secondary border-t border-gray-800 py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold text-primary mb-4 font-cinzel">Tender Mitra</h3>
                <p className="text-white/70 mb-4">
                  A comprehensive platform for managing government tenders, bids, and procurement processes.
                </p>
                <div className="flex space-x-4">
                  {/* Social media links would go here */}
                  <button 
                    className="text-white/70 hover:text-primary transition-colors"
                    onClick={() => showNotification("Visit our social media for latest updates")}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  </button>
                  <button 
                    className="text-white/70 hover:text-primary transition-colors"
                    onClick={() => showNotification("Follow us on Twitter for tender updates")}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                  </button>
                  <button 
                    className="text-white/70 hover:text-primary transition-colors"
                    onClick={() => showNotification("Connect with us on LinkedIn")}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  </button>
                </div>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  {navLinks.map((link) => (
                    <li key={link.path}>
                      <Link to={link.path} className="text-white/70 hover:text-primary transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li>
                    <button 
                      className="text-white/70 hover:text-primary transition-colors"
                      onClick={() => showNotification("Help Center will be available soon")}
                    >
                      Help Center
                    </button>
                  </li>
                  <li>
                    <button 
                      className="text-white/70 hover:text-primary transition-colors"
                      onClick={() => showNotification("FAQ section will be available soon")}
                    >
                      FAQ
                    </button>
                  </li>
                  <li>
                    <button 
                      className="text-white/70 hover:text-primary transition-colors"
                      onClick={() => showNotification("Blog section will be available soon")}
                    >
                      Blog
                    </button>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-4">Contact</h4>
                <address className="not-italic text-white/70 space-y-2">
                  <p>EdtoDo Technovations</p>
                  <p>New Delhi, India</p>
                  <p>
                    <a 
                      href="mailto:info@edtodo.tech" 
                      className="hover:text-primary transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        showNotification("Email link clicked. Your email client would open");
                      }}
                    >
                      Email: info@edtodo.tech
                    </a>
                  </p>
                  <p>
                    <a 
                      href="tel:+911122334455" 
                      className="hover:text-primary transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        showNotification("Phone link clicked. Your phone app would open");
                      }}
                    >
                      Phone: +91 11 2233 4455
                    </a>
                  </p>
                </address>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
              <p className="text-white/50 text-sm">
                &copy; {new Date().getFullYear()} EdtoDo Technovations. All rights reserved.
              </p>
              <div className="mt-4 md:mt-0 space-x-6 text-sm">
                <button 
                  className="text-white/50 hover:text-primary transition-colors"
                  onClick={() => showNotification("Privacy Policy page will be available soon")}
                >
                  Privacy Policy
                </button>
                <button 
                  className="text-white/50 hover:text-primary transition-colors"
                  onClick={() => showNotification("Terms of Service page will be available soon")}
                >
                  Terms of Service
                </button>
              </div>
            </div>
          </div>
        </footer>

        {/* Notifications */}
        {notification && (
          <Notification message={notification} onClose={closeNotification} />
        )}
      </div>
    </Router>
  );
}

export default App;