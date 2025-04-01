import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  useGLTF, 
  Html, 
  useTexture, 
  PerspectiveCamera,
  Text,
  RoundedBox
} from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Suspense } from 'react';

// Book categories
const CATEGORIES = [
  { id: 'basics', name: 'Tender Basics', color: '#D4AF37' },
  { id: 'advanced', name: 'Advanced Strategies', color: '#2E8B57' },
  { id: 'legal', name: 'Legal Framework', color: '#4169E1' },
  { id: 'documentation', name: 'Documentation', color: '#9932CC' },
  { id: 'negotiations', name: 'Negotiations', color: '#C04000' },
];

// Book data
const BOOKS = [
  {
    id: 'tender-101',
    title: 'Tender 101',
    category: 'basics',
    cover: '/textures/book-cover-gold.jpg',
    content: `
      <h1>Introduction to Government Tenders</h1>
      
      <p>Government tenders are invitations to bid for projects or to supply products and services. They are a significant source of business for companies across the globe, especially in sectors such as construction, healthcare, IT, and defense.</p>
      
      <h2>Key Concepts</h2>
      
      <ul>
        <li><strong>Request for Proposal (RFP):</strong> A document that solicits proposal, often made through a bidding process, by an agency or company interested in procurement of a commodity, service, or asset.</li>
        <li><strong>Bid/Tender:</strong> A formal offer to supply goods or services at a stated cost or rate.</li>
        <li><strong>EMD (Earnest Money Deposit):</strong> A security deposit that demonstrates the bidder's serious intention to proceed with the tender.</li>
        <li><strong>Prequalification:</strong> The process of screening potential bidders based on factors such as experience, financial capacity, and technical capability.</li>
      </ul>
      
      <h2>Types of Tenders</h2>
      
      <p>There are several types of tendering procedures, including:</p>
      
      <ul>
        <li><strong>Open Tender:</strong> Any supplier can submit a tender.</li>
        <li><strong>Selective Tender:</strong> Only pre-qualified suppliers are invited to submit a tender.</li>
        <li><strong>Negotiated Tender:</strong> The buyer negotiates with suppliers (often after an initial tender process) to improve commercial or technical aspects of their offer.</li>
        <li><strong>Single-Stage Tender:</strong> All tender information is submitted at once.</li>
        <li><strong>Two-Stage Tender:</strong> Technical proposals are evaluated first, followed by commercial proposals from technically qualified bidders.</li>
      </ul>
    `
  },
  {
    id: 'bid-strategies',
    title: 'Winning Bid Strategies',
    category: 'advanced',
    cover: '/textures/book-cover-emerald.jpg',
    content: `
      <h1>Advanced Bid Strategies for Success</h1>
      
      <p>Winning government tenders requires a strategic approach that goes beyond simply offering the lowest price. This guide outlines proven strategies to enhance your success rate.</p>
      
      <h2>Pre-Bid Intelligence Gathering</h2>
      
      <p>Before submitting a bid, gather as much information as possible:</p>
      
      <ul>
        <li>Research the contracting authority's previous purchases and contract awards</li>
        <li>Understand budget constraints and funding sources</li>
        <li>Identify key decision-makers and their priorities</li>
        <li>Analyze past winning bids if information is available</li>
        <li>Assess the competitive landscape</li>
      </ul>
      
      <h2>Optimizing Your Value Proposition</h2>
      
      <p>Government buyers consider value, not just price. Your bid should clearly demonstrate:</p>
      
      <ul>
        <li><strong>Total Cost of Ownership:</strong> Initial price plus ongoing costs</li>
        <li><strong>Risk Mitigation:</strong> How you reduce implementation and operational risks</li>
        <li><strong>Social Value:</strong> Economic, environmental and social benefits beyond the contract</li>
        <li><strong>Innovation:</strong> Novel approaches that improve outcomes</li>
        <li><strong>Compliance Plus:</strong> Exceeding minimum requirements in key areas</li>
      </ul>
      
      <h2>Consortium Building</h2>
      
      <p>For complex projects, consider forming a consortium to:</p>
      
      <ul>
        <li>Pool complementary capabilities and resources</li>
        <li>Share risk and enhance project credibility</li>
        <li>Present a more comprehensive solution</li>
      </ul>
    `
  },
  {
    id: 'legal-guide',
    title: 'Legal Framework',
    category: 'legal',
    cover: '/textures/book-cover-blue.jpg',
    content: `
      <h1>Understanding the Legal Framework of Tenders</h1>
      
      <p>Government procurement is governed by a complex legal framework designed to ensure fairness, transparency, and value for money. This guide covers the key legal aspects you need to understand.</p>
      
      <h2>Legislative Foundation</h2>
      
      <p>Most government procurement systems are based on:</p>
      
      <ul>
        <li><strong>Public Procurement Acts:</strong> Primary legislation setting out procurement principles</li>
        <li><strong>Rules & Regulations:</strong> Detailed procedures for different types of procurement</li>
        <li><strong>Financial Guidelines:</strong> Thresholds and approval processes</li>
        <li><strong>International Agreements:</strong> Treaties affecting procurement practices</li>
      </ul>
      
      <h2>Legal Principles in Procurement</h2>
      
      <ul>
        <li><strong>Transparency:</strong> Clear criteria and processes</li>
        <li><strong>Equal Treatment:</strong> No discrimination among bidders</li>
        <li><strong>Proportionality:</strong> Requirements proportionate to contract scope</li>
        <li><strong>Recognition:</strong> Accepting equivalent qualifications</li>
      </ul>
      
      <h2>Contract Terms and Conditions</h2>
      
      <p>Pay particular attention to:</p>
      
      <ul>
        <li>Payment terms and milestone definitions</li>
        <li>Performance metrics and penalties</li>
        <li>Intellectual property rights</li>
        <li>Liability and indemnification clauses</li>
        <li>Termination conditions</li>
      </ul>
      
      <h2>Dispute Resolution</h2>
      
      <p>Understand the mechanisms for addressing disputes:</p>
      
      <ul>
        <li>Bid protest procedures</li>
        <li>Administrative reviews</li>
        <li>Arbitration processes</li>
        <li>Judicial remedies</li>
      </ul>
    `
  },
  {
    id: 'document-preparation',
    title: 'Bid Documentation',
    category: 'documentation',
    cover: '/textures/book-cover-purple.jpg',
    content: `
      <h1>Mastering Tender Documentation</h1>
      
      <p>The quality of your tender documentation can make or break your bid. This guide will help you prepare comprehensive, compelling bid documents that stand out from the competition.</p>
      
      <h2>Essential Documents</h2>
      
      <p>A complete tender submission typically includes:</p>
      
      <ul>
        <li><strong>Technical Proposal:</strong> Your solution, methodology, and implementation plan</li>
        <li><strong>Financial Proposal:</strong> Pricing structure, payment schedules, and cost breakdowns</li>
        <li><strong>Company Profile:</strong> Your organization's capabilities, history, and structure</li>
        <li><strong>Compliance Documents:</strong> Certifications, licenses, tax clearances, etc.</li>
        <li><strong>References:</strong> Case studies and testimonials from similar projects</li>
      </ul>
      
      <h2>Document Preparation Best Practices</h2>
      
      <ol>
        <li>Create a compliance matrix mapping requirements to your responses</li>
        <li>Use visual elements (charts, diagrams) to simplify complex information</li>
        <li>Ensure consistent formatting, numbering, and terminology</li>
        <li>Include executive summaries for major sections</li>
        <li>Proofread thoroughly for errors and inconsistencies</li>
      </ol>
      
      <h2>Technical Proposal Tips</h2>
      
      <ul>
        <li>Clearly demonstrate understanding of requirements</li>
        <li>Highlight unique selling points and innovations</li>
        <li>Present a detailed, realistic implementation schedule</li>
        <li>Include risk management approaches</li>
        <li>Address sustainability and social responsibility</li>
      </ul>
      
      <h2>Financial Proposal Guidance</h2>
      
      <ul>
        <li>Provide transparent, detailed cost breakdowns</li>
        <li>Explain assumptions behind your pricing</li>
        <li>Include optional enhancements and their costs</li>
        <li>Propose payment schedules aligned with deliverables</li>
      </ul>
    `
  },
  {
    id: 'negotiation-tactics',
    title: 'Negotiation Tactics',
    category: 'negotiations',
    cover: '/textures/book-cover-copper.jpg',
    content: `
      <h1>Tender Negotiation Strategies</h1>
      
      <p>Many procurement processes include a negotiation phase where you can improve your position and secure more favorable terms. This guide covers effective negotiation strategies specifically for government contracts.</p>
      
      <h2>Preparation</h2>
      
      <p>Successful negotiation begins with thorough preparation:</p>
      
      <ul>
        <li>Know your walk-away position (BATNA - Best Alternative To a Negotiated Agreement)</li>
        <li>Understand the buyer's priorities, constraints, and alternatives</li>
        <li>Prepare multiple package options at different price points</li>
        <li>Identify areas where you have flexibility and those where you don't</li>
        <li>Quantify the value of your solution beyond price</li>
      </ul>
      
      <h2>Negotiation Tactics</h2>
      
      <ul>
        <li><strong>Bundling:</strong> Combine high-margin and low-margin elements</li>
        <li><strong>Phased Implementation:</strong> Propose staged approaches to manage risk</li>
        <li><strong>Value-Added Services:</strong> Offer additional services that cost you little but add significant value</li>
        <li><strong>Performance-Based Terms:</strong> Link payment to measurable outcomes</li>
      </ul>
      
      <h2>Handling Common Challenges</h2>
      
      <ul>
        <li><strong>Price Pressure:</strong> Focus on value, total cost of ownership, and risk reduction</li>
        <li><strong>Scope Creep:</strong> Define clear boundaries and change management processes</li>
        <li><strong>Unrealistic Timelines:</strong> Provide evidence-based alternatives</li>
        <li><strong>Excessive Risk Transfer:</strong> Propose balanced risk-sharing arrangements</li>
      </ul>
      
      <h2>Post-Negotiation</h2>
      
      <ul>
        <li>Document all agreements promptly and accurately</li>
        <li>Build implementation plans that reflect negotiated terms</li>
        <li>Establish performance monitoring mechanisms</li>
        <li>Maintain relationships for future opportunities</li>
      </ul>
    `
  },
];

