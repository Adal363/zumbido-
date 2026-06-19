/**
 * TLALMANAC-X · Main App Component
 * El zumbido que nos une — version MVP Enhanced
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

  // Enhanced mouse/touch interaction with frequency modulation
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      setUserHolding(true);
      // Frequency varies by horizontal mouse position (150-650 Hz)
      setAudioFrequency(400 + x * 250);
      setAudioGain(0.35);
      setVibrationIntensity(1.0);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const holdingState = useEcosystemStore.getState().isUserHolding;
      if (holdingState) {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        setAudioFrequency(400 + x * 250);
        const y = (e.clientY / window.innerHeight);
        setAudioGain(0.2 + y * 0.4);
      }
    };

    const handleMouseUp = () => setUserHolding(false);

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        setUserHolding(true);
        setAudioFrequency(400 + x * 250);
        setAudioGain(0.35);
        setVibrationIntensity(1.0);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const holdingState = useEcosystemStore.getState().isUserHolding;
      if (holdingState && e.touches.length > 0) {
        const x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        setAudioFrequency(400 + x * 250);
        const y = (e.touches[0].clientY / window.innerHeight);
        setAudioGain(0.2 + y * 0.4);
      }
    };

    const handleTouchEnd = () => setUserHolding(false);

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [setUserHolding, setAudioFrequency, setAudioGain, setVibrationIntensity]);

  // Scroll progress tracking
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
        background: '#0a0e27',
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

        {/* Sección final mejorada */}
        <section
          style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '2rem',
            background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.9) 0%, rgba(15, 10, 50, 0.9) 100%)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Animated gradient background */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.2,
              background: `
                radial-gradient(circle at 30% 30%, rgba(0, 255, 136, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 70% 70%, rgba(255, 0, 150, 0.3) 0%, transparent 50%)
              `,
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative', zIndex: 10 }}>
            <h1
              style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: 'clamp(36px, 7vw, 72px)',
                background: 'linear-gradient(135deg, #00ff88 0%, #ff0096 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '1rem',
                lineHeight: 1.2,
                filter: 'drop-shadow(0 0 20px rgba(0, 255, 136, 0.3))',
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
                textShadow: '0 0 10px rgba(0, 255, 136, 0.2)',
              }}
            >
              Los jicotes de Tlalmanalco todavia están aqui.
              <br />
              Pero necesitan que los cuides.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default App;
