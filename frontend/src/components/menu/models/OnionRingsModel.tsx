import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** 어니언 링 - 리얼리스틱 PBR */
export default function OnionRingsModel() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  const rings = useMemo(() => [
    { x: 0, y: 0.2, z: 0, size: 0.35, rot: 0.1 },
    { x: 0.25, y: 0.25, z: 0.1, size: 0.3, rot: 0.3 },
    { x: -0.2, y: 0.22, z: 0.15, size: 0.32, rot: -0.2 },
    { x: 0.1, y: 0.35, z: -0.12, size: 0.28, rot: 0.5 },
    { x: -0.12, y: 0.38, z: -0.08, size: 0.26, rot: -0.4 },
    { x: 0.18, y: 0.42, z: 0.12, size: 0.24, rot: 0.2 },
    { x: -0.05, y: 0.48, z: 0.05, size: 0.22, rot: -0.1 },
  ], []);

  return (
    <group ref={groupRef} position={[0, -0.35, 0]} scale={0.85}>
      {/* 종이 라이너가 깔린 바구니 */}
      <mesh position={[0, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.7, 0.5, 0.35, 12]} />
        <meshStandardMaterial color="#6D4C41" roughness={0.9} />
      </mesh>
      {/* 체크무늬 종이 */}
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.68, 0.52, 0.3, 12, 1, true]} />
        <meshStandardMaterial color="#FFF8E1" roughness={0.85} side={THREE.DoubleSide} />
      </mesh>

      {/* 어니언 링 - 바삭한 튀김옷 */}
      {rings.map((ring, i) => (
        <group key={i} position={[ring.x, ring.y, ring.z]} rotation={[Math.PI / 2 + ring.rot, ring.rot * 0.5, 0]}>
          {/* 바깥 튀김옷 */}
          <mesh castShadow>
            <torusGeometry args={[ring.size, 0.065, 12, 24]} />
            <meshStandardMaterial color="#D4A03A" roughness={0.7} />
          </mesh>
          {/* 안쪽 양파 (살짝 보이는) */}
          <mesh>
            <torusGeometry args={[ring.size, 0.04, 8, 24]} />
            <meshStandardMaterial color="#FFFDE7" roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* 딥핑 소스 컵 */}
      <mesh position={[0.85, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.1, 0.16, 16]} />
        <meshStandardMaterial color="#ECEFF1" roughness={0.3} metalness={0.05} />
      </mesh>
      {/* 소스 */}
      <mesh position={[0.85, 0.18, 0]}>
        <cylinderGeometry args={[0.11, 0.11, 0.03, 16]} />
        <meshStandardMaterial color="#FF6F00" roughness={0.2} metalness={0.1} />
      </mesh>
    </group>
  );
}
