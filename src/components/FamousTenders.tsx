import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { useGLTF, Float } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

interface TenderPrismProps {
  position: [number, number, number];
  scale?: [number, number, number];
  color?: string;
  hoverColor?: string;
  data: FamousTender;
  onClick: () => void;
}

interface FamousTender {
  id: string;
  title: string;
  state: string;
  value: number;
  dueDate: string;
  description: string;
  department: string;
  category: string;
}

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 
  'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir'
];

// Sample data for famous tenders of 2025
const MOCK_FAMOUS_TENDERS: FamousTender[] = [
  {
    id: "1",
    title: "Delhi Metro Extension",
    state: "Delhi",
    value: 15000000000,
    dueDate: "2025-05-15",
    description: "Extension of Delhi Metro to connect outer regions with enhanced infrastructure and modern facilities",
    department: "Delhi Metro Rail Corporation",
    category: "Infrastructure"
  },
  {
    id: "2",
    title: "Maharashtra Smart City Initiative",
    state: "Maharashtra",
    value: 8500000000,
    dueDate: "2025-06-20",
    description: "Development of smart city infrastructure across major cities in Maharashtra",
    department: "Urban Development Department",
    category: "Smart City"
  },
  {
    id: "3",
    title: "Tamil Nadu Renewable Energy Project",
    state: "Tamil Nadu",
    value: 12000000000,
    dueDate: "2025-04-10",
    description: "Installation of solar and wind energy farms across coastal regions of Tamil Nadu",
    department: "Tamil Nadu Energy Development Agency",
    category: "Renewable Energy"
  },
  {
    id: "4",
    title: "Karnataka IT Corridor",
    state: "Karnataka",
    value: 9500000000,
    dueDate: "2025-08-30",
    description: "Development of new IT corridor with state-of-the-art infrastructure and connectivity",
    department: "Karnataka Industrial Areas Development Board",
    category: "Technology"
  },
  {
    id: "5",
    title: "Gujarat Coastal Highway",
    state: "Gujarat",
    value: 20000000000,
    dueDate: "2025-07-15",
    description: "Construction of coastal highway connecting major ports and cities along the Gujarat coastline",
    department: "National Highways Authority of India",
    category: "Infrastructure"
  },
  {
    id: "6",
    title: "West Bengal Healthcare Modernization",
    state: "West Bengal",
    value: 6500000000,
    dueDate: "2025-09-10",
    description: "Modernization of healthcare facilities and equipment across government hospitals",
    department: "West Bengal Health Department",
    category: "Healthcare"
  },
  {
    id: "7",
    title: "Uttar Pradesh Tourism Development",
    state: "Uttar Pradesh",
    value: 4500000000,
    dueDate: "2025-10-25",
    description: "Development of tourism infrastructure at key historical and religious sites",
    department: "Uttar Pradesh Tourism Department",
    category: "Tourism"
  },
  {
    id: "8",
    title: "Rajasthan Solar Park Expansion",
    state: "Rajasthan",
    value: 18000000000,
    dueDate: "2025-03-20",
    description: "Expansion of existing solar parks and development of new solar energy installations",
    department: "Rajasthan Renewable Energy Corporation",
    category: "Energy"
  }
];

// Crystal prism for tender visualization
const TenderPrism: React.FC<TenderPrismProps> = ({ position, scale = [1, 1.5, 1], color = '#D4AF37', hoverColor = '#f7d87c', data, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);
  
  const handlePointerOver = () => setHovered(true);
  const handlePointerOut = () => setHovered(false);
  const handleClick = () => {
    setActive(!active);
    onClick();
  };
  
  return (
    <Float 
      speed={2} 
      rotationIntensity={0.2} 
      floatIntensity={0.5}
    >
      <mesh 
        position={position}
        scale={scale}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <cylinderGeometry args={[0, 1, 2, 4, 1]} />
        <meshStandardMaterial 
          color={hovered ? hoverColor : color} 
          metalness={0.8}
          roughness={0.2}
          emissive={hovered ? hoverColor : color}
          emissiveIntensity={hovered ? 0.4 : 0.2}
        />
      </mesh>
      
      {hovered && (
        <Html position={[position[0], position[1] + 2, position[2]]} center>
          <div className="bg-secondary/80 backdrop-blur-sm p-2 rounded text-primary text-center w-40">
            <h3 className="font-cinzel text-sm">{data.title}</h3>
            <p className="text-xs mt-1">{data.state}</p>
            <p className="text-xs">₹{(data.value / 10000000).toFixed(1)} Cr</p>
          </div>
        </Html>
      )}
    </Float>
  );
};

// Html component for Three.js
function Html({ children, position, center }: { children: React.ReactNode, position: [number, number, number], center?: boolean }) {
  const [html] = useState(() => {
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.pointerEvents = 'none';
    return div;
  });

  useEffect(() => {
    return () => {
      if (html.parentNode) {
        html.parentNode.removeChild(html);
      }
    };
  }, [html]);

  return (
    <group position={position}>
      <primitive object={new THREE.Object3D()} />
      {React.cloneElement(React.Children.only(children) as React.ReactElement, {
        ref: (node: HTMLElement | null) => {
          if (node) {
            html.innerHTML = '';
            html.appendChild(node);
            const canvasParent = document.querySelector('canvas')?.parentNode;
            if (canvasParent && !html.parentNode) {
              canvasParent.appendChild(html);
            }
          }
        },
        style: {
          position: 'absolute',
          transform: center ? 'translate(-50%, -50%)' : 'none',
          ...((children as React.ReactElement).props.style || {})
        }
      })}
    </group>
  );
}

