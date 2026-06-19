/**
 * TLALMANAC-X · Main App Component
 * El zumbido que nos une — version MVP
 */

import React, { useEffect } from 'react';
import Scene from './components/Scene';
import { AudioEngine } from './hooks/useAudio';
import { useEcosystemStore } from './store/useEcosystemStore';
import HeroSection from './components/sections/HeroSection';
import DataSection from './components/sections/DataSection';
import ThreatSection from './components/sections/ThreatSection';
import RestorationSection from './components/sections/RestorationSection';

export const App: React.FC = () => {
  const setUserHolding = useEcosystemStore((s) => s.setUserHolding);
  const setAudioFrequency = useEcosystemStore((s) => s.setAudioFrequency);
  const setAudioGain = useEcosystemStore((s) => s.setAudioGain);
  const setVibrationIntensity = useEcosystemStore((s) => s.setVibrationIntensity);
  const setScrollProgress = useEcosystemStore((s) => s.setScrollProgress);

  // Eventos de interaccion (mouse / touch activan el audio y las particulas)
  useEffect(() => {
    const handleMouseDown = () => {
      setUserHolding(true);
      setAudioFrequency(400);
      setAudioGain(0.3);
      setVibrationIntensity(1.0);
    };
    const handleMouseUp = () => setUserHolding(false);
    const handleTouchStart = () => {
      setUserHolding(true);
      setAudioFrequency(400);
      setAudioGain(0.3);
      setVibrationIntensity(1.0);
    };
    const handleTouchEnd = () => setUserHolding(false);

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [setUserHolding, setAudioFrequency, setAudioGain, setVibrationIntensity]);

  // Scroll progress → store (conecta el 3D con el scroll)
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight ? window.scrollY / scrollHeight : 0;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setScrollProgress]);

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        margin: 0,
        padding: 0,
        overflowX: 'hidden',
        background: '#050505',
        fontFamily: '"Inter", sans-serif',
      }}
    >
      {/* Canvas Three.js fijo en el fondo */}
      <Scene />

      {/* Motor de audio (invisible) */}
      <AudioEngine />

      {/* Secciones narrativas con scroll */}
      <div style={{ position: 'relative', zIndex: 5, color: '#E8E3DA' }}>
        <HeroSection />
        <DataSection />
        <ThreatSection />
        <RestorationSection />

        {/* Seccion finale */}
        <section
          style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '2rem',
            background: 'rgba(13, 21, 16, 0.6)',
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: 'clamp(36px, 7vw, 72px)',
                color: '#D4A574',
                marginBottom: '1rem',
                lineHeight: 1.2,
              }}
            >
              Cuida el zumbido
            </h1>
            <p
              style={{
                fontSize: 'clamp(15px, 2vw, 18px)',
                color: '#A8A39A',
                maxWidth: '560px',
                margin: '0 auto',
                lineHeight: '1.7',
              }}
            >
              Los jicotes de Tlalmanalco todavia estan aqui.
              Pero necesitan que los cuides.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default App;
