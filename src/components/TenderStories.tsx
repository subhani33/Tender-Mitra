import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Card } from './ui/Card';

interface TenderStory {
  id: string;
  title: string;
  company: string;
  tenderId: string;
  value: string;
  timeframe: string;
  outcome: string;
  type: 'success' | 'failure';
  challenges: string[];
  solutions: string[];
  image: string;
  metrics: {
    label: string;
    value: string;
    icon: string;
  }[];
}

// Success Stories
const SUCCESS_STORIES: TenderStory[] = [
  {
    id: "1",
    title: "National Highway Development Project",
    company: "Bharatmala Construction Ltd.",
    tenderId: "NH-2023-8764",
    value: "₹256 Crore",
    timeframe: "2022-2024",
    outcome: "Successfully completed 6 months ahead of schedule",
    type: 'success',
    challenges: [
      "Difficult terrain requiring specialized equipment",
      "Monsoon delays impacting construction timeline",
      "Local land acquisition complexities"
    ],
    solutions: [
      "Deployed advanced surveying and construction technology",
      "Implemented innovative drainage systems to work during monsoons",
      "Engaged local communities for smoother land acquisition"
    ],
    image: "/images/success-stories/highway-project.svg",
    metrics: [
      { label: "Time Saved", value: "180 days", icon: "clock" },
      { label: "Cost Efficiency", value: "12% under budget", icon: "money" },
      { label: "Quality Score", value: "93/100", icon: "star" }
    ]
  },
  {
    id: "2",
    title: "Modern Hospital Equipment Supply",
    company: "MedTech Solutions Ltd.",
    tenderId: "HC-2023-5621",
    value: "₹128 Crore",
    timeframe: "2023-2024",
    outcome: "Completed with 98% quality rating",
    type: 'success',
    challenges: [
      "Specialized medical equipment import delays",
      "Strict regulatory compliance requirements",
      "Complex installation specifications"
    ],
    solutions: [
      "Established dedicated import channel with customs pre-clearance",
      "Created comprehensive compliance documentation system",
      "Deployed specialized installation team with training program"
    ],
    image: "/images/success-stories/hospital-equipment.svg",
    metrics: [
      { label: "Delivery", value: "15 days early", icon: "clock" },
      { label: "Quality", value: "98% rating", icon: "star" },
      { label: "Service SLA", value: "4-hour response", icon: "activity" }
    ]
  },
  {
    id: "3",
    title: "Solar Power Plant Development",
    company: "GreenEnergy Innovations",
    tenderId: "SPP-2022-7890",
    value: "₹340 Crore",
    timeframe: "2022-2025",
    outcome: "First phase completed ahead of schedule",
    type: 'success',
    challenges: [
      "Large-scale land acquisition in multiple districts",
      "Grid integration complexities",
      "Seasonal weather disruptions"
    ],
    solutions: [
      "Innovative land pooling program with local farmers",
      "Advanced grid synchronization technology deployment",
      "Weather-resistant construction methodology"
    ],
    image: "/images/success-stories/solar-plant.svg",
    metrics: [
      { label: "Capacity", value: "120 MW", icon: "zap" },
      { label: "Efficiency", value: "22% above target", icon: "trending-up" },
      { label: "CO₂ Offset", value: "180K tons/year", icon: "leaf" }
    ]
  },
  {
    id: "4",
    title: "Smart City Infrastructure Project",
    company: "Urban Development Corporation",
    tenderId: "SC-2023-4322",
    value: "₹430 Crore",
    timeframe: "2023-2026",
    outcome: "Phase 1 completed with excellent public feedback",
    type: 'success',
    challenges: [
      "Integration with existing city infrastructure",
      "Minimizing disruption to city life during implementation",
      "Meeting strict sustainability requirements"
    ],
    solutions: [
      "Night work schedules to minimize disruption",
      "Modular design allowing phased implementation",
      "Use of recycled materials and renewable energy sources"
    ],
    image: "/images/success-stories/smart-city.svg",
    metrics: [
      { label: "Connectivity", value: "98.5% coverage", icon: "wifi" },
      { label: "Energy Savings", value: "32% reduction", icon: "battery" },
      { label: "Public Approval", value: "91% positive", icon: "thumbs-up" }
    ]
  },
  {
    id: "5",
    title: "Rural Water Supply Scheme",
    company: "Hydro Infrastructure Ltd.",
    tenderId: "WS-2022-1209",
    value: "₹178 Crore",
    timeframe: "2022-2023",
    outcome: "Delivered clean water to 5,000+ households ahead of schedule",
    type: 'success',
    challenges: [
      "Remote locations with difficult access",
      "Groundwater contamination in several areas",
      "Limited local skilled workforce"
    ],
    solutions: [
      "Helicopter-based equipment transport to remote areas",
      "Advanced filtration systems for contaminated water sources",
      "Comprehensive local training and employment program"
    ],
    image: "/images/success-stories/rural-water-supply.svg",
    metrics: [
      { label: "Coverage", value: "5,257 households", icon: "home" },
      { label: "Water Quality", value: "100% WHO standards", icon: "droplet" },
      { label: "Local Employment", value: "850+ jobs", icon: "users" }
    ]
  },
  {
    id: "6",
    title: "Defense Aircraft Maintenance Facility",
    company: "AeroTech Defense Solutions",
    tenderId: "DEF-2022-9987",
    value: "₹520 Crore",
    timeframe: "2022-2024",
    outcome: "Facility operational 3 months ahead of schedule",
    type: 'success',
    challenges: [
      "High security requirements and clearances",
      "Advanced technical specifications",
      "Coordination with multiple defense agencies"
    ],
    solutions: [
      "Dedicated security clearance team for personnel",
      "International collaboration with experienced partners",
      "Centralized coordination office with agency representatives"
    ],
    image: "/images/success-stories/defense-facility.svg",
    metrics: [
      { label: "Security Rating", value: "A+ classification", icon: "shield" },
      { label: "Maintenance Capacity", value: "24 aircraft/month", icon: "plane" },
      { label: "Technical Compliance", value: "100% specifications met", icon: "check-circle" }
    ]
  },
  {
    id: "7",
    title: "Metro Rail Extension Project",
    company: "Urban Transit Consortium",
    tenderId: "MR-2021-4567",
    value: "₹890 Crore",
    timeframe: "2021-2024",
    outcome: "10 km extension completed with minimal disruption",
    type: 'success',
    challenges: [
      "Construction in densely populated urban areas",
      "Underground utility networks requiring relocation",
      "Maintaining operational status of existing lines"
    ],
    solutions: [
      "Tunnel boring machines with minimal surface disruption",
      "3D mapping of all underground utilities before work",
      "Night-time construction schedule for critical intersections"
    ],
    image: "/images/success-stories/metro-rail.svg",
    metrics: [
      { label: "Daily Capacity", value: "120,000 passengers", icon: "users" },
      { label: "Travel Time Saved", value: "28 min/journey", icon: "clock" },
      { label: "Traffic Reduction", value: "18% on major routes", icon: "truck" }
    ]
  },
  {
    id: "8",
    title: "Digital Village Initiative",
    company: "RuralTech Solutions",
    tenderId: "DGT-2023-3344",
    value: "₹85 Crore",
    timeframe: "2023-2024",
    outcome: "Connected 500 villages to digital infrastructure",
    type: 'success',
    challenges: [
      "Remote locations with no existing connectivity",
      "Limited power infrastructure in many villages",
      "Digital literacy barriers among residents"
    ],
    solutions: [
      "Solar-powered communication towers",
      "Satellite-based internet connectivity in ultra-remote areas",
      "Comprehensive digital literacy program for residents"
    ],
    image: "/images/success-stories/digital-village.svg",
    metrics: [
      { label: "Internet Access", value: "98.7% coverage", icon: "wifi" },
      { label: "Digital Services", value: "45+ available", icon: "smartphone" },
      { label: "Training", value: "25,000+ residents", icon: "book" }
    ]
  },
  {
    id: "9",
    title: "Coastal Protection Infrastructure",
    company: "Maritime Engineering Corp.",
    tenderId: "CP-2022-6754",
    value: "₹310 Crore",
    timeframe: "2022-2024",
    outcome: "Protected 120km of coastline from erosion and flooding",
    type: 'success',
    challenges: [
      "Extreme weather conditions during construction",
      "Environmental conservation requirements",
      "Working with tidal patterns and sea conditions"
    ],
    solutions: [
      "Weather-adaptive construction schedules",
      "Nature-based solutions including mangrove restoration",
      "Advanced coastal engineering techniques"
    ],
    image: "/images/success-stories/coastal-protection.svg",
    metrics: [
      { label: "Protected Area", value: "120 km coastline", icon: "map" },
      { label: "Storm Resilience", value: "Category 4 rated", icon: "cloud-lightning" },
      { label: "Marine Life", value: "32% increase", icon: "fish" }
    ]
  },
  {
    id: "10",
    title: "Regional Airport Modernization",
    company: "Aviation Infrastructure Partners",
    tenderId: "AIR-2023-4520",
    value: "₹420 Crore",
    timeframe: "2023-2025",
    outcome: "Transformed regional airport to handle international flights",
    type: 'success',
    challenges: [
      "Maintaining operational status during construction",
      "Limited land availability for expansion",
      "Meeting international aviation standards"
    ],
    solutions: [
      "Phased construction approach with minimal disruption",
      "Vertical integration of facilities to maximize space",
      "International aviation experts collaboration"
    ],
    image: "/images/success-stories/regional-airport-modernization.svg",
    metrics: [
      { label: "Passenger Capacity", value: "3.2M annually", icon: "users" },
      { label: "Flight Operations", value: "+85% increase", icon: "plane" },
      { label: "Economic Impact", value: "₹520Cr regional GDP", icon: "trending-up" }
    ]
  },
  {
    id: "11",
    title: "District Court Complex",
    company: "Civic Infrastructure Development",
    tenderId: "JUS-2022-8731",
    value: "₹210 Crore",
    timeframe: "2022-2024",
    outcome: "Built modern judicial complex with digital infrastructure",
    type: 'success',
    challenges: [
      "Highly specific security requirements",
      "Integration of heritage elements with modern design",
      "Incorporation of advanced digital court systems"
    ],
    solutions: [
      "Specialized security consultants for design phase",
      "Heritage preservation experts on the project team",
      "Cutting-edge digital courtroom technology integration"
    ],
    image: "/images/success-stories/district-court-complex.svg",
    metrics: [
      { label: "Courtrooms", value: "32 digital-enabled", icon: "layout" },
      { label: "Case Capacity", value: "+140% increase", icon: "folder" },
      { label: "Processing Time", value: "62% reduction", icon: "clock" }
    ]
  },
  {
    id: "12",
    title: "Urban Metro Ticketing System",
    company: "Transit Technology Solutions",
    tenderId: "TRN-2023-3921",
    value: "₹156 Crore",
    timeframe: "2023-2024",
    outcome: "Implemented seamless digital ticketing across metro network",
    type: 'success',
    challenges: [
      "Integration with multiple legacy systems",
      "High volume transaction processing requirements",
      "Strict data privacy and security regulations"
    ],
    solutions: [
      "Custom middleware for legacy system integration",
      "Scalable cloud architecture with local redundancy",
      "End-to-end encryption and comprehensive security audit"
    ],
    image: "/images/success-stories/urban-metro-ticketing.svg",
    metrics: [
      { label: "Transaction Speed", value: "0.3 seconds avg", icon: "zap" },
      { label: "User Adoption", value: "92% in first month", icon: "users" },
      { label: "Revenue Leakage", value: "Reduced by 27%", icon: "trending-down" }
    ]
  }
];

