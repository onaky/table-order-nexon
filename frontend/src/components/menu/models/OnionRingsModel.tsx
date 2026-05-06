import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** 어니언 링 - 프로시저럴 3D */
export default function OnionRingsModel() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  const rings = [
    { x: 0, y: 0.15, z: 0, size: 0.4, rot: 0 },
    { x: 0.3, y: 0.25, z: 0.1, size: 0.35, rot: 0.3 },
    { x: -0.2, y: 0.2, z: 0.2, size: 0.38, rot: -0.2 },
    { x: 0.1, y: 0.35, z: -0.15, size: 0.32, rot: 0.5 },
    { x: -0.15, y: 0.4, z: -0.1, size: 0.3, rot: -0.4 },
    { x: 0.2, y: 0.45, z: 0.15, size: 0.28, rot: 0.2 },
  ];

  return (
    <group ref={groupRef} position={[0, -0.4, 0]}>
      {/* 종이 바구니 */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.7, 0.5, 0.3, 8]} />
        <meshStandardMaterial color="#8D6E63" roughness={0.9} />
      </mesh>
      {/* 종이 안쪽 */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.65, 0.48, 0.25, 8, 1, true]} />
        <meshStandardMaterial color="#FFF8E1" roughness={0.8} side={THREE.DoubleSide} />
      </mesh>

      {/* 어니언 링들 */}
      {rings.map((ring, i) => (
        <mesh
          key={i}
          position={[ring.x, ring.y, ring.z]}
          rotation={[Math.PI / 2 + ring.rot, ring.rot, 0]}
        >
          <torusGeometry args={[ring.size, 0.08, 8, 16]} />
          <meshStandardMaterial color="#F9A825" roughness={0.6} />
        </mesh>
      ))}

      {/* 딥핑 소스 */}
      <mesh position={[0.8, 0.1, 0]}>
        <cylinderGeometry args={[0.15, 0.12, 0.15, 12]} />
        <meshStandardMaterial color="#ECEFF1" roughness={0.4} />
      </mesh>
      <mesh position={[0.8, 0.18, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.03, 12]} />
        <meshStandardMaterial color="#FF8F00" roughness={0.3} />
      </mesh>
    </group>
  );
}
