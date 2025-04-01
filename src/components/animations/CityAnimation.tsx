import { useEffect, useRef, useState, memo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface CityAnimationProps {
  className?: string;
  quality?: 'low' | 'medium' | 'high';
}

const CityAnimation: React.FC<CityAnimationProps> = memo(({ className = '', quality = 'medium' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const buildingsRef = useRef<THREE.Mesh[]>([]);
  const cloudsRef = useRef<THREE.Group[]>([]);
  const tenderDocsRef = useRef<THREE.Mesh[]>([]);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Increased animation speed
  const ANIMATION_SPEED = 1.5;

  // Performance settings based on quality - optimized for faster loading
  const getQualitySettings = () => {
    switch(quality) {
      case 'low':
        return {
          pixelRatio: 0.8,
          shadowMapSize: 512,
          cloudDetail: 4,
          buildingCount: 20,
          antialiasing: false
        };
      case 'high':
        return {
          pixelRatio: Math.min(window.devicePixelRatio, 1.8),
          shadowMapSize: 1024,
          cloudDetail: 8,
          buildingCount: 50,
          antialiasing: true
        };
      case 'medium':
      default:
        return {
          pixelRatio: Math.min(window.devicePixelRatio, 1.2),
          shadowMapSize: 512,
          cloudDetail: 6,
          buildingCount: 30,
          antialiasing: window.devicePixelRatio < 2
        };
    }
  };

  useEffect(() => {
    if (!mountRef.current) return;
    
    const qualitySettings = getQualitySettings();
    const textureLoader = new THREE.TextureLoader();
    
    // Optimized: Load only the necessary textures
    const marbleTexture = textureLoader.load('/textures/marble.jpg');
    const concreteTexture = textureLoader.load('/textures/concrete.jpg');
    
    // Initialize scene immediately without waiting for textures
    const scene = new THREE.Scene();
    
    // Set a blue sky background with gradient
    const topColor = new THREE.Color(0x0077ff); // Deep blue at top
    const bottomColor = new THREE.Color(0x87ceeb); // Light blue at horizon
    scene.background = bottomColor;
    
    // Add subtle fog for atmospheric perspective
    scene.fog = new THREE.FogExp2(0x87ceeb, 0.006);
    sceneRef.current = scene;

    // Create camera with optimized initial position
    const camera = new THREE.PerspectiveCamera(
      70, 
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(20, 15, 20);
    cameraRef.current = camera;

    // Create renderer with optimized settings
    const renderer = new THREE.WebGLRenderer({ 
      antialias: qualitySettings.antialiasing,
      powerPreference: 'high-performance',
      stencil: false,
      alpha: true
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(qualitySettings.pixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap; // Faster shadow type
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3; // Slightly increased exposure
    
    // Append to DOM
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create simple sky with gradient - optimized
    const createSky = () => {
      // Create a large sphere for the sky
      const skyGeometry = new THREE.SphereGeometry(400, 16, 8); // Reduced geometry complexity
      // Flip the geometry inside out
      skyGeometry.scale(-1, 1, 1);
      
      // Create a shader for the sky gradient
      const vertexShader = `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `;
      
      const fragmentShader = `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition + offset).y;
          gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
        }
      `;
      
      const uniforms = {
        topColor: { value: topColor },
        bottomColor: { value: bottomColor },
        offset: { value: 10 },
        exponent: { value: 0.6 }
      };
      
      const skyMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.BackSide
      });
      
      const sky = new THREE.Mesh(skyGeometry, skyMaterial);
      scene.add(sky);
      
      // Add sun with glow effect
      const sunGeometry = new THREE.SphereGeometry(15, 16, 16); // Reduced complexity
      const sunMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffdd,
        transparent: true,
        opacity: 0.9
      });
      const sun = new THREE.Mesh(sunGeometry, sunMaterial);
      sun.position.set(80, 100, -50);
      scene.add(sun);
      
      // Enhanced sun glow/corona effect
      const sunGlowGeometry = new THREE.SphereGeometry(25, 16, 16);
      const sunGlowMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffaa,
        transparent: true,
        opacity: 0.4,
        side: THREE.BackSide
      });
      const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
      sun.add(sunGlow);
      
      // Add a larger outer glow
      const outerGlowGeometry = new THREE.SphereGeometry(40, 16, 16);
      const outerGlowMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffcc,
        transparent: true,
        opacity: 0.2,
        side: THREE.BackSide
      });
      const outerGlow = new THREE.Mesh(outerGlowGeometry, outerGlowMaterial);
      sun.add(outerGlow);
    };
    
    createSky();

    // Add Sun light
    const sunLight = new THREE.DirectionalLight(0xffffcc, 1.8); // Increased intensity
    sunLight.position.set(50, 100, -30);
    sunLight.castShadow = true;
    
    // Shadow settings - optimized
    sunLight.shadow.mapSize.width = qualitySettings.shadowMapSize;
    sunLight.shadow.mapSize.height = qualitySettings.shadowMapSize;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 200;
    sunLight.shadow.camera.left = -50;
    sunLight.shadow.camera.right = 50;
    sunLight.shadow.camera.top = 50;
    sunLight.shadow.camera.bottom = -50;
    sunLight.shadow.bias = -0.0005;
    sunLight.shadow.normalBias = 0.02;
    
    scene.add(sunLight);

    // Add ambient and hemisphere lights
    const ambientLight = new THREE.AmbientLight(0x90a0ff, 0.6);
    scene.add(ambientLight);

    const hemisphereLight = new THREE.HemisphereLight(0x8fbcff, 0x594321, 0.8);
    scene.add(hemisphereLight);

    // Create ground immediately
    const groundGeometry = new THREE.PlaneGeometry(200, 200, 1, 1); // Simplified geometry
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x225588,
      roughness: 0.8,
      metalness: 0.2
    });
    
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.5;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Apply texture once loaded
    concreteTexture.onload = () => {
      groundMaterial.map = concreteTexture;
      groundMaterial.map.repeat.set(10, 10);
      groundMaterial.needsUpdate = true;
    };
    
    // Create cityscape with buildings
    const createCityscape = () => {
      // Create a cityscape with buildings
      const gridSize = 7;
      const spacing = 8;
      
      // Add government buildings with glow in the center
      createBuilding(0, 0, 12, 6, 6, true); // Central government building
      
      // Create surrounding buildings
      for (let i = -gridSize; i <= gridSize; i++) {
        for (let j = -gridSize; j <= gridSize; j++) {
          // Skip the center where government building is
          if (i === 0 && j === 0) continue;
          
          // Skip some positions randomly for variation
          if (Math.random() < 0.7) {
            const distance = Math.sqrt(i * i + j * j);
            
            // Skip if too far away (outside city limits)
            if (distance > gridSize) continue;
            
            const height = Math.random() * 6 + 4; // Random height between 4-10
            const width = Math.random() * 2 + 2;  // Random width between 2-4
            const depth = Math.random() * 2 + 2;  // Random depth between 2-4
            
            // Determine if it's a government building (gold)
            const isGovernment = Math.random() < 0.15;
            
            createBuilding(
              i * spacing + Math.random() * 2 - 1, // Add slight position variation
              j * spacing + Math.random() * 2 - 1,
              height,
              width,
              depth,
              isGovernment
            );
          }
        }
      }
      
      // Add floating tender documents with glow
      for (let i = 0; i < 12; i++) {
        const x = Math.random() * 80 - 40;
        const y = Math.random() * 10 + 15;
        const z = Math.random() * 80 - 40;
        
        createFloatingDocument(x, y, z);
      }
      
      // Add clouds with glow
      for (let i = 0; i < 8; i++) {
        const x = Math.random() * 160 - 80;
        const y = Math.random() * 20 + 35;
        const z = Math.random() * 160 - 80;
        
        createCloud(x, y, z);
      }
    };
    
    // Create a building with optional glow effect
    const createBuilding = (
      x: number, 
      z: number, 
      height: number, 
      width: number,
      depth: number,
      isGovernment: boolean
    ) => {
      const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
      
      // Different materials for government and regular buildings
      let buildingMaterial;
      
      if (isGovernment) {
        // Gold material for government buildings
        buildingMaterial = new THREE.MeshStandardMaterial({
          color: 0xD4AF37,
          roughness: 0.4,
          metalness: 0.8,
          emissive: 0x997722, // Add emissive for subtle glow
          emissiveIntensity: 0.15
        });
      } else {
        // Regular buildings with glass facade
        buildingMaterial = new THREE.MeshStandardMaterial({
          color: 0x8899aa,
          roughness: 0.3,
          metalness: 0.7,
          opacity: 0.9,
          transparent: true
        });
      }
      
      const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
      building.position.set(x, height / 2, z);
      building.castShadow = true;
      building.receiveShadow = true;
      scene.add(building);
      buildingsRef.current.push(building);
      
      // Add windows
      const addWindows = () => {
        // Window pattern for the building
        const windowGeometry = new THREE.PlaneGeometry(0.4, 0.6);
        const windowMaterial = new THREE.MeshStandardMaterial({
          color: 0xffffee,
          emissive: 0xffffee,
          emissiveIntensity: 0.5,
          transparent: true,
          opacity: 0.9
        });
        
        // Calculate how many windows per side
        const windowsPerFloor = Math.max(1, Math.floor(width / 1.2));
        const floorsCount = Math.max(1, Math.floor(height / 1.2));
        
        // Add windows to each side
        for (let side = 0; side < 4; side++) {
          for (let floor = 0; floor < floorsCount; floor++) {
            for (let w = 0; w < windowsPerFloor; w++) {
              const window = new THREE.Mesh(windowGeometry, windowMaterial);
              
              // Position window based on side
              let wx = 0, wz = 0;
              const wy = floor * 1.2 + 0.8; // Window vertical position
              const windowSpacing = width / (windowsPerFloor + 1);
              const windowPos = (w + 1) * windowSpacing - width / 2;
              
              switch (side) {
                case 0: // Front
                  wx = windowPos;
                  wz = depth / 2 + 0.01;
                  window.rotation.y = Math.PI;
                  break;
                case 1: // Right
                  wx = width / 2 + 0.01;
                  wz = windowPos;
                  window.rotation.y = -Math.PI / 2;
                  break;
                case 2: // Back
                  wx = windowPos;
                  wz = -depth / 2 - 0.01;
                  break;
                case 3: // Left
                  wx = -width / 2 - 0.01;
                  wz = windowPos;
                  window.rotation.y = Math.PI / 2;
                  break;
              }
              
              window.position.set(wx, wy, wz);
              building.add(window);
            }
          }
        }
      };
      
      addWindows();
      
      // Add glow effect for government buildings
      if (isGovernment) {
        // Add subtle golden glow around government buildings
        const glowGeometry = new THREE.BoxGeometry(width + 0.5, height + 0.5, depth + 0.5);
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: 0xffdd77,
          transparent: true,
          opacity: 0.15,
          side: THREE.BackSide
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        building.add(glow);
      }
      
      return building;
    };
    
    // Create a floating tender document with glow
    const createFloatingDocument = (x: number, y: number, z: number) => {
      const docGeometry = new THREE.PlaneGeometry(2, 3);
      const docMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.2,
        metalness: 0.1,
        emissive: 0xffffee,
        emissiveIntensity: 0.2,
        side: THREE.DoubleSide
      });
      
      const doc = new THREE.Mesh(docGeometry, docMaterial);
      doc.position.set(x, y, z);
      doc.rotation.set(
        Math.random() * Math.PI / 4 - Math.PI / 8,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI / 4 - Math.PI / 8
      );
      doc.castShadow = true;
      
      // Add a glow effect
      const glowGeometry = new THREE.PlaneGeometry(2.5, 3.5);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xd4af37, // Gold glow
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide
      });
      
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      doc.add(glow);
      
      scene.add(doc);
      tenderDocsRef.current.push(doc);
      
      return doc;
    };
    
    // Create a cloud with glowing edges
    const createCloud = (x: number, y: number, z: number) => {
      const cloudGroup = new THREE.Group();
      cloudGroup.position.set(x, y, z);
      
      // Create cloud puffs
      const puffsCount = qualitySettings.cloudDetail;
      
      for (let i = 0; i < puffsCount; i++) {
        const puffSize = Math.random() * 3 + 2;
        const puffGeometry = new THREE.SphereGeometry(puffSize, 8, 8);
        const puffMaterial = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.85,
          emissive: 0xffffff,
          emissiveIntensity: 0.1
        });
        
        const puff = new THREE.Mesh(puffGeometry, puffMaterial);
        
        // Random position within cloud
        puff.position.set(
          Math.random() * 8 - 4,
          Math.random() * 2 - 1,
          Math.random() * 8 - 4
        );
        
        cloudGroup.add(puff);
      }
      
      // Add subtle glow to the cloud
      const cloudSize = 10;
      const glowGeometry = new THREE.SphereGeometry(cloudSize, 8, 8);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.2,
        side: THREE.BackSide
      });
      
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      cloudGroup.add(glow);
      
      scene.add(cloudGroup);
      cloudsRef.current.push(cloudGroup);
      
      return cloudGroup;
    };
    
    // Create city immediately
    createCityscape();
    
    // Set up controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.rotateSpeed = 0.5;
    controls.minDistance = 10;
    controls.maxDistance = 100;
    controls.maxPolarAngle = Math.PI / 2 - 0.1;
    controls.target.set(0, 5, 0);
    controls.update();
    controlsRef.current = controls;
    
    // Animation loop with enhanced effects
    const animate = () => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current || !controlsRef.current) {
        return;
      }
      
      const delta = clockRef.current.getDelta() * ANIMATION_SPEED;
      
      // Update controls
      controlsRef.current.update();
      
      // Animate buildings - subtle breathing effect
      buildingsRef.current.forEach((building, i) => {
        const time = Date.now() * 0.001;
        const breathingScale = 1 + Math.sin(time + i * 0.5) * 0.01;
        
        // Check if it's a government building (gold color)
        const isGovernment = (building.material as THREE.MeshStandardMaterial).color.r > 0.8;
        
        if (isGovernment) {
          // Pulse glow for government buildings
          const emissiveIntensity = 0.1 + Math.sin(time * 2 + i) * 0.05;
          (building.material as THREE.MeshStandardMaterial).emissiveIntensity = emissiveIntensity;
          building.children.forEach(child => {
            if (child instanceof THREE.Mesh) {
              (child.material as THREE.MeshBasicMaterial).opacity = 0.1 + Math.sin(time * 2 + i) * 0.05;
            }
          });
        }
        
        building.scale.y = breathingScale;
      });
      
      // Animate floating tender documents
      tenderDocsRef.current.forEach((doc, i) => {
        const time = Date.now() * 0.001;
        // Floating motion
        doc.position.y += Math.sin(time + i) * 0.01;
        // Gentle rotation
        doc.rotation.y += delta * 0.2;
        // Pulse glow
        doc.children.forEach(child => {
          if (child instanceof THREE.Mesh) {
            (child.material as THREE.MeshBasicMaterial).opacity = 0.1 + Math.sin(time * 2 + i) * 0.05;
          }
        });
      });
      
      // Animate clouds
      cloudsRef.current.forEach((cloud, i) => {
        // Drift sideways
        cloud.position.x += delta * 0.5 * (Math.sin(i) * 0.5 + 0.5);
        
        // If cloud goes too far, wrap around
        if (cloud.position.x > 80) cloud.position.x = -80;
        
        // Pulse glow
        const time = Date.now() * 0.0005;
        cloud.children.forEach(child => {
          if (child instanceof THREE.Mesh && child.geometry instanceof THREE.SphereGeometry && 
              child.geometry.parameters.radius > 5) {
            // This is the glow mesh
            (child.material as THREE.MeshBasicMaterial).opacity = 0.15 + Math.sin(time + i) * 0.05;
          }
        });
      });
      
      // Render scene
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      
      // Continue animation loop
      animationFrameRef.current = requestAnimationFrame(animate);
      
      // Set loaded state to true after first frame
      if (!isLoaded) {
        setIsLoaded(true);
      }
    };
    
    // Start animation
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      // Update camera
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      // Update renderer
      rendererRef.current.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, []); // Empty dependency array ensures the effect runs only once

  return (
    <div 
      ref={mountRef} 
      className={`relative ${className}`} 
      style={{ width: '100%', height: '100%', minHeight: '400px' }}
    >
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary/50 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-primary border-solid rounded-full border-t-transparent animate-spin"></div>
            <p className="mt-4 text-primary">Loading city animation...</p>
          </div>
        </div>
      )}
    </div>
  );
});

export default CityAnimation; 