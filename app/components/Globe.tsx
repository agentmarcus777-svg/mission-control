'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function GlobeWireframe() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const pointsRef = useRef<THREE.Points>(null);

  // Create wireframe globe geometry
  const wireframeGeo = useMemo(() => new THREE.SphereGeometry(1.8, 36, 24), []);
  
  // Create scattered data points on sphere surface
  const pointsGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions: number[] = [];
    const colors: number[] = [];
    
    // Major cities / data nodes
    const nodes = [
      [40.7, -74.0],   // NYC
      [51.5, -0.1],    // London
      [35.7, 139.7],   // Tokyo
      [31.2, 121.5],   // Shanghai
      [-33.9, 151.2],  // Sydney
      [48.9, 2.3],     // Paris
      [37.8, -122.4],  // SF
      [34.1, -118.2],  // LA
      [19.4, -99.1],   // Mexico City
      [-23.5, -46.6],  // São Paulo
      [55.8, 37.6],    // Moscow
      [1.3, 103.8],    // Singapore
      [25.3, 55.3],    // Dubai
      [28.6, 77.2],    // Delhi
      [-1.3, 36.8],    // Nairobi
      [41.9, 12.5],    // Rome
      [59.3, 18.1],    // Stockholm
      [22.3, 114.2],   // Hong Kong
      [37.6, 127.0],   // Seoul
      [33.3, 44.4],    // Baghdad
    ];

    nodes.forEach(([lat, lon]) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const r = 1.82;
      positions.push(
        -r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
      );
      // Gold color
      colors.push(0.96, 0.62, 0.04);
    });

    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    return geo;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.15;
    }
    if (glowRef.current) {
      glowRef.current.rotation.y = t * 0.15;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.15;
    }
  });

  return (
    <group>
      {/* Ambient glow sphere */}
      <mesh ref={glowRef} scale={2.1}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#f59e0b"
          transparent
          opacity={0.03}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Wireframe globe */}
      <mesh ref={meshRef} geometry={wireframeGeo}>
        <meshBasicMaterial
          color="#f59e0b"
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Second wireframe layer - longitude lines */}
      <mesh rotation={[0, Math.PI / 6, 0]} geometry={wireframeGeo}>
        <meshBasicMaterial
          color="#3b82f6"
          wireframe
          transparent
          opacity={0.06}
        />
      </mesh>

      {/* Data points */}
      <points ref={pointsRef} geometry={pointsGeo}>
        <pointsMaterial
          size={0.06}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
        />
      </points>

      {/* Rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.2, 2.22, 64]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[Math.PI / 2.5, 0.3, 0]}>
        <ringGeometry args={[2.4, 2.42, 64]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export default function Globe() {
  return (
    <div className="globe-container" style={{ height: '340px', padding: '20px' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <GlobeWireframe />
      </Canvas>
      {/* Overlay text */}
      <div style={{
        position: 'absolute',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        pointerEvents: 'none',
      }}>
        <div style={{
          fontSize: '10px',
          letterSpacing: '3px',
          color: '#f59e0b',
          opacity: 0.6,
          textTransform: 'uppercase',
        }}>
          GLOBAL OPERATIONS • 20 NODES ACTIVE
        </div>
      </div>
    </div>
  );
}
