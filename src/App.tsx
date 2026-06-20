/**
 * TLALMANAC-X · App Component Unificado
 * 
 * "El zumbido que nos une"
 * Polinización sónica del Bombus a 400 Hz
 * 
 * Datos reales del Proyecto Prototípico Bombus (UNRC Campus Chalco)
 * - Institución: Universidad Nacional Rosario Castellanos
 * - Especie: Bombus ephippiatus
 * - Valor económico: $66,320 MDP anuales
 * - Diferencial de precio: +45% sin polinizadores
 * - Locación: San Andrés Tlalamac, Tlalmanalco, Estado de México
 */

import React, { useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import * as Tone from 'tone';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COLORS INSTITUCIONALES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const COLORS = {
  bg: '#0D1510',
  gold: '#BC955C',
  goldDim: '#8A6B3E',
  wine: '#9F2241',
  green: '#235B4E',
  greenBright: '#58A65D',
  text: '#E8E3DA',
  textMuted: '#A8A39A',
  border: '#29352E',
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DATOS REALES DEL PROYECTO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const PROJECT_DATA = {
  institution: 'Universidad Nacional Rosario Castellanos · Campus Chalco',
  project: 'Proyecto Prototípico: Bombus · El zumbido que nos une',
  period: '2025–2026',
  genre: 'Documental de Divulgación Científica',
  duration: '7 minutos · 9 Secuencias',
  location: 'San Andrés Tlalamac, Tlalmanalco, Estado de México',
  species: 'Bombus ephippiatus',
  economicValue: '$66,320 MDP (anuales)',
  priceDifferential: '+45%',
  threat: 'Neonicotinoides (Imidacloprid, Tiametoxam)',
};

const ACTS = {
  asombro: {
    name: 'Acto 1: Asombro',
    description: 'La majestuosidad del Bombus polinizando en condiciones extremas',
    color: '#BC955C',
    hue: 0.08,
  },
  urgencia: {
    name: 'Acto 2: Urgencia',
    description: 'Crisis silenciosa: paisaje degradado y pérdida de biodiversidad',
    color: '#9F2241',
    hue: 0.95,
  },
  esperanza: {
    name: 'Acto 3: Esperanza',
    description: 'Soluciones comunitarias: transición agroecológica en Tlalmanalco',
    color: '#58A65D',
    hue: 0.35,
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PARTICLE SYSTEM (Enjambre de Polinizadores)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface ParticleSystemProps {
  count: number;
  currentAct: keyof typeof ACTS;
  triggerBloom: boolean;
  health: number;
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({
  count,
  currentAct,
  triggerBloom,
  health,
}) => {
  const meshRef = React.useRef<THREE.InstancedMesh>(null);
  const bloomTimeRef = React.useRef(0);

  // Precalcular fases
  const phases = React.useMemo(() => {
    const arr = new Float32Array(count);
    for (let i = 0; i < count; i++) arr[i] = Math.random();
    return arr;
  }, [count]);

  React.useLayoutEffect(() => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
      const r = Math.cbrt(Math.random()) * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      dummy.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );

      const s = 0.015 + Math.random() * 0.025;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    meshRef.current.geometry.setAttribute(
      'aPhase',
      new THREE.InstancedBufferAttribute(phases, 1)
    );
  }, [count, phases]);

  useFrame(({ clock }, delta) => {
    if (!meshRef.current) return;

    const time = clock.getElapsedTime();

    // Animar bloom
    if (triggerBloom) {
      bloomTimeRef.current = 1.2;
    }
    bloomTimeRef.current = Math.max(0, bloomTimeRef.current - delta);

    // Rotación del enjambre
    meshRef.current.rotation.z += 0.0005;

    // Actualizar matrices de partículas dinámicamente
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const phase = phases[i];
      const timeOffset = time + phase * Math.PI * 2;

      // Radio expansivo según el acto
      let baseRadius = 5;
      if (currentAct === 'asombro') baseRadius = 5;
      if (currentAct === 'urgencia') baseRadius = 3.5; // Comprimido
      if (currentAct === 'esperanza') baseRadius = 6; // Expandido

      // Bloom effect
      const bloomFactor = Math.exp(-bloomTimeRef.current * 2) * 2;
      const actualRadius = baseRadius + bloomFactor;

      // Posición helicoidalconmovimiento oscilante
      const r = actualRadius * Math.sin((i / count) * Math.PI);
      const theta = timeOffset + (i / count) * Math.PI * 2;
      const y = Math.cos(timeOffset * 0.3 + i * 0.01) * 2;

      dummy.position.set(
        r * Math.cos(theta),
        y,
        r * Math.sin(theta)
      );

      // Escala según salud
      const s = (0.015 + Math.random() * 0.025) * (0.5 + health / 200);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  const actColor = ACTS[currentAct];

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={actColor.color}
        emissive={actColor.color}
        emissiveIntensity={0.5 + (health / 100) * 0.5}
        metalness={0.3}
        roughness={0.4}
      />
    </instancedMesh>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BUMBLEBEE 3D MODEL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface BumblebeeProps {
  health: number;
}

const Bumblebee: React.FC<BumblebeeProps> = ({ health }) => {
  const groupRef = React.useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/bombus.glb');

  const clonedScene = React.useMemo(() => {
    if (!scene) return null;
    const cloned = scene.clone();

    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: 0xbc955c,
          emissive: 0xbc955c,
          emissiveIntensity: 0.3 + (health / 100) * 0.7,
          metalness: 0.4,
          roughness: 0.5,
        });
      }
    });

    return cloned;
  }, [scene, health]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const time = clock.getElapsedTime();

    groupRef.current.rotation.y += 0.005;
    groupRef.current.rotation.z = Math.sin(time * 1.3) * 0.12;
    groupRef.current.position.y = Math.sin(time * 0.5) * 0.3;
  });

  return (
    <group ref={groupRef} position={[0, 1.2, 0]}>
      {clonedScene && <primitive object={clonedScene} scale={health / 100 + 0.5} />}
    </group>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3D SCENE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface SceneProps {
  currentAct: keyof typeof ACTS;
  triggerBloom: boolean;
  health: number;
}

const Scene: React.FC<SceneProps> = ({ currentAct, triggerBloom, health }) => {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 6], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={[COLORS.bg]} />
        <fog attach="fog" args={[COLORS.bg, 8, 20]} />

        <ambientLight intensity={0.6} />
        <pointLight position={[5, 4, 8]} intensity={2} color={COLORS.gold} />
        <pointLight position={[-6, 3, -4]} intensity={1.5} color={COLORS.goldDim} />
        <pointLight position={[3, -2, 5]} intensity={1} color="#F5DEB3" />

        <ParticleSystem count={3500} currentAct={currentAct} triggerBloom={triggerBloom} health={health} />
        <Bumblebee health={health} />
      </Canvas>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN APP
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const App: React.FC = () => {
  const [currentAct, setCurrentAct] = useState<keyof typeof ACTS>('asombro');
  const [health, setHealth] = useState(42);
  const [triggerBloom, setTriggerBloom] = useState(false);
  const oscillatorRef = React.useRef<Tone.Oscillator | null>(null);
  const gainRef = React.useRef<Tone.Gain | null>(null);

  // Audio Setup
  useEffect(() => {
    const gain = new Tone.Gain(0).toDestination();
    const osc = new Tone.Oscillator({
      frequency: 400,
      type: 'sawtooth',
    }).connect(gain);

    gainRef.current = gain;
    oscillatorRef.current = osc;

    const unlockAudio = async () => {
      await Tone.start();
      osc.start();
    };

    document.addEventListener('mousedown', unlockAudio, { once: true });
    return () => {
      document.removeEventListener('mousedown', unlockAudio);
      osc.dispose();
      gain.dispose();
    };
  }, []);

  // Mouse interaction
  useEffect(() => {
    const handleMouseDown = () => {
      if (gainRef.current) gainRef.current.gain.rampTo(0.3, 0.08);
    };

    const handleMouseUp = () => {
      if (gainRef.current) gainRef.current.gain.rampTo(0, 0.08);
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleActChange = (act: keyof typeof ACTS) => {
    setCurrentAct(act);
  };

  const handleSembraFlora = () => {
    setHealth(Math.min(100, health + 12));
    setTriggerBloom(true);
    setTimeout(() => setTriggerBloom(false), 1200);
  };

  const handleReduceChemicals = () => {
    setHealth(Math.min(100, health + 15));
    setTriggerBloom(true);
    setTimeout(() => setTriggerBloom(false), 1200);
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: COLORS.bg, color: COLORS.text }}>
      <Scene currentAct={currentAct} triggerBloom={triggerBloom} health={health} />

      {/* HEADER */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          padding: '1.5rem',
          textAlign: 'center',
          background: 'rgba(13, 21, 16, 0.9)',
          borderBottom: `1px solid ${COLORS.border}`,
          pointerEvents: 'auto',
        }}
      >
        <p style={{ margin: '0.25rem 0', fontSize: '11px', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {PROJECT_DATA.institution}
        </p>
        <h1 style={{ margin: '0.5rem 0', fontSize: '28px', fontWeight: 700, color: COLORS.gold }}>
          {PROJECT_DATA.project}
        </h1>
        <p style={{ margin: 0, fontSize: '12px', color: COLORS.textMuted }}>
          {PROJECT_DATA.period} · {PROJECT_DATA.genre}
        </p>
      </div>

      {/* LEFT PANEL - NARRATIVE ACTS */}
      <div
        style={{
          position: 'fixed',
          left: '1.5rem',
          top: '12rem',
          zIndex: 10,
          width: '280px',
          pointerEvents: 'auto',
        }}
      >
        <p style={{ fontSize: '10px', textTransform: 'uppercase', color: COLORS.textMuted, marginBottom: '0.75rem', letterSpacing: '0.1em' }}>
          Estructura Narrativa
        </p>
        {Object.entries(ACTS).map(([key, act]) => (
          <button
            key={key}
            onClick={() => handleActChange(key as keyof typeof ACTS)}
            style={{
              width: '100%',
              padding: '0.75rem',
              marginBottom: '0.5rem',
              background: currentAct === key ? act.color : COLORS.bg,
              color: currentAct === key ? '#000' : COLORS.text,
              border: `1px solid ${act.color}`,
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              transition: 'all 0.2s',
            }}
          >
            {act.name}
          </button>
        ))}
        <p style={{ fontSize: '11px', color: COLORS.textMuted, marginTop: '1rem', lineHeight: 1.6 }}>
          {ACTS[currentAct].description}
        </p>
      </div>

      {/* RIGHT PANEL - HEALTH & ACTIONS */}
      <div
        style={{
          position: 'fixed',
          right: '1.5rem',
          top: '12rem',
          zIndex: 10,
          width: '280px',
          pointerEvents: 'auto',
        }}
      >
        <p style={{ fontSize: '10px', textTransform: 'uppercase', color: COLORS.textMuted, marginBottom: '0.75rem', letterSpacing: '0.1em' }}>
          Indicador de Mitigación
        </p>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '11px' }}>Salud del Ecosistema</span>
            <span style={{ fontSize: '11px', color: COLORS.greenBright, fontWeight: 'bold' }}>{health}%</span>
          </div>
          <div
            style={{
              width: '100%',
              height: '8px',
              background: `rgba(88, 166, 93, 0.2)`,
              borderRadius: '4px',
              overflow: 'hidden',
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${health}%`,
                background: `linear-gradient(90deg, ${COLORS.green}, ${COLORS.greenBright})`,
                transition: 'width 0.5s ease-out',
              }}
            />
          </div>
        </div>

        <button
          onClick={handleSembraFlora}
          style={{
            width: '100%',
            padding: '0.625rem',
            marginBottom: '0.5rem',
            background: COLORS.greenBright,
            color: '#000',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600,
            transition: 'all 0.2s',
          }}
        >
          Sembrar Flora Nativa (+12%)
        </button>

        <button
          onClick={handleReduceChemicals}
          style={{
            width: '100%',
            padding: '0.625rem',
            background: COLORS.gold,
            color: '#000',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600,
            transition: 'all 0.2s',
          }}
        >
          Reducir Agroquímicos (+15%)
        </button>
      </div>

      {/* BOTTOM LEFT - TECHNICAL INFO */}
      <div
        style={{
          position: 'fixed',
          left: '1.5rem',
          bottom: '1.5rem',
          zIndex: 10,
          width: '280px',
          background: `rgba(13, 21, 16, 0.95)`,
          border: `1px solid ${COLORS.border}`,
          borderRadius: '8px',
          padding: '1rem',
          pointerEvents: 'auto',
        }}
      >
        <p style={{ fontSize: '10px', textTransform: 'uppercase', color: COLORS.gold, marginBottom: '0.5rem', letterSpacing: '0.1em' }}>
          Ficha Técnica
        </p>
        <div style={{ fontSize: '11px', color: COLORS.textMuted, lineHeight: 1.8 }}>
          <p style={{ margin: '0.25rem 0' }}>
            <strong>Género:</strong> {PROJECT_DATA.genre}
          </p>
          <p style={{ margin: '0.25rem 0' }}>
            <strong>Duración:</strong> {PROJECT_DATA.duration}
          </p>
          <p style={{ margin: '0.25rem 0' }}>
            <strong>Locación:</strong> {PROJECT_DATA.location}
          </p>
          <p style={{ margin: '0.25rem 0' }}>
            <strong>Especie:</strong> <em>{PROJECT_DATA.species}</em>
          </p>
        </div>
      </div>

      {/* BOTTOM RIGHT - ECONOMIC METRICS */}
      <div
        style={{
          position: 'fixed',
          right: '1.5rem',
          bottom: '1.5rem',
          zIndex: 10,
          width: '280px',
          pointerEvents: 'auto',
        }}
      >
        <p style={{ fontSize: '10px', textTransform: 'uppercase', color: COLORS.gold, marginBottom: '0.75rem', letterSpacing: '0.1em' }}>
          Métricas de Impacto
        </p>

        <div
          style={{
            background: `rgba(13, 21, 16, 0.95)`,
            border: `1px solid ${COLORS.gold}`,
            borderRadius: '8px',
            padding: '0.75rem',
            marginBottom: '0.5rem',
          }}
        >
          <p style={{ fontSize: '10px', color: COLORS.textMuted, margin: 0, marginBottom: '0.25rem' }}>
            Valor de Polinización (Anual)
          </p>
          <p style={{ fontSize: '18px', color: COLORS.gold, fontWeight: 'bold', margin: 0 }}>
            {PROJECT_DATA.economicValue}
          </p>
        </div>

        <div
          style={{
            background: `rgba(13, 21, 16, 0.95)`,
            border: `1px solid ${COLORS.wine}`,
            borderRadius: '8px',
            padding: '0.75rem',
          }}
        >
          <p style={{ fontSize: '10px', color: COLORS.textMuted, margin: 0, marginBottom: '0.25rem' }}>
            Riesgo: Diferencial de Precio
          </p>
          <p style={{ fontSize: '18px', color: COLORS.wine, fontWeight: 'bold', margin: 0 }}>
            {PROJECT_DATA.priceDifferential}
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
