import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** 갈릭 쉬림프 파스타 - 리얼리스틱 PBR */
export default function PastaModel() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
    }
  });

  const noodles = useMemo(() =>
    Array.from({ length: 14 }).map((_, i) => ({
      x: (Math.random() - 0.5) * 0.8,
      z: (Math.random() - 0.5) * 0.8,
      y: 0.2 + Math.random() * 0.2,
      rotX: Math.random() * Math.PI,
      rotY: Math.random() * Math.PI,
      radius: 0.15 + Math.random() * 0.15,
      key: i,
    })), []);

  return (
    <group ref={groupRef} position={[0, -0.4, 0]} scale={0.8}>
      {/* 접시 - 세라믹 질감 */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.4, 1.5, 0.08, 48]} />
        <meshStandardMaterial color="#FAFAFA" roughness={0.25} metalness={0.02} />
      </mesh>
      {/* 접시 림 */}
      <mesh position={[0, 0.04, 0]}>
        <torusGeometry args={[1.4, 0.04, 8, 48]} />
        <meshStandardMaterial color="#E8E8E8" roughness={0.2} metalness={0.05} />
      </mesh>
      {/* 접시 오목한 부분 */}
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[1.1, 1.2, 0.04, 48]} />
        <meshStandardMaterial color="#F5F5F5" roughness={0.3} />
      </mesh>

      {/* 파스타 면 - 꼬인 형태 */}
      {noodles.map((n) => (
        <mesh key={n.key} position={[n.x, n.y, n.z]} rotation={[n.rotX, n.rotY, 0]}>
          <torusGeometry args={[n.radius, 0.025, 6, 20]} />
          <meshStandardMaterial color="#E8D5A3" roughness={0.55} metalness={0} />
        </mesh>
      ))}

      {/* 크림 소스 베이스 */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.9, 1.0, 0.06, 32]} />
        <meshStandardMaterial color="#FFF8E1" roughness={0.3} metalness={0.05} transparent opacity={0.8} />
      </mesh>

      {/* 새우 3마리 - 디테일 */}
      {[0, 1, 2].map((i) => (
        <group
          key={`shrimp-${i}`}
          position={[
            Math.cos((i / 3) * Math.PI * 2 + 0.5) * 0.65,
            0.32,
            Math.sin((i / 3) * Math.PI * 2 + 0.5) * 0.65,
          ]}
          rotation={[0.3, (i / 3) * Math.PI * 2, 0]}
        >
          {/* 새우 몸통 - C자 곡선 */}
          <mesh>
            <capsuleGeometry args={[0.07, 0.22, 8, 12]} />
            <meshStandardMaterial color="#FF7043" roughness={0.45} metalness={0.05} />
          </mesh>
          {/* 새우 꼬리 */}
          <mesh position={[0, 0.15, -0.05]} rotation={[0.6, 0, 0]}>
            <coneGeometry args={[0.06, 0.1, 6]} />
            <meshStandardMaterial color="#FFAB91" roughness={0.5} />
          </mesh>
          {/* 새우 줄무늬 */}
          {[0, 1, 2].map((j) => (
            <mesh key={j} position={[0, -0.06 + j * 0.06, 0.07]}>
              <boxGeometry args={[0.14, 0.01, 0.01]} />
              <meshStandardMaterial color="#E64A19" roughness={0.6} />
            </mesh>
          ))}
        </group>
      ))}

      {/* 파슬리 */}
      {Array.from({ length: 15 }).map((_, i) => (
        <mesh
          key={`parsley-${i}`}
          position={[
            (Math.random() - 0.5) * 1.2,
            0.35 + Math.random() * 0.08,
            (Math.random() - 0.5) * 1.2,
          ]}
        >
          <sphereGeometry args={[0.015, 4, 4]} />
          <meshStandardMaterial color="#2E7D32" roughness={0.8} />
        </mesh>
      ))}

      {/* 갈릭 칩 */}
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh
          key={`garlic-${i}`}
          position={[
            (Math.random() - 0.5) * 0.6,
            0.33,
            (Math.random() - 0.5) * 0.6,
          ]}
          rotation={[Math.PI / 2, Math.random(), 0]}
        >
          <cylinderGeometry args={[0.04, 0.04, 0.01, 8]} />
          <meshStandardMaterial color="#F5E6C8" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}
