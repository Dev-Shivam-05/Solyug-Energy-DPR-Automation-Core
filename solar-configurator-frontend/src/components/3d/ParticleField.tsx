import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  count?: number;
}

/**
 * Warm floating dust motes — golden particles drifting upward,
 * like dust catching sunset light.
 */
export const ParticleField: React.FC<Props> = ({ count = 70 }) => {
  const ref = useRef<THREE.Points>(null);

  const data = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 35;
      pos[i * 3 + 1] = Math.random() * 14 - 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 35;
      speeds[i] = Math.random() * 0.25 + 0.08;
    }
    return { pos, speeds };
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    const t = clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += data.speeds[i] * 0.006;
      arr[i * 3] += Math.sin(t * 0.2 + i * 0.7) * 0.002;
      if (arr[i * 3 + 1] > 14) arr[i * 3 + 1] = -2;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={data.pos} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#fbbf24"
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
