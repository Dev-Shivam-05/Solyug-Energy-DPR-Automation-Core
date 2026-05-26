import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Stars, Float, Environment } from '@react-three/drei';
import { SolarHouse } from './SolarHouse';
import { ParticleField } from './ParticleField';
import * as THREE from 'three';

interface Props {
  panelCount: number;
}

export const CanvasContainer: React.FC<Props> = ({ panelCount }) => {
  return (
    <Canvas
      camera={{ position: [11.0, 7.0, 11.5], fov: 32 }}
      shadows
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
        toneMapping: 3, // ACESFilmic
        toneMappingExposure: 1.25
      }}
    >
      {/* Deep twilight outdoor background */}
      <color attach="background" args={['#05080c']} />
      <fog attach="fog" args={['#05080c', 16, 36]} />

      {/* Realistic ambient sky reflection */}
      <ambientLight intensity={0.4} color="#e0f2fe" />

      {/* Dynamic Sunlight that slowly orbits */}
      <RotatingSun />

      {/* Cold rim lighting representing evening blue sky glow */}
      <directionalLight
        position={[-8, 6, -8]}
        intensity={0.5}
        color="#38bdf8"
      />

      {/* Star field count */}
      <Stars radius={110} depth={40} count={1800} factor={3} saturation={0.4} fade speed={0.2} />

      {/* Floating golden/sunset dust motes */}
      <ParticleField count={45} />

      <Suspense fallback={null}>
        {/* Dynamic environment map feeding specular reflections into physical materials */}
        <Environment preset="sunset" />

        {/* Float house slowly to keep scene feeling alive */}
        <Float speed={0.4} rotationIntensity={0.01} floatIntensity={0.04} floatingRange={[-0.02, 0.02]}>
          <SolarHouse panelCount={panelCount} />
        </Float>
      </Suspense>

      {/* High quality contact ground shadows */}
      <ContactShadows
        position={[0, -1.12, 0]}
        opacity={0.65}
        scale={16}
        blur={2.4}
        far={6}
        resolution={512}
        color="#020617"
      />

      {/* Smooth orbital camera limits */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        maxPolarAngle={Math.PI / 2.05} // Lock camera from going underground
        minPolarAngle={Math.PI / 6}
        minDistance={8}
        maxDistance={22}
        dampingFactor={0.05}
        enableDamping={true}
      />
    </Canvas>
  );
};

/* ═══════════════════════════════════════════════════════════════
   DYNAMIC MOVING SUN LIGHT
   Creates active, high-fidelity crawling architectural shadows.
   ═══════════════════════════════════════════════════════════════ */
const RotatingSun: React.FC = () => {
  const sunLightRef = useRef<THREE.DirectionalLight>(null);

  useFrame((state) => {
    if (!sunLightRef.current) return;
    // Slow sun sweep: orbits once every couple of minutes
    const time = state.clock.getElapsedTime() * 0.08;
    
    // Smooth orbit path
    sunLightRef.current.position.x = Math.cos(time) * 11;
    sunLightRef.current.position.z = Math.sin(time) * 9;
    sunLightRef.current.position.y = 7.5 + Math.sin(time * 0.5) * 1.5;
  });

  return (
    <directionalLight
      ref={sunLightRef}
      position={[8, 9, 6]}
      intensity={1.8}
      color="#fef08a" // Warm solar glow
      castShadow
      shadow-mapSize={[2048, 2048]} // Ultra-crisp soft shadow maps
      shadow-bias={-0.00015} // Prevents shadow acne artifacts
    />
  );
};
