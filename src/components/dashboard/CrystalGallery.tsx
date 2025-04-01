import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, useTexture, Float } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Tender, TenderFilters } from '../../types';
import { LiveIndicator } from '../../components/LiveIndicator';

// Crystal prism component representing a tender
interface CrystalProps {
  position: [number, number, number];
  tender: Tender;
  onClick: () => void;
  isSelected: boolean;
}

const Crystal: React.FC<CrystalProps> = ({ position, tender, onClick, isSelected }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Different colors based on tender status
  const getStatusColor = () => {
    switch(tender.status) {
      case 'Open': return new THREE.Color('#2E8B57'); // Emerald
      case 'Closing Soon': return new THREE.Color('#D4AF37'); // Gold
      case 'Under Review': return new THREE.Color('#4169E1'); // Royal Blue
      case 'Awarded': return new THREE.Color('#9932CC'); // Purple
      default: return new THREE.Color('#708090'); // Gray
    }
  };
  
  // Value-based size scaling
  const getValueSize = () => {
    const baseSize = 0.5;
    const valueScale = Math.log10(tender.value) / 10;
    return baseSize + valueScale * 0.7;
  };
  
  // Animation
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Rotation
    meshRef.current.rotation.y += 0.005;
    
    // Hover/selection effect
    if (isSelected) {
      meshRef.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1);
      (meshRef.current.material as THREE.MeshPhysicalMaterial).emissiveIntensity = 0.8 + Math.sin(state.clock.getElapsedTime() * 2) * 0.2;
    } else {
      meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      (meshRef.current.material as THREE.MeshPhysicalMaterial).emissiveIntensity = 0.2 + Math.sin(state.clock.getElapsedTime()) * 0.1;
    }
  });
  
  // Crystal texture with error handling
  const crystalTexture = (() => {
    try {
      return useTexture('/textures/crystal-normal.jpg');
    } catch (error) {
      console.warn('Failed to load crystal texture, using fallback');
      const fallbackTexture = new THREE.Texture();
      fallbackTexture.needsUpdate = true;
      return fallbackTexture;
    }
  })();
  
  return (
    <Float 
      speed={2} 
      rotationIntensity={0.2} 
      floatIntensity={0.5}
      position={position}
    >
      <mesh
        ref={meshRef}
        onClick={onClick}
        castShadow
        receiveShadow
      >
        <octahedronGeometry args={[getValueSize(), 0]} />
        <meshPhysicalMaterial
          color={getStatusColor()}
          emissive={getStatusColor()}
          emissiveIntensity={0.3}
          metalness={0.9}
          roughness={0.1}
          normalMap={crystalTexture}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transmission={0.5}
          transparent={true}
          opacity={0.8}
        />
      </mesh>
      
      <Text
        position={[0, -getValueSize() - 0.3, 0]}
        fontSize={0.15}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={2}
      >
        {tender.title.length > 20 ? tender.title.substring(0, 20) + '...' : tender.title}
      </Text>
    </Float>
  );
};

// Glass floor component
const GlassFloor: React.FC = () => {
  // Floor texture with error handling
  const floorTexture = (() => {
    try {
      return useTexture('/textures/glass-floor.jpg');
    } catch (error) {
      console.warn('Failed to load floor texture, using fallback');
      const fallbackTexture = new THREE.Texture();
      fallbackTexture.needsUpdate = true;
      return fallbackTexture;
    }
  })();
  
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
      <planeGeometry args={[50, 50, 20, 20]} />
      <meshPhysicalMaterial
        color="#1A2A44"
        metalness={0.2}
        roughness={0.1}
        clearcoat={1}
        clearcoatRoughness={0}
        normalMap={floorTexture}
        normalScale={new THREE.Vector2(0.1, 0.1)}
        transparent
        opacity={0.7}
        envMapIntensity={1}
      />
    </mesh>
  );
};

// 3D Scene with crystals
interface SceneProps {
  tenders: Tender[];
  selectedTender: Tender | null;
  setSelectedTender: (tender: Tender | null) => void;
}

const Scene: React.FC<SceneProps> = ({ tenders, selectedTender, setSelectedTender }) => {
  // Arrange tenders in a grid
  const getTenderPosition = (index: number): [number, number, number] => {
    const gridSize = Math.ceil(Math.sqrt(tenders.length));
    const x = (index % gridSize) * 3 - (gridSize * 3) / 2 + 1.5;
    const z = Math.floor(index / gridSize) * 3 - (gridSize * 3) / 2 + 1.5;
    return [x, 0, z];
  };
  
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 20, 10]} 
        intensity={1.5} 
        castShadow 
        shadow-mapSize-width={2048} 
        shadow-mapSize-height={2048} 
      />
      <pointLight position={[0, 10, 0]} intensity={0.5} color="#D4AF37" />
      
      <GlassFloor />
      
      {tenders.map((tender, index) => (
        <Crystal
          key={tender._id || index}
          position={getTenderPosition(index)}
          tender={tender}
          onClick={() => setSelectedTender(tender)}
          isSelected={selectedTender?._id === tender._id}
        />
      ))}
      
      <fog attach="fog" args={['#1A2A44', 10, 50]} />
    </>
  );
};

