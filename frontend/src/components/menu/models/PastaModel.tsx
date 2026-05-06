import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** 갈릭 쉬림프 파스타 - 프로시저럴 3D */
export default function PastaModel() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* 접시 */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.3, 1.4, 0.1, 32]} />
        <meshStandardMaterial color="#F5F5F5" roughness={0.3} metalness={0.1} />
      </mesh>
      {/* 접시 테두리 */}
      <mesh position={[0, 0.05, 0]}>
        <torusGeometry args={[1.3, 0.05, 8, 32]} />
        <meshStandardMaterial color="#E0E0E0" roughness={0.3} />
      </mesh>

      {/* 파스타 면 (꼬인 토러스들) */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 8) * Math.PI * 2) * 0.5,
            0.2 + Math.random() * 0.15,
            Math.sin((i / 8) * Math.PI * 2) * 0.5,
          ]}
          rotation={[Math.random() * Math.PI, Math.random() * Math.PI, Math.random()]}
        >
          <torusGeometry args={[0.25, 0.04, 8, 16]} />
          <meshStandardMaterial color="#F5DEB3" roughness={0.6} />
        </mesh>
      ))}

      {/* 중앙 파스타 더미 */}
      <mesh position={[0, 0.25, 0]}>
        <sphereGeometry args={[0.6, 16, 12]} />
        <meshStandardMaterial color="#EDCF8E" roughness={0.7} />
      </mesh>

      {/* 새우 */}
      {[0, 1, 2].map((i) => (
        <group
          key={`shrimp-${i}`}
          position={[
            Math.cos((i / 3) * Math.PI * 2) * 0.7,
            0.35,
            Math.sin((i / 3) * Math.PI * 2) * 0.7,
          ]}
          rotation={[0, (i / 3) * Math.PI * 2, 0]}
        >
          {/* 새우 몸통 */}
          <mesh rotation={[0.3, 0, 0]}>
            <capsuleGeometry args={[0.08, 0.25, 8, 8]} />
            <meshStandardMaterial color="#FF8A65" roughness={0.5} />
          </mesh>
          {/* 새우 꼬리 */}
          <mesh position={[0, 0.15, -0.08]} rotation={[0.8, 0, 0]}>
            <coneGeometry args={[0.06, 0.12, 8]} />
            <meshStandardMaterial color="#FFAB91" roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* 파슬리 가루 */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh
          key={`parsley-${i}`}
          position={[
            (Math.random() - 0.5) * 1.0,
            0.4 + Math.random() * 0.1,
            (Math.random() - 0.5) * 1.0,
          ]}
        >
          <sphereGeometry args={[0.02, 4, 4]} />
          <meshStandardMaterial color="#388E3C" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}
