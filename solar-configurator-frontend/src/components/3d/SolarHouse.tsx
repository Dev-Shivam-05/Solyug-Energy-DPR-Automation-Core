import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface Props {
  panelCount: number;
}

export const SolarHouse: React.FC<Props> = ({ panelCount }) => {
  const count = panelCount || 0;
  const houseRef = useRef<THREE.Group>(null);

  // Dynamic grid math
  const cols = Math.max(1, Math.ceil(Math.sqrt(count)));
  const rows = Math.ceil(count / cols);

  const gapX = 1.25;
  const gapZ = 0.9;

  return (
    <group ref={houseRef} position={[0, -1.0, 0]}>
      {/* 1. ARCHITECTURAL SCENARIO LANDSCAPING (Grass ground, Stepping stones, planters, trees) */}
      <VillaLandscape />

      {/* 2. MAIN MODERN VILLA ARCHITECTURE */}
      <ModernVilla />

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
};

/* ═══════════════════════════════════════════════════════════════
   ARCHITECTURAL LANDSCAPING (Grass ground plane, walkways, trees)
   ═══════════════════════════════════════════════════════════════ */
const VillaLandscape: React.FC = () => {
  const [concreteTex, grassTex] = useTexture([
    '/textures/concrete_wall.png',
    '/textures/grass_lawn.png'
  ]);

  useMemo(() => {
    concreteTex.wrapS = concreteTex.wrapT = THREE.RepeatWrapping;
    concreteTex.repeat.set(4, 2.5);

    // Repeated dense tiling for realistic lawn grass blades details
    grassTex.wrapS = grassTex.wrapT = THREE.RepeatWrapping;
    grassTex.repeat.set(16, 16);
  }, [concreteTex, grassTex]);

  return (
    <group>
      {/* Lush AI-Textured Grass Ground Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.21, 0]} receiveShadow>
        <planeGeometry args={[45, 45]} />
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
        {/* Shrub foliage clusters */}
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
            <mesh key={idx} position={[xOff, 0, 0]} castShadow>
              <dodecahedronGeometry args={[0.14, 1]} />
              <meshStandardMaterial color={idx === 1 ? "#15803d" : "#166534"} roughness={0.9} />
            </mesh>
          ))}
        </group>
      </group>

      {/* Background Landscaping Cypress Trees (Casts long evening shadows) */}
      <LandscapingTree position={[-4.0, -0.2, -1.8]} height={4.2} />
      <LandscapingTree position={[3.6, -0.2, -2.2]} height={3.9} />
      <LandscapingTree position={[-4.5, -0.2, 0.8]} height={3.6} />
      <LandscapingTree position={[4.6, -0.2, 1.4]} height={3.4} />

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

  return (
    <group position={position}>
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
const ModernVilla: React.FC = () => {
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

      {/* Concrete Entry Stairs */}
      {[-2.0, -0.05, 3.25].map((yOff, i) => (
        <mesh key={i} position={[-1.8, -0.05 + i * 0.1, 3.2 + i * 0.25] as [number, number, number]} receiveShadow castShadow>
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

      {/* Warm Oak Pivoting Front Door */}
      <group position={[-1.8, 0.7, 2.81]}>
        <mesh castShadow>
          <boxGeometry args={[1.1, 1.35, 0.08]} />
          <meshStandardMaterial color="#ffffff" map={woodTex} roughness={0.65} metalness={0.05} />
        </mesh>
        {/* Brushed Stainless Steel Handle */}
        <mesh position={[0.4, 0, 0.05]}>
          <cylinderGeometry args={[0.012, 0.012, 0.5, 8]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.8} />
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

      {/* Modern Floor-to-Ceiling Ribbon Windows */}
      {/* Ground Floor Large Window Left */}
      <group position={[-3.3, 0.75, 2.81]}>
        <mesh castShadow>
          <boxGeometry args={[1.2, 1.2, 0.04]} />
          <meshPhysicalMaterial
            color="#cbd5e1"
            transparent
            opacity={0.25}
            roughness={0.01}
            metalness={0.9}
            transmission={0.95}
            thickness={0.05}
            envMapIntensity={3.0}
          />
        </mesh>
        {/* Frame profile */}
        <mesh>
          <boxGeometry args={[1.22, 1.22, 0.06]} />
          <meshBasicMaterial color="#0f172a" wireframe />
        </mesh>
      </group>

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
  const targetY = position[1];

  // Load the silicon wafer AI texture map
  const solarTex = useTexture('/textures/solar_cell.png');

  // Landing sequence
  useFrame((_, dt) => {
    if (!groupRef.current) return;
    elapsed.current += dt;
    const startDelay = index * 0.05;
    const localTime = Math.max(0, elapsed.current - startDelay);
    
    if (localTime < 0.8) {
      const progress = Math.min(1.0, localTime * 1.25);
      const ease = 1 - Math.pow(1 - progress, 4); // easeOutQuart
      
      groupRef.current.position.y = THREE.MathUtils.lerp(3.2, targetY, ease);
      groupRef.current.scale.setScalar(ease);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(-0.25, 0, ease);
    } else {
      groupRef.current.position.y = targetY;
      groupRef.current.scale.setScalar(1);
      groupRef.current.rotation.y = 0;
    }
  });

  const angleTilt = -0.28; // Tilted angle facing solar noon (~16 deg)

  return (
    <group ref={groupRef} position={[position[0], 3.2, position[2]]} scale={0}>
      
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
   DYNAMIC INSTANCED 3D GRASS FIELD (GPU Optimized Particles)
   ═══════════════════════════════════════════════════════════════ */
const GrassField: React.FC = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 2600; // Increased to 2,600 dense grass blade particles for absolute organic yard grounding

  // Dummy Object3D to update instance matrices
  const tempObject = useMemo(() => new THREE.Object3D(), []);

  // Generate random positions, heights, bends, and rotations
  const instances = useMemo(() => {
    const data = [];
    const rand = Math.random;

    for (let i = 0; i < count; i++) {
      // Base distribution across front and side yards
      let x = (rand() - 0.5) * 13.0;
      let z = 0.5 + rand() * 5.6;

      // Coordinate checks
      const inStairs = x > -2.7 && x < -0.9 && z > 2.9 && z < 3.6;
      const inWalkway = x > -2.0 && x < -0.8 && z > 3.6 && z < 6.5;
      const inPlanter1 = x > -1.0 && x < -0.2 && z > 2.7 && z < 3.5;
      const inPlanter2 = x > -4.0 && x < -2.6 && z > 2.0 && z < 2.6;
      const inHouse = x > -4.1 && x < 3.9 && z > -2.9 && z < 2.5;

      // Realism tweak: We deliberately cluster grass close to the edge borders of pathways/planters
      if (inStairs || inWalkway || inPlanter1 || inPlanter2 || inHouse) {
        // Instead of random scattering, push them exactly to the margins of these concrete shapes
        // This generates thick grass tufts immediately framing all hard concrete edges!
        const pushX = rand() > 0.5 ? 1.0 : -1.0;
        const pushZ = rand() > 0.5 ? 1.0 : -1.0;
        x += pushX * 0.45;
        z += pushZ * 0.45;
      }

      const scaleY = 0.16 + rand() * 0.24; // Organic height: 16cm to 40cm
      const scaleX = 0.012 + rand() * 0.015; // Width
      
      // Stand base exactly on the grass plane at Y = -0.21
      const y = -0.21 + scaleY / 2;
      
      const rotY = rand() * Math.PI;
      const rotX = (rand() - 0.5) * 0.25; // Organic initial lean angle

      data.push({ x, y, z, scaleX, scaleY, rotX, rotY });
    }
    return data;
  }, []);

  // Multi-tonal organic grass color palette
  const colors = useMemo(() => {
    const palette = [
      new THREE.Color('#14532d'), // Deep forest green
      new THREE.Color('#15803d'), // Lush emerald green
      new THREE.Color('#16a34a'), // Vibrant spring green
      new THREE.Color('#854d0e'), // Dry thatch straw yellow accent
      new THREE.Color('#a3e635'), // Bright new shoot lime green
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

  // Initialize initial instance matrices and colors
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

  // Swaying Wind wave simulation
  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    
    instances.forEach((item, idx) => {
      // Wind wave equation based on time and spatial X coordinate
      const windAngle = Math.sin(time * 2.8 + item.x * 0.4) * 0.095;
      
      tempObject.position.set(item.x, item.y, item.z);
      // Wind sway on X/Z coordinates
      tempObject.rotation.set(item.rotX + windAngle, item.rotY, windAngle * 0.5);
      tempObject.scale.set(item.scaleX, item.scaleY, item.scaleX);
      tempObject.updateMatrix();
      
      meshRef.current!.setMatrixAt(idx, tempObject.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null as any, null as any, count]} castShadow receiveShadow>
      {/* Blade Geometry: beveled thin plane geometry */}
      <planeGeometry args={[1, 1, 1, 3]} />
      <meshStandardMaterial 
        roughness={0.95} 
        side={THREE.DoubleSide} 
        shadowSide={THREE.DoubleSide}
      />
    </instancedMesh>
  );
};
