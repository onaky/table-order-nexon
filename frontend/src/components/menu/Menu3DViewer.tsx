import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { getMenuModel } from './models';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface Menu3DViewerProps {
  menuId: number;
  imageUrl: string;
  name: string;
}

export default function Menu3DViewer({ menuId, imageUrl, name }: Menu3DViewerProps) {
  const model = getMenuModel(menuId);

  // 3D 모델이 없는 메뉴는 이미지 폴백
  if (!model) {
    return (
      <div className="w-full aspect-square rounded-2xl overflow-hidden bg-black flex items-center justify-center" data-testid="menu-3d-viewer">
        <img src={imageUrl} alt={name} className="w-3/4 h-3/4 object-contain rounded-xl" />
      </div>
    );
  }

  const { Component, props = {} } = model;

  return (
    <div className="w-full aspect-square rounded-2xl overflow-hidden bg-black" data-testid="menu-3d-viewer">
      <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><LoadingSpinner /></div>}>
        <Canvas camera={{ position: [0, 1.5, 3.5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
          <directionalLight position={[-3, 3, -3]} intensity={0.3} />
          <pointLight position={[0, 3, 0]} intensity={0.4} color="#ffffff" />
          <Component {...props} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.2}
          />
        </Canvas>
      </Suspense>
      <p className="sr-only">{name} 3D 뷰</p>
    </div>
  );
}
