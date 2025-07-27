export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface PlanetPosition {
  planet: string;
  longitude: number;
  speed: number;
  nakshatra: string;
  nakshatraSanskrit: string;
  pada: number;
  nakshatraLord: string;
  deity: string;
  nature: string;
  sign: string;
  signLord: string;
  house: number;
  siderealLongitude: number;
  position: Vector3D; // For 3D rendering
}

export interface PlanetaryData {
  source: string;
  date: string;
  julianDay: number;
  ayanamsa: {
    name: string;
    value: number;
  };
  positions: PlanetPosition[];
  moonPhase: {
    phase: number;
    angle: number;
    illumination: number;
    name: string;
  };
  siderealTime: number;
}

export interface TransitVisualization3DProps {
  currentTime: Date;
  planetaryData: PlanetaryData | null;
}

export interface AstronomicalCalculationResult {
  planetPositions: PlanetPosition[];
  moonPhase: PlanetaryData['moonPhase'];
  siderealTime: number;
}

export interface PlanetaryPosition3D extends PlanetPosition {
  velocity: Vector3D;
  radius: number;
  color: string;
  orbitRadius: number;
  orbitSpeed: number;
  rotationSpeed: number;
  inclination: number;
  eccentricity: number;
  longitudeOfAscendingNode: number;
  argumentOfPeriapsis: number;
  meanAnomaly: number;
}

export interface VisualizationConfig {
  showOrbits: boolean;
  showLabels: boolean;
  animationSpeed: number;
  cameraDistance: number;
  timeScale: number;
}

export interface Scene3DConfig {
  cameraPosition: Vector3D;
  cameraTarget: Vector3D;
  ambientLightIntensity: number;
  directionalLightIntensity: number;
  directionalLightPosition: Vector3D;
  backgroundColor: string;
  fogNear: number;
  fogFar: number;
  fogColor: string;
}

export interface InteractionState {
  isRotating: boolean;
  isPanning: boolean;
  isZooming: boolean;
  selectedPlanet: string | null;
  hoveredPlanet: string | null;
  cameraControls: {
    enableRotate: boolean;
    enablePan: boolean;
    enableZoom: boolean;
    autoRotate: boolean;
    autoRotateSpeed: number;
  };
}

export interface AnimationState {
  isPlaying: boolean;
  speed: number;
  currentTime: Date;
  timeScale: number; // seconds per frame
  loop: boolean;
}

export interface OrbitalElements {
  semiMajorAxis: number; // AU
  eccentricity: number;
  inclination: number; // degrees
  longitudeOfAscendingNode: number; // degrees
  argumentOfPeriapsis: number; // degrees
  meanAnomalyAtEpoch: number; // degrees
  epoch: Date;
}