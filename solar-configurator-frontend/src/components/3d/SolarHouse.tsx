import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface Props {
  panelCount: number;
  isNight: boolean;
}

export const SolarHouse: React.FC<Props> = React.memo(({ panelCount, isNight }) => {
  const count = panelCount || 0;
  const houseRef = useRef<THREE.Group>(null);

  // Dynamic grid math
  const cols = Math.max(1, Math.ceil(Math.sqrt(count)));
  const rows = Math.ceil(count / cols);

  const gapX = 1.25;
  const gapZ = 0.9;

  return (
    <group ref={houseRef} position={[0, -1.0, 0]}>
      {/* 1. ARCHITECTURAL SCENARIO LANDSCAPING (Grass ground, Stepping stones, planters, trees, path lights) */}
      <VillaLandscape isNight={isNight} />

      {/* 2. MAIN MODERN VILLA ARCHITECTURE */}
      <ModernVilla isNight={isNight} />

      {/* 3. DETAILED ELECTRICAL CONDUITS & ENERGY FEEDBACK */}
      <HouseConduits active={count > 0} />

      {/* 4. ULTRA-REALISTIC PANEL ASSEMBLY ON THE FLAT ROOF */}
      <group position={[0, 1.62, -0.2]}>
        {count > 0 ? (
          Array.from({ length: count }).map((_, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            // Center solar grid
            const x = (col - (cols - 1) / 2) * gapX;
            const z = (row - (rows - 1) / 2) * gapZ;
            return <RealisticPanel key={i} position={[x, 0, z]} index={i} active={true} />;
          })
        ) : (
          <RooftopFeasibilityGrid />
        )}
      </group>
    </group>
  );
});

/* ═══════════════════════════════════════════════════════════════
   ARCHITECTURAL LANDSCAPING (Grass, path lights, planters, trees)
   ═══════════════════════════════════════════════════════════════ */
interface LandscapeProps {
  isNight: boolean;
}

