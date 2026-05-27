import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  systemSizeKw: number;
}

/**
 * Sunset sun arc — warm golden directional light orbiting slowly.
 * Intensity responds to system size for visual feedback.
 */
export const SunSimulation: React.FC<Props> = ({ systemSizeKw }) => {
  const sunRef = useRef<THREE.DirectionalLight>(null);

  useFrame(({ clock }) => {
    if (!sunRef.current) return;
    const t = clock.getElapsedTime() * 0.1;
    const r = 14;

    sunRef.current.position.x = Math.cos(t) * r;
    sunRef.current.position.y = Math.abs(Math.sin(t)) * 8 + 3;
    sunRef.current.position.z = Math.sin(t) * r * 0.5;

    const base = 1.6;
    const boost = Math.min(systemSizeKw * 0.1, 0.8);
    sunRef.current.intensity = base + boost + Math.sin(t * 2) * 0.04;
  });

  return (
    <>
      {/* Main warm sun */}
      <directionalLight
        ref={sunRef}
        position={[8, 10, 5]}
        intensity={2.0}
        color="#ffe4b5"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={30}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-bias={-0.0001}
      />
      {/* Deep orange fill — sunset bounce */}
      <directionalLight position={[-5, 2, -6]} intensity={0.2} color="#fb923c" />
      {/* Warm amber rim */}
      <pointLight position={[0, 8, -9]} intensity={0.6} color="#f59e0b" distance={28} decay={2} />
      {/* Low warm glow from ground bounce */}
      <pointLight position={[3, -1, 5]} intensity={0.12} color="#ea580c" distance={12} decay={2} />
      {/* Hemisphere for subtle sky/ground color */}
      <hemisphereLight intensity={0.12} color="#fde68a" groundColor="#431407" />
    </>
  );
};
