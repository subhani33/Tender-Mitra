import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera,
  Text3D,
  Float,
  Sparkles,
  useTexture,
  Environment
} from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, FileText, Award, TrendingUp, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

// Building component that animates rising from the ground
const Building = ({ 
  position, 
  scale = [1, 1, 1], 
  color = '#2462cf', 
  height = 3,
  delay = 0,
  meshProps = {}
}) => {
  const meshRef = useRef();
  const [visible, setVisible] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const targetScale = useMemo(() => [scale[0], scale[1] * height, scale[2]], [scale, height]);
  
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);
  
  useFrame((state) => {
    if (!meshRef.current || !visible) return;
    
    // Get the current scale of the building
    const currentScaleY = meshRef.current.scale.y;
    
    // Animate the building rising
    if (currentScaleY < targetScale[1]) {
      meshRef.current.scale.y = THREE.MathUtils.lerp(
        currentScaleY,
        targetScale[1],
        0.05
      );
      
      // Update position to keep the building grounded
      meshRef.current.position.y = meshRef.current.scale.y / 2;
    } else if (!animationComplete) {
      setAnimationComplete(true);
    }
    
    // Add subtle movement
    if (animationComplete) {
      meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2 + position[0]) * 0.02;
    }
  });
  
  if (!visible) return null;
  
  return (
    <mesh
      ref={meshRef}
      position={[position[0], 0.5, position[2]]}
      scale={[targetScale[0], 0.1, targetScale[2]]}
      castShadow
      receiveShadow
      {...meshProps}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color={color} 
        metalness={0.6} 
        roughness={0.2}
      />
      
      {/* Windows */}
      {animationComplete && Array.from({ length: Math.floor(height) }).map((_, i) => (
        <mesh 
          key={i}
          position={[0, (i - height/2) + 1, 0.51]} 
          scale={[0.7, 0.3, 0.1]}
        >
          <boxGeometry />
          <meshStandardMaterial 
            color="#f0f8ff" 
            emissive="#80b3ff"
            emissiveIntensity={0.4 + Math.random() * 0.3}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}
    </mesh>
  );
};

// Tender document that floats and spins
const TenderDocument = ({ position, delay = 0 }) => {
  const meshRef = useRef();
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);
  
  useFrame((state) => {
    if (!meshRef.current || !visible) return;
    
    // Add floating and spinning animation
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.4;
    meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 0.8) * 0.2;
  });
  
  if (!visible) return null;
  
  return (
    <group ref={meshRef} position={position} scale={[0.5, 0.5, 0.5]}>
      {/* Document base */}
      <mesh castShadow>
        <boxGeometry args={[1, 1.4, 0.1]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      
      {/* Document lines */}
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[0, 0.4 - i * 0.2, 0.06]}>
          <boxGeometry args={[0.7, 0.03, 0.01]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      ))}
      
      {/* Seal */}
      <mesh position={[0, -0.4, 0.06]}>
        <cylinderGeometry args={[0.2, 0.2, 0.05, 32]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
};

// Gavel (auction hammer) component
const Gavel = ({ position, delay = 0 }) => {
  const headRef = useRef();
  const handleRef = useRef();
  const [visible, setVisible] = useState(false);
  const [swinging, setSwinging] = useState(false);
  const [swingDirection, setSwingDirection] = useState(1);
  const [lastSwing, setLastSwing] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);
  
  useFrame((state) => {
    if (!headRef.current || !handleRef.current || !visible) return;
    
    // Random swinging animation
    const time = state.clock.getElapsedTime();
    
    if (swinging) {
      // Animate the gavel swinging
      const swingProgress = (time - lastSwing) * 4; // Speed of swing
      if (swingProgress > 1) {
        setSwinging(false);
      } else {
        const swingAngle = Math.sin(swingProgress * Math.PI) * 0.8 * swingDirection;
        headRef.current.rotation.z = swingAngle;
        handleRef.current.rotation.z = swingAngle;
      }
    } else if (Math.random() < 0.005) { // 0.5% chance per frame to start swinging
      setSwinging(true);
      setLastSwing(time);
      setSwingDirection(Math.random() > 0.5 ? 1 : -1);
    }
    
    // Slow rotation
    headRef.current.rotation.y = time * 0.2;
    handleRef.current.rotation.y = time * 0.2;
  });
  
  if (!visible) return null;
  
  return (
    <group position={position}>
      {/* Gavel head */}
      <mesh ref={headRef} position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.4, 16]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </mesh>
      
      {/* Gavel handle */}
      <mesh ref={handleRef} position={[0, -0.2, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.8, 16]} />
        <meshStandardMaterial color="#A0522D" roughness={0.6} />
      </mesh>
    </group>
  );
};

