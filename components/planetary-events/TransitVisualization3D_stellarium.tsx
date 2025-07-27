'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { 
  PlanetaryData,
  PlanetPosition,
  AstronomicalCalculationResult
} from '@/lib/types/planetary-events';
import {
  calculateAstronomicalData,
  PLANETARY_DATA,
  calculateJyotishPlanetaryPositions
} from '@/lib/services/astronomical-calculations';

// Jyotish (Vedic) planet names and data
const JYOTISH_PLANETS = {
  'sun': { sanskrit: 'सूर्य', transliteration: 'Surya', color: 0xFFA500, size: 4 },
  'moon': { sanskrit: 'चन्द्र', transliteration: 'Chandra', color: 0xC0C0C0, size: 3 },
  'mars': { sanskrit: 'मंगल', transliteration: 'Mangala', color: 0xFF4500, size: 2 },
  'mercury': { sanskrit: 'बुध', transliteration: 'Budha', color: 0x87CEEB, size: 1.5 },
  'jupiter': { sanskrit: 'गुरु', transliteration: 'Guru', color: 0xFFD700, size: 3.5 },
  'venus': { sanskrit: 'शुक्र', transliteration: 'Shukra', color: 0xFFC0CB, size: 2.5 },
  'saturn': { sanskrit: 'शनि', transliteration: 'Shani', color: 0x4169E1, size: 3 },
  'rahu': { sanskrit: 'राहु', transliteration: 'Rahu', color: 0x800080, size: 2 },
  'ketu': { sanskrit: 'केतु', transliteration: 'Ketu', color: 0x8B4513, size: 2 }
};

// Major constellation data for better visualization
const MAJOR_CONSTELLATIONS = [
  {
    name: 'Ursa Major',
    sanskrit: 'सप्तर्षि',
    stars: [
      { ra: 165, dec: 61.8, mag: 1.8 }, // Dubhe
      { ra: 183, dec: 56.4, mag: 2.4 }, // Merak
      { ra: 200, dec: 53.7, mag: 2.3 }, // Phecda
      { ra: 206, dec: 57.0, mag: 3.3 }, // Megrez
      { ra: 194, dec: 55.9, mag: 1.8 }, // Alioth
      { ra: 210, dec: 54.9, mag: 2.2 }, // Mizar
      { ra: 206, dec: 49.3, mag: 1.9 }  // Alkaid
    ]
  },
  {
    name: 'Orion',
    sanskrit: 'मृग',
    stars: [
      { ra: 88.8, dec: 7.4, mag: 0.1 },   // Betelgeuse
      { ra: 81.3, dec: -1.2, mag: 0.1 },  // Rigel
      { ra: 83.0, dec: -0.3, mag: 1.6 },  // Bellatrix
      { ra: 84.1, dec: 1.9, mag: 2.2 },   // Mintaka
      { ra: 83.6, dec: -0.3, mag: 1.7 },  // Alnilam
      { ra: 85.2, dec: -1.9, mag: 1.8 }   // Alnitak
    ]
  },
  {
    name: 'Cassiopeia',
    sanskrit: 'शर्मिष्ठा',
    stars: [
      { ra: 14.2, dec: 60.7, mag: 2.2 },
      { ra: 9.2, dec: 59.1, mag: 2.3 },
      { ra: 1.9, dec: 60.2, mag: 2.5 },
      { ra: 350.2, dec: 56.5, mag: 3.4 },
      { ra: 344.4, dec: 57.8, mag: 2.7 }
    ]
  }
];

// Stellarium-inspired renderer class
class StellariumRenderer {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private planets: Map<string, THREE.Group> = new Map();
  private stars: THREE.Points | null = null;
  private constellations: THREE.Group | null = null;
  private coordinateGrid: THREE.Group | null = null;
  private horizon: THREE.Mesh | null = null;
  private animationId: number | null = null;
  private controls: any = null;
  private starRotation = 0;
  private showGrid = false;
  private showConstellations = true;

  constructor(canvas: HTMLCanvasElement) {
    // Initialize scene with deep space background
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000008);