// Failure Stories
const FAILURE_STORIES: TenderStory[] = [
  {
    id: "f1",
    title: "Urban Housing Project",
    company: "Metropolis Builders Ltd.",
    tenderId: "UH-2021-3345",
    value: "₹420 Crore",
    timeframe: "2021-2023",
    outcome: "Project abandoned after 40% completion due to funding issues",
    type: 'failure',
    challenges: [
      "Unexpected soil conditions requiring foundation redesign",
      "Multiple stakeholder conflicts about design specifications",
      "Cost escalation of key construction materials"
    ],
    solutions: [
      "Attempted refinancing through additional investors",
      "Redesign of project scope to reduce costs",
      "Negotiation with suppliers for extended payment terms"
    ],
    image: "/images/failure-stories/housing-project.svg",
    metrics: [
      { label: "Cost Overrun", value: "68% above budget", icon: "trending-up" },
      { label: "Time Delay", value: "14 months", icon: "clock" },
      { label: "Completion Rate", value: "40% before abandonment", icon: "percent" }
    ]
  },
  {
    id: "f2",
    title: "Rural Electrification Project",
    company: "PowerGrid Solutions",
    tenderId: "REP-2022-1122",
    value: "₹235 Crore",
    timeframe: "2022-2023",
    outcome: "Project terminated after multiple operational failures",
    type: 'failure',
    challenges: [
      "Underestimation of terrain difficulties",
      "Equipment failure in harsh weather conditions",
      "Local opposition to transmission tower locations"
    ],
    solutions: [
      "Attempted deployment of alternative equipment",
      "Community engagement programs for local acceptance",
      "Revised routing for transmission infrastructure"
    ],
    image: "/images/failure-stories/rural-power.svg",
    metrics: [
      { label: "Villages Connected", value: "28% of target", icon: "home" },
      { label: "Equipment Failure", value: "43% of installations", icon: "x-circle" },
      { label: "Budget Consumed", value: "72% with minimal results", icon: "dollar-sign" }
    ]
  },
  {
    id: "f3",
    title: "Municipal Waste Management System",
    company: "EcoWaste Technologies",
    tenderId: "WM-2021-7788",
    value: "₹180 Crore",
    timeframe: "2021-2022",
    outcome: "Project cancelled due to regulatory compliance issues",
    type: 'failure',
    challenges: [
      "Evolving environmental regulations during implementation",
      "Community protests against waste processing facility location",
      "Technical failures in waste segregation systems"
    ],
    solutions: [
      "Attempted redesign of processing systems to meet new regulations",
      "Public consultations to address community concerns",
      "Technical consultants engaged to resolve system issues"
    ],
    image: "/images/failure-stories/waste-management.svg",
    metrics: [
      { label: "Compliance Gap", value: "Failed 7 critical standards", icon: "alert-triangle" },
      { label: "System Efficiency", value: "28% below specification", icon: "activity" },
      { label: "Public Opposition", value: "78% disapproval rate", icon: "thumbs-down" }
    ]
  },
  {
    id: "f4",
    title: "State Highway Expansion",
    company: "RoadWorks Infrastructure",
    tenderId: "SH-2020-4567",
    value: "₹340 Crore",
    timeframe: "2020-2022",
    outcome: "Project stalled indefinitely due to land acquisition disputes",
    type: 'failure',
    challenges: [
      "Multiple legal challenges to land acquisition process",
      "Significant cost escalation during delays",
      "Political interference in route planning"
    ],
    solutions: [
      "Revised compensation packages for landowners",
      "Alternative routing proposals to minimize disputes",
      "Engagement of legal experts for resolution"
    ],
    image: "/images/failure-stories/highway-expansion.svg",
    metrics: [
      { label: "Legal Cases", value: "143 pending", icon: "file-text" },
      { label: "Completion Status", value: "12% of total length", icon: "percent" },
      { label: "Time Overrun", value: "30+ months and counting", icon: "clock" }
    ]
  },
  {
    id: "f5",
    title: "Smart Traffic Management System",
    company: "UrbanTech Innovations",
    tenderId: "TMS-2022-6698",
    value: "₹125 Crore",
    timeframe: "2022-2023",
    outcome: "System decommissioned after persistent technical failures",
    type: 'failure',
    challenges: [
      "Integration failures with existing traffic infrastructure",
      "Software reliability issues in peak traffic conditions",
      "Data privacy concerns from citizen groups"
    ],
    solutions: [
      "Multiple software patches and updates",
      "Engagement of additional technical experts",
      "Data anonymization protocols implementation"
    ],
    image: "/images/failure-stories/traffic-system.svg",
    metrics: [
      { label: "System Downtime", value: "42% of operational period", icon: "wifi-off" },
      { label: "False Alerts", value: "Thousands daily", icon: "bell" },
      { label: "Traffic Improvement", value: "No measurable change", icon: "trending-down" }
    ]
  },
  {
    id: "f6",
    title: "Municipal Water Treatment Plant",
    company: "AquaPure Systems",
    tenderId: "WT-2021-5432",
    value: "₹210 Crore",
    timeframe: "2021-2022",
    outcome: "Project abandoned after discovery of design flaws",
    type: 'failure',
    challenges: [
      "Underestimation of water contamination levels",
      "Design capacity inadequate for population growth",
      "Technical specifications misalignment with local conditions"
    ],
    solutions: [
      "Attempted redesign of treatment processes",
      "Scaling up capacity in revised plans",
      "Additional filtration systems proposal"
    ],
    image: "/images/failure-stories/water-treatment.svg",
    metrics: [
      { label: "Design Flaws", value: "17 critical issues identified", icon: "x-octagon" },
      { label: "Treatment Efficiency", value: "65% below required standards", icon: "droplet" },
      { label: "Resources Wasted", value: "₹87 Crore", icon: "trash" }
    ]
  },
  {
    id: "f7",
    title: "Port Modernization Project",
    company: "Maritime Infrastructure Development Ltd.",
    tenderId: "PM-2020-7755",
    value: "₹680 Crore",
    timeframe: "2020-2022",
    outcome: "Project halted at 40% completion due to environmental concerns",
    type: 'failure',
    challenges: [
      "Unexpected environmental impact assessment findings",
      "Marine ecosystem damage concerns raised by experts",
      "Shifting regulatory compliance requirements during construction"
    ],
    solutions: [
      "Revised design with reduced environmental footprint",
      "Extensive marine ecosystem protection measures proposed",
      "Advanced pollution control systems installation attempts"
    ],
    image: "/images/failure-stories/port-modernization.svg",
    metrics: [
      { label: "Completion Rate", value: "40% before stoppage", icon: "percent" },
      { label: "Environmental Issues", value: "17 critical concerns", icon: "alert-triangle" },
      { label: "Economic Impact", value: "₹220Cr losses", icon: "trending-down" }
    ]
  },
  {
    id: "f8",
    title: "Smart City Development Initiative",
    company: "Urban Innovation Technologies",
    tenderId: "SC-2021-4422",
    value: "₹310 Crore",
    timeframe: "2021-2023",
    outcome: "Project abandoned after critical technology integration failures",
    type: 'failure',
    challenges: [
      "Complex integration of disparate urban systems",
      "Cybersecurity vulnerabilities discovered in core infrastructure",
      "Public data privacy concerns escalated by media coverage"
    ],
    solutions: [
      "Attempted comprehensive security audit and remediation",
      "Data anonymization and encryption enhancements",
      "System architecture redesign proposals"
    ],
    image: "/images/failure-stories/smart-city-development.svg",
    metrics: [
      { label: "Security Flaws", value: "52 critical issues", icon: "shield-off" },
      { label: "System Failures", value: "76% of test scenarios", icon: "x-circle" },
      { label: "Public Trust", value: "Declined by 65%", icon: "trending-down" }
    ]
  },
  {
    id: "f9",
    title: "National Highway Construction",
    company: "Infrastructure Development Corporation",
    tenderId: "NH-2022-3311",
    value: "₹420 Crore",
    timeframe: "2022-2023",
    outcome: "Project terminated after massive cost overruns and quality issues",
    type: 'failure',
    challenges: [
      "Geological surveys proved inadequate for terrain complexity",
      "Material quality inconsistencies from multiple suppliers",
      "Severe weather events damaged construction in progress"
    ],
    solutions: [
      "Attempted comprehensive geological reassessment",
      "Stricter quality control systems implementation",
      "Weather-resistant construction methodologies"
    ],
    image: "/images/failure-stories/national-highway-construction.svg",
    metrics: [
      { label: "Cost Overrun", value: "78% above budget", icon: "dollar-sign" },
      { label: "Quality Issues", value: "135 critical defects", icon: "alert-triangle" },
      { label: "Schedule Delay", value: "16 months before termination", icon: "clock" }
    ]
  }
];

