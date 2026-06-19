/**
 * TLALMANAC-X · Pollen Particle System
 * 
 * 5,500 partículas de polen dorado oscilando a 400 Hz fijos
 * Colores realistas: amarillo polen, ámbar cálido, blanco
 * Vibración resonante constante = frecuencia de polinización sónica del Bombus
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

const PollenSystem: React.FC<PollenSystemProps> = ({ count = 5500 }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uFrequency: { value: 400 }, // FIJO: 400 Hz = Bombus sonication
      uVibration: { value: 0 },
      uColorPrimary: { value: new THREE.Color('#FFD700') },      // Amarillo dorado
      uColorSecondary: { value: new THREE.Color('#DAA520') },    // Ámbar goldenrod
      uColorTertiary: { value: new THREE.Color('#F5DEB3') },     // Blanco trigo
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
      // Esfera de distribución — polen flotante en el aire
      const r = Math.cbrt(Math.random()) * 5.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      dummy.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
      
      // Tamaño pequeño: granos de polen (15–35 micrómetros en escala)
      const s = 0.012 + Math.random() * 0.025;
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
    
    const { vibrationIntensity } = useEcosystemStore.getState();
    
    mat.uniforms.uTime.value += delta;
    // Frecuencia SIEMPRE 400 Hz — no cambia
    mat.uniforms.uFrequency.value = 400;
    
    // Solo la vibración (amplitud) cambia por interacción del usuario
    mat.uniforms.uVibration.value = THREE.MathUtils.lerp(
      mat.uniforms.uVibration.value,
      vibrationIntensity,
      0.06
    );
    
    // Intensidad de color aumenta con vibración
    mat.uniforms.uColorIntensity.value = THREE.MathUtils.lerp(
      mat.uniforms.uColorIntensity.value,
      1.0 + vibrationIntensity * 0.6,
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
