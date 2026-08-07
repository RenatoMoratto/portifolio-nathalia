import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshDistortMaterial, Float } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../providers';

const ORB_COLORS_DARK = [
  '#F3D1D4', // Very Soft Rose
  '#C5B5A5', // Soft Taupe
  '#E68A9A', // Muted Blush
];

const ORB_COLORS_LIGHT = [
  '#E89CA4', // Rose (darker for visibility)
  '#A09080', // Taupe (darker for contrast)
  '#D66075', // Pink (vibrant accent)
];

/**
 * Per-orb motion constants.
 *
 * These were `Math.random()` calls inside `useMemo`, which React's rules of
 * purity forbid: `useMemo` is a caching hint, not a guarantee, so the values
 * could be recomputed on a re-render and make the orbs visibly jump. Fixed
 * offsets give the same organic look and are reproducible.
 */
const ORB_MOTION = [
  { timeOffset: 12.7, xFreq: 0.34, yFreq: 0.41 },
  { timeOffset: 58.3, xFreq: 0.47, yFreq: 0.32 },
  { timeOffset: 91.1, xFreq: 0.38, yFreq: 0.45 },
];

interface OrbPosition {
  x: number;
  y: number;
  r: number;
}

/**
 * Shared state the orbs use to avoid overlapping each other.
 *
 * Exposed as methods rather than a raw mutable ref prop: assigning into a ref
 * passed down as a prop is flagged by `react-hooks/immutability`, and a small
 * object with intent-revealing methods reads better anyway.
 */
class OrbField {
  private readonly positions: OrbPosition[] = [];
  /** Normalized pointer position, shared by every orb. */
  readonly pointer = { x: 9999, y: 9999 };

  report(index: number, position: OrbPosition) {
    this.positions[index] = position;
  }

  forEachOther(index: number, visit: (orb: OrbPosition) => void) {
    for (let i = 0; i < this.positions.length; i++) {
      if (i === index) continue;
      const orb = this.positions[i];
      if (orb) visit(orb);
    }
  }
}

interface OrbProps {
  color: string;
  position: [number, number, number];
  scale: number;
  speed: number;
  distort: number;
  index: number;
  field: OrbField;
}

function MovingOrb({ color, position, scale, speed, distort, index, field }: OrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const hoverOffset = useRef({ x: 0, y: 0 });
  const motion = ORB_MOTION[index] ?? ORB_MOTION[0];

  useFrame((state) => {
    if (!meshRef.current) return;
    const { clock, viewport } = state;
    const t = clock.getElapsedTime() * speed + motion.timeOffset;

    // Lissajous-like curves covering a good portion of the viewport.
    const width = viewport.width / 2.5;
    const height = viewport.height / 2.5;

    const baseX = Math.sin(t * motion.xFreq) * width + Math.cos(t * 0.5) * (width * 0.2);
    const baseY =
      Math.cos(t * motion.yFreq) * height + Math.sin(t * 0.3) * (height * 0.2);
    const baseZ = Math.sin(t * 0.2) * 1 - 2;

    // --- Mouse avoidance ---
    const mouseX = field.pointer.x * (viewport.width / 2);
    const mouseY = field.pointer.y * (viewport.height / 2);

    const dx = baseX - mouseX;
    const dy = baseY - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const isMobile = viewport.width < 5;
    const repulsionRadius = isMobile ? 3 : 5;
    const maxRepulsion = isMobile ? 1.5 : 2.5;

    let targetX = 0;
    let targetY = 0;

    if (dist < repulsionRadius) {
      const strength = Math.pow(1 - dist / repulsionRadius, 2);
      const force = strength * maxRepulsion;
      const angle = Math.atan2(dy, dx);
      targetX += Math.cos(angle) * force;
      targetY += Math.sin(angle) * force;
    }

    // --- Collision avoidance (keep overlap under ~40%) ---
    const myRadius = scale * 0.8;
    field.forEachOther(index, (orb) => {
      const cdx = baseX - orb.x;
      const cdy = baseY - orb.y;
      const cDist = Math.sqrt(cdx * cdx + cdy * cdy);
      const minDist = (myRadius + orb.r) * 0.6;

      if (cDist < minDist && cDist > 0.001) {
        const overlap = minDist - cDist;
        const angle = Math.atan2(cdy, cdx);
        targetX += Math.cos(angle) * overlap * 1.5;
        targetY += Math.sin(angle) * overlap * 1.5;
      }
    });

    // Smooth damping for a fluid feel.
    const damping = 0.05;
    hoverOffset.current.x += (targetX - hoverOffset.current.x) * damping;
    hoverOffset.current.y += (targetY - hoverOffset.current.y) * damping;

    const finalX = baseX + hoverOffset.current.x;
    const finalY = baseY + hoverOffset.current.y;

    meshRef.current.position.x = finalX;
    meshRef.current.position.y = finalY;
    meshRef.current.position.z = baseZ;

    field.report(index, { x: finalX, y: finalY, r: scale });

    meshRef.current.rotation.x = t * 0.1;
    meshRef.current.rotation.y = t * 0.15;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} scale={scale} position={position}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          envMapIntensity={0.5}
          clearcoat={0.2}
          clearcoatRoughness={0}
          metalness={0.1}
          roughness={0.4}
          distort={distort}
          speed={3}
          transparent
          opacity={0.8}
        />
      </mesh>
    </Float>
  );
}

function Scene({ isDark }: { isDark: boolean }) {
  const { viewport } = useThree();
  const isMobile = viewport.width < 5;
  const colors = isDark ? ORB_COLORS_DARK : ORB_COLORS_LIGHT;

  // One field shared by every orb - and one pointer listener instead of three.
  const fieldRef = useRef<OrbField>(null);
  fieldRef.current ??= new OrbField();
  const field = fieldRef.current;

  useFrame(({ pointer }) => {
    field.pointer.x = pointer.x;
    field.pointer.y = pointer.y;
  });

  return (
    <group>
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#fff0f0" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#f0f0ff" />

      <MovingOrb
        index={0}
        color={colors[0]}
        position={[2, 1, -1]}
        scale={isMobile ? 1.5 : 2.5}
        speed={0.2}
        distort={0.5}
        field={field}
      />
      <MovingOrb
        index={1}
        color={colors[1]}
        position={[-2, -1, -2]}
        scale={isMobile ? 1.2 : 2.0}
        speed={0.25}
        distort={0.4}
        field={field}
      />
      <MovingOrb
        index={2}
        color={colors[2]}
        position={[0, 0, -3]}
        scale={isMobile ? 1.0 : 1.8}
        speed={0.15}
        distort={0.6}
        field={field}
      />
    </group>
  );
}

interface OrganicOrbsProps {
  /** Pause rendering entirely while the hero is off-screen. */
  active?: boolean;
}

/**
 * The animated 3D backdrop.
 *
 * Default-exported as well so it can be `React.lazy`-loaded - importing this
 * module pulls in three, @react-three/fiber and drei, which together dominate
 * the bundle and are needed by nothing else.
 */
export function OrganicOrbs({ active = true }: OrganicOrbsProps) {
  const { isDark } = useTheme();

  return (
    <>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 2]}
        // Stop burning GPU/battery at 60fps when the hero is scrolled away.
        frameloop={active ? 'always' : 'never'}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Scene isDark={isDark} />
      </Canvas>
      <div className="absolute inset-0 bg-light-bg/30 dark:bg-dark-bg/30 backdrop-blur-[60px]" />
    </>
  );
}

export default OrganicOrbs;
