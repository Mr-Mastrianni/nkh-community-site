'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const CosmicBackground = ({ onPlanetFocus }: { onPlanetFocus?: (planetName: string | null) => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const starsRef = useRef<THREE.Points | null>(null);
  const planetsRef = useRef<THREE.Group | null>(null);
  const milkyWayRef = useRef<THREE.Mesh | null>(null);
  const focusedPlanetRef = useRef<string | null>(null);
  const planetObjectsRef = useRef<Record<string, THREE.Mesh>>({});

  // Create a ref to store the focus function so it can be accessed externally
  const focusOnPlanetRef = useRef<(planetName: string | null) => void>();

  useEffect(() => {
    if (!containerRef.current) return;

    // Check if WebGL is supported
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      const warning = document.createElement('div');
      warning.innerHTML = 'WebGL is not supported on this device.';
      warning.style.cssText = 'color: white; text-align: center; padding: 20px;';
      containerRef.current.appendChild(warning);
      return;
    }

    // Initialize scene with deep space background
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000511); // Deep space blue-black
    sceneRef.current = scene;

    // Initialize camera with wider field of view for astronomical perspective
    const camera = new THREE.PerspectiveCamera(
      90,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.set(0, 0, 0);
    cameraRef.current = camera;

    // Initialize renderer with better settings for space
    const renderer = new THREE.WebGLRenderer({
      alpha: false,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.8;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create realistic starfield like Stellarium
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = window.innerWidth < 768 ? 2000 : 4000;
    const starsPositions = new Float32Array(starsCount * 3);
    const starsColors = new Float32Array(starsCount * 3);
    const starsSizes = new Float32Array(starsCount);

    // Realistic star colors based on stellar classification
    const stellarTypes = [
      { color: new THREE.Color(0x9bb0ff), weight: 0.76 }, // O-type: Blue
      { color: new THREE.Color(0xaabfff), weight: 0.13 }, // B-type: Blue-white
      { color: new THREE.Color(0xcad7ff), weight: 0.06 }, // A-type: White
      { color: new THREE.Color(0xf8f7ff), weight: 0.03 }, // F-type: Yellow-white
      { color: new THREE.Color(0xfff4ea), weight: 0.076 }, // G-type: Yellow (like our Sun)
      { color: new THREE.Color(0xffd2a1), weight: 0.121 }, // K-type: Orange
      { color: new THREE.Color(0xffad51), weight: 0.76 }, // M-type: Red
    ];

    for (let i = 0; i < starsCount; i++) {
      const i3 = i * 3;

      // Distribute stars on celestial sphere (realistic sky dome)
      const radius = 1500;
      const theta = Math.random() * Math.PI * 2; // Azimuth
      const phi = Math.acos(1 - 2 * Math.random()); // Elevation (uniform distribution)

      starsPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      starsPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starsPositions[i3 + 2] = radius * Math.cos(phi);

      // Select star color based on stellar classification weights
      let random = Math.random();
      let selectedType = stellarTypes[stellarTypes.length - 1];

      for (const type of stellarTypes) {
        if (random < type.weight) {
          selectedType = type;
          break;
        }
        random -= type.weight;
      }

      starsColors[i3] = selectedType.color.r;
      starsColors[i3 + 1] = selectedType.color.g;
      starsColors[i3 + 2] = selectedType.color.b;

      // Realistic star magnitude distribution (most stars are dim)
      const magnitude = Math.random();
      if (magnitude < 0.1) {
        starsSizes[i] = 3 + Math.random() * 2; // Bright stars
      } else if (magnitude < 0.3) {
        starsSizes[i] = 2 + Math.random(); // Medium stars
      } else {
        starsSizes[i] = 0.5 + Math.random() * 1.5; // Dim stars
      }
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(starsColors, 3));
    starsGeometry.setAttribute('size', new THREE.BufferAttribute(starsSizes, 1));

    const starsMaterial = new THREE.PointsMaterial({
      size: 1,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    starsRef.current = stars;

    // Create realistic planets like in Stellarium
    const planetsGroup = new THREE.Group();

    // Planet data with realistic colors and sizes
    const planetData = [
      { name: 'Mercury', color: 0x8c7853, size: 2, distance: 200, speed: 0.004 },
      { name: 'Venus', color: 0xffc649, size: 3, distance: 250, speed: 0.003 },
      { name: 'Mars', color: 0xcd5c5c, size: 2.5, distance: 300, speed: 0.002 },
      { name: 'Jupiter', color: 0xd8ca9d, size: 8, distance: 400, speed: 0.001 },
      { name: 'Saturn', color: 0xfad5a5, size: 6, distance: 500, speed: 0.0008 },
    ];

    planetData.forEach((planet, index) => {
      const planetGeometry = new THREE.SphereGeometry(planet.size, 16, 16);
      const planetMaterial = new THREE.MeshBasicMaterial({
        color: planet.color,
        transparent: true,
        opacity: 0.9
      });

      const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
      planetMesh.name = planet.name; // Set the name for identification

      // Position planets at different angles
      const angle = (index / planetData.length) * Math.PI * 2;
      planetMesh.position.set(
        Math.cos(angle) * planet.distance,
        Math.sin(angle * 0.3) * 50, // Slight vertical variation
        Math.sin(angle) * planet.distance
      );

      // Store orbital data for animation
      planetMesh.userData = {
        distance: planet.distance,
        speed: planet.speed,
        angle: angle
      };

      planetsGroup.add(planetMesh);
      planetObjectsRef.current[planet.name] = planetMesh; // Store reference for focusing
    });

    scene.add(planetsGroup);
    planetsRef.current = planetsGroup;

    // Create subtle Milky Way band
    const milkyWayGeometry = new THREE.PlaneGeometry(3000, 200);
    const milkyWayMaterial = new THREE.MeshBasicMaterial({
      color: 0x4a5568,
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide
    });

    const milkyWay = new THREE.Mesh(milkyWayGeometry, milkyWayMaterial);
    milkyWay.rotation.x = Math.PI / 2;
    milkyWay.position.y = -100;
    scene.add(milkyWay);
    milkyWayRef.current = milkyWay;

    // Handle resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;

      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Handle scroll for parallax effect
    const handleScroll = () => {
      if (!cameraRef.current) return;

      const scrollY = window.scrollY;
      cameraRef.current.position.y = -scrollY * 0.01;
    };

    window.addEventListener('scroll', handleScroll);

    // Animation loop
    let frameId: number;
    let time = 0;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      time += 0.01;

      // Subtle star twinkling like real stars
      if (starsRef.current) {
        // Very slow celestial sphere rotation
        starsRef.current.rotation.y += 0.00005;

        // Gentle twinkling effect
        const starsMaterial = starsRef.current.material as THREE.PointsMaterial;
        starsMaterial.opacity = 0.85 + Math.sin(time * 1.5) * 0.05;
      }

      // Realistic planetary motion
      if (planetsRef.current) {
        planetsRef.current.children.forEach((planet) => {
          const mesh = planet as THREE.Mesh;
          const userData = mesh.userData;

          // Update orbital angle
          userData.angle += userData.speed;

          // Update planet position in orbit
          mesh.position.x = Math.cos(userData.angle) * userData.distance;
          mesh.position.z = Math.sin(userData.angle) * userData.distance;

          // Add slight vertical oscillation for realism
          mesh.position.y = Math.sin(userData.angle * 0.3) * 20;

          // Highlight focused planet
          if (focusedPlanetRef.current === mesh.name) {
            (mesh.material as THREE.MeshBasicMaterial).emissive = new THREE.Color(0xffffff);
            (mesh.material as THREE.MeshBasicMaterial).emissiveIntensity = 0.8;
            // Make the planet slightly larger when focused
            mesh.scale.set(1.2, 1.2, 1.2);
          } else {
            (mesh.material as THREE.MeshBasicMaterial).emissive = new THREE.Color(0x000000);
            (mesh.material as THREE.MeshBasicMaterial).emissiveIntensity = 0;
            // Reset scale for non-focused planets
            mesh.scale.set(1, 1, 1);
          }
        });
      }

      // Subtle Milky Way movement
      if (milkyWayRef.current) {
        milkyWayRef.current.rotation.z += 0.00002;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // Function to focus on a planet
    const focusOnPlanet = (planetName: string | null) => {
      focusedPlanetRef.current = planetName;
      if (onPlanetFocus) {
        onPlanetFocus(planetName);
      }
      
      // Highlight the focused planet
      if (planetsRef.current) {
        planetsRef.current.children.forEach((planet) => {
          const mesh = planet as THREE.Mesh;
          if (mesh.name === planetName) {
            (mesh.material as THREE.MeshBasicMaterial).emissive = new THREE.Color(0xffffff);
            (mesh.material as THREE.MeshBasicMaterial).emissiveIntensity = 0.8;
            // Make the planet slightly larger when focused
            mesh.scale.set(1.2, 1.2, 1.2);
          } else {
            (mesh.material as THREE.MeshBasicMaterial).emissive = new THREE.Color(0x000000);
            (mesh.material as THREE.MeshBasicMaterial).emissiveIntensity = 0;
            // Reset scale for non-focused planets
            mesh.scale.set(1, 1, 1);
          }
        });
      }
    };

    // Store the focus function in the ref
    focusOnPlanetRef.current = focusOnPlanet;

    // Make focusOnPlanet available externally through a more React-friendly approach
    if (typeof window !== 'undefined') {
      (window as any).focusOnPlanet = focusOnPlanet;
    }

    // Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);

      if (rendererRef.current && rendererRef.current.domElement && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }

      // Dispose geometries and materials
      if (starsRef.current) {
        starsRef.current.geometry.dispose();
        (starsRef.current.material as THREE.Material).dispose();
      }

      if (planetsRef.current) {
        planetsRef.current.children.forEach(planet => {
          const mesh = planet as THREE.Mesh;
          mesh.geometry.dispose();
          (mesh.material as THREE.Material).dispose();
        });
      }

      if (milkyWayRef.current) {
        milkyWayRef.current.geometry.dispose();
        (milkyWayRef.current.material as THREE.Material).dispose();
      }

      // Clean up global function
      delete (window as any).focusOnPlanet;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[-1] pointer-events-none"
      aria-hidden="true"
    ></div>
  );
};

export default CosmicBackground;