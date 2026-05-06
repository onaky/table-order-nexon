import { Suspense, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface Menu3DViewerProps {
  imageUrl: string;
  name: string;
}

function MenuCard3D({ imageUrl }: { imageUrl: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, imageUrl);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <RoundedBox ref={meshRef} args={[2.5, 2.5, 0.15]} radius={0.08} smoothness={4}>
      <meshStandardMaterial map={texture} attach="material-0" />
      <meshStandardMaterial map={texture} attach="material-1" />
      <meshStandardMaterial map={texture} attach="material-2" />
      <meshStandardMaterial map={texture} attach="material-3" />
      <meshStandardMaterial map={texture} attach="material-4" />
      <meshStandardMaterial color="#1a1a1a" attach="material-5" />
    </RoundedBox>
  );
}

export default function Menu3DViewer({ imageUrl, name }: Menu3DViewerProps) {
  return (
    <div className="w-full aspect-square rounded-2xl overflow-hidden bg-black" data-testid="menu-3d-viewer">
      <Suspense fallback={<LoadingSpinner />}>
        <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <directionalLight position={[-5, -5, -5]} intensity={0.3} />
          <MenuCard3D imageUrl={imageUrl} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={1.5}
          />
        </Canvas>
      </Suspense>
      <p className="sr-only">{name} 3D 뷰</p>
    </div>
  );
}