// City scene with multiple buildings
const City = () => {
  // Define building positions and properties
  const buildings = [
    { position: [0, 0, 0], scale: [1, 1, 1], height: 5, color: '#1a56db', delay: 0 },
    { position: [2, 0, 1], scale: [0.8, 1, 0.8], height: 3, color: '#7e3af2', delay: 0.2 },
    { position: [-2, 0, 1], scale: [0.9, 1, 0.9], height: 4, color: '#047481', delay: 0.4 },
    { position: [1, 0, -2], scale: [0.7, 1, 0.7], height: 3.5, color: '#1e429f', delay: 0.6 },
    { position: [-1.5, 0, -1.8], scale: [0.8, 1, 0.8], height: 2.8, color: '#4c1d95', delay: 0.8 },
    { position: [3, 0, -1], scale: [0.6, 1, 0.6], height: 2, color: '#1e429f', delay: 1.0 },
    { position: [-3, 0, -1], scale: [0.7, 1, 0.7], height: 2.2, color: '#7e3af2', delay: 1.2 },
    { position: [0, 0, 3], scale: [1.2, 1, 1.2], height: 4.5, color: '#0e7490', delay: 1.4 },
  ];
  
  // Define tender documents
  const tenderDocuments = [
    { position: [1.5, 3, 1.5], delay: 2.0 },
    { position: [-1.5, 2.5, -1.5], delay: 2.3 },
    { position: [0, 4, 0], delay: 2.6 },
  ];
  
  // Define gavels
  const gavels = [
    { position: [2.5, 1.5, -2], delay: 3.0 },
    { position: [-2.5, 2, 2], delay: 3.3 },
  ];
  
  // Ground plane
  const groundTexture = useTexture('/textures/marble-dark.jpg');
  
  return (
    <>
      {/* Buildings */}
      {buildings.map((building, i) => (
        <Building key={i} {...building} />
      ))}
      
      {/* Tender Documents */}
      {tenderDocuments.map((doc, i) => (
        <TenderDocument key={i} {...doc} />
      ))}
      
      {/* Gavels */}
      {gavels.map((gavel, i) => (
        <Gavel key={i} {...gavel} />
      ))}
      
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial 
          map={groundTexture} 
          map-repeat={[10, 10]} 
          color="#0a122e" 
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>
      
      {/* Ambient particles */}
      <Sparkles 
        count={100}
        scale={10}
        size={0.6}
        speed={0.2}
        opacity={0.7}
        color="#ffffff"
      />
    </>
  );
};

// Feature card component
const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white/10 backdrop-filter backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-xl"
  >
    <div className="flex items-center mb-4">
      <div className="bg-blue-600 text-white p-2 rounded-lg mr-4">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
    </div>
    <p className="text-blue-100">{description}</p>
  </motion.div>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1128] via-[#1a2c5b] to-[#0a1128]">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* 3D Canvas */}
        <div className="absolute inset-0">
          <Canvas shadows camera={{ position: [0, 4, 10], fov: 45 }}>
            <fog attach="fog" args={['#0a1128', 8, 30]} />
            <ambientLight intensity={0.4} />
            <directionalLight 
              position={[5, 10, 5]} 
              intensity={1} 
              castShadow 
              shadow-mapSize={[2048, 2048]}
              shadow-camera-far={50}
              shadow-camera-left={-10}
              shadow-camera-right={10}
              shadow-camera-top={10}
              shadow-camera-bottom={-10}
            />
            <City />
            <Environment preset="city" />
            <OrbitControls 
              enableZoom={false} 
              enablePan={false}
              autoRotate
              autoRotateSpeed={0.5}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 2.5}
            />
          </Canvas>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            Tender <span className="text-blue-400">Opulence</span> Hub
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl mx-auto"
          >
            Elevate your government tender experience with our comprehensive platform designed for success
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/login')}
              className="bg-blue-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:bg-blue-700 transition-all"
            >
              Get Started
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/register')}
              className="bg-transparent border-2 border-blue-400 text-blue-100 font-bold py-4 px-8 rounded-full shadow-lg hover:bg-blue-500/10 transition-all"
            >
              Create Account
            </motion.button>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown size={32} />
          </motion.div>
        </motion.div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold text-center text-white mb-16"
        >
          Powerful Platform Features
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={FileText}
            title="Tender Tracking"
            description="Monitor and analyze government tenders in real-time with our comprehensive dashboard and filtering system."
          />
          
          <FeatureCard
            icon={Award}
            title="Bid Management"
            description="Create, manage, and submit winning bids with our intelligent tools and templates designed for success."
          />
          
          <FeatureCard
            icon={Building2}
            title="Interactive Visualizations"
            description="Experience data through immersive 3D visualizations that bring tender insights to life."
          />
          
          <FeatureCard
            icon={TrendingUp}
            title="Analytics & Reporting"
            description="Make data-driven decisions with powerful analytics, custom reports, and predictive insights."
          />
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-900 to-indigo-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-white mb-6"
          >
            Ready to Transform Your Tender Process?
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-blue-100 mb-10"
          >
            Join thousands of successful organizations leveraging our platform
          </motion.p>
          
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/register')}
            className="bg-white text-blue-900 font-bold py-4 px-12 rounded-full text-lg shadow-lg hover:bg-blue-50 transition-all"
          >
            Get Started Today
          </motion.button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage; 