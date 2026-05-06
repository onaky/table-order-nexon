import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** 트러플 감자튀김 - 리얼리스틱 PBR */
export default function FriesModel() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  const fries = useMemo(() =>
    Array.from({ length: 22 }).map((_, i) => ({
      x: (Math.random() - 0.5) * 0.5,
      z: (Math.random() - 0.5) * 0.5,
      height: 0.5 + Math.random() * 0.5,
      rotX: (Math.random() - 0.5) * 0.35,
      rotZ: (Math.random() - 0.5) * 0.35,
      color: `hsl(42, ${70 + Math.random() * 20}%, ${55 + Math.random() * 15}%)`,
      key: i,
    })), []);

  return (
    <group ref={groupRef} position={[0, -0.4, 0]} scale={0.85}>
      {/* 빨간 종이 컵 - 질감 */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.52, 0.38, 0.85, 24]} />
        <meshStandardMaterial color="#B71C1C" roughness={0.8} />
      </mesh>
      {/* 컵 흰 줄무늬 */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.44, 0.39, 0.12, 24]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.7} />
      </mesh>
      {/* 컵 안쪽 */}
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.02, 24]} />
        <meshStandardMaterial color="#4E342E" roughness={0.9} />
      </mesh>

      {/* 감자튀김 - 각진 스틱 */}
      {fries.map((fry) => (
        <mesh
          key={fry.key}
          position={[fry.x, 0.72 + fry.height / 2, fry.z]}
          rotation={[fry.rotX, 0, fry.rotZ]}
          castShadow
        >
          <boxGeometry args={[0.055, fry.height, 0.055]} />
          <meshStandardMaterial color={fry.color} roughness={0.65} />
        </mesh>
      ))}

      {/* 트러플 오일 광택 */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh
          key={`oil-${i}`}
          position={[
            (Math.random() - 0.5) * 0.4,
            0.85 + Math.random() * 0.3,
            (Math.random() - 0.5) * 0.4,
          ]}
        >
          <sphereGeometry args={[0.018, 6, 6]} />
          <meshStandardMaterial color="#1B1B1B" roughness={0.1} metalness={0.4} />
        </mesh>
      ))}

      {/* 파마산 치즈 */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh
          key={`parm-${i}`}
          position={[
            (Math.random() - 0.5) * 0.45,
            0.8 + Math.random() * 0.35,
            (Math.random() - 0.5) * 0.45,
          ]}
          rotation={[Math.random(), Math.random(), 0]}
        >
          <boxGeometry args={[0.03, 0.01, 0.03]} />
          <meshStandardMaterial color="#FFF8E1" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}
