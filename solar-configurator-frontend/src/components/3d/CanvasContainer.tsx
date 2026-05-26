import React, { Suspense, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Stars, Float, Environment, Sky } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { SolarHouse } from './SolarHouse';
import { ParticleField } from './ParticleField';
import * as THREE from 'three';

// Bypass React-Three Postprocessing JSX typing conflicts in strict compiler environments
const AmbientComposer = EffectComposer as any;
const DynamicBloom = Bloom as any;
const DynamicVignette = Vignette as any;

interface Props {
  panelCount: number;
}

export const CanvasContainer: React.FC<Props> = ({ panelCount }) => {
  const [sunPos, setSunPos] = useState<[number, number, number]>([8, 8, 6]);
  const lastUpdate = useRef(0);

  // Slow sun orbit: recalculate solar position 10 times a second to prevent React bottlenecking
  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (elapsed - lastUpdate.current > 0.1) {
      lastUpdate.current = elapsed;
      const time = elapsed * 0.035; // Slow Diurnal rotation
      const x = Math.cos(time) * 12.5;
      const z = Math.sin(time) * 10;
      const y = 4.5 + Math.sin(time * 0.5) * 3.5; // Bounces between 1 and 8
      setSunPos([x, y, z]);
    }
  });

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
        toneMappingExposure: 1.2
      }}
    >
      {/* Fog coordinates for realistic atmospheric twilight depth */}
      <fog attach="fog" args={['#05080c', 16, 36]} />

      {/* Basic ambient fill mapping twilight tones */}
      <ambientLight intensity={0.4} color="#e0f2fe" />

      {/* Dynamic Sunlight */}
      <directionalLight
        position={sunPos}
        intensity={1.8}
        color="#fef08a" // Warm yellow sunlight
        castShadow
        shadow-mapSize={[2048, 2048]} // Ultra-crisp shadow mapping
        shadow-bias={-0.00012}
      />

      {/* Evening cold sky light overlay */}
      <directionalLight
        position={[-8, 6, -8]}
        intensity={0.45}
        color="#38bdf8"
      />

      {/* High-fidelity atmospheric Sky Dome model */}
      <Sky 
        sunPosition={sunPos} 
        turbidity={8} 
        rayleigh={2.8} 
        mieCoefficient={0.003} 
        mieDirectionalG={0.8} 
      />

      {/* Star field grid */}
      <Stars radius={110} depth={45} count={1200} factor={3} saturation={0.4} fade speed={0.15} />

      {/* Floating golden sun particles */}
      <ParticleField count={40} />

      <Suspense fallback={null}>
        {/* Skybox reflections */}
        <Environment preset="sunset" />

        {/* Slow organic villa float */}
        <Float speed={0.4} rotationIntensity={0.01} floatIntensity={0.04} floatingRange={[-0.02, 0.02]}>
          <SolarHouse panelCount={panelCount} />
        </Float>
      </Suspense>

      {/* Soft Contact ground shadows */}
      <ContactShadows
        position={[0, -1.12, 0]}
        opacity={0.65}
        scale={16}
        blur={2.4}
        far={6}
        resolution={512}
        color="#020617"
      />

      {/* Camera orbit limits */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        maxPolarAngle={Math.PI / 2.05} // Limit ground looking
        minPolarAngle={Math.PI / 6}
        minDistance={8}
        maxDistance={22}
        dampingFactor={0.05}
        enableDamping={true}
      />

      {/* 5. AAA CINEMATIC POST-PROCESSING PIPELINE */}
      <AmbientComposer disableNormalPass>
        {/* Specular Bloom filter creates glowing solar active effects */}
        <DynamicBloom 
          intensity={0.45} 
          luminanceThreshold={0.88} 
          luminanceSmoothing={0.25} 
          mipmapBlur 
        />
        {/* Vignette dims edge framing for high-end rendering look */}
        <DynamicVignette 
          eskil={false} 
          offset={0.12} 
          darkness={1.05} 
        />
      </AmbientComposer>
    </Canvas>
  );
};
