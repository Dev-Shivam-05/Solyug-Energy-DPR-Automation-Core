import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Environment, Sky } from '@react-three/drei';
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
  timeRef: React.MutableRefObject<number>;
  isManualTime: boolean;
  setTimeOfDay: (t: number) => void;
}

// Convert 24-hour clock value into 3D Cartesian circular coordinates
// 6:00 is sunrise (angle = 0, West = -13.5), 12:00 is noon (angle = PI/2, overhead), 18:00 is sunset (angle = PI, East = 13.5)
const getSolarCoordinates = (timeOfDay: number) => {
  const angle = ((timeOfDay - 6) / 24) * Math.PI * 2;
  const x = -Math.cos(angle) * 13.5;
  const z = Math.cos(angle) * 4.5; // Elliptical/tilted orbit path
  const y = Math.sin(angle) * 8.5; // Negative y represents nighttime
  
  const isDay = y > 0;
  
  // Intensity climbs from sunrise, peaks at noon, fades to sunset
  const intensity = isDay ? Math.min(1.8, (y / 8.5) * 1.8) : 0;
  
  // Atmospheric color scattering: orange-red Golden Hour at horizon, crisp white at noon
  let color = '#fffbeb';
  if (isDay) {
    if (y < 2.5) {
      color = '#f97316'; // Deep golden-orange dusk/sunrise
    } else if (y < 5.0) {
      color = '#fdba74'; // Soft morning/afternoon amber
    } else {
      color = '#fffbeb'; // Bright solar white midday
    }
  }
    
  return { x, y, z, intensity, color, isDay };
};

// Real-time horizon-matching scattering fog calculations
const getFogState = (timeOfDay: number) => {
  let color = '#020408'; // Default deep slate night
  let near = 16;
  let far = 28;
  
  if (timeOfDay >= 5.0 && timeOfDay < 7.0) {
    // Sunrise transition
    const t = (timeOfDay - 5.0) / 2.0; 
    const c1 = new THREE.Color('#020408');
    const c2 = new THREE.Color('#ffedd5');
    c1.lerp(c2, t);
    color = '#' + c1.getHexString();
    near = 14 + (1-t) * 2;
    far = 26 + t * 4;
  } else if (timeOfDay >= 7.0 && timeOfDay < 16.5) {
    // Daytime standard
    const t = Math.sin(((timeOfDay - 7.0) / 9.5) * Math.PI / 2); 
    const c1 = new THREE.Color('#ffedd5');
    const c2 = new THREE.Color('#bae6fd'); // Sky blue horizon match
    c1.lerp(c2, t);
    color = '#' + c1.getHexString();
    near = 16;
    far = 34; // Expand horizon at day
  } else if (timeOfDay >= 16.5 && timeOfDay < 18.5) {
    // Sunset transition
    const t = (timeOfDay - 16.5) / 2.0; 
    const c1 = new THREE.Color('#bae6fd');
    const c2 = new THREE.Color('#fdba74'); // Warm golden sunset
    c1.lerp(c2, t);
    color = '#' + c1.getHexString();
    near = 15;
    far = 28;
  } else if (timeOfDay >= 18.5 && timeOfDay < 20.5) {
    // Twilight transition
    const t = (timeOfDay - 18.5) / 2.0; 
    const c1 = new THREE.Color('#fdba74');
    const c2 = new THREE.Color('#020408');
    c1.lerp(c2, t);
    color = '#' + c1.getHexString();
    near = 13 + t * 3;
    far = 24 + t * 4;
  }
  
  return { color, near, far };
};

interface SceneControllerProps {
  timeRef: React.MutableRefObject<number>;
  isManualTime: boolean;
  setTimeOfDay: (t: number) => void;
  isNight: boolean;
  setIsNight: (n: boolean) => void;
  fogRef: React.RefObject<THREE.Fog>;
  ambientLightRef: React.RefObject<THREE.AmbientLight>;
  sunLightRef: React.RefObject<THREE.DirectionalLight>;
  moonLightRef: React.RefObject<THREE.DirectionalLight>;
  skyRef: React.RefObject<THREE.Group>;
  starsRef: React.RefObject<THREE.Points>;
}

