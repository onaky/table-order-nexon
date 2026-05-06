import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** 트러플 시그니처 버거 - 리얼리스틱 PBR */
export default function BurgerModel() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]} scale={0.85}>
      {/* 아래 빵 - 부드러운 곡면 */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.95, 1.05, 0.28, 48]} />
        <meshStandardMaterial color="#C8873A" roughness={0.85} metalness={0} />
      </mesh>

      {/* 양상추 - 불규칙한 가장자리 */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh
          key={`lettuce-${i}`}
          position={[
            Math.cos((i / 12) * Math.PI * 2) * 0.85,
            0.2,
            Math.sin((i / 12) * Math.PI * 2) * 0.85,
          ]}
          rotation={[Math.random() * 0.3, (i / 12) * Math.PI * 2, Math.random() * 0.2]}
        >
          <sphereGeometry args={[0.18, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#3E8B3E" roughness={0.7} metalness={0} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* 패티 - 그릴 마크 질감 */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.88, 0.9, 0.22, 48]} />
        <meshStandardMaterial color="#3D2314" roughness={0.95} metalness={0} />
      </mesh>
      {/* 패티 그릴 마크 */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={`grill-${i}`} position={[0, 0.47, -0.6 + i * 0.3]} rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[1.6, 0.02, 0.03]} />
          <meshStandardMaterial color="#1A0A05" roughness={1} />
        </mesh>
      ))}

      {/* 녹은 치즈 - 가장자리 흘러내림 */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.95, 0.9, 0.05, 48]} />
        <meshStandardMaterial color="#F5A623" roughness={0.4} metalness={0.05} />
      </mesh>
      {/* 치즈 흘러내림 */}
      {[0, 2, 4, 6].map((i) => (
        <mesh
          key={`drip-${i}`}
          position={[
            Math.cos((i / 8) * Math.PI * 2) * 0.92,
            0.42,
            Math.sin((i / 8) * Math.PI * 2) * 0.92,
          ]}
        >
          <capsuleGeometry args={[0.04, 0.12, 4, 8]} />
          <meshStandardMaterial color="#F5A623" roughness={0.35} metalness={0.05} />
        </mesh>
      ))}

      {/* 토마토 슬라이스 */}
      <mesh position={[0, 0.57, 0]} castShadow>
        <cylinderGeometry args={[0.75, 0.78, 0.08, 32]} />
        <meshStandardMaterial color="#D32F2F" roughness={0.5} metalness={0} />
      </mesh>

      {/* 트러플 소스 줄 */}
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh
          key={`truffle-${i}`}
          position={[0, 0.63, 0]}
          rotation={[0, (i / 4) * Math.PI, 0]}
        >
          <torusGeometry args={[0.3 + i * 0.1, 0.02, 4, 24]} />
          <meshStandardMaterial color="#1B1B1B" roughness={0.2} metalness={0.3} />
        </mesh>
      ))}

      {/* 위 빵 - 부드러운 돔 */}
      <mesh position={[0, 0.88, 0]} castShadow>
        <sphereGeometry args={[0.95, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2.2]} />
        <meshStandardMaterial color="#D4943D" roughness={0.75} metalness={0} />
      </mesh>

      {/* 참깨 - 자연스러운 분포 */}
      {Array.from({ length: 20 }).map((_, i) => {
        const theta = (i / 20) * Math.PI * 2 + Math.random() * 0.3;
        const r = 0.3 + Math.random() * 0.4;
        const y = 1.0 + Math.cos(r) * 0.15;
        return (
          <mesh
            key={`sesame-${i}`}
            position={[Math.cos(theta) * r, y, Math.sin(theta) * r]}
            rotation={[Math.random() * 0.5, Math.random(), 0]}
          >
            <capsuleGeometry args={[0.02, 0.04, 4, 6]} />
            <meshStandardMaterial color="#FFF8E1" roughness={0.6} metalness={0} />
          </mesh>
        );
      })}
    </group>
  );
}
