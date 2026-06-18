/**
 * TLALMANAC-X · Pollen Particle System
 *
 * 5,000 pollen grains rendered as a single InstancedMesh (one draw call).
 * Each grain oscillates in the vertex shader, driven by the live audio
 * frequency + the user's vibration intensity from the Zustand store.
 *
 * WHY InstancedMesh:
 *  · One geometry + one material, N transforms → ~5000 grains at 60fps.
 *  · Per-instance variation comes from `instanceMatrix` (position/scale) and a
 *    custom instanced attribute `aPhase` (decorrelates oscillation per grain).
 */

import React, { useMemo, useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useEcosystemStore } from '../../store/useEcosystemStore';

// vite-plugin-glsl loads these as plain strings at build time.
import vertexShader from '../../utils/shaders/pollenVertex.glsl';
import fragmentShader from '../../utils/shaders/pollenFragment.glsl';

interface PollenSystemProps {
  count?: number;
}

const PollenSystem: React.FC<PollenSystemProps> = ({ count = 5000 }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // ── Shader uniforms (stable reference; mutated in useFrame) ──────
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uFrequency: { value: 400 },
      uVibration: { value: 0 },
      uColorCalm: { value: new THREE.Color('#D4A574') }, // honey / pollen
      uColorActive: { value: new THREE.Color('#FFE66D') }, // ignited gold
    }),
    []
  );

  // ── Per-instance phase offsets (random ∈ [0,1)) ─────────────────
  const phases = useMemo(() => {
    const arr = new Float32Array(count);
    for (let i = 0; i < count; i++) arr[i] = Math.random();
    return arr;
  }, [count]);

  // ── Scatter the grains into a spherical cloud ───────────────────
  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      // Uniform-ish distribution inside a sphere of radius ~5.
      const r = Math.cbrt(Math.random()) * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      dummy.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
      const s = 0.015 + Math.random() * 0.025; // tiny grains
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;

    // Attach the instanced phase attribute to the geometry.
    mesh.geometry.setAttribute(
      'aPhase',
      new THREE.InstancedBufferAttribute(phases, 1)
    );
  }, [count, phases]);

  // ── Per-frame: pump time + live store values into the shader ─────
  useFrame((_, delta) => {
    const mat = materialRef.current;
    if (!mat) return;
    const { audioFrequency, vibrationIntensity } = useEcosystemStore.getState();
    mat.uniforms.uTime.value += delta;
    mat.uniforms.uFrequency.value = audioFrequency;
    // Ease toward target vibration so release settles instead of snapping.
    mat.uniforms.uVibration.value = THREE.MathUtils.lerp(
      mat.uniforms.uVibration.value,
      vibrationIntensity,
      0.08
    );
  });

  return (
    <instancedMesh
      ref={meshRef}
      // args: [geometry, material, count] — geometry/material supplied as children
      args={[undefined, undefined, count]}
      frustumCulled={false}
    >
      <icosahedronGeometry args={[1, 0]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={false}
        depthWrite
      />
    </instancedMesh>
  );
};

export default PollenSystem;
