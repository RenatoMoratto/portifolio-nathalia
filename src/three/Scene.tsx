import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useMousePosition } from '../hooks/useMousePosition';

function ParticleCloud() {
  const ref = useRef<THREE.Points>(null);
  const { normalizedPosition } = useMousePosition();

  const particles = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // eslint-disable-next-line react-hooks/purity
      positions[i3] = (Math.random() - 0.5) * 10;
      // eslint-disable-next-line react-hooks/purity
      positions[i3 + 1] = (Math.random() - 0.5) * 10;
      // eslint-disable-next-line react-hooks/purity
      positions[i3 + 2] = (Math.random() - 0.5) * 10;
    }

    return positions;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;

    const time = state.clock.getElapsedTime();
    ref.current.rotation.x = time * 0.05 + normalizedPosition.y * 0.1;
    ref.current.rotation.y = time * 0.08 + normalizedPosition.x * 0.1;
  });

  return (
    <Points ref={ref} positions={particles} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#6366f1"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.8}
      />
    </Points>
  );
}

function FloatingGeometry() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { normalizedPosition } = useMousePosition();

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.x = time * 0.3 + normalizedPosition.y * 0.2;
    meshRef.current.rotation.y = time * 0.2 + normalizedPosition.x * 0.2;
    meshRef.current.position.y = Math.sin(time * 0.5) * 0.3;
  });

  return (
    <mesh ref={meshRef} position={[2, 0, -2]}>
      <icosahedronGeometry args={[1, 1]} />
      <meshBasicMaterial color="#6366f1" wireframe transparent opacity={0.3} />
    </mesh>
  );
}

export function Scene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <ParticleCloud />
        <FloatingGeometry />
      </Canvas>
    </div>
  );
}
