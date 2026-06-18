/**
 * TLALMANAC-X · 3D Scene (React-Three-Fiber)
 *
 * Full-viewport fixed background canvas. Hosts lighting, camera, atmospheric
 * fog and the ecosystem entities (currently the pollen particle system).
 *
 * The canvas sits behind the scrollable narrative (zIndex 5 in App) at zIndex 1.
 */

import React from 'react';
import { Canvas } from '@react-three/fiber';
import PollenSystem from './entities/PollenSystem';

const Scene: React.FC = () => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none', // let UI/scroll events pass through
      }}
    >
      <Canvas
        // dpr capped at 2 keeps 5k instances smooth on retina displays
        dpr={[1, 2]}
        camera={{ position: [0, 0, 6], fov: 55, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Dark honey-comb atmosphere; fog fades distant particles into the void */}
        <color attach="background" args={['#050505']} />
        <fog attach="fog" args={['#050505', 6, 16]} />

        {/* Soft fill so particle geometry isn't pure black on the unlit side */}
        <ambientLight intensity={0.4} />
        {/* Warm key light from upper-right — the "sun" over Tlalmanalco */}
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#D4A574" />
        {/* Cool rim light for depth separation */}
        <pointLight position={[-6, -3, -4]} intensity={0.6} color="#9D00FF" />

        <PollenSystem count={5000} />
      </Canvas>
    </div>
  );
};

export default Scene;
