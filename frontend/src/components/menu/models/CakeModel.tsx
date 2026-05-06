import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** 케이크 (치즈케이크/라바케이크) - 프로시저럴 3D */
export default function CakeModel({ variant = 'cheesecake' }: { variant?: 'cheesecake' | 'lava' }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  if (variant === 'lava') {
    return (
      <group ref={groupRef} position={[0, -0.4, 0]}>
        {/* 접시 */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[1.0, 1.1, 0.08, 32]} />
          <meshStandardMaterial color="#FAFAFA" roughness={0.3} />
        </mesh>

        {/* 라바 케이크 본체 */}
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.5, 0.55, 0.6, 16]} />
          <meshStandardMaterial color="#3E2723" roughness={0.8} />
        </mesh>

        {/* 초콜릿 라바 (흘러내리는 효과) */}
        <mesh position={[0, 0.65, 0]}>
          <sphereGeometry args={[0.35, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#4E342E" roughness={0.3} metalness={0.2} />
        </mesh>

        {/* 흘러내리는 초콜릿 */}
        {[0, 1, 2].map((i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i / 3) * Math.PI * 2) * 0.45,
              0.3,
              Math.sin((i / 3) * Math.PI * 2) * 0.45,
            ]}
          >
            <capsuleGeometry args={[0.05, 0.2, 4, 8]} />
            <meshStandardMaterial color="#5D4037" roughness={0.2} metalness={0.3} />
          </mesh>
        ))}

        {/* 파우더 슈가 */}
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh
            key={`sugar-${i}`}
            position={[
              (Math.random() - 0.5) * 0.8,
              0.7 + Math.random() * 0.05,
              (Math.random() - 0.5) * 0.8,
            ]}
          >
            <sphereGeometry args={[0.015, 4, 4]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
          </mesh>
        ))}
      </group>
    );
  }

  // 바스크 치즈케이크
  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      {/* 접시 */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.0, 1.1, 0.08, 32]} />
        <meshStandardMaterial color="#FAFAFA" roughness={0.3} />
      </mesh>

      {/* 케이크 본체 */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.7, 0.75, 0.5, 32]} />
        <meshStandardMaterial color="#FFF3E0" roughness={0.6} />
      </mesh>

      {/* 캐러멜라이즈 윗면 */}
      <mesh position={[0, 0.56, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 0.04, 32]} />
        <meshStandardMaterial color="#E65100" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* 그을린 부분 (불규칙 패치) */}
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 4) * Math.PI * 2) * 0.35,
            0.58,
            Math.sin((i / 4) * Math.PI * 2) * 0.35,
          ]}
        >
          <sphereGeometry args={[0.12, 8, 8, 0, Math.PI * 2, 0, Math.PI / 3]} />
          <meshStandardMaterial color="#BF360C" roughness={0.4} />
        </mesh>
      ))}

      {/* 한 조각 잘린 표현 */}
      <mesh position={[0.5, 0.3, 0.3]} rotation={[0, 0.8, 0]}>
        <boxGeometry args={[0.02, 0.5, 0.4]} />
        <meshStandardMaterial color="#FFECB3" roughness={0.5} />
      </mesh>
    </group>
  );
}
