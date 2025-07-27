'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface Graha {
  id: string;
  name: string;
  sanskrit: string;
  color: string;
  description: string;
}

interface Planet3DViewerProps {
  graha: Graha;
}

const Planet3DViewer = ({ graha }: Planet3DViewerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const planetRef = useRef<THREE.Mesh | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize the 3D scene
  useEffect(() => {
    if (!canvasRef.current) return;

    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Add point lights for more dramatic effect
    const pointLight1 = new THREE.PointLight(graha.color, 1, 100);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffffff, 0.5, 100);
    pointLight2.position.set(-10, -10, -10);
    scene.add(pointLight2);

    // Add stars background
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
      transparent: true
    });

    const starsVertices = [];
    for (let i = 0; i < 5000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(starsVertices, 3)
    );

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controlsRef.current = controls;

    // Handle resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current || !canvasRef.current) return;
      
      cameraRef.current.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    setIsInitialized(true);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
    };
  }, []);

  // Create/update the planet when graha changes
  useEffect(() => {
    if (!sceneRef.current || !isInitialized) return;

    // Remove existing planet if any
    if (planetRef.current) {
      sceneRef.current.remove(planetRef.current);
      if (planetRef.current.geometry) planetRef.current.geometry.dispose();
      if (planetRef.current.material) {
        if (Array.isArray(planetRef.current.material)) {
          planetRef.current.material.forEach(material => material.dispose());
        } else {
          planetRef.current.material.dispose();
        }
      }
    }

    // Create new planet based on graha
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    
    // Create material with color and some effects
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(graha.color),
      roughness: 0.2,
      metalness: 0.8,
      emissive: new THREE.Color(graha.color),
      emissiveIntensity: 0.2
    });

    const planet = new THREE.Mesh(geometry, material);
    sceneRef.current.add(planet);
    planetRef.current = planet;

    // Add glow effect for special grahas
    if (graha.id === 'sun' || graha.id === 'rahu' || graha.id === 'ketu') {
      const glowGeometry = new THREE.SphereGeometry(1.1, 32, 32);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(graha.color),
        transparent: true,
        opacity: 0.3
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      planet.add(glow);
    }

    // Add rings for Saturn
    if (graha.id === 'saturn') {
      const ringGeometry = new THREE.RingGeometry(1.5, 2.5, 64);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(graha.color),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 3;
      planet.add(ring);
    }
  }, [graha, isInitialized]);

  // Animation loop
  useEffect(() => {
    if (!isInitialized) return;

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      if (planetRef.current) {
        // Rotate the planet
        planetRef.current.rotation.y += 0.005;
        
        // Special rotation for Saturn's rings
        if (graha.id === 'saturn' && planetRef.current.children.length > 0) {
          planetRef.current.children[0].rotation.z += 0.002;
        }
      }
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [isInitialized, graha.id]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full rounded-lg"
        style={{ display: 'block' }}
      />
    </div>
  );
};

export default Planet3DViewer;