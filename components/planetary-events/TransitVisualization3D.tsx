'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { 
  TransitVisualization3DProps,
  PlanetaryPosition3D,
  AstronomicalCalculationResult
} from '@/lib/types/planetary-events';
import { 
  calculateAstronomicalData,
  PLANETARY_DATA
} from '@/lib/services/astronomical-calculations';

// Jyotish (Vedic) planet names and data
const JYOTISH_PLANETS = {
  'sun': { sanskrit: 'सूर्य', transliteration: 'Surya', color: 0xFFA500 },
  'moon': { sanskrit: 'चन्द्र', transliteration: 'Chandra', color: 0xC0C0C0 },
  'mars': { sanskrit: 'मंगल', transliteration: 'Mangala', color: 0xFF4500 },
  'mercury': { sanskrit: 'बुध', transliteration: 'Budha', color: 0x87CEEB },
  'jupiter': { sanskrit: 'गुरु', transliteration: 'Guru', color: 0xFFD700 },
  'venus': { sanskrit: 'शुक्र', transliteration: 'Shukra', color: 0xFFC0CB },
  'saturn': { sanskrit: 'शनि', transliteration: 'Shani', color: 0x4169E1 },
  'rahu': { sanskrit: 'राहु', transliteration: 'Rahu', color: 0x800080 },
  'ketu': { sanskrit: 'केतु', transliteration: 'Ketu', color: 0x8B4513 }
};

// Nakshatra (Vedic constellation) data
const NAKSHATRAS = [
  { name: 'Ashwini', sanskrit: 'अश्विनी', stars: 3, longitude: 0 },
  { name: 'Bharani', sanskrit: 'भरणी', stars: 3, longitude: 13.33 },
  { name: 'Krittika', sanskrit: 'कृत्तिका', stars: 6, longitude: 26.67 },
  { name: 'Rohini', sanskrit: 'रोहिणी', stars: 5, longitude: 40 },
  { name: 'Mrigashira', sanskrit: 'मृगशिरा', stars: 4, longitude: 53.33 },
  { name: 'Ardra', sanskrit: 'आर्द्रा', stars: 1, longitude: 66.67 },
  { name: 'Punarvasu', sanskrit: 'पुनर्वसु', stars: 4, longitude: 80 },
  { name: 'Pushya', sanskrit: 'पुष्य', stars: 3, longitude: 93.33 },
  { name: 'Ashlesha', sanskrit: 'आश्लेषा', stars: 6, longitude: 106.67 },
  { name: 'Magha', sanskrit: 'मघा', stars: 6, longitude: 120 },
  { name: 'Purva Phalguni', sanskrit: 'पूर्व फाल्गुनी', stars: 2, longitude: 133.33 },
  { name: 'Uttara Phalguni', sanskrit: 'उत्तर फाल्गुनी', stars: 2, longitude: 146.67 },
  { name: 'Hasta', sanskrit: 'हस्त', stars: 5, longitude: 160 },
  { name: 'Chitra', sanskrit: 'चित्रा', stars: 1, longitude: 173.33 },
  { name: 'Swati', sanskrit: 'स्वाति', stars: 1, longitude: 186.67 },
  { name: 'Vishakha', sanskrit: 'विशाखा', stars: 4, longitude: 200 },
  { name: 'Anuradha', sanskrit: 'अनुराधा', stars: 4, longitude: 213.33 },
  { name: 'Jyeshtha', sanskrit: 'ज्येष्ठा', stars: 3, longitude: 226.67 },
  { name: 'Mula', sanskrit: 'मूल', stars: 11, longitude: 240 },
  { name: 'Purva Ashadha', sanskrit: 'पूर्व आषाढ़ा', stars: 4, longitude: 253.33 },
  { name: 'Uttara Ashadha', sanskrit: 'उत्तर आषाढ़ा', stars: 4, longitude: 266.67 },
  { name: 'Shravana', sanskrit: 'श्रवण', stars: 3, longitude: 280 },
  { name: 'Dhanishta', sanskrit: 'धनिष्ठा', stars: 4, longitude: 293.33 },
  { name: 'Shatabhisha', sanskrit: 'शतभिषा', stars: 100, longitude: 306.67 },
  { name: 'Purva Bhadrapada', sanskrit: 'पूर्व भाद्रपदा', stars: 2, longitude: 320 },
  { name: 'Uttara Bhadrapada', sanskrit: 'उत्तर भाद्रपदा', stars: 2, longitude: 333.33 },
  { name: 'Revati', sanskrit: 'रेवती', stars: 32, longitude: 346.67 }
];