const TenderScene: React.FC<{ tenders: FamousTender[], onSelectTender: (tender: FamousTender) => void }> = ({ tenders, onSelectTender }) => {
  return (
    <Canvas camera={{ position: [0, 5, 12], fov: 45 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <directionalLight position={[-10, 10, 5]} intensity={1} />
      
      {tenders.map((tender, index) => {
        // Calculate grid position
        const row = Math.floor(index / 3);
        const col = index % 3;
        const x = (col - 1) * 3.5;
        const z = (row - 1) * 3.5;
        
        return (
          <TenderPrism 
            key={tender.id}
            position={[x, 0, z]}
            scale={[1, 1.5, 1]}
            data={tender}
            onClick={() => onSelectTender(tender)}
          />
        );
      })}
    </Canvas>
  );
};

export const FamousTenders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTenders, setFilteredTenders] = useState<FamousTender[]>(MOCK_FAMOUS_TENDERS);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedTender, setSelectedTender] = useState<FamousTender | null>(null);
  
  useEffect(() => {
    if (selectedState) {
      const filtered = MOCK_FAMOUS_TENDERS.filter(tender => 
        tender.state.toLowerCase() === selectedState.toLowerCase()
      );
      setFilteredTenders(filtered);
    } else if (searchTerm) {
      const filtered = MOCK_FAMOUS_TENDERS.filter(tender => 
        tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tender.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tender.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tender.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTenders(filtered);
    } else {
      setFilteredTenders(MOCK_FAMOUS_TENDERS);
    }
  }, [searchTerm, selectedState]);
  
  const handleStateClick = (state: string) => {
    if (selectedState === state) {
      setSelectedState(null);
    } else {
      setSelectedState(state);
    }
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 1,
      notation: 'compact',
      compactDisplay: 'long'
    }).format(value);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-cinzel text-primary mb-4">Famous Tenders of 2025</h2>
          <p className="text-xl font-montserrat text-white/80 max-w-3xl mx-auto">
            Explore the most prestigious government tenders coming in 2025 across different states of India.
          </p>
        </motion.div>
        
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
            <div className="w-full md:w-1/2">
              <Input
                type="text"
                placeholder="Search by title, state, or category..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSelectedState(null);
                }}
                className="bg-[#1A2A44]/50 border-[#D4AF37]/30 py-3"
              />
            </div>
          </div>
          
          <div className="mb-8">
            <div className="text-center mb-4">
              <h3 className="text-xl font-cinzel text-primary">Filter by State</h3>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {STATES.slice(0, 12).map(state => (
                <motion.button
                  key={state}
                  onClick={() => handleStateClick(state)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedState === state 
                      ? 'bg-primary text-[#1A2A44]' 
                      : 'bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/30'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {state}
                </motion.button>
              ))}
              {selectedState && !STATES.slice(0, 12).includes(selectedState) && (
                <motion.button
                  onClick={() => handleStateClick(selectedState)}
                  className="px-3 py-1.5 rounded-full text-sm font-medium transition-all bg-primary text-[#1A2A44]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {selectedState}
                </motion.button>
              )}
            </div>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative h-[60vh] mb-8 bg-[#1A2A44]/30 rounded-lg overflow-hidden shadow-lg border border-[#D4AF37]/10"
        >
          {filteredTenders.length > 0 ? (
            <TenderScene 
              tenders={filteredTenders} 
              onSelectTender={(tender) => setSelectedTender(tender)}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-center text-white/70 font-montserrat">
                No tenders found for the selected criteria.<br />
                Try adjusting your search or filter.
              </p>
            </div>
          )}
        </motion.div>
        
        {selectedTender && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-[#1A2A44] border border-[#D4AF37]/20 p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-cinzel text-primary">{selectedTender.title}</h3>
                <span className="px-3 py-1 bg-[#D4AF37]/20 text-[#D4AF37] rounded-full text-sm">
                  {selectedTender.state}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-white/60 text-sm">Value</p>
                  <p className="text-white font-medium">{formatCurrency(selectedTender.value)}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Due Date</p>
                  <p className="text-white font-medium">{formatDate(selectedTender.dueDate)}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Category</p>
                  <p className="text-white font-medium">{selectedTender.category}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-white/60 text-sm">Department</p>
                <p className="text-white">{selectedTender.department}</p>
              </div>
              
              <div>
                <p className="text-white/60 text-sm mb-2">Description</p>
                <p className="text-white/90">{selectedTender.description}</p>
              </div>
              
              <div className="mt-6 flex justify-end">
                <motion.button
                  className="px-6 py-2 bg-primary text-[#1A2A44] rounded font-medium"
                  whileHover={{ scale: 1.05, backgroundColor: '#e5c152' }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Full Details
                </motion.button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}; 