import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useEcosystemStore } from '../store/useEcosystemStore';

const BlackholeParticleSwarm: React.FC = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 8000; // Reducido para performance
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const target = useMemo(() => new THREE.Vector3(), []);
  const pColor = useMemo(() => new THREE.Color(), []);

  const vibrationIntensity = useEcosystemStore((s) => s.vibrationIntensity);

  const positions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < count; i++) {
      pos.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 60,
          (Math.random() - 0.5) * 60,
          (Math.random() - 0.5) * 60
        )
      );
    }
    return pos;
  }, []);

  // Material & Geometry
  const material = useMemo(() => new THREE.MeshBasicMaterial({ color: 0xffffff }), []);
  const geometry = useMemo(() => new THREE.TetrahedronGeometry(0.15), []);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    const scale = 50 + vibrationIntensity * 20; // Reacciona a vibración
    const spin = 2.5 + vibrationIntensity * 1.5;
    const accretion = 0.8 + vibrationIntensity * 0.5;
    const warp = 1.0 + vibrationIntensity * 0.5;

    for (let i = 0; i < count; i++) {
      const u = (i + 0.5) / count;
      const goldenAngle = 2.399963229728653;
      const a = i * goldenAngle;

      const t = time * 0.35;
      const band = u * 24.0 - 12.0;

      const disk = 1.0 - Math.abs(Math.sin(band * 0.5));
      const radius = scale * (0.08 + 1.9 * u * u);

      const swirl = a + spin * Math.log(radius + 1.0) - t * (2.0 + 3.0 * (1.0 - u));

      const grav = 1.0 / (1.0 + radius * 0.015);
      const bend = warp * grav * grav;

      const x0 = radius * Math.cos(swirl);
      const z0 = radius * Math.sin(swirl);

      const x = x0 + bend * z0;
      const z = z0 - bend * x0;

      const y = scale * 0.22 * disk * Math.sin(a * 0.17 + t * 4.0) * accretion;

      target.set(x, y, z);

      // Color based on heat/proximity to singularity
      const heat = 1.0 - Math.min(1.0, radius / (scale * 2.0));
      const hue = 0.08 + 0.58 * (1.0 - heat); // Yellow-orange to blue
      const sat = 0.8 + 0.2 * heat;
      const light = 0.15 + 0.55 * Math.pow(heat, 1.5);

      pColor.setHSL(hue, sat, light);

      positions[i].lerp(target, 0.1);
      dummy.position.copy(positions[i]);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, pColor);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return <instancedMesh ref={meshRef} args={[geometry, material, count]} />;
};

export default BlackholeParticleSwarm;
