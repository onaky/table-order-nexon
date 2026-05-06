import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** 케이크 - 리얼리스틱 PBR */
export default function CakeModel({ variant = 'cheesecake' }: { variant?: 'cheesecake' | 'lava' }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  if (variant === 'lava') {
    return (
      <group ref={groupRef} position={[0, -0.3, 0]} scale={0.85}>
        {/* 접시 */}
        <mesh position={[0, 0, 0]} receiveShadow>
          <cylinderGeometry args={[1.1, 1.2, 0.06, 48]} />
          <meshStandardMaterial color="#FAFAFA" roughness={0.2} metalness={0.03} />
        </mesh>

        {/* 라바 케이크 본체 */}
        <mesh position={[0, 0.35, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.55, 0.6, 32]} />
          <meshStandardMaterial color="#2D1B0E" roughness={0.9} />
        </mesh>

        {/* 케이크 윗면 - 갈라진 부분 */}
        <mesh position={[0, 0.65, 0]}>
          <cylinderGeometry args={[0.48, 0.5, 0.03, 32]} />
          <meshStandardMaterial color="#1A0F08" roughness={0.85} />
        </mesh>

        {/* 흘러나오는 초콜릿 라바 - 광택 */}
        <mesh position={[0.15, 0.55, 0.15]}>
          <sphereGeometry args={[0.2, 16, 12]} />
          <meshStandardMaterial color="#4E2A0A" roughness={0.1} metalness={0.3} />
        </mesh>
        {/* 라바 흘러내림 */}
        {[0, 1, 2, 3].map((i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i / 4) * Math.PI * 2 + 0.5) * 0.48,
              0.25 + Math.random() * 0.15,
              Math.sin((i / 4) * Math.PI * 2 + 0.5) * 0.48,
            ]}
          >
            <capsuleGeometry args={[0.04, 0.15 + Math.random() * 0.1, 4, 8]} />
            <meshStandardMaterial color="#5D3A1A" roughness={0.08} metalness={0.35} />
          </mesh>
        ))}

        {/* 파우더 슈가 */}
        {Array.from({ length: 15 }).map((_, i) => (
          <mesh
            key={`sugar-${i}`}
            position={[
              (Math.random() - 0.5) * 1.5,
              0.04 + Math.random() * 0.02,
              (Math.random() - 0.5) * 1.5,
            ]}
          >
            <sphereGeometry args={[0.008, 4, 4]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
          </mesh>
        ))}

        {/* 민트 잎 */}
        <mesh position={[0.3, 0.68, -0.1]} rotation={[0.3, 0.5, 0.2]}>
          <sphereGeometry args={[0.06, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#2E7D32" roughness={0.6} side={THREE.DoubleSide} />
        </mesh>
      </group>
    );
  }

  // 바스크 치즈케이크
  return (
    <group ref={groupRef} position={[0, -0.25, 0]} scale={0.85}>
      {/* 접시 */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <cylinderGeometry args={[1.1, 1.2, 0.06, 48]} />
        <meshStandardMaterial color="#FAFAFA" roughness={0.2} metalness={0.03} />
      </mesh>

      {/* 케이크 본체 - 크리미한 질감 */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.72, 0.78, 0.5, 48]} />
        <meshStandardMaterial color="#FFF3E0" roughness={0.7} />
      </mesh>

      {/* 캐러멜라이즈 윗면 - 불규칙한 그을림 */}
      <mesh position={[0, 0.56, 0]}>
        <cylinderGeometry args={[0.72, 0.72, 0.03, 48]} />
        <meshStandardMaterial color="#BF360C" roughness={0.35} metalness={0.05} />
      </mesh>
      {/* 그을린 패치 */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 6) * Math.PI * 2) * (0.2 + Math.random() * 0.3),
            0.575,
            Math.sin((i / 6) * Math.PI * 2) * (0.2 + Math.random() * 0.3),
          ]}
        >
          <sphereGeometry args={[0.08 + Math.random() * 0.06, 8, 6, 0, Math.PI * 2, 0, Math.PI / 4]} />
          <meshStandardMaterial color="#1B0A00" roughness={0.5} />
        </mesh>
      ))}

      {/* 측면 크랙 (바스크 특유의 갈라짐) */}
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh
          key={`crack-${i}`}
          position={[
            Math.cos((i / 3) * Math.PI * 2) * 0.73,
            0.3 + Math.random() * 0.15,
            Math.sin((i / 3) * Math.PI * 2) * 0.73,
          ]}
          rotation={[0, (i / 3) * Math.PI * 2, 0]}
        >
          <boxGeometry args={[0.01, 0.2, 0.08]} />
          <meshStandardMaterial color="#E65100" roughness={0.4} />
        </mesh>
      ))}

      {/* 포크 (장식) */}
      <group position={[0.9, 0.08, 0.2]} rotation={[0, -0.3, 0]}>
        <mesh>
          <cylinderGeometry args={[0.015, 0.015, 0.8, 8]} />
          <meshStandardMaterial color="#9E9E9E" roughness={0.2} metalness={0.8} />
        </mesh>
      </group>
    </group>
  );
}
