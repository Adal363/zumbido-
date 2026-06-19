/**
 * TLALMANAC-X · Singularity Vortex System
 * 
 * Efecto visual opcional: partículas de polen atraídas hacia un vórtice
 * cuando el usuario vibra fuertemente. Inspirado en dinámicas de
 * agujeros negros y fluidos gravitacionales.
 * 
 * Se activa solo cuando vibrationIntensity > 0.5
 */

import React, { useMemo, useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useEcosystemStore } from '../../store/useEcosystemStore';

import vertexShader from '../../utils/shaders/singularityVertex.glsl';
import fragmentShader from '../../utils/shaders/singularityFragment.glsl';

interface SingularityVortexProps {
  count?: number;
  position?: [number, number, number];
}

const SingularityVortex: React.FC<SingularityVortexProps> = ({
  count = 2000,
  position = [0, 0, 0],
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSingularityPos: { value: new THREE.Vector3(...position) },
      uSingularityStrength: { value: 0 },
      uVortexRadius: { value: 4.0 },
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
      // Distribución esférica alrededor del vórtice
      const r = Math.cbrt(Math.random()) * 4.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      dummy.position.set(
        position[0] + r * Math.sin(phi) * Math.cos(theta),
        position[1] + r * Math.sin(phi) * Math.sin(theta),
        position[2] + r * Math.cos(phi)
      );

      const s = 0.008 + Math.random() * 0.018;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
    mesh.geometry.setAttribute(
      'aPhase',
      new THREE.InstancedBufferAttribute(phases, 1)
    );
  }, [count, position]);

  useFrame((_, delta) => {
    const mat = materialRef.current;
    if (!mat) return;

    const { vibrationIntensity } = useEcosystemStore.getState();

    mat.uniforms.uTime.value += delta;

    // Solo activo cuando hay vibración fuerte
    const targetStrength = vibrationIntensity > 0.5 ? vibrationIntensity : 0;
    mat.uniforms.uSingularityStrength.value = THREE.MathUtils.lerp(
      mat.uniforms.uSingularityStrength.value,
      targetStrength,
      0.08
    );

    // Radio de influencia expande/contrae con vibración
    mat.uniforms.uVortexRadius.value = 3.5 + vibrationIntensity * 2.0;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, count]}
      frustumCulled={false}
      visible={true}
    >
      <icosahedronGeometry args={[1, 0]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
};

export default SingularityVortex;