// Stellarium-inspired renderer class
class StellariumRenderer {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private planets: Map<string, THREE.Mesh> = new Map();
  private planetLabels: Map<string, THREE.Sprite> = new Map();
  private stars: THREE.Points | null = null;
  private horizon: THREE.Mesh | null = null;
  private constellationLines: THREE.Group | null = null;
  private animationId: number | null = null;
  private controls: any = null;
  private starRotation = 0;

  constructor(canvas: HTMLCanvasElement) {
    // Initialize scene with night sky background
    this.scene = new THREE.Scene();
    this.createNightSkyBackground();

    // Initialize camera for sky observation
    this.camera = new THREE.PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 0);
    this.camera.lookAt(0, 0, -1);

    // Initialize renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false
    });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Create sky elements
    this.createStarField();
    this.createHorizonSilhouette();
    this.createNakshatraConstellations();

    // Initialize controls
    this.initializeControls();

    // Start animation
    this.animate();
  }

  private createNightSkyBackground() {
    // Create gradient sky background shader
    const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
    const skyMaterial = new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: new THREE.Color(0x000011) },
        bottomColor: { value: new THREE.Color(0x001122) },
        offset: { value: 33 },
        exponent: { value: 0.6 }
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition + offset).y;
          gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
        }
      `,
      side: THREE.BackSide
    });
    
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    this.scene.add(sky);
  }

  private createStarField() {
    const starCount = 5000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      // Random positions on sphere
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.acos(Math.random() * 2 - 1);
      const radius = 400;

      positions[i * 3] = radius * Math.sin(theta) * Math.cos(phi);
      positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.cos(theta);

      // Star colors (white, yellow, blue tints)
      const colorType = Math.random();
      if (colorType < 0.7) {
        // White stars
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 1;
      } else if (colorType < 0.9) {
        // Yellow stars
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0.9;
        colors[i * 3 + 2] = 0.7;
      } else {
        // Blue stars
        colors[i * 3] = 0.7;
        colors[i * 3 + 1] = 0.8;
        colors[i * 3 + 2] = 1;
      }

      // Varying star sizes
      sizes[i] = Math.random() * 3 + 1;
    }

    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const starMaterial = new THREE.ShaderMaterial({
      uniforms: {
        pointTexture: { value: this.createStarTexture() }
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D pointTexture;
        varying vec3 vColor;
        void main() {
          gl_FragColor = vec4(vColor, 1.0);
          gl_FragColor = gl_FragColor * texture2D(pointTexture, gl_PointCoord);
          if (gl_FragColor.a < 0.1) discard;
        }
      `,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
      vertexColors: true
    });

    this.stars = new THREE.Points(starGeometry, starMaterial);
    this.scene.add(this.stars);
  }

  private createStarTexture(): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d')!;
    
    const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
    gradient.addColorStop(0.4, 'rgba(255,255,255,0.4)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, 64, 64);
    
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  private createHorizonSilhouette() {
    const horizonGeometry = new THREE.RingGeometry(300, 400, 64);
    const horizonMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });
    
    this.horizon = new THREE.Mesh(horizonGeometry, horizonMaterial);
    this.horizon.rotation.x = -Math.PI / 2;
    this.horizon.position.y = -50;
    this.scene.add(this.horizon);

    // Add landscape silhouette
    const landscapePoints = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      const height = Math.sin(angle * 3) * 10 + Math.sin(angle * 7) * 5 + Math.random() * 8;
      landscapePoints.push(new THREE.Vector2(
        Math.cos(angle) * 350,
        -45 + height
      ));
    }
    
    const landscapeGeometry = new THREE.LatheGeometry(landscapePoints, 64);
    const landscapeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const landscape = new THREE.Mesh(landscapeGeometry, landscapeMaterial);
    this.scene.add(landscape);
  }

  private createNakshatraConstellations() {
    this.constellationLines = new THREE.Group();
    
    // Create basic constellation lines for major Nakshatras
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x444444,
      transparent: true,
      opacity: 0.6
    });

    NAKSHATRAS.forEach((nakshatra, index) => {
      if (nakshatra.stars > 1) {
        const points = [];
        const longitude = (nakshatra.longitude * Math.PI) / 180;
        const radius = 300;
        
        // Create simple constellation pattern
        for (let i = 0; i < Math.min(nakshatra.stars, 5); i++) {
          const angle = longitude + (i * 0.1);
          const elevation = Math.sin(angle) * 0.3;
          
          points.push(new THREE.Vector3(
            radius * Math.cos(angle) * Math.cos(elevation),
            radius * Math.sin(elevation),
            radius * Math.sin(angle) * Math.cos(elevation)
          ));
        }
        
        if (points.length > 1) {
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          const line = new THREE.Line(geometry, lineMaterial);
          this.constellationLines.add(line);
        }
      }
    });
    
    this.scene.add(this.constellationLines);
  }

  private async initializeControls() {
    try {
      const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      
      // Configure for sky observation
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.enableZoom = true;
      this.controls.enablePan = false;
      this.controls.minDistance = 0.1;
      this.controls.maxDistance = 10;
      this.controls.minPolarAngle = 0;
      this.controls.maxPolarAngle = Math.PI;
    } catch (error) {
      console.warn('OrbitControls not available:', error);
    }
  }

  updatePlanets(astronomicalData: AstronomicalCalculationResult) {
    // Clear existing planets and labels
    this.planets.forEach(planet => this.scene.remove(planet));
    this.planetLabels.forEach(label => this.scene.remove(label));
    this.planets.clear();
    this.planetLabels.clear();

    // Add planets based on astronomical data
    astronomicalData.planetPositions.forEach((planetData) => {
      const jyotishData = JYOTISH_PLANETS[planetData.planet as keyof typeof JYOTISH_PLANETS];
      if (!jyotishData) return;

      // Convert 3D position to spherical coordinates for sky view
      const position = planetData.position;
      const originalDistance = Math.sqrt(position.x * position.x + position.y * position.y + position.z * position.z);
      const azimuth = Math.atan2(position.x, position.z);
      const elevation = Math.asin(position.y / originalDistance);
      const skyDistance = 200;

      const x = skyDistance * Math.cos(elevation) * Math.sin(azimuth);
      const y = skyDistance * Math.sin(elevation);
      const z = -skyDistance * Math.cos(elevation) * Math.cos(azimuth);

      // Create planet sphere
      const planetGeometry = new THREE.SphereGeometry(planetData.planet === 'sun' ? 4 : 2, 16, 16);
      const planetMaterial = new THREE.MeshBasicMaterial({ 
        color: jyotishData.color,
        transparent: true,
        opacity: 0.9
      });
      
      const planet = new THREE.Mesh(planetGeometry, planetMaterial);
      planet.position.set(x, y, z);
      
      // Add glow effect for Sun
      if (planetData.planet === 'sun') {
        const glowGeometry = new THREE.SphereGeometry(8, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: 0xFFA500,
          transparent: true,
          opacity: 0.3
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        planet.add(glow);
      }
      
      this.scene.add(planet);
      this.planets.set(planetData.planet, planet);

      // Create planet label
      const labelTexture = this.createTextTexture(
        `${jyotishData.transliteration}\n${jyotishData.sanskrit}`,
        '#ffffff',
        '16px Arial'
      );
      
      const labelMaterial = new THREE.SpriteMaterial({ 
        map: labelTexture,
        transparent: true,
        alphaTest: 0.1
      });
      
      const label = new THREE.Sprite(labelMaterial);
      label.position.set(x, y + 8, z);
      label.scale.set(20, 10, 1);
      
      this.scene.add(label);
      this.planetLabels.set(planetData.planet, label);
    });
  }

  private createTextTexture(text: string, color: string, font: string): THREE.Texture {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    
    canvas.width = 256;
    canvas.height = 128;
    
    context.fillStyle = 'transparent';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    context.fillStyle = color;
    context.font = font;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    const lines = text.split('\n');
    lines.forEach((line, index) => {
      context.fillText(line, canvas.width / 2, canvas.height / 2 + (index - 0.5) * 20);
    });
    
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate);
    
    // Rotate star field slowly to simulate Earth's rotation
    if (this.stars) {
      this.starRotation += 0.0001;
      this.stars.rotation.y = this.starRotation;
    }
    
    // Animate planets
    this.planets.forEach((planet, key) => {
      planet.rotation.y += 0.01;
    });
    
    // Update labels to always face camera
    this.planetLabels.forEach(label => {
      label.lookAt(this.camera.position);
    });
    
    if (this.controls) {
      this.controls.update();
    }
    
    this.renderer.render(this.scene, this.camera);
  };

  handleResize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  dispose() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    this.planets.forEach(planet => {
      planet.geometry.dispose();
      (planet.material as THREE.Material).dispose();
    });
    
    this.planetLabels.forEach(label => {
      (label.material as THREE.SpriteMaterial).map?.dispose();
      (label.material as THREE.SpriteMaterial).dispose();
    });
    
    if (this.stars) {
      this.stars.geometry.dispose();
      (this.stars.material as THREE.Material).dispose();
    }
    
    if (this.horizon) {
      this.horizon.geometry.dispose();
      (this.horizon.material as THREE.Material).dispose();
    }
    
    if (this.constellationLines) {
      this.constellationLines.children.forEach(child => {
        if (child instanceof THREE.Line) {
          child.geometry.dispose();
          (child.material as THREE.Material).dispose();
        }
      });
    }
    
    this.renderer.dispose();
    
    if (this.controls) {
      this.controls.dispose();
    }
  }
}