const VillaLandscape: React.FC<LandscapeProps> = ({ isNight }) => {
  const [concreteTex, grassTex] = useTexture([
    '/textures/concrete_wall.png',
    '/textures/grass_lawn.png'
  ]);

  useMemo(() => {
    concreteTex.wrapS = concreteTex.wrapT = THREE.RepeatWrapping;
    concreteTex.repeat.set(4, 2.5);

    // Repeated dense tiling for realistic lawn grass blades details across infinite landscape
    grassTex.wrapS = grassTex.wrapT = THREE.RepeatWrapping;
    grassTex.repeat.set(28, 28);
  }, [concreteTex, grassTex]);

  // Path lights coordinates along stepping stones path
  const pathLightCoords: [number, number, number][] = [
    [-1.0, -0.2, 4.15],
    [-0.9, -0.2, 5.0],
    [-0.6, -0.2, 5.9]
  ];

  return (
    <group>
      {/* Lush AI-Textured Grass Ground Plane - Expanded to 70x70 to merge horizon seamlessly */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.21, 0]} receiveShadow>
        <planeGeometry args={[70, 70]} />
        <meshStandardMaterial map={grassTex} roughness={0.92} metalness={0.05} />
      </mesh>

      {/* Modern Concrete Stepping-Stone Walkway Paving Slabs */}
      <group>
        {[
          { pos: [-1.8, -0.19, 3.85], scale: [1.1, 0.02, 0.4] },
          { pos: [-1.7, -0.19, 4.45], scale: [1.0, 0.02, 0.4] },
          { pos: [-1.5, -0.19, 5.05], scale: [0.95, 0.02, 0.4] },
          { pos: [-1.3, -0.19, 5.65], scale: [0.9, 0.02, 0.4] },
          { pos: [-1.1, -0.19, 6.25], scale: [0.9, 0.02, 0.4] }
        ].map((stone, idx) => (
          <mesh key={idx} position={stone.pos as [number, number, number]} receiveShadow castShadow>
            <boxGeometry args={[stone.scale[0], stone.scale[1], stone.scale[2]]} />
            <meshStandardMaterial color="#94a3b8" map={concreteTex} roughness={0.78} />
          </mesh>
        ))}
      </group>

      {/* AUTOMATIC NIGHT LANDSCAPE PATHWAY LIGHTS */}
      {pathLightCoords.map((coord, idx) => (
        <group key={idx} position={coord}>
          {/* Post pillar */}
          <mesh castShadow position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.015, 0.018, 0.24, 8]} />
            <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.4} />
          </mesh>
          {/* Glowing cap */}
          <mesh position={[0, 0.24, 0]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshBasicMaterial 
              color={isNight ? "#f59e0b" : "#475569"} 
              toneMapped={false} 
            />
          </mesh>
          {/* Soft Amber Light Pool on the walkway and grass (optimized to disable shadow-casting) */}
          {isNight && (
            <pointLight 
              position={[0, 0.26, 0]} 
              intensity={0.65} 
              distance={2.4} 
              decay={2.0} 
              color="#f59e0b" 
            />
          )}
        </group>
      ))}

      {/* Concrete Planter Box 1 (next to porch entry steps) */}
      <group position={[-0.6, -0.12, 3.1]}>
        {/* Planter frame */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.75, 0.22, 0.75]} />
          <meshStandardMaterial color="#475569" map={concreteTex} roughness={0.7} />
        </mesh>
        {/* Soil base */}
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.67, 0.02, 0.67]} />
          <meshStandardMaterial color="#1c1917" roughness={0.95} />
        </mesh>
        {/* Shrub foliage and Marigold Flowers */}
        <group position={[0, 0.18, 0]}>
          <mesh castShadow>
            <dodecahedronGeometry args={[0.16, 1]} />
            <meshStandardMaterial color="#166534" roughness={0.9} />
          </mesh>
          <mesh position={[0.06, -0.04, 0.06]} castShadow>
            <dodecahedronGeometry args={[0.12, 1]} />
            <meshStandardMaterial color="#14532d" roughness={0.9} />
          </mesh>
          <mesh position={[-0.06, -0.04, -0.06]} castShadow>
            <dodecahedronGeometry args={[0.13, 1]} />
            <meshStandardMaterial color="#15803d" roughness={0.9} />
          </mesh>
          
          {/* PBR Marigold Flower Blooms */}
          {[[0.08, 0.08, 0.06], [-0.08, 0.06, -0.08], [0.03, 0.09, -0.04]].map((flowerPos, fIdx) => (
            <mesh key={`f1-${fIdx}`} position={flowerPos as [number, number, number]} castShadow>
              <sphereGeometry args={[0.028, 6, 6]} />
              <meshStandardMaterial color={fIdx % 2 === 0 ? "#ea580c" : "#f59e0b"} roughness={0.8} />
            </mesh>
          ))}
        </group>
      </group>

      {/* Concrete Planter Box 2 (under ribbon facade windows) */}
      <group position={[-3.3, -0.12, 2.3]}>
        {/* Planter frame */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.3, 0.22, 0.55]} />
          <meshStandardMaterial color="#475569" map={concreteTex} roughness={0.7} />
        </mesh>
        {/* Soil base */}
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[1.2, 0.02, 0.47]} />
          <meshStandardMaterial color="#1c1917" roughness={0.95} />
        </mesh>
        {/* Flower bushes row */}
        <group position={[0, 0.18, 0]}>
          {[-0.35, 0, 0.35].map((xOff, idx) => (
            <group key={idx} position={[xOff, 0, 0]}>
              <mesh castShadow>
                <dodecahedronGeometry args={[0.14, 1]} />
                <meshStandardMaterial color={idx === 1 ? "#15803d" : "#166534"} roughness={0.9} />
              </mesh>
              {/* Marigold flowers on bushes */}
              {[[0, 0.08, 0.04], [-0.05, 0.05, -0.05], [0.05, 0.05, -0.05]].map((fPos, fIdx) => (
                <mesh key={`f2-${idx}-${fIdx}`} position={fPos as [number, number, number]} castShadow>
                  <sphereGeometry args={[0.025, 6, 6]} />
                  <meshStandardMaterial color={fIdx % 2 === 0 ? "#f59e0b" : "#ea580c"} roughness={0.8} />
                </mesh>
              ))}
            </group>
          ))}
        </group>
      </group>

      {/* Background Landscaping Cypress Trees (8 Trees for lush depth) */}
      <LandscapingTree position={[-4.0, -0.2, -1.8]} height={4.2} />
      <LandscapingTree position={[3.6, -0.2, -2.2]} height={3.9} />
      <LandscapingTree position={[-4.5, -0.2, 0.8]} height={3.6} />
      <LandscapingTree position={[4.6, -0.2, 1.4]} height={3.4} />

      {/* Background Forest framing trees */}
      <LandscapingTree position={[-6.0, -0.2, -4.5]} height={4.8} />
      <LandscapingTree position={[6.0, -0.2, -5.0]} height={4.5} />
      <LandscapingTree position={[-2.0, -0.2, -5.5]} height={5.2} />
      <LandscapingTree position={[2.5, -0.2, -5.8]} height={4.9} />

      {/* 3D Swaying Grass Particles Field */}
      <GrassField />
    </group>
  );
};

/* Reusable Architectural Conical Landscape Tree Component */
interface TreeProps {
  position: [number, number, number];
  height: number;
}

