import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  panelCount: number;
}

export const DynamicGrid: React.FC<Props> = ({ panelCount }) => {
  const count = panelCount || 0;
  const cols = Math.max(1, Math.ceil(Math.sqrt(count)));
  const rows = Math.ceil(count / cols);
  const gapX = 2.3;
  const gapZ = 1.35;

  return (
    <group>
      {Array.from({ length: count }).map((_, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = (col - (cols - 1) / 2) * gapX;
        const z = (row - (rows - 1) / 2) * gapZ;
        return <SolarPanel key={i} target={[x, 0, z]} delay={i * 0.05} idx={i} />;
      })}

      {count > 0 && <Rooftop w={cols * gapX + 3.5} d={rows * gapZ + 3.5} />}
    </group>
  );
};

/* ────────────────────────────────────────────────
   Realistic Solar Panel — multi-mesh construction
   ──────────────────────────────────────────────── */

interface PanelProps {
  target: [number, number, number];
  delay: number;
  idx: number;
}

const SolarPanel: React.FC<PanelProps> = ({ target, delay, idx }) => {
  const group = useRef<THREE.Group>(null);
  const glassRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const elapsed = useRef(0);
  const [ready, setReady] = useState(false);

  const cur = useMemo(() => new THREE.Vector3(target[0], -5, target[2]), []);
  const dest = useMemo(() => new THREE.Vector3(...target), [target]);

  useFrame((_, dt) => {
    if (!group.current) return;
    elapsed.current += dt;
    const prog = Math.max(0, elapsed.current - delay);

    if (prog > 0 && !ready) {
      const t = Math.min(1, prog * 1.0);
      const e = 1 - Math.pow(1 - t, 4);
      cur.lerp(dest, e * 0.1 + 0.02);
      group.current.position.copy(cur);
      group.current.scale.setScalar(Math.min(1, e));
      if (glassRef.current) glassRef.current.opacity = Math.min(1, e * 1.1);
      if (t >= 0.99) setReady(true);
    }

    if (ready) {
      group.current.position.y = target[1] + Math.sin(elapsed.current * 0.6 + idx * 0.4) * 0.006;
    }
  });

  const tilt = -0.3; // panel tilt angle facing sun

  return (
    <group ref={group} position={[target[0], -5, target[2]]} scale={0}>

      {/* === Glass top surface — dark blue silicon wafer === */}
      <mesh castShadow receiveShadow rotation={[tilt, 0, 0]}>
        <boxGeometry args={[1.92, 0.03, 0.94]} />
        <meshPhysicalMaterial
          ref={glassRef}
          color="#0a1a30"
          roughness={0.04}
          metalness={0.92}
          clearcoat={1.0}
          clearcoatRoughness={0.04}
          reflectivity={1.0}
          envMapIntensity={2.5}
          transparent
          opacity={0}
        />
      </mesh>

      {/* === Silicon cell grid overlay === */}
      {/* Horizontal cell lines */}
      {[-0.28, -0.14, 0, 0.14, 0.28].map((zOff, i) => (
        <mesh key={`h${i}`} rotation={[tilt, 0, 0]} position={[0, 0.018, zOff]}>
          <boxGeometry args={[1.88, 0.002, 0.005]} />
          <meshStandardMaterial color="#1e3a5f" transparent opacity={0.4} />
        </mesh>
      ))}
      {/* Vertical cell lines */}
      {[-0.75, -0.45, -0.15, 0.15, 0.45, 0.75].map((xOff, i) => (
        <mesh key={`v${i}`} rotation={[tilt, 0, 0]} position={[xOff, 0.018, 0]}>
          <boxGeometry args={[0.005, 0.002, 0.88]} />
          <meshStandardMaterial color="#1e3a5f" transparent opacity={0.4} />
        </mesh>
      ))}

      {/* === Aluminum frame border === */}
      {/* Top */}
      <mesh rotation={[tilt, 0, 0]} position={[0, -0.002, -0.485]}>
        <boxGeometry args={[2.04, 0.05, 0.04]} />
        <meshStandardMaterial color="#8c9aab" roughness={0.2} metalness={0.9} />
      </mesh>
      {/* Bottom */}
      <mesh rotation={[tilt, 0, 0]} position={[0, -0.002, 0.485]}>
        <boxGeometry args={[2.04, 0.05, 0.04]} />
        <meshStandardMaterial color="#8c9aab" roughness={0.2} metalness={0.9} />
      </mesh>
      {/* Left */}
      <mesh rotation={[tilt, 0, 0]} position={[-0.99, -0.002, 0]}>
        <boxGeometry args={[0.04, 0.05, 1.01]} />
        <meshStandardMaterial color="#8c9aab" roughness={0.2} metalness={0.9} />
      </mesh>
      {/* Right */}
      <mesh rotation={[tilt, 0, 0]} position={[0.99, -0.002, 0]}>
        <boxGeometry args={[0.04, 0.05, 1.01]} />
        <meshStandardMaterial color="#8c9aab" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* === Mounting rails (horizontal under panel) === */}
      <mesh position={[0, -0.12, -0.2]} castShadow>
        <boxGeometry args={[2.0, 0.035, 0.035]} />
        <meshStandardMaterial color="#5a6577" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0, -0.12, 0.2]} castShadow>
        <boxGeometry args={[2.0, 0.035, 0.035]} />
        <meshStandardMaterial color="#5a6577" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* === Support legs === */}
      {/* Front-left */}
      <mesh position={[-0.6, -0.4, 0.25]} castShadow>
        <boxGeometry args={[0.05, 0.55, 0.05]} />
        <meshStandardMaterial color="#4a5568" roughness={0.35} metalness={0.75} />
      </mesh>
      {/* Front-right */}
      <mesh position={[0.6, -0.4, 0.25]} castShadow>
        <boxGeometry args={[0.05, 0.55, 0.05]} />
        <meshStandardMaterial color="#4a5568" roughness={0.35} metalness={0.75} />
      </mesh>
      {/* Rear-left (taller for tilt) */}
      <mesh position={[-0.6, -0.3, -0.25]} castShadow>
        <boxGeometry args={[0.05, 0.75, 0.05]} />
        <meshStandardMaterial color="#4a5568" roughness={0.35} metalness={0.75} />
      </mesh>
      {/* Rear-right */}
      <mesh position={[0.6, -0.3, -0.25]} castShadow>
        <boxGeometry args={[0.05, 0.75, 0.05]} />
        <meshStandardMaterial color="#4a5568" roughness={0.35} metalness={0.75} />
      </mesh>

      {/* === Cross bracing between legs === */}
      <mesh position={[0, -0.55, 0]} rotation={[0, 0, 0]} castShadow>
        <boxGeometry args={[1.4, 0.025, 0.025]} />
        <meshStandardMaterial color="#374151" roughness={0.4} metalness={0.7} />
      </mesh>
    </group>
  );
};

/* ────────────────────────────────────────────────
   Rooftop surface
   ──────────────────────────────────────────────── */

interface RoofProps {
  w: number;
  d: number;
}

const Rooftop: React.FC<RoofProps> = ({ w, d }) => (
  <group position={[0, -0.7, 0]}>
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[w, d]} />
      <meshStandardMaterial color="#1a1008" roughness={0.92} metalness={0.05} />
    </mesh>
    {/* Subtle edge border */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]}>
      <planeGeometry args={[w + 0.6, d + 0.6]} />
      <meshStandardMaterial color="#0f0a04" roughness={0.95} metalness={0.02} transparent opacity={0.5} />
    </mesh>
  </group>
);
