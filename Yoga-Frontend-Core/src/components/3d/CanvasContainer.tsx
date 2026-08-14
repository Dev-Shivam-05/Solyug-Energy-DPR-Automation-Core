import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Stars, Environment, ContactShadows, Sphere, Cylinder, Capsule, Group } from '@react-three/drei';
import * as THREE from 'three';
import type { Exercise } from '../../types';

// Procedural human character with basic muscle groups
const HumanCharacter = ({ muscleHighlight = null }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Gently rotate the character
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  const muscleColors = useMemo(() => ({
    'Neck': '#ff6b6b',
    'Shoulders': '#feca57',
    'Chest': '#48dbfb',
    'Upper Back': '#1dd1a1',
    'Lower Back': '#10ac84',
    'Biceps': '#54a0ff',
    'Triceps': '#5f27cd',
    'Forearms': '#341f97',
    'Abs': '#ff9ff3',
    'Obliques': '#f368e0',
    'Core': '#00d2d3',
    'Glutes': '#576574',
    'Quads': '#222f3e',
    'Hamstrings': '#c8d6e5',
    'Calves': '#8395a7',
    'Hip Flexors': '#ff6348',
    'Adductors': '#ff4757',
    'Abductors': '#ffa502',
    'Full Body': '#f1f2f6',
  }), []);

  const isMuscleActive = (muscle) => {
    if (!muscleHighlight) return false;
    if (muscleHighlight === 'Full Body') return true;
    return muscleHighlight === muscle;
  };

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Head */}
      <Sphere position={[0, 2.4, 0]} args={[0.25, 32, 32]} castShadow receiveShadow>
        <meshStandardMaterial color={isMuscleActive('Neck') ? muscleColors['Neck'] : '#f5deb3'} roughness={0.8} metalness={0.2} />
      </Sphere>
      
      {/* Neck */}
      <Cylinder position={[0, 2.05, 0]} args={[0.08, 0.12, 0.3, 16]} castShadow receiveShadow>
        <meshStandardMaterial color={isMuscleActive('Neck') ? muscleColors['Neck'] : '#f5deb3'} roughness={0.8} />
      </Cylinder>
      
      {/* Torso */}
      <Cylinder position={[0, 1.5, 0]} args={[0.28, 0.35, 1.0, 16]} castShadow receiveShadow>
        <meshStandardMaterial color={isMuscleActive('Core') ? muscleColors['Core'] : '#e0e0e0'} roughness={0.8} />
      </Cylinder>
      
      {/* Chest */}
      <Capsule position={[0, 1.8, 0]} args={[0.12, 0.3, 8, 16]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <meshStandardMaterial color={isMuscleActive('Chest') ? muscleColors['Chest'] : '#d0d0d0'} roughness={0.8} />
      </Capsule>
      
      {/* Shoulders */}
      <Sphere position={[-0.4, 1.9, 0]} args={[0.12, 16, 16]} castShadow receiveShadow>
        <meshStandardMaterial color={isMuscleActive('Shoulders') ? muscleColors['Shoulders'] : '#f5deb3'} roughness={0.8} />
      </Sphere>
      <Sphere position={[0.4, 1.9, 0]} args={[0.12, 16, 16]} castShadow receiveShadow>
        <meshStandardMaterial color={isMuscleActive('Shoulders') ? muscleColors['Shoulders'] : '#f5deb3'} roughness={0.8} />
      </Sphere>
      
      {/* Upper Arms */}
      <Capsule position={[-0.55, 1.65, 0]} args={[0.07, 0.45, 8, 16]} rotation={[0, 0, Math.PI / 2.5]} castShadow receiveShadow>
        <meshStandardMaterial color={isMuscleActive('Biceps') || isMuscleActive('Triceps') ? muscleColors['Biceps'] : '#f5deb3'} roughness={0.8} />
      </Capsule>
      <Capsule position={[0.55, 1.65, 0]} args={[0.07, 0.45, 8, 16]} rotation={[0, 0, -Math.PI / 2.5]} castShadow receiveShadow>
        <meshStandardMaterial color={isMuscleActive('Biceps') || isMuscleActive('Triceps') ? muscleColors['Biceps'] : '#f5deb3'} roughness={0.8} />
      </Capsule>
      
      {/* Forearms */}
      <Capsule position={[-0.7, 1.3, 0]} args={[0.06, 0.4, 8, 16]} rotation={[0, 0, Math.PI / 2.5]} castShadow receiveShadow>
        <meshStandardMaterial color={isMuscleActive('Forearms') ? muscleColors['Forearms'] : '#f5deb3'} roughness={0.8} />
      </Capsule>
      <Capsule position={[0.7, 1.3, 0]} args={[0.06, 0.4, 8, 16]} rotation={[0, 0, -Math.PI / 2.5]} castShadow receiveShadow>
        <meshStandardMaterial color={isMuscleActive('Forearms') ? muscleColors['Forearms'] : '#f5deb3'} roughness={0.8} />
      </Capsule>
      
      {/* Abs */}
      <group position={[0, 1.45, 0.2]}>
        {[0.15, 0.05, -0.05, -0.15].map((y, i) => (
          <Cylinder key={i} position={[0, y, 0]} args={[0.08, 0.1, 0.18, 8]} castShadow receiveShadow>
            <meshStandardMaterial color={isMuscleActive('Abs') ? muscleColors['Abs'] : '#d8d8d8'} roughness={0.8} />
          </Cylinder>
        ))}
      </group>
      
      {/* Hips */}
      <Cylinder position={[0, 0.95, 0]} args={[0.3, 0.25, 0.4, 16]} castShadow receiveShadow>
        <meshStandardMaterial color={isMuscleActive('Glutes') || isMuscleActive('Hip Flexors') ? muscleColors['Glutes'] : '#4a69bd'} roughness={0.8} />
      </Cylinder>
      
      {/* Glutes */}
      <Sphere position={[-0.15, 0.95, -0.18]} args={[0.15, 16, 16]} castShadow receiveShadow>
        <meshStandardMaterial color={isMuscleActive('Glutes') ? muscleColors['Glutes'] : '#3c6382'} roughness={0.8} />
      </Sphere>
      <Sphere position={[0.15, 0.95, -0.18]} args={[0.15, 16, 16]} castShadow receiveShadow>
        <meshStandardMaterial color={isMuscleActive('Glutes') ? muscleColors['Glutes'] : '#3c6382'} roughness={0.8} />
      </Sphere>
      
      {/* Upper Legs (Quads/Hamstrings) */}
      <Capsule position={[-0.15, 0.5, 0]} args={[0.1, 0.7, 8, 16]} castShadow receiveShadow>
        <meshStandardMaterial color={isMuscleActive('Quads') || isMuscleActive('Hamstrings') ? muscleColors['Quads'] : '#34495e'} roughness={0.8} />
      </Capsule>
      <Capsule position={[0.15, 0.5, 0]} args={[0.1, 0.7, 8, 16]} castShadow receiveShadow>
        <meshStandardMaterial color={isMuscleActive('Quads') || isMuscleActive('Hamstrings') ? muscleColors['Quads'] : '#34495e'} roughness={0.8} />
      </Capsule>
      
      {/* Lower Legs (Calves) */}
      <Capsule position={[-0.15, 0.0, 0]} args={[0.08, 0.6, 8, 16]} castShadow receiveShadow>
        <meshStandardMaterial color={isMuscleActive('Calves') ? muscleColors['Calves'] : '#636e72'} roughness={0.8} />
      </Capsule>
      <Capsule position={[0.15, 0.0, 0]} args={[0.08, 0.6, 8, 16]} castShadow receiveShadow>
        <meshStandardMaterial color={isMuscleActive('Calves') ? muscleColors['Calves'] : '#636e72'} roughness={0.8} />
      </Capsule>
      
      {/* Feet */}
      <Capsule position={[-0.15, -0.35, 0.05]} args={[0.06, 0.25, 8, 16]} rotation={[0, 0, -Math.PI / 6]} castShadow receiveShadow>
        <meshStandardMaterial color="#f5deb3" roughness={0.8} />
      </Capsule>
      <Capsule position={[0.15, -0.35, 0.05]} args={[0.06, 0.25, 8, 16]} rotation={[0, 0, Math.PI / 6]} castShadow receiveShadow>
        <meshStandardMaterial color="#f5deb3" roughness={0.8} />
      </Capsule>
    </group>
  );
};