// Combine both success and failure stories
const TENDER_STORIES: TenderStory[] = [...SUCCESS_STORIES, ...FAILURE_STORIES];

// Define a global cache for loaded images
const preloadedImages: Record<string, boolean> = {};
const preloadedSvgs: Record<string, boolean> = {};

// Helper function to get the appropriate image URL (SVG with JPG fallback)
const getImageUrl = (basePath: string, format: 'svg' | 'jpg' = 'svg'): string => {
  // If the basePath already ends with the format extension, return it as is
  if (basePath.endsWith(`.${format}`)) {
    return basePath;
  }
  // Otherwise, append the format extension
  return `${basePath}.${format}`;
};

export const TenderStories: React.FC = () => {
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>(preloadedImages);
  const [svgSupported, setSvgSupported] = useState<Record<string, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const [storyType, setStoryType] = useState<'success' | 'failure' | 'all'>('all');
  const [activeStory, setActiveStory] = useState<TenderStory | null>(null);
  const [direction, setDirection] = useState<number>(0);
  
  // Filter stories based on type
  const filteredStories = storyType === 'all' 
    ? TENDER_STORIES 
    : TENDER_STORIES.filter(story => story.type === storyType);
  
  // Start preloading images when the component mounts
  useEffect(() => {
    // Preload all images to prevent layout shifts
    TENDER_STORIES.forEach(story => {
      // Try loading SVG first
      if (!preloadedSvgs[story.image]) {
        const svgImg = new Image();
        svgImg.src = getImageUrl(story.image, 'svg');
        svgImg.onload = () => {
          preloadedSvgs[story.image] = true;
          setSvgSupported(prev => ({...prev, [story.image]: true}));
          setImagesLoaded(prev => ({...prev, [story.image]: true}));
        };
        svgImg.onerror = () => {
          // SVG not available, try JPG
          setSvgSupported(prev => ({...prev, [story.image]: false}));
          if (!preloadedImages[story.image]) {
            const jpgImg = new Image();
            jpgImg.src = getImageUrl(story.image, 'jpg');
            jpgImg.onload = () => {
              preloadedImages[story.image] = true;
              setImagesLoaded(prev => ({...prev, [story.image]: true}));
            };
          }
        };
      }
    });
  }, []);
  
  const handleStoryChange = (story: TenderStory, index: number) => {
    const currentIndex = activeStory ? TENDER_STORIES.findIndex(s => s.id === activeStory.id) : -1;
    setDirection(currentIndex >= 0 && index > currentIndex ? 1 : -1);
    setActiveStory(story);
  };
  
  return (
    <section className="py-16 bg-[#0D1629] text-white">
      <div className="container mx-auto px-4" ref={containerRef}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-cinzel text-primary mb-4">Tender Stories</h2>
          <p className="text-xl font-montserrat text-white/80 max-w-3xl mx-auto">
            Discover how companies overcame challenges or encountered setbacks in their tender execution journeys.
          </p>
          
          {/* Filter tabs */}
          <div className="flex justify-center mt-8 space-x-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2 rounded-full transition-all duration-300 border-2
                ${storyType === 'all' 
                  ? 'bg-primary text-black border-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.5)]' 
                  : 'bg-gray-800 text-white border-transparent hover:border-[#D4AF37]/50'
                }`}
              onClick={() => setStoryType('all')}
            >
              All Stories
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2 rounded-full transition-all duration-300 border-2
                ${storyType === 'success' 
                  ? 'bg-primary text-black border-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.5)]' 
                  : 'bg-gray-800 text-white border-transparent hover:border-[#D4AF37]/50'
                }`}
              onClick={() => setStoryType('success')}
            >
              Success Stories
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2 rounded-full transition-all duration-300 border-2
                ${storyType === 'failure' 
                  ? 'bg-primary text-black border-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.5)]' 
                  : 'bg-gray-800 text-white border-transparent hover:border-[#D4AF37]/50'
                }`}
              onClick={() => setStoryType('failure')}
            >
              Failure Stories
            </motion.button>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStories.map((story, index) => (
            <StoryCard 
              key={story.id} 
              story={story} 
              index={index} 
              isImageLoaded={imagesLoaded[story.image] || false} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

interface StoryCardProps {
  story: TenderStory;
  index: number;
  isImageLoaded: boolean;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, index, isImageLoaded }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "0px 0px -100px 0px" });
  const [imageLoaded, setImageLoaded] = useState(isImageLoaded);
  const [isSvg, setIsSvg] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  
  const handleImageError = () => {
    // If SVG fails, try JPG
    if (isSvg) {
      setIsSvg(false);
    }
  };
  
  const imageUrl = isSvg 
    ? getImageUrl(story.image, 'svg')
    : getImageUrl(story.image, 'jpg');
    
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className={`h-full overflow-hidden transition-all duration-300 
        ${story.type === 'success' 
          ? 'border-green-500/30 hover:border-green-500/70' 
          : 'border-red-500/30 hover:border-red-500/70'
        }
        group hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] relative
        before:absolute before:inset-0 before:border-2 before:border-[#D4AF37]/0 
        hover:before:border-[#D4AF37]/80 before:transition-all before:duration-300 before:rounded-xl
      `}>
        <div className="relative h-48 overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-800 animate-pulse"></div>
          )}
          <motion.img
            src={imageUrl}
            alt={story.title}
            onLoad={() => setImageLoaded(true)}
            onError={handleImageError}
            animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
            transition={{ duration: 0.5 }}
            className={`w-full h-full object-cover transition-all duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } group-hover:saturate-[1.2] group-hover:brightness-110`}
          />
          <div className={`absolute top-0 right-0 m-2 px-3 py-1 rounded-full text-xs font-medium 
            ${story.type === 'success' 
              ? 'bg-green-500/90 text-white' 
              : 'bg-red-500/90 text-white'
            }
            shadow-lg z-10
          `}>
            {story.type === 'success' ? 'Success' : 'Learning'}
          </div>
          
          {/* Luxury overlay effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A2A44]/80 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-cinzel text-primary mb-4 group-hover:text-[#D4AF37] transition-colors duration-300">{story.title}</h3>
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <p className="text-white/60">Tender Value</p>
              <p className="text-white font-medium group-hover:text-[#D4AF37] transition-colors duration-300">{story.value}</p>
            </div>
            <div>
              <p className="text-white/60">Timeframe</p>
              <p className="text-white font-medium">{story.timeframe}</p>
            </div>
            <div>
              <p className="text-white/60">Tender ID</p>
              <p className="text-white font-medium">{story.tenderId}</p>
            </div>
            <div>
              <p className="text-white/60">Outcome</p>
              <p className={`font-medium ${story.type === 'success' ? 'text-green-400' : 'text-amber-400'}`}>
                {story.outcome}
              </p>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-primary font-cinzel mb-2 group-hover:text-[#D4AF37] transition-colors duration-300">Challenges</h4>
            <ul className="list-disc pl-5 space-y-1 text-white/80 text-sm">
              {story.challenges.map((challenge, i) => (
                <li key={i}>{challenge}</li>
              ))}
            </ul>
          </div>
          
          <div className="mb-6">
            <h4 className="text-primary font-cinzel mb-2 group-hover:text-[#D4AF37] transition-colors duration-300">
              {story.type === 'success' ? 'Solutions' : 'Attempted Solutions'}
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-white/80 text-sm">
              {story.solutions.map((solution, i) => (
                <li key={i}>{solution}</li>
              ))}
            </ul>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mt-4">
            {story.metrics.map((metric, i) => (
              <div key={i} className="bg-[#0D1629]/50 p-3 rounded text-center group-hover:bg-[#0D1629]/80 transition-colors duration-300 border border-transparent group-hover:border-[#D4AF37]/30">
                <p className="text-primary text-sm group-hover:text-[#D4AF37] transition-colors duration-300">{metric.label}</p>
                <p className="text-white font-medium">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}; 