// Main React component
export default function TransitVisualization3D({ 
  currentTime, 
  events, 
  selectedEvent,
  onEventSelect,
  config = {}
}: TransitVisualization3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<StellariumRenderer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [astronomicalData, setAstronomicalData] = useState<AstronomicalCalculationResult | null>(null);

  // Calculate astronomical data
  const updateAstronomicalData = useCallback(async () => {
    try {
      setLoading(true);
      const data = calculateAstronomicalData(currentTime, events || []);
      setAstronomicalData(data);
      setError(null);
    } catch (err) {
      console.error('Failed to calculate astronomical data:', err);
      setError('Failed to load astronomical data');
    } finally {
      setLoading(false);
    }
  }, [currentTime, events]);

  // Initialize renderer
  useEffect(() => {
    if (!canvasRef.current) return;

    try {
      rendererRef.current = new StellariumRenderer(canvasRef.current);
      
      // Handle resize
      const handleResize = () => {
        if (rendererRef.current && canvasRef.current) {
          const rect = canvasRef.current.getBoundingClientRect();
          rendererRef.current.handleResize(rect.width, rect.height);
        }
      };

      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        if (rendererRef.current) {
          rendererRef.current.dispose();
        }
      };
    } catch (err) {
      console.error('Failed to initialize renderer:', err);
      setError('Failed to initialize 3D visualization');
    }
  }, []);

  // Update astronomical data when time changes
  useEffect(() => {
    updateAstronomicalData();
  }, [updateAstronomicalData]);

  // Update planets when data changes
  useEffect(() => {
    if (rendererRef.current && astronomicalData) {
      rendererRef.current.updatePlanets(astronomicalData);
    }
  }, [astronomicalData]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-900 rounded-lg">
        <div className="text-center">
          <div className="text-red-400 mb-2">⚠️ Visualization Error</div>
          <div className="text-gray-300 text-sm">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-96 bg-black rounded-lg overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="text-white">Loading sky view...</div>
        </div>
      )}
      
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
      
      {/* Stellarium-style UI overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-white text-sm">
        <div className="flex space-x-4">
          <span>Time: {currentTime.toLocaleString()}</span>
          {astronomicalData && (
            <span>Planets: {astronomicalData.planetPositions.length}</span>
          )}
        </div>
        <div className="text-xs opacity-75">
          Jyotish Sky View • Drag to look around • Scroll to zoom
        </div>
      </div>
    </div>
  );
}