interface Props {
  exercise: Exercise | null;
}

const Scene: React.FC<Props> = ({ exercise }) => {
  const muscleHighlight = exercise?.musclesWorked?.[0] || null;
  
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} color="#e0e0ff" />
      <directionalLight
        position={[10, 10, 5]}
        intensity={2}
        color="#fff5e6"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#c8a2c8" />
      <pointLight position={[5, 3, 5]} intensity={0.3} color="#a2c8c8" />

      {/* Environment */}
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
      <Environment preset="city" />

      {/* Human Character */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <HumanCharacter muscleHighlight={muscleHighlight} />
      </Float>

      {/* Ground Plane */}
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.5}
        scale={20}
        blur={3}
        far={4}
        color="#000"
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.95} />
      </mesh>
    </>
  );
};

export const CanvasContainer: React.FC<Props> = ({ exercise }) => {
  return (
    <Canvas
      camera={{ position: [4, 3, 6], fov: 45 }}
      shadows
      dpr={[1, 2]}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
    >
      <fog attach="fog" args={['#0f0f23', 5, 30]} />
      <Scene exercise={exercise} />
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={3}
        maxDistance={15}
        dampingFactor={0.05}
        enableDamping={true}
        target={[0, 1.2, 0]}
      />
    </Canvas>
  );
};
