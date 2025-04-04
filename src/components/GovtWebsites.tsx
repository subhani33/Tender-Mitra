import React from 'react';
import { motion } from 'framer-motion';

interface GovtWebsite {
  id: string;
  name: string;
  url: string;
  description: string;
  icon: string;
  features: string[];
}

const GOVT_WEBSITES: GovtWebsite[] = [
  {
    id: "cppp",
    name: "Central Public Procurement Portal",
    url: "https://eprocure.gov.in",
    description: "Official e-Procurement portal of the Government of India. Access tenders from central government ministries, departments, and CPSEs.",
    icon: "/images/websites/eprocure-icon.svg",
    features: [
      "Unified platform for all central government tenders",
      "Online bid submission and tender management",
      "Free registration for bidders",
      "Advanced search and filtering capabilities"
    ]
  },
  {
    id: "gem",
    name: "Government e-Marketplace",
    url: "https://gem.gov.in",
    description: "National public procurement portal facilitating online purchase of goods and services for government organizations.",
    icon: "/images/websites/gem-icon.svg",
    features: [
      "Direct procurement from registered sellers",
      "Transparent pricing and bidding system",
      "Quality assurance through standardization",
      "Dashboards and analytics for tracking"
    ]
  },
  {
    id: "railway",
    name: "Indian Railways E-Procurement System",
    url: "https://ireps.gov.in",
    description: "Procurement portal for Indian Railways handling tenders, e-auction for scrap sales, and vendor management.",
    icon: "/images/websites/ireps-icon.svg",
    features: [
      "Specialized tenders for railway supplies and services",
      "Online vendor registration and approval",
      "Real-time bid status updates",
      "Technical specification library"
    ]
  },
  {
    id: "defense",
    name: "Defence Procurement Portal",
    url: "https://defproc.gov.in",
    description: "Official portal for procurement activities related to defense services and organizations under the Ministry of Defence.",
    icon: "/images/websites/defence-icon.svg",
    features: [
      "Defense acquisition procedures and policies",
      "Strategic partnership model guidelines",
      "Offset policy documentation",
      "Vendor registration for defense procurement"
    ]
  },
  {
    id: "dgft",
    name: "Directorate General of Foreign Trade",
    url: "https://dgft.gov.in",
    description: "Portal for international trade-related procedures, documentation, and licensing for exporters and importers.",
    icon: "/images/websites/dgft-icon.svg",
    features: [
      "Import-Export Code (IEC) registration",
      "Export promotion schemes",
      "Trading licenses and certificates",
      "International trade policy updates"
    ]
  }
];

export const GovtWebsites: React.FC = () => {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-cinzel text-primary mb-4">Official Government Portals</h2>
          <p className="text-xl font-montserrat text-white/80 max-w-3xl mx-auto">
            Access these authorized government websites to find and bid on tenders from various departments and agencies.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {GOVT_WEBSITES.map((website, index) => (
            <WebsiteCard key={website.id} website={website} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

interface WebsiteCardProps {
  website: GovtWebsite;
  index: number;
}

const WebsiteCard: React.FC<WebsiteCardProps> = ({ website, index }) => {
  // Ripple effect hook
  const handleRipple = (e: React.MouseEvent<HTMLDivElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement("span");
    
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add("ripple");
    
    // Remove existing ripples
    const currentRipples = button.getElementsByClassName("ripple");
    for (let i = 0; i < currentRipples.length; i++) {
      currentRipples[i].remove();
    }
    
    button.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
      ripple.remove();
    }, 600);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-[#1A2A44]/90 rounded-lg overflow-hidden shadow-lg border border-[#D4AF37]/20"
    >
      {/* Card header with website logo/icon */}
      <div className="relative h-24 p-6 flex items-center justify-center overflow-hidden">
        {/* Gold etched background pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url("/textures/gold-pattern.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        
        {/* Diagonal gold line accent */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#D4AF37]/10 rotate-45 transform origin-bottom-right"></div>
        </div>
        
        {/* Website icon/logo */}
        <div className="relative z-10 bg-[#1A2A44] w-16 h-16 rounded-full flex items-center justify-center border-2 border-[#D4AF37]/30">
          <div className="text-primary text-2xl font-bold">
            {website.name.charAt(0)}
          </div>
        </div>
      </div>
      
      {/* Card content */}
      <div className="p-6">
        <h3 className="text-xl font-cinzel text-primary mb-3">{website.name}</h3>
        <p className="text-white/70 text-sm mb-5">{website.description}</p>
        
        <div className="mb-6">
          <h4 className="text-primary/90 font-cinzel text-sm mb-2">Key Features:</h4>
          <ul className="space-y-2">
            {website.features.map((feature, i) => (
              <li key={i} className="flex items-start">
                <span className="text-primary mr-2 mt-1">•</span>
                <span className="text-white/80 text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Visit website button with ripple effect */}
        <div 
          className="relative overflow-hidden rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 cursor-pointer transition-colors group"
          onClick={handleRipple}
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <a 
            href={website.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block px-4 py-3 text-center text-primary font-medium"
          >
            Visit Official Website
            <span className="inline-block ml-2 transform transition-transform group-hover:translate-x-1">→</span>
          </a>
          
          {/* CSS for ripple effect */}
          <style jsx>{`
            .ripple {
              position: absolute;
              border-radius: 50%;
              background-color: rgba(212, 175, 55, 0.3);
              transform: scale(0);
              animation: ripple 0.6s linear;
              pointer-events: none;
            }
            
            @keyframes ripple {
              to {
                transform: scale(4);
                opacity: 0;
              }
            }
          `}</style>
        </div>
      </div>
    </motion.div>
  );
};

// Footer component with govt website links
export const GovtWebsitesFooter: React.FC = () => {
  return (
    <div className="py-8 border-t border-[#D4AF37]/20">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-4">
          {GOVT_WEBSITES.map((website) => (
            <motion.a
              key={website.id}
              href={website.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#1A2A44] text-primary border border-[#D4AF37]/30 rounded-md hover:bg-[#1A2A44]/80 transition-colors inline-flex items-center"
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 0 15px rgba(212, 175, 55, 0.3)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="mr-2 text-[#D4AF37]">→</span>
              {website.name}
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}; 