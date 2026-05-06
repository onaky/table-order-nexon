import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** 스파이시 할라피뇨 버거 - 리얼리스틱 PBR */
export default function SpicyBurgerModel() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]} scale={0.85}>
      {/* 아래 빵 */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.95, 1.05, 0.28, 48]} />
        <meshStandardMaterial color="#B87333" roughness={0.85} />
      </mesh>

      {/* 양상추 */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh
          key={`lettuce-${i}`}
          position={[
            Math.cos((i / 10) * Math.PI * 2) * 0.82,
            0.2,
            Math.sin((i / 10) * Math.PI * 2) * 0.82,
          ]}
          rotation={[Math.random() * 0.4, (i / 10) * Math.PI * 2, 0]}
        >
          <sphereGeometry args={[0.16, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#4CAF50" roughness={0.7} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* 패티 */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.88, 0.9, 0.22, 48]} />
        <meshStandardMaterial color="#2D1810" roughness={0.95} />
      </mesh>

      {/* 할라피뇨 슬라이스 - 리얼리스틱 링 */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh
          key={`jalapeno-${i}`}
          position={[
            Math.cos((i / 6) * Math.PI * 2) * 0.45,
            0.5,
            Math.sin((i / 6) * Math.PI * 2) * 0.45,
          ]}
          rotation={[Math.PI / 2 + Math.random() * 0.2, 0, Math.random()]}
        >
          <torusGeometry args={[0.08, 0.025, 8, 16]} />
          <meshStandardMaterial color="#2E7D32" roughness={0.6} />
        </mesh>
      ))}
      {/* 할라피뇨 씨앗 */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh
          key={`seed-${i}`}
          position={[
            Math.cos((i / 8) * Math.PI * 2) * 0.4,
            0.52,
            Math.sin((i / 8) * Math.PI * 2) * 0.4,
          ]}
        >
          <sphereGeometry args={[0.012, 4, 4]} />
          <meshStandardMaterial color="#FFFDE7" roughness={0.8} />
        </mesh>
      ))}

      {/* 스파이시 소스 - 광택 있는 빨간 줄 */}
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh key={`sauce-${i}`} position={[0, 0.56, 0]} rotation={[0, (i / 3) * Math.PI * 2, 0]}>
          <torusGeometry args={[0.25 + i * 0.12, 0.015, 4, 24]} />
          <meshStandardMaterial color="#C62828" roughness={0.15} metalness={0.2} />
        </mesh>
      ))}

      {/* 토마토 */}
      <mesh position={[0, 0.63, 0]} castShadow>
        <cylinderGeometry args={[0.75, 0.78, 0.08, 32]} />
        <meshStandardMaterial color="#E53935" roughness={0.45} />
      </mesh>

      {/* 위 빵 */}
      <mesh position={[0, 0.88, 0]} castShadow>
        <sphereGeometry args={[0.95, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2.2]} />
        <meshStandardMaterial color="#CC7A2E" roughness={0.75} />
      </mesh>
    </group>
  );
}
