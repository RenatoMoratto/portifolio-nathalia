import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshDistortMaterial, Float } from '@react-three/drei';
import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useTheme } from '../providers';

const ORB_COLORS_DARK = [
  '#F3D1D4', // Very Soft Rose
  '#C5B5A5', // Soft Taupe
  '#E68A9A', // Muted Blush
];

const ORB_COLORS_LIGHT = [
  '#E89CA4', // Rose (Darker for visibility)
  '#A09080', // Taupe (Darker for contrast)
  '#D66075', // Pink (Vibrant accent)
];

interface OrbProps {
  color: string;
  position: [number, number, number];
  scale: number;
  speed: number;
  distort: number;
  index: number;
  orbPositions: React.MutableRefObject<Array<{ x: number; y: number; r: number }>>;
}

function MovingOrb({
  color,
  position,
  scale,
  speed,
  distort,
  index,
  orbPositions,
}: OrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const hoverOffset = useRef({ x: 0, y: 0 });
  const mouseRef = useRef({ x: 9999, y: 9999 });

  // Add global mouse listener
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Random offsets for movement to make it feel organic
  const timeOffset = useMemo(() => Math.random() * 100, []);
  const xFreq = useMemo(() => 0.3 + Math.random() * 0.2, []);
  const yFreq = useMemo(() => 0.3 + Math.random() * 0.2, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const { clock, viewport } = state;
    const time = clock.getElapsedTime();
    const t = time * speed + timeOffset;

    // Movement: complex Lissajous-like curves for organic feel
    // Covering a good portion of the screen based on viewport
    const width = viewport.width / 2.5;
    const height = viewport.height / 2.5;

    // Base Autonomous Calc
    const baseX = Math.sin(t * xFreq) * width + Math.cos(t * 0.5) * (width * 0.2);
    const baseY = Math.cos(t * yFreq) * height + Math.sin(t * 0.3) * (height * 0.2);
    // Slight Z movement for depth parallax
    const baseZ = Math.sin(t * 0.2) * 1 - 2;

    // --- Mouse Avoidance Logic ---
    const mouseX = mouseRef.current.x * (viewport.width / 2);
    const mouseY = mouseRef.current.y * (viewport.height / 2);

    const dx = baseX - mouseX;
    const dy = baseY - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Interaction config
    const isMobile = viewport.width < 5;
    const repulsionRadius = isMobile ? 3 : 5;
    const maxRepulsion = isMobile ? 1.5 : 2.5;

    let targetX = 0;
    let targetY = 0;

    if (dist < repulsionRadius) {
      // Smooth organic falloff
      const strength = Math.pow(1 - dist / repulsionRadius, 2);
      const force = strength * maxRepulsion;

      // Direction
      const angle = Math.atan2(dy, dx);
      targetX += Math.cos(angle) * force;
      targetY += Math.sin(angle) * force;
    }

    // --- Collision Avoidance Logic (Max 40% overlap) ---
    const myRadius = scale * 0.8; // Approximate visual core

    orbPositions.current.forEach((orb, i) => {
      if (i === index) return; // Skip self

      const cdx = baseX - orb.x;
      const cdy = baseY - orb.y;
      const cDist = Math.sqrt(cdx * cdx + cdy * cdy);

      // "Don't overlap more than 40%" means keep distance > (r1 + r2) * 0.6
      const minDist = (myRadius + orb.r) * 0.6;

      if (cDist < minDist && cDist > 0.001) {
        const overlap = minDist - cDist;
        const angle = Math.atan2(cdy, cdx);
        // Soft push to resolve overlap
        targetX += Math.cos(angle) * overlap * 1.5;
        targetY += Math.sin(angle) * overlap * 1.5;
      }
    });

    // Smooth damping (Fluid/Organic feel)
    const damping = 0.05;
    hoverOffset.current.x += (targetX - hoverOffset.current.x) * damping;
    hoverOffset.current.y += (targetY - hoverOffset.current.y) * damping;

    // Apply combined position
    const finalX = baseX + hoverOffset.current.x;
    const finalY = baseY + hoverOffset.current.y;

    meshRef.current.position.x = finalX;
    meshRef.current.position.y = finalY;
    meshRef.current.position.z = baseZ;

    // Update shared state for other orbs
    orbPositions.current[index] = { x: finalX, y: finalY, r: scale * 1.0 };

    // Rotate slowly
    meshRef.current.rotation.x = t * 0.1;
    meshRef.current.rotation.y = t * 0.15;
  });

  return (
    <Float
      speed={2} // Animation speed
      rotationIntensity={0.5} // XYZ rotation intensity
      floatIntensity={0.5} // Up/down float intensity
    >
      <mesh ref={meshRef} scale={scale} position={position}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          envMapIntensity={0.5}
          clearcoat={0.2}
          clearcoatRoughness={0}
          metalness={0.1}
          roughness={0.4} // Softer surface
          distort={distort} // Strength of the distortion
          speed={3} // Speed of the distortion
          transparent
          opacity={0.8}
        />
      </mesh>
    </Float>
  );
}

interface SceneProps {
  isDark: boolean;
}

function Scene({ isDark }: SceneProps) {
  const { viewport } = useThree();
  const isMobile = viewport.width < 5;
  const colors = isDark ? ORB_COLORS_DARK : ORB_COLORS_LIGHT;

  // Shared state for collision detection
  const orbPositions = useRef<Array<{ x: number; y: number; r: number }>>([
    { x: 0, y: 0, r: 0 },
    { x: 0, y: 0, r: 0 },
    { x: 0, y: 0, r: 0 },
  ]);

  return (
    <group>
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#fff0f0" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#f0f0ff" />

      {/* Orb 1: Rose - Large */}
      <MovingOrb
        index={0}
        color={colors[0]}
        position={[2, 1, -1]}
        scale={isMobile ? 1.5 : 2.5}
        speed={0.2}
        distort={0.5}
        orbPositions={orbPositions}
      />

      {/* Orb 2: Taupe - Medium */}
      <MovingOrb
        index={1}
        color={colors[1]}
        position={[-2, -1, -2]}
        scale={isMobile ? 1.2 : 2.0}
        speed={0.25}
        distort={0.4}
        orbPositions={orbPositions}
      />

      {/* Orb 3: Pink - Small/Accent */}
      <MovingOrb
        index={2}
        color={colors[2]}
        position={[0, 0, -3]}
        scale={isMobile ? 1.0 : 1.8}
        speed={0.15}
        distort={0.6}
        orbPositions={orbPositions}
      />
    </group>
  );
}

interface OrganicOrbsProps {
  className?: string;
}

export function OrganicOrbs({ className }: OrganicOrbsProps) {
  const { isDark } = useTheme();

  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  }, []);

  if (prefersReducedMotion) {
    return (
      <div className={`absolute inset-0 overflow-hidden ${className}`}>
        {/* Static fallback using CSS gradients similar to original but simpler */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-rose-300/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/5 w-80 h-80 bg-stone-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-pink-400/20 rounded-full blur-3xl" />
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 2]} // Support high pixel density
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <Scene isDark={isDark} />
      </Canvas>
      <div className="absolute inset-0 bg-light-bg/30 dark:bg-dark-bg/30 backdrop-blur-[60px]" />
    </div>
  );
}
