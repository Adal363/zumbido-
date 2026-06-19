/**
 * TLALMANAC-X · 3D Scene (React-Three-Fiber)
 *
 * Enhanced with mouse tracking and improved visual effects.
 * Camera responds to scroll and subtle mouse movement for parallax depth.
 */

import React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import PollenSystem from './entities/PollenSystem';
import { useEcosystemStore } from '../store/useEcosystemStore';

const CameraRig: React.FC = () => {
  useFrame(({ camera, mouse }) => {
    const { scrollProgress } = useEcosystemStore.getState();
    
    // Scroll-based camera depth
    const targetZ = 6 - scrollProgress * 1.5;
    const targetY = -scrollProgress * 1.2;
    
    // Mouse-based subtle camera tilt for parallax
    const mouseInfluence = 0.3;
    const targetX = mouse.x * mouseInfluence;
    const mouseLookY = mouse.y * mouseInfluence;
    
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY + mouseLookY, 0.05);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.04);
    
    // Slight camera rotation for immersion
    const lookPoint = new THREE.Vector3(targetX * 0.2, targetY * 0.2, 0);
    camera.lookAt(lookPoint);
  });
  
  return null;
};

const Lights: React.FC = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      {/* Cyan neon light */}
      <pointLight position={[5, 3, 8]} intensity={1.5} color="#00ff88" />
      {/* Magenta neon light */}
      <pointLight position={[-6, -3, -4]} intensity={1.2} color="#ff0096" />
      {/* Orange accent */}
      <pointLight position={[3, -5, 5]} intensity={0.8} color="#ff6600" />
    </>
  );
};

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
        gl={{ antialias: true, alpha: true, toneMappingExposure: 1.2 }}
      >
        <color attach="background" args={['#0a0e27']} />
        <fog attach="fog" args={['#0a0e27', 8, 20]} />

        <Lights />
        <CameraRig />
        <PollenSystem count={5500} />
      </Canvas>
    </div>
  );
};

export default Scene;
