import { ArrowUpRight, DollarSign, Clock, CheckCircle, XCircle, BarChart3, Globe } from 'lucide-react';
import { useTenderStore, Tender } from '../../store/tenderStore';
import { useEffect, useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// 3D Globe visualization for tenders
function TenderGlobe({ size = 1.5, distort = 0.3, speed = 0.2 }) {
  const sphere = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);
  
  useFrame(({ clock }) => {
    if (sphere.current) {
      sphere.current.rotation.z = clock.getElapsedTime() * speed * 0.5;
      sphere.current.rotation.y = clock.getElapsedTime() * speed;
    }
    
    if (light.current) {
      light.current.position.x = Math.sin(clock.getElapsedTime() * 0.8) * 3;
      light.current.position.y = Math.cos(clock.getElapsedTime() * 0.8) * 3;
    }
  });

  return (
    <>
      <pointLight ref={light} distance={6} intensity={1} color="#5f86f2" />
      <spotLight position={[-4, 4, -4]} angle={0.2} penumbra={1} intensity={0.8} castShadow />
      <mesh ref={sphere} castShadow receiveShadow scale={[size, size, size]}>
        <sphereGeometry args={[1, 48, 48]} />
        <MeshDistortMaterial
          color="#0062ff"
          envMapIntensity={0.4}
          clearcoat={0.8}
          clearcoatRoughness={0}
          metalness={0.2}
          roughness={0.4}
          distort={distort}
          speed={speed * 2}
        />
      </mesh>
      <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 2.2} maxPolarAngle={Math.PI / 2.2} />
    </>
  );
}

// Enhanced 3D stat card with animations
interface StatCardProps {
  title: string;
  value: string | number;
  rawValue?: number;
  icon: React.ReactNode;
  trend?: number;
  color: string;
  gradientFrom: string;
  gradientTo: string;
}

