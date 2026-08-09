import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshDistortMaterial, Float } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../providers';
import { OrbField, type OrbSpec } from '../utils/orbPhysics';

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
 * Per-orb constants.
 *
 * These were `Math.random()` calls inside `useMemo`, which React's rules of
 * purity forbid: `useMemo` is a caching hint, not a guarantee, so the values
 * could be recomputed on a re-render and make the orbs visibly jump. Fixed
 * offsets give the same organic look and are reproducible.
 *
 * `home` is a fraction of the viewport rather than a world position so the
 * layout survives a resize; everything else is in world units. The anchors are
 * spread far enough that the three are *just* clear of contact at rest - if
 * they overlapped there, the contact springs would push against the anchor
 * springs forever and the field would never actually settle.
 */
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

/** How far each orb's surface wobbles. Purely cosmetic, so it stays out of the
 *  physics specs above. */
const ORB_DISTORT = [0.5, 0.4, 0.6];

/**
 * Plane the orbs are treated as living on. They actually straddle z -1 to -3;
 * measuring the field once in the middle keeps the cursor mapping and the
 * walls in agreement, and the parallax error over that depth is far smaller
 * than the 60px blur sitting on top of all this.
 */
const ORB_PLANE_Z = -2;

/** Runs before the orbs read their bodies. Negative priorities do not take
 *  rendering away from R3F the way positive ones do. */
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

  // Pure transcription: the frame this runs on has already been simulated by
  // `Scene`, and nothing here writes back to React.
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

/**
 * Feeds window pointer events into the field.
 *
 * R3F's own `state.pointer` is useless here: `OrbsBackdrop` puts the canvas
 * under `pointer-events: none` so the hero's text stays selectable, which also
 * means the canvas never receives an event of its own. Listening on the window
 * keeps both, and lets a click land through the headline onto the orbs behind
 * it.
 *
 * Handlers only stash coordinates - the world-space conversion and all the
 * smoothing happen inside the solver, on the frame clock.
 */
function usePointerInput(field: OrbField, canvas: HTMLCanvasElement) {
  useEffect(() => {
    let rect = canvas.getBoundingClientRect();
    let rectStale = false;

    /** Canvas-normalised coordinates: -1..1 on each axis, y up. */
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
      // Only clicks over the hero itself; the field extends past the canvas
      // for the cursor, but a click on some other section should not ripple.
      if (!point || Math.abs(point.x) > 1 || Math.abs(point.y) > 1) return;
      field.setPointer(point.x, point.y);
      field.impulse(point.x, point.y);
    };

    const onUp = (event: PointerEvent) => {
      // Touch has no hover: once the finger is up there is no cursor to react to.
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
    // The hero scrolls, so a cached rect goes stale; refresh lazily on the next
    // event that actually needs it rather than measuring on every scroll tick.
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

  // One field shared by every orb - one simulation, one pointer listener.
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

      {/* Driven off the field, so a mesh can never go missing from a body. */}
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
