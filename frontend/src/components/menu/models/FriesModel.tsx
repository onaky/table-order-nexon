import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** 트러플 감자튀김 - 프로시저럴 3D */
export default function FriesModel() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  // 감자튀김 스틱 생성
  const fries = Array.from({ length: 18 }).map((_, i) => ({
    x: (Math.random() - 0.5) * 0.6,
    z: (Math.random() - 0.5) * 0.6,
    height: 0.6 + Math.random() * 0.4,
    rotX: (Math.random() - 0.5) * 0.4,
    rotZ: (Math.random() - 0.5) * 0.4,
    color: Math.random() > 0.5 ? '#F9A825' : '#FFB300',
    key: i,
  }));

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* 빨간 종이 컵 */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.5, 0.35, 0.8, 16]} />
        <meshStandardMaterial color="#C62828" roughness={0.7} />
      </mesh>
      {/* 컵 줄무늬 */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.51, 0.36, 0.15, 16]} />
        <meshStandardMaterial color="#FFEB3B" roughness={0.6} />
      </mesh>

      {/* 감자튀김 스틱들 */}
      {fries.map((fry) => (
        <mesh
          key={fry.key}
          position={[fry.x, 0.7 + fry.height / 2, fry.z]}
          rotation={[fry.rotX, 0, fry.rotZ]}
        >
          <boxGeometry args={[0.06, fry.height, 0.06]} />
          <meshStandardMaterial color={fry.color} roughness={0.6} />
        </mesh>
      ))}

      {/* 트러플 오일 점 (어두운 점들) */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh
          key={`truffle-${i}`}
          position={[
            (Math.random() - 0.5) * 0.4,
            0.9 + Math.random() * 0.3,
            (Math.random() - 0.5) * 0.4,
          ]}
        >
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshStandardMaterial color="#1B1B1B" roughness={0.2} />
        </mesh>
      ))}

      {/* 파마산 치즈 가루 */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh
          key={`cheese-${i}`}
          position={[
            (Math.random() - 0.5) * 0.5,
            0.85 + Math.random() * 0.3,
            (Math.random() - 0.5) * 0.5,
          ]}
        >
          <sphereGeometry args={[0.02, 4, 4]} />
          <meshStandardMaterial color="#FFF8E1" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}
