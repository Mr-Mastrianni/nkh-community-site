import * as THREE from 'three';
import { 
  Vector3D, 
  PlanetaryPosition3D, 
  Scene3DConfig, 
  InteractionState,
  AnimationState,
  PlanetaryData 
} from '@/lib/types/planetary-events';
import { PLANETARY_DATA } from './astronomical-calculations';

export class ThreeSceneManager {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private planets: Map<string, THREE.Mesh> = new Map();
  private orbits: Map<string, THREE.Line> = new Map();
  private planetLabels: Map<string, THREE.Sprite> = new Map();
  private animationId: number | null = null;
  private clock: THREE.Clock;
  private controls: any; // OrbitControls type
  
  // Scene configuration
  private config: Scene3DConfig = {
    cameraPosition: { x: 0, y: 50, z: 100 },
    cameraTarget: { x: 0, y: 0, z: 0 },
    ambientLightIntensity: 0.3,
    directionalLightIntensity: 1.0,
    directionalLightPosition: { x: 10, y: 10, z: 5 },
    backgroundColor: '#0a0a0a',
    fogNear: 100,
    fogFar: 1000,
    fogColor: '#0a0a0a'
  };

  constructor(canvas: HTMLCanvasElement, config?: Partial<Scene3DConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }

    this.clock = new THREE.Clock();
    this.initializeScene();
    this.initializeCamera();
    this.initializeRenderer(canvas);
    this.initializeLighting();
    this.initializeControls();
    this.createStarField();
  }

  private initializeScene(): void {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.config.backgroundColor);
    this.scene.fog = new THREE.Fog(
      this.config.fogColor,
      this.config.fogNear,
      this.config.fogFar
    );
  }

  private initializeCamera(): void {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    
    this.camera.position.set(
      this.config.cameraPosition.x,
      this.config.cameraPosition.y,
      this.config.cameraPosition.z
    );
    
    this.camera.lookAt(
      this.config.cameraTarget.x,
      this.config.cameraTarget.y,
      this.config.cameraTarget.z
    );
  }

  private initializeRenderer(canvas: HTMLCanvasElement): void {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      stencil: false,
      depth: true,
      precision: "highp"
    });
    
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.8;
    
    // Advanced performance optimizations for 60fps target
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.autoUpdate = false;
    this.renderer.shadowMap.needsUpdate = true;
    
    // Enable frustum culling
    this.renderer.localClippingEnabled = true;
    
    // GPU pipeline optimizations
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.sortObjects = false;
    this.renderer.autoClear = true;
    
    // Enable advanced features for PBR
    this.renderer.toneMappingExposure = 1.0;
    
    // Performance monitoring
    this.renderer.info.autoReset = false;
  }

  private initializeLighting(): void {
    // Enhanced PBR lighting system with physically based rendering
    const ambientLight = new THREE.AmbientLight(
      0x1a1a2e,
      this.config.ambientLightIntensity * 0.8
    );
    this.scene.add(ambientLight);

    // Main directional light (Sun) with PBR optimization
    const directionalLight = new THREE.DirectionalLight(
      0xfff5e6,
      this.config.directionalLightIntensity * 1.2
    );
    
    directionalLight.position.set(
      this.config.directionalLightPosition.x,
      this.config.directionalLightPosition.y,
      this.config.directionalLightPosition.z
    );
    
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 1000;
    directionalLight.shadow.camera.left = -200;
    directionalLight.shadow.camera.right = 200;
    directionalLight.shadow.camera.top = 200;
    directionalLight.shadow.camera.bottom = -200;
    directionalLight.shadow.bias = -0.0001;
    
    this.scene.add(directionalLight);

    // Enhanced sun light for PBR materials
    const sunLight = new THREE.PointLight(0xffffff, 3.0, 2000);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 4096;
    sunLight.shadow.mapSize.height = 4096;
    sunLight.shadow.bias = -0.0001;
    this.scene.add(sunLight);

    // Add hemisphere light for better PBR lighting
    const hemisphereLight = new THREE.HemisphereLight(
      0x87ceeb, // sky color
      0x1a1a2e, // ground color
      0.8 // intensity
    );
    this.scene.add(hemisphereLight);
  }

  private async initializeControls(): Promise<void> {
    // Dynamically import OrbitControls to avoid SSR issues
    try {
      const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.screenSpacePanning = false;
      this.controls.minDistance = 10;
      this.controls.maxDistance = 2000;
      this.controls.maxPolarAngle = Math.PI;
      this.controls.autoRotate = false;
      this.controls.autoRotateSpeed = 0.5;
    } catch (error) {
      console.warn('Failed to load OrbitControls:', error);
    }
  }

  private createStarField(): void {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.5,
      sizeAttenuation: false
    });

    const starsVertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 4000;
      const y = (Math.random() - 0.5) * 4000;
      const z = (Math.random() - 0.5) * 4000;
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    this.scene.add(stars);
  }

  public createPlanet(planetData: PlanetaryData, position: Vector3D): THREE.Mesh {
    const radius = this.scalePlanetRadius(planetData.physicalProperties.radius);
    const geometry = new THREE.SphereGeometry(radius, 64, 64);
    
    // Enhanced PBR Material with physically based rendering
    const material = new THREE.MeshStandardMaterial({
      color: planetData.physicalProperties.color,
      metalness: planetData.visualProperties?.metalness ?? (planetData.name === 'Sun' ? 0.0 : 0.1),
      roughness: planetData.visualProperties?.roughness ?? (planetData.name === 'Sun' ? 0.0 : 0.8),
      transparent: (planetData.visualProperties?.opacity ?? 1) < 1,
      opacity: planetData.visualProperties?.opacity ?? 1,
      envMapIntensity: 1.5,
      emissive: planetData.visualProperties?.emissive ? new THREE.Color(planetData.visualProperties.emissive) : new THREE.Color(0x000000),
      emissiveIntensity: planetData.name === 'Sun' ? 1.0 : 0.1
    });

    // Add texture support for planets with PBR textures
    if (planetData.visualProperties?.textureUrl) {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(planetData.visualProperties.textureUrl, (texture) => {
        texture.encoding = THREE.sRGBEncoding;
        material.map = texture;
        material.needsUpdate = true;
      });
    }

    // Add normal map support for enhanced surface detail
    if (planetData.visualProperties?.normalMap) {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(planetData.visualProperties.normalMap, (texture) => {
        texture.encoding = THREE.sRGBEncoding;
        material.normalMap = texture;
        material.normalScale.set(0.5, 0.5);
        material.needsUpdate = true;
      });
    }

    const planet = new THREE.Mesh(geometry, material);
    planet.position.set(
      position.x / 1000000, // Scale down from km to manageable units
      position.y / 1000000,
      position.z / 1000000
    );
    
    planet.castShadow = planetData.name !== 'Sun';
    planet.receiveShadow = planetData.name !== 'Sun';
    planet.userData = {
      planetName: planetData.name,
      originalRadius: radius,
      isPBR: true
    };

    return planet;
  }

  public createOrbit(planetData: PlanetaryData): THREE.Line {
    const orbitRadius = planetData.orbitalElements.semiMajorAxis * 10; // Scale for visibility
    const points = [];
    
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      const x = Math.cos(angle) * orbitRadius;
      const z = Math.sin(angle) * orbitRadius;
      points.push(new THREE.Vector3(x, 0, z));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: planetData.physicalProperties.color,
      opacity: 0.3,
      transparent: true
    });

    return new THREE.Line(geometry, material);
  }

  public createPlanetLabel(planetName: string, position: Vector3D): THREE.Sprite {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = 256;
    canvas.height = 64;
    
    context.fillStyle = 'rgba(0, 0, 0, 0.8)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    context.fillStyle = 'white';
    context.font = '24px Arial';
    context.textAlign = 'center';
    context.fillText(planetName, canvas.width / 2, canvas.height / 2 + 8);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(material);
    
    sprite.position.set(
      position.x / 1000000,
      position.y / 1000000 + 5,
      position.z / 1000000
    );
    
    sprite.scale.set(10, 2.5, 1);
    return sprite;
  }

  private scalePlanetRadius(actualRadius: number): number {
    // Logarithmic scaling to make planets visible while maintaining relative sizes
    const minRadius = 0.5;
    const maxRadius = 8;
    const sunRadius = 696340; // km
    
    if (actualRadius === sunRadius) return maxRadius;
    
    const logScale = Math.log(actualRadius / 2439.7) / Math.log(sunRadius / 2439.7); // Mercury as base
    return minRadius + (maxRadius - minRadius) * logScale * 0.3;
  }

  public updatePlanetaryPositions(planetPositions: PlanetaryPosition3D[]): void {
    planetPositions.forEach(planetPos => {
      const planetData = PLANETARY_DATA[planetPos.planet];
      if (!planetData) return;

      let planet = this.planets.get(planetPos.planet);
      
      if (!planet) {
        // Create planet if it doesn't exist
        planet = this.createPlanet(planetData, planetPos.position);
        this.planets.set(planetPos.planet, planet);
        this.scene.add(planet);

        // Create orbit if not the sun
        if (planetPos.planet !== 'sun') {
          const orbit = this.createOrbit(planetData);
          this.orbits.set(planetPos.planet, orbit);
          this.scene.add(orbit);
        }

        // Create label
        const label = this.createPlanetLabel(planetData.name, planetPos.position);
        this.planetLabels.set(planetPos.planet, label);
        this.scene.add(label);
      } else {
        // Update existing planet position
        planet.position.set(
          planetPos.position.x / 1000000,
          planetPos.position.y / 1000000,
          planetPos.position.z / 1000000
        );

        // Update label position
        const label = this.planetLabels.get(planetPos.planet);
        if (label) {
          label.position.set(
            planetPos.position.x / 1000000,
            planetPos.position.y / 1000000 + 5,
            planetPos.position.z / 1000000
          );
        }
      }

      // Rotate planet
      if (planet) {
        planet.rotation.y += planetPos.rotationSpeed * 0.01;
      }
    });
  }

  public setInteractionState(state: Partial<InteractionState>): void {
    if (!this.controls) return;

    if (state.cameraControls) {
      this.controls.enableRotate = state.cameraControls.enableRotate ?? true;
      this.controls.enablePan = state.cameraControls.enablePan ?? true;
      this.controls.enableZoom = state.cameraControls.enableZoom ?? true;
      this.controls.autoRotate = state.cameraControls.autoRotate ?? false;
      this.controls.autoRotateSpeed = state.cameraControls.autoRotateSpeed ?? 0.5;
    }
  }

  public highlightPlanet(planetName: string | null): void {
    // Reset all planets to normal state
    this.planets.forEach((planet, name) => {
      const material = planet.material as THREE.MeshPhongMaterial;
      material.emissiveIntensity = name === 'sun' ? 0.3 : 0;
    });

    // Highlight selected planet
    if (planetName && this.planets.has(planetName)) {
      const planet = this.planets.get(planetName)!;
      const material = planet.material as THREE.MeshPhongMaterial;
      material.emissiveIntensity = 0.2;
    }
  }

  public focusOnPlanet(planetName: string): void {
    const planet = this.planets.get(planetName);
    if (!planet || !this.controls) return;

    const planetPosition = planet.position.clone();
    const distance = 50;
    
    // Calculate camera position relative to planet
    const cameraPosition = planetPosition.clone();
    cameraPosition.z += distance;
    cameraPosition.y += distance * 0.3;

    // Animate camera to new position
    this.animateCameraTo(cameraPosition, planetPosition);
  }

  private animateCameraTo(position: THREE.Vector3, target: THREE.Vector3): void {
    const startPosition = this.camera.position.clone();
    const startTarget = this.controls?.target.clone() || new THREE.Vector3();
    
    let progress = 0;
    const duration = 2000; // 2 seconds
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      progress = Math.min(elapsed / duration, 1);
      
      // Smooth easing function
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      this.camera.position.lerpVectors(startPosition, position, easeProgress);
      if (this.controls) {
        this.controls.target.lerpVectors(startTarget, target, easeProgress);
        this.controls.update();
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }

  public startAnimation(): void {
    if (this.animationId) return;

    const animate = () => {
      this.animationId = requestAnimationFrame(animate);
      
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
    
    // Dispose of geometries and materials
    this.planets.forEach(planet => {
      planet.geometry.dispose();
      (planet.material as THREE.Material).dispose();
    });
    
    this.orbits.forEach(orbit => {
      orbit.geometry.dispose();
      (orbit.material as THREE.Material).dispose();
    });

    this.planetLabels.forEach(label => {
      label.geometry.dispose();
      (label.material as THREE.SpriteMaterial).dispose();
    });

    // Clear maps
    this.planets.clear();
    this.orbits.clear();
    this.planetLabels.clear();

    // Dispose renderer
    this.renderer.dispose();
  }

  public getRenderer(): THREE.WebGLRenderer {
    return this.renderer;
  }

  public getScene(): THREE.Scene {
    return this.scene;
  }

  public getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  // Performance monitoring methods
  public getPerformanceMetrics(): {
    fps: number;
    drawCalls: number;
    triangles: number;
    geometries: number;
    textures: number;
  } {
    const info = this.renderer.info;
    return {
      fps: Math.round(1000 / (this.clock.getDelta() * 1000)),
      drawCalls: info.render.calls,
      triangles: info.render.triangles,
      geometries: info.memory.geometries,
      textures: info.memory.textures
    };
  }

  // Mobile responsiveness
  public optimizeForMobile(): void {
    // Reduce shadow map resolution for mobile
    this.renderer.shadowMap.mapSize.width = 1024;
    this.renderer.shadowMap.mapSize.height = 1024;
    
    // Reduce geometry complexity
    this.planets.forEach(planet => {
      const geometry = planet.geometry as THREE.SphereGeometry;
      geometry.parameters.widthSegments = 32;
      geometry.parameters.heightSegments = 32;
    });
    
    // Reduce pixel ratio
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  }

  // Adaptive quality based on device capabilities
  public setQualityLevel(level: 'low' | 'medium' | 'high'): void {
    switch (level) {
      case 'low':
        this.renderer.setPixelRatio(1);
        this.renderer.shadowMap.mapSize.width = 512;
        this.renderer.shadowMap.mapSize.height = 512;
        break;
      case 'medium':
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        this.renderer.shadowMap.mapSize.width = 1024;
        this.renderer.shadowMap.mapSize.height = 1024;
        break;
      case 'high':
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.mapSize.width = 4096;
        this.renderer.shadowMap.mapSize.height = 4096;
        break;
    }
  }
}