    // Initialize camera for astronomical observation
    this.camera = new THREE.PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      2000
    );
    this.camera.position.set(0, 0, 0);
    this.camera.lookAt(0, 0, -1);

    // Initialize renderer with Stellarium-like settings
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = false; // Disable shadows for better performance

    // Create astronomical elements
    this.createRealisticStarField();
    this.createHorizonAndLandscape();
    this.createConstellations();
    this.createCoordinateGrid();

    // Initialize controls
    this.initializeControls();

    // Start animation
    this.animate();
  }

  private createRealisticStarField() {
    const starCount = 8000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      // More realistic star distribution
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.acos(Math.random() * 2 - 1);
      const radius = 800;

      positions[i * 3] = radius * Math.sin(theta) * Math.cos(phi);
      positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.cos(theta);

      // Realistic star colors based on stellar classification
      const colorType = Math.random();
      if (colorType < 0.6) {
        // White/blue-white stars (most common)
        colors[i * 3] = 0.9 + Math.random() * 0.1;
        colors[i * 3 + 1] = 0.9 + Math.random() * 0.1;
        colors[i * 3 + 2] = 1.0;
      } else if (colorType < 0.85) {
        // Yellow/orange stars
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
        colors[i * 3 + 2] = 0.6 + Math.random() * 0.2;
      } else {
        // Red stars
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.4 + Math.random() * 0.3;
        colors[i * 3 + 2] = 0.2 + Math.random() * 0.3;
      }

      // Magnitude-based sizing (brighter stars are larger)
      const magnitude = Math.random() * 6; // 0-6 magnitude scale
      sizes[i] = Math.max(0.5, 4 - magnitude * 0.6);
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
          vec4 texColor = texture2D(pointTexture, gl_PointCoord);
          gl_FragColor = vec4(vColor * texColor.rgb, texColor.a);
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
    
    // Create a more realistic star texture with diffraction spikes
    const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.1, 'rgba(255,255,255,0.9)');
    gradient.addColorStop(0.3, 'rgba(255,255,255,0.5)');
    gradient.addColorStop(0.7, 'rgba(255,255,255,0.1)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, 64, 64);
    
    // Add diffraction spikes for brighter stars
    context.strokeStyle = 'rgba(255,255,255,0.3)';
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(32, 8);
    context.lineTo(32, 56);
    context.moveTo(8, 32);
    context.lineTo(56, 32);
    context.stroke();
    
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  private createHorizonAndLandscape() {
    // Create horizon circle
    const horizonGeometry = new THREE.RingGeometry(400, 401, 128);
    const horizonMaterial = new THREE.MeshBasicMaterial({
      color: 0x333333,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });
    
    this.horizon = new THREE.Mesh(horizonGeometry, horizonMaterial);
    this.horizon.rotation.x = -Math.PI / 2;
    this.horizon.position.y = -100;
    this.scene.add(this.horizon);

    // Create landscape silhouette with more detail
    const landscapePoints = [];
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2;
      const height = 
        Math.sin(angle * 2) * 15 + 
        Math.sin(angle * 5) * 8 + 
        Math.sin(angle * 11) * 4 + 
        Math.random() * 6;
      landscapePoints.push(new THREE.Vector2(
        Math.cos(angle) * 400,
        -95 + height
      ));
    }
    
    const landscapeGeometry = new THREE.LatheGeometry(landscapePoints, 128);
    const landscapeMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x000000,
      side: THREE.FrontSide
    });
    const landscape = new THREE.Mesh(landscapeGeometry, landscapeMaterial);
    this.scene.add(landscape);
  }

  private createConstellations() {
    this.constellations = new THREE.Group();
    
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x4a5568,
      transparent: true,
      opacity: 0.6,
      linewidth: 1
    });

    MAJOR_CONSTELLATIONS.forEach(constellation => {
      const points = constellation.stars.map(star => {
        const ra = (star.ra * Math.PI) / 180;
        const dec = (star.dec * Math.PI) / 180;
        const radius = 600;
        
        return new THREE.Vector3(
          radius * Math.cos(dec) * Math.cos(ra),
          radius * Math.sin(dec),
          -radius * Math.cos(dec) * Math.sin(ra)
        );
      });
      
      // Connect stars in constellation pattern
      for (let i = 0; i < points.length - 1; i++) {
        const geometry = new THREE.BufferGeometry().setFromPoints([points[i], points[i + 1]]);
        const line = new THREE.Line(geometry, lineMaterial);
        this.constellations?.add(line);
      }
      
      // Add constellation label
      if (points.length > 0) {
        const centerPoint = points.reduce((acc, point) => acc.add(point), new THREE.Vector3()).divideScalar(points.length);
        const labelTexture = this.createTextTexture(constellation.name, '#4a5568', '14px Arial');
        const labelMaterial = new THREE.SpriteMaterial({ 
          map: labelTexture,
          transparent: true,
          alphaTest: 0.1
        });
        const label = new THREE.Sprite(labelMaterial);
        label.position.copy(centerPoint);
        label.scale.set(30, 15, 1);
        this.constellations?.add(label);
      }
    });
    
    this.scene.add(this.constellations);
  }

  private createCoordinateGrid() {
    this.coordinateGrid = new THREE.Group();
    
    const gridMaterial = new THREE.LineBasicMaterial({
      color: 0x2d3748,
      transparent: true,
      opacity: 0.3
    });

    // Create azimuth circles (horizontal)
    for (let alt = 0; alt <= 90; alt += 15) {
      const radius = 500 * Math.cos((alt * Math.PI) / 180);
      const height = 500 * Math.sin((alt * Math.PI) / 180);
      
      if (radius > 0) {
        const geometry = new THREE.RingGeometry(radius - 1, radius + 1, 64);
        const circle = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
          color: 0x2d3748,
          transparent: true,
          opacity: 0.2,
          side: THREE.DoubleSide
        }));
        circle.rotation.x = -Math.PI / 2;
        circle.position.y = height;
        this.coordinateGrid.add(circle);
      }
    }

    // Create altitude lines (vertical)
    for (let az = 0; az < 360; az += 30) {
      const points = [];
      for (let alt = 0; alt <= 90; alt += 5) {
        const radius = 500 * Math.cos((alt * Math.PI) / 180);
        const height = 500 * Math.sin((alt * Math.PI) / 180);
        const azRad = (az * Math.PI) / 180;
        
        points.push(new THREE.Vector3(
          radius * Math.cos(azRad),
          height,
          radius * Math.sin(azRad)
        ));
      }
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, gridMaterial);
      this.coordinateGrid.add(line);
    }
    
    this.coordinateGrid.visible = this.showGrid;
    this.scene.add(this.coordinateGrid);
  }

  private async initializeControls() {
    try {
      const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      
      // Stellarium-like controls
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.enableZoom = true;
      this.controls.enablePan = false;
      this.controls.minDistance = 0.1;
      this.controls.maxDistance = 50;
      this.controls.minPolarAngle = 0;
      this.controls.maxPolarAngle = Math.PI;
      this.controls.rotateSpeed = 0.5;
      this.controls.zoomSpeed = 1.2;
    } catch (error) {
      console.warn('OrbitControls not available:', error);
    }
  }

  updatePlanets(astronomicalData: AstronomicalCalculationResult) {
    // Clear existing planets
    this.planets.forEach(planetGroup => this.scene.remove(planetGroup));
    this.planets.clear();

    // Add planets with enhanced visualization
    astronomicalData.planetPositions.forEach((planetData) => {
      const jyotishData = JYOTISH_PLANETS[planetData.planet as keyof typeof JYOTISH_PLANETS];
      if (!jyotishData) return;

      const planetGroup = new THREE.Group();

      // Convert position to sky coordinates
      const position = planetData.position;
      const distance = Math.sqrt(position.x * position.x + position.y * position.y + position.z * position.z);
      const azimuth = Math.atan2(position.x, position.z);
      const elevation = Math.asin(position.y / distance);
      const skyDistance = 300;

      const x = skyDistance * Math.cos(elevation) * Math.sin(azimuth);
      const y = skyDistance * Math.sin(elevation);
      const z = -skyDistance * Math.cos(elevation) * Math.cos(azimuth);

      // Create planet sphere with enhanced appearance
      const planetGeometry = new THREE.SphereGeometry(jyotishData.size, 16, 16);
      const planetMaterial = new THREE.MeshBasicMaterial({ 
        color: jyotishData.color,
        transparent: true,
        opacity: 0.9
      });
      
      const planet = new THREE.Mesh(planetGeometry, planetMaterial);
      planet.position.set(0, 0, 0);
      planetGroup.add(planet);
      
      // Add glow effect
      const glowGeometry = new THREE.SphereGeometry(jyotishData.size * 1.5, 16, 16);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: jyotishData.color,
        transparent: true,
        opacity: 0.2
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      planetGroup.add(glow);
      
      // Special effects for Sun
      if (planetData.planet === 'sun') {
        const coronaGeometry = new THREE.SphereGeometry(jyotishData.size * 2, 16, 16);
        const coronaMaterial = new THREE.MeshBasicMaterial({
          color: 0xFFA500,
          transparent: true,
          opacity: 0.1
        });
        const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
        planetGroup.add(corona);
      }

      planetGroup.position.set(x, y, z);
      this.scene.add(planetGroup);
      this.planets.set(planetData.planet, planetGroup);

      // Create enhanced planet label
      const labelText = `${jyotishData.transliteration}\n${jyotishData.sanskrit}`;
      const labelTexture = this.createTextTexture(labelText, '#ffffff', '16px Arial');
      const labelMaterial = new THREE.SpriteMaterial({ 
        map: labelTexture,
        transparent: true,
        alphaTest: 0.1
      });
      const label = new THREE.Sprite(labelMaterial);
      label.position.set(0, jyotishData.size + 8, 0);
      label.scale.set(25, 12, 1);
      planetGroup.add(label);
    });
  }

  private createTextTexture(text: string, color: string, font: string): THREE.Texture {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    
    canvas.width = 256;
    canvas.height = 128;
    
    // Clear with transparent background
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Add subtle background for better readability
    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
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

  toggleGrid() {
    this.showGrid = !this.showGrid;
    if (this.coordinateGrid) {
      this.coordinateGrid.visible = this.showGrid;
    }
  }

  toggleConstellations() {
    this.showConstellations = !this.showConstellations;
    if (this.constellations) {
      this.constellations.visible = this.showConstellations;
    }
  }

  focusOnPlanet(planetName: string) {
    const planetGroup = this.planets.get(planetName);
    if (planetGroup && this.controls) {
      // Smoothly move camera to look at the planet
      const planetPosition = planetGroup.position;
      const distance = 50; // Distance from planet
      
      // Calculate camera position
      const cameraPosition = new THREE.Vector3(
        planetPosition.x + distance,
        planetPosition.y + distance * 0.5,
        planetPosition.z + distance
      );
      
      // Animate camera movement
      const startPosition = this.camera.position.clone();
      const startTarget = this.controls.target.clone();
      
      let progress = 0;
      const animateCamera = () => {
        progress += 0.02;
        if (progress >= 1) {
          this.camera.position.copy(cameraPosition);
          this.controls.target.copy(planetPosition);
          this.controls.update();
          return;
        }
        
        this.camera.position.lerpVectors(startPosition, cameraPosition, progress);
        this.controls.target.lerpVectors(startTarget, planetPosition, progress);
        this.controls.update();
        
        requestAnimationFrame(animateCamera);
      };
      
      animateCamera();
    }
  }

  public animate = () => {
    this.animationId = requestAnimationFrame(this.animate);
    
    // Slow star field rotation to simulate Earth's rotation
    if (this.stars) {
      this.starRotation += 0.00005;
      this.stars.rotation.y = this.starRotation;
    }
    
    // Subtle planet animations
    this.planets.forEach((planetGroup, key) => {
      const planet = planetGroup.children[0] as THREE.Mesh;
      if (planet) {
        planet.rotation.y += 0.005;
      }
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
    
    // Dispose of all resources
    this.planets.forEach(planetGroup => {
      planetGroup.children.forEach(child => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          (child.material as THREE.Material).dispose();
        }
      });
    });
    
    if (this.stars) {
      this.stars.geometry.dispose();
      (this.stars.material as THREE.Material).dispose();
    }
    
    if (this.constellations) {
      this.constellations.children.forEach(child => {
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

// Main React component with Stellarium-inspired UI
interface TransitVisualization3DProps {
  currentTime: Date;
  planetaryData: PlanetaryData | null;
}

export default function TransitVisualization3D({ 
  currentTime, 
  planetaryData
}: TransitVisualization3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<StellariumRenderer | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(true);

  useEffect(() => {
    if (canvasRef.current) {
      const renderer = new StellariumRenderer(canvasRef.current);
      rendererRef.current = renderer;

      const animate = () => {
        renderer.animate();
        requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);

      return () => {
        renderer.dispose();
      };
    }
  }, []);

  useEffect(() => {
    if (stellariumRenderer.current && planetaryData) {
      stellariumRenderer.current.updatePlanets({
        planetPositions: planetaryData.positions,
        moonPhase: planetaryData.moonPhase,
        siderealTime: planetaryData.siderealTime,
      });
    }
  }, [planetaryData]);

  // Helper function to get zodiac sign from longitude
  const getSignFromLongitude = (longitude: number): string => {
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                   'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    const signIndex = Math.floor(longitude / 30);
    return signs[signIndex];
  };

  // Resize handler
  const handleResize = useCallback(() => {
    if (stellariumRenderer.current) {
      stellariumRenderer.current.handleResize(window.innerWidth, window.innerHeight);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial size
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  const toggleGrid = () => {
    if (stellariumRenderer.current) {
      stellariumRenderer.current.toggleGrid();
    }
  };

  const toggleConstellations = () => {
    if (stellariumRenderer.current) {
      stellariumRenderer.current.toggleConstellations();
    }
  };

  const handlePlanetClick = (planetName: string) => {
    setSelectedPlanet(planetName);
    if (stellariumRenderer.current) {
    }
  };

  const getCurrentTransitInfo = (planetName: string) => {
    if (!planetaryData) return null;

    const planet = planetaryData.positions.find((p) => p.planet === planetName);
    if (!planet) return null;

    const sign = getSignFromLongitude(planet.siderealLongitude);
    const degree = planet.siderealLongitude % 30;
    const jyotishInfo = JYOTISH_PLANETS[planetName.toLowerCase() as keyof typeof JYOTISH_PLANETS];

    return {
      ...planet,
      sign,
      degree,
      transliteration: jyotishInfo.transliteration,
    };
  };

  return (
    <div className="w-screen h-screen relative">
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top-left controls */}
        <div className="absolute top-2 left-2 flex space-x-2 pointer-events-auto">
          <button onClick={() => setShowInfo(!showInfo)} className="px-3 py-1 bg-black bg-opacity-70 border border-gray-700 rounded text-xs hover:bg-gray-800">
            {showInfo ? 'Hide Info' : 'Show Info'}
          </button>
          <button onClick={toggleGrid} className="px-3 py-1 bg-black bg-opacity-70 border border-gray-700 rounded text-xs hover:bg-gray-800">
            Toggle Grid
          </button>
          <button onClick={toggleConstellations} className="px-3 py-1 bg-black bg-opacity-70 border border-gray-700 rounded text-xs hover:bg-gray-800">
            Toggle Constellations
          </button>
        </div>

        {/* Bottom status bar */}
        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-xs text-gray-300 pointer-events-auto">
          <div className="flex space-x-4">
            <span>Time: {currentTime.toLocaleString()}</span>
            {planetaryData && (
              <span>Planets: {planetaryData.positions.length}</span>
            )}
          </div>
          <div className="text-xs opacity-75">
            Drag to look around • Scroll to zoom • Click buttons to toggle features
          </div>
        </div>

        {/* Information panel with navigation */}
        {showInfo && planetaryData && (
          <div className="absolute top-12 left-2 bg-black bg-opacity-90 border border-gray-700 rounded-lg p-4 max-w-sm pointer-events-auto overflow-y-auto max-h-[calc(100vh-8rem)]">
            <h3 className="text-sm font-semibold text-white mb-3">Current Planetary Transits</h3>
            <div className="space-y-2 text-xs">
              {planetaryData.positions.map((planet) => {
                const transitInfo = getCurrentTransitInfo(planet.planet);
                if (!transitInfo) return null;
                
                return (
                  <div key={planet.planet} className="mb-3 p-3 bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-yellow-400">
                          {transitInfo.transliteration} ({planet.planet})
                        </h4>
                        <p className="text-gray-300">
                          {transitInfo.sign} {transitInfo.degree.toFixed(2)}°
                        </p>
                        {planet.siderealLongitude && (
                          <p className="text-sm text-gray-400">
                            Sidereal: {planet.siderealLongitude.toFixed(2)}°
                          </p>
                        )}
                        
                        {/* Nakshatra and Pada Information */}
                        {planet.nakshatra && (
                          <div className="mt-2 p-2 bg-gray-700 rounded">
                            <div className="text-sm font-medium text-blue-300">
                              🌟 {planet.nakshatra} - Pada {planet.pada}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              Sanskrit: {planet.nakshatraSanskrit}
                            </div>
                            <div className="text-xs text-gray-400">
                              Lord: {planet.nakshatraLord} | Deity: {planet.deity}
                            </div>
                            <div className="text-xs text-gray-400">
                              Nature: {planet.nature}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right ml-4">
                        <button
                          onClick={() => handlePlanetClick(planet.planet)}
                          className={`px-2 py-1 rounded text-xs transition-colors ${
                            selectedPlanet === planet.planet
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                          }`}
                        >
                          Navigate
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 pt-2 border-t border-gray-700">
              <div className="text-xs text-gray-400">
                Updated: {currentTime.toLocaleTimeString()} • Click Navigate to focus on planet
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}