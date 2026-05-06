import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** 스파이시 할라피뇨 버거 - 프로시저럴 3D */
export default function SpicyBurgerModel() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      {/* 아래 빵 */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.9, 1.0, 0.3, 32]} />
        <meshStandardMaterial color="#C67A3C" roughness={0.8} />
      </mesh>

      {/* 양상추 */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[1.0, 0.95, 0.08, 32]} />
        <meshStandardMaterial color="#66BB6A" roughness={0.6} />
      </mesh>

      {/* 패티 */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.85, 0.85, 0.25, 32]} />
        <meshStandardMaterial color="#3E2723" roughness={0.9} />
      </mesh>

      {/* 할라피뇨 슬라이스 (초록 링) */}
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 4) * Math.PI * 2) * 0.4,
            0.58,
            Math.sin((i / 4) * Math.PI * 2) * 0.4,
          ]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[0.12, 0.04, 8, 16]} />
          <meshStandardMaterial color="#2E7D32" roughness={0.5} />
        </mesh>
      ))}

      {/* 스파이시 소스 (빨간 줄) */}
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.88, 0.85, 0.05, 32]} />
        <meshStandardMaterial color="#D32F2F" roughness={0.3} metalness={0.2} />
      </mesh>

      {/* 토마토 */}
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.1, 32]} />
        <meshStandardMaterial color="#EF5350" roughness={0.5} />
      </mesh>

      {/* 위 빵 */}
      <mesh position={[0, 0.95, 0]}>
        <sphereGeometry args={[0.9, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#E8943C" roughness={0.7} />
      </mesh>
    </group>
  );
}
