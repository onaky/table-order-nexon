import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** 아보카도 포케 보울 - 리얼리스틱 PBR */
export default function PokeBowlModel() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]} scale={0.75}>
      {/* 보울 - 매트 세라믹 */}
      <mesh position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[1.2, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#263238" roughness={0.6} metalness={0.05} side={THREE.DoubleSide} />
      </mesh>

      {/* 밥 베이스 */}
      <mesh position={[0, 0.15, 0]}>
        <sphereGeometry args={[1.05, 32, 16, 0, Math.PI * 2, 0, Math.PI / 3.5]} />
        <meshStandardMaterial color="#FEFEFE" roughness={0.85} />
      </mesh>

      {/* 아보카도 슬라이스 - 부채꼴 배열 */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh
          key={`avo-${i}`}
          position={[-0.5 + i * 0.12, 0.3, -0.3]}
          rotation={[0.4, 0, -0.2 + i * 0.05]}
        >
          <sphereGeometry args={[0.12, 12, 8, 0, Math.PI, 0, Math.PI / 1.5]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#7CB342' : '#8BC34A'} roughness={0.5} />
        </mesh>
      ))}

      {/* 연어 슬라이스 */}
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh
          key={`salmon-${i}`}
          position={[0.35 + i * 0.08, 0.28, 0.2 + i * 0.05]}
          rotation={[0.1, 0.3, 0.05 * i]}
        >
          <boxGeometry args={[0.18, 0.05, 0.28]} />
          <meshStandardMaterial color="#FF6D3A" roughness={0.35} metalness={0.05} />
        </mesh>
      ))}
      {/* 연어 지방 줄 */}
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh
          key={`fat-${i}`}
          position={[0.35 + i * 0.08, 0.3, 0.2 + i * 0.05]}
          rotation={[0.1, 0.3, 0]}
        >
          <boxGeometry args={[0.16, 0.01, 0.04]} />
          <meshStandardMaterial color="#FFB3A0" roughness={0.3} />
        </mesh>
      ))}

      {/* 에다마메 */}
      {Array.from({ length: 7 }).map((_, i) => (
        <mesh
          key={`edamame-${i}`}
          position={[
            Math.cos((i / 7) * Math.PI + 2) * 0.55,
            0.28,
            Math.sin((i / 7) * Math.PI + 2) * 0.55,
          ]}
        >
          <capsuleGeometry args={[0.035, 0.05, 4, 8]} />
          <meshStandardMaterial color="#66BB6A" roughness={0.55} />
        </mesh>
      ))}

      {/* 당근 채 */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh
          key={`carrot-${i}`}
          position={[
            -0.1 + Math.random() * 0.3,
            0.3,
            0.5 + Math.random() * 0.2,
          ]}
          rotation={[0, Math.random() * Math.PI, Math.PI / 2]}
        >
          <capsuleGeometry args={[0.012, 0.15, 4, 4]} />
          <meshStandardMaterial color="#FF8F00" roughness={0.6} />
        </mesh>
      ))}

      {/* 참깨 */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh
          key={`sesame-${i}`}
          position={[
            (Math.random() - 0.5) * 1.4,
            0.32 + Math.random() * 0.03,
            (Math.random() - 0.5) * 1.4,
          ]}
        >
          <capsuleGeometry args={[0.01, 0.02, 3, 4]} />
          <meshStandardMaterial color={Math.random() > 0.5 ? '#1A1A1A' : '#FFF8E1'} roughness={0.5} />
        </mesh>
      ))}

      {/* 간장 소스 뿌림 */}
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh key={`soy-${i}`} position={[0, 0.26, 0]} rotation={[0, i * 1.2, 0]}>
          <torusGeometry args={[0.2 + i * 0.15, 0.012, 4, 16]} />
          <meshStandardMaterial color="#3E2723" roughness={0.15} metalness={0.2} transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
}
