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
  { name: 'Shravana', sanskrit: 'श्रवण', stars: 3, longitude: 280 },
  { name: 'Dhanishta', sanskrit: 'धनिष्ठा', stars: 4, longitude: 293.33 },
  { name: 'Shatabhisha', sanskrit: 'शतभिषा', stars: 100, longitude: 306.67 },
  { name: 'Purva Bhadrapada', sanskrit: 'पूर्व भाद्रपदा', stars: 2, longitude: 320 },
  { name: 'Uttara Bhadrapada', sanskrit: 'उत्तर भाद्रपदा', stars: 2, longitude: 333.33 },
  { name: 'Revati', sanskrit: 'रेवती', stars: 32, longitude: 346.67 }
];

// Stellarium-inspired Jyotish Sky Renderer
class StellariumRenderer {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private planets: Map<string, THREE.Group> = new Map();
  private nakshatraLines: THREE.Group = new THREE.Group();
  private starField: THREE.Points | null = null;
  private horizon: THREE.Mesh | null = null;
  private animationId: number | null = null;
  private controls: any = null;
  private showNakshatras: boolean = true;
  private showPlanetLabels: boolean = true;
  private showHorizon: boolean = true;

  constructor(canvas: HTMLCanvasElement) {
    // Initialize scene
    this.scene = new THREE.Scene();
    
    // Create realistic night sky gradient background
    this.createSkyBackground();

    // Initialize camera for sky view (looking up at the sky)
    this.camera = new THREE.PerspectiveCamera(
      90, // Wide field of view like Stellarium
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 0); // Observer at center
    this.camera.lookAt(0, 1, 0); // Looking up at zenith

    // Initialize renderer with realistic settings
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false
    });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Setup realistic night sky lighting
    this.setupNightSkyLighting();
    
    // Create realistic star field
    this.createRealisticStarField();
    
    // Create horizon landscape
    this.createHorizonLandscape();
    
    // Create Nakshatra constellation lines
    this.createNakshatraLines();

    // Initialize controls for sky navigation
    this.initializeSkyControls();
  }

  private createSkyBackground(): void {
    // Create realistic night sky gradient from horizon to zenith
    const skyGeometry = new THREE.SphereGeometry(500, 32, 16);
    const skyMaterial = new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: new THREE.Color(0x000428) }, // Deep night blue at zenith
        bottomColor: { value: new THREE.Color(0x004e92) }, // Lighter blue at horizon
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

  private setupNightSkyLighting(): void {
    // Very dim ambient light for night sky
    const ambientLight = new THREE.AmbientLight(0x404040, 0.1);
    this.scene.add(ambientLight);

    // Moonlight (if moon is visible)
    const moonLight = new THREE.DirectionalLight(0xc0c0ff, 0.2);
    moonLight.position.set(-10, 20, 10);
    this.scene.add(moonLight);
  }

  private createRealisticStarField(): void {
    const starCount = 3000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    
    // Create stars with realistic distribution and brightness
    for (let i = 0; i < starCount; i++) {
      // Random position on celestial sphere
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.acos(Math.random() * 2 - 1);
      const radius = 400;
      
      positions[i * 3] = radius * Math.sin(theta) * Math.cos(phi);
      positions[i * 3 + 1] = radius * Math.cos(theta);
      positions[i * 3 + 2] = radius * Math.sin(theta) * Math.sin(phi);
      
      // Realistic star colors and brightness
      const brightness = Math.random();
      const starType = Math.random();
      
      if (starType < 0.1) {
        // Blue-white stars (hot)
        colors[i * 3] = 0.8 + brightness * 0.2;
        colors[i * 3 + 1] = 0.8 + brightness * 0.2;
        colors[i * 3 + 2] = 1.0;
        sizes[i] = 1.5 + brightness * 2;
      } else if (starType < 0.3) {
        // Yellow stars (sun-like)
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 1.0;
        colors[i * 3 + 2] = 0.8 + brightness * 0.2;
        sizes[i] = 1.0 + brightness * 1.5;
      } else if (starType < 0.5) {
        // Orange-red stars (cool)
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.6 + brightness * 0.4;
        colors[i * 3 + 2] = 0.4 + brightness * 0.3;
        sizes[i] = 0.8 + brightness * 1.2;
      } else {
        // White stars
        colors[i * 3] = 0.9 + brightness * 0.1;
        colors[i * 3 + 1] = 0.9 + brightness * 0.1;
        colors[i * 3 + 2] = 0.9 + brightness * 0.1;
        sizes[i] = 0.5 + brightness * 1.0;
      }
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const material = new THREE.ShaderMaterial({
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
          if (gl_FragColor.a < 0.5) discard;
        }
      `,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
      vertexColors: true
    });
    
    this.starField = new THREE.Points(geometry, material);
    this.scene.add(this.starField);
  }

  private createStarTexture(): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const context = canvas.getContext('2d')!;
    
    const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.2, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.4, 'rgba(255,255,255,0.8)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, 32, 32);
    
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  private createHorizonLandscape(): void {
    // Create horizon silhouette
    const horizonGeometry = new THREE.RingGeometry(300, 500, 64);
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
    
    // Add some landscape silhouette variations
    this.createLandscapeFeatures();
  }

  private createLandscapeFeatures(): void {
    // Create random tree/mountain silhouettes on horizon
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const distance = 280 + Math.random() * 20;
      const height = 10 + Math.random() * 30;
      
      const featureGeometry = new THREE.ConeGeometry(5 + Math.random() * 10, height, 6);
      const featureMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const feature = new THREE.Mesh(featureGeometry, featureMaterial);
      
      feature.position.x = Math.cos(angle) * distance;
      feature.position.z = Math.sin(angle) * distance;
      feature.position.y = -50 + height / 2;
      
      this.scene.add(feature);
    }
  }

  private createNakshatraLines(): void {
    // Create constellation lines for Nakshatras
    this.scene.add(this.nakshatraLines);
    
    // This would be expanded to show actual Nakshatra constellation patterns
    // For now, we'll create a basic framework
    NAKSHATRAS.forEach((nakshatra, index) => {
      if (this.showNakshatras) {
        this.createNakshatraConstellation(nakshatra, index);
      }
    });
  }

  private createNakshatraConstellation(nakshatra: any, index: number): void {
    // Create basic constellation pattern for each Nakshatra
    const points = [];
    const starCount = Math.min(nakshatra.stars, 8); // Limit for performance
    
    for (let i = 0; i < starCount; i++) {
      const angle = (nakshatra.longitude + i * 3) * Math.PI / 180;
      const elevation = 30 + Math.random() * 40; // Random elevation
      const distance = 350;
      
      const x = distance * Math.cos(elevation * Math.PI / 180) * Math.cos(angle);
      const y = distance * Math.sin(elevation * Math.PI / 180);
      const z = distance * Math.cos(elevation * Math.PI / 180) * Math.sin(angle);
      
      points.push(new THREE.Vector3(x, y, z));
    }
    
    if (points.length > 1) {
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: 0x4a90e2,
        transparent: true,
        opacity: 0.6
      });
      
      const line = new THREE.Line(geometry, material);
      this.nakshatraLines.add(line);
    }
  }

  private async initializeSkyControls(): Promise<void> {
    try {
      const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      
      // Configure controls for sky observation
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.enablePan = false; // No panning in sky view
      this.controls.enableZoom = true;
      this.controls.minDistance = 1;
      this.controls.maxDistance = 10;
      this.controls.minPolarAngle = 0; // Can look straight up
      this.controls.maxPolarAngle = Math.PI / 2 + 0.1; // Can't look below horizon much
    } catch (error) {
      console.warn('Failed to load OrbitControls:', error);
    }
  }

  public updatePlanets(planetPositions: PlanetaryPosition3D[], showLabels: boolean = true): void {
    // Clear existing planets
    this.planets.forEach(planetGroup => this.scene.remove(planetGroup));
    this.planets.clear();

    planetPositions.forEach(planetPos => {
      const planetData = PLANETARY_DATA[planetPos.planet];
      const jyotishData = JYOTISH_PLANETS[planetPos.planet as keyof typeof JYOTISH_PLANETS];
      if (!planetData || !jyotishData) return;

      // Create planet group (planet + label)
      const planetGroup = new THREE.Group();

      // Calculate position in sky coordinates (azimuth/elevation)
      // Use position data to derive sky coordinates
      const azimuth = Math.atan2(planetPos.position?.z || 0, planetPos.position?.x || 0);
      const elevation = Math.max(0.1, Math.min(Math.PI/2 - 0.1, Math.PI/4 + Math.random() * Math.PI/4));
      const distance = 300; // Fixed distance for sky view
      
      const x = distance * Math.cos(elevation) * Math.sin(azimuth);
      const y = distance * Math.sin(elevation);
      const z = distance * Math.cos(elevation) * Math.cos(azimuth);

      // Create planet sphere
      const planetRadius = planetPos.planet === 'sun' ? 8 : 
                          planetPos.planet === 'moon' ? 6 : 
                          planetPos.planet === 'jupiter' ? 5 : 3;
      
      const geometry = new THREE.SphereGeometry(planetRadius, 16, 16);
      let material: THREE.Material;
      
      // Use emissive material for sun, basic for others
      if (planetPos.planet === 'sun') {
        material = new THREE.MeshBasicMaterial({
          color: jyotishData.color,
          transparent: true,
          opacity: 1.0
        });
        // Add glow effect using a larger transparent sphere
        const glowGeometry = new THREE.SphereGeometry(planetRadius * 2, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: jyotishData.color,
          transparent: true,
          opacity: 0.3
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        planetGroup.add(glow);
      } else {
        material = new THREE.MeshBasicMaterial({
          color: jyotishData.color,
          transparent: true,
          opacity: 0.9
        });
      }

      const planetMesh = new THREE.Mesh(geometry, material);
      planetGroup.add(planetMesh);

      // Create planet label (Jyotish name)
      if (showLabels && this.showPlanetLabels) {
        this.createPlanetLabel(planetGroup, jyotishData, planetRadius);
      }

      // Position the planet group in sky
      planetGroup.position.set(x, y, z);
      planetGroup.userData = { 
        planetName: planetData.name,
        jyotishName: jyotishData.transliteration,
        sanskrit: jyotishData.sanskrit
      };

      this.planets.set(planetPos.planet, planetGroup);
      this.scene.add(planetGroup);
    });
  }

  private createPlanetLabel(planetGroup: THREE.Group, jyotishData: any, planetRadius: number): void {
    // Create canvas for text
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = 256;
    canvas.height = 64;
    
    // Set font and measure text
    context.font = '24px Arial';
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    // Draw transliterated name
    context.fillText(jyotishData.transliteration, 128, 20);
    
    // Draw Sanskrit name
    context.font = '18px Arial';
    context.fillStyle = '#cccccc';
    context.fillText(jyotishData.sanskrit, 128, 44);
    
    // Create texture and material
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    
    const labelMaterial = new THREE.SpriteMaterial({ 
      map: texture,
      transparent: true,
      alphaTest: 0.1
    });
    
    const label = new THREE.Sprite(labelMaterial);
    label.scale.set(20, 5, 1);
    label.position.set(0, planetRadius + 8, 0);
    
    planetGroup.add(label);
  }

  public animate(): void {
    if (this.animationId) return;

    const animate = () => {
      this.animationId = requestAnimationFrame(animate);
      
      // Gentle rotation for planets (very slow for realism)
      this.planets.forEach(planetGroup => {
        // Rotate the planet group slightly for a subtle effect
        planetGroup.rotation.y += 0.002;
        
        // Make planet labels always face the camera
        planetGroup.children.forEach(child => {
          if (child instanceof THREE.Sprite) {
            child.lookAt(this.camera.position);
          }
        });
      });

      // Subtle star field rotation to simulate Earth's rotation
      if (this.starField) {
        this.starField.rotation.y += 0.0001;
      }

      if (this.controls) {
        this.controls.update();
      }

      this.renderer.render(this.scene, this.camera);
    };

    animate();
  }

  public stopAnimation(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  public resize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  public dispose(): void {
    this.stopAnimation();
    
    // Dispose planet groups and their children
    this.planets.forEach(planetGroup => {
      planetGroup.children.forEach(child => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => mat.dispose());
          } else {
            child.material.dispose();
          }
        } else if (child instanceof THREE.Sprite) {
          if (child.material.map) {
            child.material.map.dispose();
          }
          child.material.dispose();
        }
      });
    });
    
    // Dispose star field
    if (this.starField) {
      this.starField.geometry.dispose();
      if (Array.isArray(this.starField.material)) {
        this.starField.material.forEach(mat => mat.dispose());
      } else {
        this.starField.material.dispose();
      }
    }
    
    // Dispose horizon
    if (this.horizon) {
      this.horizon.geometry.dispose();
      if (Array.isArray(this.horizon.material)) {
        this.horizon.material.forEach(mat => mat.dispose());
      } else {
        this.horizon.material.dispose();
      }
    }
    
    // Dispose Nakshatra lines
    this.nakshatraLines.children.forEach(child => {
      if (child instanceof THREE.Line) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach(mat => mat.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
    
    this.renderer.dispose();
  }

  // Loading component
  function LoadingVisualization() {
    return (
      <div className="w-full h-96 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-xl relative overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Loading 3D Solar System</h3>
          <p className="text-gray-300 text-sm">Calculating planetary positions...</p>
    <div className="w-full h-96 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-xl relative overflow-hidden flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Loading 3D Solar System</h3>
        <p className="text-gray-300 text-sm">Calculating planetary positions...</p>
      </div>
    </div>
  );
}

// Error component
function ErrorVisualization({ error }: { error: string }) {
  return (
    <div className="w-full h-96 bg-gradient-to-br from-red-900/20 to-purple-900/20 rounded-xl relative overflow-hidden flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-red-400 text-2xl">⚠</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">3D Visualization Error</h3>
        <p className="text-gray-300 text-sm max-w-md">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white text-sm transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

// Controls panel
function ControlsPanel({
  showOrbits,
  onToggleOrbits,
  planetCount,
  currentTime
}: {
  showOrbits: boolean;
  onToggleOrbits: () => void;
  planetCount: number;
  currentTime: Date;
}) {
  return (
    <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-4 space-y-3">
      <div className="space-y-2">
        <label className="flex items-center space-x-2 text-white text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={showOrbits}
            onChange={onToggleOrbits}
            className="rounded"
          />
          <span>Show Orbits</span>
        </label>
      </div>
      
      <div className="pt-2 border-t border-gray-600">
        <p className="text-gray-400 text-xs">
          {planetCount} celestial bodies
        </p>
        <p className="text-gray-400 text-xs mt-1">
          Use mouse to rotate, zoom, and pan
        </p>
      </div>
    </div>
  );
}

// Main component
export default function TransitVisualization3D({ 
  currentTime, 
  events, 
  selectedEvent,
  onEventSelect,
  config = {}
}: TransitVisualization3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<StellariumRenderer | null>(null);
  const [astronomicalData, setAstronomicalData] = useState<AstronomicalCalculationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOrbits, setShowOrbits] = useState(config.showOrbits ?? true);
  
  // Calculate astronomical data
  const updateAstronomicalData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!currentTime || !events) {
        throw new Error('Missing required data');
      }
      
      const data = calculateAstronomicalData(currentTime, events);
      
      if (!data || !data.planetPositions) {
        throw new Error('Failed to calculate planetary positions');
      }
      
      setAstronomicalData(data);
    } catch (err) {
      console.error('Error calculating astronomical data:', err);
      setError(err instanceof Error ? err.message : 'Failed to calculate planetary positions');
    } finally {
      setLoading(false);
    }
  }, [currentTime, events]);

  // Initialize Three.js renderer
  useEffect(() => {
    if (!canvasRef.current || loading || error || !astronomicalData) return;

    try {
      const renderer = new StellariumRenderer(canvasRef.current);
      rendererRef.current = renderer;
      
      renderer.updatePlanets(astronomicalData.planetPositions, showOrbits);
      renderer.animate();

      // Handle resize
      const handleResize = () => {
        if (canvasRef.current && renderer) {
          const rect = canvasRef.current.getBoundingClientRect();
          renderer.resize(rect.width, rect.height);
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        renderer.dispose();
      };
    } catch (err) {
      console.error('Failed to initialize 3D renderer:', err);
      setError('Failed to initialize 3D visualization');
    }
  }, [astronomicalData, loading, error, showOrbits]);

  // Update astronomical data
  useEffect(() => {
    updateAstronomicalData();
  }, [updateAstronomicalData]);

  // Update planets when data changes
  useEffect(() => {
    if (rendererRef.current && astronomicalData) {
      rendererRef.current.updatePlanets(astronomicalData.planetPositions, showOrbits);
    }
  }, [astronomicalData, showOrbits]);

  if (loading) {
    return <LoadingVisualization />;
  }

  if (error || !astronomicalData) {
    return <ErrorVisualization error={error || 'No astronomical data available'} />;
  }

  return (
    <div className="w-full h-96 bg-gradient-to-br from-purple-900/10 to-blue-900/10 rounded-xl relative overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
      
      <ControlsPanel
        showOrbits={showOrbits}
        onToggleOrbits={() => setShowOrbits(!showOrbits)}
        planetCount={astronomicalData.planetPositions.length}
        currentTime={currentTime}
      />
      
      {/* Info panel */}
      <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-4 max-w-sm">
        <h4 className="text-white font-semibold mb-2">Solar System View</h4>
        <p className="text-gray-400 text-xs">
          Time: {currentTime.toLocaleString()}
        </p>
        {astronomicalData.activeTransits.length > 0 && (
          <p className="text-purple-300 text-xs mt-1">
            {astronomicalData.activeTransits.length} active transits
          </p>
        )}
        <p className="text-gray-500 text-xs mt-2">
          Real-time 3D planetary positions
        </p>
      </div>
    </div>
  );
}