/**
 * SceneController runs continuously inside the canvas using useFrame.
 * It reads the time from the stable ref and directly modulates all WebGL
 * elements, bypassing React reconciler completely for ultra-fast 120 FPS performance.
 */
const SceneController: React.FC<SceneControllerProps> = ({
  timeRef,
  isManualTime,
  setTimeOfDay,
  isNight,
  setIsNight,
  fogRef,
  ambientLightRef,
  sunLightRef,
  moonLightRef,
  skyRef,
  starsRef
}) => {
  const lastUiUpdate = useRef(0);

  useFrame((state, dt) => {
    // 1. Advance clock smoothly if not in manual mode
    if (!isManualTime) {
      // 0.25 hours per second continuously (extremely smooth orbit!)
      timeRef.current = (timeRef.current + dt * 0.25) % 24;

      // Throttle parent React UI text clock updates to ~4 times per second
      const elapsed = state.clock.getElapsedTime();
      if (elapsed - lastUiUpdate.current > 0.25) {
        lastUiUpdate.current = elapsed;
        setTimeOfDay(timeRef.current);
      }
    }

    const t = timeRef.current;
    const solar = getSolarCoordinates(t);
    const fog = getFogState(t);

    // 2. Manage residential/tech lights crossing the day/night boundary
    const nightMode = !solar.isDay;
    if (nightMode !== isNight) {
      setIsNight(nightMode);
    }

    // 3. Update Fog parameters directly in WebGL
    if (fogRef.current) {
      fogRef.current.color.set(fog.color);
      fogRef.current.near = fog.near;
      fogRef.current.far = fog.far;
    }

    // 4. Update Ambient Light intensity directly in WebGL
    if (ambientLightRef.current) {
      ambientLightRef.current.intensity = solar.isDay ? 0.45 : 0.08;
    }

    // 5. Update Sunlight intensity, color, and position directly in WebGL
    if (sunLightRef.current) {
      if (solar.isDay) {
        sunLightRef.current.visible = true;
        sunLightRef.current.position.set(solar.x, solar.y, solar.z);
        sunLightRef.current.intensity = solar.intensity;
        sunLightRef.current.color.set(solar.color);
      } else {
        sunLightRef.current.visible = false;
      }
    }

    // 6. Update Moonlight visibility directly in WebGL
    if (moonLightRef.current) {
      moonLightRef.current.visible = !solar.isDay;
    }

    // 7. Update Sky Dome sunPosition uniform directly in WebGL shader
    if (skyRef.current) {
      const skyMesh = skyRef.current.children[0] as THREE.Mesh;
      if (skyMesh && skyMesh.material) {
        const skyMaterial = skyMesh.material as THREE.ShaderMaterial;
        if (skyMaterial.uniforms && skyMaterial.uniforms.sunPosition) {
          skyMaterial.uniforms.sunPosition.value.set(
            solar.x,
            Math.max(0.04, solar.y),
            solar.z
          );
        }
      }
    }

    // 8. Update Stars visibility directly in WebGL
    if (starsRef.current) {
      starsRef.current.visible = !solar.isDay || solar.y < 1.5;
    }
  });

  return null;
};