const LandscapingTree: React.FC<TreeProps> = ({ position, height }) => {
  const trunkHeight = height * 0.32;
  const foliageHeight = height * 0.68;

  // Generate slight unique organic growth tilts and rotations based on spatial coordinates
  const rotY = useMemo(() => Math.abs((position[0] * 7.1 + position[2] * 3.7) % (Math.PI * 2)), [position]);
  const rotX = useMemo(() => ((position[0] * 3.3 + position[2] * 1.9) % 0.08) - 0.04, [position]);

  return (
    <group position={position} rotation={[rotX, rotY, 0]}>
      {/* Wooden Trunk */}
      <mesh position={[0, trunkHeight / 2, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.1, trunkHeight, 8]} />
        <meshStandardMaterial color="#2d1500" roughness={0.85} />
      </mesh>

      {/* Conical multi-layered organic foliage */}
      <group position={[0, trunkHeight, 0]}>
        {/* Bottom layer */}
        <mesh position={[0, foliageHeight * 0.25, 0]} castShadow>
          <coneGeometry args={[0.42, foliageHeight * 0.5, 6]} />
          <meshStandardMaterial color="#14532d" roughness={0.92} />
        </mesh>
        {/* Mid layer */}
        <mesh position={[0, foliageHeight * 0.52, 0]} castShadow>
          <coneGeometry args={[0.34, foliageHeight * 0.44, 6]} />
          <meshStandardMaterial color="#166534" roughness={0.92} />
        </mesh>
        {/* Peak top */}
        <mesh position={[0, foliageHeight * 0.76, 0]} castShadow>
          <coneGeometry args={[0.22, 0.35, 6]} />
          <meshStandardMaterial color="#15803d" roughness={0.92} />
        </mesh>
      </group>
    </group>
  );
};

/* ═══════════════════════════════════════════════════════════════
   ARCHITECTURAL MODERN VILLA MODEL WITH HIGH-FIDELITY TEXTURES
   ═══════════════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════════
   ARCHITECTURAL WINDOWS WITH SLEEK ALUMINUM FRAMING
   ═══════════════════════════════════════════════════════════════ */
interface ArchWindowProps {
  position: [number, number, number];
  size: [number, number];
  panes?: number;
  rotation?: [number, number, number];
}

const ArchitecturalWindow: React.FC<ArchWindowProps> = ({ 
  position, 
  size, 
  panes = 2,
  rotation = [0, 0, 0]
}) => {
  const [w, h] = size;
  const frameThickness = 0.038; // Sleek 3.8cm frames
  const frameDepth = 0.07;
  const glassThickness = 0.015;

  return (
    <group position={position} rotation={rotation}>
      {/* Outer Border Frames */}
      {/* Top Frame */}
      <mesh position={[0, h/2 - frameThickness/2, 0]} castShadow>
        <boxGeometry args={[w, frameThickness, frameDepth]} />
        <meshStandardMaterial color="#0f172a" roughness={0.35} metalness={0.8} />
      </mesh>
      {/* Bottom Frame */}
      <mesh position={[0, -h/2 + frameThickness/2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, frameThickness, frameDepth]} />
        <meshStandardMaterial color="#0f172a" roughness={0.35} metalness={0.8} />
      </mesh>
      {/* Left Frame */}
      <mesh position={[-w/2 + frameThickness/2, 0, 0]} castShadow>
        <boxGeometry args={[frameThickness, h, frameDepth]} />
        <meshStandardMaterial color="#0f172a" roughness={0.35} metalness={0.8} />
      </mesh>
      {/* Right Frame */}
      <mesh position={[w/2 - frameThickness/2, 0, 0]} castShadow>
        <boxGeometry args={[frameThickness, h, frameDepth]} />
        <meshStandardMaterial color="#0f172a" roughness={0.35} metalness={0.8} />
      </mesh>

      {/* Mullions (dividers) */}
      {panes > 1 && Array.from({ length: panes - 1 }).map((_, i) => {
        const xOffset = -w/2 + (w / panes) * (i + 1);
        return (
          <mesh key={i} position={[xOffset, 0, 0]} castShadow>
            <boxGeometry args={[0.02, h - frameThickness * 2, frameDepth * 0.7]} />
            <meshStandardMaterial color="#0f172a" roughness={0.35} metalness={0.8} />
          </mesh>
        );
      })}

      {/* Dark interior backing to hide the solid white wall behind the glass and simulate depth */}
      <mesh position={[0, 0, -0.012]}>
        <planeGeometry args={[w - frameThickness * 2, h - frameThickness * 2]} />
        <meshBasicMaterial color="#020617" />
      </mesh>

      {/* Physical double-sided reflective high-specular glass */}
      <mesh position={[0, 0, 0.005]}>
        <boxGeometry args={[w - frameThickness * 2, h - frameThickness * 2, glassThickness]} />
        <meshPhysicalMaterial
          color="#e2e8f0"
          transparent
          opacity={0.22}
          roughness={0.01}
          metalness={0.96}
          transmission={0.93}
          thickness={0.06}
          envMapIntensity={3.2}
          clearcoat={1.0}
          clearcoatRoughness={0.02}
        />
      </mesh>
    </group>
  );
};

/* ═══════════════════════════════════════════════════════════════
   ARCHITECTURAL MODERN VILLA MODEL WITH HIGH-FIDELITY TEXTURES
   ═══════════════════════════════════════════════════════════════ */
interface VillaProps {
  isNight: boolean;
}