// Single book component
const Book = ({ book, position, rotation, onClick, isHovered, setHovered }) => {
  const bookRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  
  // Get colors based on category
  const getBookColor = () => {
    const category = CATEGORIES.find(c => c.id === book.category);
    return category?.color || '#D4AF37';
  };
  
  // Book cover texture
  const coverTexture = useTexture(book.cover);
  
  // Animation for book
  useFrame((state) => {
    if (!bookRef.current) return;
    
    // Hover effect
    if (isHovered) {
      bookRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 2) * 0.05 + 0.1;
      if (materialRef.current) {
        materialRef.current.emissiveIntensity = 0.5 + Math.sin(state.clock.getElapsedTime() * 3) * 0.2;
      }
    } else {
      bookRef.current.position.y = position[1];
      if (materialRef.current) {
        materialRef.current.emissiveIntensity = 0;
      }
    }
  });
  
  return (
    <group 
      ref={bookRef} 
      position={position} 
      rotation={rotation}
      onClick={() => onClick(book)}
      onPointerOver={() => setHovered(book.id)}
      onPointerOut={() => setHovered(null)}
    >
      {/* Book body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.7, 0.1]} />
        <meshStandardMaterial 
          ref={materialRef}
          map={coverTexture}
          color={getBookColor()}
          metalness={0.3}
          roughness={0.7}
          emissive={getBookColor()}
          emissiveIntensity={isHovered ? 0.5 : 0}
        />
      </mesh>
      
      {/* Book spine */}
      <mesh position={[-0.25, 0, 0]} castShadow>
        <boxGeometry args={[0.05, 0.7, 0.1]} />
        <meshStandardMaterial 
          color={getBookColor()}
          metalness={0.5}
          roughness={0.6}
        />
      </mesh>
      
      {/* Book title */}
      <Text
        position={[0, 0, 0.06]}
        fontSize={0.05}
        maxWidth={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {book.title}
      </Text>
    </group>
  );
};

