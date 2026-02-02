import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshDistortMaterial, Float } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

const ORB_COLORS = [
  '#E8B4B8', // Soft Rose
  '#9A8A7A', // Warm Taupe
  '#DF5068', // Deep Pink
];

interface OrbProps {
  color: string;
  position: [number, number, number];
  scale: number;
  speed: number;
  distort: number;
  index: number;
}

function MovingOrb({ color, position, scale, speed, distort }: OrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  // Random offsets for movement to make it feel organic
  const timeOffset = useMemo(() => Math.random() * 100, []);
  const xFreq = useMemo(() => 0.3 + Math.random() * 0.2, []);
  const yFreq = useMemo(() => 0.3 + Math.random() * 0.2, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    const t = time * speed + timeOffset;

    // Movement: complex Lissajous-like curves for organic feel
    // Covering a good portion of the screen based on viewport
    const width = viewport.width / 2.5;
    const height = viewport.height / 2.5;

    // Smooth movement
    meshRef.current.position.x =
      Math.sin(t * xFreq) * width + Math.cos(t * 0.5) * (width * 0.2);
    meshRef.current.position.y =
      Math.cos(t * yFreq) * height + Math.sin(t * 0.3) * (height * 0.2);
    // Slight Z movement for depth parallax
    meshRef.current.position.z = Math.sin(t * 0.2) * 1 - 2;

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
          envMapIntensity={0.75}
          clearcoat={0.3}
          clearcoatRoughness={0}
          metalness={0.1}
          roughness={0.2} // Smooth liquid look
          distort={distort} // Strength of the distortion
          speed={3} // Speed of the distortion
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  const { viewport } = useThree();
  const isMobile = viewport.width < 5;

  return (
    <group>
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#fff0f0" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#f0f0ff" />

      {/* Orb 1: Rose - Large */}
      <MovingOrb
        index={0}
        color={ORB_COLORS[0]}
        position={[2, 1, -1]}
        scale={isMobile ? 1.5 : 2.5}
        speed={0.2}
        distort={0.5}
      />

      {/* Orb 2: Taupe - Medium */}
      <MovingOrb
        index={1}
        color={ORB_COLORS[1]}
        position={[-2, -1, -2]}
        scale={isMobile ? 1.2 : 2.0}
        speed={0.25}
        distort={0.4}
      />

      {/* Orb 3: Pink - Small/Accent */}
      <MovingOrb
        index={2}
        color={ORB_COLORS[2]}
        position={[0, 0, -3]}
        scale={isMobile ? 1.0 : 1.8}
        speed={0.15}
        distort={0.6}
      />
    </group>
  );
}

interface OrganicOrbsProps {
  className?: string;
}

export function OrganicOrbs({ className }: OrganicOrbsProps) {
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
        <Scene />
      </Canvas>
    </div>
  );
}