const ModernVilla: React.FC<VillaProps> = ({ isNight }) => {
  // Load PBR Textures
  const [concreteTex, roofTex, woodTex] = useTexture([
    '/textures/concrete_wall.png',
    '/textures/roof_concrete.png',
    '/textures/wood_panel.png'
  ]);

  // Adjust texture tiling and wrapping properties
  useMemo(() => {
    concreteTex.wrapS = concreteTex.wrapT = THREE.RepeatWrapping;
    concreteTex.repeat.set(4, 2.5);

    roofTex.wrapS = roofTex.wrapT = THREE.RepeatWrapping;
    roofTex.repeat.set(4.5, 3.5);

    woodTex.wrapS = woodTex.wrapT = THREE.RepeatWrapping;
    woodTex.repeat.set(2, 1.5);
  }, [concreteTex, roofTex, woodTex]);

  return (
    <group>
      {/* Sleek Dark Granite Foundation */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <boxGeometry args={[8.2, 0.2, 6.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} metalness={0.2} map={roofTex} />
      </mesh>

      {/* Concrete Entry Stairs - Aligned flush with the entrance threshold at Z = 2.8 */}
      {[-2.0, -0.05, 3.25].map((yOff, i) => (
        <mesh key={i} position={[-1.8, -0.05 + i * 0.1, 2.8 + (2 - i) * 0.25] as [number, number, number]} receiveShadow castShadow>
          <boxGeometry args={[1.8, 0.1, 0.5]} />
          <meshStandardMaterial color="#cbd5e1" map={concreteTex} roughness={0.8} />
        </mesh>
      ))}

      {/* Ground Floor Main Block - Plaster / White Stucco Texture */}
      <mesh position={[-1.8, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 1.5, 5.6]} />
        <meshStandardMaterial color="#ffffff" map={concreteTex} roughness={0.85} />
      </mesh>

      {/* Garage and Tech Utility Block - Charcoal Grey Accent Walls */}
      <mesh position={[2.2, 0.75, -0.2]} castShadow receiveShadow>
        <boxGeometry args={[3.4, 1.5, 5.2]} />
        <meshStandardMaterial color="#475569" map={concreteTex} roughness={0.75} />
      </mesh>

      {/* Upper Floor Architectural Cantilever Block */}
      <mesh position={[-1.2, 2.15, -0.4]} castShadow receiveShadow>
        <boxGeometry args={[4.8, 1.25, 4.4]} />
        <meshStandardMaterial color="#f1f5f9" map={concreteTex} roughness={0.8} />
      </mesh>

      {/* Warm Oak Decorative Cantilever Accent Wall Panel */}
      <mesh position={[-2.8, 2.15, 1.81]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 1.23, 0.03]} />
        <meshStandardMaterial color="#ffffff" map={woodTex} roughness={0.65} />
      </mesh>

      {/* Front Entry Door with Frame and Recess - Pushed forward to Z = 2.82 to eliminate Z-fighting */}
      <group position={[-1.8, 0.7, 2.82]}>
        {/* Dark Metal Frame */}
        <mesh castShadow>
          <boxGeometry args={[1.2, 1.45, 0.12]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.7} />
        </mesh>
        {/* Warm Oak Pivoting Wood Door Leaf */}
        <mesh castShadow position={[0, 0, 0.035]}>
          <boxGeometry args={[1.1, 1.35, 0.06]} />
          <meshStandardMaterial color="#ffffff" map={woodTex} roughness={0.6} metalness={0.05} />
        </mesh>
        {/* Brushed Stainless Steel vertical bar handle */}
        <mesh position={[0.4, 0, 0.075]}>
          <cylinderGeometry args={[0.015, 0.015, 0.6, 8]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.15} metalness={0.9} />
        </mesh>
      </group>

      {/* Modern Ribbon Wooden Panels for Garage Section */}
      <group position={[2.2, 0.7, 2.41]}>
        {/* Door wood chassis */}
        <mesh castShadow>
          <boxGeometry args={[2.5, 1.3, 0.06]} />
          <meshStandardMaterial color="#e2e8f0" map={woodTex} roughness={0.6} />
        </mesh>
        {/* Inset metallic rib profiles */}
        {[-0.5, -0.3, -0.1, 0.1, 0.3, 0.5].map((y, idx) => (
          <mesh key={idx} position={[0, y, 0.04]}>
            <boxGeometry args={[2.4, 0.015, 0.015]} />
            <meshStandardMaterial color="#1e293b" roughness={0.25} metalness={0.7} />
          </mesh>
        ))}
      </group>

      {/* High-Fidelity Solid Architectural Black Aluminum Framed Windows - Offset forward to Z=2.83/1.83/2.43 to prevent Z-fighting */}
      {/* 1. Ground Floor Living Room Window (Left) */}
      <ArchitecturalWindow position={[-3.3, 0.75, 2.83]} size={[1.2, 1.2]} panes={2} />

      {/* 2. Ground Floor Dining Room Window (Right of Front Door) */}
      <ArchitecturalWindow position={[-0.4, 0.75, 2.83]} size={[1.4, 1.2]} panes={3} />

      {/* 3. Upper Floor Master Bedroom Balcony Glass Sliding Door Facade */}
      <ArchitecturalWindow position={[-1.2, 2.15, 1.83]} size={[3.6, 1.23]} panes={4} />

      {/* 4. Sleek Technical Horizontal Garage Slot Window */}
      <ArchitecturalWindow position={[2.2, 1.1, 2.43]} size={[1.8, 0.3]} panes={2} />

      {/* Cozy Diurnal Interior Night Lighting */}
      {isNight && (
        <group>
          {/* Main living room warm amber cozy glow */}
          <pointLight 
            position={[-2.4, 0.6, 1.2]} 
            intensity={1.2} 
            distance={5.0} 
            decay={1.6} 
            color="#f59e0b" 
          />
          {/* Upper master bedroom warm amber cozy glow */}
          <pointLight 
            position={[-1.2, 2.0, 0.2]} 
            intensity={1.5} 
            distance={6.0} 
            decay={1.6} 
            color="#f59e0b" 
          />
          {/* Technical energy block active high-tech cyan glow */}
          <pointLight 
            position={[2.2, 0.8, 1.0]} 
            intensity={0.8} 
            distance={4.0} 
            decay={2.0} 
            color="#0ea5e9" 
          />
        </group>
      )}

      {/* Cantilever Architectural Glass Balcony */}
      <group position={[-1.2, 1.5, 1.82]}>
        {/* Balcony slab */}
        <mesh castShadow position={[0, 0, 0.1]}>
          <boxGeometry args={[4.4, 0.1, 0.8]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.7} map={concreteTex} />
        </mesh>
        {/* Glass railing panes */}
        <mesh position={[0, 0.38, 0.49]}>
          <boxGeometry args={[4.38, 0.7, 0.03]} />
          <meshPhysicalMaterial
            color="#38bdf8"
            transparent
            opacity={0.35}
            roughness={0.01}
            metalness={0.9}
            transmission={0.9}
            thickness={0.04}
            envMapIntensity={3.0}
          />
        </mesh>
        {/* Steel Rail cap */}
        <mesh position={[0, 0.74, 0.49]}>
          <boxGeometry args={[4.4, 0.025, 0.04]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Roof Fascias (Concrete Overhangs with Aluminum Trim Lines) */}
      {/* Lower roof slab over main block */}
      <mesh position={[0, 1.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[7.8, 0.1, 5.8]} />
        <meshStandardMaterial color="#ffffff" map={roofTex} roughness={0.9} />
      </mesh>
      {/* Cantilever roof slab */}
      <mesh position={[-1.2, 2.8, -0.4]} castShadow receiveShadow>
        <boxGeometry args={[5.0, 0.1, 4.6]} />
        <meshStandardMaterial color="#ffffff" map={roofTex} roughness={0.95} />
      </mesh>
    </group>
  );
};

/* ═══════════════════════════════════════════════════════════════
   HYPER-DETAILED WIRE CABLING & SOLAR ENERGY PULSES
   ═══════════════════════════════════════════════════════════════ */
interface ConduitProps {
  active: boolean;
}

const HouseConduits: React.FC<ConduitProps> = ({ active }) => {
  const lineGlow = useRef<THREE.LineBasicMaterial>(null);

  useFrame((state) => {
    if (!lineGlow.current) return;
    const elapsed = state.clock.getElapsedTime();
    const targetOpacity = active 
      ? 0.5 + Math.sin(elapsed * 6.5) * 0.25 
      : 0.1;
    lineGlow.current.opacity = targetOpacity;
  });

  // Routing spline: from solar grid on roof (Z=-0.2, Y=1.55) down wall inside, exits into charger conduit.
  const conduitPoints = useMemo(() => {
    return [
      new THREE.Vector3(1.8, 1.58, -0.2),  // Roof cable bundle origin
      new THREE.Vector3(2.4, 1.54, -0.2),  // Route over deck trim
      new THREE.Vector3(2.4, 1.54, 1.2),   // Run along roof deck edge
      new THREE.Vector3(3.6, 1.52, 1.2),   // Over garage roof frame
      new THREE.Vector3(3.6, 0.7, 1.2),    // Down exterior wall channel
      new THREE.Vector3(3.4, 0.7, 1.2),    // Wall conduit junction Box
    ];
  }, []);

  const lineGeom = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(conduitPoints);
  }, [conduitPoints]);

  const splinedLine = useMemo(() => {
    return new THREE.Line(
      lineGeom,
      new THREE.LineBasicMaterial({
        color: active ? 0x0ea5e9 : 0x475569,
        transparent: true,
        opacity: 0.2,
        linewidth: 2,
        toneMapped: false,
      })
    );
  }, [lineGeom, active]);

  useEffect(() => {
    if (splinedLine.material) {
      (splinedLine.material as THREE.LineBasicMaterial).color.set(active ? "#0ea5e9" : "#475569");
    }
  }, [active, splinedLine]);

  return (
    <group>
      {/* High-voltage metal conduit pipe shields overlaying spline */}
      <mesh position={[3.6, 1.1, 1.22]}>
        <cylinderGeometry args={[0.02, 0.02, 0.8, 8]} />
        <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.3} />
      </mesh>
      
      {/* Wall Junction utility box */}
      <mesh position={[3.45, 0.7, 1.2]} castShadow>
        <boxGeometry args={[0.15, 0.2, 0.1]} />
        <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Floating active spline energy indicators */}
      <primitive object={splinedLine} />

      {active && (
        <SunBeamSpline splinePoints={conduitPoints} />
      )}
    </group>
  );
};

