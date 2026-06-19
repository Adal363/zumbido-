/**
 * TLALMANAC-X · Main App Component
 * Orchestrates Scene, Audio, User Input, and State Management
 *
 * @component App
 * @version 1.0.0
 *
 * RESPONSIBILITY:
 * 1. Render Three.js scene (background)
 * 2. Initialize audio engine on first user interaction
 * 3. Listen to mouse/touch events
 * 4. Update Zustand store with frequency/gain/holding state
 * 5. Manage scroll triggers and phase transitions
 *
 * FLOW:
 * User clicks → setUserHolding(true) → audioGain ramps up → particles glow
 * User releases → setUserHolding(false) → audioGain fades out → particles settle
 */

import React, { useEffect } from 'react';
import Scene from './components/Scene';
import { AudioEngine } from './hooks/useAudio';
import { useEcosystemStore } from './store/useEcosystemStore';

/**
 * Hero section overlay (temporary UI for testing)
 * In production, this would be a full narrative experience
 */
const HeroOverlay: React.FC = () => {
  const isUserHolding = useEcosystemStore((s) => s.isUserHolding);
  const audioFreq = useEcosystemStore((s) => s.audioFrequency);
  const audioGain = useEcosystemStore((s) => s.audioGain);
  const healthScore = useEcosystemStore((s) => s.healthScore);

  return (
    <div style={{
      position: 'fixed',
      top: '2rem',
      left: '2rem',
      color: '#E8E3DA',
      fontFamily: '"Space Grotesk", sans-serif',
      fontSize: '14px',
      lineHeight: '1.6',
      pointerEvents: 'none',
      zIndex: 10,
      textShadow: '0 0 10px rgba(157, 0, 255, 0.3)',
    }}>
      <div style={{ color: '#D4A574', fontSize: '24px', fontWeight: 'bold', marginBottom: '1rem' }}>
        El zumbido que nos une
      </div>
      <div style={{ color: '#A8A39A' }}>
        <p>Click y mantén para vibrar</p>
        <p>Frecuencia: <span style={{ color: '#39FF14' }}>{audioFreq.toFixed(0)} Hz</span></p>
        <p>Amplitud: <span style={{ color: '#FF4500' }}>{(audioGain * 100).toFixed(0)}%</span></p>
        <p>Salud ecosistema: <span style={{ color: '#58A65D' }}>{healthScore}%</span></p>
      </div>
    </div>
  );
};

/**
 * CTA Button (Restoration actions)
 * In production, this would be positioned in the restoration phase
 */
