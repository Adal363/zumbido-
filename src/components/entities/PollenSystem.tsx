/**
 * TLALMANAC-X · Pollen Particle System (Enhanced)
 * 
 * Improved neon aesthetic with dynamic color cycling and enhanced interactivity.
 * Frequency-reactive particles now glow brighter and shift colors based on audio.
 */

import React, { useMemo, useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useEcosystemStore } from '../../store/useEcosystemStore';

import vertexShader from '../../utils/shaders/pollenVertex.glsl';
import fragmentShader from '../../utils/shaders/pollenFragment.glsl';

interface PollenSystemProps {
  count?: number;
}

const PollenSystem: React.FC<PollenSystemProps> = ({ count = 5000 }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uFrequency: { value: 400 },
      uVibration: { value: 0 },
      uColorA: { value: new THREE.Color('#00ff88') },      // Cyan neon
      uColorB: { value: new THREE.Color('#00d4ff') },      // Light cyan
      uColorC: { value: new THREE.Color('#ff0096') },      // Magenta neon
      uColorD: { value: new THREE.Color('#ff6600') },      // Orange neon
      uColorIntensity: { value: 1.0 },
    }),
    []
  );

  const phases = useMemo(() => {
    const arr = new Float32Array(count);
    for (let i = 0; i < count; i++) arr[i] = Math.random();
    return arr;
  }, [count]);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    
    for (let i = 0; i < count; i++) {
      const r = Math.cbrt(Math.random()) * 5.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      dummy.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
      
      const s = 0.015 + Math.random() * 0.035;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    
    mesh.instanceMatrix.needsUpdate = true;
    mesh.geometry.setAttribute(
      'aPhase',
      new THREE.InstancedBufferAttribute(phases, 1)
    );
  }, [count, phases]);

  useFrame((_, delta) => {
    const mat = materialRef.current;
    if (!mat) return;
    
    const { audioFrequency, vibrationIntensity } = useEcosystemStore.getState();
    
    mat.uniforms.uTime.value += delta;
    mat.uniforms.uFrequency.value = audioFrequency;
    mat.uniforms.uVibration.value = THREE.MathUtils.lerp(
      mat.uniforms.uVibration.value,
      vibrationIntensity,
      0.06
    );
    
    // Color intensity driven by audio
    mat.uniforms.uColorIntensity.value = THREE.MathUtils.lerp(
      mat.uniforms.uColorIntensity.value,
      1.0 + vibrationIntensity * 0.5,
      0.08
    );
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, count]}
      frustumCulled={false}
    >
      <icosahedronGeometry args={[1, 0]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite
      />
    </instancedMesh>
  );
};

export default PollenSystem;