// Filter controls component
interface FilterControlsProps {
  filters: TenderFilters;
  setFilters: React.Dispatch<React.SetStateAction<TenderFilters>>;
  departments: string[];
  statuses: string[];
}

const FilterControls: React.FC<FilterControlsProps> = ({ 
  filters, 
  setFilters, 
  departments, 
  statuses 
}) => {
  const handleFilterChange = (key: keyof TenderFilters, value: string | number | null) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-4 right-4 bg-[#1A2A44]/90 backdrop-blur-lg border border-[#D4AF37]/30 p-4 rounded-lg w-64"
    >
      <h3 className="font-cinzel text-[#D4AF37] text-lg mb-4">Filter Crystals</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-white text-sm mb-1 font-montserrat">Status</label>
          <select 
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value || null)}
            className="w-full bg-[#0A1A34] border border-[#D4AF37]/30 text-white rounded px-3 py-2 focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="">All Statuses</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-white text-sm mb-1 font-montserrat">Department</label>
          <select 
            value={filters.department || ''}
            onChange={(e) => handleFilterChange('department', e.target.value || null)}
            className="w-full bg-[#0A1A34] border border-[#D4AF37]/30 text-white rounded px-3 py-2 focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-white text-sm mb-1 font-montserrat">Minimum Value (₹)</label>
          <input 
            type="number" 
            value={filters.minValue || ''}
            onChange={(e) => handleFilterChange('minValue', e.target.value ? Number(e.target.value) : null)}
            className="w-full bg-[#0A1A34] border border-[#D4AF37]/30 text-white rounded px-3 py-2 focus:outline-none focus:border-[#D4AF37]"
            placeholder="Minimum value"
          />
        </div>
        
        <div>
          <label className="block text-white text-sm mb-1 font-montserrat">Search</label>
          <input 
            type="text" 
            value={filters.searchTerm || ''}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value || null)}
            className="w-full bg-[#0A1A34] border border-[#D4AF37]/30 text-white rounded px-3 py-2 focus:outline-none focus:border-[#D4AF37]"
            placeholder="Search tenders"
          />
        </div>
        
        <button 
          onClick={() => setFilters({})}
          className="w-full bg-[#D4AF37] hover:bg-[#B79020] text-[#1A2A44] font-bold py-2 px-4 rounded mt-2"
        >
          Reset Filters
        </button>
      </div>
    </motion.div>
  );
};

// Tender detail card
interface TenderDetailCardProps {
  tender: Tender;
  onClose: () => void;
}