const RestorationButtons: React.FC = () => {
  const addAction = useEcosystemStore((s) => s.addRestorationAction);

  const buttons = [
    { label: 'Flores nativas', action: 'native_flowers' as const },
    { label: 'Reducir químicos', action: 'reduce_chemicals' as const },
    { label: 'Conservar bordes', action: 'conserve_borders' as const },
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      zIndex: 10,
    }}>
      {buttons.map((btn) => (
        <button
          key={btn.action}
          onClick={() => addAction(btn.action)}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#58A65D',
            color: '#0D1510',
            border: 'none',
            borderRadius: '99px',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 200ms ease-out',
            boxShadow: '0 0 20px rgba(88, 166, 93, 0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 0 30px rgba(88, 166, 93, 0.6)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 0 20px rgba(88, 166, 93, 0.3)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
};

/**
 * Main App Component
 */
export const App: React.FC = () => {
  // Subscribe to store actions
  const setUserHolding = useEcosystemStore((s) => s.setUserHolding);
  const setAudioFrequency = useEcosystemStore((s) => s.setAudioFrequency);
  const setAudioGain = useEcosystemStore((s) => s.setAudioGain);
  const setVibrationIntensity = useEcosystemStore((s) => s.setVibrationIntensity);
  const setScrollProgress = useEcosystemStore((s) => s.setScrollProgress);

  // ==================== MOUSE/TOUCH EVENTS ====================
  useEffect(() => {
    /**
     * Mouse down: user starts interaction
     * Ramp audio gain up to 0.3 (moderate loudness)
     */
    const handleMouseDown = () => {
      setUserHolding(true);
      setAudioFrequency(400); // Start at 400Hz (Bombus fundamental)
      setAudioGain(0.3); // Moderate volume
      setVibrationIntensity(1.0); // Max particle oscillation
    };

    /**
     * Mouse up: user releases
     * Store handles auto-fade-out (see useEcosystemStore setUserHolding)
     */
    const handleMouseUp = () => {
      setUserHolding(false);
    };

    /**
     * Touch start (mobile support)
     */
    const handleTouchStart = () => {
      setUserHolding(true);
      setAudioFrequency(400);
      setAudioGain(0.3);
      setVibrationIntensity(1.0);
    };

    /**
     * Touch end
     */
    const handleTouchEnd = () => {
      setUserHolding(false);
    };

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

  // ==================== SCROLL TRACKING ====================
  useEffect(() => {
    /**
     * Track scroll progress for phase transitions
     * 0 = hero, 0.5 = data layer, 1.0 = finale
     *
     * In production, use GSAP ScrollTrigger for more granular control
     */
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = scrollHeight ? window.scrollY / scrollHeight : 0;
      setScrollProgress(scrollProgress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setScrollProgress]);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      background: '#050505',
      fontFamily: '"Inter", sans-serif',
    }}>
      {/* Three.js Scene (background) */}
      <Scene />

      {/* Audio Engine (silent, manages Web Audio API) */}
      <AudioEngine />

      {/* UI Overlays */}
      <HeroOverlay />
      <RestorationButtons />

      {/* Page Content (scrollable, narrative sections) */}
      <div style={{
        position: 'relative',
        zIndex: 5,
        color: '#E8E3DA',
      }}>
        {/* SEC 1: HERO */}
        <section style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '2rem',
        }}>
          <div>
            <h1 style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: '72px',
              color: '#D4A574',
              marginBottom: '1rem',
              lineHeight: '1.2',
            }}>
              El zumbido que nos une
            </h1>
            <p style={{
              fontSize: '18px',
              color: '#A8A39A',
              maxWidth: '600px',
              margin: '0 auto',
            }}>
              Los pequeños polinizadores que sostienen la vida en Tlalmanalco.
              Una historia de ciencia, territorio y esperanza.
            </p>
          </div>
        </section>

        {/* SEC 2: DATA LAYER */}
        <section style={{
          height: 'auto',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}>
          <div style={{ maxWidth: '900px' }}>
            <h2 style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: '48px',
              color: '#D4A574',
              marginBottom: '2rem',
            }}>
              ¿Por qué importa?
            </h2>
            <p style={{ fontSize: '16px', lineHeight: '1.8', marginBottom: '2rem' }}>
              El abejorro <em>Bombus</em> realiza la polinización sónica del jitomate.
              Vibra a frecuencias específicas que liberan el polen que ningún otro insecto puede alcanzar.
              Sin ellos, la diferencia en cosecha puede ser hasta del <strong style={{ color: '#D4A574' }}>50%</strong>.
            </p>

            {/* YOUTUBE VIDEO */}
            <div style={{
              position: 'relative',
              paddingBottom: '56.25%',
              height: 0,
              overflow: 'hidden',
              marginBottom: '2rem',
              borderRadius: '12px',
              boxShadow: '0 0 30px rgba(157, 0, 255, 0.2)',
            }}>
              <iframe
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  borderRadius: '12px',
                }}
                src="https://www.youtube.com/embed/KzfvXq6gepE"
                title="Documental Bombus"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1.5rem',
              marginTop: '2rem',
            }}>
              {[
                { label: 'Valor de polinización', value: '66,320', unit: 'MDP anuales' },
                { label: 'Diferencial de precio', value: '45%', unit: 'con Bombus' },
                { label: 'Cultivos dependientes', value: '73%', unit: 'global' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    border: '1px solid #29352E',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '12px', color: '#A8A39A', marginBottom: '0.5rem' }}>
                    {stat.label.toUpperCase()}
                  </div>
                  <div style={{
                    fontSize: '40px',
                    fontWeight: '700',
                    color: '#D4A574',
                    marginBottom: '0.5rem',
                  }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '12px', color: '#A8A39A' }}>
                    {stat.unit}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SEC 3: RESTORATION */}
        <section style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}>
          <div style={{ maxWidth: '900px', textAlign: 'center' }}>
            <h2 style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: '48px',
              color: '#D4A574',
              marginBottom: '2rem',
            }}>
              Lo que podemos hacer
            </h2>
            <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
              El <em>Bombus</em> de Tlalmanalco existe, trabaja y <strong>puede recuperarse</strong> —
              si le damos las condiciones adecuadas.
            </p>
          </div>
        </section>

        {/* SEC 4: FINALE */}
        <section style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '2rem',
          background: '#0D1510',
        }}>
          <div>
            <h1 style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: '72px',
              color: '#D4A574',
              marginBottom: '1rem',
            }}>
              Cuida el zumbido
            </h1>
            <p style={{
              fontSize: '18px',
              color: '#A8A39A',
              maxWidth: '600px',
              margin: '0 auto',
            }}>
              Los jicotes de Tlalmanalco todavía están aquí.
              Pero necesitan que los cuides.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default App;
