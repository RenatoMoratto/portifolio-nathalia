import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshDistortMaterial, Float } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../providers';
import { OrbField, type OrbSpec } from '../utils/orbPhysics';

const ORB_COLORS_DARK = ['#F3D1D4', '#C5B5A5', '#E68A9A'];

// Darker tones maintain contrast on the light background.
const ORB_COLORS_LIGHT = ['#E89CA4', '#A09080', '#D66075'];

// Fixed phases avoid render jumps; separated anchors let the field settle.
const ORB_SPECS: readonly OrbSpec[] = [
  {
    scale: 2.5,
    mobileScale: 1.5,
    home: [0.42, 0.3],
    depth: -1,
    driftRate: 1,
    phase: 12.7,
  },
  {
    scale: 2.0,
    mobileScale: 1.2,
    home: [-0.42, -0.26],
    depth: -2,
    driftRate: 1.27,
    phase: 58.3,
  },
  {
    scale: 1.8,
    mobileScale: 1.0,
    home: [0, -0.06],
    depth: -3,
    driftRate: 0.83,
    phase: 91.1,
  },
];

const ORB_DISTORT = [0.5, 0.4, 0.6];

// Keep pointer mapping and bounds consistent across orb depths.
const ORB_PLANE_Z = -2;

// Simulate before meshes update without taking over rendering.
const PHYSICS_PRIORITY = -1;

interface OrbProps {
  color: string;
  distort: number;
  index: number;
  field: OrbField;
}

function MovingOrb({ color, distort, index, field }: OrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const body = field.bodies[index];

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    mesh.position.set(body.x, body.y, body.z);
    mesh.scale.setScalar(body.radius * (1 + body.pulse));
    mesh.rotation.x = body.spin * 0.6;
    mesh.rotation.y = body.spin;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} scale={body.radius} position={[body.x, body.y, body.z]}>
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

// Listen on window because the backdrop canvas ignores pointer events.
function usePointerInput(field: OrbField, canvas: HTMLCanvasElement) {
  useEffect(() => {
    let rect = canvas.getBoundingClientRect();
    let rectStale = false;

    const toField = (clientX: number, clientY: number) => {
      if (rectStale) {
        rect = canvas.getBoundingClientRect();
        rectStale = false;
      }
      if (rect.width === 0 || rect.height === 0) return null;
      return {
        x: ((clientX - rect.left) / rect.width) * 2 - 1,
        y: -(((clientY - rect.top) / rect.height) * 2 - 1),
      };
    };

    const onMove = (event: PointerEvent) => {
      const point = toField(event.clientX, event.clientY);
      if (point) field.setPointer(point.x, point.y);
    };

    const onDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      const point = toField(event.clientX, event.clientY);
      if (!point || Math.abs(point.x) > 1 || Math.abs(point.y) > 1) return;
      field.setPointer(point.x, point.y);
      field.impulse(point.x, point.y);
    };

    const onUp = (event: PointerEvent) => {
      // Touch has no hover state to preserve.
      if (event.pointerType !== 'mouse') field.releasePointer();
    };

    const onLeave = () => field.releasePointer();
    const invalidateRect = () => {
      rectStale = true;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    window.addEventListener('pointercancel', onLeave, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    window.addEventListener('blur', onLeave);
    window.addEventListener('scroll', invalidateRect, { passive: true, capture: true });
    window.addEventListener('resize', invalidateRect, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onLeave);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
      window.removeEventListener('scroll', invalidateRect, { capture: true });
      window.removeEventListener('resize', invalidateRect);
    };
  }, [field, canvas]);
}

function Scene({ isDark }: { isDark: boolean }) {
  const viewport = useThree((state) => state.viewport);
  const camera = useThree((state) => state.camera);
  const canvas = useThree((state) => state.gl.domElement);
  const isMobile = viewport.width < 5;
  const colors = isDark ? ORB_COLORS_DARK : ORB_COLORS_LIGHT;

  const fieldRef = useRef<OrbField>(null);
  fieldRef.current ??= new OrbField(ORB_SPECS);
  const field = fieldRef.current;

  useEffect(() => {
    const plane = viewport.getCurrentViewport(camera, [0, 0, ORB_PLANE_Z]);
    field.resize(plane.width / 2, plane.height / 2, isMobile);
  }, [field, viewport, camera, isMobile]);

  usePointerInput(field, canvas);

  useFrame((_, delta) => field.update(delta), PHYSICS_PRIORITY);

  return (
    <group>
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#fff0f0" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#f0f0ff" />

      {field.bodies.map((_, index) => (
        <MovingOrb
          key={index}
          index={index}
          color={colors[index % colors.length]}
          distort={ORB_DISTORT[index % ORB_DISTORT.length]}
          field={field}
        />
      ))}
    </group>
  );
}

interface OrganicOrbsProps {
  active?: boolean;
}

/** Default-exported for lazy loading. */
export function OrganicOrbs({ active = true }: OrganicOrbsProps) {
  const { isDark } = useTheme();

  return (
    <>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 2]}
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
