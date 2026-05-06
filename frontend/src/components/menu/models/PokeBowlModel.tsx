import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** 아보카도 포케 보울 - 프로시저럴 3D */
export default function PokeBowlModel() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      {/* 보울 (그릇) */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#37474F" roughness={0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* 밥 베이스 */}
      <mesh position={[0, 0.15, 0]}>
        <sphereGeometry args={[0.95, 32, 16, 0, Math.PI * 2, 0, Math.PI / 3]} />
        <meshStandardMaterial color="#FAFAFA" roughness={0.8} />
      </mesh>

      {/* 아보카도 슬라이스 (부채꼴) */}
      <mesh position={[-0.4, 0.35, 0]} rotation={[0.2, 0, -0.3]}>
        <sphereGeometry args={[0.3, 16, 8, 0, Math.PI]} />
        <meshStandardMaterial color="#7CB342" roughness={0.6} />
      </mesh>
      <mesh position={[-0.35, 0.38, 0]} rotation={[0.2, 0, -0.3]}>
        <sphereGeometry args={[0.15, 12, 8, 0, Math.PI]} />
        <meshStandardMaterial color="#558B2F" roughness={0.5} />
      </mesh>

      {/* 연어 (오렌지 조각들) */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={`salmon-${i}`}
          position={[0.3 + i * 0.15, 0.35, -0.2 + i * 0.1]}
          rotation={[0.1, 0.5, 0]}
        >
          <boxGeometry args={[0.2, 0.06, 0.3]} />
          <meshStandardMaterial color="#FF7043" roughness={0.4} />
        </mesh>
      ))}

      {/* 에다마메 (초록 콩) */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={`edamame-${i}`}
          position={[
            Math.cos((i / 5) * Math.PI + 1) * 0.5,
            0.35,
            Math.sin((i / 5) * Math.PI + 1) * 0.5,
          ]}
        >
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#66BB6A" roughness={0.6} />
        </mesh>
      ))}

      {/* 참깨 */}
      {Array.from({ length: 15 }).map((_, i) => (
        <mesh
          key={`sesame-${i}`}
          position={[
            (Math.random() - 0.5) * 1.2,
            0.38 + Math.random() * 0.05,
            (Math.random() - 0.5) * 1.2,
          ]}
        >
          <sphereGeometry args={[0.015, 4, 4]} />
          <meshStandardMaterial color="#FFF9C4" roughness={0.5} />
        </mesh>
      ))}

      {/* 간장 소스 뿌림 */}
      <mesh position={[0.1, 0.32, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.15, 0.02, 4, 12]} />
        <meshStandardMaterial color="#4E342E" roughness={0.3} transparent opacity={0.7} />
      </mesh>
    </group>
  );
}
