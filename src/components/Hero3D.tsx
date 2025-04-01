import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  useGLTF, 
  Text, 
  Sparkles, 
  useTexture, 
  Float 
} from '@react-three/drei';
import { motion } from 'framer-motion';
import { Building2, Book, FileText, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

// Particles component for background effects
function Particles({ count = 2000 }) {
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return positions;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x = state.clock.getElapsedTime() * 0.05;
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.075;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#8ab4ff"
        sizeAttenuation
        transparent
        opacity={0.8}
      />
    </points>
  );
}

// Advanced building model with interactive elements
interface BuildingModelProps {
  setHoveredFeature: (feature: string | null) => void;
}

function BuildingModel({ setHoveredFeature }: BuildingModelProps) {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* Base Building */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 3, 2]} />
        <meshStandardMaterial 
          color="#0066cc" 
          metalness={0.7} 
          roughness={0.1} 
          envMapIntensity={1}
        />
      </mesh>

      {/* Top structure */}
      <mesh position={[0, 2, 0]} castShadow receiveShadow>
        <coneGeometry args={[1, 2, 4]} />
        <meshStandardMaterial 
          color="#003580" 
          metalness={0.8} 
          roughness={0.1}
          envMapIntensity={1}
        />
      </mesh>
      
      {/* Windows */}
      {[...Array(5)].map((_, i) => (
        <mesh 
          key={i} 
          position={[0.9, i * 0.5 + 0.3, 0]} 
          castShadow 
          receiveShadow
        >
          <boxGeometry args={[0.3, 0.3, 2.1]} />
          <meshStandardMaterial 
            color="#80ccff" 
            metalness={1} 
            roughness={0} 
            emissive="#4da6ff"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}

      {/* Feature hotspots */}
      <group>
        {/* Learning Hub Hotspot */}
        <mesh 
          position={[1.5, 1.5, 0]} 
          onPointerOver={() => setHoveredFeature('learning')}
          onPointerOut={() => setHoveredFeature(null)}
        >
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial 
            color="#00cc88" 
            emissive="#00cc88"
            emissiveIntensity={0.5}
            transparent
            opacity={0.8}
          />
        </mesh>
        
        {/* Tender Dashboard Hotspot */}
        <mesh 
          position={[-1.5, 1.0, 0.5]} 
          onPointerOver={() => setHoveredFeature('dashboard')}
          onPointerOut={() => setHoveredFeature(null)}
        >
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial 
            color="#ff6b6b" 
            emissive="#ff6b6b"
            emissiveIntensity={0.5}
            transparent
            opacity={0.8}
          />
        </mesh>
        
        {/* Bid Tools Hotspot */}
        <mesh 
          position={[0, 0.5, 1.5]} 
          onPointerOver={() => setHoveredFeature('bidding')}
          onPointerOut={() => setHoveredFeature(null)}
        >
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial 
            color="#ffcc00" 
            emissive="#ffcc00"
            emissiveIntensity={0.5}
            transparent
            opacity={0.8}
          />
        </mesh>
      </group>
      
      {/* Animated ring */}
      <Ring />
    </group>
  );
}

// Animated ring around building
function Ring() {
  const ring = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ring.current) {
      ring.current.rotation.z = state.clock.getElapsedTime() * 0.5;
      ring.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2;
    }
  });

  return (
    <mesh ref={ring} position={[0, 1.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[3, 0.05, 16, 100]} />
      <meshStandardMaterial 
        color="#4da6ff" 
        emissive="#4da6ff"
        emissiveIntensity={1}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
}

// Feature tooltip component
interface FeatureTooltipProps {
  feature: string | null;
}

interface FeatureInfo {
  title: string;
  description: string;
  icon: React.FC<any>;
}

function FeatureTooltip({ feature }: FeatureTooltipProps) {
  const featureInfo: Record<string, FeatureInfo> = {
    learning: {
      title: "Learning Hub",
      description: "Interactive courses, guides, and resources",
      icon: Book
    },
    dashboard: {
      title: "Tender Dashboard",
      description: "Track and analyze live tender data",
      icon: BarChart3
    },
    bidding: {
      title: "Bid Tools",
      description: "Create and manage winning tender submissions",
      icon: FileText
    }
  };
  
  if (!feature || !featureInfo[feature]) return null;
  
  const info = featureInfo[feature];
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute left-1/2 top-1/4 transform -translate-x-1/2 z-20 bg-white/10 backdrop-blur-lg rounded-lg p-4 text-white border border-white/20 shadow-xl"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-blue-500/30">
          <info.icon size={24} />
        </div>
        <div>
          <h3 className="font-bold text-lg">{info.title}</h3>
          <p className="text-sm text-blue-100">{info.description}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Hero3D() {
  const navigate = useNavigate();
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-violet-900">
      {/* Animated background blur circles */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <motion.div 
          className="absolute w-[500px] h-[500px] rounded-full bg-blue-500/30 blur-3xl"
          animate={{ 
            x: ['-20%', '60%', '-20%'],
            y: ['10%', '40%', '10%']
          }}
          transition={{ 
            duration: 20, 
            ease: "easeInOut", 
            repeat: Infinity,
          }}
        />
        <motion.div 
          className="absolute w-[400px] h-[400px] rounded-full bg-purple-500/20 blur-3xl"
          animate={{ 
            x: ['60%', '-30%', '60%'],
            y: ['0%', '50%', '0%']
          }}
          transition={{ 
            duration: 18, 
            ease: "easeInOut", 
            repeat: Infinity,
            delay: 2
          }}
        />
      </div>
      
      <div className="absolute inset-0">
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 12], fov: 50 }}>
          <color attach="background" args={['#03050a']} />
          <fog attach="fog" args={['#070b15', 5, 20]} />
          
          <PerspectiveCamera makeDefault position={[0, 1, 8]} />
          
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <pointLight position={[-10, 0, -20]} color="#4da6ff" intensity={2} />
          <pointLight position={[0, -10, 0]} color="#ff6b6b" intensity={1.5} />
          
          <Sparkles count={200} scale={10} size={2} speed={0.3} opacity={0.2} />
          <Particles count={500} />
          
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <BuildingModel setHoveredFeature={setHoveredFeature} />
          </Float>
          
          <OrbitControls
            enableZoom={false}
            autoRotate={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 1.8}
            minPolarAngle={Math.PI / 3}
          />
        </Canvas>
      </div>
      
      {/* Feature tooltip */}
      <FeatureTooltip feature={hoveredFeature} />
      
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="text-center text-white px-4 mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <Building2 size={40} className="text-blue-300" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">
              EdtoDo Technovations
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto text-blue-100"
          >
            Empowering your success in government tenders through innovation and expertise
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <motion.button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-full text-lg font-semibold 
                       hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-blue-500/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Enter Platform
            </motion.button>
            
            <motion.button
              onClick={() => navigate('/register')}
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-10 py-4 rounded-full text-lg font-semibold 
                       hover:bg-white/20 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Create Account
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}