export const CanvasContainer = React.memo<Props>(({ 
  panelCount, 
  timeRef, 
  isManualTime, 
  setTimeOfDay 
}) => {
  // Local isNight boolean state which changes only twice per full diurnal cycle
  const [isNight, setIsNight] = useState(timeRef.current < 6.0 || timeRef.current > 18.0);

  // References for high-speed direct manipulation inside useFrame
  const fogRef = useRef<THREE.Fog>(null);
  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  const sunLightRef = useRef<THREE.DirectionalLight>(null);
  const moonLightRef = useRef<THREE.DirectionalLight>(null);
  const skyRef = useRef<any>(null);
  const starsRef = useRef<any>(null);

  // Calculate static initial values for standard boot-up
  const initialTime = timeRef.current;
  const initialSolar = getSolarCoordinates(initialTime);
  const initialFog = getFogState(initialTime);

  return (
    <Canvas
      camera={{ position: [11.0, 7.0, 11.5], fov: 32 }}
      shadows
      dpr={[1, 1.5]}
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
      {/* 3D Scene Controller Tick Loop */}
      <SceneController
        timeRef={timeRef}
        isManualTime={isManualTime}
        setTimeOfDay={setTimeOfDay}
        isNight={isNight}
        setIsNight={setIsNight}
        fogRef={fogRef}
        ambientLightRef={ambientLightRef}
        sunLightRef={sunLightRef}
        moonLightRef={moonLightRef}
        skyRef={skyRef}
        starsRef={starsRef}
      />

      {/* Real-time scatter fog matching horizon sky */}
      <fog 
        ref={fogRef}
        attach="fog" 
        args={[
          initialFog.color, 
          initialFog.near, 
          initialFog.far
        ]} 
      />

      {/* Ambient fill lighting (dimmed at night) */}
      <ambientLight 
        ref={ambientLightRef}
        intensity={initialSolar.isDay ? 0.45 : 0.08} 
        color="#e0f2fe" 
      />

      {/* Primary Sunlight Node with focused high-fidelity shadow frustum */}
      <directionalLight
        ref={sunLightRef}
        position={[initialSolar.x, initialSolar.y, initialSolar.z]}
        intensity={initialSolar.isDay ? initialSolar.intensity : 0}
        color={initialSolar.color}
        visible={initialSolar.isDay}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.00008}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-camera-near={0.1}
        shadow-camera-far={32}
      />

      {/* Cool Silver Moonlight Node active at night, casting soft moonlit shadows */}
      <directionalLight
        ref={moonLightRef}
        position={[6, 9, 6]}
        intensity={0.18}
        color="#cffafe" // Cool silver-blue glow
        visible={!initialSolar.isDay}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.00006}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-camera-near={0.1}
        shadow-camera-far={28}
      />

      {/* Secondary Sky reflection Light (dimmed at night) */}
      <directionalLight
        position={[-8, 6, -8]}
        intensity={initialSolar.isDay ? 0.45 : 0.05}
        color="#38bdf8"
      />

      {/* Mathematical Sky dome scattering model */}
      <Sky 
        ref={skyRef}
        sunPosition={[initialSolar.x, Math.max(0.04, initialSolar.y), initialSolar.z]} 
        turbidity={4} // Clearer, crisp premium atmosphere
        rayleigh={2.8} 
        mieCoefficient={0.003} 
        mieDirectionalG={0.8} 
      />

      {/* Star field grid (brightens during night hours) */}
      <Stars 
        ref={starsRef}
        radius={110} 
        depth={45} 
        count={initialSolar.isDay ? 400 : 1800} 
        factor={4} 
        saturation={0.5} 
        fade 
        speed={0.15}
      />

      {/* Floating golden/sunset dust particles */}
      <ParticleField count={40} />

      <Suspense fallback={null}>
        {/* Skybox specular environment reflections */}
        <Environment preset="sunset" />

        {/* Slow organic architectural float */}
        <Float speed={0.4} rotationIntensity={0.01} floatIntensity={0.04} floatingRange={[-0.02, 0.02]}>
          <SolarHouse panelCount={panelCount} isNight={isNight} />
        </Float>
      </Suspense>

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

      {/* AAA CINEMATIC POST-PROCESSING PIPELINE */}
      <AmbientComposer disableNormalPass>
        {/* Specular Bloom filter creates glowing solar active effects */}
        <DynamicBloom 
          intensity={initialSolar.isDay ? 0.45 : 0.6}
          luminanceThreshold={0.85} 
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
});

CanvasContainer.displayName = 'CanvasContainer';
