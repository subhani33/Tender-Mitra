import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, useTexture, Sparkles } from '@react-three/drei';
import { motion } from 'framer-motion';
import axios from 'axios';

// Gold Vault Door component
const VaultDoor = ({ isOpen, setIsOpen }) => {
  const { nodes, materials } = useGLTF('/models/vault-door.glb');
  const doorRef = useRef();
  
  // Animation for door opening
  useFrame(() => {
    if (isOpen && doorRef.current.rotation.y < Math.PI / 2) {
      doorRef.current.rotation.y += 0.02;
    }
  });

  return (
    <group>
      <mesh
        ref={doorRef}
        geometry={nodes.vaultDoor.geometry}
        material={materials.gold}
        position={[0, 0, 0]}
        onClick={() => setIsOpen(true)}
      >
        <meshStandardMaterial
          color="#D4AF37"
          metalness={1}
          roughness={0.2}
          envMapIntensity={1}
        />
      </mesh>
      <mesh 
        geometry={nodes.vaultFrame.geometry}
        material={materials.metal}
        position={[0, 0, 0.2]}
      >
        <meshStandardMaterial
          color="#1A2A44"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
};

// Rotating Globe with Tender Markers
const TenderGlobe = ({ tenders, setSelectedTender }) => {
  const globeRef = useRef();
  const [hovered, setHovered] = useState(null);
  
  // Globe rotation
  useFrame(() => {
    globeRef.current.rotation.y += 0.002;
  });
  
  // Earth texture
  const earthTexture = useTexture('/textures/earth-blue-marble.jpg');
  
  return (
    <group>
      <mesh ref={globeRef} position={[0, 0, -5]}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial map={earthTexture} />
        
        {/* Tender Markers */}
        {tenders.map((tender, i) => {
          // Convert lat/long to 3D position (simplified)
          const lat = tender.lat || Math.random() * Math.PI - Math.PI/2;
          const long = tender.long || Math.random() * Math.PI * 2;
          const x = 2.1 * Math.cos(lat) * Math.sin(long);
          const y = 2.1 * Math.sin(lat);
          const z = 2.1 * Math.cos(lat) * Math.cos(long);
          
          return (
            <mesh
              key={i}
              position={[x, y, z]}
              onPointerOver={() => setHovered(i)}
              onPointerOut={() => setHovered(null)}
              onClick={() => setSelectedTender(tender)}
            >
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshStandardMaterial 
                color={hovered === i ? "#2E8B57" : "#D4AF37"} 
                emissive={hovered === i ? "#2E8B57" : "#D4AF37"}
                emissiveIntensity={hovered === i ? 2 : 1}
              />
            </mesh>
          );
        })}
      </mesh>
      
      {/* Gold particles */}
      <Sparkles 
        count={200}
        scale={10}
        size={0.6}
        speed={0.3}
        color="#D4AF37"
      />
    </group>
  );
};

// Scene setup with lighting
const Scene = ({ tenders, setSelectedTender }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.z = 5;
  }, [camera]);
  
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#D4AF37" />
      
      <VaultDoor isOpen={isOpen} setIsOpen={setIsOpen} />
      
      {isOpen && <TenderGlobe tenders={tenders} setSelectedTender={setSelectedTender} />}
    </>
  );
};

// Tender Info Card
const TenderCard = ({ tender, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                 bg-gradient-to-br from-[#1A2A44] to-[#0A1A34] p-6 rounded-lg
                 border border-[#D4AF37] shadow-2xl z-10 w-96 backdrop-blur-md"
    >
      <h3 className="font-cinzel text-[#D4AF37] text-xl mb-4 font-bold">{tender.title}</h3>
      
      <div className="space-y-3 text-gray-300 font-montserrat">
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
            'bg-gray-800 text-gray-300'
          }`}>
            {tender.status}
          </span>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <button 
          className="bg-[#D4AF37] hover:bg-[#B79020] text-[#1A2A44] font-bold py-2 px-4 rounded mr-2"
          onClick={() => window.location.href = '/dashboard'}
        >
          View Details
        </button>
        
        <button 
          className="bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10 font-bold py-2 px-4 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </motion.div>
  );
};

// Main component
export default function GoldenGateway() {
  const [tenders, setTenders] = useState([]);
  const [selectedTender, setSelectedTender] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch tender data
    const fetchTenders = async () => {
      try {
        const response = await axios.get('/api/tenders');
        setTenders(response.data.slice(0, 10)); // Limit to 10 tenders for performance
      } catch (error) {
        console.error('Error fetching tenders:', error);
        // Mock data for fallback
        setTenders([
          {
            id: '1',
            title: 'National Highway Development Project',
            department: 'Ministry of Road Transport',
            value: 125000000,
            deadline: '2024-07-15',
            status: 'Open',
            lat: 0.4,
            long: 1.2
          },
          {
            id: '2',
            title: 'Smart City Infrastructure Development',
            department: 'Ministry of Urban Development',
            value: 85000000,
            deadline: '2024-08-23',
            status: 'Open',
            lat: -0.2,
            long: -0.8
          },
          {
            id: '3',
            title: 'Railway Station Modernization',
            department: 'Ministry of Railways',
            value: 150000000,
            deadline: '2024-06-28',
            status: 'Closing Soon',
            lat: 0.7,
            long: 2.1
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTenders();
  }, []);
  
  return (
    <div className="h-screen w-full relative bg-[#1A2A44] overflow-hidden">
      {/* Loading screen */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-[#1A2A44]">
          <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* 3D Canvas */}
      <Canvas className="h-full w-full">
        <Scene tenders={tenders} setSelectedTender={setSelectedTender} />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
      
      {/* Overlay text */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="container mx-auto px-4 h-full flex flex-col justify-center">
          <motion.h1 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-5xl md:text-7xl font-cinzel font-bold text-[#D4AF37] mb-6 drop-shadow-lg"
          >
            Tender Opulence Hub
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-xl md:text-2xl font-montserrat text-white/80 max-w-2xl drop-shadow-lg"
          >
            Explore prestigious government tenders with unparalleled elegance and insight.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12"
          >
            <button className="bg-[#D4AF37] hover:bg-[#B79020] text-[#1A2A44] font-bold py-3 px-8 rounded-md font-montserrat shadow-lg pointer-events-auto">
              Enter the Vault
            </button>
          </motion.div>
        </div>
      </div>
      
      {/* Selected tender info card */}
      {selectedTender && (
        <TenderCard 
          tender={selectedTender} 
          onClose={() => setSelectedTender(null)} 
        />
      )}
    </div>
  );
} 