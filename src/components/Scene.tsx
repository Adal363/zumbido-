/**
 * TLALMANAC-X · 3D Scene (React-Three-Fiber)
 *
 * Canvas fijo en el fondo. La camara responde al scroll via scrollProgress
 * del store de Zustand, creando profundidad narrativa entre secciones.
 */

import React from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { Effects } from '@react-three/drei';
import { UnrealBloomPass } from 'three-stdlib';
import * as THREE from 'three';
import PollenSystem from './entities/PollenSystem';
import Bumblebee from './Bumblebee';
import BlackholeParticleSwarm from './BlackholeParticleSwarm';
import { useEcosystemStore } from '../store/useEcosystemStore';

extend({ UnrealBloomPass });

/** Anima la camara segun el progreso de scroll del usuario. */
const CameraRig: React.FC = () => {
  useFrame(({ camera }) => {
    const { scrollProgress } = useEcosystemStore.getState();
    // La camara se aleja y baja ligeramente al avanzar en la narrativa
    const targetZ = 6 - scrollProgress * 1.5;
    const targetY = -scrollProgress * 1.2;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.04);
  });
  return null;
};

const Scene: React.FC = () => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none', // los eventos de scroll y click pasan al HTML
      }}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 6], fov: 55, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#050505']} />
        <fog attach="fog" args={['#050505', 6, 16]} />

        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#D4A574" />
        <pointLight position={[-6, -3, -4]} intensity={0.6} color="#9D00FF" />

        <CameraRig />
        <PollenSystem count={5000} />
        <BlackholeParticleSwarm />
        <Bumblebee position={[0, 0, 0]} />

        {/* Bloom Effect */}
        <Effects disableGamma>
          <unrealBloomPass threshold={0.2} strength={1.5} radius={0.5} />
        </Effects>
      </Canvas>
    </div>
  );
};

export default Scene;
