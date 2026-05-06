import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** 음료 (콜라/레몬에이드) - 프로시저럴 3D */
export default function DrinkModel({ variant = 'cola' }: { variant?: 'cola' | 'lemonade' }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  const liquidColor = variant === 'cola' ? '#1B0000' : '#FFF176';
  const glassColor = variant === 'cola' ? '#4E342E' : '#FFFDE7';

  return (
    <group ref={groupRef} position={[0, -0.6, 0]}>
      {/* 유리잔 */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.45, 0.35, 1.2, 16, 1, true]} />
        <meshStandardMaterial
          color="#B3E5FC"
          roughness={0.1}
          metalness={0.1}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 음료 액체 */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.42, 0.33, 1.0, 16]} />
        <meshStandardMaterial color={liquidColor} roughness={0.2} transparent opacity={0.85} />
      </mesh>

      {/* 얼음 */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={`ice-${i}`}
          position={[
            Math.cos((i / 3) * Math.PI * 2) * 0.2,
            0.8 + i * 0.1,
            Math.sin((i / 3) * Math.PI * 2) * 0.2,
          ]}
          rotation={[Math.random(), Math.random(), Math.random()]}
        >
          <boxGeometry args={[0.15, 0.12, 0.15]} />
          <meshStandardMaterial color="#E3F2FD" roughness={0.1} transparent opacity={0.6} />
        </mesh>
      ))}

      {/* 빨대 */}
      <mesh position={[0.15, 0.9, 0]} rotation={[0, 0, 0.1]}>
        <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
        <meshStandardMaterial color={variant === 'cola' ? '#F44336' : '#66BB6A'} roughness={0.5} />
      </mesh>

      {/* 레몬 슬라이스 (레몬에이드만) */}
      {variant === 'lemonade' && (
        <mesh position={[0.35, 0.9, 0]} rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.15, 0.15, 0.03, 16]} />
          <meshStandardMaterial color="#FDD835" roughness={0.5} />
        </mesh>
      )}

      {/* 잔 받침 */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.05, 32]} />
        <meshStandardMaterial color={glassColor} roughness={0.3} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}