const StatCard = ({ 
  title, 
  value, 
  rawValue, 
  icon, 
  trend, 
  color, 
  gradientFrom, 
  gradientTo 
}: StatCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      className={`relative overflow-hidden bg-white rounded-xl shadow-lg p-6 flex flex-col
                  border border-transparent transition-all duration-300 ${isHovered ? 'shadow-xl translate-y-[-5px] border-gray-200' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div 
        className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-${gradientFrom} to-${gradientTo}`}
      ></div>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${color} transform transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
          {icon}
        </div>
        {trend !== undefined && (
          <div className="flex items-center text-sm">
            <motion.div
              animate={{ rotate: trend >= 0 ? 0 : 180 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              <ArrowUpRight 
                className={trend >= 0 ? "text-green-500" : "text-red-500"} 
                size={16} 
              />
            </motion.div>
            <span className={trend >= 0 ? "text-green-500" : "text-red-500"}>
              {Math.abs(trend)}%
            </span>
          </div>
        )}
      </div>
      
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <p className="text-2xl font-bold mt-1">{value}</p>
      </motion.div>
      
      {rawValue && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <motion.div 
              className={`h-1.5 rounded-full bg-gradient-to-r from-${gradientFrom} to-${gradientTo}`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(rawValue / 1000000 * 5, 100)}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

// 3D Chart for department distribution
function DepartmentChart({ departmentData }: { departmentData: {name: string, count: number}[] }) {
  const maxCount = Math.max(...departmentData.map(d => d.count));
  
  return (
    <div className="mt-8 bg-white rounded-xl shadow-lg p-6 overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Department Distribution</h3>
        <div className="flex items-center text-sm text-blue-600">
          <Globe size={16} className="mr-1" />
          <span>View global map</span>
        </div>
      </div>
      
      <div className="relative h-[300px] mb-6">
        <Canvas dpr={[1, 2]}>
          <ambientLight intensity={0.2} />
          <directionalLight intensity={0.5} position={[10, 10, 10]} />
          
          {departmentData.map((dept, i) => (
            <group key={dept.name} position={[i * 2 - (departmentData.length - 1), 0, 0]}>
              <mesh position={[0, (dept.count / maxCount) * 2 / 2, 0]} castShadow>
                <boxGeometry args={[1, (dept.count / maxCount) * 2, 1]} />
                <meshStandardMaterial 
                  color={`hsl(${210 + i * 30}, 80%, 60%)`} 
                  metalness={0.5} 
                  roughness={0.2}
                />
              </mesh>
              <Text
                position={[0, -1, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={0.3}
                color="#666"
                maxWidth={2}
                textAlign="center"
              >
                {dept.name}
              </Text>
              <Text
                position={[0, (dept.count / maxCount) * 2 + 0.5, 0]}
                fontSize={0.4}
                color="#333"
              >
                {dept.count}
              </Text>
            </group>
          ))}
          
          <OrbitControls 
            enablePan={false} 
            enableZoom={false} 
            minPolarAngle={Math.PI / 4} 
            maxPolarAngle={Math.PI / 2.5}
            rotateSpeed={0.5}
          />
        </Canvas>
      </div>
      
      <div className="space-y-4 mt-4">
        {departmentData.map((dept, index) => (
          <div key={dept.name} className="flex flex-col">
            <div className="flex justify-between mb-1">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: `hsl(${210 + index * 30}, 80%, 60%)` }}
                ></div>
                <span className="text-sm text-gray-700 font-medium">{dept.name}</span>
              </div>
              <span className="text-sm font-medium">{dept.count} tenders</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <motion.div 
                className="h-2 rounded-full" 
                style={{ 
                  backgroundColor: `hsl(${210 + index * 30}, 80%, 60%)`,
                  width: `${(dept.count / maxCount) * 100}%` 
                }}
                initial={{ width: 0 }}
                animate={{ width: `${(dept.count / maxCount) * 100}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main TenderStats component
export default function TenderStats() {
  const { tenders, fetchTenders, isLoading } = useTenderStore();
  const [activeView, setActiveView] = useState<'stats' | 'globe'>('stats');
  
  useEffect(() => {
    fetchTenders();
  }, [fetchTenders]);
  
  const stats = useMemo(() => {
    if (!tenders.length) return null;
    
    // Calculate stats
    const totalValue = tenders.reduce((sum, tender) => sum + tender.value, 0);
    const openTenders = tenders.filter(tender => tender.status === 'Open').length;
    const closingSoon = tenders.filter(tender => {
      const deadline = new Date(tender.deadline);
      const now = new Date();
      const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays <= 7 && tender.status === 'Open';
    }).length;
    
    // Calculate department distribution for chart
    const departments: Record<string, number> = {};
    tenders.forEach(tender => {
      departments[tender.department] = (departments[tender.department] || 0) + 1;
    });
    
    return {
      totalValue,
      formattedValue: new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(totalValue),
      openTenders,
      closingSoon,
      successRate: 78,
      departmentData: Object.entries(departments)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5) // Top 5 departments
    };
  }, [tenders]);
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg p-6 h-32 animate-pulse">
            <div className="bg-gray-200 h-4 w-1/3 rounded mb-4"></div>
            <div className="bg-gray-200 h-6 w-1/2 rounded"></div>
          </div>
        ))}
      </div>
    );
  }
  
  if (!stats) return null;

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <motion.h2 
          className="text-2xl font-bold text-gray-800"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Dashboard Overview
        </motion.h2>
        
        <div className="bg-white p-1 rounded-lg shadow-sm flex">
          <button 
            className={`px-4 py-2 text-sm font-medium rounded-md transition
                      ${activeView === 'stats' 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setActiveView('stats')}
          >
            Statistics
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium rounded-md ml-1 transition
                      ${activeView === 'globe' 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setActiveView('globe')}
          >
            Global View
          </button>
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        {activeView === 'stats' ? (
          <motion.div 
            key="stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Total Tender Value"
                value={stats.formattedValue}
                rawValue={stats.totalValue}
                icon={<DollarSign className="text-green-600" size={24} />}
                trend={5.2}
                color="bg-green-50"
                gradientFrom="green-400"
                gradientTo="emerald-500"
              />
              <StatCard 
                title="Open Tenders"
                value={stats.openTenders}
                rawValue={(stats.openTenders / tenders.length) * 1000000}
                icon={<CheckCircle className="text-blue-600" size={24} />}
                trend={2.1}
                color="bg-blue-50"
                gradientFrom="blue-400"
                gradientTo="indigo-500"
              />
              <StatCard 
                title="Closing Soon"
                value={stats.closingSoon}
                rawValue={(stats.closingSoon / tenders.length) * 1000000}
                icon={<Clock className="text-amber-600" size={24} />}
                color="bg-amber-50"
                gradientFrom="amber-400"
                gradientTo="orange-500"
              />
              <StatCard 
                title="Success Rate"
                value={`${stats.successRate}%`}
                rawValue={(stats.successRate / 100) * 1000000}
                icon={<BarChart3 className="text-purple-600" size={24} />}
                trend={-1.5}
                color="bg-purple-50"
                gradientFrom="purple-400"
                gradientTo="pink-500"
              />
            </div>

            <DepartmentChart departmentData={stats.departmentData} />
          </motion.div>
        ) : (
          <motion.div 
            key="globe"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 overflow-hidden"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Global Tender Distribution</h3>
            <div className="h-[500px] w-full">
              <Canvas dpr={[1, 2]}>
                <ambientLight intensity={0.4} />
                <TenderGlobe />
              </Canvas>
            </div>
            <div className="flex justify-center mt-4">
              <div className="text-center max-w-md">
                <h4 className="font-medium text-gray-800">Interactive Globe</h4>
                <p className="text-gray-600 text-sm mt-1">
                  This 3D visualization shows the global distribution of active tenders.
                  Rotate and interact with the globe to explore different regions.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 