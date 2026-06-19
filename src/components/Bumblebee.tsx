import React, { useRef, useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useEcosystemStore } from '../store/useEcosystemStore';

const Bumblebee: React.FC<{ position?: [number, number, number] }> = ({ position = [0, 2, 0] }) => {
  const { scene } = useGLTF('/models/bombus.glb');
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const isUserHolding = useEcosystemStore((s) => s.isUserHolding);
  const vibrationIntensity = useEcosystemStore((s) => s.vibrationIntensity);

  // Clone the scene to avoid mutations
  const clonedScene = React.useMemo(() => {
    if (!scene) return null;
    const cloned = scene.clone();
    return cloned;
  }, [scene]);

  // Add glow material on hover
  useEffect(() => {
    if (!groupRef.current) return;

    groupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (hovered || isUserHolding) {
          child.material = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            emissive: 0xffaa00,
            emissiveIntensity: hovered ? 0.8 : isUserHolding ? vibrationIntensity : 0,
            metallic: 0.3,
            roughness: 0.4,
          });
        }
      }
    });
  }, [hovered, isUserHolding, vibrationIntensity]);

  // Animate on vibration
  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    // Rotation
    groupRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 3) * 0.1;
    groupRef.current.rotation.x = Math.cos(clock.getElapsedTime() * 2) * 0.05;

    // Hover float effect
    if (isUserHolding) {
      groupRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 4) * 0.15 * vibrationIntensity;
    }

    // Scale pulse on vibration
    const scaleAmount = 1 + (isUserHolding ? Math.sin(clock.getElapsedTime() * 8) * 0.1 * vibrationIntensity : 0);
    groupRef.current.scale.set(scaleAmount, scaleAmount, scaleAmount);
  });

  return (
    <group ref={groupRef} position={position}>
      {clonedScene && (
        <primitive
          object={clonedScene}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        />
      )}
    </group>
  );
};

export default Bumblebee;
