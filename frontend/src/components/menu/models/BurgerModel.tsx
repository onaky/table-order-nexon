import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** 트러플 시그니처 버거 - 프로시저럴 3D */
export default function BurgerModel() {
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
        <meshStandardMaterial color="#D4874D" roughness={0.8} />
      </mesh>

      {/* 양상추 */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[1.0, 0.95, 0.08, 32]} />
        <meshStandardMaterial color="#4CAF50" roughness={0.6} />
      </mesh>

      {/* 패티 */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.85, 0.85, 0.25, 32]} />
        <meshStandardMaterial color="#4E342E" roughness={0.9} />
      </mesh>

      {/* 치즈 (살짝 녹은 느낌 - 약간 넓게) */}
      <mesh position={[0, 0.58, 0]}>
        <cylinderGeometry args={[0.92, 0.88, 0.06, 32]} />
        <meshStandardMaterial color="#FFC107" roughness={0.4} metalness={0.1} />
      </mesh>

      {/* 토마토 */}
      <mesh position={[0, 0.66, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.1, 32]} />
        <meshStandardMaterial color="#E53935" roughness={0.5} />
      </mesh>

      {/* 트러플 소스 (어두운 점들) */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 6) * Math.PI * 2) * 0.5,
            0.73,
            Math.sin((i / 6) * Math.PI * 2) * 0.5,
          ]}
        >
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#1B1B1B" roughness={0.3} />
        </mesh>
      ))}

      {/* 위 빵 */}
      <mesh position={[0, 0.95, 0]}>
        <sphereGeometry args={[0.9, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#E8A04C" roughness={0.7} />
      </mesh>

      {/* 참깨 */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <mesh
          key={`sesame-${i}`}
          position={[
            Math.cos((i / 8) * Math.PI * 2) * 0.45,
            1.15 + Math.random() * 0.1,
            Math.sin((i / 8) * Math.PI * 2) * 0.45,
          ]}
          rotation={[Math.random(), Math.random(), 0]}
        >
          <capsuleGeometry args={[0.03, 0.06, 4, 8]} />
          <meshStandardMaterial color="#FFF8E1" roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}