// Bookshelf component
const Bookshelf = ({ books, selectedBook, setSelectedBook }) => {
  const [hoveredBook, setHoveredBook] = useState(null);
  
  // Bookshelf texture
  const woodTexture = useTexture('/textures/velvet-texture.jpg');
  
  // Position books on the shelf
  const getBookPosition = (index: number, total: number): [number, number, number] => {
    const shelfWidth = 4.5;
    const spacing = shelfWidth / (total + 1);
    const x = index * spacing - shelfWidth / 2 + spacing;
    
    // Stagger heights slightly
    const y = 0.35 + (index % 2) * 0.05;
    
    return [x, y, 0];
  };
  
  // Calculate rotation for each book
  const getBookRotation = (index: number): [number, number, number] => {
    // Slight random variation in rotation
    const y = (Math.random() - 0.5) * 0.1;
    return [0, y, 0];
  };
  
  return (
    <group>
      {/* Bookshelf back panel */}
      <mesh position={[0, 0, -0.2]} receiveShadow>
        <boxGeometry args={[5, 2.2, 0.1]} />
        <meshStandardMaterial
          map={woodTexture}
          color="#3A1F04"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      
      {/* Bookshelf side panels */}
      <mesh position={[-2.5, 0, 0.2]} receiveShadow>
        <boxGeometry args={[0.1, 2.2, 0.8]} />
        <meshStandardMaterial
          map={woodTexture}
          color="#3A1F04"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      
      <mesh position={[2.5, 0, 0.2]} receiveShadow>
        <boxGeometry args={[0.1, 2.2, 0.8]} />
        <meshStandardMaterial
          map={woodTexture}
          color="#3A1F04"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      
      {/* Bookshelf shelves */}
      <mesh position={[0, -1.05, 0.2]} receiveShadow>
        <boxGeometry args={[5, 0.1, 0.8]} />
        <meshStandardMaterial
          map={woodTexture}
          color="#3A1F04"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      
      <mesh position={[0, 0, 0.2]} receiveShadow>
        <boxGeometry args={[5, 0.1, 0.8]} />
        <meshStandardMaterial
          map={woodTexture}
          color="#401F04"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      
      <mesh position={[0, 1.05, 0.2]} receiveShadow>
        <boxGeometry args={[5, 0.1, 0.8]} />
        <meshStandardMaterial
          map={woodTexture}
          color="#3A1F04"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      
      {/* Books - middle shelf */}
      {books.map((book, index) => (
        <Book
          key={book.id}
          book={book}
          position={getBookPosition(index, books.length - 1)}
          rotation={getBookRotation(index)}
          onClick={setSelectedBook}
          isHovered={hoveredBook === book.id}
          setHovered={setHoveredBook}
        />
      ))}
      
      {/* Decorative elements */}
      <mesh position={[-1.8, -0.7, 0.2]} rotation={[0, 0.2, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} />
      </mesh>
      
      <mesh position={[1.5, -0.7, 0.3]}>
        <cylinderGeometry args={[0.05, 0.05, 0.6, 16]} />
        <meshStandardMaterial color="#F2F2F2" />
      </mesh>
    </group>
  );
};

// Scroll component - displays when a book is selected
const Scroll = ({ book, onClose }) => {
  const scrollRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  
  // Animation for unfurling scroll
  useFrame((state) => {
    if (!scrollRef.current) return;
    
    // Gentle floating motion
    scrollRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05;
    scrollRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.05;
  });
  
  // Scroll texture
  const paperTexture = useTexture('/textures/parchment.jpg');
  
  return (
    <group 
      ref={scrollRef} 
      position={[0, 0, 2]}
      scale={[viewport.width / 5, viewport.height / 5, 1]}
    >
      {/* Scroll background */}
      <mesh>
        <planeGeometry args={[1.6, 2]} />
        <meshStandardMaterial
          map={paperTexture}
          color="#F5F5DC"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      
      {/* Close button */}
      <group position={[0.7, 0.9, 0.1]} onClick={onClose}>
        <mesh>
          <circleGeometry args={[0.08, 16]} />
          <meshStandardMaterial color="#D4AF37" />
        </mesh>
        <Text position={[0, 0, 0.01]} fontSize={0.1} color="#1A2A44">
          X
        </Text>
      </group>
      
      {/* Scroll content */}
      <Html
        transform
        position={[0, 0, 0.1]}
        className="w-[500px] h-[600px] overflow-auto"
        style={{
          backgroundColor: 'transparent',
          padding: '20px',
          color: '#1A2A44',
          fontFamily: 'Montserrat, sans-serif',
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: book.content }} />
      </Html>
    </group>
  );
};

// Main scene
const LibraryScene = ({ selectedBook, setSelectedBook }) => {
  const { camera } = useThree();
  
  // Reset camera when book is selected/deselected
  useEffect(() => {
    if (selectedBook) {
      camera.position.z = 5;
    } else {
      camera.position.z = 4;
    }
  }, [selectedBook, camera]);
  
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
      <pointLight position={[-5, 5, 5]} intensity={0.5} color="#D4AF37" />
      
      <fog attach="fog" args={['#1A2A44', 10, 20]} />
      
      {/* Library environment */}
      <Bookshelf 
        books={BOOKS} 
        selectedBook={selectedBook} 
        setSelectedBook={setSelectedBook} 
      />
      
      {/* Selected book scroll */}
      {selectedBook && (
        <Scroll book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </>
  );
};

// Button component for category filtering
interface CategoryButtonProps {
  category: { id: string; name: string; color: string };
  isActive: boolean;
  onClick: () => void;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({ category, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-montserrat transition-all duration-300 mr-2 mb-2
        ${isActive 
          ? `bg-[${category.color}] text-[#1A2A44] shadow-lg` 
          : `bg-[#1A2A44]/50 text-[${category.color}] border border-[${category.color}]/30`}`
      }
      style={{ 
        backgroundColor: isActive ? category.color : 'rgba(26, 42, 68, 0.5)',
        color: isActive ? '#1A2A44' : category.color,
        borderColor: isActive ? 'transparent' : `${category.color}30`
      }}
    >
      {category.name}
    </button>
  );
};

// Main component
export default function VelvetLibrary() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredBooks, setFilteredBooks] = useState(BOOKS);
  
  // Filter books by category
  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredBooks(BOOKS);
    } else {
      setFilteredBooks(BOOKS.filter(book => book.category === activeCategory));
    }
  }, [activeCategory]);
  
  return (
    <div className="relative h-screen w-full bg-gradient-to-b from-[#1A2A44] to-[#0A1A34] overflow-hidden">
      {/* Header */}
      <div className="absolute top-8 left-8 z-10">
        <h1 className="font-cinzel text-4xl text-[#D4AF37] font-bold">Velvet Library</h1>
        <p className="font-montserrat text-white/70 mt-2 max-w-lg">
          Explore our curated collection of tender knowledge. Click on a book to dive deeper.
        </p>
      </div>
      
      {/* Category filters */}
      <div className="absolute top-28 left-8 z-10 flex flex-wrap max-w-2xl">
        <CategoryButton
          category={{ id: 'all', name: 'All Topics', color: '#D4AF37' }}
          isActive={activeCategory === 'all'}
          onClick={() => setActiveCategory('all')}
        />
        
        {CATEGORIES.map(category => (
          <CategoryButton
            key={category.id}
            category={category}
            isActive={activeCategory === category.id}
            onClick={() => setActiveCategory(category.id)}
          />
        ))}
      </div>
      
      {/* 3D Canvas */}
      <Canvas shadows camera={{ position: [0, 0, 4], fov: 50 }}>
        <Suspense fallback={null}>
          <LibraryScene 
            selectedBook={selectedBook} 
            setSelectedBook={setSelectedBook} 
          />
        </Suspense>
        <OrbitControls 
          enableZoom={true} 
          enablePan={false} 
          enableRotate={!selectedBook}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
        />
      </Canvas>
      
      {/* Mobile notice */}
      <div className="absolute bottom-4 right-4 p-4 bg-[#1A2A44]/80 backdrop-blur-sm border border-[#D4AF37]/30 rounded-lg text-white text-sm w-64 md:hidden">
        <h4 className="font-cinzel text-[#D4AF37] mb-2">Best Experience</h4>
        <p className="text-white/80 font-montserrat text-xs">
          For the optimal Velvet Library experience, please visit on a desktop device.
        </p>
      </div>
      
      {/* Instruction panel */}
      {!selectedBook && (
        <div className="absolute bottom-8 left-8 p-6 bg-[#1A2A44]/80 backdrop-blur-md border border-[#D4AF37]/30 rounded-lg text-white max-w-sm">
          <h3 className="font-cinzel text-[#D4AF37] text-xl mb-3">How to Use the Library</h3>
          <ul className="space-y-2 text-white/80 font-montserrat text-sm">
            <li>• Hover over books to highlight them</li>
            <li>• Click a book to open and read its contents</li>
            <li>• Use the category filters to find specific topics</li>
            <li>• Rotate the view to see all available books</li>
          </ul>
        </div>
      )}
    </div>
  );
} 