const TenderDetailCard: React.FC<TenderDetailCardProps> = ({ tender, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute bottom-4 left-4 bg-[#1A2A44]/95 backdrop-blur-md border border-[#D4AF37] p-6 rounded-lg shadow-2xl z-10 w-96"
    >
      <h3 className="font-cinzel text-[#D4AF37] text-xl mb-4 font-bold">{tender.title}</h3>
      
      <div className="space-y-3 text-gray-300 font-montserrat">
        <div className="flex justify-between">
          <span className="text-gray-400">Reference</span>
          <span className="text-white">{tender.referenceNumber}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Department</span>
          <span className="text-white">{tender.department}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Value</span>
          <span className="text-[#D4AF37] font-bold">
            {new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
              maximumFractionDigits: 0
            }).format(tender.value)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Category</span>
          <span className="text-white">{tender.category}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Location</span>
          <span className="text-white">{tender.location}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Deadline</span>
          <span className="text-white">
            {new Date(tender.deadline).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Status</span>
          <span className={`px-2 py-0.5 rounded-full text-xs ${
            tender.status === 'Open' ? 'bg-green-900 text-green-300' :
            tender.status === 'Closing Soon' ? 'bg-amber-900 text-amber-300' :
            tender.status === 'Under Review' ? 'bg-blue-900 text-blue-300' :
            tender.status === 'Awarded' ? 'bg-purple-900 text-purple-300' :
            'bg-gray-800 text-gray-300'
          }`}>
            {tender.status}
          </span>
        </div>
        
        <div className="pt-2">
          <p className="text-sm text-gray-400 mb-1">Description</p>
          <p className="text-white text-sm">{tender.description}</p>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <button 
          className="bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10 font-bold py-2 px-4 rounded mr-2"
          onClick={() => window.open(`/tender/${tender._id}`, '_blank')}
        >
          Full Details
        </button>
        
        <button 
          className="bg-[#D4AF37] hover:bg-[#B79020] text-[#1A2A44] font-bold py-2 px-4 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </motion.div>
  );
};

// Main component
export default function CrystalGallery() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [filteredTenders, setFilteredTenders] = useState<Tender[]>([]);
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TenderFilters>({});
  const [departments, setDepartments] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());
  
  // Fetch tenders data
  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const response = await axios.get('/api/tenders');
        const data = response.data;
        setTenders(data);
        setFilteredTenders(data);
        
        // Extract unique departments and statuses for filters
        const uniqueDepartments = [...new Set(data.map((t: Tender) => t.department))];
        const uniqueStatuses = [...new Set(data.map((t: Tender) => t.status))];
        
        setDepartments(uniqueDepartments as string[]);
        setStatuses(uniqueStatuses as string[]);
        
        setIsConnected(true);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Error fetching tenders:', error);
        setIsConnected(false);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTenders();
    
    // Set up regular polling for updates
    const interval = setInterval(fetchTenders, 60000); // Poll every minute
    
    return () => clearInterval(interval);
  }, []);
  
  // Apply filters
  useEffect(() => {
    let filtered = [...tenders];
    
    if (filters.status) {
      filtered = filtered.filter(t => t.status === filters.status);
    }
    
    if (filters.department) {
      filtered = filtered.filter(t => t.department === filters.department);
    }
    
    if (filters.minValue) {
      filtered = filtered.filter(t => t.value >= (filters.minValue || 0));
    }
    
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(searchLower) || 
        t.department.toLowerCase().includes(searchLower) ||
        t.referenceNumber.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredTenders(filtered);
  }, [filters, tenders]);
  
  return (
    <div className="h-screen w-full relative bg-gradient-to-b from-[#1A2A44] to-[#0A1A34] overflow-hidden">
      {/* Header */}
      <div className="absolute top-4 left-4 z-10">
        <h1 className="font-cinzel text-3xl text-[#D4AF37] font-bold">Crystal Gallery</h1>
        <div className="flex items-center mt-2">
          <LiveIndicator isConnected={isConnected} lastUpdated={lastUpdated} />
          <span className="ml-4 text-white/60 text-sm font-montserrat">
            {filteredTenders.length} tenders displayed
          </span>
        </div>
      </div>
      
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-[#1A2A44]">
          <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Controls */}
      <FilterControls 
        filters={filters} 
        setFilters={setFilters} 
        departments={departments} 
        statuses={statuses} 
      />
      
      {/* View mode toggle */}
      <div className="absolute top-4 right-72 bg-[#1A2A44]/90 backdrop-blur-lg border border-[#D4AF37]/30 p-2 rounded-lg">
        <button className="bg-[#D4AF37] text-[#1A2A44] font-bold py-2 px-4 rounded mr-2">
          3D View
        </button>
        <button className="bg-transparent text-[#D4AF37] hover:bg-[#D4AF37]/10 font-bold py-2 px-4 rounded">
          Table View
        </button>
      </div>
      
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 15, 20], fov: 50 }}
        gl={{ antialias: true }}
        className="h-full w-full"
      >
        <Scene 
          tenders={filteredTenders} 
          selectedTender={selectedTender} 
          setSelectedTender={setSelectedTender} 
        />
        <OrbitControls 
          minPolarAngle={Math.PI / 6} 
          maxPolarAngle={Math.PI / 2.5} 
          enableZoom={true} 
          enablePan={true} 
        />
      </Canvas>
      
      {/* Selected tender detail */}
      <AnimatePresence>
        {selectedTender && (
          <TenderDetailCard 
            tender={selectedTender} 
            onClose={() => setSelectedTender(null)} 
          />
        )}
      </AnimatePresence>
      
      {/* Usage guide */}
      <div className="absolute bottom-4 right-4 p-4 bg-[#1A2A44]/80 backdrop-blur-sm border border-[#D4AF37]/30 rounded-lg text-white text-sm w-64">
        <h4 className="font-cinzel text-[#D4AF37] mb-2">Gallery Controls</h4>
        <ul className="space-y-1 text-white/80 font-montserrat text-xs">
          <li>• Click and drag to rotate view</li>
          <li>• Scroll to zoom in/out</li>
          <li>• Click a crystal to view details</li>
          <li>• Use filters to refine view</li>
        </ul>
      </div>
    </div>
  );
} 