interface SplinePulseProps {
  splinePoints: THREE.Vector3[];
}

const SunBeamSpline: React.FC<SplinePulseProps> = ({ splinePoints }) => {
  const pulseRef = useRef<THREE.Mesh>(null);
  
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(splinePoints);
  }, [splinePoints]);

  useFrame((state) => {
    if (!pulseRef.current) return;
    const t = (state.clock.getElapsedTime() * 0.3) % 1.0;
    const pt = curve.getPointAt(t);
    pulseRef.current.position.copy(pt);
  });

  return (
    <mesh ref={pulseRef}>
      <sphereGeometry args={[0.038, 12, 12]} />
      <meshBasicMaterial color="#38bdf8" toneMapped={false} />
    </mesh>
  );
};

/* ═══════════════════════════════════════════════════════════════
   ULTRA-REALISTIC MONOCRYSTALLINE PBR SOLAR PANEL
   ═══════════════════════════════════════════════════════════════ */
interface RealisticPanelProps {
  position: [number, number, number];
  index: number;
  active: boolean;
}

const RealisticPanel: React.FC<RealisticPanelProps> = ({ position, index, active }) => {
  const groupRef = useRef<THREE.Group>(null);
  const elapsed = useRef(0);
  const targetY = position[1]; // target is 0 relative to solar grid group

  // Reset landing sequence on updates/remounts
  useEffect(() => {
    elapsed.current = 0;
  }, [position, index]);

  // Load the silicon wafer AI texture map
  const solarTex = useTexture('/textures/solar_cell.png');

  // Landing sequence relative animation
  useFrame((_, dt) => {
    if (!groupRef.current) return;
    elapsed.current += dt;
    const startDelay = index * 0.05;
    const localTime = Math.max(0, elapsed.current - startDelay);
    
    if (localTime < 0.8) {
      const progress = Math.min(1.0, localTime * 1.25);
      const ease = 1 - Math.pow(1 - progress, 4); // easeOutQuart
      
      groupRef.current.position.y = THREE.MathUtils.lerp(3.2, 0, ease);
      groupRef.current.scale.setScalar(ease);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(-0.25, 0, ease);
    } else {
      groupRef.current.position.y = 0;
      groupRef.current.scale.setScalar(1);
      groupRef.current.rotation.y = 0;
    }
  });

  const angleTilt = -0.28; // Tilted angle facing solar noon (~16 deg)

  return (
    <group ref={groupRef} position={[position[0], 0, position[2]]}>
      
      {/* 1. Monocrystalline Silicon Wafer PBR Surface */}
      <mesh castShadow receiveShadow rotation={[angleTilt, 0, 0]}>
        <boxGeometry args={[1.12, 0.022, 0.72]} />
        <meshPhysicalMaterial
          color="#ffffff"
          map={solarTex}
          roughness={0.04}
          metalness={0.96}
          clearcoat={1.0}
          clearcoatRoughness={0.02}
          reflectivity={1.0}
          envMapIntensity={3.2}
        />
      </mesh>

      {/* 2. Sleek Beveled Aluminum Edge Framing */}
      {/* Front edge */}
      <mesh rotation={[angleTilt, 0, 0]} position={[0, 0, 0.365]}>
        <boxGeometry args={[1.15, 0.032, 0.015]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.15} />
      </mesh>
      {/* Back edge */}
      <mesh rotation={[angleTilt, 0, 0]} position={[0, 0, -0.365]}>
        <boxGeometry args={[1.15, 0.032, 0.015]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.15} />
      </mesh>
      {/* Left edge */}
      <mesh rotation={[angleTilt, 0, 0]} position={[-0.565, 0, 0]}>
        <boxGeometry args={[0.015, 0.032, 0.745]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.15} />
      </mesh>
      {/* Right edge */}
      <mesh rotation={[angleTilt, 0, 0]} position={[0.565, 0, 0]}>
        <boxGeometry args={[0.015, 0.032, 0.745]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* 3. Mounting Scaffolding Assembly (Clamps and support Rails) */}
      <mesh position={[0, -0.05, -0.15]} castShadow>
        <boxGeometry args={[1.1, 0.02, 0.02]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.05, 0.15]} castShadow>
        <boxGeometry args={[1.1, 0.02, 0.02]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Supporting Leg posts with flange adapters */}
      {/* Front Support legs */}
      <mesh position={[-0.4, -0.18, 0.2]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.22]} />
        <meshStandardMaterial color="#334155" roughness={0.4} />
      </mesh>
      <mesh position={[0.4, -0.18, 0.2]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.22]} />
        <meshStandardMaterial color="#334155" roughness={0.4} />
      </mesh>
      {/* Rear Support legs */}
      <mesh position={[-0.4, -0.13, -0.2]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.32]} />
        <meshStandardMaterial color="#334155" roughness={0.4} />
      </mesh>
      <mesh position={[0.4, -0.13, -0.2]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.32]} />
        <meshStandardMaterial color="#334155" roughness={0.4} />
      </mesh>

      {/* Backside Junction utility box and microinverter details */}
      <mesh position={[0, -0.035, 0]}>
        <boxGeometry args={[0.1, 0.02, 0.1]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} />
      </mesh>

      {/* Glowing sun energy particles collecting on panel */}
      {active && (
        <group rotation={[angleTilt, 0, 0]}>
          <mesh position={[0, 0.02, 0]}>
            <planeGeometry args={[1.0, 0.6]} />
            <meshBasicMaterial color="#0ea5e9" transparent opacity={0.08} blending={THREE.AdditiveBlending} />
          </mesh>
        </group>
      )}
    </group>
  );
};

