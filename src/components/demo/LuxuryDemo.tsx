import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// A component that demonstrates the luxury UI elements of the Tender Opulence Hub
const LuxuryDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('buttons');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleTabChange = (tab: string) => {
    setIsLoading(true);
    setActiveTab(tab);
    // Simulate loading delay for luxury feel
    setTimeout(() => setIsLoading(false), 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A2A44] to-[#0D1522] py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="absolute top-6 left-6">
          <Link 
            to="/" 
            className="flex items-center text-[#D4AF37] hover:text-[#E5C158] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span className="font-cinzel">Back to Home</span>
          </Link>
        </div>
        
        <header className="text-center mb-16">
          <motion.h1 
            className="font-cinzel text-5xl text-[#D4AF37] mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Luxury UI Components
          </motion.h1>
          <motion.p 
            className="text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Explore the opulent UI elements powering the Tender Opulence Hub experience
          </motion.p>
        </header>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-[#0D1522]/50 backdrop-blur-sm p-1 rounded-lg">
            {['buttons', 'cards', 'forms', 'animations'].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-6 py-3 rounded-md font-montserrat text-sm transition-all duration-300 ${
                  activeTab === tab 
                    ? 'bg-[#D4AF37] text-[#0D1522] shadow-lg' 
                    : 'text-[#D4AF37] hover:bg-[#D4AF37]/10'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <motion.div
          className="bg-[#0D1522]/30 backdrop-blur-md rounded-xl p-8 border border-[#D4AF37]/20 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {isLoading ? (
            <div className="flex justify-center items-center py-32">
              <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="min-h-[400px]">
              {activeTab === 'buttons' && <ButtonsDemo />}
              {activeTab === 'cards' && <CardsDemo />}
              {activeTab === 'forms' && <FormsDemo />}
              {activeTab === 'animations' && <AnimationsDemo />}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// Button Components Demo
const ButtonsDemo: React.FC = () => {
  return (
    <div className="space-y-8">
      <h2 className="font-cinzel text-2xl text-[#D4AF37] mb-6">Opulent Button Styles</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-gray-300 text-lg mb-3">Primary Actions</h3>
          <div className="space-y-4">
            <button className="w-full bg-[#D4AF37] text-[#0D1522] py-3 px-6 rounded-md font-bold hover:bg-[#E5C158] transition-colors">
              Golden Command
            </button>
            <button className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B7923A] text-[#0D1522] py-3 px-6 rounded-md font-bold hover:from-[#E5C158] hover:to-[#C8A34B] transition-all">
              Gradient Elegance
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-gray-300 text-lg mb-3">Secondary Actions</h3>
          <div className="space-y-4">
            <button className="w-full bg-transparent border-2 border-[#D4AF37] text-[#D4AF37] py-3 px-6 rounded-md font-medium hover:bg-[#D4AF37]/10 transition-colors">
              Outlined Luxury
            </button>
            <button className="w-full bg-white/10 backdrop-blur-sm text-white py-3 px-6 rounded-md font-medium hover:bg-white/20 transition-colors">
              Frosted Crystal
            </button>
          </div>
        </div>
      </div>
      
      <div className="pt-6">
        <h3 className="text-gray-300 text-lg mb-4">Interaction States</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-[#D4AF37]/80 text-[#0D1522] py-2 px-4 rounded-md font-medium">
            Default
          </button>
          <button className="bg-[#D4AF37] text-[#0D1522] py-2 px-4 rounded-md font-medium ring-4 ring-[#D4AF37]/30">
            Focus
          </button>
          <button className="bg-[#E5C158] text-[#0D1522] py-2 px-4 rounded-md font-medium">
            Hover
          </button>
          <button className="bg-[#B7923A] text-[#0D1522] py-2 px-4 rounded-md font-medium">
            Active
          </button>
        </div>
      </div>
    </div>
  );
};

// Card Components Demo
const CardsDemo: React.FC = () => {
  return (
    <div className="space-y-8">
      <h2 className="font-cinzel text-2xl text-[#D4AF37] mb-6">Luxurious Card Designs</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-[#1A2A44] to-[#0D1522] p-6 rounded-xl border border-[#D4AF37]/20 shadow-lg">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-cinzel text-xl text-white ml-4">Premium Card</h3>
          </div>
          <p className="text-gray-300 mb-6">Designed with opulence in mind, each card presents information with elegance and clarity.</p>
          <div className="pt-4 border-t border-[#D4AF37]/20 flex justify-between">
            <span className="text-[#D4AF37]">$24,000</span>
            <button className="text-sm text-[#D4AF37] hover:text-[#E5C158]">View Details →</button>
          </div>
        </div>
        
        <div className="backdrop-blur-md bg-white/5 p-6 rounded-xl border border-white/10 shadow-lg">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-cinzel text-xl text-white ml-4">Crystal Card</h3>
          </div>
          <p className="text-gray-300 mb-6">Translucent design elements create a sense of depth while maintaining visual lightness.</p>
          <div className="pt-4 border-t border-white/10 flex justify-between">
            <span className="text-white/80">Verified</span>
            <button className="text-sm text-white hover:text-[#D4AF37]">View Details →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Form Components Demo
const FormsDemo: React.FC = () => {
  return (
    <div className="space-y-8">
      <h2 className="font-cinzel text-2xl text-[#D4AF37] mb-6">Refined Form Elements</h2>
      
      <form className="max-w-2xl mx-auto">
        <div className="space-y-6">
          <div>
            <label className="block text-[#D4AF37] mb-2 font-medium">Username</label>
            <input 
              type="text" 
              className="w-full bg-[#1A2A44] border border-[#D4AF37]/30 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]"
              placeholder="Enter your username"
            />
          </div>
          
          <div>
            <label className="block text-[#D4AF37] mb-2 font-medium">Select Package</label>
            <select className="w-full bg-[#1A2A44] border border-[#D4AF37]/30 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]">
              <option>Silver Tier</option>
              <option>Gold Tier</option>
              <option>Platinum Tier</option>
              <option>Diamond Tier</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="premium" 
              className="w-5 h-5 rounded border-[#D4AF37]/30 text-[#D4AF37] focus:ring-[#D4AF37]/50"
            />
            <label htmlFor="premium" className="ml-2 block text-white">Enable premium notifications</label>
          </div>
          
          <div>
            <label className="block text-[#D4AF37] mb-2 font-medium">Additional Comments</label>
            <textarea 
              className="w-full bg-[#1A2A44] border border-[#D4AF37]/30 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] min-h-[120px]"
              placeholder="Share your thoughts..."
            ></textarea>
          </div>
          
          <div className="pt-4">
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B7923A] text-[#0D1522] py-3 px-6 rounded-md font-bold hover:from-[#E5C158] hover:to-[#C8A34B] transition-all"
            >
              Submit Request
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

// Animation Components Demo
const AnimationsDemo: React.FC = () => {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    setAnimate(true);
  }, []);
  
  return (
    <div className="space-y-8">
      <h2 className="font-cinzel text-2xl text-[#D4AF37] mb-6">Elegant Animations</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-gray-300 text-lg">Transitions & Effects</h3>
          
          <div className="bg-[#1A2A44] p-6 rounded-lg border border-[#D4AF37]/20">
            <motion.div 
              className="w-full h-24 bg-gradient-to-r from-[#D4AF37]/40 to-[#D4AF37]/10 rounded-md flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-[#D4AF37] font-medium">Hover & Tap</span>
            </motion.div>
          </div>
          
          <div className="bg-[#1A2A44] p-6 rounded-lg border border-[#D4AF37]/20">
            <motion.div 
              className="w-full h-24 bg-gradient-to-r from-[#D4AF37]/20 to-transparent rounded-md flex items-center justify-center"
              animate={{ 
                x: animate ? [50, 0] : 0,
                opacity: animate ? [0, 1] : 0
              }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <span className="text-[#D4AF37] font-medium">Fade In</span>
            </motion.div>
          </div>
        </div>
        
        <div className="space-y-6">
          <h3 className="text-gray-300 text-lg">Interactive Elements</h3>
          
          <div className="bg-[#1A2A44] p-6 rounded-lg border border-[#D4AF37]/20 h-[264px] flex flex-col justify-center">
            <motion.button 
              className="bg-[#D4AF37] text-[#0D1522] py-3 px-6 rounded-md font-bold w-full mb-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setAnimate(!animate)}
            >
              Toggle Animation
            </motion.button>
            
            <div className="relative h-24 bg-[#0D1522] rounded-md overflow-hidden">
              <motion.div 
                className="absolute inset-0 bg-[#D4AF37]/20"
                initial={{ width: "0%" }}
                animate={{ width: animate ? "100%" : "0%" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[#D4AF37] font-medium">
                  {animate ? "Animating..." : "Paused"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LuxuryDemo; 