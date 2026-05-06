import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** 음료 - 리얼리스틱 PBR */
export default function DrinkModel({ variant = 'cola' }: { variant?: 'cola' | 'lemonade' }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
    }
  });

  const liquidColor = variant === 'cola' ? '#1A0500' : '#FFF59D';
  const strawColor = variant === 'cola' ? '#D32F2F' : '#388E3C';

  return (
    <group ref={groupRef} position={[0, -0.5, 0]} scale={0.85}>
      {/* 유리잔 - 투명 */}
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.42, 0.32, 1.3, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#FFFFFF"
          roughness={0.05}
          metalness={0}
          transmission={0.9}
          thickness={0.5}
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 잔 바닥 */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.04, 32]} />
        <meshPhysicalMaterial color="#FFFFFF" roughness={0.05} transmission={0.8} transparent opacity={0.3} />
      </mesh>

      {/* 음료 액체 */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.39, 0.3, 1.1, 32]} />
        <meshStandardMaterial color={liquidColor} roughness={0.15} metalness={0.05} transparent opacity={0.9} />
      </mesh>

      {/* 거품 (콜라) / 표면 (레몬에이드) */}
      <mesh position={[0, 1.05, 0]}>
        <cylinderGeometry args={[0.39, 0.39, 0.04, 32]} />
        <meshStandardMaterial
          color={variant === 'cola' ? '#4E342E' : '#FFFDE7'}
          roughness={0.3}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* 얼음 - 투명 큐브 */}
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={`ice-${i}`}
          position={[
            Math.cos((i / 4) * Math.PI * 2) * 0.18,
            0.7 + i * 0.12,
            Math.sin((i / 4) * Math.PI * 2) * 0.18,
          ]}
          rotation={[Math.random() * 0.5, Math.random(), Math.random() * 0.3]}
        >
          <boxGeometry args={[0.12, 0.1, 0.12]} />
          <meshPhysicalMaterial
            color="#E3F2FD"
            roughness={0.05}
            transmission={0.7}
            thickness={0.3}
            transparent
            opacity={0.5}
          />
        </mesh>
      ))}

      {/* 빨대 */}
      <mesh position={[0.12, 0.85, 0]} rotation={[0, 0, 0.08]}>
        <cylinderGeometry args={[0.025, 0.025, 0.9, 12]} />
        <meshStandardMaterial color={strawColor} roughness={0.5} />
      </mesh>

      {/* 레몬 슬라이스 (레몬에이드) */}
      {variant === 'lemonade' && (
        <group position={[0.32, 1.0, 0]} rotation={[0.2, 0, Math.PI / 5]}>
          <mesh>
            <cylinderGeometry args={[0.14, 0.14, 0.025, 16]} />
            <meshStandardMaterial color="#FDD835" roughness={0.45} />
          </mesh>
          {/* 레몬 과육 */}
          {Array.from({ length: 6 }).map((_, i) => (
            <mesh key={i} position={[0, 0.015, 0]} rotation={[0, (i / 6) * Math.PI * 2, 0]}>
              <boxGeometry args={[0.02, 0.01, 0.1]} />
              <meshStandardMaterial color="#FFF9C4" roughness={0.5} />
            </mesh>
          ))}
        </group>
      )}

      {/* 물방울 (잔 표면) */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh
            key={`drop-${i}`}
            position={[
              Math.cos(angle) * 0.42,
              0.3 + Math.random() * 0.6,
              Math.sin(angle) * 0.42,
            ]}
          >
            <sphereGeometry args={[0.015, 6, 6]} />
            <meshPhysicalMaterial color="#FFFFFF" roughness={0} transmission={0.9} transparent opacity={0.4} />
          </mesh>
        );
      })}
    </group>
  );
}