/* ═══════════════════════════════════════════════════════════════
   ROOFTOP FEASIBILITY OUTLINE GRID PLACEHOLDER
   ═══════════════════════════════════════════════════════════════ */
const RooftopFeasibilityGrid: React.FC = () => {
  return (
    <group rotation={[-0.28, 0, 0]} position={[0, -0.025, 0]}>
      {/* Glowing blueprint layout */}
      <mesh>
        <boxGeometry args={[3.2, 0.01, 2.0]} />
        <meshBasicMaterial color="#0ea5e9" wireframe transparent opacity={0.22} toneMapped={false} />
      </mesh>

      {/* Target markers */}
      {[-0.9, 0, 0.9].map((x, idx) => (
        <mesh key={idx} position={[x, 0, 0]}>
          <boxGeometry args={[0.005, 0.005, 1.6]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.12} />
        </mesh>
      ))}
    </group>
  );
};

/* ═══════════════════════════════════════════════════════════════
   DYNAMIC INSTANCED 3D GRASS FIELD (GPU Wind Shader + 7,500 Blades)
   ═══════════════════════════════════════════════════════════════ */
const GrassField: React.FC = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 7500; // Increased to 7,500 extremely dense organic blades of grass

  // Dummy Object3D to update instance matrices
  const tempObject = useMemo(() => new THREE.Object3D(), []);

  // Custom tapered, pre-curved organic blade geometry pivoting from base (Y=0)
  const grassGeometry = useMemo(() => {
    const geom = new THREE.PlaneGeometry(1, 1, 1, 3);
    geom.translate(0, 0.5, 0); // Translate vertices so base sits exactly at local y = 0
    
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i); // ranges from 0 to 1
      
      // Taper equation: full width at base, narrowing parabolically to 0 width at tip
      const taper = 1.0 - Math.pow(y, 1.6);
      pos.setX(i, x * taper);
      
      // Add natural organic pre-curvature along Z axis based on height
      const bend = Math.pow(y, 2.0) * 0.12;
      pos.setZ(i, bend);
    }
    geom.computeVertexNormals();
    return geom;
  }, []);

  // Generate random positions using smart boundary-aware margin clustering
  const instances = useMemo(() => {
    const data = [];
    const rand = Math.random;

    // Check if coordinates overlap any concrete structures
    const isInsideHouse = (x: number, z: number) => x > -4.2 && x < 4.2 && z > -3.2 && z < 3.2;
    const isInsideWalkway = (x: number, z: number) => {
      if (x > -2.4 && x < -1.2 && z > 3.6 && z < 4.1) return true;
      if (x > -2.3 && x < -1.1 && z > 4.2 && z < 4.7) return true;
      if (x > -2.1 && x < -0.9 && z > 4.8 && z < 5.3) return true;
      if (x > -1.9 && x < -0.7 && z > 5.4 && z < 5.9) return true;
      if (x > -1.7 && x < -0.5 && z > 6.0 && z < 6.5) return true;
      return false;
    };
    const isInsideStairs = (x: number, z: number) => x > -2.8 && x < -0.8 && z > 2.9 && z < 3.5;
    const isInsidePlanter1 = (x: number, z: number) => x > -1.05 && x < -0.15 && z > 2.65 && z < 3.55;
    const isInsidePlanter2 = (x: number, z: number) => x > -4.05 && x < -2.55 && z > 1.95 && z < 2.65;

    for (let i = 0; i < count; i++) {
      let x = 0;
      let z = 0;
      let scaleY = 0.14 + rand() * 0.22; // Organic blade heights: 14cm to 36cm
      let scaleX = 0.012 + rand() * 0.015;

      const rSelect = rand();
      if (rSelect < 0.48) {
        // 48% border clustering: generates hyper-realistic thick grass clumps hugging hard concrete edges!
        const boundarySelect = rand();
        if (boundarySelect < 0.35) {
          // Walkway borders
          const tZ = 3.6 + rand() * 2.8;
          const walkwayCenterX = -1.5 - (tZ - 5.0) * 0.2;
          x = walkwayCenterX + (rand() > 0.5 ? -0.44 : 0.44) + (rand() - 0.5) * 0.12;
          z = tZ;
        } else if (boundarySelect < 0.65) {
          // Planter 1 perimeter
          const angle = rand() * Math.PI * 2;
          x = -0.6 + Math.cos(angle) * 0.41 + (rand() - 0.5) * 0.08;
          z = 3.1 + Math.sin(angle) * 0.41 + (rand() - 0.5) * 0.08;
        } else if (boundarySelect < 0.88) {
          // Planter 2 perimeter
          const angle = rand() * Math.PI * 2;
          x = -3.3 + Math.cos(angle) * 0.70 + (rand() - 0.5) * 0.08;
          z = 2.3 + Math.sin(angle) * 0.32 + (rand() - 0.5) * 0.08;
        } else {
          // Front villa stucco concrete foundation edge
          x = (rand() - 0.5) * 8.2;
          z = 3.12 + (rand() - 0.5) * 0.1;
        }
        scaleY = 0.22 + rand() * 0.16; // Edge grass grows slightly taller and lush
      } else if (rSelect < 0.85) {
        // 37% Front yard general scattered lawn
        x = (rand() - 0.5) * 15.0;
        z = 1.0 + rand() * 6.5;
      } else {
        // 15% Left/Right side yards background
        x = rand() > 0.5 ? 4.5 + rand() * 4.0 : -4.5 - rand() * 4.0;
        z = (rand() - 0.5) * 6.0;
      }

      // Safe retry loop to prevent grass blades from clipping into solid architectural stone/walls
      let retries = 5;
      while (retries > 0 && (isInsideHouse(x, z) || isInsideWalkway(x, z) || isInsideStairs(x, z) || isInsidePlanter1(x, z) || isInsidePlanter2(x, z))) {
        x += (rand() - 0.5) * 0.7;
        z += (rand() - 0.5) * 0.7;
        retries--;
      }

      // Anchored base sits exactly on grass plane at Y = -0.21
      const y = -0.21;
      
      const rotY = rand() * Math.PI;
      const rotX = (rand() - 0.5) * 0.16; // Organic slight resting tilt angle

      data.push({ x, y, z, scaleX, scaleY, rotX, rotY });
    }
    return data;
  }, []);

  // Multi-tonal organic grass color palette
  const colors = useMemo(() => {
    const palette = [
      new THREE.Color('#14532d'), // Deep rich forest green
      new THREE.Color('#15803d'), // Lush healthy emerald green
      new THREE.Color('#16a34a'), // Vibrant active spring green
      new THREE.Color('#854d0e'), // Natural dry thatch yellow highlights
      new THREE.Color('#a3e635'), // Fresh young lime green shoots
    ];
    
    const bladeColors = [];
    for (let i = 0; i < count; i++) {
      const r = Math.random();
      let selected;
      if (r < 0.38) selected = palette[0];
      else if (r < 0.74) selected = palette[1];
      else if (r < 0.89) selected = palette[2];
      else if (r < 0.96) selected = palette[4];
      else selected = palette[3];
      
      bladeColors.push(selected);
    }
    return bladeColors;
  }, []);

  // Static CPU Matrix initializer: Sets translations/rotations once to preserve CPU cycles
  useEffect(() => {
    if (!meshRef.current) return;
    instances.forEach((item, idx) => {
      tempObject.position.set(item.x, item.y, item.z);
      tempObject.rotation.set(item.rotX, item.rotY, 0);
      tempObject.scale.set(item.scaleX, item.scaleY, item.scaleX);
      tempObject.updateMatrix();
      
      meshRef.current!.setMatrixAt(idx, tempObject.matrix);
      meshRef.current!.setColorAt(idx, colors[idx]);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [instances, colors, tempObject]);

  // Pass time to GPU shader via custom uniform ref
  const uniforms = useMemo(() => ({
    uTime: { value: 0 }
  }), []);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.getElapsedTime();
  });

  // Inject optimized wind sway equations directly into the GPU Vertex Shader
  const handleBeforeCompile = (shader: any) => {
    shader.uniforms.uTime = uniforms.uTime;
    
    shader.vertexShader = `
      uniform float uTime;
    ` + shader.vertexShader;
    
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `
        #include <begin_vertex>
        
        #ifdef USE_INSTANCING
          // Read instance translation coordinates from 4th column of instanceMatrix
          vec3 instancePos = vec3(instanceMatrix[3].x, instanceMatrix[3].y, instanceMatrix[3].z);
          
          // Spatial wind wave calculation based on coordinates and elapsed time
          float wind = sin(uTime * 2.8 + instancePos.x * 0.45 + instancePos.z * 0.35) * 0.125;
          
          // Sway quadratically with height (local position.y goes from 0 at base to 1 at tip!)
          float heightFactor = position.y;
          transformed.x += wind * heightFactor * heightFactor;
          transformed.z += wind * 0.4 * heightFactor * heightFactor;
        #endif
      `
    );
  };

  return (
    <instancedMesh 
      ref={meshRef} 
      geometry={grassGeometry} 
      args={[null as any, null as any, count]} 
      castShadow 
      receiveShadow
    >
      <meshStandardMaterial 
        roughness={0.92} 
        side={THREE.DoubleSide} 
        shadowSide={THREE.DoubleSide}
        onBeforeCompile={handleBeforeCompile}
      />
    </instancedMesh>
  );
};
