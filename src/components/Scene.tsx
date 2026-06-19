/**
 * TLALMANAC-X · 3D Scene (React-Three-Fiber)
 * 
 * Escena completa con:
 * - Bombus 3D animado (glb cargado)
 * - 5,500 partículas de polen
 * - 2,000 partículas vórtex de singularidad
 * - Iluminación dorada
 */

import React, { Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import PollenSystem from './entities/PollenSystem';
import SingularityVortex from './entities/SingularityVortex';
import Bumblebee from './Bumblebee';
import { useEcosystemStore } from '../store/useEcosystemStore';

const CameraRig: React.FC = () => {
  useFrame(({ camera, mouse }) => {
    const { scrollProgress, vibrationIntensity } = useEcosystemStore.getState();

    // Scroll-based camera depth
    const targetZ = 6 - scrollProgress * 1.5;
    const targetY = -scrollProgress * 1.2;

    // Mouse-based subtle camera tilt for parallax
    const mouseInfluence = 0.3;
    const targetX = mouse.x * mouseInfluence;
    const mouseLookY = mouse.y * mouseInfluence;

    // Vibración fuerte acerca la cámara al abejorro
    const vibrationZoom = vibrationIntensity * 0.5;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      targetY + mouseLookY,
      0.05
    );
    camera.position.z = THREE.MathUtils.lerp(
      camera.position.z,
      targetZ - vibrationZoom,
      0.04
    );

    // Slight camera rotation for immersion
    const lookPoint = new THREE.Vector3(targetX * 0.2, targetY * 0.2, 0);
    camera.lookAt(lookPoint);
  });

  return null;
};

const Lights: React.FC = () => {
  return (
    <>
      {/* Luz ambiental para volumen general */}
      <ambientLight intensity={0.6} />
      
      {/* Luz dorada primaria — ilumina desde arriba-adelante */}
      <pointLight 
        position={[5, 4, 8]} 
        intensity={2}
        color="#DAA520"
      />
      
      {/* Luz ámbar complementaria — desde atrás-arriba */}
      <pointLight 
        position={[-6, 3, -4]} 
        intensity={1.5}
        color="#CD853F"
      />
      
      {/* Luz blanca de acento — desde abajo */}
      <pointLight 
        position={[3, -2, 5]} 
        intensity={1}
        color="#F5DEB3"
      />
    </>
  );
};

// Loading fallback component
const Loading: React.FC = () => (
  <mesh position={[0, 0, 0]}>
    <sphereGeometry args={[0.3, 32, 32]} />
    <meshStandardMaterial color="#FFD700" emissive="#DAA520" />
  </mesh>
);

const Scene: React.FC = () => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 6], fov: 55, near: 0.1, far: 100 }}
        gl={{ 
          antialias: true, 
          alpha: true, 
          toneMappingExposure: 1.2,
        }}
      >
        {/* Fondo */}
        <color attach="background" args={['#0a0e27']} />
        <fog attach="fog" args={['#0a0e27', 8, 20]} />

        {/* Iluminación */}
        <Lights />

        {/* Cámara reactiva */}
        <CameraRig />

        {/* Sistema de partículas de polen principal */}
        <PollenSystem count={5500} />

        {/* Efecto de vórtex de singularidad */}
        <SingularityVortex count={2000} position={[0, 0, 0]} />

        {/* Bombus 3D — modelo interactivo */}
        <Suspense fallback={<Loading />}>
          <Bumblebee position={[0, 1.2, 0]} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Scene;
