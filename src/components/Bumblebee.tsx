/**
 * TLALMANAC-X · Bombus 3D Model Component
 * 
 * Abejorro interactivo cargado desde bombus.glb
 * Animado a 400 Hz con vibración resonante
 * Responde a interacción del usuario
 */

import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEcosystemStore } from '../store/useEcosystemStore';

interface BumblebeeProps {
  position?: [number, number, number];
}

const Bumblebee: React.FC<BumblebeeProps> = ({ position = [0, 1.2, 0] }) => {
  const { scene, animations } = useGLTF('/models/bombus.glb');
  const { actions } = useAnimations(animations, useRef<THREE.Group>(null));
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const isUserHolding = useEcosystemStore((s) => s.isUserHolding);
  const vibrationIntensity = useEcosystemStore((s) => s.vibrationIntensity);
  const audioGain = useEcosystemStore((s) => s.audioGain);

  // Clonar y preparar el modelo
  const clonedScene = React.useMemo(() => {
    if (!scene) return null;
    
    const cloned = scene.clone();
    
    // Aplicar materiales realistas
    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Mantener materiales originales pero mejorar iluminación
        if (child.material instanceof THREE.Material) {
          child.material = new THREE.MeshStandardMaterial({
            color: child.material instanceof THREE.MeshStandardMaterial 
              ? child.material.color 
              : 0xFFD700,
            emissive: hovered || isUserHolding ? new THREE.Color(0xDAA520) : new THREE.Color(0x000000),
            emissiveIntensity: hovered ? 0.9 : isUserHolding ? audioGain * 1.2 : 0,
            metalness: 0.4,
            roughness: 0.5,
            envMap: null,
          });
        }
        
        // Castear sombras
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    
    return cloned;
  }, [scene, hovered, isUserHolding, audioGain]);

  // Animar alas si existen
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const wingAction = Object.values(actions)[0];
      if (wingAction) {
        wingAction.play();
      }
    }
  }, [actions]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    const time = clock.getElapsedTime();

    // Rotación suave y orgánica
    groupRef.current.rotation.z = Math.sin(time * 1.3) * 0.12;
    groupRef.current.rotation.x = Math.cos(time * 0.9) * 0.08;
    groupRef.current.rotation.y += 0.005; // Giro lento constante

    // Flotación durante vibración — imita el movimiento natural del vuelo
    if (isUserHolding) {
      const flightBob = Math.sin(time * 5) * 0.3;
      const lateralFloat = Math.cos(time * 3.5) * 0.15;
      
      groupRef.current.position.y = 
        position[1] + 
        flightBob * vibrationIntensity + 
        lateralFloat * (vibrationIntensity * 0.6);
      
      groupRef.current.position.x = 
        Math.sin(time * 2) * 0.2 * vibrationIntensity;
    }

    // Escala pulsante — simula aleteo de alas
    const wingFlutter = 1 + Math.sin(time * 16) * 0.04 * vibrationIntensity; // 16 Hz ≈ frecuencia de aleteo
    groupRef.current.scale.setScalar(wingFlutter);

    // Vibración de alta frecuencia cuando está activo (400 Hz visual)
    if (isUserHolding && vibrationIntensity > 0.3) {
      const microVibration = Math.sin(time * 400) * 0.008 * vibrationIntensity;
      groupRef.current.position.z += microVibration;
    }
  });

  return (
    <group 
      ref={groupRef} 
      position={position}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {clonedScene && (
        <primitive 
          object={clonedScene}
          scale={isUserHolding ? [1.2, 1.2, 1.2] : [1, 1, 1]}
        />
      )}
      
      {/* Aura de luz cuando está activo */}
      {isUserHolding && (
        <pointLight
          position={[0, 0.5, 0]}
          intensity={vibrationIntensity * 1.5}
          distance={3}
          color={new THREE.Color().setHSL(0.08, 1, 0.5)} // Dorado
          decay={2}
        />
      )}
    </group>
  );
};

export default Bumblebee;

// Pre-cargar el modelo
useGLTF.preload('/models/bombus.glb');
